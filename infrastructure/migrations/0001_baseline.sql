BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE datafinops_mode AS ENUM ('SANDBOX','DEVNET','LIVE_READ','LIVE_WRITE');

CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES organizations(id),
  name text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(organization_id,name)
);
CREATE TABLE environments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES organizations(id),
  workspace_id uuid NOT NULL REFERENCES workspaces(id), name text NOT NULL, mode datafinops_mode NOT NULL,
  live_write_enabled boolean NOT NULL DEFAULT false, region text NOT NULL DEFAULT 'local',
  created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(workspace_id,name,mode),
  CHECK (mode = 'LIVE_WRITE' OR live_write_enabled = false)
);
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES organizations(id),
  subject_ref text NOT NULL, mfa_verified boolean NOT NULL DEFAULT false, status text NOT NULL DEFAULT 'ACTIVE',
  created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(organization_id,subject_ref)
);
CREATE TABLE roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES organizations(id),
  name text NOT NULL, scopes jsonb NOT NULL DEFAULT '[]', created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(organization_id,name)
);
CREATE TABLE memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES organizations(id),
  workspace_id uuid NOT NULL REFERENCES workspaces(id), user_id uuid NOT NULL REFERENCES users(id),
  role_id uuid NOT NULL REFERENCES roles(id), created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(workspace_id,user_id,role_id)
);
CREATE TABLE service_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES organizations(id),
  workspace_id uuid NOT NULL REFERENCES workspaces(id), subject_ref text NOT NULL, scopes jsonb NOT NULL DEFAULT '[]',
  disabled_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(workspace_id,subject_ref)
);

CREATE TABLE txline_connection_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, version integer NOT NULL CHECK(version>0), mode datafinops_mode NOT NULL,
  network text NOT NULL, program_id text NOT NULL, api_host text NOT NULL, public_wallet_ref text NOT NULL,
  read_credential_ref text, status text NOT NULL, canonical_hash char(64) NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(workspace_id,environment_id,version), UNIQUE(canonical_hash)
);
CREATE TABLE pricing_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, source_version text NOT NULL, observed_at timestamptz NOT NULL,
  effective_at timestamptz NOT NULL, freshness text NOT NULL, content_hash char(64) NOT NULL UNIQUE
);
CREATE TABLE pricing_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), pricing_snapshot_id uuid NOT NULL REFERENCES pricing_snapshots(id),
  external_ref text NOT NULL, tier text NOT NULL, leagues jsonb NOT NULL, latency_class text NOT NULL,
  currency varchar(8) NOT NULL, minor_units numeric(39,0) NOT NULL, effective_start timestamptz NOT NULL,
  effective_end timestamptz NOT NULL, UNIQUE(pricing_snapshot_id,external_ref), CHECK(effective_end>effective_start)
);
CREATE TABLE subscription_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, external_ref text NOT NULL, version integer NOT NULL CHECK(version>0),
  selected_items jsonb NOT NULL, state text NOT NULL, period_start timestamptz NOT NULL, period_end timestamptz NOT NULL,
  currency varchar(8) NOT NULL, minor_units numeric(39,0) NOT NULL, source_hash char(64) NOT NULL,
  observed_at timestamptz NOT NULL, UNIQUE(workspace_id,environment_id,external_ref,version)
);
CREATE TABLE entitlement_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, proposal_id uuid, status text NOT NULL, coverage jsonb NOT NULL,
  latency_class text, reason_codes jsonb NOT NULL DEFAULT '[]', verifier_version text NOT NULL,
  evidence_hash char(64) NOT NULL, checked_at timestamptz NOT NULL, UNIQUE(environment_id,evidence_hash)
);
CREATE TABLE fixture_schedule_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, source_version text NOT NULL, fixtures jsonb NOT NULL,
  content_hash char(64) NOT NULL UNIQUE, observed_at timestamptz NOT NULL
);

CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, external_ref text NOT NULL, name text NOT NULL, status text NOT NULL DEFAULT 'ACTIVE',
  UNIQUE(workspace_id,environment_id,external_ref)
);
CREATE TABLE cost_centers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, external_ref text NOT NULL, name text NOT NULL, currency varchar(8) NOT NULL,
  UNIQUE(workspace_id,environment_id,external_ref)
);
CREATE TABLE usage_imports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, idempotency_key text NOT NULL, schema_version text NOT NULL,
  period_start timestamptz NOT NULL, period_end timestamptz NOT NULL, state text NOT NULL,
  quality numeric(6,5) NOT NULL CHECK(quality BETWEEN 0 AND 1), source_hash char(64) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(workspace_id,environment_id,idempotency_key)
);
CREATE TABLE usage_aggregates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), usage_import_id uuid NOT NULL REFERENCES usage_imports(id),
  dimensions jsonb NOT NULL, quantity numeric(39,0) NOT NULL, row_hash char(64) NOT NULL,
  UNIQUE(usage_import_id,row_hash)
);
CREATE TABLE revenue_imports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, idempotency_key text NOT NULL, period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL, source_hash char(64) NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(workspace_id,environment_id,idempotency_key)
);
CREATE TABLE revenue_aggregates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), revenue_import_id uuid NOT NULL REFERENCES revenue_imports(id),
  dimensions jsonb NOT NULL, currency varchar(8) NOT NULL, minor_units numeric(39,0) NOT NULL,
  row_hash char(64) NOT NULL, UNIQUE(revenue_import_id,row_hash)
);
CREATE TABLE allocation_rule_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, version integer NOT NULL CHECK(version>0), rules jsonb NOT NULL,
  canonical_hash char(64) NOT NULL UNIQUE, effective_at timestamptz NOT NULL
);
CREATE TABLE allocation_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, rule_version_id uuid NOT NULL REFERENCES allocation_rule_versions(id),
  input_hash char(64) NOT NULL, results jsonb NOT NULL, currency varchar(8) NOT NULL,
  imported_minor_units numeric(39,0) NOT NULL, allocated_minor_units numeric(39,0) NOT NULL,
  unallocated_minor_units numeric(39,0) NOT NULL,
  CHECK(imported_minor_units=allocated_minor_units+unallocated_minor_units)
);
CREATE TABLE requirement_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, version integer NOT NULL CHECK(version>0), period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL, requirements jsonb NOT NULL, canonical_hash char(64) NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE optimization_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, mode datafinops_mode NOT NULL, manifest jsonb NOT NULL,
  optimizer_version text NOT NULL, canonical_hash char(64) NOT NULL UNIQUE, created_at timestamptz NOT NULL
);
CREATE TABLE optimization_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, snapshot_id uuid NOT NULL REFERENCES optimization_snapshots(id),
  operation_key text NOT NULL, state text NOT NULL, objective text NOT NULL, output_hash char(64),
  created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(workspace_id,environment_id,operation_key)
);
CREATE TABLE candidate_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, run_id uuid NOT NULL REFERENCES optimization_runs(id), rank integer,
  configuration jsonb NOT NULL, currency varchar(8) NOT NULL, minor_units numeric(39,0) NOT NULL,
  verifier_status text NOT NULL, canonical_hash char(64) NOT NULL UNIQUE
);
CREATE TABLE constraint_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, candidate_id uuid NOT NULL REFERENCES candidate_configurations(id),
  requirement_ref text NOT NULL, outcome text NOT NULL, reason_code text NOT NULL, evidence jsonb NOT NULL
);
CREATE TABLE recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, run_id uuid NOT NULL REFERENCES optimization_runs(id), candidate_id uuid,
  state text NOT NULL, facts jsonb NOT NULL, canonical_hash char(64) NOT NULL UNIQUE
);
CREATE TABLE policy_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, version integer NOT NULL CHECK(version>0), policy jsonb NOT NULL,
  canonical_hash char(64) NOT NULL UNIQUE, effective_at timestamptz NOT NULL
);
CREATE TABLE proposal_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, recommendation_id uuid REFERENCES recommendations(id), version integer NOT NULL,
  proposal_hash char(64) NOT NULL UNIQUE, material_hash char(64) NOT NULL, state text NOT NULL,
  expires_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, proposal_hash char(64) NOT NULL, actor_ref text NOT NULL, role text NOT NULL,
  decision text NOT NULL, rationale text, authority_snapshot jsonb NOT NULL DEFAULT '{}', decided_at timestamptz NOT NULL
);
CREATE TABLE signing_envelopes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, proposal_id uuid NOT NULL REFERENCES proposal_versions(id), operation_key text NOT NULL,
  envelope jsonb NOT NULL, human_summary_hash char(64) NOT NULL, expires_at timestamptz NOT NULL,
  UNIQUE(workspace_id,environment_id,operation_key)
);
CREATE TABLE transaction_observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, proposal_id uuid NOT NULL, operation_key text NOT NULL,
  public_transaction_hash text, state text NOT NULL, receipt_hash char(64), observed_at timestamptz NOT NULL,
  UNIQUE(workspace_id,environment_id,operation_key)
);
CREATE TABLE activation_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, proposal_id uuid NOT NULL, operation_key text NOT NULL, attempt_number integer NOT NULL,
  state text NOT NULL, request_hash char(64), response_hash char(64), created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(workspace_id,environment_id,operation_key)
);
CREATE TABLE verification_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, proposal_id uuid NOT NULL, status text NOT NULL, reason_codes jsonb NOT NULL,
  verifier_version text NOT NULL, evidence_hash char(64) NOT NULL, verified_at timestamptz NOT NULL
);

CREATE TABLE savings_baseline_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, version integer NOT NULL, currency varchar(8) NOT NULL,
  minor_units numeric(39,0) NOT NULL, method jsonb NOT NULL, canonical_hash char(64) NOT NULL UNIQUE,
  approved_at timestamptz NOT NULL
);
CREATE TABLE savings_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, period_start timestamptz NOT NULL, period_end timestamptz NOT NULL,
  state text NOT NULL, complete_watermark timestamptz, operation_key text NOT NULL,
  UNIQUE(workspace_id,environment_id,operation_key)
);
CREATE TABLE savings_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, period_id uuid REFERENCES savings_periods(id), entry_type text NOT NULL,
  currency varchar(8) NOT NULL, minor_units numeric(39,0) NOT NULL, evidence_hash char(64) NOT NULL,
  source_entry_id uuid, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE finance_exports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, period_id uuid REFERENCES savings_periods(id), format text NOT NULL,
  content_hash char(64) NOT NULL, object_ref text NOT NULL, expires_at timestamptz NOT NULL
);
CREATE TABLE renewals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, subscription_ref text NOT NULL, renew_at timestamptz NOT NULL,
  risk text, state text NOT NULL
);
CREATE TABLE incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, severity text NOT NULL, invariant text NOT NULL, state text NOT NULL,
  evidence_hash char(64), opened_at timestamptz NOT NULL DEFAULT now(), closed_at timestamptz
);
CREATE TABLE webhook_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, event_id uuid NOT NULL, destination_ref text NOT NULL, attempt integer NOT NULL,
  state text NOT NULL, request_hash char(64) NOT NULL, response_code integer, created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(event_id,destination_ref,attempt)
);
CREATE TABLE audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, actor_ref text NOT NULL, action text NOT NULL, purpose text NOT NULL,
  resource_ref text, event_hash char(64) NOT NULL UNIQUE, occurred_at timestamptz NOT NULL
);
CREATE TABLE evidence_bundles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, content_hash char(64) NOT NULL, object_ref text NOT NULL,
  media_type text NOT NULL, size_bytes bigint NOT NULL CHECK(size_bytes>=0), retention_until timestamptz,
  UNIQUE(workspace_id,environment_id,content_hash)
);
CREATE TABLE usage_meters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, meter text NOT NULL, quantity numeric(39,0) NOT NULL,
  period_start timestamptz NOT NULL, period_end timestamptz NOT NULL, event_hash char(64) NOT NULL UNIQUE
);
CREATE TABLE outbox_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, operation_key text NOT NULL, event_type text NOT NULL, payload jsonb NOT NULL,
  payload_hash char(64) NOT NULL, occurred_at timestamptz NOT NULL, UNIQUE(workspace_id,environment_id,operation_key,event_type)
);
CREATE TABLE idempotent_operations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, operation_key text NOT NULL, result_json jsonb NOT NULL,
  result_hash char(64) NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(workspace_id,environment_id,operation_key)
);
CREATE TABLE consumed_operations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, workspace_id uuid NOT NULL,
  environment_id uuid NOT NULL, consumer text NOT NULL, operation_key text NOT NULL, result_hash char(64) NOT NULL,
  consumed_at timestamptz NOT NULL DEFAULT now(), UNIQUE(workspace_id,environment_id,consumer,operation_key)
);

CREATE FUNCTION reject_append_only_change() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'append-only table cannot be updated or deleted'; END $$;
CREATE TRIGGER approvals_append_only BEFORE UPDATE OR DELETE ON approvals FOR EACH ROW EXECUTE FUNCTION reject_append_only_change();
CREATE TRIGGER audit_events_append_only BEFORE UPDATE OR DELETE ON audit_events FOR EACH ROW EXECUTE FUNCTION reject_append_only_change();
CREATE TRIGGER savings_entries_append_only BEFORE UPDATE OR DELETE ON savings_entries FOR EACH ROW EXECUTE FUNCTION reject_append_only_change();
CREATE TRIGGER outbox_events_append_only BEFORE UPDATE OR DELETE ON outbox_events FOR EACH ROW EXECUTE FUNCTION reject_append_only_change();

CREATE INDEX pricing_snapshots_scope_time ON pricing_snapshots(workspace_id,environment_id,observed_at DESC);
CREATE INDEX proposals_scope_state ON proposal_versions(workspace_id,environment_id,state,expires_at);
CREATE INDEX transactions_scope_state ON transaction_observations(workspace_id,environment_id,state,observed_at DESC);
CREATE INDEX audit_scope_time ON audit_events(workspace_id,environment_id,occurred_at DESC);
COMMIT;

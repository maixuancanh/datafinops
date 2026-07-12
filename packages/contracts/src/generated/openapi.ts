// Generated from openapi.yaml sha256:90048a4f9c0678eade3875a4498aa1341980fbb870c039747fb3719d93e1f41d
// Do not edit; run pnpm contracts:generate.

export interface paths {
    "/connections": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create a non-write TxLINE connection configuration */
        post: operations["createTxlineConnection"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/connections/{connectionId}/inventory": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Read the versioned verified subscription and entitlement inventory */
        get: operations["getVerifiedInventory"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/connections/{connectionId}/verify": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Verify network, program, pricing, subscription, activation, and entitlement */
        post: operations["verifyTxlineConnection"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/entitlements/{proposalId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Read verified effective entitlement or exact mismatch reasons */
        get: operations["getProposalEntitlement"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/entitlements/{proposalId}/verify": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Start full transaction, activation, and entitlement verification */
        post: operations["verifyProposalEntitlement"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/imports/usage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Import tenant-owned aggregate usage idempotently */
        post: operations["importUsageAggregates"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/operations/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Read tenant-safe source, verifier, and live-write health */
        get: operations["getOperationsHealth"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/optimization-runs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Freeze an input snapshot and start deterministic optimization */
        post: operations["startOptimization"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/optimization-runs/{runId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Read a snapshot identity and verified optimization result */
        get: operations["getOptimizationRun"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/optimization-runs/{runId}/replay": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Replay an optimization run from its immutable snapshot */
        post: operations["replayOptimizationRun"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/proposals": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create a policy-evaluated proposal from a verified candidate */
        post: operations["createProposal"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/proposals/{proposalId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Read an exact proposal, policy result, approval graph, and expiry */
        get: operations["getProposal"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/proposals/{proposalId}/approvals": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Record an authorized append-only proposal decision */
        post: operations["recordApproval"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/proposals/{proposalId}/signing-envelope": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create an approved unsigned and expiring transaction envelope */
        post: operations["createUnsignedSigningEnvelope"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/requirements": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create an immutable hard and soft requirement version */
        post: operations["createRequirementVersion"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/savings/periods/{periodId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Read append-only savings entries and replay evidence */
        get: operations["getSavingsPeriod"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/savings/periods/{periodId}/close": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Reconcile and close an eligible savings period */
        post: operations["closeSavingsPeriod"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transactions/{operationId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Read public transaction observation and finality state */
        get: operations["getTransactionOperation"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transactions/observe": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Verify and observe a matching signed public transaction */
        post: operations["observeSignedTransaction"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        Approval: {
            actorRef: string;
            /** Format: date-time */
            decidedAt: string;
            /** @enum {string} */
            decision: "APPROVE" | "REJECT";
            /** Format: uuid */
            id: string;
            proposalHash: components["schemas"]["Sha256"];
            role: string;
        };
        Connection: components["schemas"]["ConnectionCreate"] & {
            /** Format: date-time */
            createdAt: string;
            /** Format: uuid */
            id: string;
            /** @enum {string} */
            status: "DRAFT" | "VERIFYING" | "VERIFIED_READ" | "BLOCKED" | "DISABLED";
        };
        ConnectionCreate: {
            /** Format: uri */
            apiHost: string;
            /** @enum {string} */
            mode: "SANDBOX" | "DEVNET" | "LIVE_READ";
            network: string;
            programId: string;
            publicWalletRef: string;
            readCredential?: string;
            /** Format: uuid */
            workspaceId: string;
        };
        EntitlementItem: {
            latencyClass: string;
            leagues: string[];
            /** Format: date-time */
            observedAt: string;
            /** @enum {string} */
            status: "ACTIVE" | "INACTIVE" | "MISMATCH" | "UNKNOWN";
        };
        EntitlementStatus: {
            /** Format: date-time */
            checkedAt: string;
            /** Format: uuid */
            proposalId: string;
            reasonCodes: string[];
            /** @enum {string} */
            status: "PENDING" | "VERIFIED_ACTIVE" | "ACTIVATION_FAILED" | "ENTITLEMENT_MISMATCH";
        };
        Inventory: {
            /** Format: uuid */
            connectionId: string;
            entitlements: components["schemas"]["EntitlementItem"][];
            /** @enum {string} */
            freshness: "FRESH" | "STALE" | "UNKNOWN";
            /** Format: date-time */
            observedAt: string;
            pricingSnapshotHash: components["schemas"]["Sha256"];
            subscriptions: components["schemas"]["SubscriptionItem"][];
        };
        money: {
            currency: string;
            minorUnits: string;
        };
        Money: {
            currency: string;
            minorUnits: string;
        };
        Operation: {
            /** Format: date-time */
            createdAt: string;
            /** Format: uuid */
            operationId: string;
            /** @enum {string} */
            state: "QUEUED" | "RUNNING" | "COMPLETE" | "FAILED";
        };
        OptimizationResult: {
            conflictSet?: string[];
            optimizerVersion: string;
            recommendation?: components["schemas"]["Recommendation"];
            /** Format: uuid */
            runId: string;
            snapshotHash: components["schemas"]["Sha256"];
            /** @enum {string} */
            state: "QUEUED" | "SOLVING" | "VERIFYING" | "COMPLETE" | "INFEASIBLE" | "FAILED";
            verifierVersion: string;
        };
        Problem: {
            correlationId: string;
            detail?: string;
            reasonCodes?: string[];
            status: number;
            title: string;
            /** Format: uri-reference */
            type: string;
        };
        Proposal: {
            approvalGraph: {
                order: number;
                role: string;
                /** @enum {string} */
                status: "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED";
            }[];
            /** Format: date-time */
            expiresAt: string;
            /** Format: uuid */
            id: string;
            /** @enum {string} */
            policyResult: "ELIGIBLE" | "APPROVAL_REQUIRED" | "BLOCKED";
            proposalHash: components["schemas"]["Sha256"];
            snapshotHash: components["schemas"]["Sha256"];
            /** @enum {string} */
            state: "DRAFT" | "BLOCKED" | "AWAITING_APPROVAL" | "APPROVED" | "READY_TO_SIGN" | "EXPIRED" | "INVALIDATED";
            version: number;
        };
        Recommendation: {
            assumptions?: string[];
            candidateHash: components["schemas"]["Sha256"];
            confidence: number;
            currentCost: components["schemas"]["Money"];
            forecastDelta: components["schemas"]["Money"];
            /** @enum {string} */
            hardConstraints: "PASSED";
            /** Format: uuid */
            id: string;
            proposedCost: components["schemas"]["Money"];
        };
        RequirementSet: {
            /** Format: date-time */
            periodEnd: string;
            /** Format: date-time */
            periodStart: string;
            requirements: {
                /** @enum {string} */
                hardness: "HARD" | "SOFT";
                /** @enum {string} */
                kind: "LEAGUE" | "FIXTURE" | "LATENCY" | "REGION" | "BUDGET" | "EFFECTIVE_DATE" | "BLACKOUT" | "HEADROOM";
                /** @enum {string} */
                operator: "INCLUDE" | "EXCLUDE" | "MAX" | "MIN" | "EQUALS" | "BEFORE" | "AFTER";
                ownerRef: string;
                value: unknown;
            }[];
            /** Format: uuid */
            workspaceId: string;
        };
        SavingsPeriod: {
            currency: string;
            entries: {
                amount: components["schemas"]["Money"];
                /** Format: uuid */
                entryId: string;
                evidenceHash: components["schemas"]["Sha256"];
                /** @enum {string} */
                type: "FORECAST" | "APPROVED" | "PENDING" | "REALIZED" | "DISPUTED" | "REVERSAL";
            }[];
            /** Format: uuid */
            id: string;
            /** @enum {string} */
            state: "OPEN" | "INPUTS_COMPLETE" | "RECONCILING" | "CLOSED" | "DISPUTED";
        };
        sha256: string;
        Sha256: string;
        SubscriptionItem: {
            exactCost: components["schemas"]["Money"];
            externalRef: string;
            latencyClass: string;
            leagues: string[];
            /** Format: date-time */
            periodEnd: string;
            /** Format: date-time */
            periodStart: string;
            tier: string;
        };
        /**
         * DataFinOps Unsigned Transaction Proposal
         * @description An unsigned client-review envelope. Private keys, seed phrases, mnemonics, keystores, passphrases, and server signing instructions are prohibited.
         */
        "transaction-proposal.schema": {
            approvalsDigest: components["schemas"]["sha256"];
            builderVersion: string;
            /** Format: date-time */
            expiresAt: string;
            humanSummary: {
                changes: string[];
                /** Format: date-time */
                effectiveAt: string;
                expiryNotice: string;
                modeLabel: string;
                network: string;
                programId: string;
                publicSigner: string;
                total: components["schemas"]["money"];
            };
            humanSummaryDigest: components["schemas"]["sha256"];
            /** @enum {string} */
            mode: "SANDBOX" | "DEVNET" | "LIVE_WRITE";
            network: string;
            operationKey: string;
            policyVersion: string;
            programId: string;
            proposalHash: components["schemas"]["sha256"];
            /** Format: uuid */
            proposalId: string;
            /** Format: uuid */
            signingEnvelopeId: string;
            snapshotHash: components["schemas"]["sha256"];
            transaction: {
                accounts: {
                    address: string;
                    role: string;
                    writable: boolean;
                }[];
                instructions: {
                    dataDigest: components["schemas"]["sha256"];
                    discriminator: string;
                    programId: string;
                    /** @enum {string} */
                    purpose: "SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION";
                }[];
                publicSigner: string;
                recentBlockReference: string;
                unsignedPayload: string;
                version: string;
            };
            $defs: {
                sha256: string;
                money: {
                    currency: string;
                    minorUnits: string;
                };
            };
        };
        TransactionStatus: {
            network: string;
            /** Format: date-time */
            observedAt: string;
            /** Format: uuid */
            operationId: string;
            programId: string;
            publicTransactionHash?: string;
            /** @enum {string} */
            state: "OBSERVING" | "SUBMITTED" | "CONFIRMED" | "FAILED" | "EXPIRED" | "REPLACED";
        };
        UsageImport: {
            /** Format: date-time */
            periodEnd: string;
            /** Format: date-time */
            periodStart: string;
            rows: {
                endpointClass?: string;
                latencyClass?: string;
                leagueRef: string;
                productRef: string;
                requestCount: number;
            }[];
            /** @constant */
            schemaVersion: "1.0";
            /** Format: uuid */
            workspaceId: string;
        };
        VersionReference: {
            /** Format: date-time */
            createdAt: string;
            hash: components["schemas"]["Sha256"];
            /** Format: uuid */
            id: string;
            version: number;
        };
    };
    responses: {
        /** @description Immutable version, expiry, approval, or idempotency conflict */
        Conflict: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["Problem"];
            };
        };
        /** @description Resource not found or not visible in current tenant */
        NotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["Problem"];
            };
        };
        /** @description Schema, policy, prohibited material, or bound-field validation failed */
        ValidationError: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["Problem"];
            };
        };
    };
    parameters: {
        ConnectionId: string;
        IdempotencyKey: string;
        OperationId: string;
        ProposalId: string;
        RunId: string;
    };
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    createTxlineConnection: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ConnectionCreate"];
            };
        };
        responses: {
            /** @description Connection created in non-write state */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Connection"];
                };
            };
            422: components["responses"]["ValidationError"];
        };
    };
    getVerifiedInventory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                connectionId: components["parameters"]["ConnectionId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Versioned pricing, subscriptions, activation, and entitlement inventory */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Inventory"];
                };
            };
            404: components["responses"]["NotFound"];
        };
    };
    verifyTxlineConnection: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                connectionId: components["parameters"]["ConnectionId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Verification job accepted */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Operation"];
                };
            };
        };
    };
    getProposalEntitlement: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                proposalId: components["parameters"]["ProposalId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Verified effective state or exact mismatch */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EntitlementStatus"];
                };
            };
        };
    };
    verifyProposalEntitlement: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                proposalId: components["parameters"]["ProposalId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Subscription, activation, API entitlement, coverage, and latency verification accepted */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Operation"];
                };
            };
        };
    };
    importUsageAggregates: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UsageImport"];
            };
        };
        responses: {
            /** @description Import accepted idempotently */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Operation"];
                };
            };
            422: components["responses"]["ValidationError"];
        };
    };
    getOperationsHealth: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Tenant-safe source, optimizer, transaction, entitlement, and live-write health */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @enum {string} */
                        liveWrite: "DISABLED" | "ENABLED" | "EMERGENCY_STOP";
                        /** @enum {string} */
                        mode: "SANDBOX" | "DEVNET" | "LIVE_READ" | "LIVE_WRITE";
                        /** @enum {string} */
                        status: "HEALTHY" | "DEGRADED" | "UNAVAILABLE";
                        /** @enum {string} */
                        txlineFreshness: "FRESH" | "STALE" | "UNKNOWN";
                        /** @enum {string} */
                        verifierStatus: "AGREES" | "DISAGREES" | "UNKNOWN";
                    };
                };
            };
        };
    };
    startOptimization: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** Format: uuid */
                    connectionId: string;
                    /** @enum {string} */
                    mode: "ADVISORY" | "EXECUTABLE";
                    /** Format: date-time */
                    periodEnd: string;
                    /** Format: date-time */
                    periodStart: string;
                    /** Format: uuid */
                    requirementVersionId: string;
                };
            };
        };
        responses: {
            /** @description Snapshot and optimization job accepted */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Operation"];
                };
            };
        };
    };
    getOptimizationRun: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                runId: components["parameters"]["RunId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Immutable snapshot identity and run result */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OptimizationResult"];
                };
            };
            404: components["responses"]["NotFound"];
        };
    };
    replayOptimizationRun: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                runId: components["parameters"]["RunId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Deterministic replay accepted */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Operation"];
                };
            };
        };
    };
    createProposal: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    candidateHash: components["schemas"]["Sha256"];
                    /** Format: date-time */
                    effectiveAt: string;
                    /** Format: uuid */
                    recommendationId: string;
                };
            };
        };
        responses: {
            /** @description Proposal version and policy outcome */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Proposal"];
                };
            };
            409: components["responses"]["Conflict"];
        };
    };
    getProposal: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                proposalId: components["parameters"]["ProposalId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Exact proposal, policy, approval graph, and expiry */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Proposal"];
                };
            };
            404: components["responses"]["NotFound"];
        };
    };
    recordApproval: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                proposalId: components["parameters"]["ProposalId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @enum {string} */
                    decision: "APPROVE" | "REJECT";
                    proposalHash: components["schemas"]["Sha256"];
                    rationale: string;
                };
            };
        };
        responses: {
            /** @description Append-only approval decision */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Approval"];
                };
            };
            409: components["responses"]["Conflict"];
        };
    };
    createUnsignedSigningEnvelope: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                proposalId: components["parameters"]["ProposalId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Unsigned, expiring, policy-bound envelope; never contains private signing material */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["transaction-proposal.schema"];
                };
            };
            409: components["responses"]["Conflict"];
        };
    };
    createRequirementVersion: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RequirementSet"];
            };
        };
        responses: {
            /** @description Immutable requirement version */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VersionReference"];
                };
            };
        };
    };
    getSavingsPeriod: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                periodId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Append-only savings entries and replay evidence */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SavingsPeriod"];
                };
            };
        };
    };
    closeSavingsPeriod: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                periodId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Reconciliation and close accepted */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Operation"];
                };
            };
        };
    };
    getTransactionOperation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                operationId: components["parameters"]["OperationId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Transaction observation and finality state */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TransactionStatus"];
                };
            };
        };
    };
    observeSignedTransaction: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @description Signed public transaction bytes or deterministic simulation receipt; never private signing material. */
                    publicTransaction: string;
                    publicTransactionHash: string;
                    /** Format: uuid */
                    signingEnvelopeId: string;
                };
            };
        };
        responses: {
            /** @description Observation accepted once after bound-field verification */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Operation"];
                };
            };
            422: components["responses"]["ValidationError"];
        };
    };
}

export interface EnterpriseIdentity {
  readonly subject: string;
  readonly tenantId: string;
  readonly roles: readonly string[];
  readonly active: boolean;
  readonly retentionDays: number;
}
export function reviewEnterpriseIdentity(identity: EnterpriseIdentity): EnterpriseIdentity {
  if (!identity.subject || !identity.tenantId || identity.retentionDays < 1)
    throw new TypeError('invalid enterprise identity');
  return Object.freeze({ ...identity, roles: Object.freeze([...identity.roles]) });
}

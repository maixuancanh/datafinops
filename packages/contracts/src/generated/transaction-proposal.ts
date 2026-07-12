// Generated from schemas/transaction-proposal.schema.json sha256:33e9ea9dc2516f2c08e2a63eab1283f107b3f2c1015bb501f14c4a26c43387d9
// Do not edit; run pnpm contracts:generate.

export type Sha256 = string

/**
 * An unsigned client-review envelope. Private keys, seed phrases, mnemonics, keystores, passphrases, and server signing instructions are prohibited.
 */
export interface DataFinOpsUnsignedTransactionProposal {
signingEnvelopeId: string
operationKey: string
mode: ("SANDBOX" | "DEVNET" | "LIVE_WRITE")
network: string
programId: string
proposalId: string
proposalHash: Sha256
snapshotHash: Sha256
policyVersion: string
approvalsDigest: Sha256
builderVersion: string
expiresAt: string
transaction: {
version: string
publicSigner: string
/**
 * @minItems 1
 */
accounts: [{
address: string
role: string
writable: boolean
}, ...({
address: string
role: string
writable: boolean
})[]]
/**
 * @minItems 1
 * @maxItems 8
 */
instructions: [{
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}]|[{
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}, {
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}]|[{
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}, {
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}, {
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}]|[{
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}, {
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}, {
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}, {
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}]|[{
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}, {
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}, {
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}, {
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}, {
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}]|[{
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}, {
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}, {
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}, {
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}, {
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}, {
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}]|[{
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}, {
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}, {
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}, {
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}, {
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}, {
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}, {
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}]|[{
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}, {
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}, {
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}, {
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}, {
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}, {
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}, {
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}, {
programId: string
discriminator: string
dataDigest: Sha256
purpose: ("SUBSCRIPTION_CHANGE" | "ENTITLEMENT_ACTIVATION")
}]
recentBlockReference: string
unsignedPayload: string
}
humanSummary: {
modeLabel: string
network: string
programId: string
publicSigner: string
/**
 * @minItems 1
 */
changes: [string, ...(string)[]]
total: Money
effectiveAt: string
expiryNotice: string
}
humanSummaryDigest: Sha256
}
export interface Money {
currency: string
minorUnits: string
}

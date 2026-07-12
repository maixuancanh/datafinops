// Generated from schemas/transaction-proposal.schema.json sha256:3ba13f9449a488459d72c645e703a8999ac3c776d33be76925115bc153a997b4
// Do not edit; run pnpm contracts:generate.

export type Sha256 = string;

/**
 * An unsigned client-review envelope. Private keys, seed phrases, mnemonics, keystores, passphrases, and server signing instructions are prohibited.
 */
export interface DataFinOpsUnsignedTransactionProposal {
  signingEnvelopeId: string;
  operationKey: string;
  mode: 'SANDBOX' | 'DEVNET' | 'LIVE_WRITE';
  network: string;
  programId: string;
  proposalId: string;
  proposalHash: Sha256;
  snapshotHash: Sha256;
  policyVersion: string;
  approvalsDigest: Sha256;
  builderVersion: string;
  expiresAt: string;
  transaction: {
    version: string;
    publicSigner: string;
    /**
     * @minItems 1
     */
    accounts: [
      {
        address: string;
        role: string;
        writable: boolean;
      },
      ...{
        address: string;
        role: string;
        writable: boolean;
      }[],
    ];
    /**
     * @minItems 1
     * @maxItems 8
     */
    instructions:
      | [
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
        ]
      | [
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
        ]
      | [
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
        ]
      | [
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
        ]
      | [
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
        ]
      | [
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
        ]
      | [
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
        ]
      | [
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
          {
            programId: string;
            discriminator: string;
            dataDigest: Sha256;
            purpose: 'SUBSCRIPTION_CHANGE' | 'ENTITLEMENT_ACTIVATION';
          },
        ];
    recentBlockReference: string;
    unsignedPayload: string;
  };
  humanSummary: {
    modeLabel: string;
    network: string;
    programId: string;
    publicSigner: string;
    /**
     * @minItems 1
     */
    changes: [string, ...string[]];
    total: Money;
    effectiveAt: string;
    expiryNotice: string;
  };
  humanSummaryDigest: Sha256;
}
export interface Money {
  currency: string;
  minorUnits: string;
}

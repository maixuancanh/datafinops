export interface DemoSigner {
  readonly publicAccount: string;
  readonly sign: (
    materialHash: string,
  ) => Promise<{ readonly signedMaterialHash: string; readonly simulation: true }>;
}
export function createDemoSigner(publicAccount: string): DemoSigner {
  if (!publicAccount) throw new TypeError('public account required');
  return Object.freeze({
    publicAccount,
    async sign(materialHash: string) {
      return { signedMaterialHash: materialHash, simulation: true as const };
    },
  });
}

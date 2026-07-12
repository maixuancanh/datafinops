export interface SignedFactInput {
  readonly materialHash: string;
  readonly facts: readonly string[];
  readonly ranking: readonly string[];
}
export function rephraseSignedFacts(
  input: SignedFactInput,
  output: {
    readonly materialHash: string;
    readonly ranking: readonly string[];
    readonly text: string;
  },
): { readonly text: string; readonly fallback: boolean } {
  if (
    output.materialHash !== input.materialHash ||
    output.ranking.join('|') !== input.ranking.join('|')
  )
    return { text: input.facts.join('; '), fallback: true };
  return { text: output.text, fallback: false };
}

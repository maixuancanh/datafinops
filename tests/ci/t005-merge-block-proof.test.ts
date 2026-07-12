import { describe, expect, it } from 'vitest';

describe('T005 merge-block proof', () => {
  it('intentionally fails so branch protection can prove merge blocking', () => {
    expect('Required aggregate gate proof branch').toBe('passing branch');
  });
});

import { describe, expect, it } from 'vitest';

describe('T005 merge-block proof in a required CI job', () => {
  it('intentionally fails so Required aggregate gate proves merge blocking', () => {
    expect('required aggregate gate').toBe('passing gate');
  });
});

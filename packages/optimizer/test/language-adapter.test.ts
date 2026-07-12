import { describe, expect, it } from 'vitest';
import { rephraseSignedFacts } from '../src/explanations/optional-language-adapter.js';
describe('optional language adapter', () => { it('falls back on hash or ranking mismatch', () => expect(rephraseSignedFacts({ materialHash: 'h', facts: ['cost=10'], ranking: ['a'] }, { materialHash: 'bad', ranking: ['b'], text: 'wrong' }).fallback).toBe(true)); });

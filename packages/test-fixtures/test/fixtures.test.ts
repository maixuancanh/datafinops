import { describe, expect, it } from 'vitest';

import {
  canonicalHash,
  canonicalJson,
  createDeterministicIdFactory,
  createFixedClock,
  createPortfolio,
  createSeededRandom,
  decimalMoney,
  minorUnitMoney,
} from '../src/index.js';

describe('fixed clock', () => {
  it('returns fresh dates at the configured instant without advancing', () => {
    const clock = createFixedClock('2026-01-15T12:00:00.000Z');

    const first = clock.now();
    first.setUTCFullYear(2030);

    expect(clock.now().toISOString()).toBe('2026-01-15T12:00:00.000Z');
    expect(clock.nowIso()).toBe('2026-01-15T12:00:00.000Z');
  });

  it('rejects ambiguous or invalid timestamps', () => {
    expect(() => createFixedClock('2026-01-15')).toThrow(/UTC ISO/);
    expect(() => createFixedClock('not-a-date')).toThrow(/UTC ISO/);
  });
});

describe('deterministic IDs and seed control', () => {
  it('replays the same namespaced ID sequence from the same seed', () => {
    const first = createDeterministicIdFactory('demo-seed', 'portfolio');
    const replay = createDeterministicIdFactory('demo-seed', 'portfolio');

    expect([first.next(), first.next('price')]).toEqual([replay.next(), replay.next('price')]);
    expect(first.next()).toMatch(/^portfolio_[a-f0-9]{32}$/);
  });

  it('replays pseudo-random values and supports independent forks', () => {
    const first = createSeededRandom('42');
    const replay = createSeededRandom('42');

    expect([first.next(), first.int(2, 9), first.fork('child').next()]).toEqual([
      replay.next(),
      replay.int(2, 9),
      replay.fork('child').next(),
    ]);
  });
});

describe('exact money factories', () => {
  it('creates immutable integer minor-unit money without binary floats', () => {
    const money = minorUnitMoney('usd', 12_345n);

    expect(money).toEqual({ representation: 'minor-unit', currency: 'USD', minorUnits: 12_345n });
    expect(Object.isFrozen(money)).toBe(true);
    expect(() => minorUnitMoney('USD', 1.2 as unknown as bigint)).toThrow(/bigint/);
  });

  it('normalizes exact declared decimals and rejects excess precision', () => {
    expect(decimalMoney('USDC', '0012.3400', 4)).toEqual({
      representation: 'decimal',
      currency: 'USDC',
      decimal: '12.3400',
      scale: 4,
    });
    expect(() => decimalMoney('USDC', '1.234', 2)).toThrow(/scale/);
  });
});

describe('portfolio generation and canonical hashes', () => {
  it('generates a bounded deterministic synthetic portfolio', () => {
    const options = { seed: 'golden', productCount: 3, pricingItemCount: 5 } as const;
    const first = createPortfolio(options);
    const replay = createPortfolio(options);

    expect(first).toEqual(replay);
    expect(first.products).toHaveLength(3);
    expect(first.pricingItems).toHaveLength(5);
    expect(first.products.every((product) => first.leagues.includes(product.league))).toBe(true);
  });

  it('canonicalizes key order, bigint money, and repeated portfolio hashes', () => {
    expect(canonicalJson({ z: 1, nested: { b: 2n, a: 'x' } })).toBe(
      '{"nested":{"a":"x","b":"2"},"z":1}',
    );
    expect(canonicalHash({ b: 2, a: 1 })).toBe(canonicalHash({ a: 1, b: 2 }));

    const options = { seed: 'canonical', productCount: 4, pricingItemCount: 6 } as const;
    expect(canonicalHash(createPortfolio(options))).toBe(canonicalHash(createPortfolio(options)));
  });

  it('orders canonical object keys by locale-independent UTF-16 code units', () => {
    expect(canonicalJson({ ä: 1, z: 2 })).toBe('{"z":2,"\u00e4":1}');
  });
});

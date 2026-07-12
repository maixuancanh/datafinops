import { createDeterministicIdFactory } from './ids.js';
import { minorUnitMoney, type MinorUnitMoney } from './money.js';
import { createSeededRandom } from './random.js';

export interface PortfolioOptions {
  readonly seed: string;
  readonly productCount: number;
  readonly pricingItemCount: number;
}

export interface SyntheticPortfolio {
  readonly seed: string;
  readonly leagues: readonly string[];
  readonly products: readonly SyntheticProduct[];
  readonly pricingItems: readonly SyntheticPricingItem[];
}

export interface SyntheticProduct {
  readonly id: string;
  readonly name: string;
  readonly league: string;
}

export interface SyntheticPricingItem {
  readonly id: string;
  readonly league: string;
  readonly latencyMilliseconds: number;
  readonly monthlyPrice: MinorUnitMoney;
}

const LEAGUES = ['EPL', 'LA_LIGA', 'SERIE_A', 'BUNDESLIGA'] as const;

function boundedCount(name: string, count: number): void {
  if (!Number.isSafeInteger(count) || count < 0 || count > 1_000) {
    throw new RangeError(`${name} must be an integer from 0 through 1000`);
  }
}

export function createPortfolio(options: PortfolioOptions): SyntheticPortfolio {
  boundedCount('productCount', options.productCount);
  boundedCount('pricingItemCount', options.pricingItemCount);
  const random = createSeededRandom(options.seed);
  const ids = createDeterministicIdFactory(options.seed, 'fixture');
  const products: SyntheticProduct[] = Array.from({ length: options.productCount }, (_, index) => ({
    id: ids.next(`product-${index}`),
    name: `Synthetic Product ${index + 1}`,
    league: LEAGUES[random.int(0, LEAGUES.length - 1)] ?? LEAGUES[0],
  }));
  const pricingItems: SyntheticPricingItem[] = Array.from(
    { length: options.pricingItemCount },
    (_, index) => ({
      id: ids.next(`price-${index}`),
      league: LEAGUES[random.int(0, LEAGUES.length - 1)] ?? LEAGUES[0],
      latencyMilliseconds: [100, 500, 1_000][random.int(0, 2)] ?? 1_000,
      monthlyPrice: minorUnitMoney('USD', BigInt(random.int(500, 25_000))),
    }),
  );

  return Object.freeze({
    seed: options.seed,
    leagues: Object.freeze([...LEAGUES]),
    products: Object.freeze(products.map((product) => Object.freeze(product))),
    pricingItems: Object.freeze(pricingItems.map((item) => Object.freeze(item))),
  });
}

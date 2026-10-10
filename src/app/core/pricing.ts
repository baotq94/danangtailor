import { CONTENT } from '../content/content';

/** business-requirements §7. content/pricing.json is the only place prices exist. */
export interface PriceItem {
  readonly garment: string;
  readonly priceFrom: number;
  readonly currency: 'VND';
}

export interface PriceList {
  /** True while the seeded prices are still stand-ins for the owner's (T6). */
  readonly placeholder: boolean;
  readonly items: readonly PriceItem[];
}

/** Throws on malformed data, so a bad edit fails the prerender instead of shipping. */
export function parsePriceList(raw: unknown): PriceList {
  const list = raw as { placeholder?: unknown; items?: unknown };
  if (!Array.isArray(list.items)) throw new Error('pricing.json: "items" must be an array');
  const items = list.items.map((item: Record<string, unknown>, i): PriceItem => {
    const where = `pricing.json items[${i}]`;
    if (typeof item['garment'] !== 'string' || item['garment'].trim() === '') {
      throw new Error(`${where}: "garment" is required`);
    }
    if (!Number.isInteger(item['priceFrom']) || (item['priceFrom'] as number) <= 0) {
      throw new Error(`${where}: "priceFrom" must be a positive integer (VND, no separators)`);
    }
    if (item['currency'] !== 'VND') throw new Error(`${where}: only "VND" is supported`);
    return { garment: item['garment'], priceFrom: item['priceFrom'] as number, currency: 'VND' };
  });
  return { placeholder: list.placeholder === true, items };
}

export const PRICE_LIST = parsePriceList(CONTENT.pricing);

/** "1.200.000 ₫" (vi) or "₫1,200,000" (ko, en). The "from" wording comes from the dictionary. */
export function formatVnd(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

import en from '../../../content/i18n/en.json';
import ko from '../../../content/i18n/ko.json';
import vi from '../../../content/i18n/vi.json';
import { formatHours } from './hours';
import { formatVnd, parsePriceList } from './pricing';
import { orderForLocale, validTestimonials } from './testimonials';

const review = (overrides: Record<string, unknown> = {}) => ({
  id: 'r1',
  quote: 'Beautiful áo dài, ready the next day.',
  quoteLang: 'en',
  author: 'Anna',
  platform: 'Google Maps',
  sourceUrl: 'https://maps.app.goo.gl/example',
  ...overrides,
});

describe('validTestimonials', () => {
  it('keeps a complete entry', () => {
    expect(validTestimonials([review()], true)).toHaveLength(1);
  });

  it('throws in dev when the link to the original is missing', () => {
    expect(() => validTestimonials([review({ sourceUrl: undefined })], true)).toThrow(/"r1".*sourceUrl/);
  });

  it('skips the same entry in prod', () => {
    expect(validTestimonials([review({ sourceUrl: undefined }), review({ id: 'r2' })], false).map((t) => t.id)).toEqual(['r2']);
  });

  it.each([
    ['http link', { sourceUrl: 'http://example.com/review' }],
    ['unknown platform', { platform: 'Facebook' }],
    ['no author', { author: ' ' }],
  ])('rejects a %s', (_name, overrides) => {
    expect(() => validTestimonials([review(overrides)], true)).toThrow();
    expect(validTestimonials([review(overrides)], false)).toEqual([]);
  });
});

describe('orderForLocale', () => {
  it("puts reviews in the page's language first, keeping file order otherwise", () => {
    const list = validTestimonials(
      [review({ id: 'a' }), review({ id: 'b', quoteLang: 'ko' }), review({ id: 'c' }), review({ id: 'd', quoteLang: 'ko' })],
      true,
    );
    expect(orderForLocale(list, 'ko').map((t) => t.id)).toEqual(['b', 'd', 'a', 'c']);
  });
});

describe('prices', () => {
  const plain = (s: string) => s.replace(/\s/g, ' ');

  it('formats VND per locale', () => {
    expect(plain(formatVnd(1200000, 'vi'))).toBe('1.200.000 ₫');
    expect(formatVnd(1200000, 'en')).toBe('₫1,200,000');
    expect(formatVnd(1200000, 'ko')).toBe('₫1,200,000');
  });

  it.each([
    ['items not an array', { items: {} }],
    ['empty garment', { items: [{ garment: '', priceFrom: 1, currency: 'VND' }] }],
    ['price with separators', { items: [{ garment: 'Vest', priceFrom: '2.500.000', currency: 'VND' }] }],
    ['non-integer price', { items: [{ garment: 'Vest', priceFrom: 2.5, currency: 'VND' }] }],
    ['other currency', { items: [{ garment: 'Vest', priceFrom: 100, currency: 'USD' }] }],
  ])('rejects %s', (_name, raw) => {
    expect(() => parsePriceList(raw)).toThrow(/pricing\.json/);
  });

  it('reads the placeholder flag', () => {
    expect(parsePriceList({ items: [] }).placeholder).toBe(false);
    expect(parsePriceList({ placeholder: true, items: [] }).placeholder).toBe(true);
  });
});

describe('formatHours', () => {
  it('collapses a consecutive run into a range', () => {
    expect(formatHours([{ days: [6, 1, 2, 3, 4, 5], open: '07:00', close: '18:00' }], 'en')).toEqual([
      'Monday–Saturday: 07:00–18:00',
    ]);
  });

  it('lists short or broken runs', () => {
    expect(formatHours([{ days: [7, 1], open: '08:00', close: '12:00' }], 'en')).toEqual([
      'Monday, Sunday: 08:00–12:00',
    ]);
  });

  it('names days in the page language', () => {
    expect(formatHours([{ days: [1, 2, 3], open: '07:00', close: '18:00' }], 'ko')[0]).toBe('월요일–수요일: 07:00–18:00');
  });
});

describe('copy', () => {
  // MASTER.md §9: the stall is neither, and the words undercut the plain voice.
  it.each([
    ['vi', vi, /cao cấp|sang trọng/i],
    ['ko', ko, /프리미엄|럭셔리|고급/],
    ['en', en, /premium|luxury/i],
  ])('%s avoids "premium"/"luxury" wording', (_code, dictionary, banned) => {
    expect(JSON.stringify(dictionary)).not.toMatch(banned);
  });

  it('uses one turnaround per place: 24h in the hero, 24–48h in the process', () => {
    for (const dictionary of [vi, ko, en]) {
      expect(dictionary.hero.figure).toBe('24h');
      expect(dictionary.process.turnaround).toContain('24–48h');
      expect(JSON.stringify(dictionary)).not.toMatch(/24 ?giờ|24 ?시간|24 hours|48 ?giờ|48 ?시간|48 hours/);
    }
  });
});

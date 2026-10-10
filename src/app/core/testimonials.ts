/**
 * business-requirements §8. Reviews are copied verbatim from a public platform
 * and always link to the original. An entry that can't prove its source is
 * never shown: dev throws so the gap is noticed, prod skips it.
 */
export const PLATFORMS = ['Google Maps', 'TripAdvisor', 'Naver Blog'] as const;
export type Platform = (typeof PLATFORMS)[number];

export interface Testimonial {
  readonly id: string;
  readonly quote: string;
  readonly quoteLang: string;
  readonly author: string;
  readonly platform: Platform;
  readonly sourceUrl: string;
  readonly publishedDate?: string;
  readonly avatar?: string;
}

const MAX_QUOTE_LENGTH = 280;

/** Returns why an entry is invalid, or null if it can be shown. */
function problem(entry: Record<string, unknown>): string | null {
  const text = (field: string) => typeof entry[field] === 'string' && (entry[field] as string).trim() !== '';
  for (const field of ['id', 'quote', 'quoteLang', 'author']) {
    if (!text(field)) return `missing "${field}"`;
  }
  if (!PLATFORMS.includes(entry['platform'] as Platform)) {
    return `"platform" must be one of ${PLATFORMS.join(', ')}`;
  }
  if (!text('sourceUrl')) return 'missing "sourceUrl" (link to the original review)';
  try {
    if (new URL(entry['sourceUrl'] as string).protocol !== 'https:') return '"sourceUrl" must be https';
  } catch {
    return '"sourceUrl" is not a valid URL';
  }
  return null;
}

export function validTestimonials(raw: unknown, dev: boolean): Testimonial[] {
  if (!Array.isArray(raw)) throw new Error('testimonials.json must be an array');
  const valid: Testimonial[] = [];
  raw.forEach((entry: Record<string, unknown>, index) => {
    const reason = problem(entry ?? {});
    if (reason) {
      if (dev) throw new Error(`testimonials.json: entry "${entry?.['id'] ?? `#${index}`}" ${reason}`);
      return;
    }
    const testimonial = entry as unknown as Testimonial;
    if (dev && testimonial.quote.length > MAX_QUOTE_LENGTH) {
      console.warn(`testimonials.json: "${testimonial.id}" is longer than 2 sentences. Cut with "…".`);
    }
    valid.push(testimonial);
  });
  return valid;
}

/** Reviews written in the page's language first, then the rest in file order. */
export function orderForLocale(list: readonly Testimonial[], locale: string): Testimonial[] {
  return [...list.filter((t) => t.quoteLang === locale), ...list.filter((t) => t.quoteLang !== locale)];
}

import type { SiteConfig } from '../core/site';
import type { WorkPhoto } from '../photos/placeholders';

/**
 * Everything the owner supplies, in one object. Components read it through
 * core/site, core/pricing, core/testimonial-list and PhotoSlot, never directly.
 */
export interface Content {
  readonly site: SiteConfig;
  /** Validated by parsePriceList. */
  readonly pricing: unknown;
  /** Validated by validTestimonials. */
  readonly testimonials: unknown;
  /** S2, T5. */
  readonly yearsOfExperience: number | null;
  /** S5, T11. One entry per locale code. */
  readonly directions: Readonly<Record<string, string>> | null;
  /** S1 slot files, in order. More than one turns the hero photo into a carousel. */
  readonly heroPhotos: readonly string[];
  /** S3 gallery, in display order. */
  readonly workPhotos: readonly WorkPhoto[];
  /** Slot file name → image path without extension, relative to the base href (PhotoSlot adds `-<width>.webp`). Empty until Phase 3. */
  readonly photos: Readonly<Record<string, string>>;
  /** Adds <meta name="robots" content="noindex">. Keep in step with public/_headers. */
  readonly noindex: boolean;
}

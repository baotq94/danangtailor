import { CONTENT } from '../content/content';
import type { OpeningHours } from './hours';

/**
 * Owner-editable facts about the stall. `null` means "not supplied yet"
 * (business-requirements §3) and renders as a visible TODO, never a guess.
 */
export interface SiteConfig {
  /** The single value behind <base href>, canonical, og:url and hreflang. */
  readonly siteUrl: string;
  readonly phoneE164: string;
  readonly phoneDisplayLocal: string;
  readonly phoneDisplayIntl: string;
  readonly zaloUrl: string;
  readonly zaloIsSample: boolean;
  readonly mapsUrl: string;
  readonly mapsEmbedUrl: string | null;
  readonly coordinates: { readonly lat: number; readonly lng: number };
  readonly stallNumber: string | null;
  readonly address: string | null;
  readonly hours: readonly OpeningHours[] | null;
  readonly cfAnalyticsToken: string | null;
}

export const SITE: SiteConfig = CONTENT.site;

/** Path part of siteUrl, always with a trailing slash: '/' for workers.dev. */
export const BASE_PATH = new URL(SITE.siteUrl).pathname.replace(/\/?$/, '/');

/**
 * Absolute URL of a locale page, e.g. https://example.com/vi/
 * Trailing slash: the page is vi/index.html and Cloudflare Pages redirects
 * /vi to /vi/, so the canonical form is the one that doesn't redirect.
 */
export function pageUrl(localeCode: string): string {
  return new URL(`${BASE_PATH}${localeCode}/`, SITE.siteUrl).href;
}

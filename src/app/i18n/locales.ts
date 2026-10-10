import vi from '../../../content/i18n/vi.json';
import type { Dictionary } from './dictionary';

export interface LocaleConfig {
  /** Route segment and <html lang>. */
  readonly code: string;
  /** Name of the language in its own script, for the language switch. */
  readonly label: string;
  readonly ogLocale: string;
  /** Tourists on foreign SIMs need +84, so only vi shows the local format. */
  readonly phoneDisplay: 'local' | 'intl';
  /** CJK @font-face sheet, linked only on this locale (MASTER.md §1.4). */
  readonly fontStylesheet?: string;
  readonly load: () => Promise<Dictionary>;
}

/**
 * The locale registry. Adding a language (e.g. ja in phase 2):
 *   1. content/i18n/ja.json  (same keys as vi.json; the build fails otherwise)
 *   2. one entry below
 *   3. alt.ja on every photo in photos/manifest.json (Phase 3)
 */
export const LOCALES = [
  {
    code: 'vi',
    label: 'Tiếng Việt',
    ogLocale: 'vi_VN',
    phoneDisplay: 'local',
    // Bundled, not lazy: it is also the fallback for a missing key in any locale.
    load: () => Promise.resolve(vi),
  },
  {
    code: 'ko',
    label: '한국어',
    ogLocale: 'ko_KR',
    phoneDisplay: 'intl',
    fontStylesheet: '/fonts/noto-sans-kr.css',
    load: () => import('../../../content/i18n/ko.json').then((m) => m.default satisfies Dictionary),
  },
  {
    code: 'en',
    label: 'English',
    ogLocale: 'en_US',
    phoneDisplay: 'intl',
    load: () => import('../../../content/i18n/en.json').then((m) => m.default satisfies Dictionary),
  },
] as const satisfies readonly LocaleConfig[];

export type LocaleCode = (typeof LOCALES)[number]['code'];

export const DEFAULT_LOCALE: LocaleCode = 'vi';

export function findLocale(code: string | undefined): LocaleConfig | undefined {
  return LOCALES.find((l) => l.code === code);
}

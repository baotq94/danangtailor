import type vi from '../../../content/i18n/vi.json';

/** vi.json is the reference shape; every other dictionary must match it. */
export type Dictionary = typeof vi;

type Leaves<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends string ? `${Prefix}${K}` : Leaves<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

/** Dotted path to a string in the dictionary, e.g. 'nav.work'. Checked at compile time. */
export type TranslationKey = Leaves<Dictionary>;

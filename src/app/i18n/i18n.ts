import { Injectable, computed, isDevMode, signal } from '@angular/core';
import { SITE } from '../core/site';
import type { Dictionary, TranslationKey } from './dictionary';
import vi from '../../../content/i18n/vi.json';
import { LOCALES, type LocaleConfig, findLocale } from './locales';

@Injectable({ providedIn: 'root' })
export class I18n {
  private readonly dictionary = signal<Dictionary | null>(null);
  private readonly current = signal<LocaleConfig>(LOCALES[0]);

  readonly locale = this.current.asReadonly();
  readonly locales: readonly LocaleConfig[] = LOCALES;

  readonly phoneDisplay = computed(() =>
    this.current().phoneDisplay === 'local' ? SITE.phoneDisplayLocal : SITE.phoneDisplayIntl,
  );

  /** Load a locale's dictionary and make it current. Called by the route resolver. */
  async use(code: string): Promise<LocaleConfig> {
    const config = findLocale(code);
    if (!config) throw new Error(`Unsupported locale "${code}"`);
    const dictionary = await config.load();
    this.dictionary.set(dictionary);
    this.current.set(config);
    return config;
  }

  /**
   * Translate a key. Reads signals, so templates calling t() update on locale change.
   * `{name}` placeholders are replaced from params.
   */
  t(key: TranslationKey, params?: Record<string, string | number>): string {
    const dictionary = this.dictionary();
    let value = dictionary ? lookup(dictionary, key) : undefined;
    if (typeof value !== 'string') {
      // Keys are type-checked and ko/en must satisfy vi's shape, so this only
      // happens if a JSON file drifts at runtime. Dev: shout. Prod: use vi.
      if (isDevMode() && dictionary) {
        console.error(`[i18n] Missing key "${key}" for locale "${this.current().code}"`);
      }
      value = lookup(vi, key);
      if (typeof value !== 'string') return '';
    }
    return params ? value.replace(/\{(\w+)\}/g, (m, name) => String(params[name] ?? m)) : value;
  }
}

function lookup(dictionary: Dictionary, key: string): unknown {
  return key
    .split('.')
    .reduce<unknown>((node, part) => (node as Record<string, unknown> | undefined)?.[part], dictionary);
}

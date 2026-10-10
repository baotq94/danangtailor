import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import en from '../../content/i18n/en.json';
import ko from '../../content/i18n/ko.json';
import vi from '../../content/i18n/vi.json';
import { routes } from './app.routes';
import { pageUrl } from './core/site';
import { I18n } from './i18n/i18n';

/** Every dotted key path that holds a string. */
function keys(node: object, prefix = ''): string[] {
  return Object.entries(node).flatMap(([k, v]) =>
    typeof v === 'string' ? [prefix + k] : keys(v as object, `${prefix}${k}.`),
  );
}

describe('dictionaries', () => {
  // `satisfies Dictionary` in locales.ts catches missing keys at build time;
  // this also catches extra keys and empty strings.
  it.each([
    ['ko', ko],
    ['en', en],
  ])('%s has exactly the keys of vi', (_code, dictionary) => {
    expect(keys(dictionary).sort()).toEqual(keys(vi).sort());
  });

  it.each([
    ['vi', vi],
    ['ko', ko],
    ['en', en],
  ])('%s has no empty strings', (_code, dictionary) => {
    const empty = keys(dictionary).filter(
      (key) => key.split('.').reduce<any>((n, p) => n[p], dictionary).trim() === '',
    );
    expect(empty).toEqual([]);
  });

});

describe('routing', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter(routes)] }));

  const expectedBrand: Record<string, string> = {
    vi: 'Nhà may Đà Nẵng',
    ko: 'Da Nang 테일러샵',
    en: 'Da Nang Tailor',
  };

  it.each(['vi', 'ko', 'en'])('/%s renders the page in that locale', async (code) => {
    const harness = await RouterTestingHarness.create(`/${code}`);
    expect(TestBed.inject(I18n).locale().code).toBe(code);
    expect(document.documentElement.lang).toBe(code);
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain(expectedBrand[code]);
  });

  it.each(['/', '/fr', '/vi/nope'])('%s redirects to /vi', async (url) => {
    const harness = await RouterTestingHarness.create(url);
    expect(TestBed.inject(I18n).locale().code).toBe('vi');
    expect(harness.routeNativeElement?.querySelector('h1')).toBeTruthy();
  });

  it('builds canonical URLs with a trailing slash', () => {
    expect(pageUrl('ko')).toBe('https://example.com/ko/');
  });
});

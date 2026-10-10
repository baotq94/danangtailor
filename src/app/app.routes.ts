import { inject } from '@angular/core';
import type { CanMatchFn, ResolveFn, Routes } from '@angular/router';
import { Seo } from './core/seo';
import { I18n } from './i18n/i18n';
import { DEFAULT_LOCALE, type LocaleConfig, findLocale } from './i18n/locales';

const isLocale: CanMatchFn = (_route, segments) => findLocale(segments[0]?.path) !== undefined;

const loadLocale: ResolveFn<LocaleConfig> = async (route) => {
  const i18n = inject(I18n);
  const seo = inject(Seo);
  const locale = await i18n.use(route.paramMap.get('lang')!);
  seo.apply(locale);
  return locale;
};

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: DEFAULT_LOCALE },
  {
    path: ':lang',
    canMatch: [isLocale],
    resolve: { locale: loadLocale },
    loadComponent: () => import('./pages/home/home-page').then((m) => m.HomePage),
  },
  { path: '**', redirectTo: DEFAULT_LOCALE },
];

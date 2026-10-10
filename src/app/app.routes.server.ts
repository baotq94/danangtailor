import { RenderMode, ServerRoute } from '@angular/ssr';
import { LOCALES } from './i18n/locales';

export const serverRoutes: ServerRoute[] = [
  // Emits a redirect page for '/' → /vi (Cloudflare _redirects takes over in Phase 4).
  { path: '', renderMode: RenderMode.Prerender },
  {
    path: ':lang',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => LOCALES.map((l) => ({ lang: l.code })),
  },
  { path: '**', renderMode: RenderMode.Client },
];

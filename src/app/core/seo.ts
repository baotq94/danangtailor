import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { I18n } from '../i18n/i18n';
import { LOCALES, DEFAULT_LOCALE, type LocaleConfig } from '../i18n/locales';
import { CONTENT } from '../content/content';
import { BASE_PATH, SITE, pageUrl } from './site';

/**
 * Per-locale <head>: lang, title, description, Open Graph, canonical, hreflang,
 * the CJK font stylesheet and the Cloudflare Web Analytics beacon. Runs during prerender (so it lands in the static
 * HTML) and again on client-side language switches.
 */
@Injectable({ providedIn: 'root' })
export class Seo {
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly i18n = inject(I18n);

  apply(locale: LocaleConfig): void {
    const t = this.i18n.t.bind(this.i18n);
    const url = pageUrl(locale.code);
    const title = t('meta.title');
    const description = t('meta.description');

    this.document.documentElement.lang = locale.code;
    this.title.setTitle(title);

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: t('brand.name') });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:locale', content: locale.ogLocale });
    if (CONTENT.noindex) this.meta.updateTag({ name: 'robots', content: 'noindex' });
    // og:image arrives with the photo pipeline (Phase 3). No stock image meanwhile.

    this.meta.getTags('property="og:locale:alternate"').forEach((tag) => this.meta.removeTagElement(tag));
    for (const other of LOCALES) {
      if (other.code !== locale.code) {
        this.meta.addTag({ property: 'og:locale:alternate', content: other.ogLocale }, true);
      }
    }

    this.replaceLinks('seo', [
      { rel: 'canonical', href: url },
      ...LOCALES.map((l) => ({ rel: 'alternate', hreflang: l.code, href: pageUrl(l.code) })),
      { rel: 'alternate', hreflang: 'x-default', href: pageUrl(DEFAULT_LOCALE) },
    ]);

    // Render-blocking on purpose (/ko only, ~23 KB gzipped, same origin): the
    // @font-face rules are known before first paint, so Hangul swaps in sooner.
    this.replaceLinks(
      'font',
      locale.fontStylesheet ? [{ rel: 'stylesheet', href: BASE_PATH + locale.fontStylesheet.slice(1) }] : [],
    );

    this.addAnalytics(SITE.cfAnalyticsToken);
  }

  /** Cloudflare Web Analytics (no cookies). Once per page; the token comes from content/site.json. */
  private addAnalytics(token: string | null): void {
    const head = this.document.head;
    if (!token || head.querySelector('script[data-cf-beacon]')) return;
    const script = this.document.createElement('script');
    script.setAttribute('type', 'module');
    script.setAttribute('src', 'https://static.cloudflareinsights.com/beacon.min.js');
    script.setAttribute('data-cf-beacon', JSON.stringify({ token }));
    head.appendChild(script);
  }

  /** Swap out every <link data-head="group"> for a fresh set. */
  private replaceLinks(group: string, links: Record<string, string>[]): void {
    const head = this.document.head;
    head.querySelectorAll(`link[data-head="${group}"]`).forEach((el) => el.remove());
    for (const attrs of links) {
      const link = this.document.createElement('link');
      for (const [name, value] of Object.entries(attrs)) link.setAttribute(name, value);
      link.setAttribute('data-head', group);
      head.appendChild(link);
    }
  }
}

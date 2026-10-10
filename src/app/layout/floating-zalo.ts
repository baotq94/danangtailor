import { ChangeDetectionStrategy, Component, DOCUMENT, DestroyRef, afterNextRender, inject, signal } from '@angular/core';
import { SITE } from '../core/site';
import { I18n } from '../i18n/i18n';
import { Icon } from '../ui/icon';

/**
 * MASTER.md §4.2. Always reachable on mobile, but hidden while S7 is on screen
 * so the page never shows the same action twice.
 */
@Component({
  selector: 'app-floating-zalo',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      class="floating-zalo"
      [class.floating-zalo--hidden]="contactInView()"
      [href]="site.zaloUrl"
      [attr.aria-label]="i18n.t('zalo.floatingLabel')"
      [attr.aria-hidden]="contactInView() ? 'true' : null"
      [attr.tabindex]="contactInView() ? -1 : null"
    >
      <app-icon name="zalo" />
      <span>{{ i18n.t('zalo.floating') }}</span>
    </a>
  `,
  styles: `
    .floating-zalo {
      --icon-size: 1.5rem;
      position: fixed;
      inset-inline-end: var(--space-4);
      inset-block-end: max(var(--space-4), env(safe-area-inset-bottom));
      z-index: 20;
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      min-block-size: 3rem;
      padding-inline: var(--space-4) 1.25rem;
      border-radius: 1.5rem;
      background: var(--accent);
      color: var(--on-accent);
      font-weight: var(--weight-semibold);
      text-decoration: none;
      transition: background-color var(--transition);

      &:hover {
        background: var(--accent-hover);
        color: var(--on-accent);
      }
    }
    .floating-zalo--hidden {
      visibility: hidden;
    }
  `,
})
export class FloatingZalo {
  protected readonly i18n = inject(I18n);
  protected readonly site = SITE;
  protected readonly contactInView = signal(false);

  constructor() {
    const document = inject(DOCUMENT);
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const contact = document.getElementById('contact');
      if (!contact || typeof IntersectionObserver === 'undefined') return;
      const observer = new IntersectionObserver(([entry]) => this.contactInView.set(entry.isIntersecting));
      observer.observe(contact);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}

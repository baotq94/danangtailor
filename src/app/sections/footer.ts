import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { formatHours } from '../core/hours';
import { SITE } from '../core/site';
import { I18n } from '../i18n/i18n';

/** S8. Name, address, hours, phone. Nothing else: no policies, no social icons. */
@Component({
  selector: 'footer[app-footer]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'footer' },
  template: `
    <div class="container footer__row">
      <p class="footer__name">{{ i18n.t('brand.name') }}</p>
      <p>
        @if (site.address) {
          <span lang="vi">{{ site.address }}</span>
        } @else {
          <span class="todo">TODO T4 address</span>
        }
      </p>
      <p>
        @if (hours(); as lines) {
          {{ lines.join(' · ') }}
        } @else {
          <span class="todo">TODO T2 hours</span>
        }
      </p>
      <p><a [href]="'tel:' + site.phoneE164">{{ i18n.phoneDisplay() }}</a></p>
    </div>
  `,
  styles: `
    :host {
      display: block;
      padding-block: var(--space-8);
      border-block-start: 1px solid var(--rule);
      font-size: var(--text-sm);
      color: var(--ink-muted);
    }
    .footer__row {
      display: grid;
      gap: var(--space-2);
    }
    .footer__row a {
      display: inline-flex;
      align-items: center;
      min-block-size: var(--tap-min);
    }
    .footer__name {
      color: var(--ink);
      font-weight: var(--weight-semibold);
    }
    @media (min-width: 64rem) {
      .footer__row {
        grid-template-columns: repeat(4, auto);
        justify-content: space-between;
        align-items: center;
        gap: var(--space-6);
      }
    }
  `,
})
export class Footer {
  protected readonly i18n = inject(I18n);
  protected readonly site = SITE;
  protected readonly hours = computed(() =>
    SITE.hours ? formatHours(SITE.hours, this.i18n.locale().code) : null,
  );
}

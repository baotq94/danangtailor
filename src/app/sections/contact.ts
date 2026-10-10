import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { formatHours } from '../core/hours';
import { SITE } from '../core/site';
import { I18n } from '../i18n/i18n';
import { Icon } from '../ui/icon';

/** S7. The phone number is the main conversion: the largest link on the page. No form. */
@Component({
  selector: 'section[app-contact]',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'contact', class: 'section section--linen', 'aria-labelledby': 'contact-heading' },
  template: `
    <div class="container">
      <h2 id="contact-heading" class="section-title">{{ i18n.t('sections.contact') }}</h2>
      <div class="grid contact">
        <div class="contact__reach">
          <div>
            <p class="meta-label">{{ i18n.t('contact.call') }}</p>
            <a class="contact__phone" [href]="'tel:' + site.phoneE164">{{ i18n.phoneDisplay() }}</a>
          </div>
          <p class="contact__zalo">
            <a class="button button--secondary" [href]="site.zaloUrl">
              <app-icon name="zalo" />
              {{ i18n.t('contact.zalo') }}
            </a>
            @if (site.zaloIsSample) {
              <span class="todo">TODO T3 sample Zalo link</span>
            }
          </p>
        </div>

        <div class="contact__details">
          <div>
            <h3 class="meta-label">{{ i18n.t('common.address') }}</h3>
            @if (site.address) {
              <p lang="vi">{{ site.address }}</p>
            } @else {
              <p><span class="todo">TODO T4 address</span></p>
            }
          </div>
          <div>
            <h3 class="meta-label">{{ i18n.t('common.hours') }}</h3>
            @if (hours(); as lines) {
              @for (line of lines; track line) {
                <p>{{ line }}</p>
              }
            } @else {
              <p><span class="todo">TODO T2 hours</span></p>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .contact__reach,
    .contact__details {
      display: grid;
      gap: var(--space-6);
      align-content: start;
    }
    .contact__phone {
      font-size: var(--text-2xl);
      font-weight: var(--weight-semibold);
      line-height: 1.2;
      white-space: nowrap;
    }
    .contact__zalo {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--space-3);
    }
    @media (min-width: 64rem) {
      .contact__reach { grid-column: 1 / 8; }
      .contact__details { grid-column: 9 / 13; }
    }
  `,
})
export class Contact {
  protected readonly i18n = inject(I18n);
  protected readonly site = SITE;
  protected readonly hours = computed(() =>
    SITE.hours ? formatHours(SITE.hours, this.i18n.locale().code) : null,
  );
}

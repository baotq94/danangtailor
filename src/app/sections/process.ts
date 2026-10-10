import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PRICE_LIST, formatVnd } from '../core/pricing';
import type { TranslationKey } from '../i18n/dictionary';
import { I18n } from '../i18n/i18n';
import { PhotoSlot } from '../ui/photo-slot';

interface Step {
  readonly file: string;
  readonly title: TranslationKey;
  readonly text: TranslationKey;
}

const STEPS: readonly Step[] = [
  { file: 'process-1-tu-van.jpg', title: 'process.step1Title', text: 'process.step1Text' },
  { file: 'process-2-chon-vai.jpg', title: 'process.step2Title', text: 'process.step2Text' },
  { file: 'process-3-so-do.jpg', title: 'process.step3Title', text: 'process.step3Text' },
  { file: 'process-4-thu-giao.jpg', title: 'process.step4Title', text: 'process.step4Text' },
];

/** S4. Four steps, the honest 24–48h, then prices from content/pricing.json. */
@Component({
  selector: 'section[app-process]',
  imports: [PhotoSlot],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'process', class: 'section', 'aria-labelledby': 'process-heading' },
  template: `
    <div class="container">
      <h2 id="process-heading" class="section-title">{{ i18n.t('sections.process') }}</h2>

      <ol class="steps" role="list">
        @for (step of steps; track step.file; let i = $index) {
          <li class="step">
            <app-photo-slot
              class="step__photo"
              [file]="step.file"
              ratio="1:1"
              sizes="(min-width: 64rem) 16rem, 30vw"
              [alt]="i18n.t('photos.process', { step: i + 1, title: i18n.t(step.title) })"
            />
            <div>
              <p class="step__number" aria-hidden="true">0{{ i + 1 }}</p>
              <h3 class="step__title">{{ i18n.t(step.title) }}</h3>
              <p>{{ i18n.t(step.text) }}</p>
            </div>
          </li>
        }
      </ol>

      <p class="turnaround">{{ i18n.t('process.turnaround') }}</p>

      <div class="grid prices">
        <div class="prices__list">
          <h3 class="prices__title">
            {{ i18n.t('process.pricesTitle') }}
            @if (priceList.placeholder) {
              <span class="todo">TODO T6 sample prices</span>
            }
          </h3>
          <table class="price-table">
            <thead class="visually-hidden">
              <tr>
                <th scope="col">{{ i18n.t('process.garment') }}</th>
                <th scope="col">{{ i18n.t('process.price') }}</th>
              </tr>
            </thead>
            <tbody>
              @for (item of priceList.items; track item.garment) {
                <tr>
                  <th scope="row" [attr.lang]="i18n.locale().code === 'en' ? null : 'en'">{{ item.garment }}</th>
                  <td>{{ i18n.t('process.from', { price: price(item.priceFrom) }) }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="prices__note">{{ i18n.t('process.fabricNote') }}</p>
      </div>
    </div>
  `,
  styles: `
    .steps {
      display: grid;
      gap: var(--space-6);
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .step {
      display: grid;
      grid-template-columns: 30% minmax(0, 1fr);
      gap: var(--space-4);
      align-items: start;
      align-content: start;
    }
    .step__number {
      font-weight: var(--weight-semibold);
      font-size: var(--text-sm);
    }
    .step__title {
      font-size: var(--text-lg);
      margin-block-end: var(--space-1);
    }
    .turnaround {
      margin-block: var(--space-8) var(--space-12);
      font-size: var(--text-lg);
      font-weight: var(--weight-semibold);
    }
    .prices__title {
      font-size: var(--text-lg);
      margin-block-end: var(--space-3);
    }
    .price-table {
      inline-size: 100%;
      border-collapse: collapse;

      th,
      td {
        padding-block: var(--space-3);
        border-block-end: 1px solid var(--rule);
        vertical-align: baseline;
      }
      th {
        padding-inline-end: var(--space-4);
        font-weight: var(--weight-regular);
        text-align: start;
      }
      td {
        text-align: end;
        white-space: nowrap;
        font-weight: var(--weight-semibold);
      }
    }
    .prices__note {
      color: var(--ink-muted);
    }

    @media (min-width: 64rem) {
      .steps {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
      .step {
        grid-template-columns: 1fr;
      }
      .prices__list {
        grid-column: 1 / 8;
      }
      .prices__note {
        grid-column: 9 / 13;
        align-self: end;
      }
    }
  `,
})
export class Process {
  protected readonly i18n = inject(I18n);
  protected readonly steps = STEPS;
  protected readonly priceList = PRICE_LIST;

  protected price(amount: number): string {
    return formatVnd(amount, this.i18n.locale().code);
  }
}

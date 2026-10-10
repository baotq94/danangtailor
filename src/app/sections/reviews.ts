import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TestimonialList } from '../core/testimonial-list';
import { I18n } from '../i18n/i18n';
import { Icon } from '../ui/icon';

/**
 * S6. Quotes exactly as published, in their own language, each with a visible
 * link to the original. The page only renders this section when there is at
 * least one valid entry (see HomePage).
 */
@Component({
  selector: 'section[app-reviews]',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'reviews', class: 'section', 'aria-labelledby': 'reviews-heading' },
  template: `
    <div class="container">
      <h2 id="reviews-heading" class="section-title">{{ i18n.t('sections.reviews') }}</h2>
      <ul class="reviews" role="list">
        @for (review of testimonials.ordered(); track review.id) {
          <li>
            <figure class="review">
              <blockquote class="review__quote" [attr.lang]="review.quoteLang">
                <p>{{ review.quote }}</p>
              </blockquote>
              <figcaption class="review__source">
                <span [attr.lang]="review.quoteLang">{{ review.author }}</span>
                ·
                <a [href]="review.sourceUrl" lang="en">
                  {{ review.platform }}
                  <app-icon name="external" />
                </a>
              </figcaption>
            </figure>
          </li>
        }
      </ul>
    </div>
  `,
  styles: `
    .reviews {
      display: grid;
      margin: 0;
      padding: 0;
      list-style: none;

      @media (min-width: 64rem) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        column-gap: var(--space-12);
      }
    }
    .review {
      padding-block: var(--space-6);
      border-block-start: 1px solid var(--rule);
    }
    .review__quote {
      font-size: var(--text-lg);
    }
    .review__source {
      margin-block-start: var(--space-3);
      color: var(--ink-muted);

      a {
        --icon-size: 1rem;
        display: inline-flex;
        align-items: center;
        gap: var(--space-1);
        min-block-size: var(--tap-min);
      }
    }
  `,
})
export class Reviews {
  protected readonly i18n = inject(I18n);
  protected readonly testimonials = inject(TestimonialList);
}

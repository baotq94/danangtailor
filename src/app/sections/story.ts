import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CONTENT } from '../content/content';
import { I18n } from '../i18n/i18n';
import { TextWithTodo } from '../ui/text-with-todo';

/** S2. Only confirmed facts; the years are the owner's to supply (T5). */
@Component({
  selector: 'section[app-story]',
  imports: [TextWithTodo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'story', class: 'section', 'aria-labelledby': 'story-heading' },
  template: `
    <div class="container grid">
      <h2 id="story-heading" class="section-title story__title">{{ i18n.t('sections.story') }}</h2>
      <div class="story__text measure" [attr.lang]="i18n.locale().code">
        <p>{{ i18n.t('story.p1') }}</p>
        <p>{{ i18n.t('story.p2') }}</p>
        <p><app-text key="story.p3" [values]="{ years: years }" [todo]="{ years: 'T5 years' }" /></p>
        <p>{{ i18n.t('story.p4') }}</p>
      </div>
    </div>
  `,
  styles: `
    .story__text {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      font-size: var(--text-lg);
    }
    @media (min-width: 64rem) {
      .story__title { grid-column: 1 / 5; }
      .story__text { grid-column: 5 / 12; }
    }
  `,
})
export class Story {
  protected readonly i18n = inject(I18n);
  protected readonly years = CONTENT.yearsOfExperience;
}

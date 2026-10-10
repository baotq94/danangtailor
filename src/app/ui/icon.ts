import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** The icons in MASTER.md §5 (plus prev/next/pause/play for the carousels). Hand-drawn, 24-unit grid, 1.5 stroke, decorative only. */
export type IconName = 'phone' | 'zalo' | 'pin' | 'external' | 'prev' | 'next' | 'pause' | 'play';

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
         stroke-linecap="round" stroke-linejoin="round" focusable="false">
      @switch (name()) {
        @case ('phone') {
          <path d="M5 3.5h3.2l1.6 4.2-2.1 1.4a11 11 0 0 0 7.2 7.2l1.4-2.1 4.2 1.6V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.1 1.5 1.5 0 0 1 5 3.5Z" />
        }
        @case ('zalo') {
          <path d="M12 3.75c-4.83 0-8.25 3.2-8.25 7.25 0 2.02.86 3.84 2.3 5.14l-.8 3.61 3.63-1.73c.98.33 2.03.48 3.12.48 4.83 0 8.25-3.2 8.25-7.5S16.83 3.75 12 3.75Z" />
          <path d="M9 9h5.5L9 14.5h5.5" />
        }
        @case ('pin') {
          <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
          <circle cx="12" cy="10" r="2.25" />
        }
        @case ('external') {
          <path d="M9 5.5H5.5v13h13V15" />
          <path d="M13 4.5h6.5V11M19.5 4.5 11 13" />
        }
        @case ('prev') {
          <path d="M14.5 5.5 8 12l6.5 6.5" />
        }
        @case ('next') {
          <path d="M9.5 5.5 16 12l-6.5 6.5" />
        }
        @case ('pause') {
          <path d="M9 6v12M15 6v12" />
        }
        @case ('play') {
          <path d="M8 5.5v13l10.5-6.5L8 5.5Z" />
        }
      }
    </svg>
  `,
  styles: `
    :host { display: inline-flex; flex: none; inline-size: var(--icon-size, 1.25rem); block-size: var(--icon-size, 1.25rem); }
    svg { inline-size: 100%; block-size: 100%; }
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
}

import { ChangeDetectionStrategy, Component, booleanAttribute, computed, inject, input } from '@angular/core';
import { CONTENT } from '../content/content';
import { I18n } from '../i18n/i18n';
import type { Ratio } from '../photos/placeholders';

/** WebP widths written by scripts/build-photos.mjs for every photo. */
export const PHOTO_WIDTHS = [480, 960, 1600] as const;
export type PhotoWidth = (typeof PHOTO_WIDTHS)[number];

/**
 * A photo at a locked ratio (MASTER.md §4.7). Until a photo exists for the
 * slot it is a grey placeholder labelled with the file it expects. Either way
 * the host is role="img" with the alt text, so the accessibility tree is the same.
 *
 * CONTENT.photos maps the slot file to a path without extension; the image is
 * served as `<path>-<width>.webp` for each width in `widths`.
 */
@Component({
  selector: 'app-photo-slot',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'img',
    '[attr.aria-label]': 'label()',
    '[style.aspect-ratio]': 'ratio().replace(":", " / ")',
  },
  template: `
    @if (src(); as src) {
      <img
        [src]="src"
        [attr.srcset]="srcset()"
        [attr.sizes]="sizes()"
        alt=""
        decoding="async"
        [attr.loading]="priority() || eager() ? null : 'lazy'"
        [attr.fetchpriority]="priority() ? 'high' : null"
        draggable="false"
      />
    } @else {
      <span class="label" aria-hidden="true">{{ file() }} · {{ ratio() }}</span>
    }
  `,
  styles: `
    :host {
      position: relative;
      display: block;
      inline-size: 100%;
      overflow: hidden;
      background: var(--placeholder);
    }
    img {
      display: block;
      inline-size: 100%;
      block-size: 100%;
      object-fit: cover;
    }
    .label {
      position: absolute;
      inset-block-end: var(--space-2);
      inset-inline-start: var(--space-2);
      font-size: var(--text-sm);
      line-height: 1.3;
      color: var(--placeholder-ink);
    }
  `,
})
export class PhotoSlot {
  private readonly i18n = inject(I18n);

  readonly file = input.required<string>();
  readonly ratio = input.required<Ratio>();
  readonly alt = input.required<string>();
  /** Rendered width of the slot, for the browser to pick a file from srcset. */
  readonly sizes = input('100vw');
  /** Widths to offer. Photos never shown wider than about 700px skip the 1600 file. */
  readonly widths = input<readonly PhotoWidth[]>([480, 960]);
  /** The LCP image: loaded eagerly with high fetch priority. */
  readonly priority = input(false, { transform: booleanAttribute });
  /** Loaded eagerly without raising priority, e.g. the next carousel slide. */
  readonly eager = input(false, { transform: booleanAttribute });

  private readonly base = computed(() => CONTENT.photos[this.file()] ?? null);
  protected readonly src = computed(() => {
    const base = this.base();
    return base && `${base}-${this.widths().at(-1)}.webp`;
  });
  protected readonly srcset = computed(() => {
    const base = this.base();
    return base && this.widths().map((w) => `${base}-${w}.webp ${w}w`).join(', ');
  });
  protected readonly label = computed(() =>
    this.src() ? this.alt() : `${this.alt()} ${this.i18n.t('photos.pending')}`,
  );
}

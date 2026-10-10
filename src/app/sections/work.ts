import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { CONTENT } from '../content/content';
import type { TranslationKey } from '../i18n/dictionary';
import { I18n } from '../i18n/i18n';
import type { WorkCategory, WorkPhoto } from '../photos/placeholders';
import { Icon } from '../ui/icon';
import { LoopCarousel } from '../ui/loop-carousel';
import { PhotoSlot } from '../ui/photo-slot';

const CATEGORY_LABEL: Record<WorkCategory, TranslationKey> = {
  'ao-dai': 'work.aoDai',
  'cach-tan': 'work.cachTan',
  vest: 'work.vest',
};

/** 4 × 2 on wide screens, 2 × 4 on phones. */
const PAGE_SIZE = 8;

/**
 * S3. Filter tabs (MASTER.md §4.6), a paged gallery that swipes and loops
 * (never auto-plays), and a native <dialog> lightbox (§4.8).
 */
@Component({
  selector: 'section[app-work]',
  imports: [Icon, PhotoSlot],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'work', class: 'section', 'aria-labelledby': 'work-heading' },
  template: `
    <div class="container">
      <h2 id="work-heading" class="section-title">{{ i18n.t('sections.work') }}</h2>

      <div class="filter" role="group" [attr.aria-label]="i18n.t('work.filter')">
        @for (option of filters; track option.value) {
          <button
            type="button"
            class="filter__tab"
            [attr.aria-pressed]="filter() === option.value"
            (click)="setFilter(option.value)"
          >
            {{ i18n.t(option.label) }}
          </button>
        }
      </div>

      <div
        class="gallery"
        role="region"
        aria-roledescription="carousel"
        [attr.aria-label]="i18n.t('work.gallery')"
      >
        <div
          #viewport
          class="gallery__viewport"
          (pointerdown)="carousel.dragStart($event)"
          (pointermove)="carousel.dragMove($event)"
          (pointerup)="carousel.dragEnd($event)"
          (pointercancel)="carousel.dragEnd($event)"
          (dragstart)="$event.preventDefault()"
        >
          <div
            class="gallery__track"
            [class.gallery__track--animate]="carousel.animate()"
            [style.transform]="carousel.transform()"
          >
            @for (page of carousel.slides(); track page.key; let i = $index) {
              <ul
                class="work-grid"
                role="list"
                [attr.aria-roledescription]="page.clone ? null : 'slide'"
                [attr.aria-label]="page.clone ? null : i18n.t('work.page', { page: carousel.numberOf(i), total: carousel.count() })"
                [attr.aria-hidden]="carousel.hidden(i) ? 'true' : null"
                [attr.inert]="carousel.hidden(i) ? '' : null"
              >
                @for (photo of page.item; track photo.id) {
                  <li>
                    <button
                      type="button"
                      class="work-grid__open"
                      [attr.aria-label]="i18n.t('work.open', { alt: alt(photo) })"
                      (click)="open(photo, $event)"
                    >
                      <app-photo-slot
                        [file]="photo.file"
                        ratio="4:5"
                        [alt]="alt(photo)"
                        sizes="(min-width: 48rem) 25vw, 50vw"
                        [eager]="carousel.near(i)"
                      />
                    </button>
                  </li>
                }
              </ul>
            }
          </div>
        </div>

        @if (carousel.count() > 1) {
          <div class="gallery__controls">
            <p class="gallery__count" aria-live="polite">
              {{ i18n.t('work.page', { page: carousel.index() + 1, total: carousel.count() }) }}
            </p>
            <button type="button" class="gallery__step" [attr.aria-label]="i18n.t('work.prev')" (click)="carousel.go(-1)">
              <app-icon name="prev" />
            </button>
            <button type="button" class="gallery__step" [attr.aria-label]="i18n.t('work.next')" (click)="carousel.go(1)">
              <app-icon name="next" />
            </button>
          </div>
        }
      </div>
    </div>

    <dialog #dialog class="lightbox" [attr.aria-label]="selected() ? alt(selected()!) : null" (click)="backdropClose($event)">
      <button type="button" class="button button--secondary lightbox__close" (click)="dialog.close()">
        {{ i18n.t('work.close') }}
      </button>
      @if (selected(); as photo) {
        <app-photo-slot
          class="lightbox__photo"
          [file]="photo.file"
          ratio="4:5"
          [alt]="alt(photo)"
          sizes="90vw"
          eager
        />
      }
    </dialog>
  `,
  styles: `
    .filter {
      display: flex;
      flex-wrap: wrap;
      column-gap: var(--space-4);
      margin-block-end: var(--space-6);
    }
    .filter__tab {
      min-block-size: var(--tap-min);
      padding: 0 var(--space-1);
      border: 0;
      border-block-end: 1px solid var(--control-border);
      background: none;
      color: var(--ink-muted);
      cursor: pointer;
      transition: color var(--transition), border-color var(--transition);

      &:hover {
        color: var(--ink);
      }
      &[aria-pressed='true'] {
        border-block-end: 2px solid var(--accent);
        color: var(--ink);
        font-weight: var(--weight-semibold);
      }
    }

    .gallery {
      --page-gap: var(--space-3);

      @media (min-width: 48rem) {
        --page-gap: var(--space-4);
      }
    }
    /* Pages sit edge to edge; half a gap on each side keeps the seam the same as the grid gap. */
    .gallery__viewport {
      overflow: hidden;
      margin-inline: calc(var(--page-gap) / -2);
      touch-action: pan-y;
    }
    .gallery__track {
      display: flex;
      align-items: start;

      &--animate {
        transition: transform 350ms ease-out; /* SLIDE_MS */
      }
    }

    .work-grid {
      display: grid;
      flex: 0 0 100%;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      align-content: start;
      gap: var(--page-gap);
      margin: 0;
      padding: 0 calc(var(--page-gap) / 2);
      list-style: none;

      @media (min-width: 48rem) {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
    }
    .work-grid__open {
      display: block;
      inline-size: 100%;
      padding: 0;
      border: 0;
      background: none;
      cursor: zoom-in;
      -webkit-user-drag: none;
      user-select: none;
    }

    .gallery__controls {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: var(--space-2);
      margin-block-start: var(--space-4);
    }
    .gallery__count {
      margin-inline-end: var(--space-2);
      color: var(--ink-muted);
      font-size: var(--text-sm);
      font-variant-numeric: tabular-nums;
    }
    .gallery__step {
      display: inline-grid;
      place-items: center;
      inline-size: var(--tap-min);
      block-size: var(--tap-min);
      padding: 0;
      border: 1px solid var(--control-border);
      border-radius: var(--radius);
      background: transparent;
      color: var(--ink);
      cursor: pointer;
      transition: border-color var(--transition), color var(--transition);

      &:hover {
        border-color: var(--accent);
        color: var(--accent);
      }
    }

    .lightbox {
      max-inline-size: none;
      max-block-size: none;
      padding: 0;
      border: 0;
      background: transparent;

      &::backdrop {
        background: rgb(42 36 32 / 0.9);
      }
    }
    .lightbox__close {
      position: fixed;
      inset-block-start: var(--space-4);
      inset-inline-end: var(--space-4);
      background: var(--paper);
    }
    .lightbox__photo {
      inline-size: min(90vw, 90dvh * 4 / 5);
    }
  `,
})
export class Work {
  protected readonly i18n = inject(I18n);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly viewport = viewChild.required<ElementRef<HTMLElement>>('viewport');

  protected readonly filters: readonly { value: WorkCategory | 'all'; label: TranslationKey }[] = [
    { value: 'all', label: 'work.all' },
    ...(Object.entries(CATEGORY_LABEL) as [WorkCategory, TranslationKey][]).map(([value, label]) => ({
      value,
      label,
    })),
  ];
  protected readonly filter = signal<WorkCategory | 'all'>('all');
  private readonly visible = computed(() => {
    const all = CONTENT.workPhotos;
    return this.filter() === 'all' ? all : all.filter((p) => p.category === this.filter());
  });

  private readonly pages = computed(() => {
    const photos = this.visible();
    const pages: WorkPhoto[][] = [];
    for (let i = 0; i < photos.length; i += PAGE_SIZE) pages.push(photos.slice(i, i + PAGE_SIZE));
    return pages;
  });

  protected readonly carousel = new LoopCarousel(this.pages, () => this.viewport().nativeElement);

  protected readonly selected = signal<WorkPhoto | null>(null);
  private trigger: HTMLElement | null = null;

  protected setFilter(value: WorkCategory | 'all'): void {
    this.filter.set(value);
    this.carousel.reset();
  }

  protected alt(photo: WorkPhoto): string {
    const category = this.i18n.t(CATEGORY_LABEL[photo.category]);
    return this.i18n.t('photos.work', { category });
  }

  protected open(photo: WorkPhoto, event: Event): void {
    this.trigger = event.currentTarget as HTMLElement;
    this.selected.set(photo);
    const dialog = this.dialog().nativeElement;
    dialog.addEventListener('close', () => this.trigger?.focus(), { once: true });
    dialog.showModal();
  }

  /** A click that lands on the <dialog> itself (not its content) is on the backdrop. */
  protected backdropClose(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) this.dialog().nativeElement.close();
  }
}

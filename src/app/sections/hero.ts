import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CONTENT } from '../content/content';
import { SITE } from '../core/site';
import { I18n } from '../i18n/i18n';
import { Icon } from '../ui/icon';
import { LoopCarousel } from '../ui/loop-carousel';
import { PhotoSlot } from '../ui/photo-slot';
import { TextWithTodo } from '../ui/text-with-todo';

/** Time each slide stays on screen while the slideshow plays. */
const AUTOPLAY_MS = 5000;

/**
 * S1. At 375 × 667 the photo, name, 24h and call button all fit above the fold.
 * With several hero photos the photo is a slideshow (owner's decision, BR S1):
 * it advances every 5s, swipes and loops, and stops while hovered, while a
 * control has keyboard focus, in a background tab, and when the viewer presses
 * pause. With reduced motion it starts paused.
 */
@Component({
  selector: 'section[app-hero]',
  imports: [Icon, PhotoSlot, TextWithTodo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'top', class: 'hero', 'aria-labelledby': 'top-heading' },
  template: `
    <div class="container hero__grid">
      @if (carousel.count() > 1) {
        <div
          #region
          class="hero__photo slides"
          role="region"
          aria-roledescription="carousel"
          [attr.aria-label]="i18n.t('hero.gallery')"
          (pointerenter)="$event.pointerType === 'mouse' && hovered.set(true)"
          (pointerleave)="hovered.set(false)"
          (focusin)="keyboardFocus.set(isFocusVisible($event))"
          (focusout)="focusOut($event)"
        >
          <div
            #viewport
            class="slides__viewport"
            (pointerdown)="carousel.dragStart($event)"
            (pointermove)="carousel.dragMove($event)"
            (pointerup)="carousel.dragEnd($event)"
            (pointercancel)="carousel.dragEnd($event)"
          >
            <div
              class="slides__track"
              [class.slides__track--animate]="carousel.animate()"
              [style.transform]="carousel.transform()"
              [attr.aria-live]="playing() ? 'off' : 'polite'"
            >
              @for (slide of carousel.slides(); track slide.key; let i = $index) {
                <div
                  class="slides__slide"
                  [attr.role]="slide.clone ? null : 'group'"
                  [attr.aria-roledescription]="slide.clone ? null : 'slide'"
                  [attr.aria-label]="slide.clone ? null : i18n.t('hero.slide', { n: carousel.numberOf(i), total: carousel.count() })"
                  [attr.aria-hidden]="carousel.hidden(i) ? 'true' : null"
                >
                  <app-photo-slot
                    [file]="slide.item"
                    ratio="3:2"
                    [alt]="i18n.t('photos.hero')"
                    [sizes]="photoSizes"
                    [widths]="photoWidths"
                    [priority]="i === 1"
                    [eager]="carousel.near(i)"
                  />
                </div>
              }
            </div>
          </div>

          <div class="slides__dots" aria-hidden="true">
            @for (slide of photos; track $index) {
              <span class="slides__dot" [class.slides__dot--active]="$index === carousel.index()"></span>
            }
          </div>
          <div class="slides__controls">
            <button type="button" class="slides__button" [attr.aria-label]="i18n.t('hero.prev')" (click)="carousel.go(-1)">
              <app-icon name="prev" />
            </button>
            <button
              type="button"
              class="slides__button"
              [attr.aria-label]="i18n.t(userPaused() ? 'hero.play' : 'hero.pause')"
              (click)="userPaused.set(!userPaused())"
            >
              <app-icon [name]="userPaused() ? 'play' : 'pause'" />
            </button>
            <button type="button" class="slides__button" [attr.aria-label]="i18n.t('hero.next')" (click)="carousel.go(1)">
              <app-icon name="next" />
            </button>
          </div>
        </div>
      } @else {
        <app-photo-slot
          class="hero__photo"
          [file]="photos[0]"
          ratio="3:2"
          [alt]="i18n.t('photos.hero')"
          [sizes]="photoSizes"
          [widths]="photoWidths"
          priority
        />
      }
      <div class="hero__text">
        <h1 id="top-heading" class="hero__name">{{ i18n.t('brand.name') }}</h1>
        <p class="hero__line">{{ i18n.t('hero.line') }}</p>
        <p class="hero__where">
          <app-text key="hero.where" [values]="{ stall: site.stallNumber }" [todo]="{ stall: 'T1 stall no.' }" />
        </p>
        <p class="hero__turnaround">
          <span class="hero__figure">{{ i18n.t('hero.figure') }}</span>
          <span class="hero__figure-label">{{ i18n.t('hero.figureLabel') }}</span>
        </p>
        <a
          class="button button--primary hero__call"
          [href]="'tel:' + site.phoneE164"
          [attr.aria-label]="i18n.t('header.callLabel', { phone: i18n.phoneDisplay() })"
        >
          <app-icon name="phone" />
          {{ i18n.phoneDisplay() }}
        </a>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      padding-block: var(--space-4) var(--space-12);
    }
    .hero__grid {
      display: grid;
      gap: var(--space-4);
    }
    .slides {
      position: relative;
    }
    .slides__viewport {
      overflow: hidden;
      touch-action: pan-y;
      user-select: none;
    }
    .slides__track {
      display: flex;

      &--animate {
        transition: transform 350ms ease-out; /* LoopCarousel SLIDE_MS */
      }
    }
    .slides__slide {
      flex: 0 0 100%;
    }
    .slides__dots {
      position: absolute;
      inset-block-end: var(--space-3);
      inset-inline-start: var(--space-3);
      display: flex;
      gap: var(--space-1);
    }
    .slides__dot {
      inline-size: 0.5rem;
      block-size: 0.5rem;
      border-radius: 50%;
      background: var(--paper);
      box-shadow: 0 0 0 1px rgb(42 36 32 / 0.35);
      opacity: 0.55;

      &--active {
        opacity: 1;
      }
    }
    .slides__controls {
      position: absolute;
      inset-block-end: var(--space-2);
      inset-inline-end: var(--space-2);
      display: flex;
      gap: var(--space-1);
    }
    .slides__button {
      display: inline-grid;
      place-items: center;
      inline-size: var(--tap-min);
      block-size: var(--tap-min);
      padding: 0;
      border: 1px solid var(--control-border);
      border-radius: var(--radius);
      background: var(--paper);
      color: var(--ink);
      cursor: pointer;
      transition: border-color var(--transition), color var(--transition);

      &:hover {
        border-color: var(--accent);
        color: var(--accent);
      }
    }
    .hero__text {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    .hero__name {
      font-size: var(--text-2xl);
    }
    .hero__line {
      margin-block-start: var(--space-2);
      max-inline-size: 34rem;
    }
    .hero__where {
      margin-block-start: var(--space-1);
      font-size: var(--text-sm);
      color: var(--ink-muted);
    }
    .hero__turnaround {
      display: flex;
      align-items: baseline;
      flex-wrap: wrap;
      column-gap: var(--space-3);
      margin-block: var(--space-2) var(--space-4);
    }
    .hero__figure {
      font-size: var(--text-display);
      font-weight: var(--weight-semibold);
      line-height: 1;
      letter-spacing: -0.02em;
    }
    .hero__figure-label {
      color: var(--ink-muted);
    }

    @media (min-width: 64rem) {
      :host {
        padding-block: var(--space-12) var(--space-24);
      }
      .hero__grid {
        grid-template-columns: repeat(12, minmax(0, 1fr));
        gap: var(--space-6);
        align-items: start;
      }
      .hero__text {
        grid-column: 1 / 6;
        grid-row: 1;
      }
      .hero__photo {
        grid-column: 6 / 13;
        grid-row: 1;
      }
      .hero__line {
        margin-block-start: var(--space-4);
        font-size: var(--text-lg);
      }
      .hero__turnaround {
        flex-direction: column;
        margin-block: var(--space-8);
      }
    }
  `,
})
export class Hero {
  protected readonly i18n = inject(I18n);
  protected readonly site = SITE;
  protected readonly photos = CONTENT.heroPhotos;
  protected readonly photoSizes = '(min-width: 64rem) 42rem, 100vw';
  protected readonly photoWidths = [480, 960, 1600] as const;

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);
  private readonly viewport = viewChild<ElementRef<HTMLElement>>('viewport');
  protected readonly carousel = new LoopCarousel(
    () => this.photos,
    () => this.viewport()!.nativeElement,
  );

  /** Pressed pause (or prefers reduced motion). */
  protected readonly userPaused = signal(false);
  protected readonly hovered = signal(false);
  protected readonly keyboardFocus = signal(false);
  private readonly pageVisible = signal(true);
  protected readonly playing = computed(
    () =>
      this.carousel.count() > 1 &&
      !this.userPaused() &&
      !this.hovered() &&
      !this.keyboardFocus() &&
      !this.carousel.dragging() &&
      this.pageVisible(),
  );

  constructor() {
    afterNextRender(() => {
      if (this.carousel.reducedMotion()) this.userPaused.set(true);
      const onVisibility = () => this.pageVisible.set(document.visibilityState === 'visible');
      document.addEventListener('visibilitychange', onVisibility);
      this.destroyRef.onDestroy(() => document.removeEventListener('visibilitychange', onVisibility));
    });

    // Every move (automatic, swipe or button) restarts the 5s wait.
    effect((onCleanup) => {
      if (!this.isBrowser || !this.playing()) return;
      this.carousel.position();
      const timer = setTimeout(() => this.carousel.go(1), AUTOPLAY_MS);
      onCleanup(() => clearTimeout(timer));
    });
  }

  protected isFocusVisible(event: FocusEvent): boolean {
    return event.target instanceof HTMLElement && event.target.matches(':focus-visible');
  }

  protected focusOut(event: FocusEvent): void {
    const region = event.currentTarget as HTMLElement;
    if (!region.contains(event.relatedTarget as Node | null)) this.keyboardFocus.set(false);
  }
}

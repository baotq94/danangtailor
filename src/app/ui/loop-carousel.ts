import { DestroyRef, PLATFORM_ID, afterNextRender, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const SLIDE_MS = 350;
/** A drag this far (px, or share of the width) turns the slide. */
const SWIPE_PX = 50;
const SWIPE_SHARE = 0.15;

export interface LoopSlide<T> {
  readonly key: string;
  readonly item: T;
  /** Copy of the first/last slide that makes the loop seamless. Never focusable. */
  readonly clone: boolean;
}

/**
 * Swipeable, endlessly looping slides: a track of slides wrapped in a clone of
 * the last (front) and the first (back). Sliding onto a clone jumps back to the
 * real slide once the animation ends. Used by the hero and the work gallery.
 *
 * Create it as a field initializer (it injects). The template binds the
 * viewport's pointer events to dragStart/dragMove/dragEnd, the track's
 * transform to `transform()` and its animation class to `animate()`.
 */
export class LoopCarousel<T> {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private settleTimer: ReturnType<typeof setTimeout> | undefined;
  private drag: { id: number; x: number; y: number; horizontal: boolean | null; moved: boolean } | null = null;
  private suppressClick = false;

  readonly slides = computed<LoopSlide<T>[]>(() => {
    const items = this.items();
    const real = items.map((item, i) => ({ key: `s${i}`, item, clone: false }));
    if (real.length < 2) return real;
    return [
      { key: 'clone-last', item: items[items.length - 1], clone: true },
      ...real,
      { key: 'clone-first', item: items[0], clone: true },
    ];
  });

  readonly count = computed(() => this.items().length);
  /** Index into slides(). With clones, 1 is the first real slide. */
  readonly position = signal(0);
  readonly animate = signal(false);
  readonly dragPx = signal(0);
  /** True while a finger or mouse is dragging the track. */
  readonly dragging = signal(false);
  /** Off-screen slides start loading once the carousel has been on screen after page load. */
  private readonly warm = signal(false);

  /** 0-based real slide. */
  readonly index = computed(() => {
    const count = this.count();
    if (count < 2) return 0;
    return (((this.position() - 1) % count) + count) % count;
  });

  readonly transform = computed(() => `translateX(calc(${-this.position() * 100}% + ${this.dragPx()}px))`);

  constructor(
    private readonly items: () => readonly T[],
    private readonly viewport: () => HTMLElement,
  ) {
    this.position.set(items().length > 1 ? 1 : 0);
    afterNextRender(() => {
      const element = this.viewport();
      // Capture phase, so a drag that ends over a button never reaches it.
      element.addEventListener('click', (event) => this.swallowClickAfterDrag(event), true);
      this.warmWhenVisible(element);
    });
    inject(DestroyRef).onDestroy(() => clearTimeout(this.settleTimer));
  }

  /** Not the slide on screen, or a clone: hidden from assistive tech and focus. */
  hidden(slideIndex: number): boolean {
    return this.slides()[slideIndex]?.clone === true || slideIndex !== this.position();
  }

  /** The slide on screen and its neighbours, once warm: their images load eagerly so a swipe never shows grey. */
  near(slideIndex: number): boolean {
    return slideIndex === this.position() || (this.warm() && Math.abs(slideIndex - this.position()) <= 1);
  }

  /** 1-based number of the real slide this track entry shows. */
  numberOf(slideIndex: number): number {
    return this.count() > 1 ? slideIndex : slideIndex + 1;
  }

  reset(): void {
    clearTimeout(this.settleTimer);
    this.animate.set(false);
    this.dragPx.set(0);
    this.position.set(this.count() > 1 ? 1 : 0);
  }

  go(step: 1 | -1): void {
    if (this.count() < 2) return;
    // Still sliding onto a clone: ignore the tap rather than run past the end of the track.
    if (this.position() !== this.normalized(this.position())) return;
    clearTimeout(this.settleTimer);
    this.animate.set(true);
    this.dragPx.set(0);
    this.position.update((p) => p + step);
    this.settleTimer = setTimeout(() => this.settle(), this.reducedMotion() ? 0 : SLIDE_MS);
  }

  dragStart(event: PointerEvent): void {
    if (this.count() < 2 || (event.pointerType === 'mouse' && event.button !== 0)) return;
    clearTimeout(this.settleTimer);
    this.settle();
    this.suppressClick = false;
    this.drag = { id: event.pointerId, x: event.clientX, y: event.clientY, horizontal: null, moved: false };
  }

  dragMove(event: PointerEvent): void {
    const drag = this.drag;
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (drag.horizontal === null) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      drag.horizontal = Math.abs(dx) > Math.abs(dy);
      if (!drag.horizontal) {
        this.drag = null; // vertical: let the page scroll
        return;
      }
      this.viewport().setPointerCapture(event.pointerId);
      this.animate.set(false);
      this.dragging.set(true);
    }
    drag.moved = true;
    this.dragPx.set(dx);
  }

  dragEnd(event: PointerEvent): void {
    const drag = this.drag;
    if (!drag || drag.id !== event.pointerId) return;
    this.drag = null;
    this.dragging.set(false);
    if (!drag.moved) return;
    this.suppressClick = true;
    const dx = this.dragPx();
    const width = this.viewport().clientWidth;
    if (event.type !== 'pointercancel' && Math.abs(dx) > Math.min(SWIPE_PX, width * SWIPE_SHARE)) {
      this.go(dx < 0 ? 1 : -1);
    } else {
      this.animate.set(true);
      this.dragPx.set(0);
    }
  }

  reducedMotion(): boolean {
    return this.isBrowser && matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /** After sliding onto a clone, jump without animation to the real slide it copies. */
  private settle(): void {
    const next = this.normalized(this.position());
    if (next !== this.position()) {
      this.animate.set(false);
      this.position.set(next);
    }
  }

  private normalized(position: number): number {
    const count = this.count();
    if (count < 2) return position;
    if (position <= 0) return count;
    if (position >= count + 1) return 1;
    return position;
  }

  private swallowClickAfterDrag(event: MouseEvent): void {
    if (!this.suppressClick) return;
    this.suppressClick = false;
    event.preventDefault();
    event.stopPropagation();
  }

  /** Waits for the load event (so neighbours never compete with the hero image), then for the carousel to be near the screen. */
  private warmWhenVisible(element: HTMLElement): void {
    const observe = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            this.warm.set(true);
            observer.disconnect();
          }
        },
        { rootMargin: '200px' },
      );
      observer.observe(element);
    };
    if (document.readyState === 'complete') observe();
    else addEventListener('load', observe, { once: true });
  }
}

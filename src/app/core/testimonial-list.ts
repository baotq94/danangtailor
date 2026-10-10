import { Injectable, computed, inject, isDevMode } from '@angular/core';
import { CONTENT } from '../content/content';
import { I18n } from '../i18n/i18n';
import { orderForLocale, validTestimonials } from './testimonials';

@Injectable({ providedIn: 'root' })
export class TestimonialList {
  private readonly i18n = inject(I18n);
  private readonly valid = validTestimonials(CONTENT.testimonials, isDevMode());

  /** Empty means S6 and its menu link are not rendered at all. */
  readonly ordered = computed(() => orderForLocale(this.valid, this.i18n.locale().code));
}

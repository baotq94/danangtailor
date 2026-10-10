import { ChangeDetectionStrategy, Component, DOCUMENT, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../core/site';
import { TestimonialList } from '../core/testimonial-list';
import type { TranslationKey } from '../i18n/dictionary';
import { I18n } from '../i18n/i18n';
import { Icon } from '../ui/icon';

export interface SectionLink {
  readonly id: string;
  readonly label: TranslationKey;
}

export const SECTION_LINKS: readonly SectionLink[] = [
  { id: 'story', label: 'nav.story' },
  { id: 'work', label: 'nav.work' },
  { id: 'process', label: 'nav.process' },
  { id: 'find', label: 'nav.find' },
  { id: 'reviews', label: 'nav.reviews' },
  { id: 'contact', label: 'nav.contact' },
];

@Component({
  selector: 'app-header',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly i18n = inject(I18n);
  private readonly document = inject(DOCUMENT);
  protected readonly site = SITE;
  private readonly testimonials = inject(TestimonialList);
  /** S6 isn't rendered without reviews, so neither is its link. */
  protected readonly links = computed(() =>
    this.testimonials.ordered().length ? SECTION_LINKS : SECTION_LINKS.filter((link) => link.id !== 'reviews'),
  );
  protected readonly menuOpen = signal(false);

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  /** The router scrolls to the fragment; move keyboard focus there too. */
  protected skipToMain(): void {
    this.document.getElementById('main')?.focus({ preventScroll: true });
  }
}

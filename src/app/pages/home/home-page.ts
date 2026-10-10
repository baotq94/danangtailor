import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TestimonialList } from '../../core/testimonial-list';
import { FloatingZalo } from '../../layout/floating-zalo';
import { Header } from '../../layout/header';
import { Contact } from '../../sections/contact';
import { Find } from '../../sections/find';
import { Footer } from '../../sections/footer';
import { Hero } from '../../sections/hero';
import { Process } from '../../sections/process';
import { Reviews } from '../../sections/reviews';
import { Story } from '../../sections/story';
import { Work } from '../../sections/work';

/** The one page, rendered once per locale route. Locale comes from the I18n service. */
@Component({
  selector: 'app-home-page',
  imports: [Header, Hero, Story, Work, Process, Find, Reviews, Contact, Footer, FloatingZalo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-header />
    <main id="main" tabindex="-1">
      <section app-hero></section>
      <section app-story></section>
      <section app-work></section>
      <section app-process></section>
      <section app-find></section>
      @if (testimonials.ordered().length) {
        <section app-reviews></section>
      }
      <section app-contact></section>
    </main>
    <footer app-footer></footer>
    <app-floating-zalo />
  `,
  styles: `
    :host { display: block; }
    main:focus { outline: none; }
    /* Room for the floating Zalo button so it never covers the footer phone number. */
    @media (max-width: 47.99rem) {
      :host { padding-block-end: 5rem; }
    }
  `,
})
export class HomePage {
  protected readonly testimonials = inject(TestimonialList);
}

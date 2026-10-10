import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CONTENT } from '../content/content';
import { formatHours } from '../core/hours';
import { SITE } from '../core/site';
import { I18n } from '../i18n/i18n';
import { Icon } from '../ui/icon';
import { PhotoSlot } from '../ui/photo-slot';

/** S5. Everything a visitor who can't ask for directions needs to reach the stall. */
@Component({
  selector: 'section[app-find]',
  imports: [Icon, PhotoSlot],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'find', class: 'section section--linen', 'aria-labelledby': 'find-heading' },
  template: `
    <div class="container">
      <h2 id="find-heading" class="section-title">{{ i18n.t('sections.find') }}</h2>

      <div class="grid find">
        <div class="find__stall">
          <p class="meta-label">{{ i18n.t('find.stall') }}</p>
          <p class="find__stall-number">
            <app-icon name="pin" />
            @if (site.stallNumber) {
              {{ site.stallNumber }}
            } @else {
              <span class="todo">TODO T1 stall no.</span>
            }
          </p>
        </div>

        <div class="find__photos">
          <app-photo-slot
            file="stall-front.jpg"
            ratio="3:2"
            [alt]="i18n.t('photos.stallFront')"
            sizes="(min-width: 64rem) 42rem, 100vw"
          />
          <app-photo-slot
            file="stall-approach.jpg"
            ratio="3:2"
            [alt]="i18n.t('photos.stallApproach')"
            sizes="(min-width: 64rem) 42rem, 100vw"
          />
        </div>

        <div class="find__info">
          <div>
            <h3 class="meta-label">{{ i18n.t('find.directions') }}</h3>
            @if (directions(); as text) {
              <p>{{ text }}</p>
            } @else {
              <p><span class="todo">TODO T11 directions</span></p>
            }
          </div>
          <div>
            <h3 class="meta-label">{{ i18n.t('common.hours') }}</h3>
            @if (hours(); as lines) {
              @for (line of lines; track line) {
                <p>{{ line }}</p>
              }
            } @else {
              <p><span class="todo">TODO T2 hours</span></p>
            }
          </div>
          <iframe
            class="find__map"
            [src]="mapSrc()"
            [title]="i18n.t('find.mapTitle')"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
          <a class="button button--secondary" [href]="site.mapsUrl">
            <app-icon name="pin" />
            {{ i18n.t('find.openMaps') }}
          </a>
        </div>
      </div>
    </div>
  `,
  styles: `
    .find__stall-number {
      --icon-size: 1.75rem;
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: var(--text-2xl);
      font-weight: var(--weight-semibold);
      line-height: 1.2;
    }
    .find__photos,
    .find__info {
      display: grid;
      gap: var(--space-4);
      align-content: start;
      justify-items: start;
    }
    .find__info {
      gap: var(--space-6);
    }
    .find__info > * {
      inline-size: 100%;
    }
    .find__info > .button {
      inline-size: auto;
    }
    .find__photos app-photo-slot {
      inline-size: 100%;
    }
    .find__map {
      aspect-ratio: 4 / 3;
      inline-size: 100%;
      border: 1px solid var(--rule);
    }

    @media (min-width: 64rem) {
      .find__photos {
        grid-column: 1 / 8;
        grid-row: 1 / 3;
      }
      .find__stall,
      .find__info {
        grid-column: 8 / 13;
      }
      .find__map {
        aspect-ratio: 1;
      }
    }
  `,
})
export class Find {
  protected readonly i18n = inject(I18n);
  private readonly sanitizer = inject(DomSanitizer);
  protected readonly site = SITE;

  protected readonly directions = computed(() => CONTENT.directions?.[this.i18n.locale().code] ?? null);

  protected readonly hours = computed(() =>
    SITE.hours ? formatHours(SITE.hours, this.i18n.locale().code) : null,
  );

  /** T10: the owner's "Embed a map" URL once supplied; a pin at the coordinates until then. */
  protected readonly mapSrc = computed(() => {
    const { lat, lng } = SITE.coordinates;
    const url =
      SITE.mapsEmbedUrl ??
      `https://www.google.com/maps?q=${lat},${lng}&z=18&hl=${this.i18n.locale().code}&output=embed`;
    // Built only from content/site.json, never from user input.
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });
}

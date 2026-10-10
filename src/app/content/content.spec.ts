import { existsSync, readFileSync } from 'node:fs';
import { CONTENT } from './content';
import { parsePriceList } from '../core/pricing';
import { validTestimonials } from '../core/testimonials';
import { LOCALES } from '../i18n/locales';

describe('content', () => {
  it('noindex meta and header agree', () => {
    expect(CONTENT.noindex).toBe(true);
    expect(/X-Robots-Tag: noindex/.test(readFileSync('public/_headers', 'utf8'))).toBe(CONTENT.noindex);
  });

  it('passes the same validation as real content', () => {
    expect(() => validTestimonials(CONTENT.testimonials, true)).not.toThrow();
    expect(parsePriceList(CONTENT.pricing).items.length).toBeGreaterThan(0);
  });

  it('has five hero slides', () => {
    expect(CONTENT.heroPhotos.length).toBe(5);
  });

  it('fills three gallery pages with unique photos', () => {
    expect(CONTENT.workPhotos.length).toBe(24);
    expect(new Set(CONTENT.workPhotos.map((p) => p.file)).size).toBe(24);
  });

  it('has directions for every locale', () => {
    expect(Object.keys(CONTENT.directions ?? {}).sort()).toEqual(LOCALES.map((l) => l.code).sort());
  });

  it('has a photo on disk for every slot', () => {
    const slots = [
      ...CONTENT.heroPhotos,
      'stall-front.jpg',
      'stall-approach.jpg',
      'process-1-tu-van.jpg',
      'process-2-chon-vai.jpg',
      'process-3-so-do.jpg',
      'process-4-thu-giao.jpg',
      ...CONTENT.workPhotos.map((p) => p.file),
    ];
    expect(Object.keys(CONTENT.photos).sort()).toEqual(slots.sort());
    for (const base of Object.values(CONTENT.photos)) {
      expect(existsSync(base.replace(/^img\//, 'photos/') + '.jpg')).toBe(true);
    }
  });
});

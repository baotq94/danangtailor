/**
 * The site's content. Launched with sample content on the owner's decision
 * (2026-09-17): the stall number, address, hours, directions and reviews are
 * placeholders, and the photos are Unsplash (photos/CREDITS.md), not her work.
 * Replace each with the real thing (docs/plan.md, T1–T12), then set noindex: false.
 */
import pricing from '../../../content/pricing.json';
import site from '../../../content/site.json';
import type { WorkPhoto } from '../photos/placeholders';
import type { Content } from './content-types';

/** Five hero slides. */
const HERO = ['hero.jpg', 'hero-2.jpg', 'hero-3.jpg', 'hero-4.jpg', 'hero-5.jpg'];

/** 24 photos: three pages of 8 in the work gallery. */
const WORK: readonly WorkPhoto[] = [
  { id: 'work-ao-dai-01', file: 'work/ao-dai-01.jpg', category: 'ao-dai' },
  { id: 'work-ao-dai-02', file: 'work/ao-dai-02.jpg', category: 'ao-dai' },
  { id: 'work-cach-tan-01', file: 'work/cach-tan-01.jpg', category: 'cach-tan' },
  { id: 'work-ao-dai-03', file: 'work/ao-dai-03.jpg', category: 'ao-dai' },
  { id: 'work-vest-01', file: 'work/vest-01.jpg', category: 'vest' },
  { id: 'work-ao-dai-04', file: 'work/ao-dai-04.jpg', category: 'ao-dai' },
  { id: 'work-cach-tan-02', file: 'work/cach-tan-02.jpg', category: 'cach-tan' },
  { id: 'work-ao-dai-05', file: 'work/ao-dai-05.jpg', category: 'ao-dai' },
  { id: 'work-cach-tan-03', file: 'work/cach-tan-03.jpg', category: 'cach-tan' },
  { id: 'work-ao-dai-06', file: 'work/ao-dai-06.jpg', category: 'ao-dai' },
  { id: 'work-ao-dai-07', file: 'work/ao-dai-07.jpg', category: 'ao-dai' },
  { id: 'work-cach-tan-04', file: 'work/cach-tan-04.jpg', category: 'cach-tan' },
  { id: 'work-ao-dai-08', file: 'work/ao-dai-08.jpg', category: 'ao-dai' },
  { id: 'work-vest-02', file: 'work/vest-02.jpg', category: 'vest' },
  { id: 'work-ao-dai-09', file: 'work/ao-dai-09.jpg', category: 'ao-dai' },
  { id: 'work-cach-tan-05', file: 'work/cach-tan-05.jpg', category: 'cach-tan' },
  { id: 'work-ao-dai-10', file: 'work/ao-dai-10.jpg', category: 'ao-dai' },
  { id: 'work-cach-tan-06', file: 'work/cach-tan-06.jpg', category: 'cach-tan' },
  { id: 'work-ao-dai-11', file: 'work/ao-dai-11.jpg', category: 'ao-dai' },
  { id: 'work-ao-dai-12', file: 'work/ao-dai-12.jpg', category: 'ao-dai' },
  { id: 'work-cach-tan-07', file: 'work/cach-tan-07.jpg', category: 'cach-tan' },
  { id: 'work-vest-03', file: 'work/vest-03.jpg', category: 'vest' },
  { id: 'work-ao-dai-13', file: 'work/ao-dai-13.jpg', category: 'ao-dai' },
  { id: 'work-cach-tan-08', file: 'work/cach-tan-08.jpg', category: 'cach-tan' },
];

export const CONTENT: Content = {
  site: {
    ...site,
    zaloIsSample: true,
    stallNumber: '12',
    address: 'Quầy 12, 123 Đường Mẫu, Đà Nẵng',
    hours: [{ days: [1, 2, 3, 4, 5, 6, 7], open: '06:30', close: '19:00' }],
  },
  pricing: { ...pricing, placeholder: false },
  /** Sample content: keep out of search results until it is real. */
  noindex: true,
  yearsOfExperience: 25,
  directions: {
    vi: 'Địa chỉ mẫu: quầy 12, 123 Đường Mẫu, Đà Nẵng. Vui lòng liên hệ để xác nhận địa điểm trước khi đến.',
    ko: '예시 주소: 다낭 예시 거리 123번지, 12번 가게. 방문 전에 연락하여 실제 위치를 확인해 주세요.',
    en: 'Sample address: stall 12, 123 Example Street, Da Nang. Please contact us to confirm the location before visiting.',
  },
  testimonials: [
    {
      id: 'sample-naver-1',
      quote: '한시장에서 아오자이를 맞췄는데 다음 날 바로 찾았어요. 사이즈도 딱 맞고 사장님이 정말 친절하셨어요!',
      quoteLang: 'ko',
      author: '지현',
      platform: 'Naver Blog',
      sourceUrl: 'https://blog.naver.com/',
    },
    {
      id: 'sample-google-1',
      quote: 'Had an áo dài made in 24h for our wedding photos in Hội An. Perfect fit, beautiful silk, and a very fair price.',
      quoteLang: 'en',
      author: 'Emily R.',
      platform: 'Google Maps',
      sourceUrl: site.mapsUrl,
    },
    {
      id: 'sample-google-2',
      quote: 'Cô may kỹ, đo rất chuẩn. Áo dài mặc Tết ai cũng khen.',
      quoteLang: 'vi',
      author: 'Ngọc Anh',
      platform: 'Google Maps',
      sourceUrl: site.mapsUrl,
    },
    {
      id: 'sample-trip-1',
      quote: 'Found the stall easily with the directions. She helped me choose the fabric and the modern áo dài was ready the next afternoon.',
      quoteLang: 'en',
      author: 'Mark T.',
      platform: 'TripAdvisor',
      sourceUrl: 'https://www.tripadvisor.com/',
    },
    {
      id: 'sample-naver-2',
      quote: '가족 여행 기념으로 엄마랑 딸 아오자이를 같이 맞췄어요. 원단 종류가 많아서 고르는 재미가 있었어요.',
      quoteLang: 'ko',
      author: '수민맘',
      platform: 'Naver Blog',
      sourceUrl: 'https://blog.naver.com/',
    },
  ],
  heroPhotos: HERO,
  workPhotos: WORK,
  photos: Object.fromEntries(
    [
      ...HERO,
      'stall-front.jpg',
      'stall-approach.jpg',
      'process-1-tu-van.jpg',
      'process-2-chon-vai.jpg',
      'process-3-so-do.jpg',
      'process-4-thu-giao.jpg',
      ...WORK.map((p) => p.file),
    ].map((file) => [file, `img/${file.replace(/\.jpg$/, '')}`]),
  ),
};

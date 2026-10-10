/** Photo slot types. Phase 3 replaces these with photos/manifest.json. */
export type Ratio = '3:2' | '4:5' | '1:1';
export type WorkCategory = 'ao-dai' | 'cach-tan' | 'vest';

export interface WorkPhoto {
  readonly id: string;
  readonly file: string;
  readonly category: WorkCategory;
}

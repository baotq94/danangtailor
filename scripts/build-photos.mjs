// Converts the site photos (photos/**/*.jpg) to WebP at the widths PhotoSlot
// asks for, into .photos/ (gitignored). The build copies that folder to /img/;
// the source JPGs are never deployed.
//
//   photos/work/ao-dai-01.jpg → .photos/work/ao-dai-01-480.webp
//                               .photos/work/ao-dai-01-960.webp
//
// A width is written when the source is at least that wide, and the next width
// up is written at the source's own size, so 480 and 960 always exist and
// nothing is upscaled. Unchanged photos are skipped.
// Runs before `npm start` and `npm run build`, or on its own: npm run photos
//
// Phase 3 grows this into the real pipeline (photos/manifest.json, alt checks).

import { mkdir, readdir, stat } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const input = join(root, 'photos');
const output = join(root, '.photos');

/** Keep in sync with PHOTO_WIDTHS in src/app/ui/photo-slot.ts. */
const WIDTHS = [480, 960, 1600];
const QUALITY = 74;

async function* jpgs(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* jpgs(path);
    else if (/\.jpe?g$/i.test(entry.name)) yield path;
  }
}

async function mtime(path) {
  try {
    return (await stat(path)).mtimeMs;
  } catch {
    return 0;
  }
}

let written = 0;
let skipped = 0;
let inBytes = 0;
let outBytes = 0;

for await (const source of jpgs(input)) {
  const base = join(output, relative(input, source)).replace(/\.jpe?g$/i, '');
  const { width } = await sharp(source).metadata();
  const widths = WIDTHS.filter((w, i) => i < 2 || WIDTHS[i - 1] < width);
  const sourceTime = await mtime(source);
  inBytes += (await stat(source)).size;

  await mkdir(dirname(base), { recursive: true });
  for (const w of widths) {
    const target = `${base}-${w}.webp`;
    if ((await mtime(target)) < sourceTime) {
      await sharp(source)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 5 })
        .toFile(target);
      written++;
    } else {
      skipped++;
    }
    if (w === 960) outBytes += (await stat(target)).size;
  }
}

const kb = (n) => `${Math.round(n / 1024)} KB`;
console.log(
  `photos: ${written} written, ${skipped} up to date · JPG sources ${kb(inBytes)} → WebP 960w ${kb(outBytes)}`,
);

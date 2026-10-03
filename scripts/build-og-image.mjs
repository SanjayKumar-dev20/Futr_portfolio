/**
 * Futr Markets — social preview image.
 *
 * index.html, every route via src/lib/seo.js, and both deployment header files
 * all point at `/og.jpg`. The file did not exist, so every link to this site
 * shared on LinkedIn, WhatsApp, Slack or X rendered with a blank or
 * grey-placeholder card — the most visible possible defect, on the one asset
 * nobody sees while testing the site itself because the browser never requests
 * it.
 *
 * This builds it from the hero poster, which is the frame the site already
 * opens on, so the card and the page agree.
 *
 * 1200×630 is the size every major platform crops toward (1.91:1). The poster
 * is 16:9, so it is scaled to cover and centre-cropped rather than letterboxed
 * — a letterboxed card reads as a mistake.
 *
 * JPEG rather than WebP: WhatsApp and several older crawlers still will not
 * render a WebP preview, and this is the one file whose entire job is being
 * displayed by somebody else's software.
 *
 *   npm run build:og
 */
import { execFileSync } from 'node:child_process'
import { existsSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import ffmpeg from 'ffmpeg-static'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE = join(ROOT, 'public', 'video', 'hero-poster.webp')
const OUTPUT = join(ROOT, 'public', 'og.jpg')

const WIDTH = 1200
const HEIGHT = 630

if (!existsSync(SOURCE)) {
  console.error(`Missing source: ${SOURCE}`)
  process.exit(1)
}

/*
  scale=...:force_original_aspect_ratio=increase then crop is the "cover"
  behaviour CSS gives you for free. Without the increase/crop pair ffmpeg
  squashes 16:9 into 1.91:1 and every face in the frame comes out narrow.

  A slight darkening (eq=brightness) is applied because platforms overlay the
  page title in white directly on top of this image, and the hero's upper half
  is bright enough in places that the text loses contrast.
*/
const filters = [
  `scale=${WIDTH}:${HEIGHT}:force_original_aspect_ratio=increase`,
  `crop=${WIDTH}:${HEIGHT}`,
  'eq=brightness=-0.04:saturation=1.05',
].join(',')

console.log(`Building ${WIDTH}×${HEIGHT} social card from hero-poster.webp…`)

execFileSync(
  ffmpeg,
  [
    '-y',
    '-i', SOURCE,
    '-vf', filters,
    // Without these, the image2 muxer expects a numbered sequence and warns
    // that `og.jpg` has no `%03d` in it. It writes the file anyway, which is
    // the worst kind of warning: correct output, alarming log.
    '-frames:v', '1',
    '-update', '1',
    // 4:2:0 and the baseline profile: a progressive or 4:4:4 JPEG is rejected
    // by more preview crawlers than you would expect.
    '-pix_fmt', 'yuvj420p',
    // q:v 4 lands around 90 kB here. Several platforms refuse images over
    // 5 MB and downsample over ~1 MB, so there is no reason to go bigger.
    '-q:v', '4',
    OUTPUT,
  ],
  { stdio: ['ignore', 'ignore', 'inherit'] }
)

const kb = Math.round(statSync(OUTPUT).size / 1024)
console.log(`Wrote public/og.jpg (${kb} kB)`)

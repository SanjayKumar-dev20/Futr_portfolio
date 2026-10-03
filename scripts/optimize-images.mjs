/**
 * Futr Markets — image pipeline
 *
 * `fetch-images.mjs` pulls raw JPEGs from the source. They arrive big: 5.5 MB
 * across the set, with a single 1.1 MB shopkeeper portrait sitting just below
 * the fold on the home page. This converts the set to WebP at the size each
 * slot actually renders at.
 *
 * WebP rather than AVIF: AVIF would be another ~25% smaller, but encoding is
 * minutes per image with this ffmpeg build and support is meaningfully lower.
 * WebP is ~97% supported — and critically, a browser that can't decode it is
 * also a browser that won't be running this site's CSS masks and blend modes,
 * so a JPEG fallback would buy nothing real.
 *
 * Sizes are per-slot, not uniform: a full-bleed panel genuinely needs 1600px,
 * a masked cut-out that is 40% dissolved does not.
 *
 * Reads image-source/*.jpg and writes public/images/*.webp.
 *
 *   npm run optimize:images
 *   npm run optimize:images -- --force     # re-encode even if output exists
 */
import { execFileSync } from 'node:child_process'
import { readdirSync, statSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname, parse } from 'node:path'
import { fileURLToPath } from 'node:url'
import ffmpeg from 'ffmpeg-static'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
// Sources live outside public/ so Vite never copies them into dist/ —
// shipping both formats was putting 5.5 MB of unused JPEGs in the deploy.
const SRC = join(ROOT, 'image-source')
const OUT = join(ROOT, 'public', 'images')

/** Rendered width per slot. Anything not listed falls back to 1400. */
const WIDTHS = {
  // Split panels. These are half-width on desktop (~715px at the 1440px
  // container) and full-width on phones, so 1300 covers 2× on mobile and
  // comfortably over 1.5× on desktop. 1600 was costing 200 kB for detail no
  // display resolves.
  'manufacturing-floor': 1300,
  shopkeeper: 1300,
  'loading-truck': 1300,

  // Mid-size editorial blocks.
  'manufacturing-machine': 1300,
  'packaging-warehouse': 1200,
  'kirana-store': 1200,
  'street-commerce': 1200,
  'retail-shelves': 1200,
  'produce-seller': 1200,
  'delivery-fleet': 1200,

  // Cut-outs: masked, desaturated and ~40% dissolved at the edges. Detail
  // past this point is destroyed by the treatment before anyone sees it.
  'cutout-owner': 1100,
  'cutout-entrepreneur': 1100,
  'cutout-founder': 1100,
  'cutout-bridge': 1100,
}

const QUALITY = 74
const force = process.argv.includes('--force')
const kb = (p) => statSync(p).size / 1024

mkdirSync(OUT, { recursive: true })

const sources = existsSync(SRC)
  ? readdirSync(SRC).filter((f) => /\.jpe?g$/i.test(f))
  : []

if (!sources.length) {
  console.error('No JPEGs in image-source/ — run `npm run fetch:images` first.')
  process.exit(1)
}

let before = 0
let after = 0
let skipped = 0

for (const file of sources) {
  const { name } = parse(file)
  const src = join(SRC, file)
  const out = join(OUT, `${name}.webp`)

  if (!force && existsSync(out)) {
    skipped++
    before += kb(src)
    after += kb(out)
    continue
  }

  const width = WIDTHS[name] ?? 1400

  execFileSync(ffmpeg, [
    '-hide_banner', '-loglevel', 'error', '-y',
    '-i', src,
    '-vf', `scale='min(${width},iw)':-2:flags=lanczos`,
    '-c:v', 'libwebp',
    '-quality', String(QUALITY),
    '-compression_level', '6',
    '-preset', 'photo',
    out,
  ])

  const b = kb(src)
  const a = kb(out)
  before += b
  after += a
  console.log(
    `  ${name.padEnd(24)} ${b.toFixed(0).padStart(5)} KB → ${a.toFixed(0).padStart(4)} KB` +
      `  (−${(100 - (a / b) * 100).toFixed(0)}%)`
  )
}

console.log(
  `\n${sources.length - skipped} encoded, ${skipped} skipped.` +
    `\nTotal ${(before / 1024).toFixed(2)} MB → ${(after / 1024).toFixed(2)} MB` +
    `  (−${(100 - (after / before) * 100).toFixed(0)}%)\n`
)

/**
 * Futr Markets — hero video pipeline
 *
 * The source clip ships from the generator at 1920×1080 with an audio track:
 * ~10.7 MB for eight seconds. That is heavier than every other asset on the
 * site combined, for a loop that plays muted behind text. This script turns it
 * into something shippable:
 *
 *   · audio stripped entirely — it is a muted background, the track is dead weight
 *   · scaled to 1600px wide — nothing above that is visible under the scrim
 *   · H.264 only. A VP9/WebM variant was tried and came out at 4.31 MB against
 *     H.264's 2.37 MB: this footage is dark and full of fine particles, which
 *     VP9 handles badly at matched quality. Shipping it would hand Chrome and
 *     Firefox the *larger* file, so there is one output and every browser gets
 *     the same one.
 *   · `faststart` so the moov atom is at the front and playback begins on the
 *     first chunk instead of after the whole file lands
 *   · a poster frame, so the hero has something to show before the first byte
 *     of video arrives
 *
 *   npm run optimize:video                 # uses video/source/hero-loop-source.mp4
 *   npm run optimize:video -- <path.mp4>   # or point it at a new source
 *
 * Outputs land in public/video/. Keep the source out of public/ so the
 * unoptimised file is never served.
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, statSync, existsSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ffmpeg from 'ffmpeg-static'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'public', 'video')
const DEFAULT_SOURCE = join(ROOT, 'video-source', 'hero-loop-source.mp4')

const source = resolve(process.argv[2] || DEFAULT_SOURCE)

if (!existsSync(source)) {
  console.error(`\nSource not found: ${source}`)
  console.error('Pass one explicitly:  npm run optimize:video -- "C:\\path\\to\\clip.mp4"\n')
  process.exit(1)
}

mkdirSync(OUT, { recursive: true })

const mb = (p) => (statSync(p).size / 1024 / 1024).toFixed(2)
const run = (args) => execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args])

// Even dimensions are required by the encoder; -2 lets ffmpeg derive height.
// 1440 rather than 1600: the hero is 1440px at the design's max container
// width, and the clip sits behind a heavy scrim at reduced contrast. The step
// down is invisible and worth ~0.6 MB.
const SCALE = 'scale=1440:-2:flags=lanczos'

console.log(`\nsource  ${mb(source)} MB  ${source}`)

/* ── H.264 — the baseline every browser plays ─────────────────────────────
   CRF 28 is high for general video but this clip is dark, low-detail and sits
   under a scrim at reduced opacity; the banding that would show on a bright
   scene is invisible here. */
const mp4 = join(OUT, 'hero-loop.mp4')
run([
  '-i', source,
  '-an',                        // drop audio
  '-vf', SCALE,
  '-c:v', 'libx264',
  '-profile:v', 'high',
  '-crf', '30',
  '-preset', 'veryslow',
  '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart',
  mp4,
])
console.log(`mp4     ${mb(mp4)} MB`)

/* ── Mobile variant ───────────────────────────────────────────────────────
   On a phone the hero is ~390px wide and the video sits under a heavier
   scrim, so 1600px is pure waste on a connection that can least afford it.
   HeroVideo picks between the two with a media query rather than <source
   media>, which browsers honour inconsistently inside <video>. */
const mp4Small = join(OUT, 'hero-loop-sm.mp4')
run([
  '-i', source,
  '-an',
  '-vf', 'scale=960:-2:flags=lanczos',
  '-c:v', 'libx264',
  '-profile:v', 'main',
  '-crf', '30',
  '-preset', 'slower',
  '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart',
  mp4Small,
])
console.log(`mp4-sm  ${mb(mp4Small)} MB`)

/* ── Poster — first frame, shown until the video can paint ──────────────
   WebP, not JPEG: this is preloaded at high priority in index.html and is on
   the critical path to first paint, and the same frame costs ~40 kB here
   against ~163 kB as a JPEG. */
const poster = join(OUT, 'hero-poster.webp')
run([
  '-i', source,
  '-vf', 'scale=1440:-2:flags=lanczos',
  '-frames:v', '1',
  '-c:v', 'libwebp',
  '-quality', '72',
  '-preset', 'photo',
  poster,
])
console.log(`poster  ${mb(poster)} MB`)

console.log(
  `\nFirst-load cost — desktop ${(Number(mb(mp4)) + Number(mb(poster))).toFixed(2)} MB, ` +
    `mobile ${(Number(mb(mp4Small)) + Number(mb(poster))).toFixed(2)} MB ` +
    `(source was ${mb(source)} MB)\n`
)

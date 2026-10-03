/**
 * Futr Markets — image acquisition
 *
 * Downloads the Indian-market photography set into public/images/.
 *
 * These are LICENSED PLACEHOLDERS (Unsplash License — free for commercial use,
 * no attribution required). They were chosen to satisfy the client's brief:
 *
 *   "I want to be realistic with the images that are used — this image looks
 *    like we are a very big company — I am a small company now — but it should
 *    convey the base emotion"
 *
 * So: real Indian kirana shops, small textile units, handcart logistics and
 * owner-operators. No glass-tower boardrooms, no generic startup stock.
 *
 * These land in image-source/, NOT public/. They are build inputs:
 * `npm run optimize:images` converts them to the WebP files the site actually
 * serves. Anything inside public/ is copied verbatim into dist/, and shipping
 * both formats put 5.5 MB of unused JPEGs into the deploy.
 *
 * To swap in the client's own photography, drop files with the SAME basenames
 * into image-source/ and re-run the optimizer — src/data/images.js resolves by
 * filename, so no component changes are needed.
 *
 *   npm run fetch:images && npm run optimize:images
 */
import { mkdir, writeFile, access } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'image-source')

/** id = unsplash photo id, w = target width, name = output filename */
const SET = [
  // ── Manufacturers ────────────────────────────────────────────────────────
  { name: 'manufacturing-floor', id: 'photo-1741591648176-5c759ca268b8', w: 1800,
    note: 'Textile manufacturing floor — small Indian production unit' },
  { name: 'manufacturing-machine', id: 'photo-1741275273537-e172e1411b3a', w: 1400,
    note: 'Operator at machinery' },
  { name: 'packaging-warehouse', id: 'photo-1741275269731-83526786bb93', w: 1400,
    note: 'Packaged goods being handled in a warehouse' },

  // ── Businesses / retail ──────────────────────────────────────────────────
  { name: 'shopkeeper', id: 'photo-1695391396401-5fbb4bedafc1', w: 1800,
    note: 'Shop owner, arms crossed, inside his own store' },
  { name: 'kirana-store', id: 'photo-1751901173169-1ca6df2a5f11', w: 1400,
    note: 'Elderly owner in a small traditional shop' },
  { name: 'street-commerce', id: 'photo-1753184863498-72e77c60888b', w: 1400,
    note: 'Snacks and drinks counter' },
  { name: 'retail-shelves', id: 'photo-1624831466206-5b15053baabb', w: 1400,
    note: 'Packed FMCG shelving' },
  { name: 'produce-seller', id: 'photo-1769598250411-815c984c33c3', w: 1400,
    note: 'Vegetable seller at his stock' },

  // ── Supply / logistics ───────────────────────────────────────────────────
  { name: 'loading-truck', id: 'photo-1764116858779-f314ee1feb03', w: 1800,
    note: 'Goods being loaded onto a truck by hand' },
  { name: 'delivery-fleet', id: 'photo-1739066483940-f575a515ca68', w: 1400,
    note: 'Small commercial vehicles' },

  // ── People — cut-out-on-dark treatment ───────────────────────────────────
  { name: 'cutout-owner', id: 'photo-1729157661483-ed21901ed892', w: 1400,
    note: 'Owner leaning, arms crossed — primary dark-background cut-out' },
  { name: 'cutout-entrepreneur', id: 'photo-1756990909835-f934f6177ab9', w: 1400,
    note: 'Young owner-operator seated at his own stock — Futr X' },
  { name: 'cutout-founder', id: 'photo-1752861653044-b1abf5848bc0', w: 1400,
    note: 'Young founder portrait' },
  { name: 'cutout-bridge', id: 'photo-1667655787062-b675b26d5c4b', w: 1400,
    note: 'Figure on a bridge — momentum / forward motion' },
]

const url = ({ id, w }) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=78`

const exists = (p) => access(p).then(() => true, () => false)

async function main () {
  await mkdir(OUT, { recursive: true })
  const force = process.argv.includes('--force')
  let got = 0, skipped = 0, failed = 0

  for (const item of SET) {
    const dest = join(OUT, `${item.name}.jpg`)
    if (!force && await exists(dest)) {
      skipped++
      console.log(`  skip   ${item.name}.jpg (exists)`)
      continue
    }
    try {
      const res = await fetch(url(item))
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const buf = Buffer.from(await res.arrayBuffer())
      await writeFile(dest, buf)
      got++
      console.log(`  ok     ${item.name}.jpg  ${(buf.length / 1024).toFixed(0)} KB`)
    } catch (err) {
      failed++
      console.error(`  FAIL   ${item.name}.jpg — ${err.message}`)
    }
  }

  console.log(`\n${got} downloaded, ${skipped} skipped, ${failed} failed → image-source/`)
  if (got) console.log('Next: npm run optimize:images')
  if (failed) process.exitCode = 1
}

main()

/**
 * Central image manifest.
 *
 * Every photograph the site uses is named here once. Components never hardcode
 * a path — so replacing the placeholder set with the client's own photography
 * is a matter of dropping files with the same names into public/images/.
 *
 * Paths point at .webp. The JPEGs that `npm run fetch:images` downloads are
 * build inputs, not deliverables: `npm run optimize:images` converts them and
 * .gitignore keeps the originals out of the repo. The set went from 5.5 MB to
 * 2.1 MB that way, and the home page's single heaviest image — the shopkeeper
 * portrait — from 1112 kB to 445 kB.
 *
 * The current set is licensed placeholder photography (Unsplash License, free
 * for commercial use) selected against the client's brief: Indian owner-
 * operators, small textile units, kirana shops and handcart logistics. The
 * explicit instruction was *not* to look like a large corporation.
 */
const base = `${import.meta.env.BASE_URL}images`

export const IMAGES = {
  manufacturingFloor: {
    src: `${base}/manufacturing-floor.webp`,
    alt: 'Workers on the floor of a textile manufacturing unit, finished goods stacked on the line',
  },
  // Doubles as a cut-out subject: busy mid-tone background, lit figure.
  manufacturingMachine: {
    src: `${base}/manufacturing-machine.webp`,
    alt: 'An operator running production machinery on a garment manufacturing line',
  },
  packagingWarehouse: {
    src: `${base}/packaging-warehouse.webp`,
    alt: 'Packaged goods being handled in a warehouse',
  },
  shopkeeper: {
    src: `${base}/shopkeeper.webp`,
    alt: 'A shop owner standing in his own store beside stocked shelves',
  },
  kiranaStore: {
    src: `${base}/kirana-store.webp`,
    alt: 'A shopkeeper at the counter of a small neighbourhood store',
  },
  streetCommerce: {
    src: `${base}/street-commerce.webp`,
    alt: 'A small retail counter stocked with packaged goods',
  },
  retailShelves: {
    src: `${base}/south-india-wholesale.webp`,
    alt: 'A modern wholesale distribution center in South India, with local business operators reviewing stock',
  },
  produceSeller: {
    src: `${base}/produce-seller.webp`,
    alt: 'A seller beside his stock of fresh produce',
  },
  loadingTruck: {
    src: `${base}/loading-truck.webp`,
    alt: 'Goods being loaded onto a delivery truck by hand',
  },
  deliveryFleet: {
    src: `${base}/delivery-fleet.webp`,
    alt: 'Small commercial delivery vehicles',
  },
  cutoutOwner: {
    src: `${base}/cutout-owner.webp`,
    alt: 'A business owner standing with arms crossed',
  },
  // NOTE: shot on a white studio seamless, so it does NOT survive the cut-out
  // treatment — the backdrop reads as a grey rectangle. Usable as a plain
  // editorial image only. See HANDOVER.md for the photography direction.
  cutoutEntrepreneur: {
    src: `${base}/cutout-entrepreneur.webp`,
    alt: 'A young owner-operator seated beside his stock',
  },
  cutoutFounder: {
    src: `${base}/cutout-founder.webp`,
    alt: 'A young founder',
  },
  cutoutBridge: {
    src: `${base}/cutout-bridge.webp`,
    alt: 'A figure walking forward across a bridge',
  },
}

export default IMAGES

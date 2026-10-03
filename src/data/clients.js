/**
 * Clientele.
 *
 * The client asked: "Hopefully we can add some logos of our clientele."
 * The marquee that renders this list is built and wired — it is empty on
 * purpose until real logos arrive, because shipping invented client names
 * would be a false claim on a live corporate site.
 *
 * To switch it on, drop logo files into public/clients/ and add entries:
 *
 *   export const CLIENTS = [
 *     { name: 'Acme Foods',  logo: '/clients/acme-foods.svg' },
 *     { name: 'Bharat Retail', logo: '/clients/bharat-retail.svg' },
 *   ]
 *
 * Supply mono/single-colour SVGs where possible — the marquee renders them at
 * 60% opacity and lifts to full on hover, which only reads cleanly on flat art.
 * Target height is 28px; width is free.
 */
export const CLIENTS = []

/**
 * Sector coverage. This is true today and is what the comp's trust rail shows,
 * so it carries the section until named logos land.
 */
export const SECTORS = [
  { label: 'Retail', icon: 'store' },
  { label: 'Supermarkets', icon: 'basket' },
  { label: 'Restaurants', icon: 'cutlery' },
  { label: 'Food & Beverage', icon: 'bottle' },
  { label: 'Personal Care', icon: 'drop' },
  { label: 'Household', icon: 'home' },
  { label: 'Industrial', icon: 'gear' },
]

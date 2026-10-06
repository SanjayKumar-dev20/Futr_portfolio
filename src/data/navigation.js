/**
 * Site navigation.
 *
 * The client's note was literally `Base | Futr Difference | .....` — so the
 * home item is labelled "Base", not "Home". The footer still says "Home" in
 * the Explore column because that column is a sitemap, not the primary nav.
 */
export const NAV = [
  { label: 'Base', to: '/' },
  { label: 'The Futr Difference', to: '/difference' },
  { label: "Let's Grow", to: '/grow' },
  { label: 'Shop', to: '/shop' },
  { label: 'Futr Pulse', to: '/pulse' },
  { label: 'Invest Futr', to: '/invest' },
]

export const PRIMARY_CTA = { label: 'Talk to Us', to: '/talk' }

/**
 * The three ways into Futr, as offered on the Talk page.
 *
 * Here rather than inside the Talk component because two unrelated places need
 * the same labels: the page renders them as the path toggle, and the enquiry
 * store writes the chosen one into the subject line of the notification the
 * administrator receives. Keeping one list means the inbox can never disagree
 * with the button the visitor actually pressed.
 */
export const CONTACT_PATHS = [
  { id: 'manufacturer', label: 'Manufacturer' },
  { id: 'business', label: 'Business' },
  { id: 'investor', label: 'Investor' },
]

export const CONTACT_PATH_LABEL = Object.fromEntries(
  CONTACT_PATHS.map(({ id, label }) => [id, label])
)

export const FOOTER_EXPLORE = [
  { label: 'Home', to: '/' },
  { label: 'The Futr Difference', to: '/difference' },
  { label: "Let's Grow", to: '/grow' },
  { label: 'Manufacturers', to: '/manufacturers' },
  { label: 'Futr X', to: '/futr-x' },
  { label: 'Shop', to: '/shop' },
  { label: 'Futr Pulse', to: '/pulse' },
  { label: 'Invest Futr', to: '/invest' },
  { label: 'Talk', to: '/talk' },
]

/* Placeholders — flagged in HANDOVER.md as client-supplied content. */
export const CONTACT = {
  email: 'info@futrmarkets.com',
  phone: '+91 00000 00000',
  address: 'Chennai, Tamil Nadu, India',
}

/**
 * The hrefs derived from CONTACT.
 *
 * Here rather than at each call site because the derivation is not obvious and
 * was previously written out by hand in two places, with a rule
 * (`replace(/\s/g, '')`) that is not quite right: RFC 3966 wants a `tel:`
 * value of digits and a leading `+` only, so a number later written as
 * `+91 (044) 1234-5678` would have kept its brackets and dash and failed to
 * dial on some handsets. Stripping to `[0-9+]` is correct for every format the
 * client might paste in.
 */
export const CONTACT_LINKS = {
  email: `mailto:${CONTACT.email}`,
  phone: `tel:${CONTACT.phone.replace(/[^\d+]/g, '')}`,
}

export const SOCIAL = [
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' },
  { label: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
  { label: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
  { label: 'YouTube', href: 'https://youtube.com', icon: 'youtube' },
]

export const LEGAL = [
  { label: 'Privacy', to: '/privacy' },
  { label: 'Terms', to: '/terms' },
  { label: 'Sitemap', href: `${import.meta.env.BASE_URL}sitemap.xml` },
]

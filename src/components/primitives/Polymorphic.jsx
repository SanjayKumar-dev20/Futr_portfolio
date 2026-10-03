import { Link } from 'react-router-dom'

/**
 * One control, three possible elements.
 *
 * Every interactive thing in this design system — primary CTA, secondary CTA,
 * text link, circle arrow — has to be able to render as an internal route, an
 * external link, or a plain button, and must behave identically either way.
 * That substitutability is the whole point: a caller swaps `to` for `onClick`
 * and nothing else about the component changes.
 *
 * It lived privately inside buttons/index.jsx. It is a primitive, so it lives
 * with the primitives, where non-button controls can use it too.
 *
 * Resolution order is deliberate:
 *   `as`   — force an element. Needed when the control is already inside an
 *            anchor and nesting another would be invalid markup.
 *   `to`   — internal route.
 *   `href` — external link, or a mailto:/tel: scheme.
 *   else   — a real <button type="button">, never a clickable <div>.
 */

/**
 * Schemes a link in this design system is allowed to use.
 *
 * Every href in the app funnels through this component, which makes it the one
 * place where the question "could this URL execute something?" has to be
 * answered. Today every href is a literal in src/data — so nothing here is
 * exploitable right now. It is written anyway because the moment one of them
 * becomes dynamic — a social URL moved into config.json, a CTA driven by a
 * CMS, a link built from a query parameter — `javascript:alert(1)` in an href
 * is script execution on the page, and it bypasses the Content-Security-Policy
 * entirely. Putting the check at the choke point means that change stays safe
 * without anyone having to remember this.
 */
const SAFE_SCHEMES = ['http:', 'https:', 'mailto:', 'tel:']

/** Only http(s) should open a new tab. A new tab for mailto: leaves a blank one behind. */
const NEW_TAB_SCHEMES = ['http:', 'https:']

function describeHref(href) {
  if (typeof href !== 'string') return { safe: false, newTab: false }

  const trimmed = href.trim()

  // Same-document and same-origin relative links: no scheme to abuse.
  if (trimmed.startsWith('/') || trimmed.startsWith('#') || trimmed.startsWith('?')) {
    return { safe: true, newTab: false }
  }

  try {
    const { protocol } = new URL(
      trimmed,
      typeof window !== 'undefined' ? window.location.origin : 'https://futrmarkets.com'
    )
    return {
      safe: SAFE_SCHEMES.includes(protocol),
      newTab: NEW_TAB_SCHEMES.includes(protocol) && /^[a-z][a-z0-9+.-]*:/i.test(trimmed),
    }
  } catch {
    return { safe: false, newTab: false }
  }
}

export default function Polymorphic({ to, href, as: As, children, ...rest }) {
  if (As) {
    return <As {...rest}>{children}</As>
  }

  if (to) {
    return (
      <Link to={to} {...rest}>
        {children}
      </Link>
    )
  }

  if (href) {
    const { safe, newTab } = describeHref(href)

    // A link we will not follow must not look like one. Rendering a disabled
    // button keeps the layout and the label intact — the alternative, dropping
    // the href and leaving a live-looking anchor, is worse than either.
    if (!safe) {
      if (import.meta.env.DEV) {
        console.error(`[futr] Blocked an unsafe link scheme: ${href}`)
      }
      return (
        <button type="button" disabled {...rest}>
          {children}
        </button>
      )
    }

    return (
      <a
        href={href}
        {...(newTab ? { target: '_blank', rel: 'noreferrer noopener' } : null)}
        {...rest}
      >
        {children}
      </a>
    )
  }

  return (
    <button type="button" {...rest}>
      {children}
    </button>
  )
}

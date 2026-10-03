import { IconMail, IconPhone, IconPin } from '../icons'
import { CONTACT, CONTACT_LINKS } from '../../data/navigation'

/**
 * Email / phone / address, as a list.
 *
 * This existed twice — as `ContactRow` in the footer and `Direct` on the Talk
 * page — in two copies that had already drifted apart: different icon sizes,
 * different row spacing, and two separate hand-written `tel:` transforms. They
 * render the same three facts, so a change to any of them (and all three are
 * placeholders waiting on the client) had to be made in two files, in two
 * slightly different shapes, to land everywhere.
 *
 * `tone` is explicit rather than inferred from the surface. The two call sites
 * sit on opposite backgrounds, and a control that guesses its own contrast is
 * a control that is silently wrong somewhere you are not looking.
 */

const TONES = {
  /** On the dark footer. */
  dark: {
    link: 'text-mist hover:text-white',
    static: 'text-mist',
  },
  /** On the light Talk page. */
  light: {
    link: 'text-ink hover:text-red',
    static: 'text-ash',
  },
}

export default function ContactDetails({
  tone = 'dark',
  iconSize = 17,
  className = '',
  spacing = 'space-y-3.5',
}) {
  const rows = [
    { key: 'email', icon: <IconMail size={iconSize} />, href: CONTACT_LINKS.email, text: CONTACT.email },
    { key: 'phone', icon: <IconPhone size={iconSize} />, href: CONTACT_LINKS.phone, text: CONTACT.phone },
    { key: 'address', icon: <IconPin size={iconSize} />, href: null, text: CONTACT.address },
  ]

  return (
    <ul className={`${spacing} ${className}`}>
      {rows.map(({ key, icon, href, text }) => (
        <ContactRow key={key} tone={tone} icon={icon} href={href}>
          {text}
        </ContactRow>
      ))}
    </ul>
  )
}

function ContactRow({ tone, icon, href, children }) {
  const palette = TONES[tone] ?? TONES.dark

  const body = (
    <>
      <span className="mt-0.5 shrink-0 text-red">{icon}</span>
      <span>{children}</span>
    </>
  )

  /*
    `py-1 -my-1` on the link rather than on the <li>. The row's text is 14px,
    which leaves a 17px-tall tap target — under the 24px WCAG 2.2 asks for, and
    well under the ~44px a thumb actually wants. The padding grows the hit area
    to 24px; the negative margin takes the extra height back out of the flow so
    the visual rhythm of the list is unchanged.
  */
  return (
    <li>
      {href ? (
        <a
          href={href}
          className={`-my-1 flex items-start gap-3 py-1 t-small transition-colors duration-300 ${palette.link}`}
        >
          {body}
        </a>
      ) : (
        <span className={`flex items-start gap-3 t-small ${palette.static}`}>{body}</span>
      )}
    </li>
  )
}

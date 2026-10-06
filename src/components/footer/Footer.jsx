import { Link } from 'react-router-dom'
import Logo from '../brand/Logo'
import { SOCIAL_ICONS } from '../icons'
import WireGlobe from '../graphics/WireGlobe'
import ContactDetails from '../contact/ContactDetails'
import { FOOTER_EXPLORE, LEGAL, SOCIAL } from '../../data/navigation'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden surface-void on-dark grain">
      {/* The dotted globe that sits bottom-right of the footer in the comp */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-30 mask-fade-b" />
        <WireGlobe
          variant="mark"
          id="fm-footer-globe"
          nodeCount={34}
          lats={[-60, -36, -12, 12, 36, 60]}
          longs={[0, 30, 60, 90, 120, 150]}
          className="absolute -right-16 -bottom-24 h-[26rem] w-[26rem] text-white/[0.09] md:right-[6%] md:-bottom-32 md:h-[30rem] md:w-[30rem]"
        />
      </div>

      {/* Asymmetric block padding on purpose. The columns need air above them,
          but the bottom bar supplies its own `py-6` immediately below — so a
          matching 24 here stacked into roughly 120px of empty footer before the
          copyright line, which is the "excessive bottom padding" note. */}
      <div className="fm-container relative pb-14 pt-20 md:pb-16 md:pt-24">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Column 1 — Brand */}
          <div className="lg:col-span-4">
            {/* Matched to the navbar's resting size so the mark reads the same
                weight at both ends of the page. */}
            <Logo variant="light" height={48} />
            <p className="mt-7 max-w-[22ch] text-[0.9375rem] font-medium leading-snug">
              Transforming Markets
              <br />
              with <span className="text-red">Direct Commerce</span>.
            </p>
            <p className="mt-5 max-w-[34ch] t-small text-mist">
              Reshaping how trade works through smarter supply, direct connections
              and shared growth.
            </p>
          </div>

          {/* Column 2 — Explore */}
          <nav aria-label="Footer" className="lg:col-span-2">
            <FooterHeading>Explore</FooterHeading>
            {/*
              `inline-block py-1 -my-1` on each link. A 14px label is a 17px
              tall anchor, which is both under the 24px WCAG 2.2 asks for and
              an unpleasantly thin thing to hit with a thumb. The padding grows
              the target; the matching negative margin pulls the extra height
              back out so the list keeps the spacing it was designed with.
            */}
            <ul className="mt-5 space-y-2.5">
              {FOOTER_EXPLORE.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="-my-1 inline-block py-1 t-small text-mist transition-colors duration-300 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3 — Connect */}
          <div className="lg:col-span-3">
            <FooterHeading>Connect</FooterHeading>
            <ContactDetails tone="dark" iconSize={17} className="mt-5" />
          </div>

          {/* Column 4 — Social */}
          <div className="lg:col-span-3">
            <FooterHeading>Follow Us</FooterHeading>
            <ul className="mt-5 space-y-3.5">
              {SOCIAL.map(({ label, href, icon }) => {
                const Icon = SOCIAL_ICONS[icon]
                return (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group inline-flex items-center gap-3 t-small text-mist transition-colors duration-300 hover:text-white"
                    >
                      <span className="grid h-8 w-8 place-items-center rounded-full border border-white/15 transition-colors duration-300 group-hover:border-red group-hover:text-red">
                        <Icon size={15} />
                      </span>
                      {label}
                    </a>
                  </li>
                )
              })}
            </ul>

            <p className="mt-10 text-[0.9375rem] font-medium leading-snug text-white/85">
              Building Brands.
              <br />
              Optimizing Markets.
              <br />
              Capturing Value.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10">
        <div className="fm-container flex flex-col gap-4 py-6 text-xs text-ash sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Futr Markets. All rights reserved.</p>
          {/* 12px labels — the thinnest targets on the site. Same treatment. */}
          <ul className="-my-1.5 flex items-center gap-6">
            {LEGAL.map((item) => {
              const className =
                'inline-block py-1.5 transition-colors duration-300 hover:text-white'
              return (
                <li key={item.label}>
                  {item.to ? (
                    <Link to={item.to} className={className}>
                      {item.label}
                    </Link>
                  ) : (
                    <a href={item.href} className={className}>
                      {item.label}
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </footer>
  )
}

const FooterHeading = ({ children }) => (
  <h2 className="t-eyebrow text-white/45">{children}</h2>
)

import { useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import Logo from '../brand/Logo'
import { PrimaryCTA } from '../buttons'
import { IconClose, IconMenu } from '../icons'
import { NAV, PRIMARY_CTA } from '../../data/navigation'
import { useFocusTrap, useScrollLock, useScrolled } from '../../hooks'
import { useUIStore, selectMenuOpen, selectNavTone } from '../../stores/ui'

export default function Navbar() {
  const scrolled = useScrolled()
  // Shared rather than local: the overlay renders from it, the router closes
  // it, and the scroll-lock effect reads it.
  const open = useUIStore(selectMenuOpen)
  const navTone = useUIStore(selectNavTone)
  const toggleMenu = useUIStore((s) => s.toggleMenu)
  const closeMenu = useUIStore((s) => s.closeMenu)
  const { pathname } = useLocation()

  // The hamburger is also the close button, so it has to stay reachable from
  // inside the trap — see useFocusTrap.
  const toggleRef = useRef(null)
  const menuRef = useRef(null)

  useScrollLock(open)
  useFocusTrap(open, { containerRef: menuRef, extraRefs: [toggleRef] })

  // Close on route change and on Escape.
  useEffect(() => closeMenu(), [pathname, closeMenu])
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && closeMenu()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, closeMenu])

  // The hero is dark, so the bar starts transparent with white type and only
  // adopts a surface once the user has scrolled past it. A page that opens on a
  // light surface says so (useNavTone) and gets the solid treatment from the
  // first frame — otherwise its white wordmark and white links are drawn on
  // #f7f7f5 and are, quite literally, invisible.
  const solid = scrolled || open || navTone === 'light'

  return (
    <>
      <header
        className={[
          'fixed inset-x-0 top-0 z-[90] transition-[background-color,backdrop-filter,border-color,height]',
          'duration-500 [transition-timing-function:var(--ease-out-quint)]',
          solid
            ? 'border-b border-white/10 bg-void/85 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent',
        ].join(' ')}
      >
        {/*
          Three slots: brand, links, actions.

          The links used to be `absolute left-1/2 -translate-x-1/2`, which
          centres them on the *window* — not between the two things either side
          of them. The wordmark is ~90px wide and the CTA ~140px, so the gap the
          menu sits in is lopsided by that difference and the whole row read as
          shunted left, which is the review note. Making the nav the flex row's
          only growing child centres it in the space that is actually left over,
          which is what "perfectly between the logo and Talk to Us" means.

          Both outer slots are `shrink-0`: letting them compress would hand the
          asymmetry straight back at tablet widths.
        */}
        <div
          className={`fm-container relative flex items-center gap-6 transition-[height] duration-500 ${
            solid ? 'h-[4.5rem] md:h-20' : 'h-[var(--nav-h)]'
          }`}
        >
          {/*
            Brand.

            Sized in CSS, not through the `height` attribute, because the bar
            itself is not one height: `--nav-h` is 5.5rem on desktop and 4rem on
            a phone. A single 44px mark is right in an 88px bar and crowded in a
            64px one, with 10px of clearance top and bottom. A CSS `height`
            outranks the presentational attribute, and `w-auto` lets the width
            follow the viewBox rather than being pinned by the attribute — so
            the proportions are preserved at every step.

            The `height` prop stays as the intrinsic size, which is what the
            browser uses to reserve space before the stylesheet applies.
          */}
          <NavLink to="/" aria-label="Futr Markets — home" className="shrink-0">
            <Logo
              variant="light"
              height={44}
              className={`w-auto transition-all duration-500 ${
                solid ? 'h-8 md:h-9 lg:h-10' : 'h-8 md:h-10 lg:h-11'
              }`}
            />
          </NavLink>

          {/* Desktop nav */}
          <nav
            aria-label="Primary"
            className="hidden min-w-0 flex-1 justify-center lg:flex"
          >
            <ul className="flex items-center gap-6 xl:gap-9">
              {NAV.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      [
                        'group relative block py-2 text-[0.8125rem] font-medium tracking-[0.01em] transition-colors duration-300',
                        isActive ? 'text-white' : 'text-white/65 hover:text-white',
                      ].join(' ')
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.label}
                        {/* active-page indicator */}
                        <span
                          aria-hidden
                          className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-red transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] ${
                            isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                          }`}
                        />
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/*
            Right cluster.

            There was a search button here. It had no handler, no results view
            and nothing to search — the site has no index. To a sighted user it
            read as a feature that was broken; to a screen-reader user it
            announced "Search, button" and then did nothing at all when
            pressed. A control that cannot do its job is worse than its absence,
            so it is gone until there is something to search. Re-adding it is a
            handful of lines once that exists.
          */}
          <div className="ml-auto flex shrink-0 items-center gap-2 md:gap-4 lg:ml-0">
            <PrimaryCTA to={PRIMARY_CTA.to} size="md" className="hidden sm:inline-flex">
              {PRIMARY_CTA.label}
            </PrimaryCTA>

            <button
              ref={toggleRef}
              type="button"
              onClick={toggleMenu}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="grid h-10 w-10 place-items-center rounded-full text-white transition-colors duration-300 hover:bg-white/10 lg:hidden"
            >
              {open ? <IconClose size={22} /> : <IconMenu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <MobileMenu ref={menuRef} open={open} onClose={closeMenu} />
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Full-screen overlay nav. Items stagger in; the panel itself wipes down.
   ───────────────────────────────────────────────────────────────────────── */
function MobileMenu({ ref, open, onClose }) {
  return (
    <div
      ref={ref}
      id="mobile-nav"
      aria-hidden={!open}
      /*
        `inert`, not just `aria-hidden` and `pointer-events-none`.

        The panel is hidden with clip-path, so while closed it is invisible but
        fully laid out — its six links and its CTA stayed in the tab order. A
        keyboard user tabbing down the page landed in a menu they could not
        see, with no way to tell where focus had gone. `pointer-events-none`
        never helped: that is a mouse control.

        It is also an ARIA violation on its own terms. `aria-hidden="true"`
        over focusable content is the axe `aria-hidden-focus` rule — the node
        is removed from the accessibility tree while still being focusable, so
        a screen reader announces focus landing on nothing.

        `inert` is the one attribute that covers all of it: not focusable, not
        clickable, not in the accessibility tree, not findable by browser
        search. React 19 renders it as a real boolean, so `inert={false}`
        correctly omits the attribute rather than writing `inert="false"` —
        which would be the attribute *present*, permanently disabling the menu.
      */
      inert={!open}
      className={`fixed inset-0 z-[85] lg:hidden ${open ? '' : 'pointer-events-none'}`}
    >
      {/* panel */}
      <div
        className={[
          'absolute inset-0 surface-void grain overflow-hidden',
          'transition-[clip-path] duration-700 [transition-timing-function:var(--ease-out-expo)]',
          open ? '[clip-path:inset(0_0_0%_0)]' : '[clip-path:inset(0_0_100%_0)]',
        ].join(' ')}
      >
        <div aria-hidden className="absolute inset-0 bg-grid text-white opacity-25 mask-fade" />
        <div
          aria-hidden
          className="glow-red absolute -right-24 top-1/3 h-80 w-80 opacity-35"
        />

        <nav
          aria-label="Mobile"
          className="fm-container relative h-full overflow-y-auto pt-[calc(var(--nav-h)+1rem)] pb-6"
        >
          <div className="mx-auto flex min-h-full w-full max-w-[34rem] flex-col justify-center py-5">
            <div className="mb-5">
              <p className="t-eyebrow text-red">Explore Futr</p>
              <p className="mt-2 text-sm text-mist">Choose where you want to go.</p>
            </div>

            <ul className="divide-y divide-white/10 border-y border-white/10">
              {NAV.map((item, i) => (
                <li key={item.to} className="overflow-hidden">
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      [
                        'group flex items-center justify-between gap-4 py-3.5 transition-[transform,opacity,color] duration-500 [transition-timing-function:var(--ease-out-expo)]',
                        isActive ? 'text-white' : 'text-white/75 hover:text-white',
                        open ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0',
                      ].join(' ')
                    }
                    style={{ transitionDelay: `${open ? 100 + i * 45 : 0}ms` }}
                  >
                    <span className="flex min-w-0 items-center gap-4">
                      <span className="t-eyebrow shrink-0 text-red/75">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[1.125rem] font-semibold leading-snug tracking-[-0.015em] sm:text-[1.25rem]">
                        {item.label}
                      </span>
                    </span>
                    <span aria-hidden className="text-base text-white/35 transition-colors group-hover:text-red">
                      ↗
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>

            <div
              className="mt-6 flex flex-col gap-4 transition-[transform,opacity] duration-500 [transition-timing-function:var(--ease-out-expo)] sm:flex-row sm:items-center sm:justify-between"
              style={{
                transitionDelay: `${open ? 100 + NAV.length * 45 : 0}ms`,
                transform: open ? 'none' : 'translateY(16px)',
                opacity: open ? 1 : 0,
              }}
            >
              <div>
                <p className="text-sm font-medium text-white">Have a project in mind?</p>
                <p className="mt-1 text-xs text-mist">Let’s find the right way forward.</p>
              </div>
              <PrimaryCTA to={PRIMARY_CTA.to} size="md" onClick={onClose} className="w-full sm:w-auto">
                {PRIMARY_CTA.label}
              </PrimaryCTA>
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}

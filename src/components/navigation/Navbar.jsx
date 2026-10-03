import { useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import Logo from '../brand/Logo'
import { PrimaryCTA } from '../buttons'
import { IconClose, IconMenu } from '../icons'
import { NAV, PRIMARY_CTA } from '../../data/navigation'
import { useFocusTrap, useScrollLock, useScrolled } from '../../hooks'
import { useUIStore, selectMenuOpen } from '../../stores/ui'

export default function Navbar() {
  const scrolled = useScrolled()
  // Shared rather than local: the overlay renders from it, the router closes
  // it, and the scroll-lock effect reads it.
  const open = useUIStore(selectMenuOpen)
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
  // adopts a surface once the user has scrolled past it.
  const solid = scrolled || open

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
        <div
          className={`fm-container flex items-center justify-between transition-[height] duration-500 ${
            solid ? 'h-16 md:h-[4.5rem]' : 'h-[var(--nav-h)]'
          }`}
        >
          {/* Brand */}
          <NavLink to="/" aria-label="Futr Markets — home" className="shrink-0">
            <Logo variant="light" height={solid ? 26 : 30} className="transition-all duration-500" />
          </NavLink>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-8">
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
          <div className="flex items-center gap-2 md:gap-4">
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
        <div aria-hidden className="absolute inset-0 bg-grid text-white opacity-40 mask-fade" />
        <div
          aria-hidden
          className="glow-red absolute -right-24 top-1/3 h-80 w-80 opacity-60"
        />

        <nav
          aria-label="Mobile"
          className="fm-container relative flex h-full flex-col overflow-y-auto pt-[var(--nav-h)] pb-8"
        >
          <ul className="my-auto space-y-1">
            {NAV.map((item, i) => (
              <li key={item.to} className="overflow-hidden">
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      'block py-3 text-[2rem] font-bold leading-tight tracking-[-0.03em]',
                      'transition-[transform,opacity,color] duration-700 [transition-timing-function:var(--ease-out-expo)]',
                      isActive ? 'text-red' : 'text-white',
                      open ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0',
                    ].join(' ')
                  }
                  style={{ transitionDelay: `${open ? 140 + i * 65 : 0}ms` }}
                >
                  <span className="t-eyebrow mr-4 align-middle text-red/70">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div
            className="mt-12 transition-[transform,opacity] duration-700 [transition-timing-function:var(--ease-out-expo)]"
            style={{
              transitionDelay: `${open ? 140 + NAV.length * 65 : 0}ms`,
              transform: open ? 'none' : 'translateY(24px)',
              opacity: open ? 1 : 0,
            }}
          >
            <PrimaryCTA to={PRIMARY_CTA.to} size="lg" onClick={onClose} className="w-full sm:w-auto">
              {PRIMARY_CTA.label}
            </PrimaryCTA>
            <p className="mt-8 t-small text-mist">
              Building Brands. Optimizing Markets. Capturing Value.
            </p>
          </div>
        </nav>
      </div>
    </div>
  )
}

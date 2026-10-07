import { create } from 'zustand'

/**
 * Cross-component UI state.
 *
 * Only things that genuinely have more than one owner live here. The mobile
 * menu qualifies: the navbar toggles it, the overlay renders from it, the
 * router closes it on navigation, and the body scroll-lock effect reads it.
 * Threading that through props would mean lifting it to App and passing it
 * down two unrelated branches.
 *
 * Things that are NOT here, deliberately: a video's `canPlay`, a field's
 * `touched`, a section's `inView`. Those have exactly one owner and belong in
 * that component. Hoisting them would buy indirection and nothing else.
 */
export const useUIStore = create((set) => ({
  menuOpen: false,

  /**
   * What the navbar is sitting on at scroll position zero.
   *
   * The bar starts transparent with white type because every hero on the site
   * is a dark full-bleed band — except Talk, which opens straight onto the
   * bone-coloured form so the enquiry is above the fold. There the white
   * wordmark and white links landed on #f7f7f5 and disappeared entirely until
   * the visitor scrolled.
   *
   * This qualifies for the store on the same test as `menuOpen`: the page
   * declares it and a sibling component three branches away renders from it.
   * Driving it off a hardcoded list of pathnames inside Navbar would work until
   * the next light page is added and nobody remembers the list exists.
   */
  navTone: 'dark', // 'dark' = dark hero behind the bar | 'light' = light surface

  openMenu: () => set({ menuOpen: true }),
  closeMenu: () => set({ menuOpen: false }),
  toggleMenu: () => set((s) => ({ menuOpen: !s.menuOpen })),
  setNavTone: (navTone) => set({ navTone }),
}))

export const selectMenuOpen = (s) => s.menuOpen
export const selectNavTone = (s) => s.navTone

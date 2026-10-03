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

  openMenu: () => set({ menuOpen: true }),
  closeMenu: () => set({ menuOpen: false }),
  toggleMenu: () => set((s) => ({ menuOpen: !s.menuOpen })),
}))

export const selectMenuOpen = (s) => s.menuOpen

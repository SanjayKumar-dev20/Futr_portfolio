/**
 * Line icon set — 24×24, 1.5 stroke, square-ish joins.
 *
 * Drawn rather than pulled from a library so the weight matches Montserrat's
 * stroke and the whole UI reads as one system. `currentColor` throughout.
 */
const S = ({ children, size = 24, className = '', ...rest }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    className={className}
    {...rest}
  >
    {children}
  </svg>
)

/* ── Core brand motifs ──────────────────────────────────────────────────── */

export const IconCube = (p) => (
  <S {...p}>
    <path d="M12 2.6 20.5 7v10L12 21.4 3.5 17V7z" />
    <path d="M3.5 7 12 11.6 20.5 7M12 11.6v9.8" />
  </S>
)

export const IconTruck = (p) => (
  <S {...p}>
    <path d="M1.8 6.2h11.4v9.6H1.8z" />
    <path d="M13.2 9.4h3.9l3.1 3.2v3.2h-7z" />
    <circle cx="6.4" cy="18" r="2.1" />
    <circle cx="16.8" cy="18" r="2.1" />
    <path d="M8.5 18h6.2M1.8 18h2.5" />
  </S>
)

/** Three nodes joined to one — the "cutting out the middlemen" mark. */
export const IconNetwork = (p) => (
  <S {...p}>
    <circle cx="12" cy="4.4" r="2.2" />
    <circle cx="4.8" cy="19.2" r="2.2" />
    <circle cx="19.2" cy="19.2" r="2.2" />
    <path d="M12 6.6v5.2M12 11.8 6.2 17.5M12 11.8l5.8 5.7" />
  </S>
)

export const IconFactory = (p) => (
  <S {...p}>
    <path d="M2.8 20.4V9.6l5.4 3.4V9.6l5.4 3.4V6.2h4.2l1.4 14.2z" />
    <path d="M2.8 20.4h18.4" />
  </S>
)

export const IconStore = (p) => (
  <S {...p}>
    <path d="M3.4 9.6V20h17.2V9.6" />
    <path d="M2.4 9.6 4.2 4h15.6l1.8 5.6a3 3 0 0 1-5.4 1.8 3 3 0 0 1-5.4 0 3 3 0 0 1-5.4 0 3 3 0 0 1-3-1.8Z" />
    <path d="M9.6 20v-5.6h4.8V20" />
  </S>
)

export const IconUsers = (p) => (
  <S {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M2.8 20.2a6.2 6.2 0 0 1 12.4 0" />
    <path d="M16.2 5.2a3.2 3.2 0 0 1 0 6M17.6 14.6a6.2 6.2 0 0 1 3.6 5.6" />
  </S>
)

/* ── Opportunity strip ──────────────────────────────────────────────────── */

export const IconArrowDownCircle = (p) => (
  <S {...p}>
    <circle cx="12" cy="12" r="9.2" />
    <path d="M12 7.6v8.8M8.4 12.8 12 16.4l3.6-3.6" />
  </S>
)

export const IconBolt = (p) => (
  <S {...p}>
    <path d="M13.4 2.4 4.6 13.6h6.2l-1.2 8 8.8-11.2h-6.2z" />
  </S>
)

export const IconChart = (p) => (
  <S {...p}>
    <path d="M4 20.2V13M9.4 20.2V7.4M14.8 20.2v-9M20.2 20.2V4.2" />
  </S>
)

export const IconCommunity = (p) => (
  <S {...p}>
    <circle cx="12" cy="6.4" r="2.6" />
    <circle cx="5.4" cy="15.6" r="2.4" />
    <circle cx="18.6" cy="15.6" r="2.4" />
    <path d="M9.4 9.8 7 13.4M14.6 9.8 17 13.4M8 17.6h8" />
  </S>
)

/* ── Sectors ────────────────────────────────────────────────────────────── */

export const IconBasket = (p) => (
  <S {...p}>
    <path d="M3 9.4h18l-1.8 10.2H4.8z" />
    <path d="m8.2 9.4 2.2-5M15.8 9.4l-2.2-5M9.6 13v3.2M14.4 13v3.2" />
  </S>
)

export const IconCutlery = (p) => (
  <S {...p}>
    <path d="M6.6 3v7.2a2.4 2.4 0 0 0 4.8 0V3M9 10.2V21M16.4 3c-1.4 1.2-2 3-2 5.2 0 1.8.7 2.8 2 3.2V21" />
  </S>
)

export const IconBottle = (p) => (
  <S {...p}>
    <path d="M10 2.6h4v3.2l1.9 2.6a4 4 0 0 1 .7 2.3v9.1a1.8 1.8 0 0 1-1.8 1.8H9.2a1.8 1.8 0 0 1-1.8-1.8v-9.1a4 4 0 0 1 .7-2.3L10 5.8z" />
    <path d="M7.4 13.6h9.2" />
  </S>
)

export const IconDrop = (p) => (
  <S {...p}>
    <path d="M12 2.8c3.4 4 5.6 6.8 5.6 9.6a5.6 5.6 0 1 1-11.2 0c0-2.8 2.2-5.6 5.6-9.6Z" />
  </S>
)

export const IconHome = (p) => (
  <S {...p}>
    <path d="M3.4 10.4 12 3.4l8.6 7v10.2H3.4z" />
    <path d="M9.6 20.6v-6.2h4.8v6.2" />
  </S>
)

export const IconGear = (p) => (
  <S {...p}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 2.6v2.8M12 18.6v2.8M21.4 12h-2.8M5.4 12H2.6M18.6 5.4l-2 2M7.4 16.6l-2 2M18.6 18.6l-2-2M7.4 7.4l-2-2" />
  </S>
)

/* ── Utility ────────────────────────────────────────────────────────────── */

export const IconSearch = (p) => (
  <S {...p}>
    <circle cx="10.8" cy="10.8" r="6.6" />
    <path d="m15.6 15.6 4.4 4.4" />
  </S>
)

export const IconMail = (p) => (
  <S {...p}>
    <rect x="2.8" y="5" width="18.4" height="14" rx="2" />
    <path d="m3.6 6.4 8.4 6 8.4-6" />
  </S>
)

export const IconPhone = (p) => (
  <S {...p}>
    <path d="M7.6 3.4h-3A1.6 1.6 0 0 0 3 5.2C3 13.8 10.2 21 18.8 21a1.6 1.6 0 0 0 1.8-1.6v-3l-4-1.6-2 2a13.6 13.6 0 0 1-5.4-5.4l2-2z" />
  </S>
)

export const IconPin = (p) => (
  <S {...p}>
    <path d="M12 21.4s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
    <circle cx="12" cy="10.2" r="2.6" />
  </S>
)

export const IconMenu = (p) => (
  <S {...p}>
    <path d="M3.5 7.5h17M3.5 16.5h17" />
  </S>
)

export const IconClose = (p) => (
  <S {...p}>
    <path d="m5.5 5.5 13 13M18.5 5.5l-13 13" />
  </S>
)

export const IconArrowLeft = (p) => (
  <S {...p}>
    <path d="M19 12H5M10.5 6.5 5 12l5.5 5.5" />
  </S>
)

export const IconArrowRight = (p) => (
  <S {...p}>
    <path d="M5 12h14M13.5 6.5 19 12l-5.5 5.5" />
  </S>
)

/* ── Social (filled, matching the comp) ─────────────────────────────────── */

const F = ({ children, size = 18, className = '' }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden className={className}>
    {children}
  </svg>
)

export const IconLinkedIn = (p) => (
  <F {...p}>
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3zM10 9h3.8v1.7h.05a4.2 4.2 0 0 1 3.78-2.07c4.04 0 4.78 2.66 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.07 1.4-2.07 2.85V21h-4z" />
  </F>
)

export const IconInstagram = (p) => (
  <F {...p}>
    <path d="M12 2.2c-2.66 0-3 .01-4.04.06-1.04.05-1.75.21-2.37.46a4.8 4.8 0 0 0-1.73 1.13 4.8 4.8 0 0 0-1.13 1.73c-.25.62-.41 1.33-.46 2.37C2.21 9 2.2 9.34 2.2 12s.01 3 .06 4.04c.05 1.04.21 1.75.46 2.37a4.8 4.8 0 0 0 1.13 1.73c.5.5 1.01.82 1.73 1.13.62.25 1.33.41 2.37.46 1.04.05 1.38.06 4.04.06s3-.01 4.04-.06c1.04-.05 1.75-.21 2.37-.46a5 5 0 0 0 2.86-2.86c.25-.62.41-1.33.46-2.37.05-1.04.06-1.38.06-4.04s-.01-3-.06-4.04c-.05-1.04-.21-1.75-.46-2.37a4.8 4.8 0 0 0-1.13-1.73 4.8 4.8 0 0 0-1.73-1.13c-.62-.25-1.33-.41-2.37-.46C15 2.21 14.66 2.2 12 2.2Zm0 1.8c2.6 0 2.92.01 3.95.06.95.04 1.47.2 1.81.34.46.17.78.38 1.12.72.34.34.55.66.72 1.12.13.34.3.86.34 1.81.05 1.03.06 1.34.06 3.95s-.01 2.92-.06 3.95c-.04.95-.2 1.47-.34 1.81-.17.46-.38.78-.72 1.12-.34.34-.66.55-1.12.72-.34.13-.86.3-1.81.34-1.03.05-1.34.06-3.95.06s-2.92-.01-3.95-.06c-.95-.04-1.47-.2-1.81-.34-.46-.17-.78-.38-1.12-.72a3 3 0 0 1-.72-1.12c-.13-.34-.3-.86-.34-1.81C4.01 14.92 4 14.6 4 12s.01-2.92.06-3.95c.04-.95.2-1.47.34-1.81.17-.46.38-.78.72-1.12.34-.34.66-.55 1.12-.72.34-.13.86-.3 1.81-.34C9.08 4.01 9.4 4 12 4Zm0 3.06a4.94 4.94 0 1 0 0 9.88 4.94 4.94 0 0 0 0-9.88Zm0 8.15a3.21 3.21 0 1 1 0-6.42 3.21 3.21 0 0 1 0 6.42Zm6.29-8.35a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0Z" />
  </F>
)

export const IconFacebook = (p) => (
  <F {...p}>
    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.25 10.44 22v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22C18.34 21.25 22 17.08 22 12.06Z" />
  </F>
)

export const IconYouTube = (p) => (
  <F {...p}>
    <path d="M21.58 7.19a2.52 2.52 0 0 0-1.77-1.78C18.25 5 12 5 12 5s-6.25 0-7.81.41a2.52 2.52 0 0 0-1.77 1.78A26.3 26.3 0 0 0 2 12a26.3 26.3 0 0 0 .42 4.81 2.52 2.52 0 0 0 1.77 1.78C5.75 19 12 19 12 19s6.25 0 7.81-.41a2.52 2.52 0 0 0 1.77-1.78A26.3 26.3 0 0 0 22 12a26.3 26.3 0 0 0-.42-4.81ZM10 15.02V8.98L15.2 12z" />
  </F>
)

export const SOCIAL_ICONS = {
  linkedin: IconLinkedIn,
  instagram: IconInstagram,
  facebook: IconFacebook,
  youtube: IconYouTube,
}

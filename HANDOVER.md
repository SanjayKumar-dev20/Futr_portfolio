# Futr Markets — Handover

Status as of **2 Oct 2026**. Read alongside `README.md`.

**Source of truth:** `FM Website - Creative Framework.pdf` (repo root), the
client's own 27-page document. Copy, section order and tone all come from it.
`framework-extracted.txt` holds a searchable text version.

---

## 1. What the client asked for, and where it landed

Client messages, 28 Sep 2026:

| Client said | Where it is |
|---|---|
| "Colour there and general theme is Perfect" | Kept. Red/graphite/white, same section rhythm as the comp. |
| "We can use Mont or Poppins or Montserrat or Neue Montreal" | **Montserrat**, site-wide. Not a preference call — their own logo PDF embeds Montserrat Bold + Light, so it was already the brand face. |
| "I'll also share the Logo shortly" | Received. Decoded from the PDF; rebuilt as `src/components/brand/Logo.jsx`. Official red is `#FF0B2A`. |
| "Base \| Futr Difference \| ....." | Read as the nav bar with Home renamed. Nav is now **Base · The Futr Difference · Let's Grow · Shop · Futr Pulse · Invest Futr · [Talk to Us]**. See §4 — worth confirming. |
| "Some cut out of human like the one I had... dark background. This doesn't bring focus into the core emotion" | Built as a treatment, not a one-off: `CutoutFigure`. Used on the Home closing CTA and both Let's Grow panels. |
| "Be realistic with the images — this looks like a very big company, I'm a small company now, but it should convey the base emotion" | Whole photography set replaced with real Indian small-business operations. No skylines, no boardrooms, no glass towers. |
| "Hopefully we can add some logos of our clientele" | Marquee built and wired. **Ships switched off** — see §3. |

---

## 2. What is built

Every page is now built from the **Creative Framework PDF** (`FM Website -
Creative Framework.pdf`, archived in the repo root). That document — not the
derived markdown plan — is the authority for copy, section order and tone.
Extracted text is in `framework-extracted.txt` for searching.

| Page | Framework pages | Sections | State |
|---|---|---|---|
| Home ("Base") | 11–14 | 10 | Complete |
| The Futr Difference | 15–18 | 9 | Complete |
| Manufacturers | 19–21 | 8 | Complete |
| Futr X | 22–24 | 7 | Complete |
| Invest Futr | 25–27 | 8 | Complete |
| Let's Grow | 13 | 4 | Complete |
| Shop | 9–10 | 3 | Complete, catalogue empty |
| Futr Pulse | 9, 14 | 2 | Complete, articles empty |
| Talk | 9 | 3 | Complete |

Plus: design system, navbar + mobile menu, footer, page transitions,
Privacy/Terms structure, 404, per-route SEO, sitemap, robots, favicon.

The site uses the **system cursor**. A custom follower dot was built and then
removed at the client's request — it trailed the pointer, which reads as lag
however smoothly it is damped, and it carried no information the native cursor
did not already give. Interactive elements get an explicit `cursor: pointer`
instead (Tailwind v4's preflight leaves `<button>` on the browser default).

**Copy lives in `src/data/content/*.js`**, one module per page, so the client
can edit wording without touching components — the framework lists written
content as their deliverable.

**Two pages render a fallback until the client supplies content.** `Shop` and
`Futr Pulse` show the categories they will carry rather than invented products
or articles. Populate `src/data/products.js` / `src/data/articles.js` and the
grids take over automatically — no component changes.

**Not built, by design** (the framework's own Phase 1 exclusions, page 10):

- No e-commerce or payment gateway
- No real-time stock or pricing automation
- No third-party integrations or dynamic marketplaces
- No CMS — static data is right for v1

---

## 3. What we need from the client

### Blocking

| Item | Why |
|---|---|
| **Products** | `src/data/products.js` ships empty — the framework lists the catalogue as a Futr deliverable. Add entries (shape documented in the file) and the Shop grid replaces the category fallback automatically. |
| **Articles** | `src/data/articles.js` ships empty, same reason. Three to five pieces turns Futr Pulse from a categories page into a real hub. |
| **Clientele logos** | The marquee is built and wired to `src/data/clients.js`, which ships as an empty array on purpose — inventing client names on a live corporate site would be a false claim. Drop mono/single-colour SVGs into `public/clients/` and add `{ name, logo }` entries; the section turns on by itself. Target height 28px. |
| **Real contact details** | `src/data/navigation.js` currently has `info@futrmarkets.com`, `+91 00000 00000`, "Chennai, Tamil Nadu, India". All placeholders. |
| **Social URLs** | Same file — all four point at bare domains. |
| **Form backend** | **Enquiries are currently stored nowhere.** With nothing configured the form falls back to opening the visitor's mail client — which silently loses every enquiry from anyone on webmail or a phone without a mail app. **The client can switch this on themselves after handover without a developer:** hand them `CONTACT-FORM-SETUP.md`, which walks through creating a Google Sheet and editing two values in `config.json` on the server. No rebuild, no CLI. Verified end to end. |
| **Legal copy** | Privacy and Terms are structured with headings only. The clauses need Futr's actual position — jurisdiction, data controller, retention, governing law. The form collects personal data, so this is genuinely blocking, not cosmetic. See `SECURITY.md` §4. |

### Nice to have

- **Product photography** — one shot per SKU, to go with the catalogue data
- **Investor pack** — what can be shown publicly vs. sent on request. The
  framework mentions a "Download Investor Deck" CTA; the page currently routes
  that to the contact form instead.

### Photography — direction, not just a shot list

The placeholder set is doing a job, but two things matter when the real shoot
happens:

**For cut-out panels** (the treatment the client specifically asked for), the
subject must be photographed against something **dark or busy** — a factory
floor, a shop interior, a street. A figure shot on a white studio seamless
**cannot** be dissolved into graphite by CSS; the backdrop just reads as a grey
rectangle. There is a live example of this in the placeholder set:
`cutout-entrepreneur.jpg` is a studio portrait and is flagged as unusable for
cut-outs in `src/data/images.js`.

**Shot list** — replace by filename in `public/images/`, no code change needed:

| Filename | Subject |
|---|---|
| `manufacturing-floor.jpg` | A partner's production line, wide |
| `manufacturing-machine.jpg` | One operator at a machine — **cut-out candidate** |
| `packaging-warehouse.jpg` | Packing / despatch |
| `shopkeeper.jpg` | A retail customer in their own shop |
| `kirana-store.jpg` | Neighbourhood store interior |
| `street-commerce.jpg` | Counter trade |
| `retail-shelves.jpg` | Futr product on a real shelf |
| `produce-seller.jpg` | Market seller |
| `loading-truck.jpg` | Goods being loaded |
| `delivery-fleet.jpg` | Distribution vehicles |
| `cutout-owner.jpg` | Business owner, three-quarter — **cut-out** |
| `cutout-entrepreneur.jpg` | Young Futr X entrepreneur — **cut-out** |
| `cutout-founder.jpg` | Founder portrait — **cut-out** |
| `cutout-bridge.jpg` | Figure in motion, urban |

Landscape ~1800px wide; cut-out subjects portrait ~1400×2100.

---

## 4. Open questions

1. **"Base"** — read as the client's label for Home and implemented that way.
   If it meant something else (a section about the company's foundation, say),
   it is a one-line change in `src/data/navigation.js`.
2. **The Stitch link** is behind a Google sign-in, so it could not be opened.
   The build follows the ChatGPT comp for the home-page *layout* and the
   Creative Framework PDF for all *copy and section order*. If the Stitch file
   diverges from either, flag it.
3. **Legal entity name.** The framework's footer line reads "Futr Markets
   Commerce Accelerator LLP". The site currently renders "Futr Markets" —
   confirm which should appear in the copyright line.
4. **Fonts.** The framework deck is typeset in **Mont**; the logo PDF uses
   **Montserrat**, and the client listed both. The site uses Montserrat because
   that is what the logo artwork embeds. Worth a one-line confirmation.
5. **Domain** — `futrmarkets.com` is assumed throughout (canonical URLs,
   sitemap, OG tags). Confirm before launch.
6. **OG image** — `/og.jpg` is referenced but not yet created. Needs a 1200×630
   social card.

---

## 5. Performance

The home page is **2.6 MB** and fires `load` at **150 ms** on the production
build. Full breakdown and the reasoning behind each decision is in `README.md`
under *Performance*. Headlines:

- Three.js is no longer in the bundle at all (−885 kB) now the hero is video
- Fonts cut from 168 kB to 37 kB by dropping four unused subsets
- Photography converted to WebP: 5.5 MB → 1.8 MB
- The 1.4 MB hero video is deferred until after `load`; a preloaded poster
  frame carries the hero and crossfades out

If the site ever feels sluggish again, check **scroll feel before page weight**.
Lenis is configured with `lerp`, not `duration` — a duration-based config makes
the viewport trail the wheel by ~1 s, which reads as slowness even when the
frame rate is perfect.

## 6. Known gaps

- `public/og.jpg` does not exist yet (see §4).
- The hero video has no audio track by design, and no captions are needed —
  it is decorative and marked `aria-hidden`.
- No automated tests. For a site this size, visual review is the right check;
  if the Shop grows into real commerce, that changes.

---

## 7. Review checklist for the client

Per the plan, Home is the approval gate. Ask specifically about:

1. Colour balance — is red used as an accent, not a background?
2. Typography — Montserrat weights and the size jumps
3. Motion — is it "controlled and deliberate" or decorative?
4. The hero video loop — is it the right intensity behind the headline?
5. Section spacing and the light/dark rhythm
6. **The cut-out treatment** — this answers their specific note, so it needs a
   direct yes or no
7. Overall: does it read as a serious operator at their actual scale?

Once that is signed off, the remaining five pages are an application of the
system, not new design.

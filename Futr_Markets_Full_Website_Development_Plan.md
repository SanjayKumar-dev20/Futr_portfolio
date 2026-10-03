# Futr Markets — Premium Portfolio Website Development Plan

## 1. Project Overview

### Project
Futr Markets — Corporate / Brand Portfolio Website

### Objective

Transform the client's **Futr Markets Creative Framework PDF** into a premium, interactive, modern website that communicates:

- Direct Commerce
- Market optimization
- Efficient supply systems
- Manufacturer partnerships
- Business growth
- Investor opportunity
- Entrepreneurial networks
- Future-focused market infrastructure

The website should not feel like a PDF converted into web pages. It should feel like a **digital brand experience built from the strategy and visual language in the PDF**.

### Core Experience

> **Premium × Intelligent × Industrial × Future Commerce**

The visual experience should communicate:

- Confidence
- Momentum
- Precision
- Trust
- Control
- Progress

---

# 2. Source Creative Direction

The client PDF defines the Futr Markets personality as intelligent, efficient and forward-looking, balancing business precision with human warmth.

The visual direction is:

- Minimal but strong
- Modern and controlled
- Grid-based
- Generous spacing
- Strong typography
- Network / flow visuals
- Purposeful motion
- Contextual imagery
- Refined micro-interactions

The PDF specifically describes motion as controlled and deliberate, representing movement in markets rather than decorative animation.

---

# 3. Brand Color System

## Official Color Philosophy From Client PDF

### Red

Represents:

- Energy
- Action
- Opportunity
- CTAs
- Dynamic visual cues

Red should energize the design, not dominate it.

### Dark Grey / Near Black

Represents:

- Strength
- Professionalism
- Stability
- Trust

Used for:

- Headings
- Primary dark sections
- Navigation
- Institutional / investor sections

### White

Represents:

- Clarity
- Openness
- Transparency
- Breathing room
- Precision

---

## Implementation Color Tokens

> Note: The PDF defines the color philosophy and visual appearance but does not provide official HEX values. The following values are implementation recommendations based on the supplied visual direction and should be confirmed against the client's official brand assets.

```css
:root {
  --fm-red: #E51B2B;
  --fm-red-dark: #B81220;
  --fm-red-soft: #F45A65;

  --fm-black: #111111;
  --fm-graphite: #1B1B1D;
  --fm-dark: #242426;
  --fm-gray: #6B6B70;

  --fm-white: #FFFFFF;
  --fm-off-white: #F7F7F5;
  --fm-border: #E7E7E7;
}
```

## Suggested Visual Ratio

- 60–70% White / Off-white
- 20–30% Dark / Graphite
- 5–10% Red
- Minimal muted red

Red should be an accent, not the dominant background color.

---

# 4. Design Concept

## Main Concept

# Markets in Motion

The website should visually communicate:

```text
PRODUCT
   ↓
SUPPLY
   ↓
MARKET
   ↓
BUSINESS
   ↓
CUSTOMER
   ↓
GROWTH
```

This system becomes the foundation for:

- 3D graphics
- Grid systems
- Animated lines
- Network nodes
- Scroll transitions
- Process diagrams
- Page transitions
- Section backgrounds

---

# 5. Technology Stack

## Core

- React
- Vite
- Tailwind CSS
- Single global CSS architecture

## 3D

- Three.js
- React Three Fiber
- Drei

## Animation

- GSAP
- ScrollTrigger
- Framer Motion
- Lenis

## Recommended Responsibilities

| Technology | Responsibility |
|---|---|
| React | Component architecture |
| Vite | Build system |
| Tailwind CSS | Layout and responsive styling |
| Global CSS | Brand system, custom effects and utilities |
| Three.js | 3D market/network visuals |
| React Three Fiber | Three.js React integration |
| Drei | Three.js utilities |
| GSAP | Advanced animation |
| ScrollTrigger | Scroll-based storytelling |
| Framer Motion | UI and micro-interactions |
| Lenis | Smooth scrolling |

---

# 6. Animation Philosophy

Do not animate everything.

The client direction requires motion to be:

- Controlled
- Deliberate
- Purposeful
- Smooth
- Related to market movement
- Subtle enough to remain professional

## Motion Hierarchy

### Hero

High-impact animation.

### Main storytelling sections

Medium animation.

### Content sections

Low animation.

### Buttons / cards

Micro-interactions.

### Footer

Minimal animation.

---

# 7. Website Architecture

## Main Pages

1. Home
2. The Futr Difference
3. Let's Grow
4. Shop
5. Futr Pulse
6. Invest Futr
7. Talk

## Supporting Pages / Routes

- Manufacturers
- Futr X / Young Entrepreneurs
- Product Detail
- Article Detail
- Legal / Privacy
- Terms

---

# 8. Global Navigation

## Desktop Navigation

```text
FUTR MARKETS

The Futr Difference
Let's Grow
Shop
Futr Pulse
Invest Futr

[ Talk to Us ]
```

## Navigation Behavior

### Initial

- Transparent / overlay
- Logo visible
- Minimal navigation

### After Scroll

- Backdrop blur
- Dark/white adaptive background
- Subtle border
- Reduced height
- Active-page indicator
- Smooth transition

## Mobile

- Logo
- Menu button
- Full-screen / large overlay navigation
- Animated menu reveal
- Clear CTA

---

# 9. Global Design System

## Container

Desktop:

```text
max-width: 1440px
padding: 64px
12-column grid
```

Tablet:

```text
padding: 32px
```

Mobile:

```text
padding: 20px
```

## Typography

Recommended primary font:

- Inter

Possible alternatives:

- Manrope
- Inter Tight

Use a single primary family with multiple weights.

```text
400 — Body
500 — Navigation
600 — Subheading
700 — Heading
800 — Hero
```

## Typography Style

- Large editorial H1
- Strong H2
- Short paragraphs
- Generous line-height
- Large whitespace
- Red emphasis for important words

---

# 10. Background Visual System

Use subtle:

## Grid

```text
┼───┼───┼───┼
│   │   │   │
├───┼───┼───┤
│   │   │   │
┼───┼───┼───┼
```

## Dotted Networks

Use subtle dotted fields inspired by the PDF cover.

## Flow Lines

Thin animated lines representing:

- Supply
- Movement
- Connection
- Distribution

## Red Glow

Very subtle red radial glow.

## Grain

Optional very light noise texture for premium visual depth.

---

# 11. Home Page

The Home page is the visual benchmark for the entire website.

## Section 01 — Hero

### Heading

**Transforming Markets with Direct Commerce**

### Supporting Message

**Building Brands. Optimizing Markets. Capturing Value.**

### CTA

- Explore the Futr
- Let's Grow

## Visual

Full-screen Three.js market network.

Concept:

```text
          ●
         / \
        /   \
   ●───●─────●
    \   │   /
     \  │  /
      ●─●─●
         │
         ↓
       GROWTH
```

## Hero Animation Sequence

1. Grid appears
2. Network nodes form
3. Connections animate
4. Red particles travel through the network
5. Logo appears
6. Hero text reveals
7. CTA appears
8. Scroll indicator starts

---

# 12. Home — Business / Manufacturer Split

Create an interactive split-screen rather than normal cards.

## Left — Businesses / Shopkeepers

### Heading

**Lower Costs. Higher Quality.**

### Supporting Line

Empower your business with optimized products.

### CTA

View Products / Save More

## Right — Manufacturers

### Heading

**Smarter, Faster Market Access.**

### Supporting Line

Join the Manufacturer Success Program.

### CTA

Partner with Futr

## Hover Behavior

- Panel expansion
- Image/video reveal
- Network lines activate
- Red accent increases
- CTA becomes visible
- Subtle image movement

---

# 13. Home — Futr Impact

Create three major visual blocks.

## 01 — Highly Optimized Products

Standardized, tested and cost-engineered for performance.

## 02 — Super Efficient Supply Chain

A connected system designed for reliability, precision and control.

## 03 — Cutting Out the Middlemen

Connect producers and users directly to reduce unnecessary costs and complexity.

## Design

Do not use generic card grids.

Use large editorial blocks with:

- Number
- Large heading
- Short description
- Network graphic
- Animated line
- CTA where appropriate

---

# 14. Home — Futr Difference Preview

### Heading

**Efficiency is not an outcome — it's in our design.**

### Concept

Show the system visually:

```text
SOURCING
   ↓
PRODUCT
   ↓
PACKAGING
   ↓
SUPPLY
   ↓
DELIVERY
   ↓
MARKET
```

Use animated connections.

CTA:

**Explore the Futr →**

---

# 15. Home — Let's Grow Preview

Heading:

**Let's Grow Together**

Split into:

### Manufacturers

**Grow with Structure. Scale with Certainty.**

### Young Entrepreneurs

**Lead New Markets. Build Your Opportunity.**

Each side has:

- Image
- Animated network
- CTA
- Hover expansion

---

# 16. Home — Futr Pulse Preview

Heading:

**Insights That Move Markets.**

Featured article + article grid.

CTA:

**Explore Futr Pulse**

---

# 17. Home — Final CTA

Dark section.

### Heading

**Be Part of What's Next**

Supporting message:

The future of markets isn't coming — it's already in motion.

CTAs:

- Talk to Us
- Invest Futr

---

# 18. The Futr Difference Page

## Hero

Dark / graphite environment.

### H1

**The Futr Difference — Systems That Move Markets.**

### H2

**We don't sell products. We engineer how markets work.**

---

# 19. Futr Difference — Real Economy

Explain:

- Manufacturers
- Businesses
- Customers

Visual:

```text
MANUFACTURERS
      ↓
PRODUCTS
      ↓
SUPPLY
      ↓
BUSINESSES
      ↓
CUSTOMERS
```

Highlight how Futr connects these components through systems.

---

# 20. Futr Difference — Core Principles

Create three full-screen / large editorial blocks.

## 01

**Clarity Over Complexity**

Systems built to simplify how value moves.

## 02

**Intelligence Over Intermediaries**

Direct, data-backed connections replace unnecessary middle layers.

## 03

**Progress Over Profit**

A model designed for long-term efficiency.

## Animation

As the user scrolls:

```text
01 → 02 → 03
```

A red line travels between the principles.

---

# 21. Futr Difference — System View

Create interactive Three.js / SVG system visualization.

## Product Systems

Standardized, optimized and tested.

## Supply Systems

Structured routes and predictable logistics.

## Market Systems

Intelligent network design aligning products with demand.

## Interaction

Hovering / focusing a system should:

- Highlight the node
- Animate connections
- Show related information
- Dim unrelated nodes

---

# 22. Futr Difference — Futr Advantage

Four advantages:

1. Exclusive Market Control
2. Zero-Risk Entry
3. Optimized Production Support
4. Shared Growth & Profitability

Use a vertical / horizontal timeline.

---

# 23. Futr Difference — Outcome

### Heading

**We engineer markets for dominance.**

Then:

```text
Efficiency
   ↓
Speed
   ↓
Control
   ↓
Consistency
   ↓
Growth
```

Finish with:

- Partner with Futr
- Invest Futr

---

# 24. Let's Grow Page

## Hero

**Let's Grow Together**

Supporting idea:

Growth is not one-sided.

Then branch into:

```text
              LET'S GROW
                   │
       ┌───────────┴───────────┐
       ↓                       ↓
MANUFACTURERS               FUTR X
       │                       │
Scale with certainty    Build your market
```

---

# 25. Manufacturers Page

## Hero

**Grow with Structure. Scale with Certainty.**

Explain:

- Production flow
- Packaging
- Quality
- Market access
- Supply chain
- Predictable growth

## Process

```text
01
MARKET ANALYSIS
      ↓
02
PILOT & VALIDATE
      ↓
03
PERFORMANCE EXPANSION
      ↓
04
SUSTAINED GROWTH
```

Use an animated progress line.

---

# 26. Futr X Page

## Concept

Futr X is positioned as a collective of entrepreneurs re-engineering how markets work.

## Hero

**Built for the Driven. Designed for the Doers.**

## Visual

Dynamic:

- X motif
- Grid lines
- Red energy lines
- Urban imagery
- Real people
- Action shots

Avoid generic startup stock imagery.

## Content

- Regional distribution
- Category growth
- Product systems
- Logistics support
- Network opportunities

CTA:

**Join Futr X →**

---

# 27. Shop Page

The PDF does not define full e-commerce checkout/payment functionality.

Therefore Phase 1 should be a **product catalogue**, not a full checkout system.

## Layout

```text
SHOP

All Products
──────────────────────

[Product] [Product]
[Product] [Product]

Category
Product
Application
Business Value

[View Product]
```

## Product Interactions

- Image zoom
- Subtle 3D tilt
- Red underline
- Details reveal
- Hover elevation

## Product Detail

Include:

- Product image
- Product name
- Category
- Description
- Applications
- Business value
- Inquiry CTA

---

# 28. Futr Pulse Page

## Hero

**Insights That Move Markets.**

## Layout

### Featured Article

Large editorial block.

### Article Grid

```text
[ Article ] [ Article ] [ Article ]
[ Article ] [ Article ] [ Article ]
```

## Categories

Possible structure:

- Market Insights
- Innovation
- Operations
- Supply Chain
- Growth
- Futr Updates

## Article Detail

- Hero image
- Category
- Date
- Title
- Content
- Related articles

---

# 29. Invest Futr Page

This page should feel more institutional than the rest of the website.

## Visual Direction

- Dark graphite dominant
- White typography
- Red accent
- Large whitespace
- Thin network lines
- Slow 3D movement
- Minimal interface

## Hero

**Own the Infrastructure of Tomorrow's Commerce.**

## Investment System

```text
EFFICIENCY
     ↓
STRUCTURE
     ↓
SYSTEMS
     ↓
SCALE
     ↓
LONG-TERM VALUE
```

Animate each stage on scroll.

## CTA

**Invest Futr →**

---

# 30. Talk Page

## Hero

**Let's Move Markets — Together.**

## Path Selection

```text
MANUFACTURER
     ↓
Partner with Futr


BUSINESS
     ↓
Work with Futr


INVESTOR
     ↓
Invest Futr
```

## Contact Form

Fields:

- Name
- Company
- Email
- Phone
- User Type
- Subject
- Message

## Form States

- Idle
- Focus
- Validation
- Loading
- Success
- Error

---

# 31. Footer

Dark graphite footer.

## Column 1 — Brand

Futr Markets logo.

**Transforming Markets with Direct Commerce**

Supporting statement:

Reshaping how trade works through smarter supply, direct connections and shared growth.

## Column 2 — Explore

- Home
- The Futr Difference
- Let's Grow
- Shop
- Futr Pulse
- Invest Futr
- Talk

## Column 3 — Connect

- Email
- Phone
- Address

## Column 4 — Social

- LinkedIn
- Facebook
- Instagram
- YouTube

## Bottom

Copyright.

Privacy Policy.

Terms of Use.

---

# 32. Three.js Strategy

Do not use Three.js everywhere.

Three major scenes are enough.

## Scene 01 — Home

### Market Network

- Nodes
- Connections
- Particles
- Red energy flow
- Slow camera movement
- Mouse interaction

## Scene 02 — Futr Difference

### Commerce System

```text
PRODUCT
   ↓
SUPPLY
   ↓
MARKET
```

Interactive nodes.

## Scene 03 — Invest Futr

### Infrastructure Network

Slow, premium, institutional.

## Futr X

Prefer:

- SVG
- CSS
- GSAP

for the X motif instead of another heavy 3D scene.

---

# 33. Animation System

Create centralized animation utilities.

```text
animations/
├── fadeUp
├── fadeIn
├── slideReveal
├── textReveal
├── lineReveal
├── staggerReveal
├── scaleReveal
├── imageReveal
├── parallax
├── horizontalScroll
└── pageTransition
```

## Default Reveal

```text
opacity: 0 → 1
translateY: 40px → 0
duration: ~0.7s
ease: smooth ease-out
```

Adjust per component rather than making every animation identical.

---

# 34. Text Animation

Animate only important typography.

## Hero

Line-by-line / word-by-word reveal.

## Section headings

Fade + translate.

## Key words

Red underline / highlight reveal.

Example:

```text
Transforming Markets with
DIRECT COMMERCE
```

"Direct Commerce" can receive the red accent.

---

# 35. Scroll System

Use Lenis for smooth scrolling.

Use ScrollTrigger for:

- Section reveals
- Progress lines
- Horizontal sequences
- Network activation
- Parallax
- Storytelling

Avoid excessive parallax.

---

# 36. Page Transitions

Recommended:

```text
CURRENT PAGE
     ↓
dark/white transition layer
     ↓
red line sweep
     ↓
NEW PAGE
```

Target duration:

```text
400–700ms
```

Do not create slow cinematic transitions that delay navigation.

---

# 37. Cursor System

Desktop only.

## Default

Small circular cursor.

## CTA Hover

Arrow / expanded circle.

## Image Hover

"VIEW"

## Interactive Network

Cursor changes to indicate interaction.

Disable custom cursor on:

- Mobile
- Tablet/touch
- Accessibility/reduced-motion contexts

---

# 38. Responsive Design

## Desktop

Full experience:

- Three.js
- Large typography
- Multi-column layouts
- Advanced scroll animation

## Tablet

Reduce:

- Particle count
- 3D complexity
- Animation distance

## Mobile

Prioritize:

- Content hierarchy
- Typography
- Performance
- Simple SVG / CSS motion
- Touch-friendly interactions

Avoid reproducing desktop Three.js scenes at full complexity on mobile.

---

# 39. Performance Requirements

## Required

- Lazy loading
- Route-based code splitting
- Image compression
- WebP / AVIF
- Dynamic imports
- Lazy-loaded Three.js
- Device capability detection
- Reduced-motion support

## Three.js

Use:

- Low-poly geometry
- Limited particles
- Instancing where useful
- Proper disposal
- Lazy initialization
- Pause when not visible
- Reduced resolution on mobile

---

# 40. Accessibility

Implement:

- Semantic HTML
- Keyboard navigation
- Focus states
- ARIA labels
- Proper heading hierarchy
- Contrast checks
- Form accessibility
- `prefers-reduced-motion`

## Reduced Motion

When enabled:

```text
3D animation → Static / simplified scene
Parallax → Disabled
Page transitions → Simple fade
Scroll choreography → Minimal
```

---

# 41. SEO

Every page should include:

- Unique title
- Meta description
- Canonical URL
- Open Graph image
- Social metadata
- Proper heading hierarchy
- Semantic HTML
- Sitemap
- Robots.txt

## Content Keywords

Use the PDF's terminology where appropriate:

- Futr Markets
- Direct Commerce
- Market Optimization
- Supply Chain Efficiency
- Future of Trade
- Market Efficiency
- Smarter Supply Chains
- Optimized Products
- Shared Growth
- Manufacturer Partnerships
- Business Efficiency

---

# 42. React Folder Structure

```text
src/
│
├── app/
│   ├── App.jsx
│   ├── routes.jsx
│   └── providers.jsx
│
├── components/
│   ├── navigation/
│   ├── footer/
│   ├── buttons/
│   ├── typography/
│   ├── cards/
│   ├── sections/
│   └── loaders/
│
├── scenes/
│   ├── MarketNetwork.jsx
│   ├── CommerceSystem.jsx
│   ├── InvestmentNetwork.jsx
│   └── SceneCanvas.jsx
│
├── animations/
│   ├── reveal.js
│   ├── text.js
│   ├── page.js
│   └── scroll.js
│
├── pages/
│   ├── Home/
│   ├── Difference/
│   ├── Grow/
│   ├── Manufacturers/
│   ├── FutrX/
│   ├── Shop/
│   ├── Pulse/
│   ├── Invest/
│   └── Talk/
│
├── data/
│   ├── products.js
│   ├── articles.js
│   └── navigation.js
│
├── hooks/
│   ├── useScrollProgress.js
│   ├── useMediaQuery.js
│   └── useReducedMotion.js
│
├── styles/
│   ├── globals.css
│   ├── animations.css
│   └── utilities.css
│
└── assets/
    ├── images/
    ├── icons/
    ├── models/
    └── fonts/
```

---

# 43. Reusable Component System

Build reusable components before creating all pages.

```text
<SectionHeading />

<AnimatedHeading />

<RedUnderline />

<PrimaryCTA />

<SecondaryCTA />

<FlowLine />

<NetworkBackground />

<RevealOnScroll />

<SplitPanel />

<MetricBlock />

<ProcessTimeline />

<StoryCard />

<ProductCard />

<ArticleCard />

<SectionTransition />

<ThreeScene />

<PageHero />
```

---

# 44. Development Phases

## Phase 1 — Project Foundation

- React + Vite
- Tailwind
- Global CSS
- Font setup
- Theme tokens
- Router
- Base layout
- Navbar
- Footer
- Responsive system

### Deliverable

Working application shell.

---

## Phase 2 — Design System

Build:

- Buttons
- Typography
- Cards
- Grid
- Spacing
- Colors
- Network backgrounds
- Section containers
- Animation utilities
- Responsive utilities

### Deliverable

Reusable Futr Markets design system.

---

## Phase 3 — Home Page

Build:

- Hero
- Three.js market network
- Business/manufacturer split
- Futr Impact
- Difference preview
- Let's Grow preview
- Futr Pulse preview
- Final CTA
- Footer

### Deliverable

Home page becomes the visual benchmark.

---

## Phase 4 — The Futr Difference

Build:

- Hero
- Real Economy
- Three Principles
- System View
- Product Systems
- Supply Systems
- Market Systems
- Four Advantages
- Market Outcome
- CTA

---

## Phase 5 — Let's Grow

Build:

- Grow landing
- Manufacturer page
- Futr X page
- Process animations
- Partnership CTAs

---

## Phase 6 — Shop

Build:

- Product catalogue
- Category filtering
- Product cards
- Product detail
- Inquiry CTA

No checkout unless separately requested.

---

## Phase 7 — Futr Pulse

Build:

- Featured article
- Article grid
- Categories
- Article detail
- Related content

---

## Phase 8 — Invest Futr

Build:

- Dark institutional experience
- Investment network
- Value flow
- Investment CTA
- Contact path

---

## Phase 9 — Talk

Build:

- Contact hero
- User-type selection
- Contact form
- Validation
- Success/error states

---

# 45. Final Polish Phase

## Visual QA

Check:

- Spacing
- Typography
- Alignment
- Color balance
- Red accent usage
- Grid consistency
- Section rhythm

## Motion QA

Check:

- Hero animation
- Scroll reveal
- Page transitions
- Hover states
- Loading states
- Reduced motion

## Technical QA

Check:

- Lighthouse
- Bundle size
- Image optimization
- Three.js GPU usage
- Mobile performance
- Console errors
- Broken routes

## UX QA

Check:

- Navigation
- CTA paths
- Mobile menu
- Forms
- Keyboard navigation
- Touch interactions

---

# 46. Content / Asset Requirements From Client

Before final production, collect:

## Brand Assets

- Final logo SVG
- Logo variants
- Official brand HEX values if available
- Brand fonts if proprietary
- Favicon
- Social media profile assets

## Business Assets

- Company address
- Phone
- Email
- Social URLs
- Product catalogue
- Product images
- Manufacturer information
- Investor information
- Blog content
- Legal information

## Photography

Prefer real:

- Warehouses
- Products
- Logistics
- Packaging
- Manufacturing
- Business operations
- Team collaboration
- Entrepreneurs
- Urban environments

Avoid generic startup stock imagery.

---

# 47. Content Management Consideration

For the first version, static React data can be used for:

- Products
- Articles
- Navigation

If the client needs frequent content updates, later introduce a CMS/API for:

- Products
- Blogs
- Categories
- Investor documents
- Contact submissions

Do not over-engineer the first version unless the client requires a content-management workflow.

---

# 48. Conversion / CTA Architecture

Every major page should have a clear next step.

```text
HOME
 ↓
Explore Futr
 ↓
Difference
 ↓
Let's Grow
 ↓
Partner / Join
```

Alternative paths:

```text
HOME
 ↓
Shop
 ↓
Product
 ↓
Inquiry
```

```text
HOME
 ↓
Invest Futr
 ↓
Investor CTA
 ↓
Talk
```

The CTA language should remain invitational and minimal, consistent with the client framework.

---

# 49. Visual Hierarchy

The website should repeatedly follow:

```text
BIG IDEA
     ↓
SHORT EXPLANATION
     ↓
VISUAL SYSTEM
     ↓
PROOF / DETAILS
     ↓
CTA
```

Avoid:

```text
Huge paragraph
Huge paragraph
Huge paragraph
Card
Card
Card
Button
```

The PDF explicitly asks for rhythm rather than content bulk.

---

# 50. Section Rhythm

Use a deliberate sequence:

```text
LIGHT
   ↓
LIGHT
   ↓
DARK
   ↓
LIGHT
   ↓
LIGHT
   ↓
DARK
   ↓
LIGHT
   ↓
DARK CTA
```

This prevents visual fatigue.

---

# 51. Image Treatment

Images should not simply sit inside rectangles.

Use:

- Image reveal masks
- Full-bleed photography
- Editorial crops
- Grayscale → color hover
- Subtle zoom
- Red line overlays
- Grid overlays
- Asymmetric image placement

Images should communicate:

- Movement
- Connection
- Creation
- Supply
- Manufacturing
- Commerce

---

# 52. What NOT To Do

Do not create:

- Excessive glassmorphism
- Excessive gradients
- Random floating 3D objects
- Neon cyberpunk styling
- Excessive red
- Generic SaaS dashboard styling
- Generic startup landing-page cards
- Excessive bounce animations
- Long page transitions
- Too many Three.js scenes
- Unnecessary carousels
- Huge blocks of text
- Generic stock startup images

The brand should feel like **market infrastructure**, not a gaming website or crypto landing page.

---

# 53. Definition of Done

The project is complete when:

## Design

- Brand colors are consistent
- Typography is consistent
- Layout grid is consistent
- All pages follow the same visual language

## Content

- All PDF content is represented
- No major section is missing
- CTAs correctly connect pages

## Motion

- Smooth scroll
- Scroll reveals
- Page transitions
- Micro-interactions
- Three.js scenes
- Reduced-motion fallback

## Responsive

- Desktop
- Tablet
- Mobile

All have deliberate layouts.

## Performance

- Optimized assets
- Lazy-loaded 3D
- Minimal blocking resources
- Good mobile performance

## Accessibility

- Keyboard navigation
- Focus states
- Semantic structure
- Reduced motion
- Proper contrast

## Production

- SEO metadata
- Sitemap
- Robots
- Favicon
- OG metadata
- Error handling
- Production build passes

---

# 54. Final Creative Direction

## Futr Markets

### Mood

**Premium × Intelligent × Industrial × Future Commerce**

### Base

**White + Graphite**

### Accent

**Futr Red**

### Graphics

**Network + Grid + Flow + Nodes**

### Typography

**Bold geometric sans-serif**

### Animation

**Smooth + Controlled + Directional**

### 3D

**Abstract market infrastructure**

### Photography

**Real operations, products, logistics and people**

### Experience

**A serious company building the infrastructure behind the next generation of commerce.**

---

# 55. Recommended Build Order

Do not start all pages simultaneously.

Use this exact order:

```text
1. Brand tokens
       ↓
2. Typography
       ↓
3. Navbar / Footer
       ↓
4. Button / CTA system
       ↓
5. Grid / Section system
       ↓
6. Animation utilities
       ↓
7. Three.js foundation
       ↓
8. HOME
       ↓
9. Futr Difference
       ↓
10. Let's Grow
       ↓
11. Manufacturers
       ↓
12. Futr X
       ↓
13. Shop
       ↓
14. Futr Pulse
       ↓
15. Invest Futr
       ↓
16. Talk
       ↓
17. Responsive QA
       ↓
18. Performance optimization
       ↓
19. SEO
       ↓
20. Final client polish
```

---

# 56. Client Approval Strategy

Use the Home page as the approval checkpoint.

### Client Review Version 1

Show:

- Navbar
- Hero
- Three.js network
- Typography
- Color system
- Business/manufacturer split
- Futr Impact
- CTA
- Footer

Ask the client to approve:

1. Color
2. Typography
3. Motion
4. 3D style
5. Section spacing
6. Overall premium feel

Once approved, reuse the system across all pages.

This prevents redesigning seven pages later.

---

# 57. Final Project Goal

The final website should make the visitor understand Futr Markets in this sequence:

```text
WHO ARE THEY?
       ↓
WHAT DO THEY CHANGE?
       ↓
HOW DOES THEIR SYSTEM WORK?
       ↓
WHO CAN WORK WITH THEM?
       ↓
WHAT PRODUCTS / INSIGHTS DO THEY OFFER?
       ↓
WHY SHOULD I INVEST / PARTNER?
       ↓
HOW DO I CONTACT THEM?
```

The website should leave the visitor with:

> **Futr Markets is not simply selling products or moving goods. It is building systems that make markets more efficient, connected and scalable.**

That idea should be visible through the **content, layout, animation, 3D visuals, navigation and overall interaction design**, not only through the text.

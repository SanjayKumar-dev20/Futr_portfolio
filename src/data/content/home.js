/**
 * Home — Creative Framework pages 11–14.
 *
 * Note on section order: the framework lists the split panel as
 * LEFT = Businesses / Shopkeepers, RIGHT = Manufacturers. The earlier build had
 * these reversed; this is the authoritative order.
 */

export const HOME = {
  seo: {
    title: 'Futr Markets — Transforming Markets with Direct Commerce',
    description:
      'We remove the middle layers, lower costs, and make markets work the way they should — simple, fast, efficient and fair.',
    path: '/',
  },

  hero: {
    eyebrow: 'Optimizing Markets. Building Brands. Capturing Value.',
    lines: ['Transforming', 'Markets with', { text: 'Direct Commerce', accent: true }],
    body: 'Reshaping the future of commerce through direct connections, smarter supply chains and shared growth — shaped by trust, efficiency and streamlined markets.',
  },

  /** Section 02 — the business / manufacturer split. */
  split: [
    {
      key: 'businesses',
      eyebrow: 'For Businesses & Shopkeepers',
      heading: ['Lower Costs.', 'Higher Quality.'],
      subline: 'Empower your business with our products.',
      body: 'Helping businesses grow with highly optimized products and no middlemen.',
      cta: { label: 'View Products', to: '/shop' },
      side: 'left',
    },
    {
      key: 'manufacturers',
      eyebrow: 'For Manufacturers',
      heading: ['Smarter, Faster', 'Market Access.'],
      subline: 'Join our Manufacturer Success Program.',
      body: 'Powering manufacturers with streamlined supply and accelerated growth.',
      cta: { label: 'Partner with Futr', to: '/manufacturers' },
      side: 'right',
    },
  ],

  /** Section 03 — Futr Impact. */
  impact: {
    eyebrow: 'The Futr Impact',
    heading: 'Redefining Markets. Creating Value.',
    body: 'Futr Markets transforms how markets work — cutting inefficiencies, unlocking smarter supply and driving shared progress. We enable manufacturers, businesses and consumers to thrive together through lower costs, higher quality and lasting trust, creating a marketplace where efficiency fuels growth and every connection builds long-term value.',
    blocks: [
      {
        title: ['Highly', 'Optimized Products'],
        body: 'Standardized, tested and cost-engineered for performance. Every Futr product is built to deliver consistent quality and measurable value.',
        to: '/shop',
      },
      {
        title: ['Super Efficient', 'Supply Chain'],
        body: 'A connected system designed for reliability, precision and control. Our optimized network reduces lead times, minimizes waste and ensures seamless delivery.',
        to: '/difference',
      },
      {
        title: ['Cutting Out', 'the Middlemen'],
        body: 'By connecting producers and users directly, Futr Markets removes unnecessary cost and complexity — making commerce faster, smarter and more sustainable.',
        to: '/difference',
      },
    ],
  },

  /** Section 04 — The Futr Difference preview. */
  difference: {
    eyebrow: 'The Futr Difference',
    heading: "Efficiency is not an outcome — it's in our design.",
    body: "Futr Markets isn't built on trading margins — it's built on systems. Every process, partnership and decision is designed to reduce inefficiency, strengthen flow and make the market work smarter for everyone connected to it.",
    body2:
      'From sourcing and packaging to supply and delivery, each element of Futr Markets is engineered for precision, scalability and measurable growth. It is how we turn everyday commerce into a continuous system of progress.',
    cta: { label: 'Explore the Futr', to: '/difference' },
  },

  /** Section 05 — Let's Grow preview. */
  grow: {
    eyebrow: "Let's Grow",
    heading: "Let's Grow Together — because in a smarter market, growth is never one-sided.",
    body: 'Futr Markets builds structured pathways for growth, connecting manufacturing strength with entrepreneurial drive. Whether you create products or move them, we ensure your growth is backed by systems built for scale, consistency and opportunity.',
    branches: [
      {
        key: 'manufacturers',
        eyebrow: 'For Manufacturers',
        heading: 'Grow with Structure. Scale with Certainty.',
        body: 'Partner with Futr Markets to enter a system that simplifies production flow, standardizes packaging and quality, and delivers direct market access through a predictable, efficient supply chain.',
        cta: { label: 'Partner with Futr', to: '/manufacturers' },
      },
      {
        key: 'futr-x',
        eyebrow: 'For Young Entrepreneurs',
        heading: 'Lead New Markets. Build Your Opportunity.',
        body: "Futr Markets empowers young entrepreneurs to build and manage regional distribution channels across growing product categories — supported by Futr's logistics, brand structure and product systems.",
        cta: { label: 'Join the Network', to: '/futr-x' },
      },
    ],
  },

  /** Section 06 — Futr Pulse preview. */
  pulse: {
    eyebrow: 'Futr Pulse',
    heading: 'Insights That Move Markets.',
    body: 'Explore ideas, innovations and updates shaping the future of trade — straight from the Futr Markets ecosystem.',
    cta: { label: 'Explore Futr Pulse', to: '/pulse' },
  },

  /** Section 07 — closing CTA. */
  next: {
    eyebrow: "Let's move markets, together",
    heading: "Be Part of What's Next",
    subheading: "The future of markets isn't coming — it's already in motion.",
    body: "Join the system that's redefining how value is created, distributed and sustained across industries.",
    points: [
      'More opportunities for manufacturers.',
      'More entrepreneurs in the market.',
      'Better products for businesses.',
      'Greater value for communities.',
    ],
  },
}

export default HOME

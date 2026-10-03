/**
 * Futr Pulse.
 *
 * `ARTICLES` ships empty on purpose. The Creative Framework lists written
 * content as a Futr Markets deliverable, and inventing posts for a live
 * corporate site would put words in the client's mouth. The home preview and
 * the Pulse page both branch on this: with no articles they show the categories
 * the hub will carry; the moment entries appear here, the grids take over.
 *
 * Shape:
 *   {
 *     slug: 'why-middlemen-cost-more-than-they-add',
 *     title: 'Why middlemen cost more than they add',
 *     category: 'Market Insights',
 *     date: '2026-10-14',
 *     excerpt: 'One paragraph, no more.',
 *     image: '/images/<name>.webp',
 *     body: ['Paragraph one.', 'Paragraph two.'],
 *   }
 */
export const ARTICLES = []

/** Categories named in the Creative Framework (page 9). */
export const PULSE_CATEGORIES = [
  {
    name: 'Market Insights',
    blurb: 'What we are seeing in demand, pricing and distribution.',
  },
  {
    name: 'Innovation',
    blurb: 'New systems, products and ways of moving goods.',
  },
  {
    name: 'Operations',
    blurb: 'How the work actually gets done, and what it teaches us.',
  },
  {
    name: 'Supply Chain',
    blurb: 'Routes, lead times and the cost of friction.',
  },
  {
    name: 'Growth',
    blurb: 'Partner results and what made them repeatable.',
  },
  {
    name: 'Futr Updates',
    blurb: 'Categories, regions and milestones as they land.',
  },
]

export default ARTICLES

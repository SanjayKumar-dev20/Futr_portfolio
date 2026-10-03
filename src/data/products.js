/**
 * Shop catalogue.
 *
 * `PRODUCTS` ships empty on purpose. The Creative Framework names the product
 * list, photography and per-SKU business-value copy as Futr Markets
 * deliverables, and inventing a catalogue for a live commercial site would be
 * a false claim about what the company supplies.
 *
 * The Shop page branches on this: with no products it shows the categories the
 * catalogue will carry; the moment entries appear here, the grid takes over.
 *
 * Shape:
 *   {
 *     slug: 'dishwash-concentrate-5l',
 *     name: 'Dishwash Concentrate 5L',
 *     category: 'Household',
 *     image: '/images/<name>.webp',
 *     application: 'Where and how it is used, in one line.',
 *     businessValue: 'What the buyer gains, in one line.',
 *   }
 *
 * Phase 1 is a catalogue with an enquiry CTA — no checkout, no live pricing,
 * no stock automation. That exclusion is explicit in the framework (page 10).
 */
export const PRODUCTS = []

/**
 * Categories. The framework describes the catalogue as "all major consumables
 * and essentials", and the approved comp's trust rail names the sectors Futr
 * serves — these follow both.
 */
export const PRODUCT_CATEGORIES = [
  {
    name: 'Food & Beverage',
    blurb: 'Packaged staples and everyday lines for retail and food service.',
  },
  {
    name: 'Household',
    blurb: 'Cleaning and home essentials, cost-engineered at volume.',
  },
  {
    name: 'Personal Care',
    blurb: 'Daily-use lines standardized for consistent quality.',
  },
  {
    name: 'Retail & Supermarkets',
    blurb: 'Shelf-ready formats sized for independent and chain retail.',
  },
  {
    name: 'Restaurants & Kitchens',
    blurb: 'Bulk formats for operators who buy on consistency, not novelty.',
  },
  {
    name: 'Industrial',
    blurb: 'Consumables and supplies for operations and facilities.',
  },
]

export default PRODUCTS

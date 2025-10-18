import { SavedLineItem } from '../store/line-items-store'

export interface InvoiceTemplate {
  id: string
  name: string
  industry: string
  description: string
  items: Omit<SavedLineItem, 'id' | 'created_at' | 'updated_at'>[]
  payment_terms: string
  notes: string
}

export const INVOICE_TEMPLATES: InvoiceTemplate[] = [
  // Web Development
  {
    id: 'web-dev-basic',
    name: 'Basic Website',
    industry: 'Web Development',
    description: 'Simple website development project',
    items: [
      { description: 'Website Design (5 pages)', rate: 1500, default_quantity: 1, category: 'Design' },
      { description: 'Frontend Development', rate: 2000, default_quantity: 1, category: 'Development' },
      { description: 'Backend Development', rate: 1500, default_quantity: 1, category: 'Development' },
      { description: 'CMS Integration', rate: 800, default_quantity: 1, category: 'Development' },
    ],
    payment_terms: '50% Upfront, 50% on Completion',
    notes: 'Includes 2 rounds of revisions. Additional revisions billed at hourly rate.'
  },
  {
    id: 'web-dev-ecommerce',
    name: 'E-Commerce Store',
    industry: 'Web Development',
    description: 'Full e-commerce website with payment integration',
    items: [
      { description: 'E-commerce Design', rate: 2500, default_quantity: 1, category: 'Design' },
      { description: 'Shopping Cart Development', rate: 3000, default_quantity: 1, category: 'Development' },
      { description: 'Payment Gateway Integration', rate: 1200, default_quantity: 1, category: 'Development' },
      { description: 'Product Management System', rate: 1500, default_quantity: 1, category: 'Development' },
      { description: 'SSL Certificate & Security', rate: 500, default_quantity: 1, category: 'Security' },
    ],
    payment_terms: '50% Upfront, 50% on Completion',
    notes: 'Includes training on product management system and 30 days post-launch support.'
  },

  // Design
  {
    id: 'design-branding',
    name: 'Brand Identity Package',
    industry: 'Design',
    description: 'Complete brand identity design',
    items: [
      { description: 'Logo Design (3 concepts)', rate: 1200, default_quantity: 1, category: 'Branding' },
      { description: 'Brand Guidelines Document', rate: 800, default_quantity: 1, category: 'Branding' },
      { description: 'Business Card Design', rate: 300, default_quantity: 1, category: 'Print' },
      { description: 'Letterhead Design', rate: 250, default_quantity: 1, category: 'Print' },
      { description: 'Social Media Kit', rate: 600, default_quantity: 1, category: 'Digital' },
    ],
    payment_terms: '50% Upfront, 50% on Completion',
    notes: 'Includes source files in AI, PSD, and PDF formats. Unlimited revisions on chosen concept.'
  },
  {
    id: 'design-ui-ux',
    name: 'UI/UX Design',
    industry: 'Design',
    description: 'User interface and experience design',
    items: [
      { description: 'User Research & Analysis', rate: 1000, default_quantity: 1, category: 'Research' },
      { description: 'Wireframing (10 screens)', rate: 1200, default_quantity: 1, category: 'UX' },
      { description: 'High-Fidelity Mockups', rate: 2000, default_quantity: 1, category: 'UI' },
      { description: 'Interactive Prototype', rate: 1500, default_quantity: 1, category: 'Prototype' },
    ],
    payment_terms: 'Net 30',
    notes: 'Design deliverables in Figma with developer handoff documentation.'
  },

  // Marketing
  {
    id: 'marketing-social-media',
    name: 'Social Media Management',
    industry: 'Marketing',
    description: 'Monthly social media management package',
    items: [
      { description: 'Content Strategy & Planning', rate: 800, default_quantity: 1, category: 'Strategy' },
      { description: 'Content Creation (20 posts)', rate: 1200, default_quantity: 1, category: 'Content' },
      { description: 'Community Management', rate: 600, default_quantity: 1, category: 'Management' },
      { description: 'Monthly Analytics Report', rate: 400, default_quantity: 1, category: 'Analytics' },
    ],
    payment_terms: 'Due on Receipt',
    notes: 'Monthly retainer. Covers 3 social media platforms. Analytics report delivered first week of following month.'
  },

  // Consulting
  {
    id: 'consulting-business',
    name: 'Business Consulting',
    industry: 'Consulting',
    description: 'Strategic business consulting services',
    items: [
      { description: 'Business Analysis & Assessment', rate: 2000, default_quantity: 1, category: 'Analysis' },
      { description: 'Strategic Planning Session', rate: 1500, default_quantity: 1, category: 'Strategy' },
      { description: 'Implementation Roadmap', rate: 1200, default_quantity: 1, category: 'Planning' },
      { description: 'Follow-up Consultation (hourly)', rate: 200, default_quantity: 5, category: 'Consulting' },
    ],
    payment_terms: 'Net 15',
    notes: 'Includes comprehensive report and 90 days email support.'
  },

  // Photography
  {
    id: 'photography-event',
    name: 'Event Photography',
    industry: 'Photography',
    description: 'Professional event photography package',
    items: [
      { description: 'Event Coverage (8 hours)', rate: 1500, default_quantity: 1, category: 'Photography' },
      { description: 'Photo Editing (100 photos)', rate: 500, default_quantity: 1, category: 'Editing' },
      { description: 'Online Gallery', rate: 200, default_quantity: 1, category: 'Delivery' },
      { description: 'High-Resolution Downloads', rate: 300, default_quantity: 1, category: 'Delivery' },
    ],
    payment_terms: '50% Upfront, 50% on Completion',
    notes: 'Photos delivered within 2 weeks. Travel within 50 miles included.'
  },

  // Writing
  {
    id: 'writing-content',
    name: 'Content Writing Package',
    industry: 'Writing',
    description: 'Blog and website content writing',
    items: [
      { description: 'Blog Posts (5 x 1000 words)', rate: 500, default_quantity: 1, category: 'Writing' },
      { description: 'SEO Optimization', rate: 300, default_quantity: 1, category: 'SEO' },
      { description: 'Content Calendar', rate: 200, default_quantity: 1, category: 'Planning' },
    ],
    payment_terms: 'Net 30',
    notes: 'Includes 1 round of revisions per article. Additional revisions at $50 per article.'
  },

  // Video Production
  {
    id: 'video-promo',
    name: 'Promotional Video',
    industry: 'Video Production',
    description: 'Professional promotional video production',
    items: [
      { description: 'Pre-Production & Storyboarding', rate: 800, default_quantity: 1, category: 'Pre-Production' },
      { description: 'Video Shooting (1 day)', rate: 2000, default_quantity: 1, category: 'Production' },
      { description: 'Video Editing & Post-Production', rate: 1500, default_quantity: 1, category: 'Post-Production' },
      { description: 'Color Grading', rate: 500, default_quantity: 1, category: 'Post-Production' },
      { description: 'Motion Graphics & Titles', rate: 700, default_quantity: 1, category: 'Post-Production' },
    ],
    payment_terms: '50% Upfront, 50% on Completion',
    notes: 'Includes 2-3 minute final video. Up to 2 rounds of revisions included.'
  },
]

export const COMMON_LINE_ITEMS: Omit<SavedLineItem, 'id' | 'created_at' | 'updated_at'>[] = [
  // Hourly Rates
  { description: 'Hourly Consulting', rate: 150, default_quantity: 1, category: 'Consulting' },
  { description: 'Hourly Development', rate: 100, default_quantity: 1, category: 'Development' },
  { description: 'Hourly Design', rate: 85, default_quantity: 1, category: 'Design' },

  // Common Services
  { description: 'Project Management', rate: 500, default_quantity: 1, category: 'Management' },
  { description: 'Rush Fee (expedited delivery)', rate: 500, default_quantity: 1, category: 'Fees' },
  { description: 'Revisions (per round)', rate: 250, default_quantity: 1, category: 'Revisions' },

  // Misc
  { description: 'Travel Expenses', rate: 0, default_quantity: 1, category: 'Expenses' },
  { description: 'Stock Photos License', rate: 50, default_quantity: 1, category: 'Licensing' },
]

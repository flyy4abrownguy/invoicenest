import { z } from 'zod';

export const clientSchema = z.object({
  name: z.string().min(1, 'Client name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
  rate: z.number().min(0, 'Rate must be 0 or greater'),
  amount: z.number(),
});

export const invoiceSchema = z.object({
  client_id: z.string().optional(),
  invoice_number: z.string().min(1, 'Invoice number is required'),
  issue_date: z.string().min(1, 'Issue date is required'),
  due_date: z.string().min(1, 'Due date is required'),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  tax_rate: z.number().min(0).max(100),
  discount: z.number().min(0),
  notes: z.string().optional(),
  payment_terms: z.string().optional(),
  is_recurring: z.boolean().optional(),
  recurring_frequency: z.enum(['weekly', 'monthly', 'quarterly', 'yearly']).optional(),
});

export const profileSchema = z.object({
  full_name: z.string().optional(),
  company_name: z.string().optional(),
  company_address: z.string().optional(),
  company_phone: z.string().optional(),
  company_email: z.string().email('Invalid email').optional().or(z.literal('')),
});

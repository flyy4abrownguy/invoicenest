import { InvoiceItem, Currency } from "../types";

export function calculateItemAmount(quantity: number, rate: number): number {
  return Number((quantity * rate).toFixed(2));
}

export function calculateSubtotal(items: InvoiceItem[]): number {
  return Number(items.reduce((sum, item) => sum + item.amount, 0).toFixed(2));
}

export function calculateTaxAmount(subtotal: number, taxRate: number): number {
  return Number((subtotal * (taxRate / 100)).toFixed(2));
}

export function calculateTotal(
  subtotal: number,
  taxAmount: number,
  discount: number = 0
): number {
  return Number((subtotal + taxAmount - discount).toFixed(2));
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function generateInvoiceNumber(count: number): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const num = String(count + 1).padStart(4, '0');
  return `INV-${year}${month}-${num}`;
}

export function isOverdue(dueDate: string, status: string): boolean {
  if (status === 'paid' || status === 'cancelled') return false;
  return new Date(dueDate) < new Date();
}

// Currency utilities
export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'CA$',
  AUD: 'A$',
  JPY: '¥',
  INR: '₹',
  CHF: 'CHF',
  CNY: '¥',
  SEK: 'kr',
};

export const CURRENCY_NAMES: Record<Currency, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  CAD: 'Canadian Dollar',
  AUD: 'Australian Dollar',
  JPY: 'Japanese Yen',
  INR: 'Indian Rupee',
  CHF: 'Swiss Franc',
  CNY: 'Chinese Yuan',
  SEK: 'Swedish Krona',
};

export function getCurrencySymbol(currency: Currency): string {
  return CURRENCY_SYMBOLS[currency] || currency;
}

export function getCurrencyName(currency: Currency): string {
  return CURRENCY_NAMES[currency] || currency;
}

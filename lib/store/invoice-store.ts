import { create } from 'zustand';
import { Invoice, InvoiceItem } from '../types';
import { calculateItemAmount, calculateSubtotal, calculateTaxAmount, calculateTotal } from '../utils/calculations';

interface InvoiceStore {
  currentInvoice: Partial<Invoice> | null;
  items: InvoiceItem[];
  setCurrentInvoice: (invoice: Partial<Invoice>) => void;
  updateInvoice: (updates: Partial<Invoice>) => void;
  addItem: () => void;
  updateItem: (index: number, updates: Partial<InvoiceItem>) => void;
  removeItem: (index: number) => void;
  recalculateInvoice: () => void;
  resetInvoice: () => void;
}

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  currentInvoice: null,
  items: [],

  setCurrentInvoice: (invoice) => {
    set({ currentInvoice: invoice, items: invoice.items || [] });
  },

  updateInvoice: (updates) => {
    set((state) => ({
      currentInvoice: { ...state.currentInvoice, ...updates }
    }));
  },

  addItem: () => {
    set((state) => ({
      items: [
        ...state.items,
        {
          id: `temp-${Date.now()}`,
          invoice_id: state.currentInvoice?.id || '',
          description: '',
          quantity: 1,
          rate: 0,
          amount: 0,
          sort_order: state.items.length,
          created_at: new Date().toISOString()
        }
      ]
    }));
  },

  updateItem: (index, updates) => {
    set((state) => {
      const newItems = [...state.items];
      const item = newItems[index];
      const updatedItem = { ...item, ...updates };

      // Recalculate amount if quantity or rate changed
      if ('quantity' in updates || 'rate' in updates) {
        updatedItem.amount = calculateItemAmount(updatedItem.quantity, updatedItem.rate);
      }

      newItems[index] = updatedItem;
      return { items: newItems };
    });
    get().recalculateInvoice();
  },

  removeItem: (index) => {
    set((state) => ({
      items: state.items.filter((_, i) => i !== index)
    }));
    get().recalculateInvoice();
  },

  recalculateInvoice: () => {
    set((state) => {
      const subtotal = calculateSubtotal(state.items);
      const taxRate = state.currentInvoice?.tax_rate || 0;
      const discount = state.currentInvoice?.discount || 0;
      const taxAmount = calculateTaxAmount(subtotal, taxRate);
      const total = calculateTotal(subtotal, taxAmount, discount);

      return {
        currentInvoice: {
          ...state.currentInvoice,
          subtotal,
          tax_amount: taxAmount,
          total
        }
      };
    });
  },

  resetInvoice: () => {
    set({ currentInvoice: null, items: [] });
  }
}));

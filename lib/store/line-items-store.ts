import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SavedLineItem {
  id: string
  description: string
  rate: number
  default_quantity: number
  category?: string
  created_at: string
  updated_at: string
}

interface LineItemsStore {
  savedItems: SavedLineItem[]
  addSavedItem: (item: Omit<SavedLineItem, 'id' | 'created_at' | 'updated_at'>) => void
  updateSavedItem: (id: string, updates: Partial<SavedLineItem>) => void
  removeSavedItem: (id: string) => void
  getSavedItem: (id: string) => SavedLineItem | undefined
  clearAllSavedItems: () => void
}

export const useLineItemsStore = create<LineItemsStore>()(
  persist(
    (set, get) => ({
      savedItems: [],

      addSavedItem: (item) => {
        const now = new Date().toISOString()
        set((state) => ({
          savedItems: [...state.savedItems, {
            ...item,
            id: `line-item-${Date.now()}`,
            created_at: now,
            updated_at: now
          }]
        }))
      },

      updateSavedItem: (id, updates) => {
        set((state) => ({
          savedItems: state.savedItems.map((item) =>
            item.id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item
          )
        }))
      },

      removeSavedItem: (id) => {
        set((state) => ({
          savedItems: state.savedItems.filter((item) => item.id !== id)
        }))
      },

      getSavedItem: (id) => {
        return get().savedItems.find((item) => item.id === id)
      },

      clearAllSavedItems: () => {
        set({ savedItems: [] })
      }
    }),
    {
      name: 'saved-line-items-storage',
    }
  )
)

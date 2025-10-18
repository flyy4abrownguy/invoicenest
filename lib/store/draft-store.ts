import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Invoice } from '../types'

interface DraftStore {
  drafts: Invoice[]
  addDraft: (draft: Invoice) => void
  updateDraft: (id: string, updates: Partial<Invoice>) => void
  removeDraft: (id: string) => void
  getDraft: (id: string) => Invoice | undefined
  clearAllDrafts: () => void
}

export const useDraftStore = create<DraftStore>()(
  persist(
    (set, get) => ({
      drafts: [],

      addDraft: (draft) => {
        set((state) => ({
          drafts: [...state.drafts, { ...draft, status: 'draft' as const }]
        }))
      },

      updateDraft: (id, updates) => {
        set((state) => ({
          drafts: state.drafts.map((d) =>
            d.id === id ? { ...d, ...updates } : d
          )
        }))
      },

      removeDraft: (id) => {
        set((state) => ({
          drafts: state.drafts.filter((d) => d.id !== id)
        }))
      },

      getDraft: (id) => {
        return get().drafts.find((d) => d.id === id)
      },

      clearAllDrafts: () => {
        set({ drafts: [] })
      }
    }),
    {
      name: 'invoice-drafts-storage',
    }
  )
)

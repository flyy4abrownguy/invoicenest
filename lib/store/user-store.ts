import { create } from 'zustand';
import { Profile } from '../types';

interface UserStore {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  updateProfile: (updates: Partial<Profile>) => void;
  isFreeTier: () => boolean;
  isProTier: () => boolean;
  isBusinessTier: () => boolean;
  canCreateInvoice: () => boolean;
}

export const useUserStore = create<UserStore>((set, get) => ({
  profile: null,

  setProfile: (profile) => set({ profile }),

  updateProfile: (updates) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updates } : null
    })),

  isFreeTier: () => get().profile?.subscription_tier === 'free',
  isProTier: () => get().profile?.subscription_tier === 'pro',
  isBusinessTier: () => get().profile?.subscription_tier === 'business',

  canCreateInvoice: () => {
    const profile = get().profile;
    if (!profile) return false;
    if (profile.subscription_tier !== 'free') return true;
    return profile.invoice_count < 5; // Free tier limit
  }
}));

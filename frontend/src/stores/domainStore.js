import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const DOMAIN_CATALYSIS = 'chemical-catalysis';
export const DOMAIN_SYNBIO = 'synthetic-biology';

export const useDomainStore = create(
  persist(
    (set) => ({
      domain: DOMAIN_CATALYSIS,
      setDomain: (domain) => set({ domain }),
    }),
    {
      name: 'gps-domain-store',
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSynbioStore = create(
  persist(
    (set) => ({
      selectedReaction: 'Ethanol -> Hydrocarbons',
      selectedMicrobe: null,
      selectedEnzyme: null,
      generatedPathways: [],
      mutations: [],
      collaborators: [],
      reports: [],
      setSelectedReaction: (selectedReaction) => set({ selectedReaction }),
      setSelectedMicrobe: (selectedMicrobe) => set({ selectedMicrobe }),
      setSelectedEnzyme: (selectedEnzyme) => set({ selectedEnzyme }),
      setGeneratedPathways: (generatedPathways) => set({ generatedPathways }),
      setMutations: (mutations) => set({ mutations }),
      setCollaborators: (collaborators) => set({ collaborators }),
      addReport: (report) => set((s) => ({ reports: [report, ...s.reports].slice(0, 20) })),
    }),
    { name: 'gps-synbio-store' }
  )
);

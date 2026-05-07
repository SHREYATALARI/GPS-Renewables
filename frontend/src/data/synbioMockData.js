export const synbioReactionOptions = [
  'Ethanol -> Hydrocarbons',
  'Biomass -> Biofuel',
  'Cellulose degradation',
  'Methane bioconversion',
  'Lipid biosynthesis',
  'SAF precursor synthesis',
];

export const synbioHosts = [
  'E. coli',
  'Saccharomyces cerevisiae',
  'Pseudomonas putida',
  'Clostridium thermocellum',
  'Cyanobacteria',
];

export const synbioPathways = [
  {
    id: 'path-1',
    name: 'Acetyl-CoA to Isoprenoid SAF Route',
    yield: 82,
    atpCost: 11.2,
    carbonEfficiency: 78,
    bottlenecks: ['Pyruvate decarboxylase', 'HMG-CoA reductase'],
    hostCompatibility: 'S. cerevisiae / P. putida',
    noveltyScore: 0.89,
  },
  {
    id: 'path-2',
    name: 'Mevalonate Carbon-Conserving Route',
    yield: 76,
    atpCost: 9.4,
    carbonEfficiency: 81,
    bottlenecks: ['Acetyl-CoA acetyltransferase'],
    hostCompatibility: 'E. coli / Cyanobacteria',
    noveltyScore: 0.84,
  },
  {
    id: 'path-3',
    name: 'Cellulosic Ethanol Upgrade Cascade',
    yield: 69,
    atpCost: 8.7,
    carbonEfficiency: 73,
    bottlenecks: ['Cellulase activity', 'Alcohol dehydrogenase'],
    hostCompatibility: 'C. thermocellum',
    noveltyScore: 0.8,
  },
];

export const synbioEnzymes = [
  {
    id: 'enz-1',
    name: 'Thermostable Cellulase Variant',
    mutation: 'L452R + S209P',
    stability: 0.91,
    catalyticEfficiency: 1.34,
    impact: 'Improves thermal tolerance and substrate affinity.',
    thermostability: 87,
  },
  {
    id: 'enz-2',
    name: 'Cytochrome P450 Monooxygenase',
    mutation: 'F87A + T268A',
    stability: 0.83,
    catalyticEfficiency: 1.28,
    impact: 'Expands hydrocarbon precursor conversion spectrum.',
    thermostability: 78,
  },
  {
    id: 'enz-3',
    name: 'Pyruvate Decarboxylase Optimized',
    mutation: 'E473K',
    stability: 0.79,
    catalyticEfficiency: 1.19,
    impact: 'Reduces flux bottleneck at pyruvate branch point.',
    thermostability: 75,
  },
];

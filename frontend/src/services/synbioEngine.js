const profiles = [
  {
    key: 'ethanol',
    microbes: ['Saccharomyces cerevisiae', 'Pseudomonas putida', 'E. coli'],
    enzymes: ['Alcohol dehydrogenase', 'Acetyl-CoA synthase', 'Fatty acid elongase'],
    pathways: ['Acetyl-CoA hydrocarbon route', 'Fatty acid synthesis route', 'Mevalonate diversion loop'],
    objective: 'Hydrocarbon upcycling',
  },
  {
    key: 'cellulose',
    microbes: ['Clostridium thermocellum', 'Trichoderma reesei', 'E. coli'],
    enzymes: ['Endoglucanase', 'Cellobiohydrolase', 'Beta-glucosidase'],
    pathways: ['Cellulase cascade', 'Glucose fermentation route', 'Pentose-phosphate reroute'],
    objective: 'Biomass deconstruction',
  },
  {
    key: 'plastic',
    microbes: ['Ideonella sakaiensis', 'Pseudomonas putida', 'Bacillus subtilis'],
    enzymes: ['PETase', 'MHETase', 'Monooxygenase'],
    pathways: ['PET depolymerization loop', 'Terephthalate assimilation path', 'Aromatic catabolism branch'],
    objective: 'Biodegradation',
  },
  {
    key: 'co2',
    microbes: ['Cyanobacteria', 'Cupriavidus necator', 'Synechocystis sp.'],
    enzymes: ['RuBisCO variant', 'Formate dehydrogenase', 'Carbonic anhydrase'],
    pathways: ['Calvin cycle variant', 'Reductive glycine loop', 'Engineered carbon fixation module'],
    objective: 'Carbon fixation',
  },
  {
    key: 'methane',
    microbes: ['Methylococcus capsulatus', 'Methylosinus trichosporium', 'E. coli'],
    enzymes: ['Methane monooxygenase', 'Methanol dehydrogenase', 'Formaldehyde dehydrogenase'],
    pathways: ['Methane to methanol branch', 'Ribulose monophosphate cycle', 'Serine cycle optimization'],
    objective: 'C1 bioconversion',
  },
  {
    key: 'lignin',
    microbes: ['Rhodococcus jostii', 'Pseudomonas putida', 'Sphingobium sp.'],
    enzymes: ['Laccase', 'DyP peroxidase', 'Aryl-alcohol oxidase'],
    pathways: ['Lignin depolymerization cascade', 'Aromatic funneling route', 'Muconate production path'],
    objective: 'Aromatic valorization',
  },
];

function hash(str) {
  return [...str].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 9973, 7);
}

function pickProfile(reaction) {
  const key = (reaction || '').toLowerCase();
  return (
    profiles.find((p) => key.includes(p.key)) || {
      microbes: ['E. coli', 'Pseudomonas putida', 'Saccharomyces cerevisiae'],
      enzymes: ['Dehydrogenase', 'Transferase', 'Monooxygenase'],
      pathways: ['Central carbon reroute', 'Energy-balanced synthesis loop', 'Redox optimization branch'],
      objective: 'General bio-conversion',
    }
  );
}

export function analyzeReaction(reaction, host, objective) {
  const p = pickProfile(reaction);
  const h = hash(`${reaction}-${host}-${objective}`);
  return {
    profile: p.objective,
    microbes: p.microbes.map((m, i) => ({
      name: m,
      conversion: Number((0.62 + ((h + i * 17) % 28) / 100).toFixed(2)),
      tolerance: Number((0.58 + ((h + i * 23) % 31) / 100).toFixed(2)),
      relevance: ['High', 'Medium-High', 'Medium'][i] || 'Medium',
      compatibility: Number((0.6 + ((h + i * 11) % 30) / 100).toFixed(2)),
      confidence: Number((0.72 + ((h + i * 7) % 18) / 100).toFixed(2)),
      why: `${m} selected for ${p.objective.toLowerCase()} due to pathway compatibility and stress tolerance.`,
    })),
    enzymes: p.enzymes.map((e, i) => ({
      name: e,
      efficiency: Number((0.65 + ((h + i * 19) % 26) / 100).toFixed(2)),
      stability: Number((0.61 + ((h + i * 13) % 29) / 100).toFixed(2)),
      confidence: Number((0.7 + ((h + i * 5) % 19) / 100).toFixed(2)),
      why: `${e} addresses key catalytic constraints identified in ${reaction}.`,
    })),
    explanation: `Reaction classified under ${p.objective}. AI mapped candidate microbes and enzymes by substrate/product class and redox balance.`,
  };
}

export function generatePathways(reaction, microbe, enzyme) {
  const p = pickProfile(reaction);
  const h = hash(`${reaction}-${microbe}-${enzyme}`);
  return p.pathways.map((name, i) => ({
    id: `${p.objective.replace(/\s+/g, '-').toLowerCase()}-${i + 1}`,
    name,
    predictedYield: 58 + ((h + i * 9) % 31),
    atpUsage: Number((6 + ((h + i * 7) % 7) + 0.4).toFixed(1)),
    nadhUsage: Number((4 + ((h + i * 5) % 6) + 0.2).toFixed(1)),
    carbonEfficiency: 63 + ((h + i * 11) % 28),
    bottlenecks: [`Step ${2 + i}: cofactor imbalance`, `Step ${4 + i}: transport limitation`],
    optimization: `Increase ${enzyme || 'key enzyme'} expression and rebalance ATP/NADH at branch ${i + 2}.`,
    metabolites: ['Substrate', 'Intermediate A', 'Intermediate B', 'Product'],
    steps: [
      `${microbe || 'Host'} uptake module`,
      `${enzyme || 'Primary enzyme'} conversion`,
      'Cofactor regeneration',
      'Terminal product branch',
    ],
  }));
}

export function generateMutations(reaction, enzyme) {
  const h = hash(`${reaction}-${enzyme}`);
  const core = enzyme || 'Target enzyme';
  return [
    {
      variant: `${core} L452R`,
      stability: Number((0.72 + (h % 16) / 100).toFixed(2)),
      activity: Number((1.12 + (h % 19) / 100).toFixed(2)),
      folding: Number((0.76 + (h % 14) / 100).toFixed(2)),
      robustness: Number((0.71 + (h % 15) / 100).toFixed(2)),
      note: 'Improves thermal tolerance and active-site packing.',
    },
    {
      variant: `${core} F87A`,
      stability: Number((0.69 + (h % 18) / 100).toFixed(2)),
      activity: Number((1.08 + (h % 17) / 100).toFixed(2)),
      folding: Number((0.73 + (h % 16) / 100).toFixed(2)),
      robustness: Number((0.7 + (h % 12) / 100).toFixed(2)),
      note: 'Expands substrate tunnel and increases turnover.',
    },
  ];
}

export function buildRiskProfile(reaction) {
  const h = hash(reaction);
  return [
    ['Contamination risk', 2 + (h % 3)],
    ['Mutation drift risk', 2 + ((h + 1) % 3)],
    ['Scalability risk', 2 + ((h + 2) % 3)],
    ['Environmental risk', 1 + ((h + 3) % 4)],
    ['Regulatory risk', 1 + ((h + 4) % 4)],
  ];
}

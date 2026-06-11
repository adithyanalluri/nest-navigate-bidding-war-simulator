export const house = {
  address: "24 Maple Row",
  neighborhood: "Oak Ridge",
  beds: 3,
  baths: 2,
  listPrice: 420000,
  appraisalEstimate: 410000,
  monthlyComfortLimit: 3200,
  buyerCashAvailable: 62000,
  marketNote:
    "The seller received several offers in the first weekend. Price matters, but the listing agent says the seller is also weighing how dependable each deal feels.",
  marketRumors: [
    "An investor is reportedly circling with cash and a very fast close.",
    "One family may stretch well above list price to shut the bidding down.",
    "At least one buyer is said to be loosening inspection protections.",
    "Appraisal protection keeps coming up in agent chatter."
  ]
};

// Each playthrough draws one seller persona. The weights multiply the matching
// scoring components in utils/scoring.js, so the same offer can win against one
// seller and lose against another. The player only sees the qualitative
// priorities before submitting; the label is revealed with the decision.
export const sellerPersonas = [
  {
    id: "relocator",
    label: "The Relocating Seller",
    headline: "Already packing for a new job two states away.",
    weights: {
      price: 0.85,
      downPayment: 1,
      financing: 1.25,
      speed: 1.9,
      inspection: 1.1,
      appraisalGap: 0.8
    },
    priorities: [
      "The seller's moving timeline sounds unusually tight.",
      "A buyer who can close quickly may stand out.",
      "Top dollar matters less than a deal that will not drag."
    ],
    decisionStyle:
      "This seller compared closing speed and certainty first, and the headline price second."
  },
  {
    id: "maximizer",
    label: "The Top-Dollar Seller",
    headline: "In no rush to move, and every dollar needs to stick.",
    weights: {
      price: 1.6,
      downPayment: 1.2,
      financing: 0.9,
      speed: 0.6,
      inspection: 0.9,
      appraisalGap: 1.5
    },
    priorities: [
      "The seller seems happy to wait for the right number.",
      "The agent hinted the price needs to hold up after appraisal.",
      "Speed alone is unlikely to impress this seller."
    ],
    decisionStyle:
      "This seller chased the strongest number that would still survive the appraisal."
  },
  {
    id: "burned",
    label: "The Once-Burned Seller",
    headline: "Their last deal collapsed two weeks before closing.",
    weights: {
      price: 0.85,
      downPayment: 1.25,
      financing: 1.6,
      speed: 0.9,
      inspection: 1.45,
      appraisalGap: 1.1
    },
    priorities: [
      "A previous sale reportedly fell apart late in the process.",
      "Financing strength may matter more than the headline price.",
      "Heavy inspection contingencies could make this seller nervous."
    ],
    decisionStyle:
      "This seller picked the offer that looked least likely to fall apart before closing."
  }
];

export function getRandomPersona(excludeId) {
  const pool = sellerPersonas.filter((persona) => persona.id !== excludeId);
  return pool[Math.floor(Math.random() * pool.length)];
}

// Competitors are scored by the same engine as the player, so their appeal
// shifts with the seller persona. Each one is strong on a different axis.
export const competitors = [
  {
    name: "The Chen Family",
    price: 430000,
    financing: "conventional",
    downPaymentPercent: 20,
    closingDays: 30,
    inspection: "limited",
    appraisalGap: 8000
  },
  {
    name: "Harbor Point LLC",
    price: 412000,
    financing: "cash",
    downPaymentPercent: 100,
    closingDays: 21,
    inspection: "waived",
    appraisalGap: 0
  },
  {
    name: "The Patels",
    price: 441000,
    financing: "conventional",
    downPaymentPercent: 10,
    closingDays: 45,
    inspection: "standard",
    appraisalGap: 12000
  }
];

export const initialOffer = {
  price: 420000,
  downPaymentPercent: 10,
  financing: "conventional",
  closingDays: 30,
  inspection: "standard",
  appraisalGap: 5000
};

export const optionLabels = {
  financing: {
    cash: "Cash",
    preunderwritten: "Pre-underwritten",
    conventional: "Conventional",
    fha: "FHA"
  },
  inspection: {
    standard: "Standard inspection",
    limited: "Limited inspection",
    waived: "Waived inspection"
  }
};

export const playerFinancingOptions = ["preunderwritten", "conventional", "fha"];

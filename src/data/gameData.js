export const house = {
  address: "24 Maple Row",
  neighborhood: "Oak Ridge",
  beds: 3,
  baths: 2,
  listPrice: 420000,
  appraisalEstimate: 410000,
  monthlyComfortLimit: 3200,
  buyerCashAvailable: 62000,
  sellerPriorities: [
    "The seller wants confidence the deal will close smoothly.",
    "Timing could matter if two offers look close.",
    "The seller may be cautious about offers with extra uncertainty."
  ],
  marketNote:
    "The seller received several offers in the first weekend. They want a strong number, but they also care about whether the deal feels dependable.",
  marketRumors: [
    "One buyer may be bringing unusually strong financing.",
    "A fast close is getting attention from the listing side.",
    "At least one offer may be trimming inspection protections.",
    "Appraisal protection could matter if the price climbs."
  ]
};

export const competitors = [
  {
    name: "Offer A",
    price: 430000,
    financing: "conventional",
    closingDays: 30,
    inspection: "limited",
    appraisalGap: 10000,
    strengthScore: 78
  },
  {
    name: "Offer B",
    price: 436000,
    financing: "fha",
    closingDays: 45,
    inspection: "standard",
    appraisalGap: 3000,
    strengthScore: 68
  },
  {
    name: "Offer C",
    price: 425000,
    financing: "cash",
    closingDays: 14,
    inspection: "waived",
    appraisalGap: 0,
    strengthScore: 82
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

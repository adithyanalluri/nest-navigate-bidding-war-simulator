const financingScores = {
  cash: 20,
  preunderwritten: 16,
  conventional: 12,
  fha: 6
};

const inspectionScores = {
  waived: 14,
  limited: 9,
  standard: 4
};

const inspectionRisk = {
  standard: 4,
  limited: 12,
  waived: 28
};

export const factorLabels = {
  price: "Price",
  downPayment: "Down payment",
  financing: "Financing certainty",
  speed: "Closing speed",
  inspection: "Inspection terms",
  appraisalGap: "Appraisal protection"
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const HIGH_RISK_THRESHOLD = 55;

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export function estimateCashNeeded(offer) {
  if (offer.financing === "cash") {
    return Math.round(offer.price + offer.appraisalGap);
  }

  return Math.round(offer.price * (offer.downPaymentPercent / 100) + offer.appraisalGap);
}

export function estimateMonthlyPayment(offer) {
  if (offer.financing === "cash") {
    return 0;
  }

  const loanAmount = offer.price * (1 - offer.downPaymentPercent / 100);
  const principalAndInterest = loanAmount * 0.00625;
  const taxesAndInsurance = offer.price * 0.00155;
  return Math.round(principalAndInterest + taxesAndInsurance);
}

function getSpeedScore(closingDays) {
  if (closingDays <= 14) {
    return 12;
  }

  if (closingDays <= 21) {
    return 10;
  }

  return closingDays <= 30 ? 7 : 3;
}

// Every offer (player and competitor) is broken into the same six components.
// The seller persona then weights each component, so "strongest offer" genuinely
// depends on who is selling.
function getOfferComponents(offer, house) {
  const pricePremium = ((offer.price - house.listPrice) / house.listPrice) * 100;

  return {
    price: clamp(14 + pricePremium * 2.6, 6, 30),
    downPayment:
      offer.financing === "cash" ? 10 : clamp(offer.downPaymentPercent * 0.5, 2, 10),
    financing: financingScores[offer.financing] ?? 6,
    speed: getSpeedScore(offer.closingDays),
    inspection: inspectionScores[offer.inspection] ?? 4,
    appraisalGap: clamp(offer.appraisalGap / 1750, 0, 10)
  };
}

export function calculateOfferStrength(offer, house, persona) {
  const components = getOfferComponents(offer, house);
  const total = Object.entries(components).reduce(
    (sum, [factor, score]) => sum + score * (persona.weights[factor] ?? 1),
    0
  );

  return Math.round(clamp(total, 0, 100));
}

export function getPersonaTopFactors(persona, count = 2) {
  return Object.entries(persona.weights)
    .sort(([, leftWeight], [, rightWeight]) => rightWeight - leftWeight)
    .slice(0, count)
    .map(([factor]) => factorLabels[factor]);
}

function getCashRisk(cashBuffer) {
  if (cashBuffer < 0) {
    return 30;
  }

  if (cashBuffer < 6000) {
    return 18;
  }

  return cashBuffer < 12000 ? 9 : 2;
}

export function calculateRiskScore(offer, house) {
  const aboveListRisk = clamp(((offer.price - house.listPrice) / house.listPrice) * 160, 0, 26);
  const appraisalRisk = clamp(
    ((offer.price - house.appraisalEstimate - offer.appraisalGap) / house.listPrice) * 170,
    0,
    28
  );
  const cashNeeded = estimateCashNeeded(offer);
  const cashBuffer = house.buyerCashAvailable - cashNeeded;
  const cashRisk = getCashRisk(cashBuffer);
  const monthlyPayment = estimateMonthlyPayment(offer);
  const monthlyRisk =
    monthlyPayment > house.monthlyComfortLimit
      ? clamp(((monthlyPayment - house.monthlyComfortLimit) / house.monthlyComfortLimit) * 90, 8, 24)
      : 0;
  const gapRisk = clamp(offer.appraisalGap / 1000, 0, 16);
  const termsRisk = inspectionRisk[offer.inspection] ?? 4;

  return Math.round(
    clamp(aboveListRisk + appraisalRisk + cashRisk + monthlyRisk + gapRisk + termsRisk, 0, 100)
  );
}

export function getWarnings(offer, house) {
  const riskNotes = [];
  const strategyNotes = [];
  const cashNeeded = estimateCashNeeded(offer);
  const monthlyPayment = estimateMonthlyPayment(offer);

  if (cashNeeded > house.buyerCashAvailable) {
    riskNotes.push("This offer needs more cash than your current reserve.");
  }

  if (monthlyPayment > house.monthlyComfortLimit) {
    riskNotes.push("The estimated payment is above your comfort limit.");
  }

  if (offer.inspection === "waived") {
    riskNotes.push("Waiving inspection may improve your chances but removes an important protection.");
  } else if (offer.inspection === "standard") {
    strategyNotes.push("A full inspection protects you, but the seller may compare it against cleaner terms.");
  }

  if (offer.price > house.appraisalEstimate + offer.appraisalGap) {
    riskNotes.push("Your appraisal gap may not cover the difference if the home appraises low.");
  } else if (offer.appraisalGap >= 10000) {
    strategyNotes.push("Appraisal protection can help the seller feel safer about a higher price.");
  }

  if (offer.financing === "fha") {
    strategyNotes.push("The seller may want more confidence that financing will clear smoothly.");
  } else if (offer.financing === "preunderwritten") {
    strategyNotes.push("Pre-underwriting can signal that your financing is further along.");
  }

  if (offer.closingDays <= 21) {
    strategyNotes.push("Fast closings are attractive in this market, if your team can actually deliver.");
  } else if (offer.closingDays >= 45) {
    strategyNotes.push("A longer closing timeline may make the offer feel less urgent to the seller.");
  }

  const notes = [...riskNotes, ...strategyNotes].slice(0, 3);

  if (!notes.length) {
    notes.push("This offer keeps a healthier balance between strength and protection.");
  }

  return notes;
}

export function buildOfferComparisons(offer, house, competitors, persona) {
  const playerStrength = calculateOfferStrength(offer, house, persona);
  const playerRisk = calculateRiskScore(offer, house);

  return [
    {
      id: "player",
      name: "Your offer",
      isPlayer: true,
      price: offer.price,
      financing: offer.financing,
      closingDays: offer.closingDays,
      inspection: offer.inspection,
      appraisalGap: offer.appraisalGap,
      sellerAppealScore: playerStrength,
      buyerRiskScore: playerRisk
    },
    ...competitors.map((competitor, index) => ({
      id: `competitor-${index}`,
      name: competitor.name,
      isPlayer: false,
      price: competitor.price,
      financing: competitor.financing,
      closingDays: competitor.closingDays,
      inspection: competitor.inspection,
      appraisalGap: competitor.appraisalGap,
      sellerAppealScore: calculateOfferStrength(competitor, house, persona),
      buyerRiskScore: null
    }))
  ].sort((left, right) => {
    if (right.sellerAppealScore === left.sellerAppealScore) {
      if (left.isPlayer && !right.isPlayer) {
        return -1;
      }

      if (right.isPlayer && !left.isPlayer) {
        return 1;
      }

      return 0;
    }

    return right.sellerAppealScore - left.sellerAppealScore;
  });
}

export function evaluateOffer(offer, house, competitors, persona) {
  const offerStrengthScore = calculateOfferStrength(offer, house, persona);
  const riskScore = calculateRiskScore(offer, house);
  const comparisons = buildOfferComparisons(offer, house, competitors, persona);
  const winningOffer = comparisons[0];
  const playerRank = comparisons.findIndex((comparison) => comparison.isPlayer) + 1;
  const bestCompetitorScore = Math.max(
    ...comparisons
      .filter((comparison) => !comparison.isPlayer)
      .map((comparison) => comparison.sellerAppealScore)
  );
  const won = winningOffer.isPlayer;
  const cashNeeded = estimateCashNeeded(offer);
  const monthlyPayment = estimateMonthlyPayment(offer);
  const scoreGap = Math.abs(offerStrengthScore - winningOffer.sellerAppealScore);

  let category = "Weak Offer";
  let lesson =
    "Your offer was not strong enough for this seller. A higher price can help, but certainty and cleaner terms matter too.";

  if (won && riskScore < HIGH_RISK_THRESHOLD) {
    category = "Smart Win";
    lesson =
      "You won by matching what this seller cared about while keeping enough protection and cash buffer.";
  } else if (won) {
    category = "Risky Win";
    lesson =
      "The seller would take the offer, but the risk is too high for a first-time buyer. Winning is not worth blowing past your safety limits.";
  } else if (!won && riskScore < 45) {
    category = "Responsible Walkaway";
    lesson =
      "You did not win this bidding war, but you avoided stretching into a fragile offer. Sometimes discipline is the smart move.";
  }

  return {
    won,
    category,
    lesson,
    persona,
    offerStrengthScore,
    riskScore,
    totalScore: offerStrengthScore,
    bestCompetitorScore,
    sellerWouldAccept: won,
    winningOffer,
    winningReason: persona.decisionStyle,
    comparisons,
    playerRank,
    scoreGap,
    cashNeeded,
    monthlyPayment,
    warnings: getWarnings(offer, house)
  };
}

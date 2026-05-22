const financingScores = {
  cash: 24,
  preunderwritten: 21,
  conventional: 17,
  fha: 10
};

const inspectionScores = {
  waived: 18,
  limited: 12,
  standard: 5
};

const inspectionRisk = {
  standard: 4,
  limited: 12,
  waived: 28
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const HIGH_RISK_THRESHOLD = 55;

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

export function calculateOfferStrength(offer, house) {
  const pricePremium = ((offer.price - house.listPrice) / house.listPrice) * 100;
  const priceScore = clamp(28 + pricePremium * 2.2, 16, 42);
  const downPaymentScore = clamp(offer.downPaymentPercent * 0.7, 4, 16);
  const financingScore = financingScores[offer.financing] ?? 10;
  const speedScore = offer.closingDays <= 21 ? 14 : offer.closingDays <= 30 ? 10 : 5;
  const inspectionScore = inspectionScores[offer.inspection] ?? 5;
  const appraisalScore = clamp(offer.appraisalGap / 1000, 0, 12);

  return Math.round(
    clamp(
      priceScore +
        downPaymentScore +
        financingScore +
        speedScore +
        inspectionScore +
        appraisalScore,
      0,
      100
    )
  );
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
  const cashRisk = cashBuffer < 0 ? 30 : cashBuffer < 6000 ? 18 : cashBuffer < 12000 ? 9 : 2;
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

export function buildOfferComparisons(offer, house, competitors) {
  const playerStrength = calculateOfferStrength(offer, house);
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
      sellerAppealScore: competitor.strengthScore,
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

function getWinningReason(winningOffer) {
  if (winningOffer.financing === "cash") {
    return "The seller favored the certainty and speed of a cash offer.";
  }

  if (winningOffer.closingDays <= 21 && winningOffer.inspection !== "standard") {
    return "The seller favored a faster close paired with lower inspection friction.";
  }

  if (winningOffer.appraisalGap >= 10000) {
    return "The seller favored stronger appraisal protection if the home appraises low.";
  }

  return "The seller favored the offer with the strongest overall mix of price, certainty, speed, and terms.";
}

export function evaluateOffer(offer, house, competitors) {
  const offerStrengthScore = calculateOfferStrength(offer, house);
  const riskScore = calculateRiskScore(offer, house);
  const comparisons = buildOfferComparisons(offer, house, competitors);
  const winningOffer = comparisons[0];
  const playerRank = comparisons.findIndex((comparison) => comparison.isPlayer) + 1;
  const bestCompetitorScore = Math.max(...competitors.map((competitor) => competitor.strengthScore));
  const sellerWouldAccept = winningOffer.isPlayer;
  const won = winningOffer.isPlayer;
  const cashNeeded = estimateCashNeeded(offer);
  const monthlyPayment = estimateMonthlyPayment(offer);
  const scoreGap = Math.abs(offerStrengthScore - winningOffer.sellerAppealScore);

  let category = "Weak Offer";
  let lesson =
    "Your offer was not strong enough for this market. A higher price can help, but certainty and cleaner terms matter too.";

  if (won && riskScore < HIGH_RISK_THRESHOLD) {
    category = "Smart Win";
    lesson =
      "You won by pairing a competitive price with strong terms while keeping enough protection and cash buffer.";
  } else if (won) {
    category = "Risky Win";
    lesson =
      "The seller would like the offer, but the risk is too high for a first-time buyer. Winning is not worth blowing past your safety limits.";
  } else if (!won && riskScore < 45) {
    category = "Responsible Walkaway";
    lesson =
      "You did not win this bidding war, but you avoided stretching into a fragile offer. Sometimes discipline is the smart move.";
  }

  return {
    won,
    category,
    lesson,
    offerStrengthScore,
    riskScore,
    totalScore: offerStrengthScore,
    recklessPenalty: 0,
    bestCompetitorScore,
    sellerWouldAccept,
    winningOffer,
    winningReason: getWinningReason(winningOffer),
    comparisons,
    playerRank,
    scoreGap,
    cashNeeded,
    monthlyPayment,
    warnings: getWarnings(offer, house)
  };
}

const STORAGE_KEY = "bidding-war-scorecard";

const emptyScorecard = {
  plays: 0,
  smartWins: 0,
  riskyWins: 0,
  walkaways: 0,
  weakOffers: 0
};

const categoryFields = {
  "Smart Win": "smartWins",
  "Risky Win": "riskyWins",
  "Responsible Walkaway": "walkaways",
  "Weak Offer": "weakOffers"
};

export function loadScorecard() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...emptyScorecard, ...JSON.parse(raw) } : { ...emptyScorecard };
  } catch {
    return { ...emptyScorecard };
  }
}

export function recordResult(category) {
  const scorecard = loadScorecard();
  scorecard.plays += 1;

  const field = categoryFields[category];
  if (field) {
    scorecard[field] += 1;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(scorecard));
  } catch {
    // Storage unavailable (e.g. private browsing); the round simply is not tracked.
  }

  return scorecard;
}

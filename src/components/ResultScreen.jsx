import ProgressBar from "./ProgressBar.jsx";
import { formatCurrency } from "../utils/scoring.js";

function getOutcomeDetails(result) {
  if (result.category === "Smart Win") {
    return {
      why: `Your offer ranked #${result.playerRank} on seller appeal and still kept buyer risk out of the danger zone.`,
      cared:
        "The seller saw a credible path to close: strong financing, useful appraisal protection, and terms that reduced uncertainty.",
      lesson:
        "A winning offer can be aggressive and still disciplined when the buyer keeps cash, payment, and inspection risk in view."
    };
  }

  if (result.category === "Risky Win") {
    return {
      why: `Your offer gave the seller the strongest appeal score, but your buyer risk landed at ${result.riskScore}/100.`,
      cared:
        "The seller cared about the confidence of closing more than whether the offer left you with enough protection afterward.",
      lesson:
        "Winning the house is not the same as making the right move. A first-time buyer still needs room for appraisal, repairs, and payment comfort."
    };
  }

  if (result.category === "Responsible Walkaway") {
    return {
      why: `${result.winningOffer.name} had the strongest seller appeal, but your lower-risk offer kept you from overextending.`,
      cared:
        "The seller prioritized the offer that looked easiest to close, especially on certainty, timeline, and cleaner terms.",
      lesson:
        "Losing a bidding war can still be a good outcome when the alternative is stretching past your safety limits."
    };
  }

  return {
    why: `${result.winningOffer.name} outscored your seller appeal by ${result.scoreGap} points.`,
    cared:
      "The seller compared more than price. Financing certainty, closing speed, inspection terms, and appraisal protection all affected the decision.",
    lesson:
      "A stronger next offer does not always mean only raising the price. Improve the terms that make the seller confident the deal will close."
  };
}

function ResultScreen({ house, offer, result, onRestart, onReview }) {
  const isReckless = result.category === "Risky Win";
  const outcomeDetails = getOutcomeDetails(result);
  const winningOffer = result.winningOffer;

  return (
    <section className="result-screen">
      <ProgressBar currentStep={4} />

      <div className="result-card">
        <p className="eyebrow">
          {result.category === "Risky Win"
            ? "Offer accepted, but risky"
            : result.won
              ? "Offer accepted"
              : "Offer not selected"}
        </p>
        <h1>{result.category}</h1>
        <p className="result-lesson">{result.lesson}</p>

        <div className="result-grid">
          <div>
            <span>Offer price</span>
            <strong>{formatCurrency(offer.price)}</strong>
          </div>
          <div>
            <span>Seller appeal</span>
            <strong>{result.offerStrengthScore}/100</strong>
          </div>
          <div>
            <span>Buyer risk</span>
            <strong className={isReckless ? "danger-text" : ""}>{result.riskScore}/100</strong>
          </div>
          <div>
            <span>Cash needed</span>
            <strong>{formatCurrency(result.cashNeeded)}</strong>
          </div>
          <div>
            <span>Est. payment</span>
            <strong>{formatCurrency(result.monthlyPayment)}/mo</strong>
          </div>
          <div>
            <span>Comfort limit</span>
            <strong>{formatCurrency(house.monthlyComfortLimit)}/mo</strong>
          </div>
        </div>

        <div className="takeaway-panel">
          <h2>Why this happened</h2>
          <p>{outcomeDetails.why}</p>
        </div>

        <div className="result-insights">
          <section>
            <h2>What the seller cared about</h2>
            <p>{outcomeDetails.cared}</p>
            <div className="priority-list result-priorities">
              {house.sellerPriorities.map((priority) => (
                <span className="priority-chip" key={priority}>
                  {priority}
                </span>
              ))}
            </div>
          </section>
          <section>
            <h2>Buyer lesson</h2>
            <p>{outcomeDetails.lesson}</p>
          </section>
        </div>

        <div className="winner-comparison">
          <h2>Winning offer comparison</h2>
          <div className="mini-comparison-grid">
            <div>
              <span>Your seller appeal</span>
              <strong>{result.offerStrengthScore}/100</strong>
            </div>
            <div>
              <span>Winning offer</span>
              <strong>{winningOffer.name}</strong>
            </div>
            <div>
              <span>Winning appeal</span>
              <strong>{winningOffer.sellerAppealScore}/100</strong>
            </div>
            <div>
              <span>Winning price</span>
              <strong>{formatCurrency(winningOffer.price)}</strong>
            </div>
          </div>
          <p>{result.winningReason}</p>
        </div>

        <div className="result-actions">
          <button className="secondary-button" type="button" onClick={onReview}>
            Adjust offer
          </button>
          <button className="primary-button" type="button" onClick={onRestart}>
            Play again
          </button>
        </div>
      </div>
    </section>
  );
}

export default ResultScreen;

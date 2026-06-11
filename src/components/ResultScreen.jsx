import ProgressBar from "./ProgressBar.jsx";
import { formatCurrency, getPersonaTopFactors } from "../utils/scoring.js";
import { loadScorecard } from "../utils/scorecard.js";

function getOutcomeDetails(result) {
  if (result.category === "Smart Win") {
    return {
      why: `Your offer ranked #${result.playerRank} on seller appeal and still kept buyer risk out of the danger zone.`,
      lesson:
        "A winning offer can be aggressive and still disciplined when the buyer keeps cash, payment, and inspection risk in view."
    };
  }

  if (result.category === "Risky Win") {
    return {
      why: `Your offer gave the seller the strongest appeal score, but your buyer risk landed at ${result.riskScore}/100.`,
      lesson:
        "Winning the house is not the same as making the right move. A first-time buyer still needs room for appraisal, repairs, and payment comfort."
    };
  }

  if (result.category === "Responsible Walkaway") {
    return {
      why: `${result.winningOffer.name} had the strongest appeal for this seller, but your lower-risk offer kept you from overextending.`,
      lesson:
        "Losing a bidding war can still be a good outcome when the alternative is stretching past your safety limits."
    };
  }

  return {
    why: `${result.winningOffer.name} outscored your seller appeal by ${result.scoreGap} points.`,
    lesson:
      "A stronger next offer does not always mean only raising the price. Improve the terms this particular seller cares about most."
  };
}

function getOutcomeEyebrow(result) {
  if (result.category === "Risky Win") {
    return "Offer accepted, but risky";
  }

  return result.won ? "Offer accepted" : "Offer not selected";
}

const confettiColors = ["#176b57", "#f3c665", "#d88955", "#8ec6d3"];

function Confetti() {
  const pieces = Array.from({ length: 28 }, (_, index) => ({
    id: index,
    left: `${(index * 37) % 100}%`,
    delay: `${(index % 9) * 0.14}s`,
    duration: `${2.4 + (index % 5) * 0.4}s`,
    color: confettiColors[index % confettiColors.length]
  }));

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          style={{
            left: piece.left,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
            background: piece.color
          }}
        />
      ))}
    </div>
  );
}

function ResultScreen({ house, offer, result, onRestart, onReview }) {
  const isReckless = result.category === "Risky Win";
  const outcomeDetails = getOutcomeDetails(result);
  const winningOffer = result.winningOffer;
  const persona = result.persona;
  const scorecard = loadScorecard();

  return (
    <section className="result-screen">
      {result.category === "Smart Win" && <Confetti />}
      <ProgressBar currentStep={4} />

      <div className="result-card">
        <p className="eyebrow">{getOutcomeEyebrow(result)}</p>
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
            <h2>What {persona.label.toLowerCase()} cared about</h2>
            <p>
              {persona.headline} {persona.decisionStyle}
            </p>
            <div className="priority-list result-priorities">
              {getPersonaTopFactors(persona, 3).map((factor) => (
                <span className="priority-chip" key={factor}>
                  {factor}
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

        <div className="scorecard-strip">
          <h2>Your track record</h2>
          <div className="scorecard-stats">
            <div>
              <span>Rounds</span>
              <strong>{scorecard.plays}</strong>
            </div>
            <div>
              <span>Smart wins</span>
              <strong>{scorecard.smartWins}</strong>
            </div>
            <div>
              <span>Risky wins</span>
              <strong>{scorecard.riskyWins}</strong>
            </div>
            <div>
              <span>Disciplined walkaways</span>
              <strong>{scorecard.walkaways}</strong>
            </div>
          </div>
        </div>

        <div className="result-actions">
          <button className="secondary-button" type="button" onClick={onReview}>
            Adjust offer
          </button>
          <button className="primary-button" type="button" onClick={onRestart}>
            Face a new seller
          </button>
        </div>
        <p className="next-seller-note">A different seller will review your next offer.</p>
      </div>
    </section>
  );
}

export default ResultScreen;

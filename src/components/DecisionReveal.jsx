import { useEffect, useState } from "react";
import { optionLabels } from "../data/gameData.js";
import { formatCurrency } from "../utils/scoring.js";
import ProgressBar from "./ProgressBar.jsx";

function OfferComparisonCard({ offer, isRevealed }) {
  const isWinner = isRevealed && offer.isWinner;

  return (
    <article
      className={`comparison-card ${offer.isPlayer ? "player-offer" : ""} ${
        isWinner ? "winner" : ""
      }`}
    >
      <div className="comparison-card-header">
        <div>
          <span className="comparison-label">
            {offer.isPlayer ? "Your final bid" : "Competing buyer"}
          </span>
          <h2>{offer.name}</h2>
        </div>
        {isWinner && <span className="winner-badge">Winner</span>}
      </div>

      <div className="comparison-price">{formatCurrency(offer.price)}</div>

      <dl className="comparison-details">
        <div>
          <dt>Financing</dt>
          <dd>{optionLabels.financing[offer.financing]}</dd>
        </div>
        <div>
          <dt>Close</dt>
          <dd>{offer.closingDays} days</dd>
        </div>
        <div>
          <dt>Inspection</dt>
          <dd>{optionLabels.inspection[offer.inspection]}</dd>
        </div>
        <div>
          <dt>Appraisal gap</dt>
          <dd>{formatCurrency(offer.appraisalGap)}</dd>
        </div>
      </dl>

      <div className="comparison-scores">
        <div>
          <span>Seller appeal</span>
          <strong>{offer.sellerAppealScore}/100</strong>
        </div>
        {offer.isPlayer && (
          <div>
            <span>Buyer risk</span>
            <strong>{offer.buyerRiskScore}/100</strong>
          </div>
        )}
      </div>
    </article>
  );
}

function DecisionReveal({ result, onContinue }) {
  const [stage, setStage] = useState("reviewing");

  useEffect(() => {
    const revealTimer = window.setTimeout(() => setStage("winner"), 700);
    const readyTimer = window.setTimeout(() => setStage("ready"), 1300);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(readyTimer);
    };
  }, []);

  const isRevealed = stage !== "reviewing";
  const isReady = stage === "ready";
  const offers = result.comparisons.map((offer) => ({
    ...offer,
    isWinner: offer.id === result.winningOffer.id
  }));

  return (
    <section className="reveal-screen">
      <ProgressBar currentStep={3} />

      <div className="reveal-header">
        <p className="eyebrow">Seller Review</p>
        <h1>
          {isRevealed
            ? `${result.winningOffer.name} rises to the top.`
            : "The seller is reviewing the offers..."}
        </h1>
        <p>
          Price matters, but the seller is comparing confidence, speed, inspection risk, and appraisal
          protection before choosing the strongest path to closing.
        </p>
      </div>

      <div className={`comparison-grid ${isRevealed ? "revealed" : ""}`}>
        {offers.map((offer) => (
          <OfferComparisonCard offer={offer} isRevealed={isRevealed} key={offer.id} />
        ))}
      </div>

      <div className="reveal-footer" aria-live="polite">
        <p>{isRevealed ? result.winningReason : "Final terms are being compared side by side."}</p>
        {isReady && (
          <button className="primary-button" type="button" onClick={onContinue}>
            See result
          </button>
        )}
      </div>
    </section>
  );
}

export default DecisionReveal;

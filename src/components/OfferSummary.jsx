import { formatCurrency, HIGH_RISK_THRESHOLD } from "../utils/scoring.js";

function getSellerRead(score) {
  if (score >= 80) {
    return {
      value: "Very compelling",
      tone: "strong",
      detail: "This offer has several traits this seller may see as dependable."
    };
  }

  if (score >= 68) {
    return {
      value: "Competitive",
      tone: "steady",
      detail: "This offer is in the conversation, but another buyer could still edge it out."
    };
  }

  if (score >= 56) {
    return {
      value: "Possible, not certain",
      tone: "watch",
      detail: "The seller may look for more confidence in financing, timing, or protections."
    };
  }

  return {
    value: "May struggle",
    tone: "risk",
    detail: "This offer may need a stronger reason for the seller to choose it."
  };
}

function getRiskRead(score) {
  if (score >= 70) {
    return {
      value: "Fragile",
      tone: "risk",
      detail: "This could win attention, but it may leave you exposed after acceptance."
    };
  }

  if (score >= HIGH_RISK_THRESHOLD) {
    return {
      value: "Stretched",
      tone: "watch",
      detail: "You are trading away some safety for a stronger shot at the home."
    };
  }

  if (score >= 35) {
    return {
      value: "Measured",
      tone: "steady",
      detail: "There is some pressure, but the offer still keeps meaningful guardrails."
    };
  }

  return {
    value: "Comfortable",
    tone: "strong",
    detail: "This keeps your financial cushion healthier, though it may be less aggressive."
  };
}

// An analog meter instead of a number: the player feels the trade-off move in
// real time without seeing the exact score before the seller's decision.
function TensionMeter({ label, kind, percent, read, zoneStart }) {
  return (
    <div className={`tension-meter ${read.tone}`}>
      <div className="tension-label">
        <span>{label}</span>
        <strong>{read.value}</strong>
      </div>
      <div className="meter-track">
        {zoneStart != null && (
          <span className="meter-zone" style={{ left: `${zoneStart}%` }} aria-hidden="true" />
        )}
        <span className={`meter-fill ${kind}`} style={{ width: `${percent}%` }} />
      </div>
      <p>{read.detail}</p>
    </div>
  );
}

function OfferSummary({ preview, onSubmit }) {
  const sellerRead = getSellerRead(preview.offerStrengthScore);
  const riskRead = getRiskRead(preview.riskScore);
  const inDangerZone = preview.riskScore >= HIGH_RISK_THRESHOLD;

  return (
    <aside className="panel summary-panel">
      <div className="panel-heading">
        <p className="eyebrow">Advisor Read</p>
        <h2>How this offer feels</h2>
      </div>

      <div className="tension-board" aria-live="polite">
        <TensionMeter
          label="Seller appeal"
          kind="strength"
          percent={preview.offerStrengthScore}
          read={sellerRead}
        />
        <TensionMeter
          label="Your risk"
          kind="risk"
          percent={preview.riskScore}
          read={riskRead}
          zoneStart={HIGH_RISK_THRESHOLD}
        />
        {inDangerZone && (
          <p className="danger-note">
            You have crossed into the danger zone. Even a winning offer here strains your finances.
          </p>
        )}
      </div>

      <div className="summary-stats">
        <div>
          <span>Cash needed</span>
          <strong>{formatCurrency(preview.cashNeeded)}</strong>
        </div>
        <div>
          <span>Est. monthly payment</span>
          <strong>{formatCurrency(preview.monthlyPayment)}</strong>
        </div>
      </div>

      <div className="feedback-box">
        <h3>Strategic notes</h3>
        <ul>
          {preview.warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      </div>

      <button className="primary-button full-width" type="button" onClick={onSubmit}>
        Submit final offer
      </button>
    </aside>
  );
}

export default OfferSummary;

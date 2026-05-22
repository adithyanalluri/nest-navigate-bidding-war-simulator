import { formatCurrency } from "../utils/scoring.js";

function getSellerRead(score) {
  if (score >= 88) {
    return {
      label: "Seller read",
      value: "Very compelling",
      tone: "strong",
      detail: "This offer has several traits a seller may see as dependable."
    };
  }

  if (score >= 76) {
    return {
      label: "Seller read",
      value: "Competitive",
      tone: "steady",
      detail: "This offer is in the conversation, but another buyer could still edge it out."
    };
  }

  if (score >= 64) {
    return {
      label: "Seller read",
      value: "Possible, not certain",
      tone: "watch",
      detail: "The seller may look for more confidence in financing, timing, or protections."
    };
  }

  return {
    label: "Seller read",
    value: "May struggle",
    tone: "risk",
    detail: "This offer may need a stronger reason for the seller to choose it."
  };
}

function getRiskRead(score) {
  if (score >= 70) {
    return {
      label: "Buyer pressure",
      value: "Fragile",
      tone: "risk",
      detail: "This could win attention, but it may leave you exposed after acceptance."
    };
  }

  if (score >= 55) {
    return {
      label: "Buyer pressure",
      value: "Stretched",
      tone: "watch",
      detail: "You are trading away some safety for a stronger shot at the home."
    };
  }

  if (score >= 35) {
    return {
      label: "Buyer pressure",
      value: "Measured",
      tone: "steady",
      detail: "There is some pressure, but the offer still keeps meaningful guardrails."
    };
  }

  return {
    label: "Buyer pressure",
    value: "Comfortable",
    tone: "strong",
    detail: "This keeps your financial cushion healthier, though it may be less aggressive."
  };
}

function SignalCard({ signal }) {
  return (
    <article className={`signal-card ${signal.tone}`}>
      <span>{signal.label}</span>
      <strong>{signal.value}</strong>
      <p>{signal.detail}</p>
    </article>
  );
}

function OfferSummary({ preview, onSubmit }) {
  const signals = [getSellerRead(preview.offerStrengthScore), getRiskRead(preview.riskScore)];

  return (
    <aside className="panel summary-panel">
      <div className="panel-heading">
        <p className="eyebrow">Advisor Read</p>
        <h2>How this offer feels</h2>
      </div>

      <div className="signal-grid">
        {signals.map((signal) => (
          <SignalCard signal={signal} key={signal.label} />
        ))}
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

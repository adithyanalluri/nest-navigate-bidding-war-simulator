import { optionLabels, playerFinancingOptions } from "../data/gameData.js";
import { formatCurrency } from "../utils/scoring.js";

function OfferBuilder({ offer, onOfferChange }) {
  return (
    <section className="panel offer-builder">
      <div className="panel-heading">
        <p className="eyebrow">Your Move</p>
        <h2>Build your offer</h2>
      </div>

      <label className="control-group">
        <span>Offer price</span>
        <strong>{formatCurrency(offer.price)}</strong>
        <input
          type="range"
          min="410000"
          max="445000"
          step="1000"
          value={offer.price}
          onChange={(event) => onOfferChange("price", Number(event.target.value))}
        />
      </label>

      <label className="control-group">
        <span>Down payment</span>
        <strong>{offer.downPaymentPercent}%</strong>
        <input
          type="range"
          min="3"
          max="20"
          step="1"
          value={offer.downPaymentPercent}
          onChange={(event) => onOfferChange("downPaymentPercent", Number(event.target.value))}
        />
      </label>

      <fieldset className="control-group">
        <legend>Financing</legend>
        <div className="segmented-control">
          {playerFinancingOptions.map((value) => (
            <button
              className={offer.financing === value ? "segment active" : "segment"}
              type="button"
              aria-pressed={offer.financing === value}
              key={value}
              onClick={() => onOfferChange("financing", value)}
            >
              {optionLabels.financing[value]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="control-group">
        <legend>Closing timeline</legend>
        <div className="segmented-control">
          {[14, 21, 30, 45].map((days) => (
            <button
              className={offer.closingDays === days ? "segment active" : "segment"}
              type="button"
              aria-pressed={offer.closingDays === days}
              key={days}
              onClick={() => onOfferChange("closingDays", days)}
            >
              {days} days
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="control-group">
        <legend>Inspection terms</legend>
        <div className="segmented-control stacked">
          {Object.entries(optionLabels.inspection).map(([value, label]) => (
            <button
              className={offer.inspection === value ? "segment active" : "segment"}
              type="button"
              aria-pressed={offer.inspection === value}
              key={value}
              onClick={() => onOfferChange("inspection", value)}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="control-group">
        <span>Appraisal gap coverage</span>
        <strong>{formatCurrency(offer.appraisalGap)}</strong>
        <input
          type="range"
          min="0"
          max="20000"
          step="1000"
          value={offer.appraisalGap}
          onChange={(event) => onOfferChange("appraisalGap", Number(event.target.value))}
        />
      </label>
    </section>
  );
}

export default OfferBuilder;

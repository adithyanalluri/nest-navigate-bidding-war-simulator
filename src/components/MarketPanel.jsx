import { formatCurrency } from "../utils/scoring.js";

function MarketPanel({ house }) {
  return (
    <aside className="panel market-panel">
      <div className="panel-heading">
        <p className="eyebrow">Market Intel</p>
        <h2>{house.address}</h2>
      </div>

      <div className="detail-grid">
        <div>
          <span>List price</span>
          <strong>{formatCurrency(house.listPrice)}</strong>
        </div>
        <div>
          <span>Appraisal estimate</span>
          <strong>{formatCurrency(house.appraisalEstimate)}</strong>
        </div>
        <div>
          <span>Your cash available</span>
          <strong>{formatCurrency(house.buyerCashAvailable)}</strong>
        </div>
        <div>
          <span>Comfort payment</span>
          <strong>{formatCurrency(house.monthlyComfortLimit)}/mo</strong>
        </div>
      </div>

      <div className="market-note">
        <h3>Seller signals</h3>
        <div className="seller-signal-list">
          {house.sellerPriorities.map((priority) => (
            <p className="seller-signal" key={priority}>
              {priority}
            </p>
          ))}
        </div>
        <p>{house.marketNote}</p>
      </div>

      <div className="competitor-list">
        <h3>Market chatter</h3>
        {house.marketRumors.map((rumor, index) => (
          <article className="competitor-card rumor-card" key={rumor}>
            <div>
              <strong>Rumor {index + 1}</strong>
              <span>Unconfirmed</span>
            </div>
            <p>{rumor}</p>
          </article>
        ))}
      </div>
    </aside>
  );
}

export default MarketPanel;

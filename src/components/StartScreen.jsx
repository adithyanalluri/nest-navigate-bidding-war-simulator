import { formatCurrency } from "../utils/scoring.js";
import { loadScorecard } from "../utils/scorecard.js";

function StartScreen({ house, onStart }) {
  const scorecard = loadScorecard();

  return (
    <section className="start-screen">
      <div className="hero-copy">
        <p className="eyebrow">Nest Navigate Mini Game</p>
        <h1>Bidding War Simulator</h1>
        <p className="hero-text">
          Multiple buyers are circling the same home, and every seller weighs price, certainty,
          speed, and protection differently. Read the market, then build a final offer that can
          stand out without making a reckless financial move.
        </p>
        <div className="hero-actions">
          <button className="primary-button" type="button" onClick={onStart}>
            Start bidding
          </button>
          {scorecard.plays > 0 && (
            <p className="track-record-note">
              Your record: {scorecard.plays} {scorecard.plays === 1 ? "round" : "rounds"} ·{" "}
              {scorecard.smartWins} smart {scorecard.smartWins === 1 ? "win" : "wins"} ·{" "}
              {scorecard.walkaways} disciplined {scorecard.walkaways === 1 ? "walkaway" : "walkaways"}
            </p>
          )}
        </div>
      </div>

      <div className="hero-property" aria-label="Featured home overview">
        <div className="home-visual">
          <div className="sun" />
          <div className="roof" />
          <div className="house-body">
            <div className="window window-left" />
            <div className="window window-right" />
            <div className="door" />
          </div>
          <div className="yard" />
        </div>
        <div className="property-card">
          <span className="status-pill">Hot listing</span>
          <h2>{house.address}</h2>
          <p>{house.neighborhood}</p>
          <div className="property-stats">
            <span>{house.beds} beds</span>
            <span>{house.baths} baths</span>
            <span>{formatCurrency(house.listPrice)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StartScreen;

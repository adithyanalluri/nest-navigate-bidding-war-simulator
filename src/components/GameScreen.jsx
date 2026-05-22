import MarketPanel from "./MarketPanel.jsx";
import OfferBuilder from "./OfferBuilder.jsx";
import OfferSummary from "./OfferSummary.jsx";
import ProgressBar from "./ProgressBar.jsx";

function GameScreen({ house, competitors, offer, preview, onOfferChange, onSubmit }) {
  return (
    <section className="game-screen">
      <ProgressBar currentStep={2} />
      <div className="game-header">
        <div>
          <p className="eyebrow">Round 1 of 1</p>
          <h1>Can you win without overreaching?</h1>
        </div>
        <p>
          This is your best-and-final offer. Balance price, certainty, speed, and protection before
          the seller compares every bid side by side.
        </p>
      </div>

      <div className="game-layout">
        <MarketPanel house={house} competitors={competitors} />
        <OfferBuilder offer={offer} onOfferChange={onOfferChange} />
        <OfferSummary preview={preview} onSubmit={onSubmit} />
      </div>
    </section>
  );
}

export default GameScreen;

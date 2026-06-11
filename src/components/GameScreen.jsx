import MarketPanel from "./MarketPanel.jsx";
import OfferBuilder from "./OfferBuilder.jsx";
import OfferSummary from "./OfferSummary.jsx";
import ProgressBar from "./ProgressBar.jsx";

function GameScreen({ house, persona, offer, preview, onOfferChange, onSubmit }) {
  return (
    <section className="game-screen">
      <ProgressBar currentStep={2} />
      <div className="game-header">
        <div>
          <p className="eyebrow">One Best-and-Final Offer</p>
          <h1>Can you win without overreaching?</h1>
        </div>
        <p>
          Every seller weighs price, certainty, speed, and protection differently. Read the
          signals, then balance your offer before the seller compares every bid side by side.
        </p>
      </div>

      <div className="game-layout">
        <MarketPanel house={house} persona={persona} />
        <OfferBuilder offer={offer} onOfferChange={onOfferChange} />
        <OfferSummary preview={preview} onSubmit={onSubmit} />
      </div>
    </section>
  );
}

export default GameScreen;

import { useMemo, useState } from "react";
import StartScreen from "./components/StartScreen.jsx";
import GameScreen from "./components/GameScreen.jsx";
import DecisionReveal from "./components/DecisionReveal.jsx";
import ResultScreen from "./components/ResultScreen.jsx";
import { competitors, house, initialOffer } from "./data/gameData.js";
import { evaluateOffer } from "./utils/scoring.js";

function App() {
  const [screen, setScreen] = useState("start");
  const [offer, setOffer] = useState(initialOffer);
  const [result, setResult] = useState(null);

  const preview = useMemo(() => evaluateOffer(offer, house, competitors), [offer]);

  const updateOffer = (field, value) => {
    setOffer((currentOffer) => ({
      ...currentOffer,
      [field]: value
    }));
  };

  const startGame = () => {
    setOffer(initialOffer);
    setResult(null);
    setScreen("game");
  };

  const submitOffer = () => {
    setResult(evaluateOffer(offer, house, competitors));
    setScreen("reveal");
  };

  return (
    <main className="app-shell">
      {screen === "start" && <StartScreen house={house} onStart={startGame} />}
      {screen === "game" && (
        <GameScreen
          house={house}
          competitors={competitors}
          offer={offer}
          preview={preview}
          onOfferChange={updateOffer}
          onSubmit={submitOffer}
        />
      )}
      {screen === "reveal" && result && (
        <DecisionReveal
          result={result}
          onContinue={() => setScreen("result")}
        />
      )}
      {screen === "result" && (
        <ResultScreen
          house={house}
          offer={offer}
          result={result}
          onRestart={startGame}
          onReview={() => setScreen("game")}
        />
      )}
    </main>
  );
}

export default App;

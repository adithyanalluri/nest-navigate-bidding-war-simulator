import { useMemo, useState } from "react";
import StartScreen from "./components/StartScreen.jsx";
import GameScreen from "./components/GameScreen.jsx";
import DecisionReveal from "./components/DecisionReveal.jsx";
import ResultScreen from "./components/ResultScreen.jsx";
import { competitors, getRandomPersona, house, initialOffer } from "./data/gameData.js";
import { evaluateOffer } from "./utils/scoring.js";
import { recordResult } from "./utils/scorecard.js";

function App() {
  const [screen, setScreen] = useState("start");
  const [persona, setPersona] = useState(() => getRandomPersona());
  const [offer, setOffer] = useState(initialOffer);
  const [result, setResult] = useState(null);

  const preview = useMemo(
    () => evaluateOffer(offer, house, competitors, persona),
    [offer, persona]
  );

  const updateOffer = (field, value) => {
    setOffer((currentOffer) => ({
      ...currentOffer,
      [field]: value
    }));
  };

  const startGame = () => {
    // A finished round means a fresh market: draw a different seller persona.
    if (result) {
      setPersona((currentPersona) => getRandomPersona(currentPersona.id));
    }

    setOffer(initialOffer);
    setResult(null);
    setScreen("game");
  };

  const submitOffer = () => {
    const finalResult = evaluateOffer(offer, house, competitors, persona);
    setResult(finalResult);
    recordResult(finalResult.category);
    setScreen("reveal");
  };

  return (
    <main className="app-shell">
      {screen === "start" && <StartScreen house={house} onStart={startGame} />}
      {screen === "game" && (
        <GameScreen
          house={house}
          persona={persona}
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

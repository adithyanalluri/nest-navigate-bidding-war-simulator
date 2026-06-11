# Bidding War Simulator

A frontend-only React mini game prototype for first-time homebuyers, built for the Nest Navigate Full Stack Engineer internship take-home assignment. It teaches one concept: **the strongest offer is not always the highest offer — and the right offer depends on who is selling.**

## Game Concept

The player is a first-time buyer competing for a home in a hot market. They choose price, financing certainty, down payment, closing speed, inspection terms, and appraisal gap coverage, then submit one best-and-final offer against three competing buyers.

The twist: every round draws a different **seller persona** — a relocating seller racing a job start date, a top-dollar seller in no hurry, or a once-burned seller whose last deal collapsed before closing. Each persona genuinely reweights the scoring engine, so the same offer can win one round and lose the next. Before submitting, the player only sees qualitative seller signals and market rumors, never exact scores; the persona and the numbers are revealed only after the decision locks in, so learning happens through outcome and reflection.

The game tracks two opposing scores: **seller appeal** (how compelling the offer looks) and **buyer risk** (how financially fragile it leaves the buyer). Live analog meters move in opposite directions as the player adjusts terms, making the central trade-off felt rather than explained. Winning while crossing the risk danger zone produces a "Risky Win" — and losing with discipline intact is celebrated as a "Responsible Walkaway."

Players walk away understanding that sellers weigh certainty, speed, inspection risk, and appraisal protection alongside price, that reading the seller matters, and that the best financial move is sometimes not winning.

## How To Run Locally

```bash
npm install
npm run dev
```

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Tech Choices

- **Vite + React + JavaScript** — fast setup, no framework overhead for a self-contained mini game
- **Plain CSS** — one stylesheet with custom properties keeps the design system explainable and dependency-free
- **Local React state (`useState` + `useMemo`)** — game state is a small, serializable object; no state library needed
- **`localStorage`** — persists a session track record (rounds, smart wins, walkaways) with no backend
- No backend, database, auth, external APIs, Redux, or Phaser

## How The Game Works

Every offer — the player's and all three competitors' — is broken into the same six scored components: price, down payment, financing certainty, closing speed, inspection terms, and appraisal protection. The active seller persona multiplies each component by its own weight, so the leaderboard genuinely shifts with the seller:

- **The Relocating Seller** weights closing speed heavily — a modest price with a fast, certain close can win
- **The Top-Dollar Seller** weights price and appraisal protection — speed alone will not impress them
- **The Once-Burned Seller** weights financing certainty and clean inspection terms — the hardest seller to beat smartly, where walking away is often the right answer

Buyer risk is independent of the seller: it rises when the offer stretches above list or appraisal, drains the cash reserve, exceeds the monthly comfort limit, waives inspection, or leans on a large appraisal gap.

The four outcomes come from the interaction of the two scores:

- **Smart Win** — strongest appeal for this seller, risk kept out of the danger zone
- **Risky Win** — the seller says yes, but the buyer is overextended
- **Responsible Walkaway** — lost the house, kept the finances intact
- **Weak Offer** — not competitive enough for this market

Game balance was verified by simulating ~32,000 player offer combinations per persona to confirm that each persona favors a different strategy, a low-risk Smart Win is always achievable, and the naive default offer always loses.

## Project Structure

```text
src/
  App.jsx              Screen flow + game state
  main.jsx
  styles.css
  components/
    StartScreen.jsx    Scenario framing + track record
    GameScreen.jsx     Three-panel game layout
    MarketPanel.jsx    Seller signals (persona-driven) + rumors
    OfferBuilder.jsx   Offer controls
    OfferSummary.jsx   Live tension meters + advisor notes
    DecisionReveal.jsx Staged seller decision + persona unmasking
    ResultScreen.jsx   Outcome, lesson, scorecard, confetti
    ProgressBar.jsx
  data/
    gameData.js        House, seller personas, competitors
  utils/
    scoring.js         Component scoring, persona weighting, risk model
    scorecard.js       localStorage track record
```

## What I'd Do With More Time

- A multi-round campaign: losing a house heats up the market and carries your budget forward
- A one-time counter-offer beat after the seller's first read, for a live auction feel
- More houses, markets, and buyer profiles
- Phaser-based neighborhood scene for the reveal
- Unit tests around the scoring engine (the balance simulation script is the seed for this)

## Known Issues

- The scoring model is intentionally simplified for teaching and should not be treated as financial advice
- Mortgage payment estimates are rough approximations for gameplay context
- Competitor offers are fixed; only the seller persona varies between rounds, so the rumor list is static
- "Adjust offer" after a result replays the same seller, which counts as a new round on the track record

## Deployment Notes

This app is ready for static frontend deployment (Vercel, Netlify, or GitHub Pages). The production build command is:

```bash
npm run build
```

No environment variables or server configuration are required.

# Bidding War Simulator

A frontend-only React mini game prototype for first-time homebuyers, built for the Nest Navigate Full Stack Engineer internship take-home assignment.

## Assignment Overview

The project is a polished, playable React prototype with no backend, database, authentication, external APIs, Redux, or Phaser. It focuses on one meaningful homebuying concept: the strongest offer is not always the highest offer.

## Design Brief

The app is designed as a short discovery-based game, not a mortgage calculator. Before submitting an offer, the player receives qualitative guidance and market rumors rather than exact optimization targets. After submission, the seller reveal and result screens show the underlying comparison so the learning happens through outcome and reflection.

## Game Concept

The player is a first-time buyer competing for a home in a hot market. They choose price, financing certainty, down payment, closing speed, inspection terms, and appraisal gap coverage, then submit one final offer.

## Learning Objective

Players learn that sellers weigh offer certainty, speed, inspection risk, and appraisal protection alongside price. The game also reinforces that buyers should avoid winning a home by taking on fragile financial risk.

## Features

- Start screen with scenario framing
- One polished playable bidding round
- Qualitative offer guidance before submission
- Budget and risk coaching without revealing exact scores early
- Market context and competitor rumor hints
- Seller decision reveal with side-by-side offer comparison
- End screen with outcome, financial summary, and lesson
- Responsive layout for desktop and mobile

## Tech Stack

- Vite
- React
- JavaScript
- Plain CSS
- Local React state with `useState`

No backend, database, authentication, external APIs, Redux, Phaser, or large dependency packages are used.

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

## Game Rules And Scoring Overview

The game calculates two scores:

- **Seller appeal:** how competitive the offer looks to the seller.
- **Buyer risk:** how much financial or protection risk the buyer is taking.

Seller appeal increases with a competitive price, stronger financing, larger down payment, faster closing, lower inspection risk, and appraisal gap coverage.

Buyer risk increases when the offer stretches above list price or appraisal, needs too much available cash, exceeds the buyer's monthly comfort limit, waives inspection, or relies on a large appraisal gap.

Before submission, the player sees qualitative guidance instead of exact seller appeal, buyer risk, or competitive bar scores. The seller decision reveal compares the player's offer against competing offers after the choice is locked in. Seller appeal determines which offer wins, while buyer risk determines whether the player's win is smart or risky.

The result can be:

- **Smart Win:** strong offer without excessive buyer risk.
- **Risky Win:** seller would like the offer, but it is too risky for the buyer.
- **Responsible Walkaway:** the buyer loses but avoids a fragile decision.
- **Weak Offer:** the offer is not competitive enough for the market.

## Project Structure

```text
src/
  App.jsx
  main.jsx
  styles.css
  components/
    GameScreen.jsx
    DecisionReveal.jsx
    MarketPanel.jsx
    OfferBuilder.jsx
    OfferSummary.jsx
    ProgressBar.jsx
    ResultScreen.jsx
    StartScreen.jsx
  data/
    gameData.js
  utils/
    scoring.js
```

## Scope Decisions

This version intentionally keeps scope small: one house, one round, simple state, and explainable scoring. It does not include accounts, persistence, randomized markets, external data, complex mortgage calculations, or multiple scenarios.

## Known Issues

- The scoring model is intentionally simplified for teaching and should not be treated as financial advice.
- The game includes one fixed homebuying scenario rather than multiple markets or difficulty levels.
- Mortgage payment estimates are rough approximations for gameplay context.
- Competitor offers are static so the prototype remains predictable and easy to evaluate.

## What I Would Do With More Time

- Add multiple homes and difficulty levels
- Add saved high scores with localStorage
- Add richer animations
- Add more buyer profiles
- Deploy publicly through Vercel, Netlify, or GitHub Pages

## Deployment Notes

This app is ready for static frontend deployment after the repository is pushed to GitHub. Vercel, Netlify, and GitHub Pages are all appropriate options. The production build command is:

```bash
npm run build
```

No environment variables or server configuration are required.

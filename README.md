# Felt

Preflop poker ranges, hand rankings, pot odds, blind timer, and payout calculator for home games. Installable as a PWA, works offline.

## Features

**For players**
- Preflop ranges — Push/Fold (Nash), RFI, and Vs Raise, by stack depth and position
- Hand Rankings reference
- Pot Odds calculator with common draw equities

**For hosts**
- Blind Timer with editable levels, vibration + sound on level change
- Payout Calculator — buy-ins, rebuys/add-ons, fees, preset or custom payout splits

**Other**
- Dark mode
- Installable PWA with offline support

## Project structure

```
src/
  App.jsx                 top-level state and layout
  components/
    HamburgerMenu.jsx     nav — the app opens here
    HamburgerButton.jsx   shared menu-open icon button
    HandGrid.jsx          13x13 preflop range grid
    ModeSelector.jsx      Push/Fold | RFI | Vs Raise toggle
    PositionSelector.jsx, PlayerCount.jsx, StackInput.jsx
    HandRankings.jsx, PotOdds.jsx, BlindTimer.jsx
    PayoutCalculator/     pool inputs, payout structure, results
  utils/                  range lookups (ranges/rfi/vsraise) and payout math
  data/                   range and payout-preset JSON
  styles.js               shared Tailwind class fragments
scripts/
  gen-icons.mjs           regenerates public/icon-192.png and icon-512.png
```

## Setup

```
npm install
npm run dev      # start dev server
npm run build    # production build to dist/
npm run preview  # preview the production build
npm run lint     # oxlint
```

Requires Node 18+.

## Stack

React 19, Vite, Tailwind CSS 4, vite-plugin-pwa. No backend — fully static, all range data ships as JSON.

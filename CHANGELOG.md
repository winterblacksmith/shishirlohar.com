# Changelog

## 2026-10-02
Added Atlas Quant Research Lab as a static module within the portfolio.
Includes a sourced SPY historical snapshot, daily CSV import, reusable backtesting
engine, configurable momentum and buy-and-hold strategies, proportional transaction
costs, equity chart, risk metrics, trade history, and local experiment storage.
JSON exports include source data and configuration; CSV exports daily equity.

Validation: `npm run check` includes local link checks, syntax checks, and eight
numerical/validation tests. Learning note: `learning/001-backtesting.md`.

The initial implementation uses the site's existing JavaScript stack; React,
FastAPI, shared database storage, and daily automation remain future work.

Fixed the portfolio name hover animation to color the actual text, removing
the offset duplicate-letter overlay.

### Daily market data
- Added an API refresh for completed SPY daily adjusted prices, with retry, validation,
  full-history replacement, freshness checks and a dataset hash.
- Added weekday production refreshes at 23:30 UTC (active after merge to main).
- Release packages use content-derived IDs so data-only updates deploy correctly.
- Added visible data-through/retrieval dates, stale-data status and update checking.
- Added six refresh tests covering unfinished sessions, weekends, bad/missing data,
  stale data, duplicate dates and preserving the previous file after failure.

### Free-service constraint
Verified the repository is public and uses a free standard GitHub Actions runner.
Added a job-level visibility guard to skip deployments if the repository becomes
private, plus a ten-minute timeout. Documented that data refreshes have no paid
fallback and continue to use existing hosting.

## 2026-10-12 — Guided introduction
Rebuilt the Atlas Quant landing page as a five-chapter exhibit: backtesting basics,
strategies, execution timing, metrics and a first-run guide. Includes data/cost
assumptions, CSV and export instructions, accessible chapter links, and an explicitly
illustrative chart. Dedicated exhibit styles preserve the lab interface.
Validation: site checks and 14 tests; browser navigation and mobile overflow checks.

## 2026-10-13 — Independent Atlas and animated workshop

- Replaced the homepage atom with a sequenced assembly, testing, and delivery animation.
- Added pause, visibility, and reduced-motion handling for the workshop.
- Moved Atlas source and tests to winterblacksmith/atlas-quant; pin a tested release here.
- Preserved the lab URLs and the free weekday data refresh on the existing server.
- Added the quant lab homepage navigation link and formatted HTML throughout.

## 2026-10-13 — Continuous feedback loop

- Delivery now returns feedback to assembly, with no idle hold between cycles.
- Removed offscreen auto-pausing; explicit pause and reduced motion remain supported.
- Revalidate pages after releases to prevent stale Projects/Experience navigation.

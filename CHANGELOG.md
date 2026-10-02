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

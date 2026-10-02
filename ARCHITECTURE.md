# Atlas Quant architecture

## First release

Atlas Quant lives at `/quant/`, with the research workspace at `/quant/lab/`.
The existing portfolio is a dependency-free static website served by Nginx.
This release keeps that deployment model: browser ES modules provide the interface,
a pure reusable JavaScript engine provides calculations, and a bundled SPY daily
adjusted-close snapshot provides historical data. CSV import accepts other daily
series; the benchmark always uses the same asset as the strategy.

This deliberately adapts the brief's suggested React/FastAPI/PostgreSQL stack to
the existing website. A server API and shared database are future work, not required
for this single-user research workflow. Experiments persist locally in the browser
and can be downloaded as self-contained JSON including input data and CSV results.
No scheduled agent or trading connection is activated.

## Methodology

Signals use only closes available before execution. At close t, momentum uses
close[t-1] / close[t-1-lookback] > 1. Positions established at close t first earn
the return from t to t+1. Warmup observations precede the selected test window.
Buy-and-hold enters at the first test close. Both pay the same proportional fee
on each entry or exit. Fractional shares; long or cash only; cash earns zero;
no leverage, taxes, separate spread or slippage. Open positions are marked to
market at the last close, without forced liquidation. Adjusted prices model a
reinvested distribution series, not actual historical share counts or fills.

Return = final equity / initial capital - 1. Daily returns include the initial
entry fee. Annualized volatility uses sample standard deviation × sqrt(252).
Sharpe uses arithmetic daily mean / sample deviation × sqrt(252), zero risk-free
rate; undefined when deviation is zero. Drawdown includes starting capital as
an initial high-water mark. Annualization assumes daily trading observations;
import validation cannot independently verify a provider's trading calendar.

## Reproducibility and boundaries

Each saved run records engine version, config,
source metadata, all input rows, results and timestamp. Exports survive browser
storage clearing. Local storage is limited to the latest 10 experiments. There
is no account, cloud sync, live quote feed, or claim of predictive performance.

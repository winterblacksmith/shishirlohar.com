# Portfolio architecture

A dependency-free static website served by the existing Nginx deployment.
HTML lives in `dist/`; shared styles and browser behavior live in `dist/assets/`.
The homepage workshop uses one state machine, so each station waits for the previous
output. It pauses with the header motion control, reduced-motion preference,
and hidden tabs. Delivery sends feedback along a return path to start the next
cycle, with no idle hold between cycles.

## Atlas integration

Atlas is maintained in https://github.com/winterblacksmith/atlas-quant.
Its architecture, methodology, tests, and learning notes live in that repository.
The portfolio locks one tested revision in `atlas-quant.lock.json`.
`npm run sync:atlas` downloads that revision and copies its three public directories
into ignored local outputs under `dist/`. No iframe, additional hosting service,
submodule initialization, or cross-origin API is required.

CI checks out the locked revision, refreshes and validates its daily data, runs its
tests, then assembles it with the portfolio. Production preserves `/quant/` and
`/quant/lab/`. The weekday schedule at 23:30 UTC and existing deployment secrets stay
in the portfolio. Failed validation or refresh prevents publication. Each package
includes `assets/quant/release.json` to identify the Atlas revision.

## Releasing Atlas changes

Review and merge the Atlas PR, then change the full SHA in the lock file on a new
portfolio branch. Run `npm run sync:atlas` and `npm run check`; review and merge the
portfolio PR. Updating Atlas main alone does not alter the deployed website.
The public-repository runner guard and free data-source constraint remain in place.

Nginx sends `Cache-Control: no-cache` so browsers revalidate navigation and assets
after releases. The same setting is maintained in the Docker and live-site configs.

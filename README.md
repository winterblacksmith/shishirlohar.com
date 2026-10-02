# Shishir Lohar — portfolio

A personal, animated portfolio for shishirlohar.com. It is not a React application: it uses semantic HTML, CSS, and vanilla JavaScript, with no package installation or build step required. Nginx serves the production files. The static hosting architecture still supports live animation, search, a command palette, theme switching, and a rotating orbital mark.

## Preview and checks

Run `npm run dev`, then open http://127.0.0.1:4173. Requires Python 3; npm is only a command shortcut. Alternatively run `python3 -m http.server 4173 --bind 127.0.0.1 --directory dist`.

Run `npm run check` for JavaScript syntax and local link checks.

## Edit

Personal project cards should link directly to the project's repository and use the label “Visit the github repo”. Use “Atlanta, Georgia” for the portfolio location on every page.

- `dist/index.html`: intro and about content.
- `dist/projects/index.html`: projects and search keywords.
- `dist/experience/index.html`: roles and education.
- `dist/assets/style.css`: responsive design and motion.
- `dist/assets/app.js`: interactions; `theme.js`: early theme restoration.
- `dist/assets/shishir-lohar-resume.pdf`: supplied resume, served by the résumé link.

Header/footer markup is shared manually between the three HTML pages. Theme and animation preferences persist locally. Reduced-motion settings are respected. No analytics, third-party fonts, or tracking are installed. Project pages link to verified profile or experience destinations rather than guessed repository URLs.

The visual starting points were [Martin Sit's portfolio](https://martinsit.ca/) and [its repository](https://github.com/martin226/v2), with Apple-inspired typography and restrained surfaces. This implementation is independently authored; no reference source or personal assets were copied. 

See [DEPLOYMENT.md](DEPLOYMENT.md) for Docker, Dokploy, Oracle Cloud, and domain setup. The source is pushed to GitHub and installed on Casterly Rock (my oracle cloud server) using Nginx. See the deployment guide for current public-access and HTTPS status.

## Atlas Quant

Open `/quant/` for the overview or `/quant/lab/` for the research workspace.
Uses the existing static hosting stack without added packages or server services.
Run `npm run check` to check the entire site and the quantitative engine tests
(Node 18+); `npm test` runs just the numerical tests.

The bundled Yahoo Finance snapshot contains 1,508 daily SPY adjusted closes from
2020-01-02 through 2025-12-31, retrieved 2026-10-02. It is historical, not live.
Import CSV with `date,close` headers, ISO dates, ascending unique observations,
and positive daily prices. Use one consistent price-adjustment basis.

Experiments save in browser localStorage (latest 10), not a shared database.
Export JSON includes all input rows, source, engine version, configuration and
results; export CSV provides daily strategy/benchmark equity, cash and holdings.
See `ARCHITECTURE.md` for timing and metric formulas, `BACKLOG.md` for scope,
and `learning/001-backtesting.md` for the first lesson.

### Daily market data

Run `npm run refresh:data` to fetch the latest completed SPY daily history through
the Yahoo Finance chart endpoint (no API key). Run `npm run check` before publishing.
The bundled file is now refreshed beyond the original 2020–2025 snapshot.

After merge into `main`, the deployment workflow refreshes and publishes every
weekday at 23:30 UTC. It also refreshes on ordinary production deployments. Before
merge, the schedule is not active. A failure leaves the currently published site
intact; inspect the failed GitHub Actions run. The lab shows data-through and retrieval
dates, warns when stale, and can check for a newer published snapshot. No live quotes
or paid provider subscription is configured. Yahoo's chart endpoint is unofficial;
a supported provider adapter can replace it if reliability requirements increase.

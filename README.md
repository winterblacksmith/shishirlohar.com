# Shishir Lohar — portfolio

A personal, animated portfolio for shishirlohar.com. It is not a React application: it uses semantic HTML, CSS, and vanilla JavaScript, with no package installation or build step required. Nginx serves the production files. The static hosting architecture still supports live animation, search, a command palette, theme switching, and a three-stage animated workshop.

## Preview and checks

Run `npm run sync:atlas` once to fetch the pinned Orion Quant Lab release, then `npm run dev`, then open http://127.0.0.1:4173. Requires Python 3; npm is only a command shortcut. Alternatively run `python3 -m http.server 4173 --bind 127.0.0.1 --directory dist`.

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

## Orion Quant Lab

Orion Quant Lab lives in [its own repository](https://github.com/winterblacksmith/quant-lab).
The portfolio includes the exact revision in `atlas-quant.lock.json`, preserving
`/quant/` and `/quant/lab/`. The lab's source, tests, methodology, refresh script,
and backlog belong there. Local generated Orion Quant Lab files are ignored here.

```sh
npm run sync:atlas
npm run check
npm run dev
```

The deployment workflow validates both repositories, refreshes completed daily
SPY prices with Orion Quant Lab's free unauthenticated Yahoo adapter, and packages the pinned
code with the new snapshot. Weekday refresh remains at 23:30 UTC on `main`.
A failed refresh keeps the existing release online. No new paid service is added.

See [architecture](ARCHITECTURE.md) for the release process. Daily Codex changes
are opened as Orion Quant Lab pull requests; production updates require a reviewed pin bump.

## HTML formatting

HTML uses two-space indentation and a 100-column print width. Run
`npm run format:html` to format with pinned Prettier 3.6.2 on demand. Runtime and
checks need no installed packages. Keep `quant lab` in every main navigation.

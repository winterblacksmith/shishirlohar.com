# Shishir Lohar — portfolio

A personal, animated portfolio for shishirlohar.com. Built with semantic HTML, CSS, and vanilla JavaScript; no package installation or build step is required. Nginx serves the production files. The static hosting architecture still supports live animation, search, a command palette, theme switching, and a rotating AI mark.

## Preview and checks

Run `npm run dev`, then open http://127.0.0.1:4173. Requires Python 3; npm is only a command shortcut. Alternatively run `python3 -m http.server 4173 --bind 127.0.0.1 --directory dist`.

Run `npm run check` for JavaScript syntax and local link checks.

## Edit

- `dist/index.html`: intro and about content.
- `dist/projects/index.html`: projects and search keywords.
- `dist/experience/index.html`: roles and education.
- `dist/assets/style.css`: responsive design and motion.
- `dist/assets/app.js`: interactions; `theme.js`: early theme restoration.
- `dist/assets/shishir-lohar-resume.pdf`: supplied resume, served by the résumé link.

Header/footer markup is shared manually between the three HTML pages. Theme and animation preferences persist locally. Reduced-motion settings are respected. No analytics, third-party fonts, or tracking are installed. Project pages link to verified profile or experience destinations rather than guessed repository URLs.

The visual starting points were [Martin Sit's portfolio](https://martinsit.ca/) and [its repository](https://github.com/martin226/v2), with Apple-inspired typography and restrained surfaces. This implementation is independently authored; no reference source or personal assets were copied. The AI mark, blue palette, and motion follow Shishir's requested personal direction.

See [DEPLOYMENT.md](DEPLOYMENT.md) for Docker, Dokploy, Oracle Cloud, and domain setup. Nothing has been published or provisioned yet.

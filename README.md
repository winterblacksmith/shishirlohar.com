# Shishir Lohar — portfolio

A personal, animated portfolio for shishirlohar.com. It is not a React application: it uses semantic HTML, CSS, and vanilla JavaScript, with no package installation or build step required. Nginx serves the production files. The static hosting architecture still supports live animation, search, a command palette, theme switching, and a rotating orbital mark.

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

See [DEPLOYMENT.md](DEPLOYMENT.md) for Docker, Dokploy, Oracle Cloud, and domain setup. The source is pushed to GitHub and installed on Casterly Rock using Nginx. See the deployment guide for current public-access and HTTPS status.

## DS edition

Preview the separate portfolio at `http://127.0.0.1:4173/ds/`. Source lives in `dist/ds/`; no build or dependencies are needed. Desktop uses two wide screens with a large app carousel. Portrait phones use stacked handheld screens. Click/tap to select an app, select it again or press Open to launch. Arrow keys navigate, Enter opens the focused app, Escape/Home returns, and horizontal swipes change selection. Sounds are synthesized, opt-in, and preference storage gracefully tolerates blocked localStorage. Reduced motion honors the OS setting and the in-app preference.

Research: [ds.css](https://github.com/spiritov/ds.css) is an MIT-licensed browser recreation of DS/DS Lite UI components; [TWiLight Menu++](https://github.com/DS-Homebrew/TWiLightMenu) recreates DSi menus for console hardware. This edition is independently authored to match the supplied DSi/3DS visual references and support a wide desktop carousel. Neither project's code, fonts, sounds, or artwork is bundled.

The current portfolio remains separate. The optional subdomain configuration is in `deployment/ds-nginx-site.conf`; see the deployment guide before enabling it.

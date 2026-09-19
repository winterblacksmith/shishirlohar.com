const $ = (selector) => document.querySelector(selector);
const themeButton = $('#theme');
function syncTheme() { const dark = document.documentElement.dataset.theme === 'dark'; themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`); document.querySelector('meta[name="theme-color"]').content = dark ? '#101011' : '#fafafa'; }
function toggleTheme() { const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = theme; try { localStorage.setItem('portfolio-theme', theme); } catch {} syncTheme(); }
syncTheme(); themeButton.addEventListener('click', toggleTheme);
document.querySelector(`nav [data-page="${document.body.dataset.page}"]`)?.setAttribute('aria-current', 'page');
const palette = $('#palette'), commandSearch = $('#command-search');
function filterCommands() { let count = 0; document.querySelectorAll('#command-list > *').forEach(item => { item.hidden = !item.textContent.toLowerCase().includes(commandSearch.value.trim().toLowerCase()); if (!item.hidden) count++; }); $('#command-empty').hidden = count > 0; }
function openPalette() { if (palette.open) return; commandSearch.value = ''; filterCommands(); palette.showModal(); commandSearch.focus(); }
$('#commands').addEventListener('click', openPalette); $('#close-palette').addEventListener('click', () => palette.close());
$('#command-theme').addEventListener('click', () => { toggleTheme(); palette.close(); });
commandSearch.addEventListener('input', filterCommands);
palette.addEventListener('click', event => { const r = palette.getBoundingClientRect(); if (event.target === palette && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) palette.close(); });
document.addEventListener('keydown', event => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); palette.open ? palette.close() : openPalette(); } if (!palette.open) return; const items = [...document.querySelectorAll('#command-list > *')].filter(el => !el.hidden); const index = items.indexOf(document.activeElement); if (['ArrowDown','ArrowUp'].includes(event.key) && items.length) { event.preventDefault(); items[(index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus(); } if (event.key === 'Enter' && document.activeElement === commandSearch && items.length) { event.preventDefault(); items[0].click(); } });
$('#project-search')?.addEventListener('input', event => { const query = event.target.value.trim().toLowerCase(); let count = 0; document.querySelectorAll('.project').forEach(card => { card.hidden = !card.dataset.search.toLowerCase().includes(query); if (!card.hidden) count++; }); $('#no-projects').hidden = count > 0; });
const motionButton = $('#motion');
let paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
try { paused = localStorage.getItem('portfolio-motion') === 'paused' || paused; } catch {}
function syncMotion() { document.documentElement.dataset.motion = paused ? 'paused' : 'running'; motionButton.textContent = paused ? '▷' : 'Ⅱ'; motionButton.setAttribute('aria-label', paused ? 'Resume animations' : 'Pause animations'); motionButton.title = paused ? 'Resume animations' : 'Pause animations'; }
syncMotion(); motionButton.addEventListener('click', () => { paused = !paused; syncMotion(); try { localStorage.setItem('portfolio-motion', paused ? 'paused' : 'running'); } catch {} });

import { advanceWorkshop, phases } from './workshop-state.js';
const workshop = document.querySelector('[data-workshop]');
if (workshop) {
  const stations = [...workshop.querySelectorAll('[data-station]')];
  const component = workshop.querySelector('[data-component]');
  const arm = workshop.querySelector('[data-arm]');
  const scanner = workshop.querySelector('[data-scanner]');
  const pulse = workshop.querySelector('[data-pulse]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let state = { phase: 0, time: 0, cycle: 1 };
  let previous = null, frame = null, visible = true;
  const ease = value => value * value * (3 - 2 * value);
  function render() {
    const { phase, time, cycle } = state;
    const progress = time / phases[phase].duration;
    workshop.dataset.phase = phases[phase].name;
    workshop.querySelector('[data-cycle]').textContent = String(cycle).padStart(2, '0');
    const labels = [
      phase === 0 ? 'Assembling' : 'Part ready',
      phase < 2 ? 'Waiting for part' : phase === 2 ? 'Checking' : 'Checks passed',
      phase < 4 ? 'Waiting for checks' : phase === 4 ? 'Delivering' : 'Delivered',
    ];
    stations.forEach((station, index) => {
      const active = index * 2;
      station.dataset.state = phase < active ? 'waiting' : phase === active ? 'working' : 'done';
      station.querySelector('[data-status]').textContent = labels[index];
      station.style.setProperty('--progress', phase < active ? 0 : phase === active ? progress : 1);
    });
    let x = 131, y = 120;
    if (phase === 1) x += 191 * ease(progress);
    else if (phase >= 2) x = 322;
    if (phase === 3) { x += 215 * ease(progress); y -= 31 * ease(progress); }
    else if (phase >= 4) { x = 537; y = 89; }
    component.setAttribute('transform', `translate(${x} ${y})`);
    component.style.opacity = phase === 0 ? Math.min(1, progress * 3) : 1;
    arm.setAttribute('transform', `rotate(${phase === 0 ? Math.sin(progress * Math.PI * 4) * 9 : 0} 59 68)`);
    scanner.setAttribute('transform', `translate(0 ${phase === 2 ? Math.sin(progress * Math.PI * 4) * 24 + 24 : 0})`);
    pulse.setAttribute('cy', 62 - (phase === 4 ? (progress * 3 % 1) * 13 : 0));
  }
  function running() {
    return visible && !document.hidden && !reduced.matches && document.documentElement.dataset.motion !== 'paused';
  }
  function tick(now) {
    frame = null;
    if (!running()) { previous = null; return; }
    if (previous !== null) state = advanceWorkshop(state, Math.min(now - previous, 100));
    previous = now;
    render();
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    if (running()) { if (frame === null) frame = requestAnimationFrame(tick); }
    else { cancelAnimationFrame(frame); frame = null; previous = null; }
    if (reduced.matches) { state = { phase: 5, time: 0, cycle: 1 }; render(); }
  }
  new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] });
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }).observe(workshop);
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
  render(); sync();
}

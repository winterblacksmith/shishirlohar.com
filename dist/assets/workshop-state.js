// A single clock owns the handoffs: downstream stations cannot start early.
export const phases = [
  { name: 'build', duration: 2400 },
  { name: 'to-test', duration: 700 },
  { name: 'test', duration: 2000 },
  { name: 'to-ship', duration: 700 },
  { name: 'ship', duration: 2000 },
  { name: 'complete', duration: 1600 },
];
export function advanceWorkshop(state, elapsed) {
  let { phase, time, cycle } = state;
  time += Math.max(0, elapsed);
  while (time >= phases[phase].duration) {
    time -= phases[phase].duration;
    phase = (phase + 1) % phases.length;
    if (phase === 0) cycle++;
  }
  return { phase, time, cycle };
}

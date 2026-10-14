import test from 'node:test';
import assert from 'node:assert/strict';
import {advanceWorkshop, phases} from '../dist/assets/workshop-state.js';
const initial = {phase:0,time:0,cycle:1};
test('testing waits for assembly and the completed handoff',()=>{
  const built=advanceWorkshop(initial,2400);
  assert.equal(phases[built.phase].name,'to-test');
  assert.equal(phases[advanceWorkshop(built,699).phase].name,'to-test');
  assert.equal(phases[advanceWorkshop(built,700).phase].name,'test');
});
test('shipping waits for checks and the second handoff',()=>{
  assert.equal(phases[advanceWorkshop(initial,5799).phase].name,'to-ship');
  assert.equal(phases[advanceWorkshop(initial,5800).phase].name,'ship');
});
test('delivery flows into feedback and straight into the next build',()=>{
  const feedback=advanceWorkshop(initial,7800);
  assert.equal(phases[feedback.phase].name,'feedback');
  assert.equal(phases[advanceWorkshop(feedback,1399).phase].name,'feedback');
  assert.deepEqual(advanceWorkshop(feedback,1400),{phase:0,time:0,cycle:2});
  assert.deepEqual(advanceWorkshop(initial,0),initial);
  assert.deepEqual(advanceWorkshop(initial,18425),{phase:0,time:25,cycle:3});
});
test('many cycles continue without a terminal or idle phase',()=>{
  let state=initial;
  for(let i=0;i<1000;i++) state=advanceWorkshop(state,92);
  assert.deepEqual(state,{phase:0,time:0,cycle:11});
  assert.equal(phases.some(p=>p.name==='complete'||p.name==='idle'),false);
});

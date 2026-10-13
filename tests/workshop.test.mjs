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
test('the completed product remains visible before another cycle begins',()=>{
  const complete=advanceWorkshop(initial,7800);
  assert.equal(phases[complete.phase].name,'complete');
  assert.deepEqual(advanceWorkshop(complete,1600),{phase:0,time:0,cycle:2});
  assert.deepEqual(advanceWorkshop(initial,0),initial);
  assert.deepEqual(advanceWorkshop(initial,18825),{phase:0,time:25,cycle:3});
});

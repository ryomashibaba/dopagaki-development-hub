import test from 'node:test';
import assert from 'node:assert/strict';
import {g4e7akIntegrity,AK_KEY_PROBES,AK_FRAME_SECONDS} from
 '../../scripts/p101-w9c2-g4e7ak-native-key-matrix.mjs';

test('AK does not reauthor B48 roads, gap cell 52 or any of original 28 moving boxes',()=>{
 const records=g4e7akIntegrity();
 assert.deepEqual(records.map(x=>x.road),['true-pinch','pinch-switch']);
 for(const x of records){
  assert.equal(x.realSurfaces,7);
  assert.equal(x.realMovingObstacles,28);
  assert.equal(x.unchangedOriginalMachines,26);
  assert.deepEqual(x.actualVoidCells,[52]);
  assert(x.minWidthMeters>=10&&x.minWidthMeters<=13.5);
 }
});
test('AK scripted A/D windows are bounded and cannot be mistaken for manual QA',()=>{
 assert.deepEqual(AK_KEY_PROBES.map(x=>x.id),[
  'p96-control','left-early','right-early','left-late','right-late']);
 assert.deepEqual(AK_KEY_PROBES.slice(1).map(x=>Math.sign(x.delta)),[-1,1,-1,1]);
 for(const x of AK_KEY_PROBES){
  assert(x.from>=0&&x.to<=9);
  assert(Math.abs(x.delta)<=1);
 }
 assert(AK_FRAME_SECONDS.length>=6);
 assert(AK_FRAME_SECONDS.every(x=>x>0&&x<9));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {g4e7aaBlendedFull} from '../scripts/p101-w9c2-g4e7aa-full-native.mjs';
test('G4E-7AA verifies full 7-road native 240Hz vs no-gap and human HOLD',()=>{
 const q=g4e7aaBlendedFull();
 assert.equal(q.hz,240);assert.equal(q.start00,true);
 assert.equal(q.realRoads,7);assert.equal(q.originalMovingB51C,28);
 assert.equal(q.pairs.length,2);assert.equal(q.formalSlope2Meters,0);
 for(const p of q.pairs){
  assert.equal(p.variant,'landing-soft');
  assert.equal(p.fullRoadCut.realGap,true);
  assert.equal(p.fullRoadIntact.realGap,false);
  assert.equal(p.fullRoadCut.longGapHumanFairness,'UNTESTED');
  assert(p.fullRoadCut.timeSeconds>9);
  if(p.fullRoadCut.finished)assert.equal(p.fullRoadCut.visitedRoads,7);
 }
});

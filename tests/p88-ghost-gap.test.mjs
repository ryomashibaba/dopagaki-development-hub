import test from 'node:test';
import assert from 'node:assert/strict';
import {ghostGapView} from '../web/p88-ghost-gap.mjs';
const ghost={finishSeconds:83,samples:[[0,0,0,0],[83,83,0,0]]};
const doc={stageForge:{id:'EP-P66'}};
test('P88 shows genuine same-time 3D gap, without claiming race time lead',()=>{
 const v=ghostGapView(ghost,doc,0,'manual',true,[0,0,0],20);
 assert.equal(v.visible,true);assert.equal(v.meters,20);assert.equal(v.withinTenMeters,false);
 assert.equal(v.sameClockSeconds,20);
 const near=ghostGapView(ghost,doc,0,'manual',true,[20,0,0],20);
 assert.equal(near.meters,0);assert.equal(near.withinTenMeters,true);
});
test('P88 manual spawn 0 only, never spectator/practice/unavailable after finish',()=>{
 for(const mode of ['spectator-demo','practice','practice-seek']){
  assert.equal(ghostGapView(ghost,doc,0,mode,true,[0,0,0],1).visible,false);
 }
 assert.equal(ghostGapView(ghost,doc,1,'manual',true,[0,0,0],1).visible,false);
 assert.equal(ghostGapView(ghost,doc,0,'manual',false,[0,0,0],1).visible,false);
 assert.equal(ghostGapView(ghost,doc,0,'manual',true,[0,0,0],84).visible,false);
 assert.equal(ghostGapView(ghost,doc,0,'manual',true,[Infinity,0,0],1).visible,false);
});

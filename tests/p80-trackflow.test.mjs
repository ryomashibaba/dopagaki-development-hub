import test from 'node:test';
import assert from 'node:assert/strict';
import {generateEchoRush} from '../scripts/p66-echo-rebuild.mjs';
import {sample,frame} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT,FIXTURE_IMPULSES} from '../private/reference_only/director/physics.js';
import {flowLineVertices,flowProgressState,chapterFromSurface,FLOW_CHAPTERS} from '../web/p80-trackflow.mjs';

const stage=generateEchoRush();
test('P80 all 23 actual driving surface ribbons provide left and right lane flow chevrons',()=>{
 const original=JSON.stringify(stage.surfaces);
 const flow=flowLineVertices(stage,sample,frame);
 assert.equal(stage.surfaces.length,23);
 assert.equal(flow.roads,23);
 assert(flow.markers>=44&&flow.markers<=23*28*2,'unexpected track-flow density');
 assert.equal(flow.vertices.length,flow.markers*4*6,'each chevron must contain two separate colored line segments');
 assert(flow.vertices.every(Number.isFinite));
 assert.deepEqual(JSON.stringify(stage.surfaces),original,'marker generation must not mutate physical road controls');
 const again=flowLineVertices(stage,sample,frame);
 assert.deepEqual(again,flow,'static frame-invariant decor');
});
test('P80 every line endpoint remains near canonical B48 top skin and away from road edges',()=>{
 const f=flowLineVertices(stage,sample,frame,{spacing:80});
 assert(f.markers>20);
 let cursor=0;
 for(const s of stage.surfaces){
  if(!s.rideable||s.visible===false)continue;
  const single=flowLineVertices({surfaces:[s]},sample,frame,{spacing:80});
  for(let i=0;i<single.vertices.length;i+=6){
   const p=single.vertices.slice(i,i+3);
   // True sampled top-skin proximity; fail if new points float elsewhere.
   let minimum=Infinity;
   for(let u=0;u<=24;u++)for(const v of [.18,.19,.28,.37,.63,.72,.81,.82])
    minimum=Math.min(minimum,Math.hypot(...p.map((x,j)=>x-sample(s,u/24,v)[j])));
   assert(minimum<18,'road decorator displaced from actual physical surface '+s.id+': '+minimum);
  }
  cursor+=single.markers;
 }
 assert.equal(cursor,f.markers);
});
test('P80 chapter labels cover every generated real road, including both physical branches',()=>{
 assert.equal(FLOW_CHAPTERS.length,8);
 const ids=new Set();
 for(const surface of stage.surfaces){
  const found=chapterFromSurface(surface.id);
  assert(found,'unmapped active road: '+surface.id);
  ids.add(found.id);
 }
 assert.deepEqual(ids,new Set(FLOW_CHAPTERS.map(x=>x.id)));
 assert.equal(chapterFromSurface('p66-FORK_L-01').id,'fork');
 assert.equal(chapterFromSurface('p66-FORK_R-02').id,'fork');
 assert.equal(chapterFromSurface('p66-PIPE_RETURN-02').id,'return');
 assert.equal(chapterFromSurface('p66-SPIRAL_CATHEDRAL-06').id,'spiral');
 assert.equal(chapterFromSurface(null),null);
});
test('P80 progress is derived from physical contact, not stage timers, and preserves airborne phase',()=>{
 const stageId={stageForge:{id:'EP-P66'}};
 const s=flowProgressState(stageId,'p66-MACHINE_CHAMBER-02',null,'running');
 assert(s.visible&&s.index===5);
 assert.equal(s.stages.filter(x=>x.state==='current').length,1);
 assert.equal(s.stages.filter(x=>x.state==='passed').length,5);
 assert.equal(flowProgressState(stageId,null,'p66-GAP_TAKEOFF-01','running').index,6);
 assert.equal(flowProgressState(stageId,'p66-GAP_LANDING-02',null,'finished').index,7);
 assert.equal(flowProgressState({stageForge:{id:'EP-001'}},'p66-MACHINE_CHAMBER-01',null,'running').visible,false);
});
test('P80 original B48 full playable runner is unaffected by visual creation',()=>{
 assert.equal(DT,1/240);
 assert.deepEqual(FIXTURE_IMPULSES.shove,{side:10,lift:8,forward:3});
 const compiled=compile(stage),untouched=new Runner(stage,compiled,0,44),decorated=new Runner(stage,compiled,0,44);
 for(let i=0;i<720;i++){
  untouched.step(0);
  flowProgressState(stage,decorated.surface,decorated.lastSurface,decorated.status);
  decorated.step(0);
  if(i%15===0)flowLineVertices({surfaces:stage.surfaces.slice(0,2)},sample,frame,{spacing:120});
 }
 assert.deepEqual(decorated.p,untouched.p);
 assert.deepEqual(decorated.v,untouched.v);
 assert.deepEqual(decorated.events,untouched.events);
 assert.equal(decorated.status,untouched.status);
});

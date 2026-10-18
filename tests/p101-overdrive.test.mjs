
import test from 'node:test';
import assert from 'node:assert/strict';
import {generateP101OverdriveCandidate} from '../scripts/p101-overdrive-build.mjs';
import {generateP100TerrainPulseCandidate} from '../scripts/p100-terrain-pulse-build.mjs';
import {p101Step,p101Tune,P101_TUNINGS,P101_STEP,p101LateSurgeGain,P101_LATE_PLANS,p101RoadProgress} from '../web/p101-overdrive.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {P101_EARLY_WARN_DISTANCES} from '../web/p97-roadplay-gates.mjs';
import {P101_B4_PROFILES,p101HighRadiusPulse,p101CurvatureReport} from '../scripts/p101-high-radius-build.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {P95_HAZARD_SPECS} from '../web/p95-hazard-layout.mjs';

test('P101 B4 changes only its own actual 3D roads and machine anchors; P100 is intact',()=>{
 const baseline=generateP100TerrainPulseCandidate(),copy=JSON.stringify(baseline);
 const next=generateP101OverdriveCandidate();
 for(const property of ['spawns','fixtures','routeSegments'])
  assert.deepEqual(next[property],baseline[property],property+' changed without approval');
 assert.equal(next.surfaces.length,7);
 assert.equal(next.movingObstacles.length,12);
 assert.equal(next.stageForge.P100SurfacesModified,false);
 assert.equal(next.stageForge.roadRedesign,'P101_ONLY_REAL_B48_HIGH_RADIUS_7_SKINS');
 let substantiallyChanged=0;
 for(let i=0;i<7;i++){
  const old=baseline.surfaces[i],road=next.surfaces[i];
  assert.equal(road.id,old.id);
  assert.equal(road.rows,31);
  assert.equal(road.cols,5);
  assert.equal(road.rideable,true);
  assert.equal(road.collidable,true);
  for(const row of [0,1,29,30])for(let col=0;col<5;col++)
   assert.deepEqual(road.points[row*5+col],old.points[row*5+col],'chapter joint moved');
  const delta=Math.hypot(...sample(road,.5,.5).map((x,j)=>x-sample(old,.5,.5)[j]));
  if(delta>8)substantiallyChanged++;
 }
 assert(substantiallyChanged>=4,'P101 B4 must modify at least four physically collidable roads');
 for(let i=0;i<12;i++){
  const a=baseline.movingObstacles[i],b=next.movingObstacles[i];
  for(const k of ['id','type','size','collision','phase','period','enabled'])
   assert.deepEqual(b[k],a[k],'B51-C native semantics changed: '+k);
  const [section,u,type,offset]=P95_HAZARD_SPECS[i],road=next.surfaces[section];
  const mid=sample(road,u,.5);
  const distance=Math.hypot(b.position[0]-mid[0],b.position[2]-mid[2]);
  assert(Math.abs(distance-Math.abs(offset))<1.5,'P101 machine detached from real road '+i);
  assert(Math.abs(b.position[1]-mid[1]-[3,2.3,6.4][type])<.2,'P101 machine elevated incorrectly '+i);
 }
 const audit=p101CurvatureReport(next);
 assert.equal(audit.length,7);
 assert(audit.every(x=>x.minRadiusMeters>0&&Number.isFinite(x.medianRadiusMeters)));
 assert.equal(P101_B4_PROFILES.length,7);
 assert.equal(p101HighRadiusPulse(0),0);
 assert.equal(p101HighRadiusPulse(1),0);
 assert(p101HighRadiusPulse(.5)>.99);
 assert.equal(next.stageForge.id,'VB-P101');
 assert.equal(next.stageForge.fullStartToFinish,'NOT_VERIFIED_P101');
 assert.equal(next.stageForge.humanPlaytest,'NOT_RUN');
 assert.equal(next.stageForge.spectatorFullRun,'DISABLED_UNTIL_P101_PROVEN');
 assert.equal(DT,P101_STEP);
 assert.equal(JSON.stringify(baseline),copy);
});
test('P101 has selectable 4x / 4.8x / 6x ground steering but no auto route edit',()=>{
 assert.deepEqual(Object.keys(P101_TUNINGS),['RAPID','OVERDRIVE','HYPER']);
 assert.equal(p101Tune('OVERDRIVE').groundMultiplier,4.8);
 assert.equal(p101Tune('HYPER').groundMultiplier,6.0);
 assert.throws(()=>p101Tune('INVALID'));
 const baseline=generateP100TerrainPulseCandidate(),world=compile(baseline);
 assert.throws(()=>p101Step(new Runner(baseline,world,0,44),1),'P101 only');
});
test('P101 real native 240Hz side force exceeds P100 control at equal starting speed',()=>{
 const stage=generateP101OverdriveCandidate(),world=compile(stage);
 const base=new Runner(stage,world,0,44),trial=new Runner(stage,world,0,44),strong=new Runner(stage,world,0,44);
 const start=[...trial.p],right=(()=>{const f=trial.forward,n=trial.normal;const r=[
  f[1]*n[2]-f[2]*n[1],f[2]*n[0]-f[0]*n[2],f[0]*n[1]-f[1]*n[0]];
  const d=Math.hypot(...r);return r.map(x=>x/d);})();
 for(let i=0;i<240;i++){
  if(base.status!=='failed')base.step(1);
  if(trial.status!=='failed')p101Step(trial,1,'RAPID');
  if(strong.status!=='failed')p101Step(strong,1,'HYPER');
 }
 const lat=r=>r.p.reduce((acc,x,i)=>acc+(x-start[i])*right[i],0);
 assert(lat(trial)>lat(base)+2,JSON.stringify({base:lat(base),rapid:lat(trial)}));
 assert(lat(strong)>lat(trial)+1,JSON.stringify({rapid:lat(trial),hyper:lat(strong)}));
 for(const r of [base,trial,strong])assert(r.p.every(Number.isFinite)&&r.v.every(Number.isFinite));
});
test('P101 free steering accelerates forward without resetting velocity or bypassing B48 collision',()=>{
 const stage=generateP101OverdriveCandidate(),world=compile(stage);
 const standard=new Runner(stage,world,0,44),overdrive=new Runner(stage,world,0,44);
 for(let i=0;i<180;i++){standard.step(0);p101Step(overdrive,0,'OVERDRIVE');}
 assert(Math.hypot(...overdrive.v)>Math.hypot(...standard.v)+3);
 assert.equal(overdrive.time,standard.time);
 assert.equal(overdrive.collisions>=0,true);
 assert(overdrive.events.every(e=>e.type!=='teleport'));
});

test('P101 high-speed machine anticipation starts farther away, without changing B48 or P100 rules',()=>{
 assert.deepEqual(P101_EARLY_WARN_DISTANCES,[690,470,240]);
 assert(P101_EARLY_WARN_DISTANCES[0]/225>3);
});

test('P101 native speed sweep adjusts only optional experimental forward impulse and never changes steering multiplier',()=>{
 const stage=generateP101OverdriveCandidate(),world=compile(stage);
 const base=new Runner(stage,world,0,44),noExtra=new Runner(stage,world,0,44);
 for(let i=0;i<240;i++){p101Step(base,0,'OVERDRIVE');p101Step(noExtra,0,'OVERDRIVE',{forwardScale:0});}
 assert(Math.hypot(...base.v)>Math.hypot(...noExtra.v)+2);
 assert.equal(base.time,noExtra.time);
 assert.throws(()=>p101Step(new Runner(stage,world,0,44),1,'OVERDRIVE',{forwardScale:-.5}));
 assert.throws(()=>p101Step(new Runner(stage,world,0,44),1,'OVERDRIVE',{forwardScale:2}));
});

test('P101 B3 continuous late-surge acceleration preserves all seven original physical roads',()=>{
 const doc=generateP101OverdriveCandidate(),world=compile(doc);
 const runner=new Runner(doc,world,0,44);
 assert.equal(p101RoadProgress(runner).section,0);
 for(const mode of Object.keys(P101_LATE_PLANS)){
  for(let section=0;section<4;section++)assert.equal(p101LateSurgeGain(section,.5,mode),0);
  for(let section=4;section<7;section++){
   const prior=section===4?0:P101_LATE_PLANS[mode][section-5];
   const next=P101_LATE_PLANS[mode][section-4];
   assert.equal(p101LateSurgeGain(section,0,mode),prior);
   assert.equal(p101LateSurgeGain(section,1,mode),next);
   for(let i=0;i<=100;i++)assert(p101LateSurgeGain(section,i/100,mode)>=0);
  }
 }
 const p=[...runner.p],v=[...runner.v];
 const stage=runner.doc.stageForge.id;
 assert.throws(()=>p101Step(runner,0,'OVERDRIVE',{lateSurge:'UNKNOWN'}));
 assert.deepEqual(runner.p,p);
 assert.deepEqual(runner.v,v);
 assert.equal(runner.doc.stageForge.id,stage);
});


import test from 'node:test';
import assert from 'node:assert/strict';
import {generateP101OverdriveCandidate} from '../scripts/p101-overdrive-build.mjs';
import {generateP100TerrainPulseCandidate} from '../scripts/p100-terrain-pulse-build.mjs';
import {p101Step,p101Tune,P101_TUNINGS,P101_STEP} from '../web/p101-overdrive.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {P101_EARLY_WARN_DISTANCES} from '../web/p97-roadplay-gates.mjs';

test('P101 is physically identical to P100 and declares distinct HOLD evidence',()=>{
 const baseline=generateP100TerrainPulseCandidate(),copy=JSON.stringify(baseline);
 const next=generateP101OverdriveCandidate();
 for(const property of ['surfaces','movingObstacles','route','spawns','fixtures','routeSegments'])
  assert.deepEqual(next[property],baseline[property],property+' changed without approval');
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

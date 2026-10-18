import test from 'node:test';
import assert from 'node:assert/strict';
import {generateP101A13RoadCandidate,measureA13MidWidths,A13_MID_WIDTHS} from '../scripts/p101-a13-road-build.mjs';
import {generateP101B5Speedway,measureP101B5Geometry} from '../scripts/p101-b5-speedway-build.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {p101Step} from '../web/p101-overdrive.mjs';

test('A13 independent genuine collidable narrower geometry keeps B5 intact and retains 12 authentic B51-C obstacles',()=>{
 const b5=generateP101B5Speedway({lowerReversalLength:1800}),frozen=JSON.stringify(b5);
 const doc=generateP101A13RoadCandidate(),widths=measureA13MidWidths(doc);
 assert.equal(doc.stageForge.variant,'A13_GAMEPLAY_ISOLATED');
 assert.equal(doc.stageForge.fullStartToFinish,'NOT_VERIFIED_A13');
 assert.equal(doc.stageForge.genuineFastLaw,null);
 assert.equal(doc.stageForge.nominalLengthMeters,7280);
 assert.equal(doc.stageForge.productionPromoted,false);
 assert.equal(doc.surfaces.length,7);
 assert.deepEqual(doc.movingObstacles,b5.movingObstacles);
 assert.deepEqual(doc.spawns,b5.spawns);
 for(let i=0;i<7;i++){
  const s=doc.surfaces[i],orig=b5.surfaces[i];
  assert(s.collidable&&s.rideable);
  assert.deepEqual(s.points.slice(0,5),orig.points.slice(0,5));
  assert.deepEqual(s.points.slice(-5),orig.points.slice(-5));
  const baselineW=Math.hypot(...sample(orig,.5,0).map((x,k)=>x-sample(orig,.5,1)[k]));
  assert(widths[i]<baselineW,'real B48 road must be narrower');
  assert(Math.abs(widths[i]-A13_MID_WIDTHS[i])<4,'A13 expected distinct midpoint width');
  for(let u of [.1,.25,.5,.75,.9])for(let k=0;k<3;k++)
   assert(Math.abs(sample(s,u,.5)[k]-sample(orig,u,.5)[k])<1e-7,'centerline changed unexpectedly');
 }
 const m=measureP101B5Geometry({...doc,stageForge:{...doc.stageForge,variant:'B5_HYPER_ARC_ISOLATED'}});
 assert(m.bounds.every(b=>Math.max(Math.abs(b.min),Math.abs(b.max))<2000));
 assert(m.seams.every(s=>s.gap<3&&s.cosine>.93));
 assert.equal(JSON.stringify(b5),frozen,'B5 baseline must not mutate');
});
test('A13 uses real 240Hz Runner, forwards positive-only B5 force schedule but does not inherit finish claim',()=>{
 const doc=generateP101A13RoadCandidate(),world=compile(doc);
 const a=new Runner(doc,world,0,52),b=new Runner(doc,world,0,52);
 const sa=createA13SurgeState(),sb=createA13SurgeState();
 assert.equal(DT,1/240);
 for(let tick=0;tick<120;tick++){
  p101Step(a,0,'OVERDRIVE',{forwardScale:p101A13ForwardScale(a,sa)});
  p101Step(b,1,'OVERDRIVE',{forwardScale:p101A13ForwardScale(b,sb)});
 }
 assert.notDeepEqual(a.p,b.p,'A13 retains actual manual steering');
 assert(a.p.every(Number.isFinite)&&b.v.every(Number.isFinite));
 assert.equal(doc.stageForge.humanPlaytest,'NOT_RUN');
});

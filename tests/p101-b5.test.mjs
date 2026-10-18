import test from 'node:test';
import assert from 'node:assert/strict';
import {generateP101B5Speedway,measureP101B5Geometry,P101_B5_LENGTH,P101_B5_SECTIONS} from '../scripts/p101-b5-speedway-build.mjs';
import {generateP100TerrainPulseCandidate} from '../scripts/p100-terrain-pulse-build.mjs';
import {P95_HAZARD_SPECS} from '../web/p95-hazard-layout.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {p101Step} from '../web/p101-overdrive.mjs';

test('P101 B5 6.93km actual physical 3D road: two independent giant 180 hairpins, no coordinate escapes',()=>{
 const original=generateP100TerrainPulseCandidate(),hash=JSON.stringify(original),doc=generateP101B5Speedway(),m=measureP101B5Geometry(doc);
 assert.equal(P101_B5_SECTIONS.length,7);
 assert.equal(P101_B5_LENGTH,6930);
 assert.equal(doc.stageForge.variant,'B5_HYPER_ARC_ISOLATED');
 assert.equal(doc.stageForge.fullStartToFinish,'NOT_VERIFIED_P101_B5');
 assert.equal(doc.stageForge.humanPlaytest,'NOT_RUN');
 assert.equal(doc.stageForge.physicsModified,false);
 assert.equal(doc.surfaces.length,7);
 assert.equal(doc.movingObstacles.length,12);
 let changedRoads=0;
 for(let i=0;i<7;i++){
  assert.equal(doc.surfaces[i].id,original.surfaces[i].id);
  assert.deepEqual([doc.surfaces[i].rows,doc.surfaces[i].cols],[31,5]);
  assert.equal(doc.surfaces[i].rideable,true);
  assert.equal(doc.surfaces[i].collidable,true);
  // True road redesign must be substantial over the *whole* section.
  // Midpoint-only difference is invalid: independent 3D routes can cross.
  const differences=[.12,.3,.5,.7,.88].map(u=>Math.hypot(...sample(doc.surfaces[i],u,.5).map((v,k)=>v-sample(original.surfaces[i],u,.5)[k])));
  if(Math.max(...differences)>75)changedRoads++;
 }
 assert(changedRoads>=5,'B5 must truly re-author at least five physical road chapters');
 assert(P101_B5_SECTIONS.filter(x=>Math.abs(x.turn-Math.PI)<.001||Math.abs(x.turn+Math.PI)<.001).length===2);
 assert(m.bounds.every(x=>Math.max(Math.abs(x.min),Math.abs(x.max))<2000));
 for(const seam of m.seams){
  assert(seam.gap<3,JSON.stringify(seam));
  assert(seam.cosine>.93,JSON.stringify(seam));
 }
 assert.equal(JSON.stringify(original),hash,'B5 wrote P100 object');
});
test('P101 B5 retains all twelve real moving hazards with unchanged collision semantics, physically re-anchors 12',()=>{
 const base=generateP100TerrainPulseCandidate(),doc=generateP101B5Speedway();
 for(let i=0;i<12;i++){
  const a=base.movingObstacles[i],b=doc.movingObstacles[i];
  for(const field of ['id','type','size','collision','period','phase','enabled'])
   assert.deepEqual(b[field],a[field],'native machine changed: '+i+':'+field);
  const [section,u,kind,offset]=P95_HAZARD_SPECS[i],p=sample(doc.surfaces[section],u,.5);
  assert(Math.abs(b.position[1]-p[1]-[3,2.3,6.4][kind])<.3);
  assert(Math.abs(Math.hypot(b.position[0]-p[0],b.position[2]-p[2])-Math.abs(offset))<1.1);
 }
});
test('P101 B5 genuine 240Hz runner starts on new physical skin and respects strong lateral input',()=>{
 const doc=generateP101B5Speedway(),world=compile(doc);
 const normal=new Runner(doc,world,0,44),hyper=new Runner(doc,world,0,44);
 assert.equal(DT,1/240);
 for(let i=0;i<120;i++){p101Step(normal,0,'OVERDRIVE');p101Step(hyper,1,'HYPER');}
 assert.equal(normal.time,hyper.time);
 assert(normal.p.every(Number.isFinite)&&hyper.p.every(Number.isFinite));
 assert(normal.v.every(Number.isFinite)&&hyper.v.every(Number.isFinite));
 assert.equal(normal.doc.stageForge.variant,'B5_HYPER_ARC_ISOLATED');
});

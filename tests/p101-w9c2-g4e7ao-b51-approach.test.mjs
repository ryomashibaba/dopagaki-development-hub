import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7AJ} from '../scripts/p101-w9c2-g4e7aj-reanchor-moving.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {g4e7aoActualB51Warning} from '../web/p101-w9c2-g4e7ao-b51-approach.mjs';
const anchors={'a13-machine-01':.32,'a13-machine-02':.80};
const distance=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
for(const roadName of ['true-pinch','pinch-switch']){
 test('AO '+roadName+': real B48 measured lead, shoulder-only noncollider, unchanged 28 native B51',()=>{
  const doc=generateG4E7AJ(roadName,'reanchor'),frozen=JSON.stringify(doc);
  const ao=g4e7aoActualB51Warning(doc,sample,{enabled:true});
  assert.equal(ao.active,true);
  assert.equal(ao.hazards,2);
  assert(ao.stations.length>=4&&ao.stations.length<=6);
  assert(ao.vertices.length>500&&ao.vertices.length%18===0);
  assert(ao.vertices.every(Number.isFinite));
  assert.equal(ao.warningGeometryOnly,true);
  assert.equal(ao.additionalRoads,0);assert.equal(ao.additionalB51,0);
  assert.equal(ao.physicalCollisionChanges,false);
  assert.equal(ao.certifiedSlope2Meters,0);
  assert.equal(ao.publish,'HOLD');
  assert.equal(doc.movingObstacles.length,28);
  for(const s of ao.stations){
   assert(Object.hasOwn(anchors,s.hazardId));
   assert(s.u>=0&&s.u<anchors[s.hazardId]);
   assert([150,95,45].includes(s.measuredLeadMeters));
   assert(s.minimumOffShoulderMeters>=8);
   const f=sample(doc.surfaces[0],s.u,s.side<0?0:1);
   assert(distance(f,s.worldAnchor)<.02);
   // Independent, densified integration of the actual B48 centerline.
   let travelled=0,previous=sample(doc.surfaces[0],s.u,.5);
   for(let i=1;i<=720;i++){
    const current=sample(doc.surfaces[0],s.u+
      (anchors[s.hazardId]-s.u)*i/720,.5);
    travelled+=distance(previous,current);previous=current;
   }
   assert(Math.abs(travelled-s.measuredLeadMeters)<2,
    'real B48 upstream distance not '+s.measuredLeadMeters+'m: '+travelled);
  }
  assert.equal(JSON.stringify(doc),frozen);
  const defaultScene=g4e7aoActualB51Warning(doc,sample);
  assert.equal(defaultScene.active,false);assert.equal(defaultScene.vertices.length,0);
  assert.equal(JSON.stringify(doc),frozen);
 });
}
test('AO refuses unanchored hazards, promoted stages, invalid source, missing real 52 gap',()=>{
 const rejected=generateG4E7AJ('true-pinch','original');
 assert.throws(()=>g4e7aoActualB51Warning(rejected,sample,{enabled:true}),/requires genuine/);
 const published=generateG4E7AJ('true-pinch','reanchor');
 published.stageForge.productionPromoted=true;
 assert.throws(()=>g4e7aoActualB51Warning(published,sample,{enabled:true}),/requires genuine/);
 const fakeGap=generateG4E7AJ('true-pinch','reanchor');
 fakeGap.surfaces[0].voidLongitudinalCells=[];
 assert.throws(()=>g4e7aoActualB51Warning(fakeGap,sample,{enabled:true}),/requires genuine/);
});

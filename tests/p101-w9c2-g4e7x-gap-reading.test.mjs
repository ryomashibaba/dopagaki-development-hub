import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7WBlend} from '../scripts/p101-w9c2-g4e7w-takeoff-blend-build.mjs';
import {g4e7xGapReading} from '../web/p101-w9c2-g4e7x-gap-reading.mjs';
import {sample,frame} from '../private/reference_only/director/surface.js';
import {runRecordKey} from '../web/p75-survival.mjs';
test('G4E-7X private record ID is valid and full-speed lookahead stripes cannot bridge real 15m gap',()=>{
 for(const alpha of [.65,.7]){
  const doc=generateG4E7WBlend(alpha),before=JSON.stringify(doc),gap=doc.stageForge.g4e7wStudy.gap;
  assert.match(runRecordKey(doc.stageForge.recordStageId,0),/dopagaki:survival/);
  const m=g4e7xGapReading(doc,sample,frame,{enabled:true});
  assert(m.enabled);assert(m.nonCollision);assert(m.noFakeBridge);
  assert(m.triangles>40&&m.triangles<300);
  assert(m.actualLipWidthMeters>11&&m.actualLipWidthMeters<16);
  assert(m.upstreamMarks>=18&&m.downstreamMarks>=4);
  assert(m.marks.every(x=>x.u1<gap.uTakeoff||x.u0>gap.uLanding));
  assert(m.marks.some(x=>x.metersBeforeCut>=190));
  assert.deepEqual(g4e7xGapReading(doc,sample,frame),g4e7xGapReading(doc,sample,frame,{enabled:false}));
  assert.equal(JSON.stringify(doc),before);
  assert.equal(m.officialSlope2Meters,0);
 }
 const bad=generateG4E7WBlend(.8);
 assert.throws(()=>g4e7xGapReading(bad,sample,frame,{enabled:true}),/exact private/);
});

test('G4E-7X V2 sculptures stay completely beyond side shoulders and never span the gap',async()=>{
 const {g4e7xOutboardVanes}=await import('../web/p101-w9c2-g4e7x-gap-reading.mjs');
 for(const alpha of [.65,.7]){
  const d=generateG4E7WBlend(alpha),before=JSON.stringify(d);
  const v=g4e7xOutboardVanes(d,sample,frame,{enabled:true});
  assert.equal(v.triangles,60);assert.equal(v.stations.length,10);
  assert.equal(v.minimumOutboardMeters,3.2);
  assert(v.stations.every(s=>s.cutSide==='before'||s.cutSide==='after'));
  assert.equal(v.outboardOnly,true);
  assert.equal(v.noDeckAboveGap,true);
  assert.equal(v.nonCollision,true);
  assert.equal(v.officialSlope2Meters,0);
  assert.equal(JSON.stringify(d),before);
 }
});

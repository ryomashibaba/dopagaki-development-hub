import test from 'node:test';
import assert from 'node:assert/strict';
import {createG4E7OTrial,g4e7oReadRoad,observeG4E7OStep,observeG4E7OFrame,
 exportG4E7OTrial,newG4E7OSession,appendG4E7OTrial,exportG4E7OSession} from '../web/p101-w9c2-g4e7o-manual-qa.mjs';
import {generateG4E7MPhysical} from '../scripts/p101-w9c2-g4e7m-physical-build.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {Runner} from '../private/reference_only/director/physics.js';
import {compile} from '../private/reference_only/director/collision.js';
test('G4E-7O reads real narrow B48 geometry, unchanged Runner and negative clearance',()=>{
 const doc=generateG4E7MPhysical('thread',{visualSpawns:true});
 const r=new Runner(doc,compile(doc),0,52),frozen=JSON.stringify(doc);
 const trial=createG4E7OTrial(doc,r);
 const measured=g4e7oReadRoad(doc,r,sample,.7);
 assert(measured&&measured.widthMeters>20);
 const narrow=doc.spawns[doc.stageForge.g4e7mRealRoad.originalSpawns];
 const s=doc.surfaces.find(s=>s.id===narrow.surface);
 const center=sample(s,narrow.u,.5),edge=sample(s,narrow.u,1);
 r.p=[...center];r.surface=s.id;r.grounded=true;r.time=1;
 const m=g4e7oReadRoad(doc,r,sample,.7);
 assert(m.widthMeters<17);
 assert(m.signedEdgeMarginMeters>4);
 r.p=[...edge];const brink=g4e7oReadRoad(doc,r,sample,.7);
 assert(brink.signedEdgeMarginMeters<0);
 observeG4E7OStep(trial,doc,r,1,sample,.7);
 observeG4E7OFrame(trial,1/60,.04,false);
 const report=exportG4E7OTrial(trial,r);
 assert.equal(report.metrics.nearEdgeStepCount,1);
 assert.equal(report.status,'INTERRUPTED_NOT_A_CLEAR');
 assert.equal(report.render.medianRafFps,60);
 assert.equal(report.approvedSlopeDnaMeters,0);
 assert.equal(JSON.stringify(doc),frozen);
});
test('G4E-7O voluntary two-run export honors original start and feedback',()=>{
 const session=newG4E7OSession();
 for(const kind of ['thread','precipice']){
  const doc=generateG4E7MPhysical(kind,{visualSpawns:true});
  const world=compile(doc),r=new Runner(doc,world,0,52),trial=createG4E7OTrial(doc,r);
  const report=exportG4E7OTrial(trial,r,{visibility:'unsure',note:'No actual human run'});
  appendG4E7OTrial(session,report);
 }
 const report=JSON.parse(exportG4E7OSession(session));
 assert.equal(report.completedBoth,true);assert.equal(report.automatedUpload,false);
 assert.deepEqual(report.runs.map(x=>x.variant),['thread','precipice']);
 assert.throws(()=>appendG4E7OTrial(session,report.runs[0]),/incorrect/);
 const doc=generateG4E7MPhysical('thread',{visualSpawns:true});
 const bad=new Runner(doc,compile(doc),doc.stageForge.g4e7mRealRoad.originalSpawns,52);
 assert.throws(()=>createG4E7OTrial(doc,bad),/original start00/);
});

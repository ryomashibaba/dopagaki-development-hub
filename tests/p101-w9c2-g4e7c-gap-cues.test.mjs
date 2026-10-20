import test from 'node:test';
import assert from 'node:assert/strict';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {generateG4E6EarlyGap} from '../scripts/p101-w9c2-g4e6-early-gap-build.mjs';
import {sample,frame} from '../private/reference_only/director/surface.js';
import {g4e7cGapRoadCues} from '../web/p101-w9c2-g4e7c-gap-cues.mjs';

test('G4E7C stays disabled on Gold, produces no fake surface, never spans actual void',()=>{
 const gold=generateP101A13W7Candidate();
 assert.equal(g4e7cGapRoadCues(gold,sample,frame,{enabled:true}).active,false);
 for(const id of ['C0-55-1','B0-65-1']){
  const doc=generateG4E6EarlyGap(id),immutable=JSON.stringify(doc);
  const noCue=g4e7cGapRoadCues(doc,sample,frame);
  assert.equal(noCue.active,false);
  assert.equal(noCue.vertices.length,0);
  const cue=g4e7cGapRoadCues(doc,sample,frame,{enabled:true});
  const g=doc.stageForge.g4e6EarlyGap;
  assert.equal(JSON.stringify(doc),immutable,'No game geometry or physics mutation');
  assert.equal(cue.active,true);
  assert.equal(cue.nonCollision,true);
  assert.equal(cue.originalGeometryUnmodified,true);
  assert.equal(cue.avoidsMissingRoad,true);
  assert.equal(cue.certifiedSlopeMeters,0);
  assert.equal(cue.id,id);
  assert.ok(cue.triangles>15&&cue.triangles<200);
  assert.equal(cue.triangles*18,cue.vertices.length);
  assert.ok(cue.marks.length>=6);
  assert.ok(cue.marks.some(m=>m.kind==='takeoff-lip'));
  assert.ok(cue.marks.some(m=>m.kind==='landing-lip'));
  assert.ok(cue.marks.some(m=>m.kind==='approach-165'));
  assert.ok(cue.marks.every(m=>m.u1<=g.uTakeoff-1e-5||m.u0>=g.uLanding+1e-5),
   'No GPU triangle, line or stripe can appear within the true missing road');
  assert.ok(cue.marks.filter(m=>m.kind.startsWith('approach')).length>=4);
 }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {g4e7iSkylineContours,G4E7I_MARK_RANGE} from '../web/p101-w9c2-g4e7i-readability.mjs';
import {generateG4E7GVisualDocument} from '../scripts/p101-w9c2-g4e7g-visual-stage.mjs';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {sample,frame} from '../private/reference_only/director/surface.js';
test('G4E7I paints 26 real B48 Skyline shoulder patches but zero collision/support',()=>{
 const gold=generateP101A13W7Candidate(),goldRaw=JSON.stringify(gold);
 const glide=generateG4E7GVisualDocument('glide'),original=JSON.stringify(glide);
 const cues=g4e7iSkylineContours(glide,sample,frame,{enabled:true});
 assert.equal(cues.active,true);assert.equal(cues.segments,26);
 assert.equal(cues.triangles,52);assert.equal(cues.vertices.length,26*36);
 assert.equal(cues.originalPhysicalRoadsUntouched,true);
 assert.equal(cues.newRideableArea,0);assert.equal(cues.nonCollision,true);
 assert.equal(cues.indicatesSafeLane,false);assert.equal(cues.certifiedSlopeMeters,0);
 assert.equal(cues.marks.length,13);
 for(const item of cues.marks){
  assert(item.startU>=G4E7I_MARK_RANGE.startU);
  assert(item.endU<=G4E7I_MARK_RANGE.endU);
  assert.equal(item.noBridgeOrRoadReplacement,true);
 }
 assert(cues.vertices.every(Number.isFinite));
 assert.equal(JSON.stringify(glide),original,'Must not mutate ANY real B48 geometry');
 assert.equal(JSON.stringify(generateP101A13W7Candidate()),goldRaw);
});
test('G4E7I cannot appear on Gold, ordinary W7F, disabled or separate physical gap',()=>{
 const gold=generateG4E7GVisualDocument('gold');
 assert.equal(g4e7iSkylineContours(gold,sample,frame,{enabled:true}).active,false);
 const glide=generateG4E7GVisualDocument('glide');
 assert.equal(g4e7iSkylineContours(glide,sample,frame).active,false);
 assert.equal(g4e7iSkylineContours({},sample,frame,{enabled:true}).vertices.length,0);
 assert.throws(()=>g4e7iSkylineContours(glide,null,frame,{enabled:true}),/requires exact/);
});

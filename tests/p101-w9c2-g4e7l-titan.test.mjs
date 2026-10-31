import test from 'node:test';
import assert from 'node:assert/strict';
import {g4e7lTitanArchitecture,g4e7lAllowed,G4E7L_DISTRICTS,G4E7L_MODES}
 from '../web/p101-w9c2-g4e7l-titan.mjs';
import {generateG4E7GVisualDocument} from '../scripts/p101-w9c2-g4e7g-visual-stage.mjs';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {sample,tessellate} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
test('G4E-7L 2 colossal real-road-anchored sky districts: no new B48, no fake road and Gold immutable',()=>{
 const gold=generateP101A13W7Candidate(),sig=JSON.stringify(gold);
 const doc=generateG4E7GVisualDocument('glide'),raw=JSON.stringify(doc);
 assert(g4e7lAllowed(doc));assert.equal(doc.surfaces.length,7);
 assert.equal(doc.movingObstacles.length,28);
 const r=new Runner(doc,compile(doc),0,52);
 assert.equal(r.startSpeed,52);assert.equal(1/DT,240);
 for(const d of G4E7L_DISTRICTS){
  assert(d.end>d.start);assert(d.outboardMinimumMeters>=65);
  assert.equal(tessellate(doc.surfaces[d.section]).degenerate,0);
 }
 const rift=g4e7lTitanArchitecture(doc,sample,{mode:'rift'});
 const seam=g4e7lTitanArchitecture(doc,sample,{mode:'skyseam'});
 assert.equal(rift.districts,2);
 assert(rift.maximumAltitudeAboveRoadMeters>=300);
 assert(rift.openVoidBays>=12);
 assert(rift.cliffPanels>=50);
 assert.equal(rift.skySeams,0);assert.equal(seam.skySeams,2);
 assert(seam.triangles>rift.triangles);
 assert.equal(seam.outboardFlyingButtresses,20);
 assert.equal(rift.outboardFlyingButtresses,0);
 assert(rift.triangles>2000);
 for(const x of [rift,seam]){
  assert(x.vertices.every(Number.isFinite));
  assert.equal(x.vertices.length%18,0);
  assert.equal(x.nonCollision,true);
  assert.equal(x.addedRoads,0);assert.equal(x.addedSupport,0);
  assert.equal(x.addedMachines,0);
  assert.equal(x.minimumClearanceMeters>=65,true);
  assert.equal(x.officiallyApprovedSlopeDnaMeters,0);
  assert.equal(x.noHumanVisualApproval,true);
 }
 assert.equal(JSON.stringify(doc),raw,'G4E7L may not mutate actual physics!');
 assert.equal(JSON.stringify(generateP101A13W7Candidate()),sig);
});
test('G4E-7L strict GLIDE private opt-in: regular W7F, experimental Gold and gaps remain untouched',()=>{
 const gold=generateG4E7GVisualDocument('gold'),w7=generateP101A13W7Candidate();
 for(const x of [gold,w7]){
  assert.equal(g4e7lAllowed(x),false);
  assert.equal(g4e7lTitanArchitecture(x,sample,{mode:'rift'}).active,false);
  assert.equal(g4e7lTitanArchitecture(x,sample,{mode:'skyseam'}).active,false);
 }
 const doc=generateG4E7GVisualDocument('glide');
 assert.equal(g4e7lTitanArchitecture(doc,sample).active,false);
 assert.deepEqual(G4E7L_MODES,['off','rift','skyseam']);
 assert.throws(()=>g4e7lTitanArchitecture(doc,sample,{mode:'invalid'}),/declared mode/);
});

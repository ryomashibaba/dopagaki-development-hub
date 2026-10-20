import test from 'node:test';
import assert from 'node:assert/strict';
import {g4dOutboardSkyways,G4D_VISUAL_POLICY} from '../web/p101-w9c2-g4d-skyways.mjs';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {generateP101W9C1AbyssCandidate} from '../scripts/p101-w9c1-abyss-narrow.mjs';
import {generateW9C2G4MacroArc} from '../scripts/p101-w9c2-g4-macro-arc-build.mjs';
import {sample} from '../private/reference_only/director/surface.js';

test('G4D default OFF, only exact Gold W7F permitted, G4B and W9-C1 remain unchanged',()=>{
 assert.equal(G4D_VISUAL_POLICY.defaultEnabled,false);
 assert.equal(G4D_VISUAL_POLICY.collidable,false);
 assert.equal(G4D_VISUAL_POLICY.rideable,false);
 const gold=generateP101A13W7Candidate();
 assert.equal(g4dOutboardSkyways(gold,sample).active,false);
 for(const doc of [generateP101W9C1AbyssCandidate('control'),
   generateW9C2G4MacroArc('glide')]){
  const original=JSON.stringify(doc);
  const v=g4dOutboardSkyways(doc,sample,{enabled:true});
  assert.equal(v.active,false);
  assert.equal(v.vertices.length,0);
  assert.equal(JSON.stringify(doc),original);
 }
});
test('G4D real Gold 1800m road-registered monumental skyways have true open gaps, 0 physics mutations',()=>{
 const gold=generateP101A13W7Candidate(),original=JSON.stringify(gold);
 const v=g4dOutboardSkyways(gold,sample,{enabled:true});
 assert.equal(v.active,true);
 assert.equal(v.nonCollision,true);
 assert.equal(v.edgeClearanceMeters,74);
 assert(v.slabs>85&&v.slabs<130);
 assert(v.voidGaps>=15);
 assert.equal(v.landmarks,4);
 assert(v.vertices.length>30000&&v.vertices.length<G4D_VISUAL_POLICY.maxVertexFloats);
 assert.equal(v.vertices.length%18,0);
 assert(v.vertices.every(Number.isFinite));
 assert.equal(JSON.stringify(gold),original);
 assert.deepEqual(g4dOutboardSkyways(gold,sample,{enabled:true}),v,'deterministic static GPU only');
});
test('G4D refuses fake Gold with missing native collider',()=>{
 const gold=generateP101A13W7Candidate();gold.movingObstacles.pop();
 assert.throws(()=>g4dOutboardSkyways(gold,sample,{enabled:true}),/intact W7F Gold/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {G4E7J_CONDITIONS,g4e7jCondition} from '../web/p101-w9c2-g4e7j-matrix.mjs';
import {g4e7iSkylineContours} from '../web/p101-w9c2-g4e7i-readability.mjs';
import {generateG4E7GVisualDocument} from '../scripts/p101-w9c2-g4e7g-visual-stage.mjs';
import {sample,frame} from '../private/reference_only/director/surface.js';
test('G4E-7J truth table is a real orthogonal two-factor 2×2 matrix',()=>{
 assert.equal(G4E7J_CONDITIONS.length,4);
 assert.deepEqual(G4E7J_CONDITIONS.map(x=>[x.id,x.typography,x.contours]),[
  ['none',false,false],['type',true,false],
  ['contour',false,true],['both',true,true]]);
 for(const f of G4E7J_CONDITIONS)assert.equal(g4e7jCondition(f.id),f);
 assert.throws(()=>g4e7jCondition('gold'),/unknown/);
});
test('G4E-7J isolated visual overlay uses the same immutable B48 GLIDE',()=>{
 const stage=generateG4E7GVisualDocument('glide'),baseline=JSON.stringify(stage);
 for(const f of G4E7J_CONDITIONS){
  const result=g4e7iSkylineContours(stage,sample,frame,{enabled:f.contours});
  assert.equal(result.active,f.contours);
  assert.equal(result.triangles,f.contours?52:0);
  assert.equal(result.nonCollision,true);
  assert.equal(result.newRideableArea,0);
  assert.equal(result.certifiedSlopeMeters,0);
 }
 assert.equal(JSON.stringify(stage),baseline);
 assert.equal(g4e7iSkylineContours(generateG4E7GVisualDocument('gold'),sample,frame,{enabled:true}).active,false);
});

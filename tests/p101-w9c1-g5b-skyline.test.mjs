import test from 'node:test';
import assert from 'node:assert/strict';
import {w9c1G5BSkyline,G5B_PARAMETERS} from '../web/p101-w9c1-g5b-skyline.mjs';
import {generateP101W9C1AbyssCandidate} from '../scripts/p101-w9c1-abyss-narrow.mjs';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {generateP101B5Speedway} from '../scripts/p101-b5-speedway-build.mjs';
import {sample} from '../private/reference_only/director/surface.js';

test('G5-B default OFF and strict W9-C1 only (Gold, B5, other stages unchanged)',()=>{
 assert.equal(G5B_PARAMETERS.enabledByDefault,false);
 for(const variant of ['control','ultra']){
  const road=generateP101W9C1AbyssCandidate(variant);
  assert.equal(w9c1G5BSkyline(road,sample).active,false);
  assert.equal(w9c1G5BSkyline(road,sample).vertices.length,0);
 }
 for(const road of [generateP101A13W7Candidate(),
   generateP101B5Speedway({lowerReversalLength:1800})]){
  const original=JSON.stringify(road);
  const candidate=w9c1G5BSkyline(road,sample,{enabled:true});
  assert.equal(candidate.active,false);
  assert.equal(candidate.vertices.length,0);
  assert.equal(JSON.stringify(road),original);
 }
});

test('G5-B genuine B48 edge registration: enormous varied off-road GPU-only masses',()=>{
 for(const variant of ['control','ultra']){
  const road=generateP101W9C1AbyssCandidate(variant),original=JSON.stringify(road);
  const candidate=w9c1G5BSkyline(road,sample,{enabled:true});
  assert.equal(candidate.active,true);
  assert.equal(candidate.nonCollision,true);
  assert.equal(candidate.minimumEdgeClearanceMeters,65);
  assert.ok(candidate.stations>=45,'need substantial architectural skyline mass');
  assert.equal(candidate.masses,candidate.stations*4);
  assert.equal(candidate.luminousPanels,candidate.stations*2);
  assert.ok(candidate.vertices.length>50000&&candidate.vertices.length<G5B_PARAMETERS.maxVertexFloats);
  assert.equal(candidate.vertices.length%18,0);
  assert.ok(candidate.vertices.every(Number.isFinite));
  assert.equal(JSON.stringify(road),original,'no authored B48, moving obstacles, spawns or score mutation');
 }
});

test('G5-B cannot be accidentally used on a mutated physics stage',()=>{
 const road=generateP101W9C1AbyssCandidate('control');
 road.movingObstacles.pop();
 assert.throws(()=>w9c1G5BSkyline(road,sample,{enabled:true}),/intact W9-C1/);
});

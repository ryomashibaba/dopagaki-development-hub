import test from 'node:test';
import assert from 'node:assert/strict';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {generateG4E6EarlyGap} from '../scripts/p101-w9c2-g4e6-early-gap-build.mjs';
import {sample,frame} from '../private/reference_only/director/surface.js';
import {a13RacingRoadArt} from '../web/p101-a13-road-art.mjs';
test('G4E6D decorative road art cannot visually bridge a cut B48 physical road',()=>{
 const gold=a13RacingRoadArt(generateP101A13W7Candidate(),sample,frame);
 assert.equal(gold.g4e6RealGapVisualClearance,false);
 for(const site of ['C0-55-1','B0-65-1']){
  const art=a13RacingRoadArt(generateG4E6EarlyGap(site),sample,frame);
  assert.equal(art.g4e6RealGapVisualClearance,true);
  assert.equal(art.nonCollision,true);
  assert.ok(art.segments>=140);
  assert.ok(art.segments<gold.segments,
   'At least one GPU chevron crossing the missing floor must be omitted');
 }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7TPhysical} from '../scripts/p101-w9c2-g4e7t-real-early-gap-build.mjs';
import {a13RacingRoadArt} from '../web/p101-a13-road-art.mjs';
import {p100RoadReadGeometry} from '../web/p100-road-read.mjs';
import {p101B5OpticalRoadGeometry} from '../web/p101-b5-road-optic.mjs';
import {sample,frame} from '../private/reference_only/director/surface.js';
test('G4E-7T true B48 void not hidden by road chevrons, P100 read or B5 stripe overlays',()=>{
 const solid=generateG4E7TPhysical('solid');
 for(const variant of ['early','late']){
  const cut=generateG4E7TPhysical(variant),gap=cut.stageForge.g4e7tStudy.gap;
  const a=a13RacingRoadArt(solid,sample,frame),b=a13RacingRoadArt(cut,sample,frame);
  const p=p100RoadReadGeometry(solid,sample,frame),q=p100RoadReadGeometry(cut,sample,frame);
  const r=p101B5OpticalRoadGeometry(solid,sample,frame),s=p101B5OpticalRoadGeometry(cut,sample,frame);
  assert(gap.physicalTwoCellVoid);assert(gap.gapMeters>3);
  assert.equal(b.g4e6RealGapVisualClearance,true);
  assert.equal(a.g4e6RealGapVisualClearance,false);
  assert(b.vertices.length<a.vertices.length);
  assert(q.vertices.length<p.vertices.length);
  assert(s.vertices.length<r.vertices.length);
  assert.deepEqual(cut.surfaces[0].points,solid.surfaces[0].points);
 }
});

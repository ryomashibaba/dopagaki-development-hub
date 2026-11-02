import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7RPhysical} from '../scripts/p101-w9c2-g4e7r-grade-build.mjs';
import {sample,frame} from '../private/reference_only/director/surface.js';
import {a13RacingRoadArt} from '../web/p101-a13-road-art.mjs';
import {p100RoadReadGeometry} from '../web/p100-road-read.mjs';
import {p101B5OpticalRoadGeometry} from '../web/p101-b5-road-optic.mjs';
test('G4E-7R real CUT does not allow GPU road art or optic to fake a bridge',()=>{
 const sweep=generateG4E7RPhysical('sweep'),cut=generateG4E7RPhysical('cut');
 const original=a13RacingRoadArt(sweep,sample,frame),
  candidate=a13RacingRoadArt(cut,sample,frame);
 const p0=p100RoadReadGeometry(sweep,sample,frame),p1=p100RoadReadGeometry(cut,sample,frame);
 const o0=p101B5OpticalRoadGeometry(sweep,sample,frame),o1=p101B5OpticalRoadGeometry(cut,sample,frame);
 assert.equal(original.g4e6RealGapVisualClearance,false);
 assert.equal(candidate.g4e6RealGapVisualClearance,true);
 assert(candidate.vertices.length<original.vertices.length);
 assert(p1.stripes<p0.stripes,'real missing road must omit all parallel paint crossing the void');
 assert(p1.vertices.length<p0.vertices.length);
 assert(o1.vertices.length<o0.vertices.length);
 assert.deepEqual(sweep.surfaces[0].points,cut.surfaces[0].points);
 assert.equal(cut.stageForge.g4e7rStudy.officialSlope2Meters,0);
});

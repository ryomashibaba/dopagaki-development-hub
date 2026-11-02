import test from 'node:test';
import assert from 'node:assert/strict';
import {a13RacingRoadArt,g4e7pAllowed} from '../web/p101-a13-road-art.mjs';
import {generateG4E7MPhysical} from '../scripts/p101-w9c2-g4e7m-physical-build.mjs';
import {generateG4E7GVisualDocument} from '../scripts/p101-w9c2-g4e7g-visual-stage.mjs';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {sample,frame} from '../private/reference_only/director/surface.js';
test('G4E-7P physically identical TRUE B48 narrower roads with fewer GPU decorations',()=>{
 for(const variant of ['thread','precipice']){
  const doc=generateG4E7MPhysical(variant,{visualSpawns:true}),frozen=JSON.stringify(doc);
  assert(g4e7pAllowed(doc));
  const original=a13RacingRoadArt(doc,sample,frame),quiet=a13RacingRoadArt(doc,sample,frame,{quietNarrow:true});
  assert(quiet.g4e7p.quietBySection.every(n=>n>=2));
  assert(quiet.g4e7p.deletedTrianglesEstimate>0);
  assert(quiet.vertices.length<original.vertices.length);
  assert.equal(quiet.segments,original.segments);
  assert.equal(quiet.nonCollision,true);
  assert.equal(quiet.g4e7p.outerRoadEdgePaintRetained,true);
  assert.equal(quiet.g4e7p.officiallyApprovedSlopeDnaMeters,0);
  assert.equal(JSON.stringify(doc),frozen,'physical B48 and 28 machines invariant');
  assert.deepEqual(a13RacingRoadArt(doc,sample,frame),original);
 }
});
test('G4E-7P not eligible on GLIDE, Gold, W7F or mixed experiment',()=>{
 for(const doc of [generateP101A13W7Candidate(),generateG4E7GVisualDocument('glide'),generateG4E7GVisualDocument('gold')]){
  assert.equal(g4e7pAllowed(doc),false);
  assert.throws(()=>a13RacingRoadArt(doc,sample,frame,{quietNarrow:true}),/private B48/);
 }
 assert.throws(()=>a13RacingRoadArt(generateG4E7MPhysical('thread'),sample,frame,{quietSkyline:true,quietNarrow:true}),/independent/);
});

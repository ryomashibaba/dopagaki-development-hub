import test from 'node:test';
import assert from 'node:assert/strict';
import {a13RacingRoadArt} from '../web/p101-a13-road-art.mjs';
import {g4e7kAllowed,G4E7K_WINDOW} from '../web/p101-w9c2-g4e7k-quiet-visual.mjs';
import {generateG4E7GVisualDocument} from '../scripts/p101-w9c2-g4e7g-visual-stage.mjs';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {sample,frame} from '../private/reference_only/director/surface.js';

test('G4E-7K actual B48 GLIDE: remove only interior GPU chevrons, no physics/Gold mutation',()=>{
 const Gold=generateP101A13W7Candidate(),G=JSON.stringify(Gold),
   doc=generateG4E7GVisualDocument('glide'),D=JSON.stringify(doc);
 assert(g4e7kAllowed(doc));
 const baseline=a13RacingRoadArt(doc,sample,frame);
 const quiet=a13RacingRoadArt(doc,sample,frame,{quietSkyline:true});
 assert(quiet.g4e7k.active);
 assert(quiet.g4e7k.quietChevrons>=3);
 assert.equal(quiet.g4e7k.section,G4E7K_WINDOW.section);
 assert.deepEqual(quiet.g4e7k.normalizedWindow,[G4E7K_WINDOW.uStart,G4E7K_WINDOW.uEnd]);
 assert.equal(quiet.g4e7k.outerRoadEdgePaintRetained,true);
 assert.equal(quiet.g4e7k.nonCollision,true);
 assert.equal(quiet.g4e7k.officiallyApprovedSlopeDnaMeters,0);
 assert.equal(quiet.segments,baseline.segments);
 assert(quiet.vertices.length<baseline.vertices.length-1000,'actual GPU clutter must drop');
 assert.equal(quiet.vertices.length%18,0);
 assert(quiet.vertices.every(Number.isFinite));
 assert.equal(JSON.stringify(doc),D,'B48/28-machine stages MUST be byte identical');
 assert.equal(JSON.stringify(generateP101A13W7Candidate()),G);
 // Omitted options must be exactly the previously frozen baseline render.
 assert.deepEqual(a13RacingRoadArt(doc,sample,frame),baseline);
});
test('G4E-7K Gold, ordinary W7F and legacy gap cannot opt into scenery removal',()=>{
 const w7=generateP101A13W7Candidate(),gold=generateG4E7GVisualDocument('gold');
 assert.equal(g4e7kAllowed(w7),false);assert.equal(g4e7kAllowed(gold),false);
 assert.throws(()=>a13RacingRoadArt(w7,sample,frame,{quietSkyline:true}),/only on real private/);
 assert.throws(()=>a13RacingRoadArt(gold,sample,frame,{quietSkyline:true}),/only on real private/);
 const base=a13RacingRoadArt(w7,sample,frame);
 assert.equal(base.g4e7k,undefined);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {p101B5OpticalRoadGeometry} from '../web/p101-b5-road-optic.mjs';
import {generateP101B5Speedway} from '../scripts/p101-b5-speedway-build.mjs';
import {generateP100TerrainPulseCandidate} from '../scripts/p100-terrain-pulse-build.mjs';
import {sample,frame} from '../private/reference_only/director/surface.js';

test('B5 premium road optics are real 20m-spaced B48 skin-bound uncollidable paint geometry',()=>{
 const b5=generateP101B5Speedway({lowerReversalLength:1800}),original=JSON.stringify(b5);
 const r=p101B5OpticalRoadGeometry(b5,sample,frame);
 assert.equal(r.opticalSpacingMeters,20);
 assert(r.dashes>500&&r.dashes<1100,JSON.stringify({dashes:r.dashes}));
 assert.equal(r.dashes,r.edgeTicks);
 assert(r.distanceMeters>7000&&r.distanceMeters<8200);
 assert.equal(r.nonCollision,true);
 assert.equal(r.vertices.length%36,0,'two triangles with six floats per vertex');
 assert(r.vertices.length>18000&&r.vertices.length<140000);
 assert(r.vertices.every(Number.isFinite));
 assert.equal(JSON.stringify(b5),original,'render optics MUST NOT edit real B48 collision world');
});
test('B5 road optics cannot replace baseline P100 or pretend noncollidable meshes are B48 physics',()=>{
 const original=generateP100TerrainPulseCandidate(),snapshot=JSON.stringify(original);
 const empty=p101B5OpticalRoadGeometry(original,sample,frame);
 assert.equal(empty.dashes,0);
 assert.equal(empty.vertices.length,0);
 assert.equal(JSON.stringify(original),snapshot,'frozen P100 mutated');
 const b5=generateP101B5Speedway({lowerReversalLength:1800});
 b5.surfaces[4].rideable=false;
 assert.throws(()=>p101B5OpticalRoadGeometry(b5,sample,frame),/collision-authoritative/);
});

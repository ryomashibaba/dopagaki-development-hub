import test from 'node:test';
import assert from 'node:assert/strict';
import {a13RacingRoadArt} from '../web/p101-a13-road-art.mjs';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {generateP101B5Speedway} from '../scripts/p101-b5-speedway-build.mjs';
import {sample,frame} from '../private/reference_only/director/surface.js';
test('W8 real B48-registered speedway armor: rich GPU-only marks without altering B5 or physics',()=>{
 const w7=generateP101A13W7Candidate(),raw=JSON.stringify(w7);
 const r=a13RacingRoadArt(w7,sample,frame);
 assert(r.segments>170&&r.segments<320);
 assert(r.vertices.length>25000&&r.vertices.length<180000&&r.vertices.length%18===0);
 assert(r.vertices.every(Number.isFinite)&&r.nonCollision);
 assert.equal(r.sections,7);assert.equal(JSON.stringify(w7),raw);
 const b5=generateP101B5Speedway({lowerReversalLength:1800});
 assert.deepEqual(a13RacingRoadArt(b5,sample,frame),{vertices:[],segments:0,sections:0,nonCollision:true});
});

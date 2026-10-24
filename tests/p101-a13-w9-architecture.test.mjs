import test from 'node:test';
import assert from 'node:assert/strict';
import {a13W9HeroArchitecture,W9_HERO_DISTRICTS} from '../web/p101-a13-w9-architecture.mjs';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {generateP101B5Speedway} from '../scripts/p101-b5-speedway-build.mjs';
import {sample} from '../private/reference_only/director/surface.js';

test('W9-A actual road registered mass architecture is GPU-only and B5 isolated',()=>{
 const doc=generateP101A13W7Candidate(),before=JSON.stringify(doc);
 const result=a13W9HeroArchitecture(doc,sample);
 assert.equal(result.facilities,2);
 assert.deepEqual(result.sections,[0,3]);
 assert.equal(result.skylights,2);
 assert.equal(result.wallPlates,208);
 assert.equal(result.roofPlates,104);
 assert.equal(result.minShoulderMeters,19);
 assert.equal(result.nonCollision,true);
 assert.ok(result.vertices.length>30000&&result.vertices.length<260000&&result.vertices.length%18===0);
 assert.ok(result.vertices.every(Number.isFinite));
 assert.deepEqual(W9_HERO_DISTRICTS.map(z=>z.name),['LAUNCH FOUNDRY','UNDERPASS CROWN']);
 assert.equal(JSON.stringify(doc),before,'W9 must not mutate physics source, 28 machines, or score');
 const b5=generateP101B5Speedway({lowerReversalLength:1800});
 const old=JSON.stringify(b5);
 const isolated=a13W9HeroArchitecture(b5,sample);
 assert.equal(isolated.facilities,0);
 assert.equal(isolated.vertices.length,0);
 assert.equal(JSON.stringify(b5),old);
});

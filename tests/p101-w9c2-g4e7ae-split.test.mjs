import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7ACR2} from '../scripts/p101-w9c2-g4e7ac-r2-physical.mjs';
import {g4e7aeSplitHorizon} from '../web/p101-w9c2-g4e7ae-split-horizon.mjs';
import {sample} from '../private/reference_only/director/surface.js';
test('AE genuinely replaces panorama with two outboard sculpted city banks; physics stays identical',()=>{
 const d=generateG4E7ACR2('approach-arc'),before=JSON.stringify(d);
 const off=g4e7aeSplitHorizon(d,sample,{enabled:false});
 const art=g4e7aeSplitHorizon(d,sample,{enabled:true});
 assert.equal(off.enabled,false);
 assert.equal(art.enabled,true);
 assert.equal(art.bankCount,2);
 assert(art.voids>45&&art.folds>20);
 assert(art.triangles>800&&art.triangles<12000);
 assert.equal(art.spanOverRoad,false);
 assert(art.minOutboardMeters>=50);
 assert.equal(art.nonCollision,true);
 assert.equal(art.nativeRoads,7);
 assert.equal(art.nativeMovingHazards,28);
 assert.equal(art.certifiedSlope2Meters,0);
 assert.equal(JSON.stringify(d),before);
});
test('AE must never render in unrelated collision course',()=>{
 const d=generateG4E7ACR2('landing-crescent');
 assert.throws(()=>g4e7aeSplitHorizon(d,sample,{enabled:true}),/only for genuine/);
});

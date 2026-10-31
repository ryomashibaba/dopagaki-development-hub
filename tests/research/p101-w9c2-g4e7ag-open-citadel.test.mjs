import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7ACR2} from '../../scripts/p101-w9c2-g4e7ac-r2-physical.mjs';
import {g4e7agOpenCitadel} from '../../web/p101-w9c2-g4e7ag-open-citadel.mjs';
import {sample} from '../../private/reference_only/director/surface.js';
test('AG open-sky citadel has five truly open arched landmarks not opaque curtains',()=>{
 const doc=generateG4E7ACR2('approach-arc'),orig=JSON.stringify(doc);
 const off=g4e7agOpenCitadel(doc,sample,{enabled:false}),on=g4e7agOpenCitadel(doc,sample,{enabled:true});
 assert.equal(off.enabled,false);assert.equal(on.enabled,true);
 assert.equal(on.landmarks,5);assert.equal(on.openCenters,5);assert.equal(on.urbanIslands,15);
 assert(on.lightRibs>=85);assert(on.triangles>800&&on.triangles<10000);
 assert(on.minimumOutboardMeters>=85);
 assert.equal(on.addedCollision,0);assert.equal(on.addedRoads,0);
 assert.equal(on.physicalChanges,false);assert.equal(on.certifiedSlope2Meters,0);
 assert.equal(on.publish,'HOLD');
 assert.equal(JSON.stringify(doc),orig);
});
test('AG refuses unrelated 7AC R2 study',()=>assert.throws(()=>
 g4e7agOpenCitadel(generateG4E7ACR2('landing-crescent'),sample,{enabled:true}),/only for frozen/));

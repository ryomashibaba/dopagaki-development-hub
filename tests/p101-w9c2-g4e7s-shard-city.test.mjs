import test from 'node:test';
import assert from 'node:assert/strict';
import {g4e7sShardCity,g4e7sAllowed,G4E7S_MONUMENTS} from '../web/p101-w9c2-g4e7s-shard-city.mjs';
import {generateG4E7RPhysical} from '../scripts/p101-w9c2-g4e7r-grade-build.mjs';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {sample} from '../private/reference_only/director/surface.js';
test('G4E-7S private skyline is non-collision, exterior, huge, pierced, and immutable',()=>{
 const cut=generateG4E7RPhysical('cut'),gold=generateP101A13W7Candidate(),
  original=JSON.stringify(cut),goldSign=JSON.stringify(gold);
 const off=g4e7sShardCity(cut,sample),on=g4e7sShardCity(cut,sample,{enabled:true});
 assert.equal(off.active,false);assert.equal(off.vertices.length,0);
 assert(g4e7sAllowed(cut));assert(!g4e7sAllowed(gold));
 assert.equal(on.spires,6);assert(on.voidWindows>=12);
 assert(on.maximumHeightMeters>=340);
 assert(on.outboardMinimumMeters>=90);
 assert(on.triangles>300&&on.triangles<6500);
 assert(on.vertices.every(Number.isFinite));
 assert.equal(on.nonCollision,true);assert.equal(on.extraRoads,0);
 assert.equal(on.extraBridges,0);assert.equal(on.extraMachines,0);
 assert.equal(on.officialSlope2Meters,0);
 assert.equal(JSON.stringify(cut),original);
 assert.equal(JSON.stringify(gold),goldSign);
 assert.deepEqual(g4e7sShardCity(gold,sample,{enabled:true}),off);
 assert(G4E7S_MONUMENTS.some(m=>m.side<0));
 assert(G4E7S_MONUMENTS.some(m=>m.side>0));
});

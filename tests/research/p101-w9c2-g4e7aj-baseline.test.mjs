import test from 'node:test';
import assert from 'node:assert/strict';
import {g4e7ajBaselineThreat} from '../../scripts/p101-w9c2-g4e7aj-baseline-threat.mjs';
test('G4E-7AJ read-only native original 28 hazards and 11m B48 lane pressure',()=>{
 const x=g4e7ajBaselineThreat();
 assert.equal(x.original7Roads,true);assert.equal(x.original28Machines,true);
 assert.equal(x.sourceModification,false);assert.equal(x.physicsHz,240);
 assert.equal(x.variants.length,2);assert.equal(x.formalSlope2Meters,0);
 for(const c of x.variants){
  assert.equal(c.stations.length,2);assert.equal(c.realOriginalMachines,28);
  for(const o of c.stations){
   assert(Number.isFinite(o.minimumRunnerOBBSeparationM));
   assert(Number.isFinite(o.staticRoadOffsetM));assert(o.trace.length>5);
   for(const a of o.trace)assert(a.width>=10&&Number.isFinite(a.leftFree));
  }
 }
});

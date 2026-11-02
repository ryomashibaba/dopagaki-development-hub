import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7WBlend} from '../scripts/p101-w9c2-g4e7w-takeoff-blend-build.mjs';
import {a13MachineMegastructures} from '../web/p101-a13-architecture.mjs';
import {a13W9HeroArchitecture} from '../web/p101-a13-w9-architecture.mjs';
import {sample} from '../private/reference_only/director/surface.js';
test('G4E-7Y nonphysical first-road sightline, actual B51-C and B48 remain',()=>{
 for(const alpha of [.65,.7]){
  const d=generateG4E7WBlend(alpha),frozen=JSON.stringify(d),
   a=a13MachineMegastructures(d,sample),b=a13MachineMegastructures(d,sample,{quietGapSection0:true}),
   h=a13W9HeroArchitecture(d,sample),q=a13W9HeroArchitecture(d,sample,{quietFirstSection:true});
  assert.equal(a.nativeMachineCount,28);assert.equal(b.nativeMachineCount,28);
  assert(b.removed>0);assert.equal(b.structures+b.removed,a.structures);
  assert(b.vertices.length<a.vertices.length);
  assert.equal(h.facilities,2);assert.equal(q.facilities,1);
  assert.deepEqual(q.sections,[3]);assert(q.vertices.length<h.vertices.length);
  assert.deepEqual(d.surfaces[0].voidLongitudinalCells,[52]);
  assert.equal(d.surfaces.length,7);assert.equal(d.movingObstacles.length,28);
  assert.equal(JSON.stringify(d),frozen);
 }
});

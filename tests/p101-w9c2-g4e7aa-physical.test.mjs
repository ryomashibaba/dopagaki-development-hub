import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7AA,AA_VARIANTS,AA_ALPHAS} from '../scripts/p101-w9c2-g4e7aa-physical.mjs';
import {generateG4E7WBlend} from '../scripts/p101-w9c2-g4e7w-takeoff-blend-build.mjs';
import {tessellate,sample} from '../private/reference_only/director/surface.js';
test('G4E-7AA 6 independent road-only height studies preserve real 1-cell gap and 28 B51-C hazards',()=>{
 for(const alpha of AA_ALPHAS){
  const base=generateG4E7WBlend(alpha),frozen=JSON.stringify(base);
  for(const cfg of AA_VARIANTS){
   const d=generateG4E7AA(alpha,cfg.id),m=d.stageForge.g4e7aaStudy;
   assert.equal(d.surfaces.length,7);assert.equal(d.movingObstacles.length,28);
   assert.deepEqual(d.surfaces[0].voidLongitudinalCells,[52]);
   assert.deepEqual(d.surfaces.slice(1),base.surfaces.slice(1));
   assert.deepEqual(d.spawns,base.spawns);
   assert.deepEqual(d.movingObstacles,base.movingObstacles);
   assert.deepEqual(d.routeSegments,base.routeSegments);
   assert.equal(d.stageForge.productionPromoted,false);
   assert(m.actualGap.gapMeters>2.5&&m.actualGap.gapMeters<13);
   assert(m.actualGap.lipWidthMeters>11&&m.actualGap.lipWidthMeters<16);
   assert.equal(m.officialSlope2Meters,0);
   assert.equal(tessellate(d.surfaces[0]).degenerate,0);
   for(let i=0;i<31;i++)for(let j=0;j<5;j++){
    const before=base.surfaces[0].points[i*5+j],after=d.surfaces[0].points[i*5+j];
    if(cfg.rowY[i]===undefined)assert.deepEqual(after,before);
    else {
     assert.equal(after[0],before[0]);assert.equal(after[2],before[2]);
     assert(Math.abs(after[1]-before[1]-cfg.rowY[i])<1e-10);
    }
   }
  }
  assert.equal(JSON.stringify(generateG4E7WBlend(alpha)),frozen);
 }
});

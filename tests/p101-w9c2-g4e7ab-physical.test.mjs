import test from 'node:test';
import assert from 'node:assert/strict';
import {AB_CONTOURS,generateG4E7AB} from '../scripts/p101-w9c2-g4e7ab-physical.mjs';
import {generateG4E7AA} from '../scripts/p101-w9c2-g4e7aa-physical.mjs';
import {tessellate} from '../private/reference_only/director/surface.js';
test('G4E-7AB 5 0.15–0.6m true B48 contour alternatives preserve full stage and no ghost span',()=>{
 const ref=generateG4E7AA(.7,'landing-soft'),before=JSON.stringify(ref);
 for(const c of AB_CONTOURS){
  const d=generateG4E7AB(c.id),m=d.stageForge.g4e7abStudy;
  assert.equal(d.surfaces.length,7);assert.equal(d.movingObstacles.length,28);
  assert.deepEqual(d.surfaces.slice(1),ref.surfaces.slice(1));
  assert.deepEqual(d.spawns,ref.spawns);
  assert.deepEqual(d.routeSegments,ref.routeSegments);
  assert.deepEqual(d.movingObstacles,ref.movingObstacles);
  assert.deepEqual(d.surfaces[0].voidLongitudinalCells,[52]);
  assert.equal(m.certifiedSlope2Meters,0);
  assert.equal(m.publication,'HOLD');
  assert(m.gap.lipWidthMeters>11&&m.gap.lipWidthMeters<16);
  assert.equal(tessellate(d.surfaces[0]).degenerate,0);
  for(let i=0;i<31;i++)for(let j=0;j<5;j++){
   const old=ref.surfaces[0].points[i*5+j],now=d.surfaces[0].points[i*5+j];
   assert.equal(old[0],now[0]);assert.equal(old[2],now[2]);
   const expected=c.rowY[i]??0;
   assert(Math.abs(now[1]-old[1]-expected)<1e-10);
  }
 }
 assert.equal(JSON.stringify(ref),before);
});

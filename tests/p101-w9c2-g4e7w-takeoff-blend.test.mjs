import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7WBlend,W_BLEND_LEVELS} from '../scripts/p101-w9c2-g4e7w-takeoff-blend-build.mjs';
import {generateG4E7WPhysical} from '../scripts/p101-w9c2-g4e7w-grounded-cut-build.mjs';
import {generateG4E7VExit} from '../scripts/p101-w9c2-g4e7v-exit-build.mjs';
test('G4E-7W takeoff R2 keeps real 15m void and EXACT original 28 B51-C',()=>{
 const src=generateG4E7WPhysical('exit6',52),string=JSON.stringify(src);
 const last=generateG4E7VExit('slope6');
 for(const a of W_BLEND_LEVELS){
  const d=generateG4E7WBlend(a),study=d.stageForge.g4e7wStudy;
  assert.equal(d.surfaces.length,7);assert.equal(d.movingObstacles.length,28);
  assert.deepEqual(d.surfaces[0].voidLongitudinalCells,[52]);
  assert.deepEqual(d.surfaces.slice(1),src.surfaces.slice(1));
  assert.deepEqual(d.movingObstacles,src.movingObstacles);
  assert(study.laneWidthMeters>11&&study.laneWidthMeters<16);
  assert(study.gap.noInvisibleBridge);
  assert.equal(study.officialSlope2Meters,0);
  if(a===0)assert.deepEqual(d.surfaces[0].points,src.surfaces[0].points);
  if(a===1)assert.deepEqual(d.surfaces[0].points,last.surfaces[0].points);
 }
 assert.equal(JSON.stringify(generateG4E7WPhysical('exit6',52)),string);
});

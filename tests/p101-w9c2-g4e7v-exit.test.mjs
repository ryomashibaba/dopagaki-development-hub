import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7VExit,G4E7V_PROFILES} from '../scripts/p101-w9c2-g4e7v-exit-build.mjs';
import {generateG4E7UPhysical} from '../scripts/p101-w9c2-g4e7u-single-cell-build.mjs';
import {tessellate} from '../private/reference_only/director/surface.js';
test('G4E-7V localized B48 exit normals keep all 7 real roads and 28 original machines',()=>{
 const original=generateG4E7UPhysical('one53'),baseline=JSON.stringify(original),
  variants=G4E7V_PROFILES.map(p=>generateG4E7VExit(p.id));
 assert.deepEqual(variants[0].surfaces[0],original.surfaces[0]);
 for(const x of variants){
  const s=x.stageForge.g4e7vStudy;
  assert(x.surfaces.length===7&&x.movingObstacles.length===28);
  assert.deepEqual(x.surfaces.slice(1),original.surfaces.slice(1));
  assert.deepEqual(x.movingObstacles,original.movingObstacles);
  assert.deepEqual(x.spawns,original.spawns);
  assert.equal(x.surfaces[0].voidLongitudinalCells.join(','),'53');
  assert(s.maxControlHeightChangeMeters<=8);
  assert(s.editRows.every(i=>i>=18&&i<=20));
  assert(s.realGapLengthMeters>2);
  assert(s.realNarrowWidthMeters>=11&&s.realNarrowWidthMeters<=22);
  assert.equal(tessellate(x.surfaces[0]).degenerate,0);
  assert.equal(s.officialSlope2Meters,0);assert.equal(s.release,'HOLD');
 }
 assert.equal(JSON.stringify(generateG4E7UPhysical('one53')),baseline);
 assert.throws(()=>generateG4E7VExit('UNLISTED'),/enumerated/);
});

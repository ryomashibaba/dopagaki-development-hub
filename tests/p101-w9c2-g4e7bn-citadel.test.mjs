import test from 'node:test';
import assert from 'node:assert/strict';
import {generateBNModel} from '../scripts/p101-w9c2-g4e7bn-breakwater-citadel-author.mjs';
import {generateG4E7BC} from '../scripts/p101-w9c2-g4e7bc-bank-contour.mjs';
import {g4e7bgNativeFrames} from '../scripts/p101-w9c2-g4e7bg-native-visual-frames.mjs';
import {parseBKGLB} from '../web/p101-w9c2-g4e7bk-lit-glb.mjs';
const fixed=g4e7bgNativeFrames();
for(const road of ['true-pinch','pinch-switch']){
 test('BN authored inhabitable multi-volume city on genuine B48 '+road,()=>{
  const doc=generateG4E7BC(road,'rollDeck'),frozen=JSON.stringify(doc);
  const result=generateBNModel(doc,fixed);
  const buffer=result.glb.buffer.slice(result.glb.byteOffset,result.glb.byteOffset+result.glb.byteLength);
  const model=parseBKGLB(buffer,{expectedRoad:road});
  assert.equal(model.meta.visualCandidate,'G4E-7BN-BREAKWATER-CITADEL');
  assert.equal(model.meta.authoring,'SCRIPTED_REAL_3D_NOT_BLENDER');
  assert.equal(model.meta.baseCameraRegistration,'G4E-7BM_FIX_WORLD_COORDINATES');
  assert.equal(model.meta.asymmetricCanopyWings,2);
  assert.equal(model.meta.thickCityTerraces,4);
  assert.equal(model.meta.inhabitedTowers,5);
  assert.equal(model.meta.mainTowerHeightMeters,302);
  assert(model.triangles>1500&&model.triangles<55000);
  assert.equal(model.triangles,result.meta.triangles);
  assert.equal(model.materials.length,6);
  assert(model.meta.nativeProjectionChecks.filter(x=>x.visibleFraction>.025).length>=2);
  assert.equal(doc.surfaces.length,7);
  assert.equal(doc.movingObstacles.length,28);
  assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52]);
  assert.equal(doc.stageForge.productionPromoted,false);
  assert.equal(JSON.stringify(doc),frozen);
  assert.equal(model.meta.officialSlope2Meters,0);
  assert.equal(model.meta.artApproval,'HOLD');
  assert.equal(model.meta.publication,'HOLD');
  assert.throws(()=>parseBKGLB(buffer,{expectedRoad:road==='true-pinch'?'pinch-switch':'true-pinch'}),/provenance/);
  console.log('BN_REAL_240HZ_CITY '+JSON.stringify({
   road,triangles:model.triangles,bytes:model.glbByteLength,
   projections:model.meta.nativeProjectionChecks
  }));
 });
}

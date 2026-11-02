import test from 'node:test';
import assert from 'node:assert/strict';
import {generateBMModel} from '../scripts/p101-w9c2-g4e7bm-camera-registered-author.mjs';
import {g4e7bgNativeFrames} from '../scripts/p101-w9c2-g4e7bg-native-visual-frames.mjs';
import {generateG4E7BC} from '../scripts/p101-w9c2-g4e7bc-bank-contour.mjs';
import {parseBKGLB} from '../web/p101-w9c2-g4e7bk-lit-glb.mjs';
const native=g4e7bgNativeFrames();
for(const road of ['true-pinch','pinch-switch']){
 test('BM true native camera-projection GLB on original B48 '+road,()=>{
  const stage=generateG4E7BC(road,'rollDeck'),snapshot=JSON.stringify(stage);
  const result=generateBMModel(stage,native);
  const bytes=result.glb.buffer.slice(result.glb.byteOffset,result.glb.byteOffset+result.glb.byteLength);
  const loaded=parseBKGLB(bytes,{expectedRoad:road});
  assert.equal(loaded.meta.visualCandidate,'G4E-7BM-CAMERA-REGISTERED-CROWN');
  assert.equal(loaded.meta.cameraTarget,'GENUINE_BG_240HZ_P96_NOT_HUMAN');
  assert.equal(loaded.meta.authoring,'SCRIPTED_REAL_3D_NOT_BLENDER');
  assert.equal(loaded.materials.length,6);
  assert.equal(loaded.triangles,result.meta.triangles);
  assert(loaded.triangles>1200);
  assert.equal(loaded.meta.officialSlope2Meters,0);
  assert.equal(loaded.meta.artApproval,'HOLD');
  assert.equal(loaded.meta.publication,'HOLD');
  assert(loaded.meta.nearestRoadHorizontalMeters>=50);
  assert(loaded.meta.projectionEvidence.filter(x=>x.fraction>.04).length>=2);
  assert(loaded.meta.modelWorldOffset.every(Number.isFinite));
  assert.equal(stage.surfaces.length,7);
  assert.equal(stage.movingObstacles.length,28);
  assert.deepEqual(stage.surfaces[0].voidLongitudinalCells,[52]);
  assert.equal(JSON.stringify(stage),snapshot);
  console.log('BM_REAL_CAMERA_PROJECTION '+JSON.stringify({
   road,triangles:loaded.triangles,bytes:loaded.glbByteLength,
   score:loaded.meta.projectionScore,
   aim:loaded.meta.projectionAim,
   depth:loaded.meta.projectionDepthMeters,
   offset:loaded.meta.modelWorldOffset,
   fractions:loaded.meta.projectionEvidence.map(x=>x.fraction),
   roadClearance:loaded.meta.nearestRoadHorizontalMeters
  }));
 });
}

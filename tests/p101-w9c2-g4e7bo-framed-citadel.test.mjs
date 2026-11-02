import test from 'node:test';
import assert from 'node:assert/strict';
import {generateBOModel} from '../scripts/p101-w9c2-g4e7bo-framed-citadel-author.mjs';
import {generateG4E7BC} from '../scripts/p101-w9c2-g4e7bc-bank-contour.mjs';
import {g4e7bgNativeFrames} from '../scripts/p101-w9c2-g4e7bg-native-visual-frames.mjs';
import {parseBKGLB} from '../web/p101-w9c2-g4e7bk-lit-glb.mjs';
const native=g4e7bgNativeFrames();
for(const road of ['true-pinch','pinch-switch']){
 test('BO genuine 240Hz BN-specific camera framing '+road,()=>{
  const stage=generateG4E7BC(road,'rollDeck'),frozen=JSON.stringify(stage);
  const rendered=generateBOModel(stage,native);
  const source=rendered.glb.buffer.slice(rendered.glb.byteOffset,rendered.glb.byteOffset+rendered.glb.byteLength);
  const asset=parseBKGLB(source,{expectedRoad:road}),m=asset.meta;
  assert.equal(m.visualCandidate,'G4E-7BO-FRAMED-BREAKWATER-CITADEL');
  assert.equal(m.framingSource,'BN_GLTF_VERTEX_PROJECTION_NOT_BM_TUBE');
  assert.equal(m.authoring,'SCRIPTED_REAL_3D_NOT_BLENDER');
  assert.equal(m.formalVisualApproval,false);
  assert.equal(m.artApproval,'HOLD');
  assert.equal(m.publication,'HOLD');
  assert.equal(m.sameGeometryTriangles,asset.triangles);
  assert(asset.triangles>1500);
  assert.equal(asset.materials.length,6);
  assert(m.modelWorldOffset.every(Number.isFinite));
  assert(m.afterScore>=m.beforeScore-1e-3);
  assert(m.afterProjection.filter(x=>x.fraction>.08).length>=2);
  assert.equal(m.afterProjection.length,3);
  assert.equal(stage.surfaces.length,7);
  assert.equal(stage.movingObstacles.length,28);
  assert.deepEqual(stage.surfaces[0].voidLongitudinalCells,[52]);
  assert.equal(JSON.stringify(stage),frozen);
  console.log('BO_NATIVE_CAMERA_POSITION '+JSON.stringify({
   road,triangles:asset.triangles,before:m.beforeScore,after:m.afterScore,
   beforeProjection:m.beforeProjection.map(x=>x.fraction),
   afterProjection:m.afterProjection.map(x=>x.fraction),
   roadClearance:m.roadClearanceMeters,
   chosenAim:m.nativeAim,depth:m.nativeDepthMeters,offset:m.modelWorldOffset
  }));
 });
}

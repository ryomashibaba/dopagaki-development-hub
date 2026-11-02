import test from 'node:test';
import assert from 'node:assert/strict';
import {generateBLModel} from '../scripts/p101-w9c2-g4e7bl-open-crown-author.mjs';
import {generateG4E7BC} from '../scripts/p101-w9c2-g4e7bc-bank-contour.mjs';
import {parseBKGLB} from '../web/p101-w9c2-g4e7bk-lit-glb.mjs';
for(const road of ['true-pinch','pinch-switch']){
 test('BL two-real-B48 stage protected binary sculptural GLB '+road,()=>{
  const stage=generateG4E7BC(road,'rollDeck'),before=JSON.stringify(stage);
  const art=generateBLModel(stage);
  const data=art.glb.buffer.slice(art.glb.byteOffset,art.glb.byteOffset+art.glb.byteLength);
  const parsed=parseBKGLB(data,{expectedRoad:road});
  assert.equal(parsed.meta.visualCandidate,'G4E-7BL-OPEN-CROWN');
  assert.equal(parsed.meta.authoring,'SCRIPTED_REAL_3D_NOT_BLENDER');
  assert.equal(parsed.meta.openSkyCourts,2);
  assert.equal(parsed.meta.inhabitedTerraces,5);
  assert.equal(parsed.meta.districtCount,1);
  assert(parsed.triangles>1200&&parsed.triangles<55000);
  assert.equal(parsed.triangles,art.meta.triangles);
  assert.equal(parsed.materials.length,6);
  assert.deepEqual(stage.surfaces[0].voidLongitudinalCells,[52]);
  assert.equal(stage.surfaces.length,7);
  assert.equal(stage.movingObstacles.length,28);
  assert.equal(stage.stageForge.productionPromoted,false);
  assert.equal(JSON.stringify(stage),before);
  assert.equal(parsed.meta.artApproval,'HOLD');
  assert.equal(parsed.meta.publication,'HOLD');
  assert.equal(parsed.meta.officialSlope2Meters,0);
  assert.throws(()=>parseBKGLB(data,{expectedRoad:road==='true-pinch'?'pinch-switch':'true-pinch'}),/provenance/);
  console.log('BL_GLTF2_PROOF '+JSON.stringify({road,triangles:parsed.triangles,bytes:parsed.glbByteLength}));
 });
}

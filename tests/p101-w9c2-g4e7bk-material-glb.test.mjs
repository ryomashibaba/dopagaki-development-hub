import test from 'node:test';
import assert from 'node:assert/strict';
import {generateBKModel,BK_MATERIALS} from '../scripts/p101-w9c2-g4e7bk-glb-author.mjs';
import {parseBKGLB} from '../web/p101-w9c2-g4e7bk-lit-glb.mjs';
import {generateG4E7BC} from '../scripts/p101-w9c2-g4e7bc-bank-contour.mjs';
for(const road of ['true-pinch','pinch-switch']){
 test('BK actual multizone normal-material GLB2 writer/decoder, native B48 untouched '+road,()=>{
  const stage=generateG4E7BC(road,'rollDeck'),frozen=JSON.stringify(stage);
  const result=generateBKModel(stage);
  assert.equal(result.glb.readUInt32LE(0),0x46546c67);
  assert.equal(result.glb.readUInt32LE(4),2);
  assert.equal(result.meta.materialCount,6);
  const b=result.glb.buffer.slice(result.glb.byteOffset,result.glb.byteOffset+result.glb.byteLength);
  const art=parseBKGLB(b,{expectedRoad:road});
  assert.equal(art.meta.sourceStageId,stage.stageForge.recordStageId);
  assert.equal(art.triangles,result.meta.triangles);
  assert(art.triangles>600);
  assert(art.glbByteLength<16000000);
  assert.equal(art.materials.length,6);
  assert.deepEqual(art.materials.map(x=>x.name),BK_MATERIALS.map(x=>x.name));
  assert(art.materials.some(x=>x.emissive[1]>.5));
  assert(art.primitives.every(x=>x.data.every(Number.isFinite)));
  assert.equal(stage.surfaces.length,7);
  assert.equal(stage.movingObstacles.length,28);
  assert.deepEqual(stage.surfaces[0].voidLongitudinalCells,[52]);
  assert.equal(JSON.stringify(stage),frozen);
  assert.equal(art.meta.officialSlope2Meters,0);
  assert.equal(art.meta.artApproval,'HOLD');
  assert.equal(art.meta.publication,'HOLD');
  assert.throws(()=>parseBKGLB(b,{expectedRoad:road==='true-pinch'?'pinch-switch':'true-pinch'}),/provenance/);
  console.log('BK_VALID_GLTF2_MATERIAL_PROOF '+JSON.stringify({road,triangles:art.triangles,
   materials:art.materials.length,bytes:art.glbByteLength,source:art.meta.sourceStageId}));
 });
}
test('BK malformed/fake assets refused, no green painted screenshot fallback',()=>{
 assert.throws(()=>parseBKGLB(new Uint8Array(512).buffer),/header/);
 assert.throws(()=>parseBKGLB(new Uint8Array(8).buffer),/size/);
});

/**
 * R19 A6 P0 — STRICT, fail-closed A5 GLB -> original WebGL2 vertex ABI.
 * Only the SHA-pinned five-part ORIGINAL research export is accepted.
 * Not an arbitrary user GLB loader, a Blender re-export certificate, or ART approval.
 * No game/stage/physics code imported or modified here.
 */
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {makeR19A4GLB,verifyR19A4GLB} from './p101-r19a4-export-editable-source-city-glb.mjs';

const sha256=x=>crypto.createHash('sha256').update(x).digest('hex');
const ORIGINAL_BLOB='af076d67492a677d2235e4730aef8cdf4808e106';

export function importR19A6PinnedSourceGLB(input,proof){
 const glb=Buffer.isBuffer(input)?input:Buffer.from(input);
 assert.ok(proof&&['ultra','control'].includes(proof.mode),'mode must be original 14/28m');
 assert.equal(proof.sourceBlob,ORIGINAL_BLOB);
 assert.equal(glb.length,proof.glbBytes);
 assert.equal(sha256(glb),proof.glbSHA256,'edited/unapproved GLB must not silently be loaded');
 assert.equal(verifyR19A4GLB(glb,proof),true);
 const jsonLength=glb.readUInt32LE(12);
 const gltf=JSON.parse(glb.subarray(20,20+jsonLength).toString('utf8'));
 const binOffset=20+jsonLength+8;
 // This P0 importer intentionally rejects extensions, transforms, compression,
 // indices and embedded resources; subsequent P1 can add them with negative QA.
 assert.equal(gltf.extensionsUsed?.length??0,0);
 assert.equal(gltf.extensionsRequired?.length??0,0);
 assert.equal(gltf.buffers.length,1);
 assert.equal(gltf.bufferViews.length,1);
 assert.equal(gltf.bufferViews[0].byteStride,24);
 assert.equal(gltf.bufferViews[0].buffer,0);
 assert.equal(gltf.scenes.length,1);
 assert.equal(gltf.scene,0);
 assert.equal(gltf.meshes.length,5);
 assert.equal(gltf.nodes.length,5);
 assert.deepEqual(gltf.scenes[0].nodes,[0,1,2,3,4]);
 assert.equal(gltf.extras.researchOnly,true);
 assert.equal(gltf.extras.sourceMode,proof.mode);
 assert.equal(gltf.extras.collisionMeshesAdded,0);
 assert.equal(gltf.extras.physicalRoadsUntouched,7);
 assert.equal(gltf.extras.movingB51Untouched,28);
 assert.equal(gltf.extras.ART,'HOLD');
 assert.equal(gltf.extras.RELEASE,'HOLD');
 const data=new DataView(glb.buffer,glb.byteOffset+binOffset,gltf.buffers[0].byteLength);
 const out=new Float32Array(proof.vertexCount*6);
 let cursor=0;
 for(let n=0;n<5;n++){
  const node=gltf.nodes[n],m=gltf.meshes[n],p=m.primitives[0];
  assert.deepEqual(Object.keys(node).sort(),['mesh','name']);
  assert.equal(node.mesh,n);
  assert.equal(node.name,proof.editableGroupNames[n]);
  assert.equal(m.primitives.length,1);
  assert.equal(p.mode,4);
  assert.equal(p.indices,undefined);
  assert.deepEqual(Object.keys(p.attributes).sort(),['COLOR_0','POSITION']);
  assert.equal(p.material,n);
  const position=gltf.accessors[p.attributes.POSITION],color=gltf.accessors[p.attributes.COLOR_0];
  for(const a of [position,color]){
   assert.equal(a.bufferView,0);
   assert.equal(a.componentType,5126);
   assert.equal(a.type,'VEC3');
   assert.equal(a.normalized,undefined);
   assert.equal(a.sparse,undefined);
  }
  assert.equal(position.count,color.count);
  assert.ok(position.count>0&&position.count%3===0);
  for(let v=0;v<position.count;v++){
   for(let k=0;k<3;k++){
    const pp=position.byteOffset+v*24+k*4;
    const cc=color.byteOffset+v*24+k*4;
    assert.ok(pp>=0&&pp+4<=data.byteLength&&cc>=0&&cc+4<=data.byteLength);
    const xyz=data.getFloat32(pp,true),rgb=data.getFloat32(cc,true);
    assert.ok(Number.isFinite(xyz)&&Math.abs(xyz)<1e6,'invalid source GLB geometry');
    assert.ok(Number.isFinite(rgb)&&rgb>=0&&rgb<=1,'invalid source GLB color');
    out[cursor+k]=xyz;
    out[cursor+k+3]=rgb;
   }
   cursor+=6;
  }
 }
 assert.equal(cursor,out.length);
 assert.equal(cursor/18,proof.triangleCount);
 return {vertices:out,triangleCount:proof.triangleCount,meshCount:5,
  mode:proof.mode,inputSHA256:sha256(glb),sourceBlob:proof.sourceBlob,
  nonColliding:true,ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD'};
}
export function buildR19A6PinnedRoundtrip(mode){
 const {glb,report}=makeR19A4GLB(mode);
 return {glb,report,imported:importR19A6PinnedSourceGLB(glb,report)};
}

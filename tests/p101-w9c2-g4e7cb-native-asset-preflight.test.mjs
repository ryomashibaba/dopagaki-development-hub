import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {nodeMatrix,sceneCorners,cameraGeometry,nativeAssetPreflight} from '../scripts/p101-w9c2-g4e7cb-native-asset-preflight.mjs';
import {g4e7bgNativeFrames} from '../scripts/p101-w9c2-g4e7bg-native-visual-frames.mjs';

const candidate='artifacts/private/g4e7ca-rift-exchange/G4E7CA_RIFT_EXCHANGE_ART_ONLY.glb';
function syntheticGLB(nodes,scenes=[{nodes:[0]}]){
 const raw=Buffer.alloc(36);
 const data={asset:{version:'2.0'},scene:0,scenes,nodes,
  meshes:[{primitives:[{attributes:{POSITION:0}}]}],
  accessors:[{componentType:5126,type:'VEC3',count:3,
    min:[-1,-2,-3],max:[1,2,3]}],buffers:[{byteLength:raw.length}],
  bufferViews:[{buffer:0,byteOffset:0,byteLength:raw.length}]};
 const j=Buffer.from(JSON.stringify(data)),pad=Buffer.alloc((4-j.length%4)%4,32);
 const h=Buffer.alloc(12);h.write('glTF',0,4,'ascii');h.writeUInt32LE(2,4);
 h.writeUInt32LE(12+8+j.length+pad.length+8+raw.length,8);
 const jh=Buffer.alloc(8);jh.writeUInt32LE(j.length+pad.length,0);jh.writeUInt32LE(0x4e4f534a,4);
 const bh=Buffer.alloc(8);bh.writeUInt32LE(raw.length,0);bh.writeUInt32LE(0x004e4942,4);
 return Buffer.concat([h,jh,j,pad,bh,raw]);
}
test('CB follows actual glTF parent/world transformations, not local catalog bounds',()=>{
 const glb=syntheticGLB([{translation:[20,3,-5],children:[1]},
  {mesh:0,translation:[2,0,0],scale:[2,1,1]}]);
 const result=sceneCorners(glb);
 assert.deepEqual(result.model.worldAABB.min,[20,1,-8]);
 assert.deepEqual(result.model.worldAABB.max,[24,5,-2]);
 assert.equal(result.model.meshInstances,1);
 assert.equal(result.model.corners,8);
});
test('CB canonical quaternion X/Y rotation and invalid transformed roots',()=>{
 const q=Math.sqrt(.5);
 const m=nodeMatrix({translation:[0,0,2],rotation:[0,0,q,q],scale:[1,1,1]});
 assert.ok(Math.abs(m[0])<1e-12);
 assert.ok(Math.abs(m[1]-1)<1e-12);
 assert.throws(()=>nodeMatrix({matrix:new Array(16).fill(1),translation:[1,0,0]}),/matrix\/TRS/);
 assert.throws(()=>sceneCorners(syntheticGLB([{children:[0]}])),/scene graph/);
});
test('CB real camera projection only checks visibility, never marks artistic acceptance',()=>{
 const points=[[0,0,60],[-5,5,60],[5,-5,60]];
 const result=cameraGeometry(points,{id:'test',eye:[0,0,0],front:[0,0,1],
    timeSeconds:18.5,speedMps:110});
 assert.equal(result.visibleCorners,3);
 assert.equal(result.visibleFraction,1);
 assert.ok(result.onScreenBounds[2]>result.onScreenBounds[0]);
});
test('CB actual rejected CA-R2 GLB + existing 240Hz BG original poses: deterministic evidence-only preflight',()=>{
 assert.ok(fs.existsSync(candidate),'Original rejected CA binary must be present on Draft branch');
 const bytes=fs.readFileSync(candidate),native=g4e7bgNativeFrames();
 const v=nativeAssetPreflight(bytes,native);
 assert.equal(v.views.length,6);
 assert.equal(v.model.meshInstances>100,true);
 assert.equal(v.art,'REJECTED_CONTROL_NOT_ART_PASS');
 assert.equal(v.actualWebGL,'NOT_TESTED');
 assert.equal(v.publicRelease,'FORBIDDEN');
 assert.equal(v.officialSlope2Meters,0);
 assert.equal(v.source,'EXISTING_BG_SCRIPTED_240HZ_START00_NOT_HUMAN');
 assert.equal(v.views.filter(x=>x.speedMps>85).length,6);
 assert.ok(v.views.every(x=>x.visibleFraction>=0&&x.visibleFraction<=1));
 assert.equal(v.model.worldAABB.span.length,3);
 assert.deepEqual(v,nativeAssetPreflight(bytes,native));
 const fraud=structuredClone(native);fraud.physicsHz=30;
 assert.throws(()=>nativeAssetPreflight(bytes,fraud),/240Hz source/);
});

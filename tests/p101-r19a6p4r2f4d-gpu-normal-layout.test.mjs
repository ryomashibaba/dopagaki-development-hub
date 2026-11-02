import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildR2F4DNormals} from '../scripts/p101-r19a6p4r2f4d-gpu-normal-layout.mjs';
test('nine-float GPU positions and vertex colors bit-identical',()=>{
 const src=new Float32Array([
 0,0,0,.2,.3,.4,1,0,0,.2,.3,.4,0,1,0,.2,.3,.4,
 0,0,0,.6,.7,.8,0,0,1,.6,.7,.8,1,0,0,.6,.7,.8]);
 const b=src.slice(),r=buildR2F4DNormals(src);
 assert.deepEqual(src,b);assert.equal(r.vertices.length,src.length*1.5);
 for(let i=0;i<src.length/6;i++){
  for(let j=0;j<6;j++)assert.equal(r.vertices[i*9+j],src[i*6+j]);
  assert.ok(Math.abs(Math.hypot(...r.vertices.slice(i*9+6,i*9+9))-1)<1e-5);
 }
 assert.equal(r.report.triangles,2);
 assert.equal(r.report.newPhysicsColliders,0);
});
test('malformed source fails without writing',()=>{
 assert.throws(()=>buildR2F4DNormals(new Float32Array(10)));
});

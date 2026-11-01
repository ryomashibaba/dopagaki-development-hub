import {test} from 'node:test';
import assert from 'node:assert/strict';
import {bakeR2F4CFlatNormals} from '../scripts/p101-r19a6p4r2f4c-normal-bake.mjs';
test('real 6-float XYZRGB layout persists and spatial geometry remains bit-identical',()=>{
 const source=new Float32Array([
  0,0,0,.2,.4,.5,  1,0,0,.2,.4,.5,  0,1,0,.2,.4,.5,
  0,0,0,.7,.35,.2, 0,0,1,.7,.35,.2, 1,0,0,.7,.35,.2]);
 const copy=source.slice();const {vertices:v,stats}=bakeR2F4CFlatNormals(source);
 assert.deepEqual([...source],[...copy]);assert.equal(v.length,source.length);
 assert.equal(stats.triangleCount,2);assert.equal(stats.geometryPositionsBitIdentical,true);
 assert.equal(stats.rendererShaderUnchanged,true);assert.ok(stats.changedColorChannels>=6);
 for(let i=0;i<v.length;i+=6){
  assert.deepEqual([...v.slice(i,i+3)],[...source.slice(i,i+3)]);
  for(let j=3;j<6;j++)assert.ok(v[i+j]>=0&&v[i+j]<=1);
 }
 assert.notEqual(stats.sourceGPUsha256,stats.bakedGPUsha256);
});
test('refuses invalid interleaved data length',()=>{
 assert.throws(()=>bakeR2F4CFlatNormals(new Float32Array(15)));
});
test('handles degenerate real geometry without NaN',()=>{
 const source=new Float32Array([
  0,0,0,.5,.5,.5, 0,0,0,.5,.5,.5, 0,0,0,.5,.5,.5]);
 const r=bakeR2F4CFlatNormals(source);
 assert.equal(r.stats.degenerateTriangles,1);
 assert.ok(r.vertices.every(Number.isFinite));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {buildDoReference,DO_TIMES} from '../scripts/p101-w9c2-g4e7do-master-export.mjs';
test('DO exact native-camera world-space master exports without changing physics or classifying new art',()=>{
 for(const road of ['true-pinch','pinch-switch']){
  const a=buildDoReference(road),b=buildDoReference(road);
  assert.equal(a.schema,'dopagaki.g4e7do-native-master-editable-blender/1');
  assert.equal(a.camera,'ORIGINAL_BALL_RELATIVE_240HZ_START00_P96_FIXED_SCRIPT_NOT_HUMAN');
  assert.equal(a.geometryName,'ORIGINAL_CX_WORLD_XYZ_UNALTERED');
  assert.equal(a.gameExactRendering,false);
  assert.equal(a.cameras.length,DO_TIMES.length);
  assert.deepEqual(a.cameras.map(x=>x.id),DO_TIMES);
  assert.equal(a.cxVertexSha256,b.cxVertexSha256);
  assert.equal(a.cxTriangleCount,a.structures.reduce((n,x)=>n+x.triangles,0));
  assert.equal(a.structures.filter(s=>s.kind==='anchored-civic-crescent').length,2);
  assert.equal(a.lineGuides.length,7);
  assert.deepEqual(a.lineGuides.map(l=>l.tracks.length),Array(7).fill(3));
  for(const c of a.cameras){
   assert.equal(c.source,'ACTUAL_240HZ_START00_P96_FIXED_SCRIPT_NOT_HUMAN');
   assert.ok(c.speedMps>52);
   assert.ok(Math.abs(c.fovYDeg-2*Math.atan(1/1.35)*180/Math.PI)<1e-10);
   for(const v of [c.front,c.right,c.up])assert.ok(Math.abs(Math.hypot(...v)-1)<1e-10);
   assert.ok(Math.abs(c.front.reduce((n,x,i)=>n+x*c.right[i],0))<1e-10);
  }
  assert.deepEqual(a.physics,{surfaces:7,movingHazards:28,gap52:true,noNewRoad:true,noNewCollider:true,officialSlope2Meters:0});
  assert.equal(a.review.art,'HOLD');assert.equal(a.review.publish,'HOLD');
 }
 assert.throws(()=>buildDoReference('fake'),/unsupported/);
});

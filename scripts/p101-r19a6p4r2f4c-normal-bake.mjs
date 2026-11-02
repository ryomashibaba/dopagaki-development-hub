/** R2F4-C strictly private CPU flat-normal directional-light research.
 * Input/output remain ORIGINAL WebGL2 float32 [x,y,z,r,g,b] per vertex.
 * No PBR, no shader changes, no real time light, no material properties.
 * Only COLOR changes. XYZ bytes and every index in GPU buffer are preserved.
 */
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const clamp=(x)=>Math.max(0,Math.min(1,x));
export function bakeR2F4CFlatNormals(source){
 assert.ok(source instanceof Float32Array);
 assert.equal(source.length%18,0,'expected 3 vertices x [xyz rgb] per triangle');
 const target=new Float32Array(source);
 const key=[-.59,.77,-.25],fill=[.23,.34,.91];
 let nondegenerate=0,degenerate=0,changedColorChannels=0;
 let minIntensity=Infinity,maxIntensity=-Infinity;
 for(let i=0;i<source.length;i+=18){
  const e1=[source[i+6]-source[i],source[i+7]-source[i+1],source[i+8]-source[i+2]];
  const e2=[source[i+12]-source[i],source[i+13]-source[i+1],source[i+14]-source[i+2]];
  const normal=[e1[1]*e2[2]-e1[2]*e2[1],e1[2]*e2[0]-e1[0]*e2[2],
   e1[0]*e2[1]-e1[1]*e2[0]];
  const n=Math.hypot(...normal);
  // Winding may differ across Blender-generated faces. For this
  // reversible two-sided MATERIAL STUDY use absolute normal response;
  // never imply physically accurate one-sided light/PBR.
  const unit=n>1e-8?normal.map(v=>v/n):[0,1,0];
  if(n>1e-8)nondegenerate++;else degenerate++;
  const top=Math.abs(unit[0]*key[0]+unit[1]*key[1]+unit[2]*key[2]);
  const side=Math.abs(unit[0]*fill[0]+unit[1]*fill[1]+unit[2]*fill[2]);
  const factor=0.71+0.32*top+0.13*side;
  minIntensity=Math.min(minIntensity,factor);
  maxIntensity=Math.max(maxIntensity,factor);
  for(let v=0;v<3;v++){
   const off=i+v*6;
   for(let c=0;c<3;c++){
    const base=source[off+3+c];
    assert(Number.isFinite(base)&&base>=0&&base<=1.001,'source color not normalized');
    // Slight warm highlight/cool bounce per face; no textures or
    // other inferred PBR material properties are introduced.
    const warmth=c===0?1+.045*top:c===1?1+.011*side:1+.03*(1-top);
    const value=clamp(base*factor*warmth);
    target[off+3+c]=value;
    if(Math.abs(value-base)>1e-6)changedColorChannels++;
   }
   for(let c=0;c<3;c++){
    assert(Object.is(target[off+c],source[off+c]),'position modified');
   }
  }
 }
 const bytes=Buffer.from(target.buffer,target.byteOffset,target.byteLength);
 const original=Buffer.from(source.buffer,source.byteOffset,source.byteLength);
 assert.equal(bytes.length,original.length);
 assert.ok(changedColorChannels>0,'no normal-based color delta');
 return {vertices:target,stats:{
  algorithm:'TWO_SIDED_STATIC_FACE_NORMAL_COLOR_BAKE_NOT_PBR',
  sourceVertexLayout:'xyzrgb_float32_6',rendererShaderUnchanged:true,
  geometryPositionsBitIdentical:true,
  sourceGPUsha256:sha(original),bakedGPUsha256:sha(bytes),
  triangleCount:source.length/18,nondegenerateTriangles:nondegenerate,
  degenerateTriangles:degenerate,changedColorChannels,
  minIntensity,maxIntensity}};
}

/** R2F4-D PRIVATE renderer-only RGB + normal vertex layout. No PBR.
 * Read-only original Blender source GLB flattening. No index/collider edits.
 * GPU positions and original RGB are bit-identical to R2F4-B.
 */
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
export function buildR2F4DNormals(data){
 assert.ok(data instanceof Float32Array&&data.length%18===0);
 const out=new Float32Array(data.length/6*9);
 let degenerate=0,maxNError=0;
 for(let off=0;off<data.length;off+=18){
  const a=[data[off],data[off+1],data[off+2]];
  const b=[data[off+6],data[off+7],data[off+8]];
  const c=[data[off+12],data[off+13],data[off+14]];
  const d=b.map((x,i)=>x-a[i]),e=c.map((x,i)=>x-a[i]);
  const n=[d[1]*e[2]-d[2]*e[1],d[2]*e[0]-d[0]*e[2],d[0]*e[1]-d[1]*e[0]];
  const len=Math.hypot(...n);if(len<1e-8)degenerate++;
  const unit=len>1e-8?n.map(x=>x/len):[0,1,0];
  maxNError=Math.max(maxNError,Math.abs(Math.hypot(...unit)-1));
  for(let k=0;k<3;k++){
   const src=off+k*6,dest=off/6*9+k*9;
   for(let p=0;p<6;p++){
    const val=data[src+p];assert(Number.isFinite(val));
    out[dest+p]=val;
    assert(Object.is(out[dest+p],val));
   }
   out.set(unit,dest+6);
  }
 }
 const orig=Buffer.from(data.buffer,data.byteOffset,data.byteLength);
 const rendered=Buffer.from(out.buffer,out.byteOffset,out.byteLength);
 assert.equal(out.length,data.length*1.5);
 assert.ok(maxNError<1e-4);
 return {vertices:out,report:{
  sourceSha256:sha(orig),normalGPUsha256:sha(rendered),
  triangles:data.length/18,allSourcePositionsAndColorsBitIdentical:true,
  originalShaderUntouched:true,newPhysicsColliders:0,
  normalFloat32Count:data.length/6*3,degenerateTriangles:degenerate,
  maxNormalError:maxNError,layout:'xyzrgbnormal_9float_stride36',
  shader:'PRIVATE_R2F4D_GPU_NORMAL_TWO_SIDED_NOT_PBR'}};
}

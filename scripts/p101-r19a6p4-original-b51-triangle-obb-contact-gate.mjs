/**
 * P4: independent exact 3D triangle/ORIGINAL B51 oriented-box (OBB) SAT gate.
 * Input: independently audited source-pinned Blender GLB GPU vertices.
 * B51: original immutable stage+movingObstaclePose at 6 genuine native ticks.
 * No collision-layer mutation. Exact instantaneous triangle/OBB intersections,
 * NOT swept 12s clearance or visibility/person-performance approval.
 */
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import assert from 'node:assert/strict';
import {generateP101W9C1AbyssCandidate} from './p101-w9c1-abyss-narrow.mjs';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
const src=fs.readFileSync('web/p101-w9c2-g4e7ci-integrated-streetscape.mjs');
const blob=crypto.createHash('sha1').update(Buffer.concat([
 Buffer.from('blob '+src.length+'\0'),src])).digest('hex');
assert.equal(blob,'af076d67492a677d2235e4730aef8cdf4808e106');
const ticks=[265,721,1057,1249,1921,2761],Hz=240;
const output='r19-evidence/r19a6p4/P4_NATIVE_SIX_TIME_B51_TRIANGLE_OBB_3D_CONTACT_AUDIT.json';
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const minus=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
function noOverlapAxis(ax,tri,half){
 const lengthSq=dot(ax,ax);if(lengthSq<1e-16)return false;
 let mn=Infinity,mx=-Infinity;
 for(const v of tri){const p=dot(ax,v);mn=Math.min(mn,p);mx=Math.max(mx,p);}
 const r=half[0]*Math.abs(ax[0])+half[1]*Math.abs(ax[1])+half[2]*Math.abs(ax[2]);
 return mn>r+1e-7||mx< -r-1e-7;
}
function triangleBoxSAT(points,center,half,c,s){
 const tri=points.map(p=>{
  const x=p[0]-center[0],y=p[1]-center[1],z=p[2]-center[2];
  return [c*x-s*z,y,s*x+c*z];
 });
 // Original rotator OBB axes (Y-up yaw), expressed in local box frame.
 const edges=[minus(tri[1],tri[0]),minus(tri[2],tri[1]),minus(tri[0],tri[2])];
 const boxAxes=[[1,0,0],[0,1,0],[0,0,1]];
 for(const a of boxAxes)if(noOverlapAxis(a,tri,half))return false;
 if(noOverlapAxis(cross(edges[0],edges[1]),tri,half))return false;
 for(const e of edges)for(const a of boxAxes)
  if(noOverlapAxis(cross(e,a),tri,half))return false;
 return true; // all 13 SAT axes overlap including boundary
}
const evidence={schema:'dopagaki.r19a6p4-original-source-b51-exact-triangle-obb-native-six-times/1',
 sourceBlob:blob,physicsHz:Hz,B48:7,B51:28,actualBlenderGPU:true,
 originalStageUnchanged:true,newColliders:0,
 instantaneousSnapshotsNotContinuousSweptTest:true,
 sourceB51GeometricCollisionNotRasterOcclusion:true,
 results:[],failures:[],ART:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',RELEASE:'HOLD'};
for(const mode of ['ultra','control']){
 const stage=generateP101W9C1AbyssCandidate(mode);
 assert.equal(stage.surfaces.length,7);assert.equal(stage.movingObstacles.length,28);
 const frozen=JSON.stringify(stage);
 const file=path.resolve('r19-evidence/r19a6p4/P4_'+mode+'_audited_gpu.bin');
 const bin=fs.readFileSync(file);
 assert.equal(bin.length%(18*4),0);
 const data=new Float32Array(bin.buffer.slice(bin.byteOffset,bin.byteOffset+bin.byteLength));
 const nt=bin.length/72;assert.ok(nt>10566&&nt<50000);
 const allTriangleBounds=new Float64Array(nt*6);
 for(let i=0;i<nt;i++){
  let x0=Infinity,x1=-Infinity,y0=Infinity,y1=-Infinity,z0=Infinity,z1=-Infinity;
  for(let k=0;k<3;k++){
   const p=(i*3+k)*6, x=data[p],y=data[p+1],z=data[p+2];
   assert.ok([x,y,z].every(Number.isFinite));
   x0=Math.min(x0,x);x1=Math.max(x1,x);
   y0=Math.min(y0,y);y1=Math.max(y1,y);
   z0=Math.min(z0,z);z1=Math.max(z1,z);
  }
  allTriangleBounds.set([x0,x1,y0,y1,z0,z1],i*6);
 }
 const checks=[];
 for(const tick of ticks){
  const t=tick/Hz;
  for(const ob of stage.movingObstacles){
   const pose=movingObstaclePose(ob,t);if(!pose.enabled)continue;
   const c=Math.cos(pose.yawRadians),s=Math.sin(pose.yawRadians),p=pose.center,h=pose.halfSize;
   const rX=Math.abs(c)*h[0]+Math.abs(s)*h[2],rZ=Math.abs(s)*h[0]+Math.abs(c)*h[2];
   const bo=[p[0]-rX,p[0]+rX,p[1]-h[1],p[1]+h[1],p[2]-rZ,p[2]+rZ];
   let triangleAABBCandidates=0,contactTriangles=0;const examples=[];
   for(let i=0;i<nt;i++){
    const k=i*6;
    if(allTriangleBounds[k]>bo[1]||allTriangleBounds[k+1]<bo[0]||
       allTriangleBounds[k+2]>bo[3]||allTriangleBounds[k+3]<bo[2]||
       allTriangleBounds[k+4]>bo[5]||allTriangleBounds[k+5]<bo[4])continue;
    triangleAABBCandidates++;
    const tri=[];
    for(let v=0;v<3;v++){
     const ix=(i*3+v)*6;tri.push([data[ix],data[ix+1],data[ix+2]]);
    }
    if(triangleBoxSAT(tri,p,h,c,s)){
     contactTriangles++;
     if(examples.length<6)examples.push(i);
    }
   }
   checks.push({tick,t,originalB51Id:ob.id,mode:ob.collision?.mode||'fail',
    testedSourceOriginalOBBPose:{center:p,halfSize:h,yawRadians:pose.yawRadians},
    triangleAABBCandidates,contactTriangles,firstTriangleIndices:examples});
  }
 }
 assert.equal(JSON.stringify(stage),frozen,'source stage was mutated');
 const hits=checks.filter(x=>x.contactTriangles>0);
 evidence.results.push({stageVariant:mode,originalNativeFrameCount:ticks.length,
  originalMovingBodyCount:stage.movingObstacles.length,realGPUCityTriangleCount:nt,
  sampleContactB51Bodies:hits.length,totalTriangleOBBIntersections:hits.reduce((n,x)=>n+x.contactTriangles,0),
  firstHits:hits.slice(0,14),sampleChecks:checks});
 if(hits.length)evidence.failures.push({mode,bodyHits:hits.map(x=>({tick:x.tick,id:x.originalB51Id,n:x.contactTriangles})).slice(0,30)});
}
fs.writeFileSync(output,JSON.stringify(evidence,null,2)+'\n');
console.log('P4_EXACT_INSTANTANEOUS_REAL_B51_TRIANGLE_OBB_GATE',JSON.stringify({
 contacts:evidence.failures,triangles:evidence.results.map(x=>x.realGPUCityTriangleCount),
 modeCount:evidence.results.length,nativeSnapshotsPerMode:ticks.length,
 continuousTime:'NOT_VERIFIED',humanVisibility:'HOLD',ART:'HOLD'}));
assert.equal(evidence.failures.length,0,
 'REAL original B51 oriented solid intersects Blender city triangle at sampled tick: ART/HUMAN HOLD');

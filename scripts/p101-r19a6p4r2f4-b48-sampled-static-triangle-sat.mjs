/** R2F4-B independent B48 sampled-surface 3D triangle contact gate.
 * This is NOT the original B48's exact engine tessellation; the source
 * parametric surfaces are sampled at u=1/320, v=1/12 and triangulated.
 * The source B48/B51 stage is never mutated.
 * Rejection is meaningful. PASS is only SAMPLED geometry noncontact,
 * not a continuous/analytic B48 source collision clearance certificate.
 */
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import assert from 'node:assert/strict';
import {generateP101W9C1AbyssCandidate} from './p101-w9c1-abyss-narrow.mjs';
import {sample} from '../private/reference_only/director/surface.js';
const source=fs.readFileSync('web/p101-w9c2-g4e7ci-integrated-streetscape.mjs');
const blob=crypto.createHash('sha1').update(Buffer.concat([
 Buffer.from('blob '+source.length+'\0'),source])).digest('hex');
assert.equal(blob,'af076d67492a677d2235e4730aef8cdf4808e106');
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const minus=(a,b)=>a.map((x,i)=>x-b[i]);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const edges=t=>[minus(t[1],t[0]),minus(t[2],t[1]),minus(t[0],t[2])];
function separated(axis,a,b){
 const n2=dot(axis,axis);if(n2<1e-16)return false;
 const av=a.map(x=>dot(x,axis)),bv=b.map(x=>dot(x,axis));
 const eps=1e-6*Math.sqrt(n2);
 return Math.max(...av)<Math.min(...bv)-eps||
        Math.max(...bv)<Math.min(...av)-eps;
}
function triangleSAT(a,b){
 const ea=edges(a),eb=edges(b),na=cross(ea[0],ea[1]),nb=cross(eb[0],eb[1]);
 // Normals and cross products are sufficient for non-coplanar
 // triangles. Edge-plane normals handle coplanar triangles.
 const axes=[na,nb];
 for(const x of ea)for(const y of eb)axes.push(cross(x,y));
 for(const x of ea){axes.push(cross(na,x));axes.push(cross(nb,x));}
 for(const y of eb){axes.push(cross(na,y));axes.push(cross(nb,y));}
 for(const axis of axes)if(separated(axis,a,b))return false;
 return true;
}
// A few direct SAT checks before processing the physical source.
const unitA=[[0,0,0],[1,0,0],[0,0,1]];
assert.equal(triangleSAT(unitA,[[0,2,0],[1,2,0],[0,2,1]]),false);
assert.equal(triangleSAT(unitA,[[.1,0,.1],[.5,0,.1],[.1,0,.5]]),true);
assert.equal(triangleSAT(unitA,[[4,0,4],[5,0,4],[4,0,5]]),false);
assert.equal(triangleSAT(unitA,[[.2,-1,.2],[.2,1,.2],[.6,0,.2]]),true);
const bounds=tri=>{
 const x=tri.map(v=>v[0]),y=tri.map(v=>v[1]),z=tri.map(v=>v[2]);
 return [Math.min(...x),Math.max(...x),Math.min(...y),Math.max(...y),
  Math.min(...z),Math.max(...z)];
};
const intersectsBounds=(a,b,eps=1e-6)=>
 a[0]<=b[1]+eps&&b[0]<=a[1]+eps&&
 a[2]<=b[3]+eps&&b[2]<=a[3]+eps&&
 a[4]<=b[5]+eps&&b[4]<=a[5]+eps;
const output={schema:'dopagaki.r2f4b-sampled-original-b48-road7-static-triangle-sat/1',
 originalSourceBlob:blob,originalStageUnchanged:true,newColliders:0,
 B48SourceSurfaceSamplingGridU:320,B48SourceSurfaceSamplingGridV:12,
 resultIsSampledMeshOnlyNotExactEngineStaticClearance:true,
 tickIntervalContinuousB51NotTested:true,
 actualGroundSupportNotTested:true,
 samples:[],failures:[],ART:'HOLD',HUMAN:'HOLD',RELEASE:'HOLD'};
for(const mode of ['ultra','control']){
 const stage=generateP101W9C1AbyssCandidate(mode);
 assert.equal(stage.surfaces.length,7);assert.equal(stage.movingObstacles.length,28);
 const frozen=JSON.stringify(stage);
 const outPath=path.resolve('r19-evidence/r19a6p4r2f4/P4R2F4_'+mode+'_audited_gpu.bin');
 const bin=fs.readFileSync(outPath);
 assert.equal(bin.length%72,0);
 const f=new Float32Array(bin.buffer.slice(bin.byteOffset,bin.byteOffset+bin.byteLength));
 const nt=f.length/18;assert(nt>10566&&nt<50000);
 const roadTriangles=[],grid=new Map(),tileSize=48;
 const key=(a,b)=>a+','+b;
 const toCell=n=>Math.floor(n/tileSize);
 let sampledVertices=0;
 for(let road=0;road<7;road++){
  const surf=stage.surfaces[road], rows=[];
  for(let u=0;u<=320;u++){
   const row=[];
   for(let v=0;v<=12;v++){
    const p=sample(surf,u/320,v/12);
    assert.equal(p.length,3);assert(p.every(Number.isFinite));
    row.push(p);sampledVertices++;
   }
   rows.push(row);
  }
  for(let u=0;u<320;u++)for(let v=0;v<12;v++){
   const p00=rows[u][v],p10=rows[u+1][v],p01=rows[u][v+1],p11=rows[u+1][v+1];
   for(const tri of [[p00,p10,p11],[p00,p11,p01]]){
    const bb=bounds(tri),id=roadTriangles.length;
    roadTriangles.push({road,tri,bb});
    for(let x=toCell(bb[0]);x<=toCell(bb[1]);x++)
     for(let z=toCell(bb[4]);z<=toCell(bb[5]);z++){
      const k=key(x,z);
      if(!grid.has(k))grid.set(k,[]);
      grid.get(k).push(id);
     }
   }
  }
 }
 let overlaps=0,broadphasePairs=0,fullSatTests=0;
 const contacts=[];
 for(let i=0;i<nt;i++){
  const tri=[];
  for(let k=0;k<3;k++){
   const n=(i*3+k)*6;
   tri.push([f[n],f[n+1],f[n+2]]);
  }
  const bb=bounds(tri),selected=new Set();
  for(let x=toCell(bb[0]);x<=toCell(bb[1]);x++)
   for(let z=toCell(bb[4]);z<=toCell(bb[5]);z++)
    for(const id of grid.get(key(x,z))||[])selected.add(id);
  broadphasePairs+=selected.size;
  for(const id of selected){
   const road=roadTriangles[id];
   if(!intersectsBounds(bb,road.bb))continue;
   overlaps++;
   fullSatTests++;
   if(triangleSAT(tri,road.tri)){
    if(contacts.length<25)contacts.push({cityTriangle:i,B48Road:road.road,sampledRoadTriangle:id});
   }
  }
 }
 assert.equal(JSON.stringify(stage),frozen);
 output.samples.push({mode,realGPUCityTriangles:nt,
  originalB48Surfaces:stage.surfaces.length,
  sampledSourceRoadVertices:sampledVertices,
  roadSampleMeshTriangles:roadTriangles.length,
  broadphasePairs,triangleAABBOverlapPairs:overlaps,triangleTriangleSATTests:fullSatTests,
  sampledSurfaceTriangleContacts:contacts.length,firstContacts:contacts,
  allRealOriginalB48TrianglesCertified:false});
 if(contacts.length)output.failures.push({mode,contacts});
}
const file='r19-evidence/r19a6p4r2f4/R2F4B_SAMPLED_B48_STATIC_TRIANGLE_SAT_QA.json';
fs.mkdirSync(path.dirname(file),{recursive:true});
fs.writeFileSync(file,JSON.stringify(output,null,2)+'\n');
console.log('R2F4B_ORIGINAL_B48_SAMPLED_TRIANGLE_STATIC_GATE',JSON.stringify({
 origin:blob,data:output.samples.map(x=>({mode:x.mode,roadSampleTriangles:x.roadSampleMeshTriangles,
 cityTriangles:x.realGPUCityTriangles,SATs:x.triangleTriangleSATTests,
 contacts:x.sampledSurfaceTriangleContacts})),pass:output.failures.length===0,
 exactEngineB48:'NOT_VERIFIED',human:'HOLD'}));
assert.equal(output.failures.length,0,'City triangle intersects source B48 sampled-surface triangle; do not ship');

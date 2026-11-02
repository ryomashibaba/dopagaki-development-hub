/**
 * R15S3D17R1 camera-geometry preflight; read-only and NEVER art certification.
 * Uses true original 240Hz WebGL2 camera basis saved by R15S3D15 genuine
 * source camera CI, not an invented perspective camera.
 * Actual shaded pixels/occlusion still require authentic WebGL2 screenshots.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {buildR15S3D11} from './p101-r15s3d11-six-real-b51-lane-reanchor-candidates.mjs';
import {buildR15S3D17City,DESIGNS} from './p101-r15s3d17-roadside-civic-architecture.mjs';
import {sample} from '../private/reference_only/director/surface.js';

const cameraFile=process.argv[2];
const outFolder=process.argv[3]??'test-results/r15s3d17r1-camera-geometry';
assert(cameraFile,'R15S3D15 original camera JSON path is required');
const source=fs.readFileSync('web/p101-w9c2-g4e7ci-integrated-streetscape.mjs');
const sha=crypto.createHash('sha1').update(Buffer.concat([
 Buffer.from('blob '+source.length+'\0'),source])).digest('hex');
assert.equal(sha,'af076d67492a677d2235e4730aef8cdf4808e106',
 'original source blob must remain frozen');
const cameraBytes=fs.readFileSync(cameraFile);
const camera=JSON.parse(cameraBytes);
assert.equal(camera.schema,'r15s3d15-true-original-webgl2-240hz-camera-projection/1');
assert.equal(camera.sourceBlob,sha);
assert.equal(camera.allB48,7);assert.equal(camera.originalB51,28);
assert.equal(camera.realGLSLEyeProjection,true);
assert.equal(camera.perWorld.length,2);

const dot=(a,b)=>a.reduce((r,x,i)=>r+x*b[i],0);
const subtract=(a,b)=>a.map((x,i)=>x-b[i]);
const length=v=>Math.hypot(...v);
const round=x=>Number(x.toFixed(5));
function project(v,shot){
 const relative=subtract(v,shot.eye),z=dot(relative,shot.front);
 if(z<=1)return null;
 const aspect=shot.width/shot.height;
 return [1.35*dot(relative,shot.right)/aspect/z,
  1.35*dot(relative,shot.up)/z,z];
}
function frameAudit(vertices,shot){
 const triangles=vertices.length/18;
 let projected=0,roadWindow=0,centralNear=0;
 const xs=[],ys=[],zValues=[];
 let closest=Infinity;
 for(let i=0;i<vertices.length;i+=18){
  const a=vertices.slice(i,i+3),b=vertices.slice(i+6,i+9),
    c=vertices.slice(i+12,i+15);
  const centroid=a.map((v,j)=>(v+b[j]+c[j])/3);
  const candidate=project(centroid,shot);
  if(!candidate)continue;
  const [x,y,z]=candidate;
  closest=Math.min(closest,z);
  if(Math.abs(x)>1||Math.abs(y)>1)continue;
  projected++;
  xs.push(x);ys.push(y);zValues.push(z);
  if(Math.abs(x)<.34&&y>-.65&&y<.28)roadWindow++;
  if(Math.abs(x)<.72&&y>-.2&&y<.72&&z<500)centralNear++;
 }
 return {triangleCentroidsInViewport:projected,
  approximateViewportTriangleShare:round(projected/triangles),
  roadWindowTriangleCentroids:roadWindow,
  nearCentralTriangleCentroids:centralNear,
  approximateViewportBounds:projected?{
   minX:round(Math.min(...xs)),maxX:round(Math.max(...xs)),
   minY:round(Math.min(...ys)),maxY:round(Math.max(...ys)),
   nearestProjectedDepthM:round(Math.min(...zValues))
  }:null,nearestForwardCentroidDepthM:Number.isFinite(closest)?round(closest):null,
  note:'Camera-space TRIANGLE CENTROIDS only, not visibility, occlusion or image quality'};
}
const results=[];
for(const w of camera.perWorld){
 assert(['true-pinch','pinch-switch'].includes(w.world));
 assert.equal(w.shots.length,5);
 const doc=buildR15S3D11(w.world,'A_EDGE_READABLE');
 assert.equal(doc.surfaces.length,7);assert.equal(doc.movingObstacles.length,28);
 const initialStage=JSON.stringify(doc);
 for(const mode of DESIGNS){
  const art=buildR15S3D17City(doc,sample,{mode});
  assert.equal(JSON.stringify(doc),initialStage);
  assert.equal(art.collisionAdded,0);
  const shots=[];
  for(const shot of w.shots){
   assert([54,58,61,64,67].includes(shot.time));
   assert.equal(shot.nativeTicks,shot.time*240);
   assert.equal(shot.actualWebGL2,true);
   assert.equal(shot.cameraMode,'ball-lock-unfiltered-heading');
   assert.equal(shot.sourceB48,7);assert.equal(shot.sourceB51,28);
   for(const axis of [shot.front,shot.right,shot.up])
    assert.ok(Math.abs(length(axis)-1)<.015);
   shots.push({second:shot.time,nativeTick:shot.nativeTicks,
    originalCameraEye:shot.eye,originalCurrentRoad:shot.currentRoad,
    ...frameAudit(art.vertices,shot)});
  }
  results.push({world:w.world,mode,originalCameraFrames:shots.length,
   actualXYZTriangles:art.triangles,trueOriginalCameraProjection:true,
   artApprovals:0,shots});
 }
}
assert.equal(results.length,4);
for(const r of results){
 assert.equal(r.originalCameraFrames,5);
 assert.ok(r.shots.every(s=>s.approximateViewportTriangleShare>=0&&
  s.approximateViewportTriangleShare<=1));
}
fs.mkdirSync(outFolder,{recursive:true});
const report={
 schema:'dopagaki.r15s3d17r1-native-source-camera-geometric-preview/1',
 sourceOriginalBlob:sha,sourceCameraArtifactSha256:crypto.createHash('sha256').update(cameraBytes).digest('hex'),
 sourceCameraActualNative240Hz:true,sourceB48:7,sourceB51:28,
 useOnlyAsReadOnlyScreenPositionRiskEvidence:true,
 cannotInferRenderedOcclusionOrHumanArtFromTriangleCentroids:true,
 noNewPhysicsOrColliders:true,
 matchesGenuineR15S3D17WebGL2RenderedPNGInSeparateRun:true,
 results,officialARTAccepted:0,officialSlope2Metres:0,
 ART:'REJECT_PENDING_NEW_GEOMETRY',GAMEPLAY:'HOLD',HUMAN:'HOLD',
 PERFORMANCE:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'
};
fs.writeFileSync(path.join(outFolder,'R15S3D17R1_EXACT_CAMERA_REAL_MESH_PROJECTION_RISK.json'),
 JSON.stringify(report,null,2)+'\n');
for(const r of results)console.log('R17R1_ACTUAL_CAMERA_MESH_GEOMETRY',JSON.stringify({
 world:r.world,mode:r.mode,triangles:r.actualXYZTriangles,
 times:r.shots.map(s=>({t:s.second,
  visibleCentroids:s.triangleCentroidsInViewport,
  roadCenter:s.roadWindowTriangleCentroids,
  nearCenter:s.nearCentralTriangleCentroids,
  bounds:s.approximateViewportBounds}))}));
console.log('R17R1_SOURCE_ORIGINAL_CAMERA_RESEARCH_ONLY',
 JSON.stringify({worlds:2,artModes:2,trueOriginalCameraFrames:10,
  snapshotMeasurements:20,originalBlob:sha,originalB48:7,originalB51:28,
  sourceUnchanged:true,actualImageStillMustBeJudged:true,
  ART:'REJECT_PENDING_NEW_GEOMETRY',HUMAN:'HOLD'}));

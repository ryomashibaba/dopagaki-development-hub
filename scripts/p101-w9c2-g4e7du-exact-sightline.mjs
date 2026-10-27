/**
 * G4E-7DU — EXACT native real-world sightline gate for an exposed civic axis.
 *
 * Reads original unchanged 240Hz cameras, CX 22,920 source triangles,
 * physical B48 7 full triangulated meshes (incl gap52), 28 native B51 OBBs.
 * Uses complete 3D ray-triangle and ray-OBB intersections, NOT a center-only
 * screen projection. Pure PRIVATE non-collider research, no game edits.
 */
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildDoReference} from './p101-w9c2-g4e7do-master-export.mjs';
import {buildDrPhysicalReference} from './p101-w9c2-g4e7dr-physical-export.mjs';
import {g4e7djNativeStoryboard} from './p101-w9c2-g4e7dj-native-storyboard.mjs';

export const DU_CAMERA_IDS=Object.freeze(['t1550','t1600','t1650']);
export const DU_CORRIDOR=Object.freeze({
 axisX:-65,floorY:95,nearZ:-475,farZ:-355,widthMeters:12,
 stationSpacingMeters:10,reviewOnly:true,notPlayable:true,
 geometryInOriginalGame:false,addedPhysicalColliders:0
});
export const DU_FAILED_BLIND_GATE=Object.freeze([-18,90,-440]);
const CH_SHA='af076d67492a677d2235e4730aef8cdf4808e106';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];

/** Float64, 9 consecutive coordinates per exact source triangle. */
function unpackStaticTriangles(doData,dr){
 const expected=doData.cxTriangleCount+dr.metadata.b48.reduce((s,m)=>s+m.indexCount/3,0);
 const tri=new Float64Array(expected*9);
 const groups=[];
 let ix=0;
 for(const source of doData.structures){
  const t=source.coordsAndColor,first=ix;
  for(let j=0;j<t.length;j+=6){
   tri[ix++]=t[j];tri[ix++]=t[j+1];tri[ix++]=t[j+2];
  }
  assert.equal(ix-first,source.triangles*9);
  groups.push({name:'CX:'+source.kind+':'+source.id,firstTriangle:first/9,triangles:source.triangles});
 }
 for(const info of dr.metadata.b48){
  const buf=dr.binary.subarray(info.fileByteOffset,info.fileByteOffset+info.fileByteLength);
  assert.equal(sha(buf),info.sha256);
  const first=ix;
  for(let j=0;j<info.indexCount;j++){
   const index=buf.readUInt32LE(info.positionsScalarCount*8+j*4);
   const p=index*3*8;
   for(let k=0;k<3;k++)tri[ix++]=buf.readDoubleLE(p+k*8);
  }
  assert.equal(ix-first,info.indexCount*3);
  groups.push({name:'B48:'+info.id,firstTriangle:first/9,triangles:info.indexCount/3});
 }
 assert.equal(ix,tri.length);
 return {tri,groups,triangles:expected};
}
/** Segment intersection with ALL exact static source triangles. Parameter t (0,1). */
function intersectStatic(origin,end,geometry){
 const T=geometry.tri,ray=sub(end,origin);
 const [dx,dy,dz]=ray;
 let firstT=1,hitIndex=-1;
 for(let i=0,idx=0;i<T.length;i+=9,idx++){
  const ax=T[i],ay=T[i+1],az=T[i+2];
  const e1x=T[i+3]-ax,e1y=T[i+4]-ay,e1z=T[i+5]-az;
  const e2x=T[i+6]-ax,e2y=T[i+7]-ay,e2z=T[i+8]-az;
  const hx=dy*e2z-dz*e2y,hy=dz*e2x-dx*e2z,hz=dx*e2y-dy*e2x;
  const det=e1x*hx+e1y*hy+e1z*hz;
  if(Math.abs(det)<1e-9)continue;
  const inv=1/det;
  const tx=origin[0]-ax,ty=origin[1]-ay,tz=origin[2]-az;
  const u=(tx*hx+ty*hy+tz*hz)*inv;
  if(u<-1e-9||u>1+1e-9)continue;
  const qx=ty*e1z-tz*e1y,qy=tz*e1x-tx*e1z,qz=tx*e1y-ty*e1x;
  const v=(dx*qx+dy*qy+dz*qz)*inv;
  if(v<-1e-9||u+v>1+1e-9)continue;
  const t=(e2x*qx+e2y*qy+e2z*qz)*inv;
  if(t>1e-4&&t<firstT&&t<.998){firstT=t;hitIndex=idx;}
 }
 if(hitIndex<0)return null;
 const group=geometry.groups.find(g=>hitIndex>=g.firstTriangle&&hitIndex<g.firstTriangle+g.triangles);
 return {type:'STATIC_EXACT_TRIANGLE',source:group.name,triangleIndex:hitIndex,
  rayFraction:firstT};
}
/** Exact segment x original Y-yaw B51 oriented bounding half-size box. */
function intersectMoving(origin,end,poses){
 const d=sub(end,origin);
 let closest=null;
 for(const p of poses){
  if(!p.enabled)continue;
  const c=Math.cos(p.yawRadians),s=Math.sin(p.yawRadians);
  const q=sub(origin,p.center),e=p.halfSize;
  // inverse of game's local->world Y rotation:
  // x_world=c*x+s*z ; z_world=-s*x+c*z
  const ro=[c*q[0]-s*q[2],q[1],s*q[0]+c*q[2]];
  const rd=[c*d[0]-s*d[2],d[1],s*d[0]+c*d[2]];
  let lo=0,hi=.998;
  for(let k=0;k<3;k++){
   if(Math.abs(rd[k])<1e-12){
    if(Math.abs(ro[k])>e[k]){hi=-1;break;}
    continue;
   }
   const u=(-e[k]-ro[k])/rd[k],v=(e[k]-ro[k])/rd[k];
   lo=Math.max(lo,Math.min(u,v));hi=Math.min(hi,Math.max(u,v));
   if(hi<lo)break;
  }
  if(hi>=lo&&hi>1e-4&&lo<.998&&(!closest||lo<closest.rayFraction))
   closest={type:'B51_ORIGINAL_MOVING_COLLISION_VOLUME',source:p.id,
    rayFraction:lo};
 }
 return closest;
}
function project(point,cam){
 const v=sub(point,cam.eye),depth=dot(v,cam.front);
 if(!(depth>1))return {depth,xy:[null,null],onScreen:false};
 const xy=[.5+.5*1.35*dot(v,cam.right)/(depth*(1008/645)),
  .5-.5*1.35*dot(v,cam.up)/depth];
 return {depth,xy,onScreen:xy[0]>.12&&xy[0]<.88&&xy[1]>.14&&xy[1]<.79};
}
function rayHit(origin,target,geometry,moving){
 const stat=intersectStatic(origin,target,geometry);
 const mob=intersectMoving(origin,target,moving);
 if(!stat)return mob;
 if(!mob)return stat;
 return stat.rayFraction<mob.rayFraction?stat:mob;
}
function points(){
 const c=DU_CORRIDOR,points=[];
 for(let z=c.nearZ;z<=c.farZ;z+=c.stationSpacingMeters){
  for(const lane of [-1,0,1]){
   points.push({id:'Z'+z+':L'+lane,point:[c.axisX+lane*c.widthMeters/2,c.floorY,z],
    lane,station:z});
  }
 }
 return points;
}
export function buildDuVisibility(road,native=g4e7djNativeStoryboard()){
 assert.ok(['true-pinch','pinch-switch'].includes(road),'DU unsupported original B48 road');
 const d=buildDoReference(road,native),phys=buildDrPhysicalReference(road,native);
 assert.equal(d.cxTriangleCount,22920);assert.equal(d.structures.length,18);
 assert.equal(phys.metadata.surfaces,7);assert.equal(phys.metadata.movers,28);
 assert.equal(phys.metadata.b48[0].gapProof.topSlot52Absent,true);
 const geometry=unpackStaticTriangles(d,phys),probes=points();
 assert.equal(probes.length,39);
 const cameraTests=[];
 let everyClear=true,screenCompositions=true,movingBlockers=0,staticBlockers=0;
 for(const shotId of DU_CAMERA_IDS){
  const cam=d.cameras.find(c=>c.id===shotId);
  const poses=phys.metadata.shots.find(s=>s.id===shotId).moving;
  assert.equal(poses.length,28);
  const visible=[];
  for(const pt of probes){
   const projection=project(pt.point,cam);
   const hit=rayHit(cam.eye,pt.point,geometry,poses);
   if(hit){everyClear=false;
    if(hit.type==='STATIC_EXACT_TRIANGLE')staticBlockers++;
    else movingBlockers++;
   }
   if(!projection.onScreen)screenCompositions=false;
   visible.push({id:pt.id,world:pt.point,xy:projection.xy,
    projectionDepth:projection.depth,onScreen:projection.onScreen,
    clearLineOfSight:!hit,occlusion:hit});
  }
  const blindHit=rayHit(cam.eye,DU_FAILED_BLIND_GATE,geometry,poses);
  cameraTests.push({id:shotId,realPhysicsTimeSeconds:phys.metadata.shots.find(s=>s.id===shotId).timeSeconds,
   originalCameraEye:cam.eye,probes:visible,
   blindGateNegativeControl:{point:DU_FAILED_BLIND_GATE,
    projected:project(DU_FAILED_BLIND_GATE,cam),occlusion:blindHit}});
 }
 // Verify a genuinely continuous 120m wide pedestrian location, not only
 // disconnected point targets. All 3 lane edges, all 12 ten-metre spans.
 const pathSegments=[];
 for(const lane of [-1,0,1]){
  const lanePts=probes.filter(p=>p.lane===lane);
  for(let i=0;i<lanePts.length-1;i++){
   const hit=intersectStatic(lanePts[i].point,lanePts[i+1].point,geometry);
   pathSegments.push({lane,from:lanePts[i].station,to:lanePts[i+1].station,
    intersectsOriginalCxOrPhysicalB48:!!hit,occlusion:hit});
  }
 }
 const collisionFree=pathSegments.every(x=>!x.intersectsOriginalCxOrPhysicalB48);
 const negativeControls=cameraTests.filter(x=>x.blindGateNegativeControl.occlusion).length;
 // Exit if a source change makes this original-world hypothesis untrue.
 assert.ok(everyClear,'DU actual 56k source triangle/B51 ray visibility FAILED');
 assert.ok(screenCompositions,'DU original 240Hz camera screen margins FAILED');
 assert.ok(collisionFree,'DU 120m walkway center and edges intersect original world triangles');
 assert.ok(negativeControls>=1,'DU missing blinded portal negative control');
 assert.equal(geometry.triangles,56012,'DU world triangle source drift');
 return {schema:'dopagaki.g4e7du-exact-world-civic-visibility-gate/1',road,
  originalCXVertexSha256:d.cxVertexSha256,originalSourceGeometryCount:geometry.triangles,
  originalCXTriangleCount:d.cxTriangleCount,actualB48PhysicalSurfaces:7,
  actualB51MovingVolumes:28,actualGap52:true,
  authentic240HzCameraIDs:DU_CAMERA_IDS,
  sameCivicAxisBothRoads:DU_CORRIDOR,
  actualCameraRaysTested:probes.length*DU_CAMERA_IDS.length,
  actualGeometryPathSegmentsTested:pathSegments.length,
  rayVisibilityAllClear:everyClear,onScreenAllFrames:screenCompositions,
  originalGeometryPathIntersections:0,movingBlockers,staticBlockers,
  blockedControlFrames:negativeControls,
  safetyInterpretation:'ONLY_STATIC_CX_B48_AND_SNAPSHOT_B51_SIGHTLINES_AND_SEGMENT_CHECK_NOT_A_PLAYABLE_OR_ACCESSIBLE_PEDESTRIAN_ROUTE',
  nextGate:'VALIDATE_REAL_ROAD_TO_ENTRANCE_TRANSITION_AND_LARGER_ARCHITECTURAL_APERTURES_BEFORE_ART_PASS',
  originalGameRenderer:'NOT_TESTED_NO_WEBGL_CLAIM',
  physicalCourseEdited:false,productionEdited:false,newGameColliders:0,
  cityArtAdopted:false,art:'HOLD',human:'HOLD',ready:'HOLD',
  publish:'HOLD',merge:'HOLD',officialSlope2Meters:0,cameraTests,pathSegments};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const root=path.resolve('test-results/g4e7du-civic-sightlines/plan');
 fs.mkdirSync(root,{recursive:true});
 const native=g4e7djNativeStoryboard();
 for(const road of ['true-pinch','pinch-switch']){
  const x=buildDuVisibility(road,native);
  fs.writeFileSync(path.join(root,road+'.json'),JSON.stringify(x,null,2)+'\n');
  console.log('DU_GENUINE_STATIC_AND_DYNAMIC_WORLD_SIGHTLINE_PASS',
   JSON.stringify({road,staticTriangles:x.originalSourceGeometryCount,
    rays:x.actualCameraRaysTested,originalCollisionFreeSegments:x.actualGeometryPathSegmentsTested,
    blockedNegativeControlFrames:x.blockedControlFrames,art:x.art}));
 }
}
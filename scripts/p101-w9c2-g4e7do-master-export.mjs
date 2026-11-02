/**
 * G4E-7DO: export the PROTECTED genuine 240Hz camera snapshots + existing
 * unchanged CX scenic triangles to an artist-editable Blender master stage.
 * No new scenery, renderer integration, roads, colliders, steering or physics.
 * This is a 3D ART AUTHORING REFERENCE, NOT a native game screenshot.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {generateG4E7BC} from './p101-w9c2-g4e7bc-bank-contour.mjs';
import {g4e7djNativeStoryboard} from './p101-w9c2-g4e7dj-native-storyboard.mjs';
import {g4e7ciIntegratedStreetscape} from '../web/p101-w9c2-g4e7ci-integrated-streetscape.mjs';
import {sample} from '../private/reference_only/director/surface.js';
export const DO_TIMES=Object.freeze(['t1500','t1550','t1600','t1650','t1700']);
const OUT='test-results/g4e7do-master-camera';
const digest=a=>crypto.createHash('sha256').update(JSON.stringify(a)).digest('hex');
const length=a=>Math.hypot(...a),unit=a=>a.map(x=>x/length(a));
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const sub=(a,b)=>a.map((v,i)=>v-b[i]),dot=(a,b)=>a.reduce((sum,x,i)=>sum+x*b[i],0);
function frameFromOriginalShot(shot){
 const front=unit(shot.front),right=unit(cross(front,[0,1,0])),up=unit(cross(right,front));
 const probe=shot.eye.map((x,i)=>x+front[i]*100+right[i]*16+up[i]*7);
 const w=sub(probe,shot.eye),z=dot(w,front),aspect=1008/645;
 const ndc=[1.35*dot(w,right)/(aspect*z),1.35*dot(w,up)/z];
 assert.ok(Math.abs(z-100)<1e-8);
 return {id:shot.id,timeSeconds:shot.timeSeconds,speedMps:shot.speedMps,
  source:shot.source,eye:shot.eye,front,right,up,
  fovYDeg:2*Math.atan(1/1.35)*180/Math.PI,projectionVerticalFocal:1.35,
  aspect,renderSize:[1008,645],samplePixel:[(ndc[0]+1)*504,(1-ndc[1])*322.5]};
}
export function buildDoReference(road,native=g4e7djNativeStoryboard()){
 if(!['true-pinch','pinch-switch'].includes(road))throw Error('DO unsupported BC road');
 const doc=generateG4E7BC(road,'rollDeck'),original=JSON.stringify(doc);
 const shots=native.stages[road].frames;
 const cx=g4e7ciIntegratedStreetscape(doc,sample,{enabled:true,shots});
 assert.ok(cx.active&&cx.sources?.length>10&&cx.landmarks===2&&cx.triangles>1000);
 const cameras=DO_TIMES.map(id=>{
  const shot=shots.find(x=>x.id===id);
  assert.ok(shot&&shot.source==='ACTUAL_240HZ_START00_P96_FIXED_SCRIPT_NOT_HUMAN');
  return frameFromOriginalShot(shot);
 });
 const structures=cx.sources.map((s,i)=>{
  const v=cx.vertices.slice(s.firstTriangle*18,(s.firstTriangle+s.triangleCount)*18);
  assert.equal(v.length,s.triangleCount*18);
  return {id:i,kind:s.kind,slot:s.slot??null,side:s.side??null,
   triangles:s.triangleCount,originalFirstTriangle:s.firstTriangle,
   coordsAndColor:v,sourceSha256:digest(v)};
 });
 const lineGuides=doc.surfaces.map((s,index)=>{
  const tracks=[0,.5,1].map(lane=>{
   const points=[];
   for(let i=0;i<=48;i++){
    const u=.002+(i/48)*.996;
    const p=sample(s,u,lane);
    assert.ok(p.length===3&&p.every(Number.isFinite));
    points.push(p);
   }
   return {lane,points};
  });
  return {surface:index,tracks,NON_PHYSICAL_ONLY:true};
 });
 const triangleCount=structures.reduce((n,s)=>n+s.triangles,0);
 assert.equal(triangleCount,cx.triangles);
 assert.equal(structures.filter(x=>x.kind==='anchored-civic-crescent').length,2);
 assert.equal(doc.surfaces.length,7);assert.equal(doc.movingObstacles.length,28);
 assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52]);
 assert.equal(JSON.stringify(doc),original,'DO must not mutate physics');
 return {schema:'dopagaki.g4e7do-native-master-editable-blender/1',road,
  authorship:'UNCHANGED_CX_3D_REFERENCES_PLUS_REAL_NATIVE_CAMERAS_ONLY_NOT_ART',
  camera:'ORIGINAL_BALL_RELATIVE_240HZ_START00_P96_FIXED_SCRIPT_NOT_HUMAN',
  gameExactRendering:false,framebufferEquivalence:'NOT_CLAIMED',
  geometryName:'ORIGINAL_CX_WORLD_XYZ_UNALTERED',cameraProjection:'GAME_VERTICAL_FOCAL_1_35',
  cxTriangleCount:cx.triangles,cxSources:structures.length,
  cxVertexSha256:digest(cx.vertices),cameras,structures,lineGuides,
  physics:{surfaces:7,movingHazards:28,gap52:true,noNewRoad:true,
   noNewCollider:true,officialSlope2Meters:0},
  review:{art:'HOLD',human:'HOLD',ready:'HOLD',publish:'HOLD',merge:'HOLD'}};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 fs.mkdirSync(OUT,{recursive:true});
 const summary=[];
 const native=g4e7djNativeStoryboard();
 for(const road of ['true-pinch','pinch-switch']){
  const data=buildDoReference(road,native),file=path.resolve(OUT,road+'.json');
  fs.writeFileSync(file,JSON.stringify(data)+'\n');
  summary.push({road,frameCount:data.cameras.length,triangles:data.cxTriangleCount,
   sources:data.cxSources,cxVertexSha256:data.cxVertexSha256,file});
  console.log('DO_NATIVE_BLENDER_MASTER_SOURCE',JSON.stringify(summary.at(-1)));
 }
 fs.writeFileSync(path.resolve(OUT,'G4E7DO_EXPORT_AUDIT_ART_HOLD.json'),
  JSON.stringify({schema:'G4E7DO_MASTER_EXPORT_AUDIT',originalSourceBlob:'af076d67492a677d2235e4730aef8cdf4808e106',
   timestampLabel:'2026-10-27-JST',sources:summary,art:'HOLD',physicsChanged:false},null,2)+'\n');
}

/**
 * DS / MERIDIAN FIVE — ONE authored urban composition, not five alternatives.
 * Real protected DO native cameras and actual B48 guide tracks determine sites.
 * Both camera paths use the EXACT SAME immutable world-space urban massing.
 * PRIVATE art hypothesis; none of the scene is a game collider or game WebGL.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildDoReference} from './p101-w9c2-g4e7do-master-export.mjs';
import {g4e7djNativeStoryboard} from './p101-w9c2-g4e7dj-native-storyboard.mjs';
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
export const DS_SITES=Object.freeze([
 Object.freeze({id:'gate-foyer',center:[0,45,-460],radius:30,height:123,form:'open foyer / arrival'}),
 Object.freeze({id:'western-split',center:[-65,46,-355],radius:30,height:164,form:'carved social library'}),
 Object.freeze({id:'eastern-steps',center:[-200,48,-250],radius:33,height:137,form:'sunlit inhabited tiers'}),
 Object.freeze({id:'transit-canyon',center:[100,50,-150],radius:36,height:181,form:'interchange amphitheatre'}),
 Object.freeze({id:'far-terraces',center:[110,62,50],radius:44,height:157,form:'layered inhabited skyward district'})
]);
const dist2D=(a,b)=>Math.hypot(a[0]-b[0],a[2]-b[2]);
function project(p,c){
 const v=p.map((x,i)=>x-c.eye[i]),z=dot(v,c.front);
 if(z<=0)return {x:-100,y:-100,depth:z};
 return {x:.5+.5*1.35*dot(v,c.right)/((1008/645)*z),
  y:.5-.5*1.35*dot(v,c.up)/z,depth:z};
}
export function dsSpatialProof(road,native=g4e7djNativeStoryboard()){
 const doc=buildDoReference(road,native);
 const samples=doc.lineGuides.flatMap(line=>line.tracks.flatMap(t=>t.points));
 const audit=DS_SITES.map(site=>{
  const nearest=minDistance(site.center,samples);
  if(nearest<site.radius+30)throw Error('DS real B48 corridor clearance rejected '+site.id+' '+nearest);
  const world=[site.center[0],site.center[1]+site.height*.40,site.center[2]];
  const projected=doc.cameras.map(c=>({id:c.id,...project(world,c)}));
  const seen=projected.filter(p=>p.depth>80&&p.x>.08&&p.x<.94&&p.y>.12&&p.y<.78);
  if(seen.length<4)throw Error('DS original 240Hz temporal skyline visibility rejected '+site.id);
  return {id:site.id,form:site.form,worldCenter:site.center,radius:site.radius,
   height:site.height,minB48GuideXYDistanceMeters:nearest,
   guideScreenProbe:'MASS_CENTER_ONLY_NOT_OCCLUSION_PROOF',cameraProjections:projected,
   visibleCameras:seen.length};
 });
 return {schema:'dopagaki.g4e7ds-one-world-meridian-native-camera-planning/1',
  road,originalCXVertexSha256:doc.cxVertexSha256,
  siteCount:audit.length,sameArtWorldAcrossRoads:true,
  exactOriginalRealB48AndB51Source:'REVIEW_STAGE_G4E7DR',
  originalGameWebGL:'NOT_RENDERED',
  gamePhysicsChanged:false,newColliders:0,formalSlope2Meters:0,
  art:'HOLD',human:'HOLD',ready:'HOLD',publish:'HOLD',merge:'HOLD',sites:audit};
}
function minDistance(center,points){return Math.min(...points.map(p=>dist2D(center,p)));}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const native=g4e7djNativeStoryboard(),out=path.resolve('test-results/g4e7ds-meridian/plan');
 fs.mkdirSync(out,{recursive:true});
 for(const road of ['true-pinch','pinch-switch']){
  const p=dsSpatialProof(road,native);
  fs.writeFileSync(path.join(out,road+'.json'),JSON.stringify(p,null,2)+'\n');
  console.log('DS_NATIVE_PLACEMENT_AND_PHYSICAL_CLEARANCE_PASS',
   road,p.sites.map(s=>({id:s.id,roadClearanceMeters:+s.minB48GuideXYDistanceMeters.toFixed(1),
    visibleCameras:s.visibleCameras})));
 }
}
/**
 * G4E-7DT / THREE-CLEF CITY: camera-first NON-REPEATING megastructure concept.
 * Actual 15.5/16/16.5 original 240Hz P96 scripted game-camera poses.
 * No game renderer, physics, route, camera, controls or collisions changed.
 * Proves only location/view planning, NEVER visual beauty or no 3D collision.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildDoReference} from './p101-w9c2-g4e7do-master-export.mjs';
import {g4e7djNativeStoryboard} from './p101-w9c2-g4e7dj-native-storyboard.mjs';
export const DT_TIMES=Object.freeze(['t1550','t1600','t1650']);
export const DT_CLEFS=Object.freeze([
 Object.freeze({id:'DELTA_GATE',center:[0,45,-460],radius:85,height:156,gap:30,handedness:1,frontSpan:106,shape:'LOW_SPLIT_DELTA_PUBLIC_GATE'}),
 Object.freeze({id:'RIFT_LIBRARY',center:[-200,48,-250],radius:64,height:183,gap:24,handedness:-1,frontSpan:96,shape:'ASYMMETRIC_INHABITED_DEEP_CANYON'}),
 Object.freeze({id:'HIGHLAND_EXCHANGE',center:[110,62,50],radius:108,height:193,gap:42,handedness:1,frontSpan:164,shape:'BROAD_TERRACED_CIVIC_HIGHLAND'})
]);
const norm=a=>Math.hypot(...a);
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
function project(point,cam){
 const v=point.map((x,i)=>x-cam.eye[i]),z=dot(v,cam.front);
 if(z<1)return {visible:false,z};
 return {x:.5+.5*1.35*dot(v,cam.right)/(z*(1008/645)),y:.5-.5*1.35*dot(v,cam.up)/z,z};
}
export function buildDtMassingPlan(road,native=g4e7djNativeStoryboard()){
 const doc=buildDoReference(road,native);
 const guides=doc.lineGuides.flatMap(l=>l.tracks.flatMap(t=>t.points));
 const cams=DT_TIMES.map(id=>doc.cameras.find(c=>c.id===id));
 if(cams.some(x=>!x))throw Error('DT missing real 240Hz camera');
 const sites=DT_CLEFS.map(site=>{
  const roadDistance=Math.min(...guides.map(p=>norm([p[0]-site.center[0],p[2]-site.center[2]])));
  if(!(roadDistance>site.radius+19))throw Error('DT site too near ORIGINAL B48 sample guides '+site.id);
  const c=[site.center[0],site.center[1]+site.height*.59,site.center[2]];
  const projections=cams.map(ca=>({id:ca.id,...project(c,ca)}));
  if(projections.some(p=>p.z<80||p.x<.12||p.x>.89||p.y<.11||p.y>.83))
   throw Error('DT key mass not stable in three real original game cameras '+site.id);
  return {...site,roadGuideMinimumDistance:roadDistance,projectionProbeOnly:projections};
 });
 return {schema:'dopagaki.g4e7dt-three-clef-unadopted/1',road,
  sameWorldSitesBothRoads:true,sourceOriginalCXVertexSha256:doc.cxVertexSha256,
  originalSource:'B48_EXACT_TESSELLATION_B51_28_MOVER_CAMERAS_FROM_DR',
  cameraIDs:DT_TIMES,candidateCount:1,mainSculpturalDistricts:3,
  additionalGameColliders:0,changedGameplay:false,realWebGL:'NOT_RUN',
  actual3dVisualBeauty:'UNTESTED_UNTIL_RENDER_AND_HUMAN_REVIEW',
  roadsNotFullyIntersectTested:'ROAD_GUIDES_PROJECTION_ONLY',
  formalSlope2Meters:0,art:'HOLD',human:'HOLD',publish:'HOLD',merge:'HOLD',
  sites};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const native=g4e7djNativeStoryboard(),out='test-results/g4e7dt-three-clef/plans';
 fs.mkdirSync(out,{recursive:true});
 for(const road of ['true-pinch','pinch-switch']){
  const p=buildDtMassingPlan(road,native);
  fs.writeFileSync(path.join(out,road+'.json'),JSON.stringify(p,null,2)+'\n');
  console.log('DT_ONE_WORLD_THREE_MASSES_NATIVE_CAMERA_PROBE_PASS',
   JSON.stringify({road,sites:p.sites.map(s=>({id:s.id,guideClearance:s.roadGuideMinimumDistance,
    cameraXY:s.projectionProbeOnly.map(c=>[c.id,c.x,c.y])}))}));
 }
}
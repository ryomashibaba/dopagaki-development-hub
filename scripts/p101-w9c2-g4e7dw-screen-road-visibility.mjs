/**
 * G4E-7DW — SOURCE-PRESERVING ORIGINAL 240HZ SCREEN/ROAD/SIGHTLINE SEARCH.
 *
 * No added game geometry or claims of human-safe access.
 * Candidate geometry touches a SOURCE road EDGE sampled from B48, then
 * projects an 18-metre-wide portal at outboard lift/ramp endpoint.
 * Screen tests are exact original camera projection, not a beauty score.
 * Finalist camera rays are tested against ALL original 56012 CX/B48 triangles
 * and every original B51 yaw-oriented obstacle snapshot at 3 native ticks.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {generateG4E7BC} from './p101-w9c2-g4e7bc-bank-contour.mjs';
import {buildDoReference} from './p101-w9c2-g4e7do-master-export.mjs';
import {buildDrPhysicalReference} from './p101-w9c2-g4e7dr-physical-export.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {DU_CAMERA_IDS, DU_CORRIDOR, DU_FAILED_BLIND_GATE,
 unpackStaticTriangles, rayHit, project, intersectStatic}
 from './p101-w9c2-g4e7du-exact-sightline.mjs';
import {g4e7djNativeStoryboard} from './p101-w9c2-g4e7dj-native-storyboard.mjs';

export const DW_PORTAL_WIDTH_METRES=18, DW_PORTAL_HEIGHT_METRES=19;
export const DW_GEOMETRY_CANDIDATES_REVIEWED_MAX=72;
export const DW_SOURCE_SAMPLES=Object.freeze([.12,.22,.32,.42,.52,.62,.72,.82,.92]);
export const DW_OUTBOARD_OFFSETS=Object.freeze([12,24,42,64]);
export const DW_VERTICAL_RISE=Object.freeze([2,6,13,24]);
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const add=(a,b)=>a.map((x,i)=>x+b[i]);
const mul=(a,s)=>a.map(x=>x*s);
const unit2=(x,z)=>{const n=Math.hypot(x,z);return n>1e-8?[x/n,z/n]:null;};
const shaControl='af076d67492a677d2235e4730aef8cdf4808e106';
function makeCandidates(stage){
 const result=[];
 for(let sIndex=0;sIndex<stage.surfaces.length;sIndex++){
  const s=stage.surfaces[sIndex];
  if(!s.rideable||!s.collidable)continue;
  for(const u of DW_SOURCE_SAMPLES)for(const v of [0,1]){
   const foot=sample(s,u,v),mid=sample(s,u,.5);
   let outward=unit2(foot[0]-mid[0],foot[2]-mid[2]);
   if(!outward){
    const p=sample(s,Math.max(.001,u-.002),v);
    const q=sample(s,Math.min(.999,u+.002),v);
    const tangent=unit2(q[0]-p[0],q[2]-p[2]);
    if(!tangent)continue;
    outward=v===0?[-tangent[1],tangent[0]]:[tangent[1],-tangent[0]];
   }
   // Fixed orientation, perpendicular to road-outboard sightline, not
   // repeatedly rotated to face each camera shot after rendering.
   const right=[-outward[1],0,outward[0]];
   for(const away of DW_OUTBOARD_OFFSETS)for(const rise of DW_VERTICAL_RISE){
    const center=[foot[0]+outward[0]*away,foot[1]+rise,foot[2]+outward[1]*away];
    const cid='B48'+sIndex+'_U'+Math.round(u*100)+'_V'+v+'_O'+away+'_H'+rise;
    result.push({id:cid,sourceSurface:s.id,sourceSurfaceIndex:sIndex,
     originalRideable:s.rideable,sourceU:u,sourceV:v,
     originalB48TopEdgeFootpoint:foot,worldCenter:center,
     fixedPortalRight:right,outboardOffsetMeters:away,verticalRiseMeters:rise,
     gradeProxy:rise/away,portalWidthMeters:DW_PORTAL_WIDTH_METRES,
     portalHeightMeters:DW_PORTAL_HEIGHT_METRES,
     sourceRoadVertexIsRealOriginalSample:true,
     notProofOfSafeRoadShoulder:true,realGameplayPathExists:false});
   }
  }
 }
 return result;
}
function portalProbes(c){
 const p=c.worldCenter,r=c.fixedPortalRight,w=c.portalWidthMeters/2;
 return [p,add(p,mul(r,w)),add(p,mul(r,-w)),add(p,[0,DW_PORTAL_HEIGHT_METRES,0])];
}
function scoreProjection(c,camera){
 const p=portalProbes(c).map(x=>project(x,camera));
 if(p.some(x=>!x.onScreen))return {onScreen:false};
 const screenWidthPx=Math.hypot((p[1].xy[0]-p[2].xy[0])*1008,(p[1].xy[1]-p[2].xy[1])*645);
 const heightPx=Math.hypot((p[3].xy[0]-p[0].xy[0])*1008,(p[3].xy[1]-p[0].xy[1])*645);
 const x=p[0].xy[0],y=p[0].xy[1];
 return {onScreen:true,centerPixel:[x*1008,y*645],
  sourceNativeDepthMeters:p[0].depth,projectedPortalWidthPx:screenWidthPx,
  projectedPortalHeightPx:heightPx};
}
export function planDwCandidates(native=g4e7djNativeStoryboard()){
 const stages=Object.fromEntries(['true-pinch','pinch-switch'].map(r=>[r,generateG4E7BC(r,'rollDeck')]));
 const worlds=Object.fromEntries(Object.keys(stages).map(r=>[r,buildDoReference(r,native)]));
 const original={roads:7,moving:28,sourceCXTriangles:22920,sourceB48Triangles:33092,roadGap52:true};
 assert.equal(worlds['true-pinch'].cxVertexSha256,worlds['pinch-switch'].cxVertexSha256);
 for(const r of Object.keys(stages)){
  assert.equal(stages[r].surfaces.length,7);
  assert.equal(stages[r].movingObstacles.length,28);
  assert.deepEqual(stages[r].surfaces[0].voidLongitudinalCells,[52]);
 }
 const candidates=makeCandidates(stages['true-pinch']);
 const first=DU_CAMERA_IDS.map(id=>worlds['true-pinch'].cameras.find(c=>c.id===id));
 const second=DU_CAMERA_IDS.map(id=>worlds['pinch-switch'].cameras.find(c=>c.id===id));
 const allCameras=[...first,...second];assert.ok(allCameras.every(Boolean));
 let seen=0,projected=0;
 const prelim=[];
 for(const c of candidates){
  seen++;
  const views=allCameras.map(cam=>scoreProjection(c,cam));
  const visible=views.filter(q=>q.onScreen);
  if(visible.length<6)continue;
  projected++;
  const minWidth=Math.min(...views.map(v=>v.projectedPortalWidthPx));
  const minHeight=Math.min(...views.map(v=>v.projectedPortalHeightPx));
  const maxWidth=Math.max(...views.map(v=>v.projectedPortalWidthPx));
  const minDepth=Math.min(...views.map(v=>v.sourceNativeDepthMeters));
  const avgX=views.reduce((n,v)=>n+v.centerPixel[0],0)/6;
  const avgY=views.reduce((n,v)=>n+v.centerPixel[1],0)/6;
  // A useful LARGE enough public opening, without unbounded lane-occlusion;
  // scores select only candidates for expensive real geometry checks.
  const screenScore=Math.min(minWidth,100)+Math.min(minHeight,90)*.75;
  const accessPenalty=c.outboardOffsetMeters*.13+c.verticalRiseMeters*.8;
  const compositionPenalty=Math.abs(avgX-504)*.028+Math.abs(avgY-300)*.015;
  const score=screenScore-accessPenalty-compositionPenalty;
  prelim.push({...c,nativeCameraProjection:views,
   minimumReadableWidthPixels:minWidth,minimumHeightPixels:minHeight,
   maximumWidthPixels:maxWidth,minimumCameraDepthMeters:minDepth,
   initialScore:score});
 }
 prelim.sort((a,b)=>b.initialScore-a.initialScore||a.id.localeCompare(b.id));
 return {schema:'dopagaki.g4e7dw-exact-screen-original-B48-road-placement/1',
  worlds,stages,allCameras,original,candidatesExamined:seen,
  allSixCameraVisibleCount:projected,preselection:prelim,
  metadata:{originalSourceCXHash:worlds['true-pinch'].cxVertexSha256,
   sourceOriginalGameRenderer:'NOT_USED',
   nativeScriptedCameraNotHuman:true,art:'HOLD',human:'HOLD',
   newGameColliders:0,gamePhysicsChanged:false,officialSlope2Meters:0}};
}
export function buildDwSiteSearch(native=g4e7djNativeStoryboard(),{geometryBudget=DW_GEOMETRY_CANDIDATES_REVIEWED_MAX}={}){
 assert.ok(Number.isSafeInteger(geometryBudget)&&geometryBudget>=1&&geometryBudget<=DW_GEOMETRY_CANDIDATES_REVIEWED_MAX);
 const p=planDwCandidates(native);
 const roads=['true-pinch','pinch-switch'];
 const snapshots=Object.fromEntries(roads.map(r=>[r,buildDrPhysicalReference(r,native)]));
 const geometry=Object.fromEntries(roads.map(r=>[r,unpackStaticTriangles(p.worlds[r],snapshots[r])]));
 assert.ok(roads.every(r=>geometry[r].triangles===56012));
 // Diversify before ray-testing: a shortlist of high-scoring poses, then a
 // smaller sample from farther away, to avoid bias to one segment/road edge.
 const shortlist=[...p.preselection.slice(0,Math.ceil(geometryBudget*.65))];
 const alternative=p.preselection.slice(Math.ceil(geometryBudget*.65));
 const step=Math.max(1,Math.floor(alternative.length/Math.max(1,geometryBudget-shortlist.length)));
 for(let i=0;i<alternative.length&&shortlist.length<geometryBudget;i+=step)shortlist.push(alternative[i]);
 const audits=[];
 for(const c of shortlist){
  const probes=portalProbes(c),outcomes=[];
  for(const r of roads){
   const shots=DU_CAMERA_IDS.map(id=>snapshots[r].metadata.shots.find(s=>s.id===id));
   const cams=DU_CAMERA_IDS.map(id=>p.worlds[r].cameras.find(c=>c.id===id));
   // Exact original topology: proposed bridge would connect directly to a
   // real B48 EDGE point. Test one raised ray only, not ramp width/colliders.
   const foot=[...c.originalB48TopEdgeFootpoint];
   const elevated=[foot[0],foot[1]+1.8,foot[2]];
   const center=[...c.worldCenter];
   const staticBridgeHit=intersectStatic(elevated,center,geometry[r]);
   for(let k=0;k<3;k++){
    const pose=shots[k].moving;
    const visibility=probes.map(point=>rayHit(cams[k].eye,point,geometry[r],pose));
    outcomes.push({road:r,id:DU_CAMERA_IDS[k],
     probesTested:visibility.length,allPortalFeaturesRayClear:visibility.every(h=>h===null),
     cameraOccluders:visibility.filter(Boolean).map(hit=>hit.source),
     bridgeRayOriginalStaticHit:staticBridgeHit,
     bridgeRayClearOfOriginalStaticTriangles:staticBridgeHit===null});
   }
  }
  const clear=outcomes.every(x=>x.allPortalFeaturesRayClear);
  const bridge=outcomes.every(x=>x.bridgeRayClearOfOriginalStaticTriangles);
  const strong=c.minimumReadableWidthPixels>=18&&c.minimumHeightPixels>=16;
  const signal=clear&&bridge&&strong;
  audits.push({...c,preliminaryStrongScreenSignal:strong,
   originalWorldPortalRaysAllClear:clear,
   simpleLiftToPortalCenterlineStaticClear:bridge,
   combinedStudyGate:signal?'VISUALLY_PLAUSIBLE_ONLY':'REJECT_SCREEN_OR_RAY',
   checks:outcomes});
 }
 const passed=audits.filter(a=>a.combinedStudyGate==='VISUALLY_PLAUSIBLE_ONLY');
 passed.sort((a,b)=>b.initialScore-a.initialScore);
 const selected=passed.slice(0,3);
 return {schema:'dopagaki.g4e7dw-visibility-pixel-and-actual-original-b48-road-candidate-study/1',
  roadmap:'SEARCH_AND_REJECT_BEFORE_ANY_ARCHITECTURAL_MASSING',
  candidatesGenerated:p.candidatesExamined,allSixCameraProjected:p.allSixCameraVisibleCount,
  nativeCameraFrames:DU_CAMERA_IDS,originalPhysics:{...p.original},
  testedAgainstOriginal56012TrianglesAndB51Snapshots:true,
  exactStaticTrianglesPerRoad:56012,
  exactMovingOBBCountPerNativeFrame:28,
  fullGeometryEvaluated:audits.length,
  screenReadableGate:{widthPxAtLeast:18,heightPxAtLeast:16,
   originalRenderPx:[1008,645]},
  originalDUComparison:{world:[DU_CORRIDOR.axisX,DU_CORRIDOR.floorY,DU_CORRIDOR.nearZ],
   exactOriginalRoadClearance3dMeters:64.5252489601258,
   reason:'DV VERIFIED: visibility only, existing B48 physical floor absent'},
  candidates:audits,retainedProvisionalStudySites:selected,
  interpretation:'RAY_CLEAR_AND_ORIGINAL_EDGE_SAMPLED_ONLY; NOT ROAD-SAFE, NO_FULL_VOLUME_INTERSECTION, NO_BUILDABLE_OR_PLAYABLE_ROUTE_CERTIFIED',
  noSourceRoadTouched:true,gameCodeEdited:false,formalVisualArtAdoptionCount:0,
  gamePhysicsChanged:false,gameColliderAdded:0,gameWebGL:'NOT_RUN',
  art:'HOLD',human:'HOLD',ready:'HOLD',publish:'HOLD',merge:'HOLD',
  officialSlope2Meters:0};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const out=path.resolve('test-results/g4e7dw-road-screen-selection');
 fs.mkdirSync(out,{recursive:true});
 const report=buildDwSiteSearch();
 fs.writeFileSync(path.join(out,'G4E7DW_WORLD_SOURCE_SELECTION_ART_HOLD.json'),JSON.stringify(report,null,2)+'\n');
 console.log('DW_SOURCE_GROUNDED_CANDIDATES_EVALUATED',JSON.stringify({
  generated:report.candidatesGenerated,withinAllSixFrames:report.allSixCameraProjected,
  actualOriginalGeometryCandidates:report.fullGeometryEvaluated,
  provisionalScreenAndRayPassCount:report.candidates.filter(x=>x.combinedStudyGate==='VISUALLY_PLAUSIBLE_ONLY').length,
  finalists:report.retainedProvisionalStudySites.map(x=>({id:x.id,
   minWidthPx:x.minimumReadableWidthPixels,minHeightPx:x.minimumHeightPixels,
   originalOutboardOffsetMeters:x.outboardOffsetMeters,requiredLiftMeters:x.verticalRiseMeters})),
  publicApproved:false,art:'HOLD'}));
}
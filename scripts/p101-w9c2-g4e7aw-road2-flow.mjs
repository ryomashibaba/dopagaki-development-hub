/** G4E-7AW — nonpublishing real B48 second-road flow correction.
 * Retain full AV lineSoft 1st road and native void 52. Restore some of the
 * extreme AT S wave/crest to its original AS continuous centerline, without
 * changing the narrow B48 cross-section at ANY sample. Reanchor all 4 actual
 * second-road B51-C machines; preserve their collision and movement types.
 */
import {generateG4E7AV} from './p101-w9c2-g4e7av-crest-shaping.mjs';
import {generateG4E7AS} from './p101-w9c2-g4e7as-banked-serpent.mjs';
import {AJ_ROADS} from './p101-w9c2-g4e7aj-reanchor-moving.mjs';
import {sample,validate,tessellate} from '../private/reference_only/director/surface.js';
import {validateMovingObstacle} from '../private/reference_only/director/moving/moving-obstacles.mjs';
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const l=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export const AW_PROFILES=Object.freeze({
 flowSoft:Object.freeze({id:'flowSoft',sideScale:.55,verticalScale:.55}),
 flowOpen:Object.freeze({id:'flowOpen',sideScale:.25,verticalScale:.20}),
 entryEase:Object.freeze({id:'entryEase',sideScale:.55,verticalScale:.55,crownSideScale:0,crownVerticalScale:0}),
 flowClear:Object.freeze({id:'flowClear',sideScale:0,verticalScale:0})
});
const side=(s,u)=>{
 const a=sample(s,clamp(u-.002,0,1),.5),b=sample(s,clamp(u+.002,0,1),.5),
  dx=b[0]-a[0],dz=b[2]-a[2],d=Math.hypot(dx,dz);
 if(d<1)throw Error('AW physical 2nd road tangent invalid');
 return [-dz/d,0,dx/d];
};
const angle=(a,b)=>Math.atan2(a[0]*b[2]-a[2]*b[0],a[0]*b[0]+a[2]*b[2])*180/Math.PI;
export function generateG4E7AW(road='true-pinch',profile='flowSoft'){
 if(!AJ_ROADS.includes(road)||!Object.hasOwn(AW_PROFILES,profile))
  throw Error('AW unsupported protected road2 candidate');
 const base=generateG4E7AV(road,'lineSoft'),raw=generateG4E7AS(road),
  frozen=JSON.stringify(base),cfg=AW_PROFILES[profile],
  doc=structuredClone(base),old=base.surfaces[1],s=doc.surfaces[1],
  original=raw.surfaces[1],rows=[];
 if(doc.surfaces.length!==7||doc.movingObstacles.length!==28||
    base.stageForge.g4e7avStudy?.grade!=='lineSoft'||
    !eq(old.points.slice(0,5),original.points.slice(0,5))||
    !eq(old.points.slice(-5),original.points.slice(-5)))
   throw Error('AW requires actual intact 2nd B48 AT CROWN/CHASM');
 let max3d=0,maxPlanar=0,maxVertical=0;
 for(let k=0;k<old.rows;k++){
  const c=k*old.cols+2,a=old.points[c],b=original.points[c],u=k/(old.rows-1),
   sideScale=u<.46?(cfg.crownSideScale??cfg.sideScale):cfg.sideScale,
   verticalScale=u<.46?(cfg.crownVerticalScale??cfg.verticalScale):cfg.verticalScale,
   delta=[(b[0]-a[0])*(1-sideScale),
    (b[1]-a[1])*(1-verticalScale),
    (b[2]-a[2])*(1-sideScale)];
  if(Math.hypot(...delta)<1e-8)continue;
  rows.push(k);
  max3d=Math.max(max3d,Math.hypot(...delta));
  maxPlanar=Math.max(maxPlanar,Math.hypot(delta[0],delta[2]));
  maxVertical=Math.max(maxVertical,Math.abs(delta[1]));
  for(let j=0;j<old.cols;j++)s.points[k*old.cols+j]=old.points[k*old.cols+j].map((v,i)=>v+delta[i]);
 }
 // An authoring guide follows the actual new collision geometry; it does
 // not add road support, snap steering or change the engine physics.
 for(let k=0;k<22;k++)doc.route[22+k]=sample(s,(k+.015)/22,.5);
 const relocated=base.stageForge.g4e7atStudy.actualMovingObstaclesRelocated;
 if(relocated.length!==4)throw Error('AW expected 4 original physical machines');
 const changes=[];
 for(const {id,u} of relocated){
  const index=doc.movingObstacles.findIndex(o=>o.id===id);
  if(index<0)throw Error('AW physical moving B51 missing '+id);
  const previous=base.movingObstacles[index],oldAt=sample(old,u,.5),nextAt=sample(s,u,.5),
   beforeSide=side(old,u),afterSide=side(s,u),
   offset=(previous.position[0]-oldAt[0])*beforeSide[0]+(previous.position[2]-oldAt[2])*beforeSide[2],
   position=[nextAt[0]+afterSide[0]*offset,
    nextAt[1]+previous.position[1]-oldAt[1],
    nextAt[2]+afterSide[2]*offset],
   yaw=angle(beforeSide,afterSide);
  doc.movingObstacles[index]=validateMovingObstacle({...previous,position,
   yawDegrees:clamp(previous.yawDegrees+yaw,-360,360),
   motion:previous.type==='slider'?{...previous.motion,axis:afterSide}:previous.motion});
  changes.push({id,u,meters:+l(position,previous.position).toFixed(3),yawDeltaDegrees:+yaw.toFixed(3)});
 }
 const core=base.stageForge.g4e7atStudy.moduleSpans.map(span=>{
  let low=Infinity,high=0,baselineDiff=0;
  for(let k=0;k<=64;k++){
   const u=span.u1+(span.u2-span.u1)*k/64,
    a=l(sample(s,u,0),sample(s,u,1)),
    b=l(sample(old,u,0),sample(old,u,1));
   low=Math.min(low,a);high=Math.max(high,a);
   baselineDiff=Math.max(baselineDiff,Math.abs(a-b));
  }
  return {id:span.id,minMeters:+low.toFixed(3),maxMeters:+high.toFixed(3),
   maxWidthDifferenceFromAVMeters:+baselineDiff.toFixed(6),
   originalNarrowArcMeters:span.narrowCoreArcMeters};
 });
 const changed=new Set(relocated.map(x=>x.id));
 const tests={
  actualUpdatedRoad:rows.length>=14&&maxPlanar>5&&maxVertical>6,
  unchangedWholeFirstRoad:eq(doc.surfaces[0],base.surfaces[0]),
  unchangedLastFiveRoads:eq(doc.surfaces.slice(2),base.surfaces.slice(2)),
  physicalSurfaceWellFormed:tessellate(s).degenerate===0,
  stillTwoNarrowModules:core.length===2&&core.every(x=>x.minMeters>11&&x.maxMeters<17.5&&x.maxWidthDifferenceFromAVMeters<.0001),
  unchangedEnds:eq(old.points.slice(0,5),s.points.slice(0,5))&&
   eq(old.points.slice(-5),s.points.slice(-5)),
  unchangedRealVoidCell52:eq(s.voidLongitudinalCells,old.voidLongitudinalCells)&&eq(doc.surfaces[0].voidLongitudinalCells,[52]),
  preserveExistingSpawns:eq(doc.spawns,base.spawns),
  preserveOtherRoutes:eq(doc.route.slice(0,22),base.route.slice(0,22))&&eq(doc.route.slice(44),base.route.slice(44)),
  preserveSegments:eq(doc.routeSegments,base.routeSegments),
  fourRealB51Follow:changes.length===4&&changes.every(x=>x.meters>.25),
  other24NativeMoversFrozen:eq(doc.movingObstacles.filter(x=>!changed.has(x.id)),
   base.movingObstacles.filter(x=>!changed.has(x.id))),
  originalStageUnmodified:JSON.stringify(base)===frozen,
  realSevenRoads:doc.surfaces.length===7,
  realTwentyEightMachines:doc.movingObstacles.length===28,
  stillPrivate:base.stageForge.productionPromoted===false
 };
 const failed=Object.entries(tests).filter(([,ok])=>!ok).map(([x])=>x);
 if(failed.length)throw Error('AW real B48/B51 preservation: '+failed.join(', ')+
  ' | '+JSON.stringify({core,changes,rows,maxPlanar,maxVertical}));
 doc.name='G4E-7AW '+profile+' physical 2nd-road preserved thin corridor / NOT APPROVED';
 doc.stageForge={...doc.stageForge,
  revision:'W9C2-G4E7AW-'+profile.toUpperCase(),
  recordStageId:'VB-P101-A13-W9C2-G4E7AW-'+road.toUpperCase()+'-'+profile.toUpperCase(),
  productionPromoted:false,
  g4e7awStudy:{id:'physical-road2-flow',road,profile,source:'G4E7AV_LINESOFT',
   inputShapeScales:cfg,modifiedPhysicalRows:rows,
   maximumPhysicalCenterlineCorrectionMeters:+max3d.toFixed(3),
   maximumPlanarCorrectionMeters:+maxPlanar.toFixed(3),
   maximumVerticalCorrectionMeters:+maxVertical.toFixed(3),
   actualB48CoreWidths:core,relocatedNativeMovingB51:changes,
   preservedOtherB51Count:24,originalGapCell52:true,
   originalSevenRoads:true,original28NativeMoving:true,
   testResult:'UNTESTED',certifiedSlope2Meters:0,
   humanFairness:'HOLD',art:'HOLD',publish:'HOLD'}};
 return validate(doc);
}

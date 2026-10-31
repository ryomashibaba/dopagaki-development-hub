/** G4E-7AV: an actual revised first-road crest, NOT a helper collider.
 * Compare independent 3D B48 altitude profiles to prevent unintended early
 * airborne run at u~.287. Original 52nd tessellation strip remains void.
 */
import {generateG4E7AT} from './p101-w9c2-g4e7at-crown-chasm.mjs';
import {generateG4E7AA} from './p101-w9c2-g4e7aa-physical.mjs';
import {AJ_ROADS} from './p101-w9c2-g4e7aj-reanchor-moving.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
import {validateMovingObstacle} from '../private/reference_only/director/moving/moving-obstacles.mjs';
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const wave=(u,a,b)=>u>a&&u<b?Math.sin(Math.PI*(u-a)/(b-a))**2:0;
export const AV_GRADES=Object.freeze({
  crestSoft:Object.freeze({asCrest:1,r2Crest:0}),
  approachSoft:Object.freeze({asCrest:1,r2Crest:.6}),
  levelApproach:Object.freeze({asCrest:1,r2Crest:1}),
  lineSoft:Object.freeze({asCrest:1,r2Crest:.65,lateralEase:.7}),
  lineLevel:Object.freeze({asCrest:1,r2Crest:1,lateralEase:1})
});
export function generateG4E7AV(road='true-pinch',grade='crestSoft'){
 if(!AJ_ROADS.includes(road)||!Object.hasOwn(AV_GRADES,grade))
  throw Error('AV unknown protected B48 candidate');
 const base=generateG4E7AT(road),frozen=JSON.stringify(base),doc=structuredClone(base),
  old=base.surfaces[0],s=doc.surfaces[0],cfg=AV_GRADES[grade],
  originalCenterline=cfg.lateralEase?generateG4E7AA(.7,'landing-soft').surfaces[0]:null;
 const changed=[];let maxHeightDelta=0;
 for(let row=0;row<31;row++){
  const u=row/30;
  const asHeight=8.5*wave(u,.24,.435),
   r2Height=12*wave(u,.10,.51),
   delta=-(cfg.asCrest*asHeight+cfg.r2Crest*r2Height),
   center=old.points[row*5+2],originalCenter=originalCenterline?.points[row*5+2],
   lateral=originalCenter?[
    (originalCenter[0]-center[0])*cfg.lateralEase,
    0,(originalCenter[2]-center[2])*cfg.lateralEase]:[0,0,0];
  if(Math.abs(delta)<1e-8&&Math.hypot(...lateral)<1e-8)continue;
  changed.push(row);maxHeightDelta=Math.max(maxHeightDelta,Math.abs(delta));
  for(let col=0;col<5;col++){
   s.points[row*5+col][1]+=delta;
   s.points[row*5+col][0]+=lateral[0];
   s.points[row*5+col][2]+=lateral[2];
  }
 }
 for(let k=0;k<22;k++)doc.route[k]=sample(s,(k+.015)/22,.5);
 const i=doc.movingObstacles.findIndex(o=>o.id==='a13-machine-01');
 if(i<0)throw Error('AV actual moving B51-01 absent');
 const oldAnchor=sample(old,.32,.5),newAnchor=sample(s,.32,.5);
 const offset=newAnchor.map((v,j)=>v-oldAnchor[j]);
 const mover=doc.movingObstacles[i];
 doc.movingObstacles[i]=validateMovingObstacle({
  ...mover,position:mover.position.map((v,j)=>v+offset[j]),
  name:'AV physical crossing slider / flattened true approach grade'
 });
 const gap=base.stageForge.g4e7acR2Study.gap;
 const measures={trueCollider:tessellate(s).degenerate===0,
  firstRoadEarlyChanged:changed.length>=5&&maxHeightDelta>=7,
  lipExactlyUnchanged:eq(sample(s,gap.uTakeoff,.5),sample(old,gap.uTakeoff,.5)),
  landingExactlyUnchanged:eq(sample(s,gap.uLanding,.5),sample(old,gap.uLanding,.5)),
  trueCell52Gap:eq(s.voidLongitudinalCells,[52]),
  restSixPhysicalRoads:eq(doc.surfaces.slice(1),base.surfaces.slice(1)),
  allOtherMovers:eq(doc.movingObstacles.filter(o=>o.id!=='a13-machine-01'),
    base.movingObstacles.filter(o=>o.id!=='a13-machine-01')),
  unchangedSpawn:eq(doc.spawns,base.spawns),
  unchangedRouteAfterFirst:eq(doc.route.slice(22),base.route.slice(22)),
  unchangedGuideSegments:eq(doc.routeSegments,base.routeSegments),
  sevenPhysicalRoads:doc.surfaces.length===7,
  twentyEightPhysicalHazards:doc.movingObstacles.length===28,
  actualMoverReanchored:Math.hypot(...offset)>5,
  sourceImmutable:JSON.stringify(base)===frozen
 };
 const failures=Object.entries(measures).filter(([,ok])=>!ok).map(([k])=>k);
 if(failures.length)throw Error('AV protected 3D physical road invariant: '+failures.join(','));
 doc.name='G4E-7AV '+grade+' actual B48 ascent / earlier unintended airtime probe / HOLD';
 doc.stageForge={...doc.stageForge,
  revision:'W9C2-G4E7AV-'+grade.toUpperCase(),
  recordStageId:'VB-P101-A13-W9C2-G4E7AV-'+road.toUpperCase()+'-'+grade.toUpperCase(),
  productionPromoted:false,
  g4e7avStudy:{id:'real-approach-crest',road,grade,source:'G4E7AT_CROWN_CHASM',
   controls:cfg,maxHeightDeltaMeters:maxHeightDelta,
   physicalCenterlineEase:cfg.lateralEase??0,
   changedRealB48Rows:changed,reanchoredMovingB51:'a13-machine-01',
   physicalGapCell52StillOpen:true,real7Roads:true,real28Moving:true,
   automaticFullCourse:'UNVERIFIED',formalSlope2Meters:0,humanFairness:'HOLD',
   art:'HOLD',publish:'HOLD'}
 };
 return validate(doc);
}

/**
 * W9-C2 G4 / MACRO-ARC, genuine B48 31x5 1.8km road IV candidate.
 * OFFLINE ONLY: not registered in game, no website deploy, no human PASS.
 * Unlike G2/G3's short 203m S-crest, this is a continuous broad S with
 * a gentle real crest spanning the 1,800m lower-reversal chapter.
 * Re-anchor only section-IV authored moving machines (positions and slider
 * axes), retaining all 28 real B51-C colliders, types and timing.
 */
import {generateP101A13W7Candidate} from './p101-a13-w7-gameplay-build.mjs';
import {P95_HAZARD_SPECS} from '../web/p95-hazard-layout.mjs';
import {A13_HAZARD_SPECS} from '../web/p101-a13-hazard-layout.mjs';
import {sample,frame,tessellate,validate} from '../private/reference_only/director/surface.js';
import {normalizeMovingObstacles} from '../private/reference_only/director/moving/moving-obstacles.mjs';
export const G4_SECTION=3;
export const G4_ARC_LENGTH_METERS=1800;
export const G4_MACRO_VARIANTS=Object.freeze({
 sweep:Object.freeze({id:'sweep',recordStageId:'VB-P101-A13-W9C2-G4-SWEEP',
  lateralMeters:78,crestMeters:15,bankMeters:2,minimumWidthMeters:83}),
 skyline:Object.freeze({id:'skyline',recordStageId:'VB-P101-A13-W9C2-G4-SKYLINE',
  lateralMeters:110,crestMeters:23,bankMeters:3.5,minimumWidthMeters:75})
});
const dot=(a,b)=>a.reduce((sum,x,i)=>sum+x*b[i],0);
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const add=(a,b)=>a.map((x,i)=>x+b[i]);
const mul=(a,k)=>a.map(x=>x*k);
const unit=a=>mul(a,1/(Math.hypot(...a)||1));
const clamp=x=>Math.max(0,Math.min(1,x));
const field=t=>Math.sin(Math.PI*t)**2;
const START=.06,END=.94;
export function g4Shape(u,kind='sweep'){
 const c=G4_MACRO_VARIANTS[kind];if(!c||!Number.isFinite(u)||u<0||u>1)throw Error('G4 declared variant/u required');
 if(u<=START||u>=END)return {active:false,lateral:0,rise:0,bank:0,widthWeight:0};
 const t=(u-START)/(END-START),envelope=field(t);
 return {active:true,lateral:c.lateralMeters*Math.sin(2*Math.PI*t)*envelope,
  rise:c.crestMeters*envelope,
  bank:c.bankMeters*Math.sin(2*Math.PI*t)*envelope,
  widthWeight:envelope};
}
function tangent(s,u){
 const a=sample(s,Math.max(0,u-.003),.5),b=sample(s,Math.min(1,u+.003),.5);
 return unit([b[0]-a[0],0,b[2]-a[2]]);
}
function rotateHorizontal(v,oldForward,newForward){
 const oldAngle=Math.atan2(oldForward[2],oldForward[0]);
 const newAngle=Math.atan2(newForward[2],newForward[0]);
 const d=newAngle-oldAngle,c=Math.cos(d),s=Math.sin(d);
 return [v[0]*c-v[2]*s,v[1],v[0]*s+v[2]*c];
}
export function generateW9C2G4MacroArc(kind='sweep'){
 const c=G4_MACRO_VARIANTS[kind];if(!c)throw Error('G4 exact candidate required');
 const doc=generateP101A13W7Candidate();
 if(doc.surfaces.length!==7||doc.movingObstacles.length!==28||
  doc.stageForge.recordStageId!=='VB-P101-A13-W7F'||doc.stageForge.nominalLengthMeters!==7280)
  throw Error('G4 requires frozen 7-road W7F 28-body Gold');
 const s=doc.surfaces[G4_SECTION],old=structuredClone(s),changed=[];
 if(s.rows!==31||s.cols!==5||!s.rideable||!s.collidable)throw Error('G4 requires real 31x5 road');
 for(let row=0;row<31;row++){
  const u=row/30,shape=g4Shape(u,kind);if(!shape.active)continue;
  const center=old.points[row*5+2],before=old.points[Math.max(0,row-1)*5+2],
   after=old.points[Math.min(30,row+1)*5+2];
  const dir=unit([after[0]-before[0],0,after[2]-before[2]]);
  const side=[-dir[2],0,dir[0]];
  const fullWidth=Math.hypot(...sub(old.points[row*5],old.points[row*5+4]));
  const desired=fullWidth+(c.minimumWidthMeters-fullWidth)*shape.widthWeight;
  const ratio=desired/fullWidth;
  if(!(ratio>.25&&ratio<=1.001))throw Error('G4 invalid width');
  for(let j=0;j<5;j++){
   const p=old.points[row*5+j];
   const narrowed=add(center,mul(sub(p,center),ratio));
   const next=add(narrowed,add(mul(side,shape.lateral),[0,shape.rise+(j-2)*shape.bank/2,0]));
   s.points[row*5+j]=next;
  }
  changed.push(row);
 }
 if(changed.length<20)throw Error('G4 macro window unexpectedly short');
 // Retarget exactly the 3 old P95 and 3 A13 section-IV machines; keep
 // their real physical sizes, collision modes, periods and motion phases.
 const stationList=[
  ...P95_HAZARD_SPECS.map((v,i)=>({i,section:v[0],u:v[1]})),
  ...A13_HAZARD_SPECS.map((v,i)=>({i:12+i,section:v[0],u:v[1]}))
 ].filter(x=>x.section===G4_SECTION);
 if(stationList.length!==6)throw Error('G4 section-IV machine count mismatch');
 for(const station of stationList){
  const ob=doc.movingObstacles[station.i],at=sample(s,station.u,.5),
   was=sample(old,station.u,.5),offset=sub(at,was);
  ob.position=add(ob.position,offset);
  if(ob.type==='slider')
   ob.motion.axis=rotateHorizontal(ob.motion.axis,tangent(old,station.u),tangent(s,station.u));
  // Other motion and collision attributes are unchanged.
 }
 doc.movingObstacles=normalizeMovingObstacles({movingObstacles:doc.movingObstacles});
 // Reconstruct native route guide only for changed chapter; preserve all
 // 6 true canonical starts, no synthetic spawn or player force override.
 const oldRoute=structuredClone(doc.route);
 for(let i=0;i<22;i++)doc.route[G4_SECTION*22+i]=sample(s,(i+.015)/22,.5);
 if(tessellate(s).degenerate!==0)throw Error('G4 real collision lattice degenerates');
 doc.name='W9-C2 G4 '+kind.toUpperCase()+' 1800m MACRO-ARC OFFLINE PHYSICAL HOLD';
 doc.stageForge={...doc.stageForge,revision:'W9C2-G4-'+kind.toUpperCase(),
  recordStageId:c.recordStageId,selectedTrial:'w9c2-g4-macro-'+kind,
  status:'G4_OFFLINE_1800M_TRUE_PHYSICAL_MACRO_ARC_HOLD',
  fullStartToFinish:'NOT_VERIFIED_G4',nativeScriptedProof:null,
  studyOnly:'OFFLINE_NOT_REGISTERED_IN_GAME',
  humanPlaytest:'NOT_RUN',fairness:'NOT_APPROVED',productionPromoted:false,
  g4MacroArcStudy:{section:G4_SECTION,nominalSectionLengthMeters:G4_ARC_LENGTH_METERS,
   realB48Surface:true,changedControlRows:changed.length,
   deformationWindow:[START,END],lateralScaleMeters:c.lateralMeters,
   crestMeters:c.crestMeters,minimumWidthTargetMeters:c.minimumWidthMeters,
   reanchoredNativeMachineIds:stationList.map(x=>doc.movingObstacles[x.i].id),
   all28MachineBodiesPresent:true,machinePositionsIntentionallyChanged:true,
   originalMachineTimingAndCollisionModesPreserved:true,
   originalRouteOutsideChapterPreserved:doc.route.every((v,i)=>
    i>=G4_SECTION*22&&i<(G4_SECTION+1)*22||v.every((x,k)=>x===oldRoute[i][k])),
   realGapAndLandingImplemented:false,
   slopeDnaMetersCounted:0}};
 return validate(doc);
}

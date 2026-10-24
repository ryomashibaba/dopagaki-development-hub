/**
 * W9-C2 G4E-7M / TRUE B48 physical narrow-road experiment.
 * A new independent branch from the earlier G4E-7F GLIDE full-7/7 candidate.
 * No helper collider, gap patch, auto steer, extra safe floor or camera edits.
 * THIS IS NOT an approved race course: 10-16m core width requires human QA.
 */
import {generateG4E7FEarlyPhysicalCandidate} from './p101-w9c2-g4e7f-real-slope-build.mjs';
import {generateP101A13W7Candidate} from './p101-a13-w7-gameplay-build.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
export const G4E7M_STAGE='VB-P101-A13-W9C2-G4E7M-';
export const G4E7M_VARIANTS=Object.freeze({
 thread:Object.freeze({id:'thread',widthMeters:15.4,heightMeters:-4.8,bankMeters:1.1,
  curveMeters:1.2}),
 precipice:Object.freeze({id:'precipice',widthMeters:13.1,heightMeters:-11.5,
  bankMeters:2.3,curveMeters:3.5})
});
export const G4E7M_B48_WINDOWS=Object.freeze([
 Object.freeze({id:'SKYLINE_NEEDLE',section:0,nominalRoadMeters:600,
  u0:.31,u1:.405,u2:.595,u3:.735}),
 Object.freeze({id:'CROWN_CUT',section:1,nominalRoadMeters:1500,
  u0:.055,u1:.133,u2:.205,u3:.305})
]);
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const mul=(a,s)=>a.map(x=>x*s);
const add=(a,b)=>a.map((x,i)=>x+b[i]);
const distance=(a,b)=>Math.hypot(...sub(a,b));
const smooth=x=>x*x*(3-2*x);
export function g4e7mProfile(u,w){
 if(!Number.isFinite(u)||u<0||u>1)throw Error('G4E7M normalized u required');
 if(u<=w.u0||u>=w.u3)return 0;
 if(u>=w.u1&&u<=w.u2)return 1;
 return u<w.u1?smooth((u-w.u0)/(w.u1-w.u0)):
  smooth((w.u3-u)/(w.u3-w.u2));
}
function compare(a,b){return JSON.stringify(a)===JSON.stringify(b);}
export function generateG4E7MPhysical(variant='thread',{visualSpawns=false}={}){
 if(!Object.hasOwn(G4E7M_VARIANTS,variant))throw Error('G4E7M enumerated physical candidate only');
 const plan=G4E7M_VARIANTS[variant];
 const gold=generateP101A13W7Candidate(),baseline=generateG4E7FEarlyPhysicalCandidate('glide');
 const doc=structuredClone(baseline);
 if(gold.surfaces.length!==7||baseline.surfaces.length!==7||
  gold.movingObstacles.length!==28||baseline.movingObstacles.length!==28||
  baseline.spawns.length<1||baseline.route.length!==155||
  baseline.stageForge.g4e7fPhysicalStudy?.variant!=='glide')
  throw Error('G4E7M requires frozen actual 7-road G4E7F GLIDE');
 const changes=[];
 for(const w of G4E7M_B48_WINDOWS){
  const s=doc.surfaces[w.section],original=baseline.surfaces[w.section];
  if(s.rows!==31||s.cols!==5||!s.collidable||!s.rideable||
   s.voidLongitudinalCells?.length)throw Error('G4E7M requires genuine intact B48');
  const old=original.points;let rows=0;
  for(let r=0;r<s.rows;r++){
   const u=r/(s.rows-1),weight=g4e7mProfile(u,w);
   if(!weight)continue;
   const center=old[r*5+2],before=old[Math.max(0,r-1)*5+2],
    after=old[Math.min(s.rows-1,r+1)*5+2];
   const heading=sub(after,before),horizontal=Math.hypot(heading[0],heading[2]);
   if(horizontal<.001)throw Error('G4E7M cannot derive real B48 tangent');
   const across=[-heading[2]/horizontal,0,heading[0]/horizontal];
   const width=distance(old[r*5],old[r*5+4]);
   if(width<plan.widthMeters+5)throw Error('G4E7M baseline road too narrow to cut');
   const fraction=(1-weight)+weight*plan.widthMeters/width;
   const progress=(u-w.u0)/(w.u3-w.u0);
   // No hard reset, no snap. Smooth two-half-wave vertical S + nonzero bank.
   const bend=weight*plan.curveMeters*Math.sin(2*Math.PI*progress);
   const elevation=weight*plan.heightMeters*Math.sin(Math.PI*progress);
   for(let j=0;j<5;j++){
    const q=old[r*5+j];
    const pt=add(add(center,mul(sub(q,center),fraction)),
      add(mul(across,bend),[0,elevation+weight*plan.bankMeters*(j-2)/2,0]));
    if(!pt.every(Number.isFinite))throw Error('G4E7M nonfinite B48 point');
    s.points[r*5+j]=pt;
   }
   rows++;
  }
  if(rows<7||tessellate(s).degenerate!==0)
   throw Error('G4E7M must modify >=7 true collision rows with no degeneracy');
  for(let k=0;k<22;k++)doc.route[w.section*22+k]=sample(s,(k+.015)/22,.5);
  let minWidth=Infinity,maxElevationDelta=0,plateau=0;
  for(let k=0;k<=240;k++){
   const u=k/240;
   const width=distance(sample(s,u,0),sample(s,u,1));
   if(!(width>10))throw Error('G4E7M interpolated physical collapse');
   if(u>=w.u1&&u<=w.u2){
    plateau++;minWidth=Math.min(minWidth,width);
   }
   maxElevationDelta=Math.max(maxElevationDelta,Math.abs(
    sample(s,u,.5)[1]-sample(original,u,.5)[1]));
  }
  if(plateau<5||minWidth<11.5||minWidth>16.0||
   maxElevationDelta<Math.abs(plan.heightMeters)*.45)
   throw Error('G4E7M physical thin-road/hill metrics not meaningful');
  changes.push({id:w.id,section:w.section,originalSectionId:s.id,
   sectionNominalMeters:w.nominalRoadMeters,
   affectedEnvelopeNominalMeters:Number(((w.u3-w.u0)*w.nominalRoadMeters).toFixed(1)),
   nominalNarrowCoreMeters:Number(((w.u2-w.u1)*w.nominalRoadMeters).toFixed(1)),
   minPlateauWidthMeters:Number(minWidth.toFixed(2)),
   maxAdditionalElevationMeters:Number(maxElevationDelta.toFixed(2)),
   modifiedControlRows:rows,realB48Collider:true,addedRideableArea:0});
 }
 if(!compare(doc.spawns,baseline.spawns)||!compare(doc.movingObstacles,baseline.movingObstacles)||
  !compare(doc.routeSegments,baseline.routeSegments)||
  doc.surfaces.slice(2).some((s,i)=>!compare(s,baseline.surfaces[i+2]))||
  doc.route.slice(44).some((r,i)=>!compare(r,baseline.route[i+44])))
  throw Error('G4E7M modified original spawns, 28 machines, or outside 2 windows');
 const id=G4E7M_STAGE+variant.toUpperCase();
 const initialSpawns=doc.spawns.length;
 if(visualSpawns)for(const w of G4E7M_B48_WINDOWS){
  const u=w.section===0?.52:.15; // same normalized B48 u as existing Gold/GLIDE private viewpoints
  doc.spawns.push({name:'G4E-7M '+w.id+' TRUE 13–16m ROAD / PRIVATE VIEW ONLY',
   surface:doc.surfaces[w.section].id,u,v:.5});
 }
 doc.name='G4E-7M '+variant.toUpperCase()+' / TRUE B48 NARROW 13–16M ROAD / PRIVATE HOLD';
 doc.stageForge={...doc.stageForge,revision:'W9C2-G4E7M-'+variant,
  recordStageId:id,productionPromoted:false,gameAutoSteering:false,
  humanPlaytest:'NOT_RUN',fairness:'HOLD',studyOnly:'PRIVATE_REAL_PHYSICS_NOT_APPROVED',
  nativeScriptedProof:null,fullStartToFinish:'PENDING_INDEPENDENT_NATIVE_QA',
  g4e7mRealRoad:{
   variant,source:'G4E7F_GLIDE_GENUINE_B48',realCollisionRoads:7,
   movingObstacles:28,physicsControlPointsChanged:true,
   baselinePhysics300mStillPresent:true,originalGoldUntouched:true,
   windows:changes,addedRoads:0,addedPlatforms:0,addedSteeringAssist:0,
   createdVisualSpawns:visualSpawns?2:0,originalSpawns:initialSpawns,
   totalNominalNarrowCoreMeters:Number(changes.reduce((a,c)=>a+c.nominalNarrowCoreMeters,0).toFixed(1)),
   humanPlayability:'HOLD',certifiedSlopeDnaMeters:0,publish:'HOLD'}};
 return validate(doc);
}

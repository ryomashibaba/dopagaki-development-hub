/**
 * G4E-7T independent GAMEPLAY geometry: authentic second narrow B48 neck and
 * early open gaps BEFORE the G4E-7R naturally airborne late-descent.
 * Gold / G4E-7R/Q and B51-C 28 machines unchanged. Never auto-approve.
 */
import {generateG4E7RPhysical} from './p101-w9c2-g4e7r-grade-build.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
import {compile,contacts} from '../private/reference_only/director/collision.js';

export const G4E7T_VARIANTS=Object.freeze(['solid','early','late']);
export const G4E7T_FEATURE=Object.freeze({
 section:0,u0:.43,u3:.77,coreTargetMeters:13.6,
 gaps:Object.freeze({early:Object.freeze({center:.605,cells:2}),
  late:Object.freeze({center:.667,cells:2})})
});
const sub=(a,b)=>a.map((v,i)=>v-b[i]),add=(a,b)=>a.map((v,i)=>v+b[i]),
 mul=(a,k)=>a.map(v=>v*k),len=(a,b)=>Math.hypot(...sub(a,b));
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const smooth=(u,a,b)=>{const t=(u-a)/(b-a);return u<=a||u>=b?0:Math.sin(Math.PI*t)**2;};
export function generateG4E7TPhysical(variant='early',{inspectionSpawns=false}={}){
 if(!G4E7T_VARIANTS.includes(variant))throw Error('G4E-7T enumerated real physical candidates only');
 const old=generateG4E7RPhysical('sweep'),doc=structuredClone(old),
  road=doc.surfaces[0],baseline=old.surfaces[0],w=G4E7T_FEATURE;
 if(road.rows!==31||road.cols!==5||road.resolution!==3||doc.surfaces.length!==7||
  doc.movingObstacles.length!==28||road.voidLongitudinalCells?.length)
  throw Error('G4E-7T requires intact 31x5 real B48 R-SWEEP source');
 let changed=0;
 for(let r=0;r<31;r++){
  const u=r/30,f=smooth(u,w.u0,w.u3);
  if(f<=1e-8)continue;
  const center=baseline.points[r*5+2],
   physicalWidth=len(baseline.points[r*5+4],baseline.points[r*5]),
   ratio=(physicalWidth*(1-f)+w.coreTargetMeters*f)/physicalWidth;
  if(physicalWidth<14)throw Error('G4E-7T inherited neck already narrow');
  for(let j=0;j<5;j++)road.points[r*5+j]=add(center,mul(sub(baseline.points[r*5+j],center),ratio));
  changed++;
 }
 if(changed<7||tessellate(road).degenerate!==0)
  throw Error('G4E-7T unable to sculpt genuine earlier B48 waist');
 for(let i=0;i<22;i++)doc.route[i]=sample(road,(i+.015)/22,.5);
 let minWidth=Infinity;
 for(let i=0;i<=240;i++){
  const u=i/240,d=len(sample(road,u,0),sample(road,u,1));
  if(d<10)throw Error('G4E-7T sub-10m pinched collision deck');
  if(u>=.56&&u<=.70)minWidth=Math.min(minWidth,d);
 }
 if(!(minWidth>11&&minWidth<22))throw Error('G4E-7T missing real narrow route');
 let gap=null;
 if(variant!=='solid'){
  const plan=w.gaps[variant],total=(road.rows-1)*road.resolution,
   first=Math.floor(plan.center*total-plan.cells/2),
   cells=Array.from({length:plan.cells},(_,i)=>first+i);
  road.voidLongitudinalCells=cells;
  const uTakeoff=first/total,uLanding=(first+plan.cells)/total,
   p0=sample(road,uTakeoff,.5),p1=sample(road,uLanding,.5),
   middle=sample(road,(uTakeoff+uLanding)/2,.5),
   meters=len(p0,p1);
  if(meters<3||meters>22||tessellate(road).degenerate!==0)
   throw Error('G4E-7T real two-cell B48 gap invalid');
  if(contacts(compile(doc),[middle[0],middle[1]+.65,middle[2]],.65)
   .some(c=>c.triangle.rideable))
   throw Error('G4E-7T hidden collision floor across actual gap');
  gap={cells,physicalTwoCellVoid:true,uTakeoff,uLanding,
   takeoffXYZ:p0,landingXYZ:p1,gapMeters:Number(meters.toFixed(3)),
   widthAtLipMeters:Number(len(sample(road,uTakeoff,0),sample(road,uTakeoff,1)).toFixed(2)),
   nativeJumpCausation:'UNTESTED',nativeLandingVerified:false,
   humanFairness:'HOLD'};
 }
 if(!eq(doc.movingObstacles,old.movingObstacles)||!eq(doc.surfaces.slice(1),old.surfaces.slice(1))||
  !eq(doc.routeSegments,old.routeSegments)||!eq(doc.spawns,old.spawns)||
  !eq(doc.route.slice(22),old.route.slice(22)))
  throw Error('G4E-7T accidentally altered R, Gold, other roads or 28 machines');
 const originalSpawnCount=doc.spawns.length;
 if(inspectionSpawns)for(const [u,name] of [[.53,'APPROACH'],[.68,'LANDING']])
  doc.spawns.push({name:'G4E-7T '+name+' / PRIVATE VIEW ONLY',
   surface:road.id,u,v:.5});
 doc.name='G4E-7T '+variant.toUpperCase()+' B48 true 13.6m neck and early gap / HUMAN HOLD';
 doc.stageForge={...doc.stageForge,revision:'W9C2-G4E7T-'+variant,
  recordStageId:'VB-P101-A13-W9C2-G4E7T-'+variant.toUpperCase(),
  productionPromoted:false,humanPlaytest:'NOT_RUN',
  g4e7tStudy:{variant,source:'INDEPENDENT_G4E7R_SWEEP_CLONE',realB48:true,
   realRoads:7,movingMachines:28,extraNeckRows:changed,
   actualNarrowWidthMeters:Number(minWidth.toFixed(2)),gap,
   originalSpawnCount,inspectionSpawns:inspectionSpawns?2:0,
   nativeAirProof:'NOT_RUN',nativeRejoinProof:'NOT_RUN',
   noFloorNoBoostNoAutoAssist:true,originalCamera:true,
   certifiedSlope2Meters:0,publish:'HOLD'}};
 return validate(doc);
}

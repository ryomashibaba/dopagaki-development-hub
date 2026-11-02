/**
 * G4E-7R: isolated redesign of G4E-7Q's obstructive crest/landing.
 * Keep the REAL B48 narrowing and optional one-strip collision gap.
 * A gentler, long-form sightline replaces the sudden wave wall near the lip.
 * Gold, GLIDE, Q and all 28 moving obstacles remain byte-identical.
 */
import {generateG4E7FEarlyPhysicalCandidate} from './p101-w9c2-g4e7f-real-slope-build.mjs';
import {sample,tessellate,validate,frame} from '../private/reference_only/director/surface.js';
import {compile,contacts} from '../private/reference_only/director/collision.js';

export const G4E7R_GEOMETRY=Object.freeze({
 section:0,u0:.64,u3:.96,coreStart:.77,coreEnd:.86,
 targetWidth:14.8,crestAmplitude:20,descentAmplitude:34,
 lateralAmplitude:3.5,bankAmplitude:1.6,
 gapCenter:.82,gapCells:1,inspectionU:[.765,.837]
});
export const G4E7R_VARIANTS=Object.freeze(['sweep','cut']);
const add=(a,b)=>a.map((x,i)=>x+b[i]),sub=(a,b)=>a.map((x,i)=>x-b[i]);
const mul=(a,k)=>a.map(v=>v*k);
const dist=(a,b)=>Math.hypot(...sub(a,b));
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function g4e7rProfile(u){
 if(!Number.isFinite(u)||u<0||u>1)throw Error('G4E-7R u outside unit range');
 const w=G4E7R_GEOMETRY;
 if(u<=w.u0||u>=w.u3)return {weight:0,vertical:0,lateral:0,bank:0};
 const t=(u-w.u0)/(w.u3-w.u0),weight=Math.sin(Math.PI*t)**2;
 return {weight,vertical:weight*(w.crestAmplitude-w.descentAmplitude*t),
  lateral:w.lateralAmplitude*Math.sin(2*Math.PI*t)*weight,
  bank:w.bankAmplitude*Math.sin(2*Math.PI*t)*weight};
}
export function generateG4E7RPhysical(variant='sweep',{inspectionSpawns=false}={}){
 if(!G4E7R_VARIANTS.includes(variant))throw Error('G4E-7R enumerated variant only');
 const baseline=generateG4E7FEarlyPhysicalCandidate('glide'),doc=structuredClone(baseline);
 const w=G4E7R_GEOMETRY,road=doc.surfaces[0],orig=baseline.surfaces[0];
 if(doc.stageForge.g4e7fPhysicalStudy?.variant!=='glide'||doc.surfaces.length!==7||
  doc.movingObstacles.length!==28||road.rows!==31||road.cols!==5||
  road.resolution!==3||!road.collidable||!road.rideable||road.voidLongitudinalCells?.length)
  throw Error('G4E-7R requires original seven B48 GLIDE, 28 machines');
 let rows=0,maxVertical=0;
 for(let r=0;r<31;r++){
  const u=r/30,f=g4e7rProfile(u);
  if(!f.weight)continue;
  const center=orig.points[r*5+2],before=orig.points[Math.max(0,r-1)*5+2],
   after=orig.points[Math.min(30,r+1)*5+2],direction=sub(after,before),
   horizontal=Math.hypot(direction[0],direction[2]);
  if(horizontal<.001)throw Error('G4E-7R valid tangent required');
  const across=[-direction[2]/horizontal,0,direction[0]/horizontal];
  const actualWidth=dist(orig.points[r*5],orig.points[r*5+4]);
  if(actualWidth<=w.targetWidth+5)throw Error('G4E-7R cannot narrow baseline');
  const widthRatio=(actualWidth*(1-f.weight)+w.targetWidth*f.weight)/actualWidth;
  for(let j=0;j<5;j++){
   const old=orig.points[r*5+j];
   const point=add(add(center,mul(sub(old,center),widthRatio)),
    add(mul(across,f.lateral),[0,f.vertical+f.bank*(j-2)/2,0]));
   if(point.some(x=>!Number.isFinite(x)||Math.abs(x)>2000))
    throw Error('G4E-7R nonfinite road point');
   road.points[r*5+j]=point;
   maxVertical=Math.max(maxVertical,Math.abs(point[1]-old[1]));
  }
  rows++;
 }
 if(rows<6||maxVertical<5||tessellate(road).degenerate!==0)
  throw Error('G4E-7R real B48 elevation invalid');
 for(let i=0;i<22;i++)doc.route[i]=sample(road,(i+.015)/22,.5);
 let minCore=Infinity,finiteNormals=true;
 for(let i=0;i<=240;i++){
  const u=i/240,width=dist(sample(road,u,0),sample(road,u,1));
  if(width<=10)throw Error('G4E-7R physical deck collapse');
  if(u>=w.coreStart&&u<=w.coreEnd)minCore=Math.min(minCore,width);
  if(!frame(road,u,.5).normal.every(Number.isFinite))finiteNormals=false;
 }
 if(!(minCore>11&&minCore<22)||!finiteNormals)
  throw Error('G4E-7R actual narrow B48 width or surface normal invalid');
 let gap=null;
 if(variant==='cut'){
  const nu=90,first=Math.floor(w.gapCenter*nu-w.gapCells/2),
   cells=Array.from({length:w.gapCells},(_,i)=>first+i);
  if(cells[0]<3||cells.at(-1)>=nu-3)throw Error('G4E-7R invalid B48 cut');
  road.voidLongitudinalCells=cells;
  const uTakeoff=first/nu,uLanding=(first+cells.length)/nu,
   p0=sample(road,uTakeoff,.5),p1=sample(road,uLanding,.5),
   gapMeters=dist(p0,p1),mid=sample(road,(uTakeoff+uLanding)/2,.5);
  if(!(gapMeters>2&&gapMeters<20)||tessellate(road).degenerate!==0)
   throw Error('G4E-7R failed to cut genuine physical strip');
  const support=contacts(compile(doc),[mid[0],mid[1]+.65,mid[2]],.65)
   .filter(c=>c.triangle.rideable);
  if(support.length)throw Error('G4E-7R hidden support under gap');
  gap={actualB48MissingCells:true,cells,uTakeoff,uLanding,
   takeoffXYZ:p0,landingXYZ:p1,gapMeters:Number(gapMeters.toFixed(3)),
   verticalChangeMeters:Number((p1[1]-p0[1]).toFixed(3)),
   missingRideableMidSupport:true,nativeAirborneConfirmed:false,
   nativeLandingConfirmed:false};
 }
 // The first G4E7F window is intentionally retained; the redesign is isolated
 // to new authored points on GLIDE road I, never to the Gold or Q geometry.
 if(!eq(doc.movingObstacles,baseline.movingObstacles)||!eq(doc.spawns,baseline.spawns)||
  !eq(doc.routeSegments,baseline.routeSegments)||
  !eq(doc.surfaces.slice(1),baseline.surfaces.slice(1))||
  !eq(doc.route.slice(22),baseline.route.slice(22)))
  throw Error('G4E-7R altered unrelated Gold/GLIDE source');
 const originalSpawns=doc.spawns.length;
 if(inspectionSpawns)for(const [i,u] of w.inspectionU.entries())
  doc.spawns.push({name:'G4E-7R '+(i===0?'APPROACH':'POST-LANDING')+' / LOCAL INSPECTION ONLY',
   surface:road.id,u,v:.5});
 doc.name='G4E-7R '+variant.toUpperCase()+' genuine narrowed B48 visible-dive study / NOT APPROVED';
 doc.stageForge={...doc.stageForge,revision:'W9C2-G4E7R-'+variant,
  recordStageId:'VB-P101-A13-W9C2-G4E7R-'+variant.toUpperCase(),
  studyOnly:'PRIVATE_INDEPENDENT_PHYSICAL_R',productionPromoted:false,
  gameAutoSteering:false,humanPlaytest:'NOT_RUN',fairness:'HOLD',
  nativeScriptedProof:null,fullStartToFinish:'UNTESTED_INDEPENDENT',
  g4e7rStudy:{variant,source:'ISOLATED_G4E7F_GLIDE_CLONE',geometryRevision:'GRADE_A',
   realB48:true,modifiedRows:rows,realRoadCount:7,movingMachines:28,
   maxVerticalDeltaMeters:Number(maxVertical.toFixed(2)),
   narrowCoreMinWidthMeters:Number(minCore.toFixed(2)),gap,
   inspectionSpawnStart:originalSpawns,createdInspectionSpawns:inspectionSpawns?2:0,
   worldCourseLengthUnchanged:true,noNewBridgeOrPlatform:true,
   physicsCameraAndForwardUnchanged:true,
   nativeTakeoffVerified:false,nativeLandingVerified:false,
   officialSlope2Meters:0,publish:'HOLD'}};
 return validate(doc);
}

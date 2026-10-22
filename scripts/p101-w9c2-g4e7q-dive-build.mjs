/**
 * G4E-7Q: two INDEPENDENT private studies on a fresh G4E7F GLIDE clone.
 * DROP: genuinely sculpted B48 descent and narrow air-road.
 * LEAP: exact same real geometry, plus one absent B48 collision/visual strip.
 * No catch-platform, auto steering, camera retune, speed reset or Gold edits.
 * Script success is not human approval. Neither candidate is published.
 */
import {generateG4E7FEarlyPhysicalCandidate} from './p101-w9c2-g4e7f-real-slope-build.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
import {compile,contacts} from '../private/reference_only/director/collision.js';

export const G4E7Q_WINDOW=Object.freeze({
 section:0,u0:.68,u3:.94,coreStart:.765,coreEnd:.855,
 targetWidthMeters:15.4,heightAmplitudeMeters:20,lateralAmplitudeMeters:6,
 bankAmplitudeMeters:2.1,nominalRoadMeters:600,
 gapCenterU:.80,gapCells:1
});
export const G4E7Q_VARIANTS=Object.freeze(['drop','leap']);
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const mul=(a,k)=>a.map(v=>v*k);
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const distance=(a,b)=>Math.hypot(...sub(a,b));
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function g4e7qField(u){
 if(!Number.isFinite(u)||u<0||u>1)throw Error('G4E-7Q valid u required');
 const w=G4E7Q_WINDOW;
 if(u<=w.u0||u>=w.u3)return {weight:0,lateral:0,vertical:0,bank:0};
 const t=(u-w.u0)/(w.u3-w.u0),weight=Math.sin(Math.PI*t)**2;
 return {weight,lateral:w.lateralAmplitudeMeters*Math.sin(2*Math.PI*t)*weight,
  vertical:w.heightAmplitudeMeters*Math.sin(2*Math.PI*t)*weight,
  bank:w.bankAmplitudeMeters*Math.sin(2*Math.PI*t)*weight};
}
export function generateG4E7QPhysical(variant='drop',{visualSpawns=false}={}){
 if(!G4E7Q_VARIANTS.includes(variant))throw Error('G4E-7Q declared variant required');
 const baseline=generateG4E7FEarlyPhysicalCandidate('glide'),doc=structuredClone(baseline);
 if(doc.surfaces.length!==7||doc.movingObstacles.length!==28||
    doc.stageForge?.g4e7fPhysicalStudy?.variant!=='glide'||doc.spawns.length<1)
  throw Error('G4E-7Q requires independent 7-road GLIDE clone and 28 B51-C machines');
 const w=G4E7Q_WINDOW,road=doc.surfaces[w.section],old=baseline.surfaces[w.section];
 if(road.rows!==31||road.cols!==5||road.resolution!==3||!road.collidable||
    !road.rideable||road.voidLongitudinalCells?.length)
  throw Error('G4E-7Q requires intact B48 31x5 / resolution-3 source road');
 let modifiedRows=0,maxDeltaY=0,minWidth=Infinity;
 for(let r=0;r<road.rows;r++){
  const u=r/(road.rows-1),f=g4e7qField(u);
  if(!f.weight)continue;
  const center=old.points[r*5+2],
   before=old.points[Math.max(0,r-1)*5+2],
   after=old.points[Math.min(road.rows-1,r+1)*5+2],
   tangent=sub(after,before),h=Math.hypot(tangent[0],tangent[2]);
  if(h<.001)throw Error('G4E-7Q missing real road tangent');
  const across=[-tangent[2]/h,0,tangent[0]/h];
  const currentWidth=distance(old.points[r*5],old.points[r*5+4]);
  if(currentWidth<=w.targetWidthMeters+2)throw Error('G4E-7Q inherited road too thin');
  const ratio=(currentWidth*(1-f.weight)+w.targetWidthMeters*f.weight)/currentWidth;
  for(let j=0;j<5;j++){
   const original=old.points[r*5+j];
   const p=add(add(center,mul(sub(original,center),ratio)),
    add(mul(across,f.lateral),[0,f.vertical+f.bank*(j-2)/2,0]));
   if(p.some(v=>!Number.isFinite(v)||Math.abs(v)>2000))throw Error('G4E-7Q real point invalid');
   road.points[r*5+j]=p;
   maxDeltaY=Math.max(maxDeltaY,Math.abs(p[1]-original[1]));
  }
  modifiedRows++;
 }
 if(modifiedRows<6||maxDeltaY<8||tessellate(road).degenerate!==0)
  throw Error('G4E-7Q crest/dive not significant or colliders degenerate');
 for(let k=0;k<22;k++)doc.route[k]=sample(road,(k+.015)/22,.5);
 for(let i=0;i<=180;i++){
  const u=i/180,v0=sample(road,u,0),v1=sample(road,u,1);
  const width=distance(v0,v1);
  if(width<10)throw Error('G4E-7Q physical road pinched or self-collapsed');
  if(u>=w.coreStart&&u<=w.coreEnd)minWidth=Math.min(minWidth,width);
 }
 if(!(minWidth>11&&minWidth<22))throw Error('G4E-7Q narrow road width invalid');
 let gap=null;
 if(variant==='leap'){
  const nu=(road.rows-1)*road.resolution,
   first=Math.floor(w.gapCenterU*nu-w.gapCells/2),
   cells=Array.from({length:w.gapCells},(_,i)=>first+i);
  if(cells[0]<3||cells.at(-1)>nu-4)throw Error('G4E-7Q gap out of bounds');
  road.voidLongitudinalCells=cells;
  const uTakeoff=first/nu,uLanding=(first+w.gapCells)/nu,
   takeoffXYZ=sample(road,uTakeoff,.5),landingXYZ=sample(road,uLanding,.5),
   midpoint=sample(road,(uTakeoff+uLanding)/2,.5),
   lengthMeters=distance(takeoffXYZ,landingXYZ);
  if(!(lengthMeters>2&&lengthMeters<20)||tessellate(road).degenerate!==0)
   throw Error('G4E-7Q no actual bounded B48 void');
  if(contacts(compile(doc),[midpoint[0],midpoint[1]+.65,midpoint[2]],.65)
    .some(c=>c.triangle.rideable))
   throw Error('G4E-7Q hidden rideable floor or bridge across real gap');
  gap={actualB48MissingStrips:true,cells,uTakeoff,uLanding,
   takeoffXYZ,landingXYZ,lengthMeters:Number(lengthMeters.toFixed(3)),
   noRideableMidpointSupport:true,physicsLandingVerified:false};
 }
 if(!same(doc.spawns,baseline.spawns)||!same(doc.movingObstacles,baseline.movingObstacles)||
  !same(doc.routeSegments,baseline.routeSegments)||
  doc.surfaces.slice(1).some((s,i)=>!same(s,baseline.surfaces[i+1]))||
  !same(doc.route.slice(22),baseline.route.slice(22)))
  throw Error('G4E-7Q changed Gold/GLIDE unrelated physical route or moving machines');
 const originalSpawns=doc.spawns.length;
 if(visualSpawns){
  for(const [u,label] of [[.735,'PRE-CREST'],[.86,'LANDING']])
   doc.spawns.push({name:'G4E-7Q '+label+' / PRIVATE VISUAL ONLY',surface:road.id,u,v:.5});
 }
 doc.name='G4E-7Q '+variant.toUpperCase()+' B48 ACTUAL DIVE / '+(gap?'OPEN GAP':'INTACT CONTROL')+' / HUMAN HOLD';
 doc.stageForge={...doc.stageForge,revision:'W9C2-G4E7Q-'+variant,
  recordStageId:'VB-P101-A13-W9C2-G4E7Q-'+variant.toUpperCase(),
  productionPromoted:false,studyOnly:'PRIVATE_B48_SCULPT_RESEARCH',
  nativeScriptedProof:null,humanPlaytest:'NOT_RUN',fairness:'HOLD',
  g4e7qStudy:{variant,source:'INDEPENDENT_G4E7F_GLIDE_CLONE',realB48:true,
   movingObstacles:28,realCollisionRoads:7,modifiedRows,
   nominalModifiedEnvelopeMeters:Number(((w.u3-w.u0)*w.nominalRoadMeters).toFixed(1)),
   maxVerticalPointDeltaMeters:Number(maxDeltaY.toFixed(2)),
   minimumMeasuredCoreWidthMeters:Number(minWidth.toFixed(2)),gap,
   createdVisualSpawns:visualSpawns?2:0,originalSpawns,
   noExtraRoadOrCatchPlatform:true,noAutoSteering:true,
   noSpeedOrCameraModification:true,trueAirborneVerified:false,
   actualRejoinVerified:false,nativeFinishVerified:false,
   officiallyApprovedSlopeDnaMeters:0,publish:'HOLD'}};
 return validate(doc);
}

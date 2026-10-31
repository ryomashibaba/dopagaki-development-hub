/**
 * G4E-7U E: tiny TRUE B48 landing-grade perturbations to ONE53.
 * Do not broaden its 14.06m lip, touch R2 or Gold, add supports, or modify
 * any camera/machine/runner law. This is an isolated nonpublished experiment.
 */
import {generateG4E7UPhysical} from './p101-w9c2-g4e7u-single-cell-build.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
import {compile,contacts} from '../private/reference_only/director/collision.js';
export const G4E7U_GRADES=Object.freeze([
 Object.freeze({id:'zero',shiftMeters:0}),
 Object.freeze({id:'down08',shiftMeters:-.8}),
 Object.freeze({id:'down16',shiftMeters:-1.6}),
 Object.freeze({id:'down24',shiftMeters:-2.4}),
 Object.freeze({id:'up08',shiftMeters:.8}),
 Object.freeze({id:'up16',shiftMeters:1.6}),
 Object.freeze({id:'up24',shiftMeters:2.4})
]);
const length=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function generateG4E7UMicroLanding(id='zero'){
 const config=G4E7U_GRADES.find(c=>c.id===id);
 if(!config)throw Error('G4E-7U landing enum required');
 const source=generateG4E7UPhysical('one53'),doc=structuredClone(source),
  road=doc.surfaces[0],gap=doc.stageForge.g4e7uStudy.gap;
 if(!gap?.realCollisionGap||road.voidLongitudinalCells?.[0]!==53||
  doc.surfaces.length!==7||doc.movingObstacles.length!==28)
  throw Error('G4E-7U micrograde genuine ONE53 prior proof required');
 let changed=0,maxActualShift=0;
 for(let r=0;r<road.rows;r++){
  const u=r/(road.rows-1),a=.56,b=.70;
  if(u<=a||u>=b||config.shiftMeters===0)continue;
  const t=(u-a)/(b-a),shift=config.shiftMeters*Math.sin(Math.PI*t)**2;
  for(let j=0;j<road.cols;j++)road.points[r*road.cols+j][1]+=shift;
  changed++;maxActualShift=Math.max(maxActualShift,Math.abs(shift));
 }
 for(let i=0;i<22;i++)doc.route[i]=sample(road,(i+.015)/22,.5);
 if(tessellate(road).degenerate!==0||changed>5||maxActualShift>2.5)
  throw Error('G4E-7U changed excessively or inverted real B48');
 const takeoff=sample(road,gap.uTakeoff,.5),landing=sample(road,gap.uLanding,.5),
  midpoint=sample(road,(gap.uTakeoff+gap.uLanding)/2,.5);
 if(contacts(compile(doc),[midpoint[0],midpoint[1]+.65,midpoint[2]],.65)
  .some(c=>c.triangle.rideable))
  throw Error('G4E-7U no invisible landing rescue allowed');
 let min=Infinity;
 for(let i=0;i<=240;i++){
  const u=i/240,width=length(sample(road,u,0),sample(road,u,1));
  if(u>=.56&&u<=.70)min=Math.min(min,width);
  if(width<10)throw Error('G4E-7U B48 road pinched below 10m');
 }
 if(!(min>=11&&min<=22))throw Error('G4E-7U genuine narrow B48 lip missing');
 if(!same(doc.movingObstacles,source.movingObstacles)||
  !same(doc.surfaces.slice(1),source.surfaces.slice(1))||
  !same(doc.route.slice(22),source.route.slice(22))||
  !same(doc.spawns,source.spawns)||
  !same(doc.routeSegments,source.routeSegments))
  throw Error('G4E-7U micrograde touched unrelated real stage');
 const resultGap={...gap,gapMeters:Number(length(takeoff,landing).toFixed(4)),
  landingBelowTakeoffMeters:Number((takeoff[1]-landing[1]).toFixed(4))};
 doc.name='G4E-7U E '+id+' real B48 ONE53 tiny landing change / NOT APPROVED';
 doc.stageForge={...doc.stageForge,
  revision:'W9C2-G4E7U-E-'+id,
  recordStageId:'VB-P101-A13-W9C2-G4E7U-E-'+id.toUpperCase(),
  productionPromoted:false,
  g4e7uStudy:{...doc.stageForge.g4e7uStudy,gap:resultGap,
   microGradeVariant:id},
  g4e7uLanding:{variant:id,source:'INDEPENDENT_G4E7U_ONE53_7OF7',
   peakShiftTargetMeters:config.shiftMeters,actualShiftMeters:Number(maxActualShift.toFixed(4)),
   modifiedControlRows:changed,realGap:resultGap,
   minTrueRoadWidthMeters:Number(min.toFixed(3)),
   movingMachines:28,realRoads:7,boostAdded:false,
   externalFloorAdded:false,physicsCameraUnchanged:true,
   humanFairness:'HOLD',officialSlope2Meters:0,publish:'HOLD'}};
 return validate(doc);
}

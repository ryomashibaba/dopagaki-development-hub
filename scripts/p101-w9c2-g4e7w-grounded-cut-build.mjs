/**
 * G4E-7W: shift ONLY one actual B48 missing longitudinal strip, using the
 * previously verified EXIT6 / SLOPE6 / SLOPE4 landing angle source skin.
 * Fixed width, 7 full roads, 28 B51-C machines and 240Hz physics unmodified.
 * This is not a new public stage, control aid or an accepted Slope2 element.
 */
import {generateG4E7VExit} from './p101-w9c2-g4e7v-exit-build.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
import {compile,contacts} from '../private/reference_only/director/collision.js';
export const W_PROFILES=Object.freeze(['exit4','exit6','slope6']);
export const W_GAP_CELLS=Object.freeze([47,48,49,50,51,52,53]);
const mag=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function g4e7wProfileWidth(profile,cell){
 if(!W_PROFILES.includes(profile)||!W_GAP_CELLS.includes(cell))throw Error('W enumerated physical study only');
 const doc=generateG4E7VExit(profile),road=doc.surfaces[0],u=cell/90;
 return Number(mag(sample(road,u,0),sample(road,u,1)).toFixed(3));
}
export function generateG4E7WPhysical(profile='exit6',cell=52){
 if(!W_PROFILES.includes(profile)||!W_GAP_CELLS.includes(cell))throw Error('W enumerated gap/grade study only');
 const ancestor=generateG4E7VExit(profile),doc=structuredClone(ancestor),
  road=doc.surfaces[0],cutAt=cell/90,landAt=(cell+1)/90,
  p0=sample(road,cutAt,.5),p1=sample(road,landAt,.5);
 road.voidLongitudinalCells=[cell];
 const widthAtLip=mag(sample(road,cutAt,0),sample(road,cutAt,1)),
  gapMeters=mag(p0,p1),mesh=tessellate(road);
 if(widthAtLip<10||widthAtLip>22)throw Error('W research cell is outside real <=22m narrow waist');
 if(gapMeters<2.5||gapMeters>13||mesh.degenerate!==0)
  throw Error('W true B48 gap geometry invalid');
 const middle=sample(road,(cutAt+landAt)/2,.5);
 if(contacts(compile(doc),[middle[0],middle[1]+.65,middle[2]],.65)
  .some(c=>c.triangle.rideable))
  throw Error('W missing collider crossed by imaginary support');
 if(!eq(road.points,ancestor.surfaces[0].points)||
   !eq(doc.movingObstacles,ancestor.movingObstacles)||
   !eq(doc.surfaces.slice(1),ancestor.surfaces.slice(1))||
   !eq(doc.route,ancestor.route)||!eq(doc.routeSegments,ancestor.routeSegments)||
   !eq(doc.spawns,ancestor.spawns)||mesh.topIndexCount>=tessellate(ancestor.surfaces[0]).topIndexCount)
  throw Error('W deviated from exact B48 original except missing collision strip');
 const gap={cells:[cell],uTakeoff:cutAt,uLanding:landAt,
  realCollisionGap:true,noInvisibleBridge:true,
  gapMeters:Number(gapMeters.toFixed(4)),lipWidthMeters:Number(widthAtLip.toFixed(3)),
  verticalLandingDifferenceMeters:Number((p0[1]-p1[1]).toFixed(3)),
  groundApproach:'UNTESTED',gapCausedAir:'UNTESTED',nativeRejoin:'UNTESTED'};
 doc.name='G4E-7W '+profile+' CUT '+cell+' physical B48 no assistant / HOLD';
 doc.stageForge={...doc.stageForge,
  recordStageId:'VB-P101-A13-W9C2-G4E7W-'+profile.toUpperCase()+'-'+cell,
  revision:'W9C2-G4E7W-'+profile+'-CELL'+cell,productionPromoted:false,
  g4e7uStudy:{...doc.stageForge.g4e7uStudy,gap},
  g4e7wStudy:{profile,cell,gap,source:'INDEPENDENT_G4E7V_EXIT_SHAPE_CLONE',
   nativeHz:240,realRoads:7,originalMachines:28,
   noEditedB48ControlPointsBeyondOriginalExitStudy:true,
   noSpeedResetNoBoostNoJumpNoHiddenFloor:true,officialSlope2Meters:0,
   humanFairness:'HOLD',publish:'HOLD'}};
 return validate(doc);
}

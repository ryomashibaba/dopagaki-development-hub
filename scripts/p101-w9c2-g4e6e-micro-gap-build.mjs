/**
 * G4E-6E: narrow local, discrete B48 cell-position scan around C0-55-1.
 * All six candidate physical cuts preserve every original Gold control point,
 * spline, spawns, original route and all 28 moving machines.
 * Changing the position of ONE absent real collider strip is the only
 * physics-world modification. No launcher, capture platform or forced jump.
 */
import {generateP101A13W7Candidate} from './p101-a13-w7-gameplay-build.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
import {compile,contacts} from '../private/reference_only/director/collision.js';
export const G4E6E_CELLS=Object.freeze([46,47,48,50,51,52]);
export const G4E6E_REFERENCE_CELL=49;
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const distance=(a,b)=>Math.hypot(...a.map((v,k)=>v-b[k]));
export const g4e6eId=cell=>'E0-C'+String(cell).padStart(3,'0');
export function generateG4E6EMicroGap(cell){
 if(!G4E6E_CELLS.includes(cell))
  throw Error('G4E6E accepts explicitly measured adjacent physical-cell sites only');
 const doc=generateP101A13W7Candidate(),gold=structuredClone(doc);
 const section=0,road=doc.surfaces[section];
 const nu=(road.rows-1)*road.resolution;
 if(nu!==90||road.rows!==31||road.cols!==5||
    doc.surfaces.length!==7||doc.movingObstacles.length!==28)
  throw Error('G4E6E original Gold 31×5 / resolution 3, 7 roads, 28 machines required');
 road.voidLongitudinalCells=[cell];
 const uTakeoff=cell/nu,uLanding=(cell+1)/nu,
  takeoffXYZ=sample(road,uTakeoff,.5),
  landingXYZ=sample(road,uLanding,.5),
  mid=sample(road,(uTakeoff+uLanding)/2,.5),
  gapMeters=distance(takeoffXYZ,landingXYZ);
 if(!(gapMeters>5&&gapMeters<10)||
    tessellate(road).degenerate!==0)
  throw Error('G4E6E real 6–8m physical gap integrity');
 if(contacts(compile(doc),[mid[0],mid[1]+.65,mid[2]],.65)
  .some(c=>c.triangle.rideable))
  throw Error('G4E6E false gap, physical rideable collider persists');
 if(!same(doc.surfaces.map(s=>s.points),gold.surfaces.map(s=>s.points))||
    !same(doc.surfaces.map(s=>s.id),gold.surfaces.map(s=>s.id))||
    doc.surfaces.some((s,i)=>i!==section&&!same(s,gold.surfaces[i]))||
    !same(doc.spawns,gold.spawns)||!same(doc.route,gold.route)||
    !same(doc.routeSegments,gold.routeSegments)||
    !same(doc.movingObstacles,gold.movingObstacles))
  throw Error('G4E6E mutated original Gold physical world beyond single strip');
 const id=g4e6eId(cell);
 doc.name='W9-C2 G4E-6E '+id+' / TRUE MICRO GAP IN GOLD ROAD I / OFFLINE HOLD';
 doc.stageForge={...doc.stageForge,
  revision:'W9C2-G4E-6E-'+id,
  recordStageId:'VB-P101-A13-W9C2-G4E6-'+id,
  studyOnly:'OFFLINE_NOT_REGISTERED_IN_GAME',status:'G4E6E_NATIVE_UNVERIFIED',
  nativeScriptedProof:null,fullStartToFinish:'NOT_VERIFIED',
  humanPlaytest:'NOT_RUN',fairness:'NOT_APPROVED',productionPromoted:false,
  g4e6EarlyGap:{id,section,surfaceId:road.id,
   physicalCells:[cell],uTakeoff,uLanding,gapMeters,takeoffXYZ,landingXYZ,
   actualOpenB48Collision:true,noMidpointRideableSupport:true,
   noNewRoadOrCatchPlatform:true,continuationOnSameOriginalRoad:true,
   originalSevenRoadsAnd28MachinesUnchanged:true,
   originalRouteSegmentsAndControlPointsUnchanged:true,
   trueAirborneVerified:false,trueLandingVerified:false,fullSevenChaptersVerified:false,
   approvedSlopeDNAMeters:0,physicsLawUnchanged:true,
   gameRegistered:false,humanFairness:'HOLD'}};
 return validate(doc);
}

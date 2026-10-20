/**
 * G4E-3: real missing physical cells without resampling/replacing Gold road.
 * Unlike G4E-2, routeSegments, Catmull-Rom controls, seven surface IDs and
 * native P94/P96 steering guides are byte-for-byte preserved.
 * The only difference to G4E-1 SHOULDER is one explicit physical void strip.
 * Offline/HOLD; not a selectable game stage or public asset.
 */
import {generateW9C2G4ENarrow} from './p101-w9c2-g4e-narrow-build.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
import {compile,contacts} from '../private/reference_only/director/collision.js';
export const G4E3_POLICY=Object.freeze({section:3,cellCenterU:.53,cells:2,physicsHz:240,
  humanApproved:false,gameRegistered:false,productionPromoted:false});
const dist=(a,b)=>Math.hypot(...a.map((v,k)=>v-b[k]));
export function generateG4E3PhysicalGap({cells=G4E3_POLICY.cells,centerU=G4E3_POLICY.cellCenterU}={}){
 if(!Number.isInteger(cells)||cells<1||cells>4||!Number.isFinite(centerU)||
    centerU<.47||centerU>.59)throw Error('G4E3 bounded real-gap parameter required');
 const doc=generateW9C2G4ENarrow('shoulder');
 const s=doc.surfaces[G4E3_POLICY.section],nu=(s.rows-1)*s.resolution;
 const first=Math.floor(centerU*nu-cells/2),indices=Array.from({length:cells},(_,i)=>first+i);
 if(indices.some(i=>i<3||i>nu-4))throw Error('G4E3 invalid physical cut');
 const original=structuredClone(doc);
 s.voidLongitudinalCells=indices;
 const u0=first/nu,u1=(first+cells)/nu;
 const takeoff=sample(s,u0,.5),landing=sample(s,u1,.5),mid=sample(s,(u0+u1)/2,.5);
 const distance=dist(takeoff,landing);
 if(distance<5||distance>80)throw Error('G4E3 invalid gap width');
 const mesh=tessellate(s);
 if(mesh.degenerate!==0)throw Error('G4E3 cut produced degenerate triangles');
 const world=compile(doc);
 const support=contacts(world,[mid[0],mid[1]+.65,mid[2]],.65)
  .filter(c=>c.triangle.rideable);
 if(support.length)throw Error('G4E3 hidden rideable support at midpoint');
 if(doc.surfaces.length!==7||doc.movingObstacles.length!==28||
  JSON.stringify(doc.route)!==JSON.stringify(original.route)||
  JSON.stringify(doc.routeSegments)!==JSON.stringify(original.routeSegments)||
  JSON.stringify(doc.spawns)!==JSON.stringify(original.spawns)||
  JSON.stringify(doc.movingObstacles)!==JSON.stringify(original.movingObstacles)||
  doc.surfaces.some((road,i)=>i!==G4E3_POLICY.section&&
   JSON.stringify(road)!==JSON.stringify(original.surfaces[i]))||
  JSON.stringify(s.points)!==JSON.stringify(original.surfaces[G4E3_POLICY.section].points))
  throw Error('G4E3 Gold physical spline/guide/hazard integrity violation');
 doc.name='W9-C2 G4E-3 EXACT-SPLINE OPEN VOID / OFFLINE HUMAN HOLD';
 doc.stageForge={...doc.stageForge,
  revision:'W9C2-G4E-3-CUTOUT-'+cells,recordStageId:'VB-P101-A13-W9C2-G4E3-GAP',
  status:'G4E3_PHYSICAL_VOID_GEOMETRY_PASS_NATIVE_FLIGHT_UNPROVEN',
  studyOnly:'OFFLINE_NOT_REGISTERED_IN_GAME',humanPlaytest:'NOT_RUN',
  fairness:'NOT_APPROVED',productionPromoted:false,
  nativeScriptedProof:null,fullStartToFinish:'NOT_VERIFIED',
  g4e3PhysicalGap:{source:'G4E1_SHOULDER',section:3,originalSurfaceId:s.id,
   physicalCellStart:first,physicalCells:cells,physicalResolution:nu,
   uTakeoff:u0,uLanding:u1,actualGapMeters:distance,
   noRideableSupportAtGapMidpoint:true,
   exactOriginalControlPoints:true,routeSegmentsUnchanged:true,
   realB48ColliderCutout:true,undersideRemoved:true,sideSkirtsRemoved:true,
   physicalEndCaps:true,original28MachinesUnchanged:true,
   actualNaturalAirborneJumpVerified:false,landingVerified:false,
   fullStart00Verified:false,approvedSlopeDNAMeters:0,
   humanFairness:'HOLD',gameRegistered:false}};
 return validate(doc);
}

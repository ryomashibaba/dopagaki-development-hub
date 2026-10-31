/**
 * G4E-4 OFFLINE ONLY: actual elevated skybridge landing candidate.
 * The bridge is a real, visible, collidable, thick 31x5 B48 road,
 * not an auto-catch or hidden floor. It is placed using prior native
 * G4E-3B .59 flight evidence; never moves to follow the player.
 * No teleport, impulse, velocity/steer/CCD modification.
 */
import {generateG4E3PhysicalGap} from './p101-w9c2-g4e3-geometry-preserving-gap.mjs';
import {ribbon,validate,tessellate,sample} from '../private/reference_only/director/surface.js';
import {compile,contacts} from '../private/reference_only/director/collision.js';
export const G4E4_RECEIVER=Object.freeze({
 gapCenterU:.59,gapCells:1,sourceFlight:'G4E3B_SITE_0.59_NATIVE_240HZ',
 startXZ:[-14,921],directionXZ:[.815,-.58],
 lengthMeters:440,widthMeters:56,
 elevations:[119,123,127],physical:true,gameRegistered:false,humanApproved:false
});
const dist=(a,b)=>Math.hypot(...a.map((v,k)=>v-b[k]));
export function generateG4E4Skybridge({elevation=123}={}){
 if(!G4E4_RECEIVER.elevations.includes(elevation))throw Error('G4E4 fixed candidate elevation required');
 const doc=generateG4E3PhysicalGap({cells:1,centerU:G4E4_RECEIVER.gapCenterU});
 const original=structuredClone(doc);
 const spec=G4E4_RECEIVER;
 const direction=spec.directionXZ,mag=Math.hypot(...direction);
 const path=Array.from({length:31},(_,i)=>{
  const d=spec.lengthMeters*i/30;
  return [spec.startXZ[0]+direction[0]/mag*d,elevation,spec.startXZ[1]+direction[1]/mag*d];
 });
 const road=ribbon('G4E4-SKYBRIDGE-RECEIVER','G4E-4 HIGH ALTITUDE VISIBLE LANDING ROAD',path,spec.widthMeters);
 road.resolution=6;road.thickness=1.25;road.material='road';
 road.rideable=true;road.collidable=true;
 doc.surfaces.push(road);
 if(tessellate(road).degenerate)throw Error('G4E4 invalid receiver physical mesh');
 if(doc.surfaces.length!==8||doc.movingObstacles.length!==28||
    JSON.stringify(doc.surfaces.slice(0,7))!==JSON.stringify(original.surfaces)||
    JSON.stringify(doc.movingObstacles)!==JSON.stringify(original.movingObstacles)||
    JSON.stringify(doc.route)!==JSON.stringify(original.route)||
    JSON.stringify(doc.routeSegments)!==JSON.stringify(original.routeSegments)||
    JSON.stringify(doc.spawns)!==JSON.stringify(original.spawns))
  throw Error('G4E4 changed original gap, guide, hazards or spawn');
 const gap=doc.stageForge.g4e3PhysicalGap;
 const originalRoad=doc.surfaces[3];
 const mid=sample(originalRoad,(gap.uTakeoff+gap.uLanding)/2,.5);
 const floor=contacts(compile(doc),[mid[0],mid[1]+.65,mid[2]],.65)
  .filter(c=>c.triangle.rideable);
 if(floor.length)throw Error('G4E4 invisible support inside takeoff gap');
 const receiverStart=sample(road,0,.5);
 if(dist(receiverStart,mid)<60)throw Error('G4E4 receiver too close to physical gap');
 doc.name='W9-C2 G4E-4 PHYSICAL ELEVATED SKYBRIDGE / OFFLINE HOLD';
 doc.stageForge={...doc.stageForge,
  revision:'W9C2-G4E-4-SKYBRIDGE-'+elevation,
  recordStageId:'VB-P101-A13-W9C2-G4E4-'+elevation,
  status:'G4E4_REAL_SKYBRIDGE_PHYSICS_AND_HUMAN_HOLD',
  fullStartToFinish:'NOT_VERIFIED',nativeScriptedProof:null,
  studyOnly:'OFFLINE_NOT_REGISTERED_IN_GAME',
  humanPlaytest:'NOT_RUN',fairness:'NOT_APPROVED',productionPromoted:false,
  g4e4Receiver:{realRoadId:road.id,realCollidable:true,realRideable:true,
   visibleIn3D:true,physicalSurfaceCount:8,
   receiverElevationMeters:elevation,receiverWidthMeters:spec.widthMeters,
   receiverLengthMeters:spec.lengthMeters,actualGapMeters:gap.actualGapMeters,
   independentFixedRoad:true,noDynamicCatch:true,
   noFloorInsideGap:true,original7RoadsAnd28MachinesUnchanged:true,
   nativeLandingVerified:false,fullStart00Verified:false,
   approvedSlopeDNAMeters:0,humanFairness:'HOLD'}};
 return validate(doc);
}

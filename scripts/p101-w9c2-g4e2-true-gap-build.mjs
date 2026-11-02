/**
 * G4E-2 REAL PHYSICAL VOID, OFFLINE ONLY. Two separate B48 solid surfaces.
 * There is no collision plane, mesh or force inside the missing interval.
 * No scripted jump, teleports, force or CCD modifications.
 * This is an unapproved physical candidate; native start00 and human tests
 * decide whether a ballistic passage and landing are actually possible.
 */
import {generateW9C2G4ENarrow} from './p101-w9c2-g4e-narrow-build.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
import {compile,contacts} from '../private/reference_only/director/collision.js';
export const G4E2_GAP=Object.freeze({
 section:3,uTakeoff:.525,uLanding:.532,
 nominalGapMeters:12.6,source:'G4E1_SHOULDER',
 landingSuffix:'-G4E2-LANDING',physicalHz:240,
 approved:false,gameRegistered:false
});
function section(s,from,to,id,label){
 const rows=31,cols=5,points=[];
 for(let i=0;i<rows;i++)for(let j=0;j<cols;j++)
  points.push(sample(s,from+(to-from)*i/(rows-1),j/(cols-1)));
 return {...s,id,name:s.name+' / '+label,rows,cols,points};
}
const dist=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
export function generateG4E2TrueGap(){
 const doc=generateW9C2G4ENarrow('shoulder');
 const original=structuredClone(doc),source=original.surfaces[G4E2_GAP.section];
 const first=section(source,0,G4E2_GAP.uTakeoff,source.id,'TRUE TAKEOFF EDGE');
 const second=section(source,G4E2_GAP.uLanding,1,source.id+G4E2_GAP.landingSuffix,'TRUE LANDING EDGE');
 const takeoff=sample(first,1,.5),landing=sample(second,0,.5);
 const actualGapMeters=dist(takeoff,landing);
 if(!(actualGapMeters>5&&actualGapMeters<40))throw Error('G4E2 true gap too small/large');
 if(tessellate(first).degenerate||tessellate(second).degenerate)
  throw Error('G4E2 degenerate physical cut edges');
 doc.surfaces[3]=first;
 // Append landing fragment to avoid silently renumbering all later 6 Gold roads.
 doc.surfaces.push(second);
 if(doc.surfaces.length!==8||doc.movingObstacles.length!==28||
    JSON.stringify(doc.movingObstacles)!==JSON.stringify(original.movingObstacles)||
    JSON.stringify(doc.route)!==JSON.stringify(original.route)||
    JSON.stringify(doc.spawns)!==JSON.stringify(original.spawns))
  throw Error('G4E2 original hazards/spawns/route unexpectedly changed');
 const world=compile(doc),mid=sample(source,(G4E2_GAP.uTakeoff+G4E2_GAP.uLanding)/2,.5);
 const support=contacts(world,[mid[0],mid[1]+.65,mid[2]],.65)
  .filter(c=>c.triangle.rideable);
 if(support.length)throw Error('G4E2 false gap: collidable floor at midpoint');
 doc.name='W9-C2 G4E-2 TRUE OPEN PHYSICAL GAP + SEPARATE LANDING / OFFLINE HOLD';
 doc.stageForge={...doc.stageForge,
  revision:'W9C2-G4E-2-TRUE-GAP',recordStageId:'VB-P101-A13-W9C2-G4E2-GAP',
  status:'G4E2_REAL_GAP_OFFLINE_PHYSICS_AND_HUMAN_HOLD',
  studyOnly:'OFFLINE_NOT_REGISTERED_IN_GAME',
  fullStartToFinish:'NOT_VERIFIED_G4E2',nativeScriptedProof:null,
  humanPlaytest:'NOT_RUN',fairness:'NOT_APPROVED',productionPromoted:false,
  g4e2TrueGap:{source:'G4E1_SHOULDER',section:3,
   uTakeoff:G4E2_GAP.uTakeoff,uLanding:G4E2_GAP.uLanding,
   actualCenterlineEdgeDistanceMeters:actualGapMeters,
   twoSeparateCollidableRideableSolids:true,
   noRideableSupportAtGapMidpoint:true,
   physicalSurfaces:8,original28MachinesUnchanged:true,
   trueOpenGapImplemented:true,naturalAirborneJumpVerified:false,
   landingVerified:false,fullStart00Verified:false,
   routeProgressAfterLandingRequiresAudit:true,
   humanFairness:'HOLD',approvedSlopeDNAMeters:0}};
 return validate(doc);
}

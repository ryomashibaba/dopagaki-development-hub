/**
 * G4E-5A OFFLINE: a real 31x5 downward continuation of the proven 123m
 * skybridge, with no speed/position assistance or invisible catch.
 * Not yet a road-V connection: this stage tests the first *physical seam*
 * and sustainable runway before a high-speed return curve is authored.
 */
import {generateG4E4Skybridge} from './p101-w9c2-g4e4-skybridge-receiver.mjs';
import {ribbon,validate,tessellate,sample} from '../private/reference_only/director/surface.js';
import {compile,contacts} from '../private/reference_only/director/collision.js';
export const G4E5_POLICY=Object.freeze({
 elevation:123,runwayLengths:Object.freeze([400,650,900]),
 roadId:'G4E5-DESCENT-RUNWAY',widthMeters:56,
 downhillMetersPerKm:72,physicalHz:240,
 release:'HOLD',human:'NOT_TESTED'
});
const dist=(a,b)=>Math.hypot(...a.map((v,k)=>v-b[k]));
export function generateG4E5Continuation({lengthMeters=650}={}){
 if(!G4E5_POLICY.runwayLengths.includes(lengthMeters))
  throw Error('G4E5 bounded continuation length required');
 const doc=generateG4E4Skybridge({elevation:G4E5_POLICY.elevation});
 const original=structuredClone(doc);
 const bridge=doc.surfaces[7];
 const end=sample(bridge,1,.5),near=sample(bridge,.99,.5);
 const flat=[end[0]-near[0],end[2]-near[2]],mag=Math.hypot(...flat);
 if(mag<1)throw Error('G4E5 bridge tangent missing');
 const forward=flat.map(v=>v/mag);
 // C1-continuous transition: zero slope at the seam, then a gentle downhill.
 // First 100m ramp slope transitions from 0 to 0.072, with bounded curvature.
 const drop=d=>.072*(d-100*(1-Math.exp(-d/100)));
 const path=Array.from({length:31},(_,i)=>{
  const d=lengthMeters*i/30;
  return [end[0]+forward[0]*d,end[1]-drop(d),end[2]+forward[1]*d];
 });
 const runway=ribbon(G4E5_POLICY.roadId,'G4E-5 REAL DESCENDING SKYWAY / OFFLINE',path,G4E5_POLICY.widthMeters);
 runway.resolution=6;runway.thickness=1.25;runway.rideable=true;
 runway.collidable=true;runway.material='road';
 doc.surfaces.push(runway);
 if(tessellate(runway).degenerate!==0)throw Error('G4E5 degenerate real road');
 const seamDistance=dist(sample(bridge,1,.5),sample(runway,0,.5));
 if(seamDistance>1e-6)throw Error('G4E5 disconnected road seam');
 const p0=sample(runway,0,.5),p1=sample(runway,.01,.5);
 const dir=[p1[0]-p0[0],p1[2]-p0[2]];
 const cosine=(dir[0]*flat[0]+dir[1]*flat[1])/(Math.hypot(...dir)*mag);
 if(cosine<.999)throw Error('G4E5 severe seam heading');
 if(doc.surfaces.length!==9||doc.movingObstacles.length!==28||
   JSON.stringify(doc.surfaces.slice(0,8))!==JSON.stringify(original.surfaces)||
   JSON.stringify(doc.movingObstacles)!==JSON.stringify(original.movingObstacles)||
   JSON.stringify(doc.route)!==JSON.stringify(original.route)||
   JSON.stringify(doc.routeSegments)!==JSON.stringify(original.routeSegments)||
   JSON.stringify(doc.spawns)!==JSON.stringify(original.spawns))
  throw Error('G4E5 changed source physics or stage');
 const gap=doc.stageForge.g4e3PhysicalGap,source=doc.surfaces[3],
  mid=sample(source,(gap.uTakeoff+gap.uLanding)/2,.5);
 if(contacts(compile(doc),[mid[0],mid[1]+.65,mid[2]],.65)
   .some(c=>c.triangle.rideable))
  throw Error('G4E5 fake support across original real gap');
 doc.name='W9-C2 G4E-5A TRUE DESCENDING RUNWAY / OFFLINE HOLD';
 doc.stageForge={...doc.stageForge,
  revision:'W9C2-G4E-5A-'+lengthMeters,
  recordStageId:'VB-P101-A13-W9C2-G4E5A-'+lengthMeters,
  status:'G4E5A_PHYSICAL_CONTINUATION_UNVERIFIED',
  fullStartToFinish:'NOT_VERIFIED',nativeScriptedProof:null,
  studyOnly:'OFFLINE_NOT_REGISTERED_IN_GAME',
  humanPlaytest:'NOT_RUN',fairness:'NOT_APPROVED',productionPromoted:false,
  g4e5Continuation:{roadId:runway.id,lengthMeters,widthMeters:G4E5_POLICY.widthMeters,
   seamDistanceMeters:seamDistance,seamHeadingCosine:cosine,
   start:sample(runway,0,.5),end:sample(runway,1,.5),
   elevationDropMeters:drop(lengthMeters),collidable:true,rideable:true,
   sourceEightSurfacesUnchanged:true,original28MachinesUnchanged:true,
   originalRealVoidOpen:true,roadVConnected:false,
   nativeSeamCrossingVerified:false,fullStart00Verified:false,
   approvedSlopeDNAMeters:0,gameRegistered:false,humanFairness:'HOLD'}};
 return validate(doc);
}

/**
 * G4E-6F physical subcell gap alternatives. This experiment changes only
 * B48 road-I TESSELLATION resolution and removes genuine physical triangles
 * in a shorter interval. Gold W7F original remains frozen at resolution 3.
 *
 * Deliberate distinction: even though all original Catmull-Rom control points,
 * spawns, route, machines are identical, increasing collision resolution from
 * 3 to 6/9 changes the underlying collision mesh. No prior Gold native pass
 * transfers to this candidate; it must run authentic 240Hz start00 again.
 */
import {generateP101A13W7Candidate} from './p101-a13-w7-gameplay-build.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
import {compile,contacts} from '../private/reference_only/director/collision.js';
export const G4E6F_VARIANTS=Object.freeze([
 Object.freeze({id:'F6-97-1',resolution:6,startCell:97,cells:1}),
 Object.freeze({id:'F6-98-1',resolution:6,startCell:98,cells:1}),
 Object.freeze({id:'F6-99-1',resolution:6,startCell:99,cells:1}),
 Object.freeze({id:'F6-98-2',resolution:6,startCell:98,cells:2}),
 Object.freeze({id:'F9-147-2',resolution:9,startCell:147,cells:2})
]);
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const dist=(a,b)=>Math.hypot(...a.map((v,k)=>v-b[k]));
export function generateG4E6FSubcellGap(id){
 const cfg=G4E6F_VARIANTS.find(x=>x.id===id);
 if(!cfg)throw Error('G4E6F declared physical subcell design required');
 const doc=generateP101A13W7Candidate(),gold=structuredClone(doc),
  road=doc.surfaces[0],originalResolution=road.resolution;
 if(originalResolution!==3||road.rows!==31||road.cols!==5||
    doc.surfaces.length!==7||doc.movingObstacles.length!==28)
  throw Error('G4E6F exact 7 original Gold road 3-resolution surface required');
 road.resolution=cfg.resolution;
 const nu=(road.rows-1)*road.resolution;
 const strip=Array.from({length:cfg.cells},(_,i)=>cfg.startCell+i);
 if(strip[0]<3||strip.at(-1)>nu-4)throw Error('G4E6F outside real road');
 road.voidLongitudinalCells=strip;
 const uTakeoff=cfg.startCell/nu,uLanding=(cfg.startCell+cfg.cells)/nu,
  takeoffXYZ=sample(road,uTakeoff,.5),
  landingXYZ=sample(road,uLanding,.5),
  gapMeters=dist(takeoffXYZ,landingXYZ),
  midpoint=sample(road,(uTakeoff+uLanding)/2,.5);
 if(!(gapMeters>2&&gapMeters<10)||tessellate(road).degenerate!==0)
  throw Error('G4E6F degenerate/missing subcell physical void');
 if(contacts(compile(doc),[midpoint[0],midpoint[1]+.65,midpoint[2]],.65)
  .some(x=>x.triangle.rideable))
  throw Error('G4E6F invisible support spans gap midpoint');
 if(!same(doc.surfaces.map(x=>x.id),gold.surfaces.map(x=>x.id))||
    !same(doc.surfaces.map(x=>x.points),gold.surfaces.map(x=>x.points))||
    doc.surfaces.some((s,i)=>i>0&&!same(s,gold.surfaces[i]))||
    !same(doc.spawns,gold.spawns)||!same(doc.route,gold.route)||
    !same(doc.routeSegments,gold.routeSegments)||
    !same(doc.movingObstacles,gold.movingObstacles))
  throw Error('G4E6F changed Gold route, 28 machines or authored road control');
 doc.name='W9-C2 G4E-6F '+id+' / REAL SHORT COLLIDER VOID / OFFLINE HOLD';
 doc.stageForge={...doc.stageForge,
  revision:'W9C2-G4E-6F-'+id,
  recordStageId:'VB-P101-A13-W9C2-G4E6-'+id,
  studyOnly:'OFFLINE_NOT_REGISTERED_IN_GAME',
  status:'G4E6F_REAL_SHORT_GAP_UNPROVEN_NATIVE',
  nativeScriptedProof:null,fullStartToFinish:'NOT_VERIFIED',
  humanPlaytest:'NOT_RUN',fairness:'NOT_APPROVED',productionPromoted:false,
  g4e6EarlyGap:{
   id,section:0,surfaceId:road.id,physicalCells:strip,
   uTakeoff,uLanding,gapMeters,takeoffXYZ,landingXYZ,
   actualOpenB48Collision:true,noMidpointRideableSupport:true,
   sourceResolution:originalResolution,candidateResolution:cfg.resolution,
   collisionMeshChangedOnRoadI:true,
   originalGoldControlPointsAndRouteUnchanged:true,
   originalSevenRoadsAnd28MachinesUnchanged:true,
   noNewRoadOrCatchPlatform:true,continuationOnSameOriginalRoad:true,
   originalRouteSegmentsAndControlPointsUnchanged:true,
   trueAirborneVerified:false,trueLandingVerified:false,
   fullSevenChaptersVerified:false,approvedSlopeDNAMeters:0,
   physicsLawUnchanged:true,gameRegistered:false,humanFairness:'HOLD'}};
 return validate(doc);
}

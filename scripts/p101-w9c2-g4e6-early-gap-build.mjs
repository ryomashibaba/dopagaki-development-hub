/**
 * G4E-6A: Genuine missing B48 collider strips on earlier original Gold roads.
 * Unlike failed late skybridge rejoin, after this gap the original SAME road
 * continues and can lead naturally to every later original chapter.
 * No alternate lane, catcher, new bridge, redirection or skipped road.
 */
import {generateP101A13W7Candidate} from './p101-a13-w7-gameplay-build.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
import {compile,contacts} from '../private/reference_only/director/collision.js';
export const G4E6_SITES=Object.freeze([
 Object.freeze({id:'A0-35-2',section:0,centerU:.35,cells:2}),
 Object.freeze({id:'A0-65-2',section:0,centerU:.65,cells:2}),
 Object.freeze({id:'A1-25-1',section:1,centerU:.25,cells:1}),
 Object.freeze({id:'A1-55-1',section:1,centerU:.55,cells:1}),
 Object.freeze({id:'A2-28-2',section:2,centerU:.28,cells:2}),
 Object.freeze({id:'A2-63-1',section:2,centerU:.63,cells:1})
]);
/** G4E-6B: separate no-default speed-retention variants, does not add runs to 6A. */
export const G4E6B_SITES=Object.freeze([
 Object.freeze({id:'B0-25-1',section:0,centerU:.25,cells:1}),
 Object.freeze({id:'B0-35-1',section:0,centerU:.35,cells:1}),
 Object.freeze({id:'B0-45-1',section:0,centerU:.45,cells:1}),
 Object.freeze({id:'B0-65-1',section:0,centerU:.65,cells:1}),
 Object.freeze({id:'B0-35-3',section:0,centerU:.35,cells:3})
]);
/** G4E-6C: near the 6.91m / 87.4% speed retention fullrun PASS site. */
export const G4E6C_SITES=Object.freeze([
 Object.freeze({id:'C0-50-1',section:0,centerU:.50,cells:1}),
 Object.freeze({id:'C0-55-1',section:0,centerU:.55,cells:1}),
 Object.freeze({id:'C0-60-1',section:0,centerU:.60,cells:1}),
 Object.freeze({id:'C0-63-1',section:0,centerU:.63,cells:1}),
 Object.freeze({id:'C0-68-1',section:0,centerU:.68,cells:1})
]);
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const distance=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
export function generateG4E6EarlyGap(id){
 const site=[...G4E6_SITES,...G4E6B_SITES,...G4E6C_SITES].find(x=>x.id===id);
 if(!site)throw Error('G4E6 declared early Gold gap ID required');
 const original=generateP101A13W7Candidate(),doc=structuredClone(original);
 const road=doc.surfaces[site.section],nu=(road.rows-1)*road.resolution;
 if(road.rows!==31||road.cols!==5||!road.collidable||!road.rideable||
    doc.surfaces.length!==7||doc.movingObstacles.length!==28)
  throw Error('G4E6 requires exact physical original Gold road and all machines');
 const first=Math.floor(site.centerU*nu-site.cells/2);
 const cells=Array.from({length:site.cells},(_,i)=>first+i);
 if(cells[0]<3||cells.at(-1)>nu-4)throw Error('G4E6 cut outside bounded road');
 road.voidLongitudinalCells=cells;
 const uTakeoff=first/nu,uLanding=(first+site.cells)/nu;
 const p0=sample(road,uTakeoff,.5),p1=sample(road,uLanding,.5),
  gapMeters=distance(p0,p1),mid=sample(road,(uTakeoff+uLanding)/2,.5);
 if(!(gapMeters>2&&gapMeters<40))throw Error('G4E6 invalid physical open gap length');
 const mesh=tessellate(road);
 if(mesh.degenerate)throw Error('G4E6 degenerate real cutout');
 const world=compile(doc);
 const support=contacts(world,[mid[0],mid[1]+.65,mid[2]],.65)
  .filter(c=>c.triangle.rideable);
 if(support.length)throw Error('G4E6 hidden platform inside physical gap');
 if(!eq(doc.surfaces.map(s=>s.points),original.surfaces.map(s=>s.points))||
    !eq(doc.surfaces.map(s=>s.id),original.surfaces.map(s=>s.id))||
    doc.surfaces.some((s,i)=>i!==site.section&&!eq(s,original.surfaces[i]))||
    !eq(doc.movingObstacles,original.movingObstacles)||
    !eq(doc.route,original.route)||!eq(doc.routeSegments,original.routeSegments)||
    !eq(doc.spawns,original.spawns))
   throw Error('G4E6 broke frozen Gold spline/route/machine integrity');
 doc.name='W9-C2 G4E-6A '+site.id+' TRUE EARLY OPEN GAP / REJOIN SAME ROAD / OFFLINE HOLD';
 doc.stageForge={...doc.stageForge,
  revision:'W9C2-G4E-6A-'+site.id,
  recordStageId:'VB-P101-A13-W9C2-G4E6-'+site.id,
  status:'G4E6_REAL_GAP_NATIVE_AND_HUMAN_HOLD',
  studyOnly:'OFFLINE_NOT_REGISTERED_IN_GAME',
  nativeScriptedProof:null,fullStartToFinish:'NOT_VERIFIED',
  humanPlaytest:'NOT_RUN',fairness:'NOT_APPROVED',productionPromoted:false,
  g4e6EarlyGap:{
   id:site.id,section:site.section,surfaceId:road.id,
   physicalCells:[...cells],uTakeoff,uLanding,gapMeters,
   takeoffXYZ:p0,landingXYZ:p1,
   actualOpenB48Collision:true,noMidpointRideableSupport:true,
   noNewRoadOrCatchPlatform:true,continuationOnSameOriginalRoad:true,
   originalSevenRoadsAnd28MachinesUnchanged:true,
   originalRouteSegmentsAndControlPointsUnchanged:true,
   trueAirborneVerified:false,trueLandingVerified:false,fullSevenChaptersVerified:false,
   approvedSlopeDNAMeters:0,physicsLawUnchanged:true,
   gameRegistered:false,humanFairness:'HOLD'
  }};
 return validate(doc);
}

/**
 * G4E-7T R2: lower an actual B48 landing lip rather than supply a ghost floor.
 * Every vertex is collision-authoritative. EARLY two-cell gap precedes existing
 * late crest takeoff. Protected T-R1, R, Q and Gold are never modified.
 */
import {generateG4E7TPhysical} from './p101-w9c2-g4e7t-real-early-gap-build.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
import {compile,contacts} from '../private/reference_only/director/collision.js';
export const G4E7T_REJOIN=Object.freeze([
 Object.freeze({id:'solid12',amplitudeMeters:12,cells:0}),
 Object.freeze({id:'short12',amplitudeMeters:12,cells:1}),
 Object.freeze({id:'lower12',amplitudeMeters:12,cells:2}),
 Object.freeze({id:'lower18',amplitudeMeters:18,cells:2})
]);
const dist=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const config=id=>G4E7T_REJOIN.find(x=>x.id===id);
export function generateG4E7TRejoin(id='lower12'){
 const q=config(id);if(!q)throw Error('G4E-7T R2 declared lip-only variant required');
 const baseline=generateG4E7TPhysical('solid'),doc=structuredClone(baseline),
  road=doc.surfaces[0];
 const u0=.49,u3=.76,rows=31;
 let altered=0,maxDrop=0;
 for(let r=0;r<rows;r++){
  const u=r/(rows-1);
  if(u<=u0||u>=u3)continue;
  const t=(u-u0)/(u3-u0),vertical=-q.amplitudeMeters*Math.sin(Math.PI*t)**2;
  if(Math.abs(vertical)<1e-9)continue;
  for(let j=0;j<5;j++)road.points[r*5+j][1]+=vertical;
  maxDrop=Math.max(maxDrop,-vertical);altered++;
 }
 for(let i=0;i<22;i++)doc.route[i]=sample(road,(i+.015)/22,.5);
 if(altered<7||maxDrop<8||tessellate(road).degenerate!==0)
  throw Error('G4E-7T R2 altered B48 lower lip invalid');
 let gap=null;
 if(q.cells){
  const first=53; // 0.5889, genuinely GROUNDED approach in previous native survey
  const cells=Array.from({length:q.cells},(_,i)=>first+i);
  road.voidLongitudinalCells=cells;
  const uTakeoff=first/90,uLanding=(first+q.cells)/90,
   p0=sample(road,uTakeoff,.5),p1=sample(road,uLanding,.5),
   midpoint=sample(road,(uTakeoff+uLanding)/2,.5);
  const lengthMeters=dist(p0,p1),lowerBy=p0[1]-p1[1];
  if(!(lengthMeters>2&&lengthMeters<22)||tessellate(road).degenerate!==0)
   throw Error('G4E-7T R2 invalid missing collision strip');
  if(contacts(compile(doc),[midpoint[0],midpoint[1]+.65,midpoint[2]],.65)
    .some(c=>c.triangle.rideable))
   throw Error('G4E-7T R2 imaginary catch-platform');
  gap={cells,realAbsentB48Cells:true,uTakeoff,uLanding,
   lengthMeters:Number(lengthMeters.toFixed(3)),
   landingBelowTakeoffMeters:Number(lowerBy.toFixed(3)),
   nativeAirCaused:'UNVERIFIED',nativeRejoined:'UNVERIFIED',
   noInvisibleCollisionFloor:true};
 }
 let min=Infinity;
 for(let i=0;i<=180;i++){
  const u=i/180,width=dist(sample(road,u,0),sample(road,u,1));
  if(width<10)throw Error('G4E-7T R2 actual B48 collapsed');
  if(u>.54&&u<.72)min=Math.min(min,width);
 }
 if(!(min>11&&min<22))throw Error('G4E-7T R2 early 13m neck disappeared');
 if(!same(doc.movingObstacles,baseline.movingObstacles)||
   !same(doc.spawns,baseline.spawns)||!same(doc.routeSegments,baseline.routeSegments)||
   !same(doc.surfaces.slice(1),baseline.surfaces.slice(1))||
   !same(doc.route.slice(22),baseline.route.slice(22)))
  throw Error('G4E-7T R2 changed anything beyond original B48 early lip');
 doc.name='G4E-7T-R2 '+id+' descending TRUE B48 edge / UNAPPROVED';
 doc.stageForge={...doc.stageForge,recordStageId:'VB-P101-A13-W9C2-G4E7T-R2-'+id.toUpperCase(),
  revision:'W9C2-G4E7T-R2-'+id,productionPromoted:false,
  g4e7tRejoin:{variant:id,source:'G4E7T_SOLID_INDEPENDENT_CLONE',
   shapedRows:altered,amplitudeMeters:q.amplitudeMeters,maxDropMeters:Number(maxDrop.toFixed(2)),
   measuredNarrowWidthMeters:Number(min.toFixed(2)),gap,
   originalMovingObstacles:28,actualRoads:7,humanPlaytest:'NOT_RUN',
   noExtraDeckNoAutoAssistNoCameraChange:true,officiallyApprovedSlope2Meters:0,publish:'HOLD'}};
 return validate(doc);
}

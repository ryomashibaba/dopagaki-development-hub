/** G4E-7AU: PRIVATE-only manual road2 starting positions.
 * Adds two optional authentic B48 spawns to exact AT physical geometry.
 * Does NOT repair start00, add ground, change momentum in the live race,
 * move B51, certify a gap, or declare finishable/fair.
 */
import {generateG4E7AT} from './p101-w9c2-g4e7at-crown-chasm.mjs';
import {AJ_ROADS} from './p101-w9c2-g4e7aj-reanchor-moving.mjs';
import {sample,validate} from '../private/reference_only/director/surface.js';
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export const AU_POINTS=Object.freeze([
 Object.freeze({id:'crown',u:.18,name:'AU CROWN THREAD | 実B48第2道路からの検証用開始（00から未到達）'}),
 Object.freeze({id:'chasm',u:.70,name:'AU CHASM SWEEP | 実B48第2道路からの検証用開始（00から未到達）'})
]);
export function generateG4E7AUInspection(road='true-pinch'){
 if(!AJ_ROADS.includes(road))throw Error('AU unknown physical road');
 const original=generateG4E7AT(road),frozen=JSON.stringify(original),
  doc=structuredClone(original),section=doc.surfaces[1];
 const before=doc.spawns.length;
 if(!section||!section.collidable||!section.rideable||doc.surfaces.length!==7||
   doc.movingObstacles.length!==28||doc.surfaces[0].voidLongitudinalCells?.join(',')!=='52')
  throw Error('AU requires protected true 7-road AT with cut and all 28 B51-C');
 for(const pt of AU_POINTS){
  const center=sample(section,pt.u,.5);
  if(!center.every(Number.isFinite))throw Error('AU native B48 spawn invalid');
  doc.spawns.push({name:pt.name,surface:section.id,u:pt.u,v:.5});
 }
 if(!same(doc.surfaces,original.surfaces)||!same(doc.route,original.route)||
    !same(doc.routeSegments,original.routeSegments)||
    !same(doc.movingObstacles,original.movingObstacles)||
    !same(doc.fixtures,original.fixtures)||
    !same(doc.spawns.slice(0,before),original.spawns)||
    doc.spawns.length!==before+2||
    JSON.stringify(original)!==frozen||
    original.stageForge.productionPromoted!==false||
    original.stageForge.g4e7atStudy.formalSlope2Meters!==0)
  throw Error('AU must only add explicit private road2 QA start positions');
 doc.name='G4E-7AU ROAD2 LOCAL-ONLY CROWN/CHASM 240HZ HAND TEST / NOT START00 / HOLD';
 doc.stageForge={...doc.stageForge,
  revision:'W9C2-G4E7AU-PRIVATE-INSPECTION-'+road.toUpperCase(),
  recordStageId:'VB-P101-A13-W9C2-G4E7AU-'+road.toUpperCase()+'-INSPECT',
  productionPromoted:false,g4e7auStudy:{
   id:'road2-inspect',road,base:'G4E7AT_CROWN_CHASM_PHYSICAL_IMMUTABLE',
   originalSpawns:before,inspectionPointCount:AU_POINTS.length,
   actualRoads:7,actualMovingObstacles:28,
   firstGapCell52Unchanged:true,realRaceStart00Reachability:'FAILED_P96_NONHUMAN',
   originalRoadsAndCollidersIdentical:true,
   selectableQAOnly:true,notARescueCheckpoint:true,
   formalSlope2Meters:0,humanFairness:'HOLD',art:'HOLD',publish:'HOLD'
  }};
 return validate(doc);
}

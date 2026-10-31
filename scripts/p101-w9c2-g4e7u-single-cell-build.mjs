/**
 * G4E-7U — one physical B48 longitudinal collision cell missing at a time.
 * Isolated clone from G4E-7T SOLID (the 7/7-finishing narrow-road control),
 * NOT the rejected R2 lowered landing. No artificial ramp, floor or assistance.
 */
import {generateG4E7TPhysical} from './p101-w9c2-g4e7t-real-early-gap-build.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
import {compile,contacts} from '../private/reference_only/director/collision.js';
export const G4E7U_CHOICES=Object.freeze([
 Object.freeze({id:'control',cell:null}),
 ...[45,50,51,52,53,54,55,56,57,59,61,62,63,64,65].map(cell=>Object.freeze({id:'one'+cell,cell}))
]);
const length=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function generateG4E7UPhysical(id='one53',{inspectionSpawns=false}={}){
 const choice=G4E7U_CHOICES.find(c=>c.id===id);
 if(!choice)throw Error('G4E-7U enumerated physical B48 candidate only');
 const source=generateG4E7TPhysical('solid'),doc=structuredClone(source),
  road=doc.surfaces[0],originalSpawns=doc.spawns.length;
 if(doc.surfaces.length!==7||doc.movingObstacles.length!==28||
   road.rows!==31||road.cols!==5||road.resolution!==3||
   road.voidLongitudinalCells?.length)
  throw Error('G4E-7U requires protected genuine early 13m B48 control');
 let gap=null;
 if(choice.cell!==null){
  const cell=choice.cell,nu=(road.rows-1)*road.resolution;
  road.voidLongitudinalCells=[cell];
  const uTakeoff=cell/nu,uLanding=(cell+1)/nu,
   start=sample(road,uTakeoff,.5),end=sample(road,uLanding,.5),
   mid=sample(road,(uTakeoff+uLanding)/2,.5);
  const gapMeters=length(start,end);
  if(!(gapMeters>2.5&&gapMeters<13)||tessellate(road).degenerate!==0)
   throw Error('G4E-7U not a true single-cell B48 gap');
  if(contacts(compile(doc),[mid[0],mid[1]+.65,mid[2]],.65)
    .some(c=>c.triangle.rideable))
   throw Error('G4E-7U hidden support must not be present');
  gap={cells:[cell],realCollisionGap:true,uTakeoff,uLanding,
   gapMeters:Number(gapMeters.toFixed(3)),
   landingBelowTakeoffMeters:Number((start[1]-end[1]).toFixed(3)),
   lipWidthMeters:Number(length(sample(road,uTakeoff,0),sample(road,uTakeoff,1)).toFixed(2)),
   noInvisibleBridge:true};
 }else if(road.voidLongitudinalCells?.length)throw Error('G4E-7U control cannot contain void');
 if(!eq(doc.surfaces.slice(1),source.surfaces.slice(1))||
    !eq(doc.movingObstacles,source.movingObstacles)||!eq(doc.spawns,source.spawns)||
    !eq(doc.route,source.route)||!eq(doc.routeSegments,source.routeSegments)||
    !eq(doc.surfaces[0].points,source.surfaces[0].points))
  throw Error('G4E-7U altered protected road points, machines, camera or unrelated stage');
 if(inspectionSpawns)for(const [u,name] of [[.53,'APPROACH'],[.68,'POST GAP']])
  doc.spawns.push({name:'G4E-7U '+name+' / PRIVATE INSPECTION ONLY',
   surface:road.id,u,v:.5});
 doc.name='G4E-7U '+id+' TRUE EARLY B48 13m narrow single-cell gap / HUMAN HOLD';
 doc.stageForge={...doc.stageForge,
  revision:'W9C2-G4E7U-'+id,
  recordStageId:'VB-P101-A13-W9C2-G4E7U-'+id.toUpperCase(),
  productionPromoted:false,
  g4e7uStudy:{variant:id,source:'CLONED_UNMODIFIED_G4E7T_SOLID_7OF7',
   gap,actualRoads:7,realMovingMachines:28,
   noRoadControlPointChanges:true,originalSpawnCount:originalSpawns,
   inspectionSpawns:inspectionSpawns?2:0,
   scriptComplete:'UNTESTED',humanPlayability:'HOLD',
   officialSlope2Meters:0,publish:'HOLD'}};
 return validate(doc);
}

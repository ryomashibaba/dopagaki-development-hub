/**
 * G4E-7V isolated exit-slope profiles built from proven 7/7 ONE53 B48.
 * Genuine authoring vertices, no bridge, speed reset, widening, jump force
 * or camera edits. It changes only longitudinal profile of first B48 road.
 * The collision-authoritative top / underside / edge share the same skin.
 */
import {generateG4E7UPhysical} from './p101-w9c2-g4e7u-single-cell-build.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
import {compile,contacts} from '../private/reference_only/director/collision.js';
export const G4E7V_PROFILES=Object.freeze([
 Object.freeze({id:'original',rowY:{}}),
 Object.freeze({id:'exit2',rowY:{19:-2,20:-1}}),
 Object.freeze({id:'exit4',rowY:{19:-4,20:-2}}),
 Object.freeze({id:'exit6',rowY:{19:-6,20:-3}}),
 Object.freeze({id:'exit8',rowY:{19:-8,20:-4}}),
 Object.freeze({id:'incline2',rowY:{18:2,19:-2,20:-1}}),
 Object.freeze({id:'incline4',rowY:{18:3,19:-4,20:-2}}),
 Object.freeze({id:'slope4',rowY:{18:-1,19:-5,20:-2.5}}),
 Object.freeze({id:'slope6',rowY:{18:-2,19:-7,20:-3}})
]);
const distance=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i])),eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function generateG4E7VExit(id='exit4'){
 const cfg=G4E7V_PROFILES.find(x=>x.id===id);
 if(!cfg)throw Error('G4E-7V profile must be enumerated');
 const source=generateG4E7UPhysical('one53'),doc=structuredClone(source),
  road=doc.surfaces[0],gap=doc.stageForge.g4e7uStudy.gap;
 if(road.voidLongitudinalCells?.join(',')!=='53'||doc.surfaces.length!==7||
   doc.movingObstacles.length!==28)throw Error('G4E-7V must derive from real ONE53');
 let maxAbsChange=0;const rows=[];
 for(const [key,amount] of Object.entries(cfg.rowY)){
  const row=Number(key);
  if(!Number.isInteger(row)||row<18||row>20||!Number.isFinite(amount)||
     Math.abs(amount)>8)throw Error('G4E-7V profile edit outside real B48 local bounds');
  for(let c=0;c<5;c++)road.points[row*5+c][1]+=amount;
  maxAbsChange=Math.max(maxAbsChange,Math.abs(amount));rows.push(row);
 }
 for(let i=0;i<22;i++)doc.route[i]=sample(road,(i+.015)/22,.5);
 const mesh=tessellate(road);
 if(mesh.degenerate!==0||!eq(doc.surfaces.slice(1),source.surfaces.slice(1))||
   !eq(doc.movingObstacles,source.movingObstacles)||!eq(doc.route.slice(22),source.route.slice(22))||
   !eq(doc.spawns,source.spawns)||!eq(doc.routeSegments,source.routeSegments))
  throw Error('G4E-7V modified protected physics stage or invalid B48');
 let nearWidth=Infinity;
 for(let i=0;i<=240;i++){
  const u=i/240,w=distance(sample(road,u,0),sample(road,u,1));
  if(w<10)throw Error('G4E-7V deck under 10m');
  if(u>=.56&&u<=.61)nearWidth=Math.min(nearWidth,w);
 }
 if(!(nearWidth>11&&nearWidth<22))throw Error('G4E-7V failed real B48 14m lip');
 const p0=sample(road,gap.uTakeoff,.5),p1=sample(road,gap.uLanding,.5),
  pm=sample(road,(gap.uTakeoff+gap.uLanding)/2,.5);
 if(contacts(compile(doc),[pm[0],pm[1]+.65,pm[2]],.65)
    .some(c=>c.triangle.rideable))
  throw Error('G4E-7V ghost collision bridge across genuine void');
 if(!eq(road.voidLongitudinalCells,[53]))throw Error('G4E-7V actual missing strip lost');
 const study={variant:id,source:'CLONE_G4E7U_ONE53_7OF7',editRows:rows,
  maxControlHeightChangeMeters:maxAbsChange,
  realGapLengthMeters:Number(distance(p0,p1).toFixed(3)),
  realNarrowWidthMeters:Number(nearWidth.toFixed(3)),
  unchangedRoadsBeyondFirst:true,originalMovingCount:28,realRoads:7,
  unchangedPhysicalLaws:true,noBridgeNoBoosterNoSpeedReset:true,
  humanPlaytest:'NOT_RUN',officialSlope2Meters:0,release:'HOLD'};
 doc.name='G4E-7V '+id+' / authentic B48 exit normal study / HOLD';
 doc.stageForge={...doc.stageForge,revision:'W9C2-G4E7V-'+id,
  recordStageId:'VB-P101-A13-W9C2-G4E7V-'+id.toUpperCase(),
  productionPromoted:false,g4e7vStudy:study};
 return validate(doc);
}

/**
 * G4E-7AH — genuine narrower B48 lanes on the proven R2 approach arc.
 * Not a decorative safety stripe, no center safe corridor and NO auto-steering.
 * Changes real collision mesh including side skirts; never touches the AA gap
 * lip/flight/rejoin, 7-road downstream stage, or the 28 moving B51-C hazards.
 */
import {generateG4E7ACR2} from './p101-w9c2-g4e7ac-r2-physical.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
import {compile,contacts} from '../private/reference_only/director/collision.js';

export const AH_VARIANTS=Object.freeze([
 Object.freeze({id:'r2-control',minimumWidth:0,shift:0}),
 Object.freeze({id:'true-pinch',minimumWidth:11.5,shift:0}),
 Object.freeze({id:'pinch-switch',minimumWidth:11.7,shift:8.5})
]);
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const distance=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
const pulse=(u,a,b)=>u>a&&u<b?Math.sin(Math.PI*(u-a)/(b-a))**2:0;
function outboard(points,row){
 const a=points[Math.max(0,row-1)*5+2],b=points[Math.min(30,row+1)*5+2];
 const dx=b[0]-a[0],dz=b[2]-a[2],len=Math.hypot(dx,dz);
 if(len<1e-6)throw Error('AH degenerate genuine B48 road tangent');
 return [-dz/len,0,dx/len];
}
function bandLength(road,a,b){
 let total=0,old=sample(road,a,.5);
 for(let k=1;k<=96;k++){
  const next=sample(road,a+(b-a)*k/96,.5);
  total+=distance(old,next);old=next;
 }
 return total;
}
const atWidth=(road,u)=>distance(sample(road,u,0),sample(road,u,1));
export function generateG4E7AH(id='r2-control'){
 const variant=AH_VARIANTS.find(v=>v.id===id);
 if(!variant)throw Error('unknown G4E-7AH physical trial');
 const base=generateG4E7ACR2('approach-arc'),doc=structuredClone(base),
  road=doc.surfaces[0],old=base.surfaces[0],
  changedRows=[];
 let maxCenterShift=0,maxActualWidthReduction=0;
 for(let row=0;row<31;row++){
  const u=row/30,entry=pulse(u,.16,.49),exit=pulse(u,.70,.90),
    squeeze=Math.max(entry,exit);
  if(squeeze<1e-9)continue;
  const center=old.points[row*5+2],
    originalWidth=distance(old.points[row*5],old.points[row*5+4]),
    widthScale=variant.minimumWidth>0
     ?1-squeeze*(1-Math.min(1,variant.minimumWidth/originalWidth)):1,
    // S-shaped lateral move is explicitly REAL physics, not camera/route fake.
    shift=variant.shift*(entry-.72*exit),
    lateral=outboard(old.points,row);
  if(Math.abs(shift)<1e-9&&Math.abs(1-widthScale)<1e-9)continue;
  changedRows.push(row);
  maxCenterShift=Math.max(maxCenterShift,Math.abs(shift));
  maxActualWidthReduction=Math.max(maxActualWidthReduction,originalWidth*(1-widthScale));
  for(let col=0;col<5;col++){
   const p=old.points[row*5+col],d=p.map((x,k)=>x-center[k]);
   road.points[row*5+col]=[
     center[0]+widthScale*d[0]+shift*lateral[0],
     center[1]+widthScale*d[1],
     center[2]+widthScale*d[2]+shift*lateral[2]
   ];
  }
 }
 for(let i=0;i<22;i++)doc.route[i]=sample(road,(i+.015)/22,.5);
 const gap=base.stageForge.g4e7acR2Study.gap,
  a=sample(road,gap.uTakeoff,.5),b=sample(road,gap.uLanding,.5),
  mid=sample(road,(gap.uTakeoff+gap.uLanding)*.5,.5);
 const widths=[
  ...Array.from({length:81},(_,k)=>atWidth(road,.16+.33*k/80)),
  ...Array.from({length:81},(_,k)=>atWidth(road,.70+.20*k/80))
 ];
 const minimumPhysicalWidth=Math.min(...widths),
  narrowCoreLength=bandLength(road,.16,.49)+bandLength(road,.70,.90);
 if(!eq(a,sample(old,gap.uTakeoff,.5))||
    !eq(b,sample(old,gap.uLanding,.5))||
    !eq(road.points.slice(15*5,22*5),old.points.slice(15*5,22*5))||
    !eq(road.points.slice(0,5*5),old.points.slice(0,5*5))||
    !eq(road.points.slice(28*5),old.points.slice(28*5))||
    !eq(doc.surfaces.slice(1),base.surfaces.slice(1))||
    !eq(doc.movingObstacles,base.movingObstacles)||
    !eq(doc.spawns,base.spawns)||
    !eq(doc.routeSegments,base.routeSegments)||
    !eq(doc.route.slice(22),base.route.slice(22))||
    road.voidLongitudinalCells?.join(',')!=='52'||
    doc.surfaces.length!==7||doc.movingObstacles.length!==28||
    tessellate(road).degenerate!==0||
    distance(a,b)<2.5||distance(a,b)>17||
    atWidth(road,gap.uTakeoff)<10||
    contacts(compile(doc),[mid[0],mid[1]+.65,mid[2]],.65)
      .some(c=>c.triangle.rideable))
  throw Error('AH genuine B48 protected jump/7-road/28-hazard invariant');
 if(id!=='r2-control'&&(maxActualWidthReduction<=2||
    minimumPhysicalWidth<10||minimumPhysicalWidth>13.5||
    changedRows.length<9))
  throw Error('AH narrow road is not real playable-scale 10–13.5m geometry');
 if(id==='pinch-switch'&&maxCenterShift<5)throw Error('AH true switchback did not move the real B48');
 const trial={id,source:'G4E7AC_R2_APPROACH_ARC_FULL_7_ROAD_SUCCESS',
  geometry:'TRUE_B48_COLLISION_ROAD_NOT_GRAPHIC',
  widthMinMeters:Number(minimumPhysicalWidth.toFixed(3)),
  physicalWidthReductionMeters:Number(maxActualWidthReduction.toFixed(3)),
  centerShiftMeters:Number(maxCenterShift.toFixed(3)),
  changedRows,gap,entryBandU:[.16,.49],landingBandU:[.70,.90],
  candidateBandArcMeters:Number(narrowCoreLength.toFixed(2)),
  formalSlope2LengthMeters:0,
  originalLipLandingExact:true,realMissingLongitudinalCell52:true,
  original7Roads:true,original28MovingHazards:true,
  localCausality:'UNTESTED',full240Hz:'UNTESTED',manualHuman:'HOLD',
  visualArt:'HOLD',certifiedSlope2Meters:0,publish:'HOLD'};
 doc.name='G4E-7AH '+id+' real B48 10–13m width / NOT APPROVED';
 doc.stageForge={...doc.stageForge,revision:'W9C2-G4E7AH-'+id.toUpperCase(),
   recordStageId:'VB-P101-A13-W9C2-G4E7AH-'+id.toUpperCase(),
   productionPromoted:false,g4e7ahStudy:trial};
 return validate(doc);
}

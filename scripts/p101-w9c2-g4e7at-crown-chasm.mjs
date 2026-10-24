/** G4E-7AT: CROWN THREAD + CHASM SWEEP.
 * Independently sculpt the SECOND full road's real B48 collision mesh into
 * two major 14–16m threads with S-bends, crossfall, crest/drop. Keep existing
 * AS true gap, other 6 roads, P101 control law and actual 28 B51 hazards.
 * Physical obstacles on the changed road move/rotate WITH their road frames.
 * NO invisible helper floor, auto steering, boost, production promotion.
 */
import {generateG4E7AS} from './p101-w9c2-g4e7as-banked-serpent.mjs';
import {AJ_ROADS} from './p101-w9c2-g4e7aj-reanchor-moving.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
import {validateMovingObstacle} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {P95_HAZARD_SPECS} from '../web/p95-hazard-layout.mjs';
import {A13_HAZARD_SPECS,a13MachineId} from '../web/p101-a13-hazard-layout.mjs';
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const len=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
const sin=Math.sin,PI=Math.PI;
export const AT_WINDOWS=Object.freeze([
 Object.freeze({id:'CROWN_THREAD',u0:.09,u1:.15,u2:.31,u3:.39,
  targetWidth:11.4,side:23,vertical:16,bank:2.8}),
 Object.freeze({id:'CHASM_SWEEP',u0:.54,u1:.63,u2:.82,u3:.92,
  targetWidth:14.6,side:-27,vertical:-23,bank:-3.2})
]);
const smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t);};
const envelope=(u,w)=>u<=w.u0||u>=w.u3?0:
  u<w.u1?smooth((u-w.u0)/(w.u1-w.u0)):
  u<=w.u2?1:smooth((w.u3-u)/(w.u3-w.u2));
function side(s,u){
 const a=sample(s,clamp(u-.002,0,1),.5),b=sample(s,clamp(u+.002,0,1),.5),
  d=[b[0]-a[0],0,b[2]-a[2]],m=Math.hypot(...d);
 if(m<1)throw Error('AT road horizontal tangent degenerate');
 return [-d[2]/m,0,d[0]/m];
}
function yawDiff(a,b){const cross=a[0]*b[2]-a[2]*b[0],dot=a[0]*b[0]+a[2]*b[2];return Math.atan2(cross,dot)*180/PI;}
function physicalLength(s,u0,u1){
 let previous=sample(s,u0,.5),sum=0;
 for(let i=1;i<=160;i++){const p=sample(s,u0+(u1-u0)*i/160,.5);sum+=len(p,previous);previous=p;}
 return sum;
}
export function generateG4E7AT(road='true-pinch'){
 if(!AJ_ROADS.includes(road))throw Error('AT unknown physical road');
 const baseline=generateG4E7AS(road),original=JSON.stringify(baseline),
  doc=structuredClone(baseline);
 const idx=1,old=baseline.surfaces[idx],s=doc.surfaces[idx];
 if(!old||old.rows!==31||old.cols!==5||old.voidLongitudinalCells?.length||
    !old.rideable||!old.collidable||doc.surfaces.length!==7||
    doc.movingObstacles.length!==28)throw Error('AT requires intact second real 31x5 B48 surface');
 const changed=[];let maxSide=0,maxY=0,maxBank=0;
 for(let r=0;r<31;r++){
  const u=r/30,w=AT_WINDOWS.find(z=>envelope(u,z)>0);
  if(!w)continue;
  const weight=envelope(u,w),fraction=(u-w.u0)/(w.u3-w.u0),
   originalWidth=len(old.points[r*5],old.points[r*5+4]),
   targetWidth=originalWidth-(originalWidth-w.targetWidth)*weight,
   ratio=targetWidth/originalWidth,
   across=side(old,u),origCenter=old.points[r*5+2],
   lateral=w.side*weight*sin(2*PI*fraction),
   up=w.vertical*weight*sin(PI*fraction),
   tilt=w.bank*weight;
  if(!(ratio>0&&ratio<=1))throw Error('AT second B48 width cannot expand');
  for(let c=0;c<5;c++){
   const pt=old.points[r*5+c],from=pt.map((x,i)=>x-origCenter[i]);
   s.points[r*5+c]=[
    origCenter[0]+ratio*from[0]+across[0]*lateral,
    origCenter[1]+ratio*from[1]+up+tilt*(c-2)/2,
    origCenter[2]+ratio*from[2]+across[2]*lateral
   ];
  }
  changed.push(r);
  maxSide=Math.max(maxSide,Math.abs(lateral));maxY=Math.max(maxY,Math.abs(up));
  maxBank=Math.max(maxBank,Math.abs(tilt));
 }
 // Second road authored guide, not auto-centering assist: update 22 of 155
 // route points only; preserve all others exactly, including the first gap.
 if(doc.route.length!==155)throw Error('AT route expected canonical 155 points');
 for(let k=0;k<22;k++)doc.route[22+k]=sample(s,(k+.015)/22,.5);
 const protectedIds=new Set(),moved=[];
 const specs=[
  ...P95_HAZARD_SPECS.map(([section,u],i)=>({section,u,id:'p95-hazard-'+String(i+1).padStart(2,'0')})),
  ...A13_HAZARD_SPECS.map(([section,u],i)=>({section,u,id:a13MachineId(i)}))
 ];
 for(const station of specs){
  if(station.section!==idx||!AT_WINDOWS.some(w=>envelope(station.u,w)>1e-6))continue;
  const i=doc.movingObstacles.findIndex(o=>o.id===station.id);
  if(i<0||protectedIds.has(station.id))throw Error('AT known moving obstacle provenance missing '+station.id);
  protectedIds.add(station.id);
  const current=baseline.movingObstacles[i],
   oa=sample(old,station.u,.5),na=sample(s,station.u,.5),
   a=side(old,station.u),b=side(s,station.u),
   offset=(current.position[0]-oa[0])*a[0]+(current.position[2]-oa[2])*a[2],
   yaw=yawDiff(a,b),
   newPosition=[na[0]+b[0]*offset,na[1]+current.position[1]-oa[1],na[2]+b[2]*offset];
  // Moving slider direction remains parallel to the new real road edge.
  const motion=current.type==='slider'?{...current.motion,axis:b}:current.motion;
  doc.movingObstacles[i]=validateMovingObstacle({...current,
   position:newPosition,yawDegrees:clamp(current.yawDegrees+yaw,-360,360),motion});
  moved.push({id:station.id,u:station.u,positionDeltaMeters:len(newPosition,current.position),
   yawDeltaDegrees:yaw});
 }
 const widths=AT_WINDOWS.map(w=>{
  let min=Infinity,max=0;
  for(let i=0;i<=60;i++){
   const u=w.u1+(w.u2-w.u1)*i/60,d=len(sample(s,u,0),sample(s,u,1));
   min=Math.min(min,d);max=Math.max(max,d);
  }
  return {id:w.id,min,max,arcLengthMeters:physicalLength(s,w.u0,w.u3),
   narrowCoreArcMeters:physicalLength(s,w.u1,w.u2)};
 });
 const invariant={
  actualRoad:changed.length>=16&&maxSide>=8&&maxY>=10&&maxBank>=2.5,
  physicalMeshes:tessellate(s).degenerate===0,
  actualThinCorridors:widths.every(x=>x.min>=11&&x.max<=16.5&&x.narrowCoreArcMeters>110),
  worldRoadCount:doc.surfaces.length===7,
  authentic28B51:doc.movingObstacles.length===28,
  frozenGapAndFirstRoad:eq(doc.surfaces[0],baseline.surfaces[0]),
  downstream5Frozen:eq(doc.surfaces.slice(2),baseline.surfaces.slice(2)),
  roadEndpointsOriginal:eq(s.points.slice(0,5),old.points.slice(0,5))&&
    eq(s.points.slice(-5),old.points.slice(-5)),
  spawnFrozen:eq(doc.spawns,baseline.spawns),
  segmentsFrozen:eq(doc.routeSegments,baseline.routeSegments),
  untouchedRoutes:eq(doc.route.slice(0,22),baseline.route.slice(0,22))&&
    eq(doc.route.slice(44),baseline.route.slice(44)),
  restOfMoversFrozen:eq(doc.movingObstacles.filter(o=>!protectedIds.has(o.id)),
    baseline.movingObstacles.filter(o=>!protectedIds.has(o.id))),
  movedActualB51:moved.length>=3&&moved.every(x=>x.positionDeltaMeters>.5),
  originalImmutable:JSON.stringify(baseline)===original,
  stageHeld:baseline.stageForge.productionPromoted===false
 };
 const fails=Object.entries(invariant).filter(([,v])=>!v).map(([k])=>k);
 if(fails.length)throw Error('AT invariant mismatch: '+fails.join(', ')+
  ' | '+JSON.stringify({widths,changedRows:changed.length,maxSide,maxY,maxBank,moved}));
 doc.stageForge={...doc.stageForge,
  revision:'W9C2-G4E7AT-'+road.toUpperCase(),
  recordStageId:'VB-P101-A13-W9C2-G4E7AT-'+road.toUpperCase()+'-CROWN-CHASM',
  productionPromoted:false,
  g4e7atStudy:{id:'crown-chasm',road,source:'G4E7AS_TRUE_B48_28B51_REAL_GAP',
   actualPhysicalSecondRoad:true,physicalSections:2,
   moduleSpans:AT_WINDOWS.map((w,i)=>({...w,
    envelopeArcMeters:Number(widths[i].arcLengthMeters.toFixed(2)),
    narrowCoreArcMeters:Number(widths[i].narrowCoreArcMeters.toFixed(2)),
    actualCoreWidthMinMeters:Number(widths[i].min.toFixed(2)),
    actualCoreWidthMaxMeters:Number(widths[i].max.toFixed(2))})),
   changedRows:changed,actualMovingObstaclesRelocated:moved,
   movingUnchangedCount:28-moved.length,
   sourceGapCell52Unchanged:true,authoredRoads:7,totalNativeB51:28,
   normalStart00FullClear:'UNVERIFIED',native240Hz:'UNTESTED',
   formalSlope2Meters:0,humanQA:'HOLD',artQA:'HOLD',publish:'HOLD'}};
 doc.name='G4E-7AT CROWN THREAD > CHASM SWEEP / '+road+' / real two-road physical prototype / HOLD';
 return validate(doc);
}

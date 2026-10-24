/** G4E-7AX — LONG CROWN: rebuild road 2 as a real high-speed approach,
 * not another lateral translation of AT's 90m/s tight turn.
 *
 * Replace the first half of its B48 31x5 physical tessellation with a single
 * tangent-continuous, authored long lead-in, smooth narrow corridor and a
 * later S-arc. Leave the second CHASM module (u >= .5), road1's real gap 52,
 * six other roads, gameplay physics and all native B51 types intact.
 *
 * No ghost bridges, middle safe belt, velocity reset, auto steering, camera
 * tricks or stage promotion. This is a private GAMEPLAY DESIGN hypothesis.
 */
import {generateG4E7AV} from './p101-w9c2-g4e7av-crest-shaping.mjs';
import {AJ_ROADS} from './p101-w9c2-g4e7aj-reanchor-moving.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
import {validateMovingObstacle} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {P95_HAZARD_SPECS} from '../web/p95-hazard-layout.mjs';
import {A13_HAZARD_SPECS,a13MachineId} from '../web/p101-a13-hazard-layout.mjs';

const dist=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const smooth=x=>{x=clamp(x,0,1);return x*x*(3-2*x)};
const mix=(a,b,t)=>a+(b-a)*t;
const rad=Math.PI;
export const AX_LAYOUTS=Object.freeze({
  longLead:Object.freeze({id:'longLead',sweepMeters:6,bankMeters:1.5,crestMeters:4.5}),
  wideArc:Object.freeze({id:'wideArc',sweepMeters:13,bankMeters:2.0,crestMeters:7.0})
});
export const AX_STATIONS=Object.freeze([
  Object.freeze({u:0,width:'original'}),
  Object.freeze({u:.09,width:'original*0.78'}),
  Object.freeze({u:.16,width:42}),
  Object.freeze({u:.23,width:23}),
  Object.freeze({u:.29,width:14.3}),
  Object.freeze({u:.39,width:14.3}),
  Object.freeze({u:.45,width:35}),
  Object.freeze({u:.50,width:'original'})
]);
function effectiveWidth(u,original){
 const knots=[[0,original],[.09,original*.78],[.16,42],[.23,23],
 [.29,14.3],[.39,14.3],[.45,35],[.50,original]];
 for(let j=1;j<knots.length;j++)if(u<=knots[j][0]){
  const [ua,wa]=knots[j-1],[ub,wb]=knots[j],t=smooth((u-ua)/(ub-ua));
  return Math.min(original,mix(wa,wb,t));
 }
 return original;
}
function hermite(a,b,ma,mb,t){
 const t2=t*t,t3=t2*t;
 return a.map((v,i)=>(2*t3-3*t2+1)*v+(t3-2*t2+t)*ma[i]+
  (-2*t3+3*t2)*b[i]+(t3-t2)*mb[i]);
}
function tangentAt(s,u){
 const a=sample(s,clamp(u-.002,0,1),.5),b=sample(s,clamp(u+.002,0,1),.5),
  v=[b[0]-a[0],0,b[2]-a[2]],l=Math.hypot(...v);
 if(l<.0001)throw Error('AX degenerate real horizontal road tangent');
 return [-v[2]/l,0,v[0]/l];
}
function turn(a,b){
 return Math.atan2(a[0]*b[2]-a[2]*b[0],a[0]*b[0]+a[2]*b[2])*180/rad;
}
function arcLength(s,a,b){
 let sum=0,old=sample(s,a,.5);
 for(let i=1;i<=120;i++){const p=sample(s,mix(a,b,i/120),.5);sum+=dist(p,old);old=p;}
 return sum;
}
export function generateG4E7AX(road='true-pinch',variant='longLead'){
 if(!AJ_ROADS.includes(road)||!Object.hasOwn(AX_LAYOUTS,variant))
  throw Error('AX unsupported road or private design');
 const cfg=AX_LAYOUTS[variant],base=generateG4E7AV(road,'lineSoft'),
  original=JSON.stringify(base),doc=structuredClone(base),from=base.surfaces[1],to=doc.surfaces[1],
  count=from.rows-1;
 if(count!==30||from.cols!==5||doc.surfaces.length!==7||
    doc.movingObstacles.length!==28||from.voidLongitudinalCells?.length||
    doc.surfaces[0].voidLongitudinalCells?.join(',')!=='52')
  throw Error('AX needs actual 7 B48 roads 28 B51 and intact first-road gap');
 const centers=Array.from({length:from.rows},(_,i)=>from.points[i*5+2]),
  endIndex=15,
  m0=centers[1].map((x,i)=>(x-centers[0][i])*endIndex),
  m1=centers[16].map((x,i)=>(x-centers[14][i])*endIndex/2),
  changedRows=[];
 let greatestPhysicalShift=0;
 for(let i=0;i<=endIndex;i++){
  const u=i/count,t=i/endIndex,oldCenter=centers[i],
   originalWidth=dist(from.points[i*5],from.points[i*5+4]),
   contracted=effectiveWidth(u,originalWidth),
   center=hermite(centers[0],centers[endIndex],m0,m1,t),
   // Long, single S-bend with zero amplitude at both endpoints.
   arc=cfg.sweepMeters*Math.sin(t*2*rad)*Math.sin(t*rad)**2,
   deriv=hermite(centers[0],centers[endIndex],m0,m1,clamp(t+.001,0,1)),
   back=hermite(centers[0],centers[endIndex],m0,m1,clamp(t-.001,0,1)),
   delta=[deriv[0]-back[0],0,deriv[2]-back[2]],norm=Math.hypot(...delta),
   side=norm>1e-5?[-delta[2]/norm,0,delta[0]/norm]:tangentAt(from,u),
   newCenter=[center[0]+side[0]*arc,
    center[1]+cfg.crestMeters*Math.sin(t*rad)**2,center[2]+side[2]*arc],
   normalBlend=smooth((.50-u)/.075),
   startBlend=smooth(u/.05),blend=startBlend*normalBlend;
  // Preserve exact endpoints / tangent continuity into untouched CHASM.
  if(i===0||i===endIndex)continue;
  for(let c=0;c<from.cols;c++){
   const prior=from.points[i*5+c],f=(c-2)/4,
    authored=[newCenter[0]+side[0]*f*contracted,
     newCenter[1]+(prior[1]-oldCenter[1])*(contracted/originalWidth)+
      cfg.bankMeters*(c-2)/2*Math.sin(t*rad)**2,
     newCenter[2]+side[2]*f*contracted],
    result=prior.map((x,j)=>mix(x,authored[j],blend));
   to.points[i*5+c]=result;
   greatestPhysicalShift=Math.max(greatestPhysicalShift,dist(result,prior));
  }
  if(blend>0)changedRows.push(i);
 }
 for(let i=0;i<22;i++)doc.route[22+i]=sample(to,(i+.015)/22,.5);
 // Both native obstacles stationed in CROWN change along with this road.
 const stations=[
 ...P95_HAZARD_SPECS.map(([section,u],i)=>({section,u,id:'p95-hazard-'+String(i+1).padStart(2,'0')})),
 ...A13_HAZARD_SPECS.map(([section,u],i)=>({section,u,id:a13MachineId(i)}))
 ].filter(v=>v.section===1&&v.u<.5);
 const moved=[];
 for(const {u,id} of stations){
  const index=doc.movingObstacles.findIndex(x=>x.id===id);
  if(index<0)throw Error('AX missing true B51 '+id);
  const prev=base.movingObstacles[index],oldPoint=sample(from,u,.5),
   nextPoint=sample(to,u,.5),a=tangentAt(from,u),b=tangentAt(to,u),
   offset=(prev.position[0]-oldPoint[0])*a[0]+(prev.position[2]-oldPoint[2])*a[2],
   position=[nextPoint[0]+b[0]*offset,nextPoint[1]+prev.position[1]-oldPoint[1],
    nextPoint[2]+b[2]*offset],
   degrees=turn(a,b);
  doc.movingObstacles[index]=validateMovingObstacle({...prev,position,
   yawDegrees:clamp(prev.yawDegrees+degrees,-360,360),
   motion:prev.type==='slider'?{...prev.motion,axis:b}:prev.motion});
  moved.push({id,u,positionMeters:Number(dist(position,prev.position).toFixed(3)),
   yawDeltaDegrees:Number(degrees.toFixed(3))});
 }
 const widths=[];
 for(const [u0,u1,label] of [[.29,.39,'CROWN_LONG_CORE'],[.63,.82,'CHASM_PRESERVED']]){
  let min=Infinity,max=0;
  for(let i=0;i<=80;i++){
   const u=mix(u0,u1,i/80),w=dist(sample(to,u,0),sample(to,u,1));
   min=Math.min(w,min);max=Math.max(w,max);
  }
  widths.push({id:label,minMeters:Number(min.toFixed(3)),maxMeters:Number(max.toFixed(3)),
   physicalArcMeters:Number(arcLength(to,u0,u1).toFixed(3))});
 }
 const modified=new Set(stations.map(x=>x.id));
 const checks={
  trueNewGeometry:changedRows.length>=10&&greatestPhysicalShift>=10,
  physicsMeshValid:tessellate(to).degenerate===0,
  preserveWholeFirstRoad:same(doc.surfaces[0],base.surfaces[0]),
  preserveFiveFollowing:same(doc.surfaces.slice(2),base.surfaces.slice(2)),
  preserveCHASMRows:same(to.points.slice(16*5),from.points.slice(16*5)),
  preserveEndpoints:same(to.points.slice(0,5),from.points.slice(0,5))&&
   same(to.points.slice(15*5,16*5),from.points.slice(15*5,16*5)),
  preserveRealGap:same(doc.surfaces[0].voidLongitudinalCells,[52]),
  holdThinPhysicalCore:widths.length===2&&widths.every(x=>x.minMeters>11&&x.maxMeters<18&&x.physicalArcMeters>100),
  twoNativeObstaclesRebased:moved.length===2&&moved.every(x=>x.positionMeters>.5),
  other26B51Frozen:same(doc.movingObstacles.filter(x=>!modified.has(x.id)),
   base.movingObstacles.filter(x=>!modified.has(x.id))),
  originalGameSpawns:same(doc.spawns,base.spawns),
  guidesOutsideRoad2Frozen:same(doc.route.slice(0,22),base.route.slice(0,22))&&
   same(doc.route.slice(44),base.route.slice(44)),
  segmentMetadataFrozen:same(doc.routeSegments,base.routeSegments),
  protectedBaseUnchanged:JSON.stringify(base)===original,
  gameCollidersUnchangedCount:doc.surfaces.length===7&&doc.movingObstacles.length===28,
  notPromoted:base.stageForge.productionPromoted===false
 };
 const bad=Object.entries(checks).filter(([,ok])=>!ok).map(([k])=>k);
 if(bad.length)throw Error('AX real long transition invariant: '+bad.join(',')+' '+JSON.stringify({widths,moved,greatestPhysicalShift,changedRows}));
 doc.name='G4E-7AX LONG CROWN / physical 300m early approach / '+variant+' / HUMAN HOLD';
 doc.stageForge={...doc.stageForge,revision:'W9C2-G4E7AX-'+variant.toUpperCase(),
  recordStageId:'VB-P101-A13-W9C2-G4E7AX-'+road.toUpperCase()+'-'+variant.toUpperCase(),
  productionPromoted:false,
  g4e7axStudy:{id:'long-crown-real-b48',variant,road,privateOnly:true,
   start00FromAV:true,actualPhysicalEarlyApproach:true,
   layoutStations:AX_STATIONS,entryTransitionU:[.05,.29],
   actualNarrowCoreU:[.29,.39],physicalCoreMeasures:widths,
   modifiedRows:changedRows,maxB48ShiftMeters:+greatestPhysicalShift.toFixed(2),
   relocatedPhysicalB51:moved,otherPhysicalB51Frozen:26,
   actual7Roads:true,actual28Moving:true,gapCell52Unchanged:true,
   formalSlope2Meters:0,humanQA:'HOLD',artQA:'HOLD',publish:'HOLD'}};
 return validate(doc);
}

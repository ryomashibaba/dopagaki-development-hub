/** G4E-7BD — actual full-width physical second B48 CROWN-to-CHASM section.
 * Source is BC rollDeck, not an invisible support / game-force correction.
 * Long-radius Hermite road axis, genuine narrowing and cambered 14-16m CHASM.
 */
import {generateG4E7BC} from './p101-w9c2-g4e7bc-bank-contour.mjs';
import {AJ_ROADS} from './p101-w9c2-g4e7aj-reanchor-moving.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
import {validateMovingObstacle} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {P95_HAZARD_SPECS} from '../web/p95-hazard-layout.mjs';
import {A13_HAZARD_SPECS,a13MachineId} from '../web/p101-a13-hazard-layout.mjs';
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const dist=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const mix=(a,b,t)=>a+(b-a)*t;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const ease=v=>{const t=clamp(v,0,1);return t*t*(3-2*t);};
const unit=v=>{const n=Math.hypot(...v);return v.map(x=>x/(n||1));};
const side=dir=>unit([-dir[2],0,dir[0]]);
function hermite(p0,p1,m0,m1,t){
 const t2=t*t,t3=t2*t;
 return p0.map((v,i)=>(2*t3-3*t2+1)*v+(t3-2*t2+t)*m0[i]+
  (-2*t3+3*t2)*p1[i]+(t3-t2)*m1[i]);
}
function physicalWidth(u,entry,exit){
 // Real 3D width from wide CROWN to 14-16m genuine CHASM; never a hidden lane.
 const knots=[[.5,entry],[.56,69],[.60,31],[.645,15.4],[.72,14.7],[.80,15.1],[26/30,exit]];
 for(let k=1;k<knots.length;k++)if(u<=knots[k][0]){
  const [x,w]=knots[k],prev=knots[k-1];
  return mix(prev[1],w,ease((u-prev[0])/(x-prev[0])));
 }
 return exit;
}
function physicalSide(surface,u){
 const p=sample(surface,clamp(u-.002,0,1),.5),q=sample(surface,clamp(u+.002,0,1),.5);
 return side(sub(q,p));
}
function corridor(surface,a,b){
 let min=Infinity,max=0,arc=0,prev=sample(surface,a,.5);
 for(let i=0;i<=90;i++){
  const u=mix(a,b,i/90),p=sample(surface,u,.5),w=dist(sample(surface,u,0),sample(surface,u,1));
  min=Math.min(min,w);max=Math.max(max,w);
  if(i)arc+=dist(p,prev);
  prev=p;
 }
 return {u0:a,u1:b,min:+min.toFixed(3),max:+max.toFixed(3),arcMeters:+arc.toFixed(2)};
}
export const BD_DESIGNS=Object.freeze({
 longArc:Object.freeze({name:'longArc',flowBlend:.75,bankReduction:.65,gradeMeters:0}),
 descentSweep:Object.freeze({name:'descentSweep',flowBlend:1,bankReduction:.8,gradeMeters:-2.5})
});
export function generateG4E7BD(road='true-pinch',design='longArc'){
 if(!AJ_ROADS.includes(road)||!Object.hasOwn(BD_DESIGNS,design))
  throw Error('BD invalid physical road/design');
 const cfg=BD_DESIGNS[design],source=generateG4E7BC(road,'rollDeck'),
  frozen=JSON.stringify(source),doc=structuredClone(source),s=doc.surfaces[1],
  original=source.surfaces[1],cols=5,a=15,b=26,span=b-a,
  center=Array.from({length:31},(_,row)=>original.points[row*cols+2]),
  start=center[a],end=center[b],
  inVel=sub(center[a],center[a-1]).map(v=>v*span*1.04),
  outVel=sub(center[b+1],center[b-1]).map(v=>v*span*.48),
  widthEntry=dist(original.points[a*cols],original.points[a*cols+4]),
  widthExit=dist(original.points[b*cols],original.points[b*cols+4]),
  changed=[],moved=[];
 if(s.rows!==31||s.cols!==5||doc.surfaces.length!==7||doc.movingObstacles.length!==28||
  doc.surfaces[0].voidLongitudinalCells?.join(',')!=='52'||
  source.stageForge.g4e7bcStudy?.variant!=='rollDeck'||
  doc.stageForge.productionPromoted!==false)
  throw Error('BD physical provenance must be protected BC rollDeck');
 let peak3DShift=0;
 for(let row=a+1;row<b;row++){
  const t=(row-a)/span,u=row/30,mask=Math.sin(Math.PI*t)**2,
   c=hermite(start,end,inVel,outVel,t),
   // Continuous actual road: anchor original endpoints, ease the physical turn.
   targetCenter=center[row].map((v,k)=>mix(v,c[k],cfg.flowBlend*mask)),
   before=hermite(start,end,inVel,outVel,clamp(t-.002,0,1)),
   after=hermite(start,end,inVel,outVel,clamp(t+.002,0,1)),
   tangent=sub(after,before),
   cross=side(tangent),
   targetWidth=physicalWidth(u,widthEntry,widthExit),
   baseWidth=dist(original.points[row*cols],original.points[row*cols+4]),
   bankScale=1-cfg.bankReduction*mask,
   grade=cfg.gradeMeters*mask,
   oldCross=sub(original.points[row*cols+4],original.points[row*cols]);
  for(let col=0;col<cols;col++){
   const prior=original.points[row*cols+col],fraction=(col-2)/4,
    reducedDY=(prior[1]-center[row][1])*bankScale*targetWidth/baseWidth,
    p=[targetCenter[0]+cross[0]*fraction*targetWidth,
       targetCenter[1]+grade+reducedDY,
       targetCenter[2]+cross[2]*fraction*targetWidth];
   peak3DShift=Math.max(peak3DShift,dist(p,prior));
   s.points[row*cols+col]=p;
  }
  changed.push(row);
 }
 for(let i=0;i<22;i++)doc.route[22+i]=sample(s,(i+.015)/22,.5);
 const stations=[
  ...P95_HAZARD_SPECS.map(([section,u],i)=>({section,u,id:'p95-hazard-'+String(i+1).padStart(2,'0')})),
  ...A13_HAZARD_SPECS.map(([section,u],i)=>({section,u,id:a13MachineId(i)}))
 ].filter(x=>x.section===1&&x.u>a/30&&x.u<b/30);
 for(const {id,u} of stations){
  const index=doc.movingObstacles.findIndex(x=>x.id===id);
  if(index<0)throw Error('BD missing actual B51 '+id);
  const old=source.movingObstacles[index],o=sample(original,u,.5),n=sample(s,u,.5),
   from=physicalSide(original,u),to=physicalSide(s,u),
   lateral=(old.position[0]-o[0])*from[0]+(old.position[2]-o[2])*from[2],
   position=[n[0]+lateral*to[0],n[1]+old.position[1]-o[1],n[2]+lateral*to[2]],
   rotationDelta=Math.atan2(from[0]*to[2]-from[2]*to[0],from[0]*to[0]+from[2]*to[2])*180/Math.PI;
  doc.movingObstacles[index]=validateMovingObstacle({...old,position,
   yawDegrees:clamp(old.yawDegrees+rotationDelta,-360,360),
   motion:old.type==='slider'?{...old.motion,axis:to}:old.motion});
  moved.push({id,u,deltaM:+dist(position,old.position).toFixed(3)});
 }
 const core=corridor(s,.68,.80),transition=corridor(s,.56,.66),
  movedIDs=new Set(stations.map(x=>x.id));
 const checks={
  truePhysicalRemake:changed.length===10&&peak3DShift>3,
  realMeshNonDegenerate:tessellate(s).degenerate===0,
  realNarrowChasm:core.min>10&&core.max<19&&core.arcMeters>60,
  coherentPhysicalTaper:transition.min>10&&transition.max<80&&transition.arcMeters>60,
  firstRoadFrozen:same(doc.surfaces[0],source.surfaces[0]),
  fiveOtherRoadsFrozen:same(doc.surfaces.slice(2),source.surfaces.slice(2)),
  priorCrownFrozen:same(s.points.slice(0,(a+1)*cols),original.points.slice(0,(a+1)*cols)),
  lateChasmExitFrozen:same(s.points.slice(b*cols),original.points.slice(b*cols)),
  noMissingOriginalGap:same(doc.surfaces[0].voidLongitudinalCells,[52]),
  allRealRoads:doc.surfaces.length===7,
  allRealB51:doc.movingObstacles.length===28,
  nativeTwoMoverReanchor:moved.length===2,
  other26B51Frozen:same(doc.movingObstacles.filter(x=>!movedIDs.has(x.id)),
   source.movingObstacles.filter(x=>!movedIDs.has(x.id))),
  startsUnchanged:same(doc.spawns,source.spawns),
  otherGuideFrozen:same(doc.route.slice(0,22),source.route.slice(0,22))&&
    same(doc.route.slice(44),source.route.slice(44)),
  routeSegmentsFrozen:same(doc.routeSegments,source.routeSegments),
  immutableBase:JSON.stringify(source)===frozen,
  noPublish:source.stageForge.productionPromoted===false
 };
 const failures=Object.entries(checks).filter(([,passed])=>!passed).map(([x])=>x);
 if(failures.length)throw Error('BD real CHASM invariant: '+failures.join(',')+
  ' '+JSON.stringify({core,transition,peak3DShift,moved}));
 doc.name='G4E-7BD '+design+' / actual B48 CHASM long-radius canyon, PRIVATE HUMAN HOLD';
 doc.stageForge={...doc.stageForge,revision:'W9C2-G4E7BD-'+design.toUpperCase(),
  recordStageId:'VB-P101-A13-W9C2-G4E7BD-'+road.toUpperCase()+'-'+design.toUpperCase(),
  productionPromoted:false,g4e7bdStudy:{
   id:'full-3d-crown-chasm-join',road,design,source:'BC_ROLLDECK',
   realRoadSectionU:[a/30,b/30],realChangedRows:changed,
   narrowCore:core,entranceCore:transition,peak3DShiftMeters:+peak3DShift.toFixed(3),
   realB51Relocation:moved,otherB51Frozen:26,
   originalVoidCell52:true,real7B48:true,real28B51:true,
   formalSlope2Meters:0,humanQA:'HOLD',artQA:'HOLD',publish:'HOLD'}};
 return validate(doc);
}

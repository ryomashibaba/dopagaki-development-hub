/** G4E-7BA PRIVATE — sculpt genuine B48 left-catchment from AY bankedSweep,
 * not AZ. Actual u=.267-.600 corridor remains narrow and physical.
 * No hidden support, steering forces, speed changes or gameplay controls.
 */
import {generateG4E7AY} from './p101-w9c2-g4e7ay-tangent-bridge.mjs';
import {AJ_ROADS} from './p101-w9c2-g4e7aj-reanchor-moving.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
import {validateMovingObstacle} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {P95_HAZARD_SPECS} from '../web/p95-hazard-layout.mjs';
import {A13_HAZARD_SPECS,a13MachineId} from '../web/p101-a13-hazard-layout.mjs';

const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const mix=(a,b,t)=>a+(b-a)*t;
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
const sm=t=>{t=clamp(t,0,1);return t*t*(3-2*t)};
const distance=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
const unit=v=>{const l=Math.hypot(...v);return v.map(x=>x/(l||1));};
const sideways=v=>unit([-v[2],0,v[0]]);
const pi=Math.PI;
export const BA_VERSIONS=Object.freeze({
 outerContour:Object.freeze({id:'outerContour',sideMeters:9,elevationMeters:-1.5,bankMeters:1.5}),
 cliffBowl:Object.freeze({id:'cliffBowl',sideMeters:13,elevationMeters:-3,bankMeters:3.0})
});
function hermite(a,b,ma,mb,t){
 const t2=t*t,t3=t2*t;
 return a.map((x,i)=>(2*t3-3*t2+1)*x+(t3-2*t2+t)*ma[i]+
 (-2*t3+3*t2)*b[i]+(t3-t2)*mb[i]);
}
function edge(s,u){
 const a=sample(s,clamp(u-.002,0,1),.5),b=sample(s,clamp(u+.002,0,1),.5),
 dir=[b[0]-a[0],0,b[2]-a[2]];
 if(Math.hypot(...dir)<.0001)throw Error('BA physical road direction invalid');
 return sideways(dir);
}
function width(u,w0,w1){
 // Conserve real 14–16m CROWN and CHASM narrow corridors, but let players
 // anticipate the later dive in a 25–30m wide *physical* mid-transition.
 const knots=[[7/30,w0],[.30,30],[.34,14.1],[.46,14.1],
  [.50,22],[.54,21],[.60,14.4],[19/30,w1]];
 for(let j=1;j<knots.length;j++){
  const [u1,b]=knots[j];
  if(u<=u1)return mix(knots[j-1][1],b,sm((u-knots[j-1][0])/(u1-knots[j-1][0])));
 }
 return w1;
}
function core(s,u0,u1){
 let min=Infinity,max=0,prev=sample(s,u0,.5),arc=0;
 for(let k=0;k<=120;k++){
  const u=mix(u0,u1,k/120),d=distance(sample(s,u,0),sample(s,u,1));
  min=Math.min(min,d);max=Math.max(max,d);
  if(k){const next=sample(s,u,.5);arc+=distance(prev,next);prev=next;}
 }
 return {u0,u1,min:+min.toFixed(4),max:+max.toFixed(4),arcMeters:+arc.toFixed(2)};
}
export function generateG4E7BA(road='true-pinch',variant='outerContour'){
 if(!AJ_ROADS.includes(road)||!Object.hasOwn(BA_VERSIONS,variant))
  throw Error('BA unsupported physical design');
 const params=BA_VERSIONS[variant],old=generateG4E7AY(road,'bankedSweep'),
  frozen=JSON.stringify(old),doc=structuredClone(old),s=doc.surfaces[1],
  baseline=old.surfaces[1],a=7,b=19,span=b-a;
 if(s.rows!==31||s.cols!==5||doc.surfaces.length!==7||
    doc.movingObstacles.length!==28||doc.surfaces[0].voidLongitudinalCells?.join(',')!=='52'||
    old.stageForge.g4e7ayStudy?.design!=='bankedSweep')
  throw Error('BA must inherit real AY bankedSweep physics');
 const centers=Array.from({length:31},(_,i)=>baseline.points[i*5+2]),
  start=centers[a],end=centers[b],
  v0=start.map((x,k)=>x-centers[a-1][k]),
  v1=centers[b+1].map((x,k)=>x-centers[b-1][k]).map(x=>x/2),
  tangent0=v0.map(x=>x*span*.95),
  tangent1=v1.map(x=>x*span*.95),
  w0=distance(baseline.points[a*5],baseline.points[a*5+4]),
  w1=distance(baseline.points[b*5],baseline.points[b*5+4]);
 let maxDelta=0,changed=[];
 for(let row=a+1;row<b;row++){
  const t=(row-a)/span,u=row/30,originalCenter=centers[row],
   blend=Math.sin(pi*t)**2,
   softened=centers[row].map((v,k)=>(centers[row-1][k]+2*v+centers[row+1][k])/4),
   center0=originalCenter.map((v,k)=>mix(v,softened[k],.4*blend)),
   tangent=centers[row+1].map((v,k)=>v-centers[row-1][k]),
   side=sideways([tangent[0],0,tangent[2]]),
   // Sustained actual-road catchment ahead of u=.35, released by CHASM .633.
   lead=sm((u-.24)/.10),returnToChasm=1-sm((u-.46)/(.6333333333-.46)),
   lateral=-params.sideMeters*lead*returnToChasm,
   center=[center0[0]+side[0]*lateral,
    center0[1]+params.elevationMeters*blend,
    center0[2]+side[2]*lateral],
   originalWidth=distance(baseline.points[row*5],baseline.points[row*5+4]),
   target=width(u,w0,w1);
  for(let col=0;col<5;col++){
   const prior=baseline.points[row*5+col],f=(col-2)/4,
    p=[center[0]+side[0]*target*f,
     center[1]+(prior[1]-originalCenter[1])*target/originalWidth+
       params.bankMeters*(col-2)/2*Math.sin(pi*t)**2,
     center[2]+side[2]*target*f];
   s.points[row*5+col]=p;maxDelta=Math.max(maxDelta,distance(p,prior));
  }
  changed.push(row);
 }
 for(let k=0;k<22;k++)doc.route[22+k]=sample(s,(k+.015)/22,.5);
 const stations=[
 ...P95_HAZARD_SPECS.map(([section,u],i)=>({section,u,id:'p95-hazard-'+String(i+1).padStart(2,'0')})),
 ...A13_HAZARD_SPECS.map(([section,u],i)=>({section,u,id:a13MachineId(i)}))
 ].filter(x=>x.section===1&&x.u>a/30&&x.u<b/30);
 const moved=[];
 for(const {id,u} of stations){
  const index=doc.movingObstacles.findIndex(x=>x.id===id);
  if(index<0)throw Error('BA missing real moving '+id);
  const original=old.movingObstacles[index],oc=sample(baseline,u,.5),nc=sample(s,u,.5),
   os=edge(baseline,u),ns=edge(s,u),
   offset=(original.position[0]-oc[0])*os[0]+(original.position[2]-oc[2])*os[2],
   newPosition=[nc[0]+offset*ns[0],nc[1]+original.position[1]-oc[1],nc[2]+offset*ns[2]],
   yaw=(Math.atan2(os[0]*ns[2]-os[2]*ns[0],os[0]*ns[0]+os[2]*ns[2]))*180/pi;
  doc.movingObstacles[index]=validateMovingObstacle({...original,position:newPosition,
   yawDegrees:clamp(original.yawDegrees+yaw,-360,360),
   motion:original.type==='slider'?{...original.motion,axis:ns}:original.motion});
  moved.push({id,u,meters:+distance(newPosition,original.position).toFixed(3)});
 }
 const kept=new Set(stations.map(x=>x.id));
 const originalCrown=core(baseline,.34,.43),crown=core(s,.34,.43),
  chasm=core(s,.63,.82),dived=core(s,.58,.62);
 const checks={
  realRowRebuild:changed.length===11&&maxDelta>7,
  validPhysicalMesh:tessellate(s).degenerate===0,
  firstRoadAndGapFrozen:eq(doc.surfaces[0],old.surfaces[0])&&eq(doc.surfaces[0].voidLongitudinalCells,[52]),
  downstreamFiveRoadsFrozen:eq(doc.surfaces.slice(2),old.surfaces.slice(2)),
  AYEarlyCrownFrozen:eq(s.points.slice(0,(a+1)*5),baseline.points.slice(0,(a+1)*5)),
  CHASMCoreAndExitFrozen:eq(s.points.slice(b*5),baseline.points.slice(b*5)),
  originalSevenRoads:doc.surfaces.length===7,
  all28B51:doc.movingObstacles.length===28,
  twoNativeMoversCorrected:moved.length===2,
  other26NativeMoversFrozen:eq(doc.movingObstacles.filter(x=>!kept.has(x.id)),
   old.movingObstacles.filter(x=>!kept.has(x.id))),
  spawnsFrozen:eq(doc.spawns,old.spawns),
  nonRoad2RouteFrozen:eq(doc.route.slice(0,22),old.route.slice(0,22))&&eq(doc.route.slice(44),old.route.slice(44)),
  sourceUnmutated:JSON.stringify(old)===frozen,
  naturalLateNarrow:crown.min>10&&crown.max<19&&originalCrown.min>10&&
   chasm.min>11&&chasm.max<18&&dived.min>10&&dived.max<50,
  noPromotion:old.stageForge.productionPromoted===false
 };
 const fails=Object.entries(checks).filter(([,v])=>!v).map(([x])=>x);
 if(fails.length)throw Error('BA real corridor QA: '+fails.join(',')+' '+JSON.stringify({changed,maxDelta,crown,chasm,dived,moved}));
 doc.name='G4E-7BA '+variant+' genuine left-catchment 14m CROWN and CHASM contour / PRIVATE HOLD';
 doc.stageForge={...doc.stageForge,
  revision:'W9C2-G4E7BA-'+variant.toUpperCase(),
  recordStageId:'VB-P101-A13-W9C2-G4E7BA-'+road.toUpperCase()+'-'+variant.toUpperCase(),
  productionPromoted:false,
  g4e7baStudy:{id:'left-catchment-contour',variant,road,base:'G4E7AY_BANKEDSWEEP',
   centerlineLateralCatchMeters:params.sideMeters,contourSpanU:[a/30,b/30],
   changedRealRows:changed,peakRealGeometryShiftMeters:+maxDelta.toFixed(3),
   formerCrownCore:originalCrown,crownCore:crown,chasmCore:chasm,lateDiveCore:dived,
   movedB51:moved,unchangedB51:26,hasRealVoid52:true,
   real7B48:true,real28B51:true,formalSlope2Meters:0,
   humanFairness:'HOLD',art:'HOLD',publish:'HOLD'}};
 return validate(doc);
}

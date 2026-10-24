/** G4E-7AY — long-radius genuine 3D B48 bridge ribbon, not a position sweep.
 * Redesign the WHOLE CROWN middle section (u≈.167-.50), correcting abrupt
 * original ribbon heading into a deliberately gentle transition and later
 * 14–16m thin segment. Physically keep AX's beginning, AV's road1, all CHASM,
 * downstream, native 28 B51, gap cell52; no safety magnet or steering changes.
 */
import {generateG4E7AX} from './p101-w9c2-g4e7ax-long-crown.mjs';
import {AJ_ROADS} from './p101-w9c2-g4e7aj-reanchor-moving.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
import {validateMovingObstacle} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {P95_HAZARD_SPECS} from '../web/p95-hazard-layout.mjs';
import {A13_HAZARD_SPECS,a13MachineId} from '../web/p101-a13-hazard-layout.mjs';

const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const length=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const mix=(a,b,t)=>a+(b-a)*t;
const smooth=v=>{v=clamp(v,0,1);return v*v*(3-2*v);};
const unit=v=>{const l=Math.hypot(...v);return v.map(x=>x/(l||1));};
const side=v=>unit([-v[2],0,v[0]]);
const radians=Math.PI;
export const AY_DESIGNS=Object.freeze({
 tangentDeck:Object.freeze({id:'tangentDeck',sweep:0,crest:-1,bank:0}),
 bankedSweep:Object.freeze({id:'bankedSweep',sweep:5.5,crest:-4,bank:2.3})
});
export const AY_WIDTH_KNOTS=Object.freeze([
 Object.freeze([.16666666666666666,'unchanged-entry']),
 Object.freeze([.22,41]),Object.freeze([.29,31]),Object.freeze([.34,15.3]),
 Object.freeze([.45,15.3]),Object.freeze([.50,'unchanged-exit'])
]);
function hermite(a,b,ma,mb,t){
 const t2=t*t,t3=t2*t;
 return a.map((x,i)=>(2*t3-3*t2+1)*x+(t3-2*t2+t)*ma[i]+
  (-2*t3+3*t2)*b[i]+(t3-t2)*mb[i]);
}
function nativeSide(s,u){
 const a=sample(s,clamp(u-.001,0,1),.5),b=sample(s,clamp(u+.001,0,1),.5),
  v=[b[0]-a[0],0,b[2]-a[2]];
 if(Math.hypot(...v)<.001)throw Error('AY actual B48 road has invalid tangent');
 return side(v);
}
function spanWidth(u,widthAtEntry,widthAtExit){
 const k=[[5/30,widthAtEntry],[.22,41],[.29,31],[.34,15.3],[.45,15.3],[.5,widthAtExit]];
 for(let j=1;j<k.length;j++)if(u<=k[j][0]){
  const [ua,wa]=k[j-1],[ub,wb]=k[j];
  return mix(wa,wb,smooth((u-ua)/(ub-ua)));
 }
 return widthAtExit;
}
function roadLength(s,a,b){
 let old=sample(s,a,.5),sum=0;
 for(let j=1;j<=160;j++){
  const p=sample(s,mix(a,b,j/160),.5);sum+=length(p,old);old=p;
 }
 return sum;
}
export function generateG4E7AY(road='true-pinch',design='tangentDeck'){
 if(!AJ_ROADS.includes(road)||!Object.hasOwn(AY_DESIGNS,design))
  throw Error('AY unsupported real 2nd B48 candidate');
 const cfg=AY_DESIGNS[design],source=generateG4E7AX(road,'longLead'),
  frozen=JSON.stringify(source),doc=structuredClone(source),
  old=source.surfaces[1],s=doc.surfaces[1],a=5,b=15,span=b-a,cols=old.cols;
 if(old.rows!==31||cols!==5||doc.surfaces.length!==7||
    doc.movingObstacles.length!==28||source.stageForge.g4e7axStudy.variant!=='longLead'||
    doc.surfaces[0].voidLongitudinalCells?.join(',')!=='52')throw Error('AY real protected road provenance');
 const points=old.points;
 const p0=points[a*cols+2],p1=points[b*cols+2],
  v0=p0.map((x,i)=>x-points[(a-1)*cols+2][i]),
  v1=points[(b+1)*cols+2].map((x,i)=>x-points[(b-1)*cols+2][i]).map(x=>x/2),
  m0=v0.map(x=>x*span*.9),m1=v1.map(x=>x*span),
  width0=length(points[a*cols],points[a*cols+4]),
  width1=length(points[b*cols],points[b*cols+4]),
  changed=[];
 let peakShift=0,peakSide=0;
 for(let row=a+1;row<b;row++){
  const u=row/30,t=(row-a)/span,
   curve=hermite(p0,p1,m0,m1,t),
   prev=hermite(p0,p1,m0,m1,clamp(t-.002,0,1)),
   next=hermite(p0,p1,m0,m1,clamp(t+.002,0,1)),
   forward=[next[0]-prev[0],0,next[2]-prev[2]],
   across=Math.hypot(...forward)>.0001?side(forward):nativeSide(old,u),
   // An actual large-radius 3D road; not route-only auto-correction.
   wiggle=cfg.sweep*Math.sin(2*radians*t)*Math.sin(radians*t)**2,
   center=[curve[0]+across[0]*wiggle,
    curve[1]+cfg.crest*Math.sin(radians*t)**2,
    curve[2]+across[2]*wiggle],
   width=spanWidth(u,width0,width1),
   originalCenter=points[row*cols+2],
   oldWidth=length(points[row*cols],points[row*cols+4]),
   roll=Math.sin(radians*t)**2;
  for(let c=0;c<cols;c++){
   const fraction=(c-2)/4,prior=points[row*cols+c],
    actual=[center[0]+across[0]*fraction*width,
     center[1]+(prior[1]-originalCenter[1])*width/oldWidth+
       cfg.bank*(c-2)/2*roll,
     center[2]+across[2]*fraction*width];
   s.points[row*cols+c]=actual;
   peakShift=Math.max(peakShift,length(actual,prior));
  }
  peakSide=Math.max(peakSide,Math.abs(wiggle));
  changed.push(row);
 }
 for(let k=0;k<22;k++)doc.route[22+k]=sample(s,(k+.015)/22,.5);
 // Rebase all real physical B51-C whose station lies in the changed region.
 const stations=[
  ...P95_HAZARD_SPECS.map(([section,u],i)=>({section,u,id:'p95-hazard-'+String(i+1).padStart(2,'0')})),
  ...A13_HAZARD_SPECS.map(([section,u],i)=>({section,u,id:a13MachineId(i)}))
 ].filter(v=>v.section===1&&v.u>a/30&&v.u<b/30);
 const moved=[];
 for(const station of stations){
  const i=doc.movingObstacles.findIndex(x=>x.id===station.id);
  if(i<0)throw Error('AY actual moving obstacle missing '+station.id);
  const prev=source.movingObstacles[i],u=station.u,
   oldAt=sample(old,u,.5),newAt=sample(s,u,.5),
   prevSide=nativeSide(old,u),newSide=nativeSide(s,u),
   lateral=(prev.position[0]-oldAt[0])*prevSide[0]+
     (prev.position[2]-oldAt[2])*prevSide[2],
   position=[newAt[0]+lateral*newSide[0],
    newAt[1]+prev.position[1]-oldAt[1],
    newAt[2]+lateral*newSide[2]],
   cross=prevSide[0]*newSide[2]-prevSide[2]*newSide[0],
   dot=prevSide[0]*newSide[0]+prevSide[2]*newSide[2],
   degrees=Math.atan2(cross,dot)*180/radians;
  doc.movingObstacles[i]=validateMovingObstacle({...prev,position,
   yawDegrees:clamp(prev.yawDegrees+degrees,-360,360),
   motion:prev.type==='slider'?{...prev.motion,axis:newSide}:prev.motion});
  moved.push({id:station.id,u,deltaMeters:+length(position,prev.position).toFixed(3)});
 }
 const cores=[
  {id:'CROWN_LATE_NARROW',u0:.34,u1:.45},
  {id:'CHASM_UNCHANGED',u0:.63,u1:.82}
 ].map(spec=>{
  let min=Infinity,max=0;
  for(let k=0;k<=90;k++){
   const u=mix(spec.u0,spec.u1,k/90),w=length(sample(s,u,0),sample(s,u,1));
   min=Math.min(min,w);max=Math.max(max,w);
  }
  return {...spec,min:+min.toFixed(3),max:+max.toFixed(3),
   arcMeters:+roadLength(s,spec.u0,spec.u1).toFixed(2)};
 });
 const relocated=new Set(stations.map(x=>x.id));
 const checks={
  actualMiddleRebuild:changed.length===9&&peakShift>5,
  corePhysicallyThin:cores.length===2&&cores.every(x=>x.min>10&&x.max<19&&x.arcMeters>80),
  triangleMeshValid:tessellate(s).degenerate===0,
  wholeAVAXFirstRoadFrozen:eq(doc.surfaces[0],source.surfaces[0]),
  otherFiveRoadsFrozen:eq(doc.surfaces.slice(2),source.surfaces.slice(2)),
  originalCrownEntryFrozen:eq(s.points.slice(0,(a+1)*cols),old.points.slice(0,(a+1)*cols)),
  originalExitAndCHASMFrozen:eq(s.points.slice(b*cols),old.points.slice(b*cols)),
  canonicalRealVoidCell52:eq(doc.surfaces[0].voidLongitudinalCells,[52]),
  spawnsUnchanged:eq(doc.spawns,source.spawns),
  guideOutsideRoad2Unchanged:eq(doc.route.slice(0,22),source.route.slice(0,22))&&
    eq(doc.route.slice(44),source.route.slice(44)),
  unchangedRouteSegments:eq(doc.routeSegments,source.routeSegments),
  nativeB51Follow:moved.length===2&&moved.every(x=>x.deltaMeters>.3),
  other26B51Frozen:eq(doc.movingObstacles.filter(x=>!relocated.has(x.id)),
    source.movingObstacles.filter(x=>!relocated.has(x.id))),
  noMutatedSource:JSON.stringify(source)===frozen,
  retainAllRealColliders:doc.surfaces.length===7&&doc.movingObstacles.length===28,
  noProductionPromotion:source.stageForge.productionPromoted===false
 };
 const failed=Object.entries(checks).filter(([,ok])=>!ok).map(([x])=>x);
 if(failed.length)throw Error('AY physical layout invariant: '+failed.join(',')+
  ' | '+JSON.stringify({cores,changed,peakShift,moved}));
 doc.name='G4E-7AY '+design+' / TRUE middle-CROWN long tangent bridge, 14m core / HUMAN HOLD';
 doc.stageForge={...doc.stageForge,
  revision:'W9C2-G4E7AY-'+design.toUpperCase(),
  recordStageId:'VB-P101-A13-W9C2-G4E7AY-'+road.toUpperCase()+'-'+design.toUpperCase(),
  productionPromoted:false,
  g4e7ayStudy:{id:'crown-tangent-bridge',road,design,
   base:'G4E7AX_LONGLEAD',trueCollisionMesh:true,
   realRoadSpanU:[a/30,b/30],realRoadChangedRows:changed,
   actualCores:cores,peakRoad3DShiftMeters:+peakShift.toFixed(2),peakSideMeters:peakSide,
   reanchoredRealMoving:moved,unchangedMovingCount:26,
   sevenRealRoads:true,twentyEightRealB51:true,realGap52:true,
   originalHumanQA:'HOLD',formalSlope2Meters:0,artQA:'HOLD',publish:'HOLD'}};
 return validate(doc);
}

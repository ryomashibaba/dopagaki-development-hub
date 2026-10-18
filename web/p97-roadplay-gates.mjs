/**
 * P97 — real-road advance hazard gates for VB-P95.
 *
 * P96 proved 12 B51-C machines CAN be avoided by scripted ordinary steering,
 * not that a human can read them in time. These physical-road anchored gates
 * give noncollision visual anticipation without a guaranteed "safe lane".
 *
 * Reads the exact B48 surface sampler and 12 unchanged P95 hazard stations.
 * Pose prediction uses the B51-C sampler injected by the host, NEVER a copied
 * timing algorithm. No collision, camera, velocity or player input edits.
 */
import {P95_HAZARD_SPECS} from './p95-hazard-layout.mjs';
import {A13_HAZARD_SPECS,a13MachineId} from './p101-a13-hazard-layout.mjs';
const DISTANCES=Object.freeze([400,270,140]);
export const P101_EARLY_WARN_DISTANCES=Object.freeze([690,470,240]);
const COL={
 fail:[1,.26,.34],bounce:[1,.78,.28],push:[.76,.42,1]
};
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const add=(a,b)=>a.map((x,i)=>x+b[i]);
const mul=(a,f)=>a.map(v=>v*f);
const dot=(a,b)=>a.reduce((acc,v,i)=>acc+v*b[i],0);
const mag=v=>Math.hypot(...v);
const norm=v=>mul(v,1/(mag(v)||1));
function segments(points){
 const prefix=[0];
 for(let i=1;i<points.length;i++)prefix.push(prefix.at(-1)+mag(sub(points[i],points[i-1])));
 return {points,prefix,total:prefix.at(-1)};
}
function progression(seg,u){
 const x=clamp(u)*128,k=Math.min(127,Math.floor(x)),a=x-k;
 return seg.prefix[k]+(seg.prefix[k+1]-seg.prefix[k])*a;
}
function closest(seg,p){
 let best={distance:Infinity,progress:0};
 for(let i=0;i<128;i++){
  const a=seg.points[i],b=seg.points[i+1],v=sub(b,a),len=dot(v,v);
  const t=clamp(dot(sub(p,a),v)/(len||1)),point=add(a,mul(v,t)),dist=mag(sub(p,point));
  if(dist<best.distance)best={distance:dist,progress:seg.prefix[i]+Math.sqrt(len)*t};
 }
 return best;
}
function positionAtDistance(plan,distance){
 const d=clamp(distance,0,plan.totalDistance);
 const g=plan.roads.find(r=>d<=r.start+r.total)||plan.roads.at(-1);
 const local=clamp(d-g.start,0,g.total);
 let k=0;while(k<127&&g.prefix[k+1]<local)k++;
 const fraction=clamp((local-g.prefix[k])/Math.max(1e-7,g.prefix[k+1]-g.prefix[k]));
 return {surface:g.surface,u:(k+fraction)/128,segment:g,progress:d};
}
function projectMachineSide(station,pose){
 const tangent=norm([station.tangent[0],0,station.tangent[2]]);
 const right=[-tangent[2],0,tangent[0]];
 const lateral=dot(sub(pose.center,station.center),right);
 return {lateral,side:lateral>9?'right':lateral< -9?'left':'center'};
}
const modeLabel=mode=>mode==='fail'?'衝突で失敗':mode==='bounce'?'衝突で反発':'衝突で押し出し';
export function makeHazardRoadPlan(doc,sample){
 if(!['VB-P95','VB-P99','VB-P100','VB-P101'].includes(doc?.stageForge?.id))return null;
 if(typeof sample!=='function')throw Error('Exact physical B48 surface sample required');
 const a13=doc.stageForge.variant==='A13_GAMEPLAY_ISOLATED';
 const allSpecs=a13?[...P95_HAZARD_SPECS,...A13_HAZARD_SPECS]:P95_HAZARD_SPECS;
 if(doc.movingObstacles?.length!==allSpecs.length||doc.surfaces?.length!==7)throw Error('P97 gate requires precise native machine station count and 7 real road skins');
 let length=0;
 const roads=doc.surfaces.map(surface=>{
  const seg=segments(Array.from({length:129},(_,i)=>sample(surface,i/128,.5)));
  const result={surface:surface.id,source:surface,start:length,...seg};
  length+=seg.total;return result;
 });
 const stations=allSpecs.map(([section,u,type],i)=>{
  const road=roads[section],ob=doc.movingObstacles[i];
  const correctId=i<12?'p95-hazard-'+String(i+1).padStart(2,'0'):a13MachineId(i-12);
  if(ob.id!==correctId||ob.enabled===false)
   throw Error('Native hazard identity drift at '+i);
  const center=sample(road.source,u,.5);
  const ahead=sample(road.source,clamp(u+.004),.5);
  const behind=sample(road.source,clamp(u-.004),.5);
  return {id:ob.id,ob,section,u,type,center,tangent:sub(ahead,behind),
   distance:road.start+progression(road,u),mode:ob.collision.mode};
 });
 stations.sort((a,b)=>a.distance-b.distance);
 return {roads,stations,totalDistance:length};
}
function line(v,a,b,c){
 v.push(...a,...c,...b,...c);
}
function quad(v,a,b,c,d,color){
 v.push(...a,...color,...b,...color,...c,...color);
 v.push(...a,...color,...c,...color,...d,...color);
}
function paintRoadGate(out,solid,plan,at,machine,grade,sample,frame){
 const found=positionAtDistance(plan,at);
 const s=found.segment.source,u=found.u;
 const color=COL[machine.mode],intensity=grade===0?.82:grade===1?1:.88;
 const shade=color.map(c=>clamp(c*intensity));
 const normal=norm(frame(s,u,.5).normal);
 const lift=(point,h)=>add(point,mul(normal,h));
 // Real-world 2.6m-wide solid surface stripe, visible at high speed where
 // the GL.LINES portal alone would be a single-pixel line.
 // Keep each ribbon on a SINGLE real Catmull-Rom skin. Near surface
 // transitions shorten the stripe rather than dropping the warning entirely
 // or spanning disconnected geometry in world space.
 const du=1.3/Math.max(1,found.segment.total);
 const u0=clamp(u-du),u1=clamp(u+du);
 const a=lift(sample(s,u0,.10),.48),b=lift(sample(s,u1,.10),.48);
 const c=lift(sample(s,u1,.90),.48),d=lift(sample(s,u0,.90),.48);
 quad(solid,a,b,c,d,shade);
 const l=sample(s,u,.075),r=sample(s,u,.925);
 const center=sample(s,u,.5);
 const dl=norm(sub(center,l)),dr=norm(sub(r,center));
 // Three actual on-road transversal light ribbons, never hovering "safe path".
 for(const delta of [-.004,0,.004]){
  const p=positionAtDistance(plan,at+delta*1200);
  if(p.segment.surface!==found.segment.surface)continue;
  const left=lift(sample(s,p.u,.10),.44),right=lift(sample(s,p.u,.90),.44);
  line(out,left,right,shade);
 }
 // Side portals leave ALL physical lane width open and serve as 3D depth cues.
 const postHeight=grade===0?22:grade===1?16:11;
 for(const point of [l,r]){
  const a=lift(point,1),b=lift(point,postHeight);
  line(out,a,b,shade);
  line(out,lift(point,postHeight),lift(add(point,mul(point===l?dl:dr,4)),postHeight+2),shade);
 }
 return {machine:machine.id,tier:grade,distance:at,section:found.segment.surface,postHeight};
}
/** Render-only line geometry (XYZ RGB for existing WebGL2 LINES pipeline). */
export function hazardRoadGateVertices(doc,sample,frame){
 if(!['VB-P95','VB-P99','VB-P100','VB-P101'].includes(doc?.stageForge?.id))return {vertices:[],solidVertices:[],gates:[],stations:0};
 const plan=makeHazardRoadPlan(doc,sample),vertices=[],solidVertices=[],gates=[];
 const distances=doc.stageForge.id==='VB-P101'?P101_EARLY_WARN_DISTANCES:DISTANCES;
 for(const station of plan.stations)for(let grade=0;grade<distances.length;grade++){
  const d=station.distance-distances[grade];
  if(d<=5)continue;
  gates.push(paintRoadGate(vertices,solidVertices,plan,d,station,grade,sample,frame));
 }
 if(vertices.length%12!==0||solidVertices.length%18!==0||!vertices.every(Number.isFinite)||!solidVertices.every(Number.isFinite)||vertices.length+solidVertices.length>32000)
  throw Error('P97 gate geometry invalid or outside GPU budget');
 return {vertices,solidVertices,gates,stations:plan.stations.length};
}
/** Readable, *estimated* encounter timing for true forthcoming course hazard. */
export function nextRoadHazardCue(doc,runner,plan,poseAt,{range=430}={}){
 if(!['VB-P95','VB-P99','VB-P100','VB-P101'].includes(doc?.stageForge?.id)||!runner||!plan)return null;
 if(typeof poseAt!=='function')throw Error('Existing B51-C pose function required');
 if(!(range>0&&range<=800))throw Error('Invalid P97 sighting range');
 const active=plan.roads.find(x=>x.surface===(runner.surface||runner.lastSurface));
 if(!active)return null;
 const progress=active.start+closest(active,runner.p).progress;
 const ahead=plan.stations.find(s=>s.distance-progress>=-10&&s.distance-progress<=range);
 if(!ahead)return null;
 const meters=Math.max(0,ahead.distance-progress);
 const speed=Math.max(25,mag(runner.v));
 const eta=meters/speed;
 const future=poseAt(ahead.ob,runner.time+eta);
 const projected=projectMachineSide(ahead,future);
 return {
  id:ahead.id,type:ahead.ob.type,mode:ahead.mode,modeLabel:modeLabel(ahead.mode),
  meters:Math.round(meters),etaSeconds:Number(eta.toFixed(1)),
  predictedLateralMeters:Number(projected.lateral.toFixed(1)),predictedSide:projected.side,
  sideLabel:projected.side==='left'?'左寄り':projected.side==='right'?'右寄り':'中央付近',
  urgency:meters<=140?'immediate':meters<=270?'approaching':'advance',
  // Cues are expressly NOT a recommendation of a safe left/right lane.
  assurance:'APPROXIMATE_POSITION_ONLY_NOT_SAFE_LANE',
  physicalSource:'P95_B48_B51_C_READ_ONLY'
 };
}
/** What amount of reaction time exists at high speed between adjacent hazards? */
export function hazardSpacingAudit(plan,{speedMps=130}={}){
 if(!plan||!(speedMps>=1&&speedMps<=250))throw Error('Invalid hazard timing audit');
 return plan.stations.map((s,i)=>({
  id:s.id,stationMeter:Number(s.distance.toFixed(1)),
  spacingMeters:i?Number((s.distance-plan.stations[i-1].distance).toFixed(1)):null,
  secondsSincePrevious:i?Number(((s.distance-plan.stations[i-1].distance)/speedMps).toFixed(2)):null,
  warningSeconds:Number((400/speedMps).toFixed(2))
 }));
}

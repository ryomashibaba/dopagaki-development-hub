/** K4CT two upcoming ORIGINAL moving B51 hazards in ONE real playable scene.
 * Browser-safe read-only. Geometric side corridors are NOT guaranteed safe paths.
 * The source 7 B48, 28 B51, original 240Hz Runner/CCD/Camera/Input are UNTOUCHED.
 */
import {readK4CSRealRoadWarning} from './k4cs-true-b48-ahead-b51-readable-cues.mjs';
const sub=(a,b)=>a.map((x,i)=>x-b[i]),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),
 hypot=v=>Math.hypot(...v);
const round=(x,k=2)=>Number(x.toFixed(k));
const BALL_RADIUS=.65;
export function readK4CTTwoTrueB51(doc,runner,plan,movingPose,boxSeparation){
 if(!doc?.stageForge?.k4ctPrivate||!runner||!plan)return null;
 if(doc.movingObstacles?.length!==28||plan.stations.length!==6)throw Error('K4CT original 28 B51 invariant');
 const first=readK4CSRealRoadWarning(doc,runner,plan,movingPose);
 if(!first)return null;
 const now=first.runnerProgressMeters,road=plan.roads.find(r=>r.id===(runner.surface||runner.lastSurface));
 if(!road)return null;
 const upcoming=plan.stations.filter(s=>s.distance>=now-10&&s.distance<=now+1450).slice(0,2);
 const rows=upcoming.map(s=>{
  const distance=Math.max(0,s.distance-now),speed=Math.max(25,hypot(runner.v)),eta=distance/speed;
  // ORIGINAL native moving B51 pose at predicted arrival; present pose separately measured.
  const future=movingPose(s.ob,runner.time+eta),present=movingPose(s.ob,runner.time);
  if(!future?.enabled||!present?.enabled)throw Error('K4CT exact active moving B51 missing');
  const left=plan.sample(s.road,s.u,0),right=plan.sample(s.road,s.u,1);
  const span=sub(right,left),width=hypot(span),lateral=span.map(x=>x/width);
  const pv=dot(sub(future.center,left),lateral)/width;
  const yaw=future.yawRadians||0,c=Math.cos(yaw),sn=Math.sin(yaw),
   axisX=[c,0,-sn],axisZ=[sn,0,c];
  // True oriented-B51 box lateral projection, preserving its original size/yaw.
  const projectedHalfWidth=future.halfSize[0]*Math.abs(dot(lateral,axisX))+
    future.halfSize[2]*Math.abs(dot(lateral,axisZ));
  const leftAvailable=pv*width-projectedHalfWidth-BALL_RADIUS-.5;
  const rightAvailable=(1-pv)*width-projectedHalfWidth-BALL_RADIUS-.5;
  const leftPossible=leftAvailable>=2,rightPossible=rightAvailable>=2;
  let suggestion='UNKNOWN';
  if(leftPossible&&!rightPossible)suggestion='LEFT';
  else if(rightPossible&&!leftPossible)suggestion='RIGHT';
  else if(leftPossible&&rightPossible)suggestion='BOTH';
  // Even geometrically possible corridors are NOT safe paths: dynamic pose
  // changes, road curvature, runner velocity, player input and other solids.
  const current=boxSeparation(runner.p,BALL_RADIUS,present);
  const side=pv<=.35?'LEFT':pv>=.65?'RIGHT':'CENTER';
  return {id:s.id,road:s.road.id,metres:round(distance),etaSeconds:round(eta),
   predictedObstacleSide:side,predictedB51LaneV:round(pv,3),
   geometricCorridorHypothesis:suggestion,
   clearanceLeftM:round(leftAvailable),clearanceRightM:round(rightAvailable),
   presentRealBoxSurfaceSeparationM:round(current.separation),
   originalBoxType:s.ob.type,originalCollisionMode:s.collisionMode,
   trulyMovingB51:true,safeLaneCertified:false,
   firstOrSecond:'UNKNOWN'};
 });
 rows.forEach((r,i)=>r.firstOrSecond=i===0?'NEXT':'AFTER');
 const here=road.points.reduce((best,p,i)=>{
  const d=hypot(sub(p,runner.p));return d<best.distance?{index:i,distance:d}:best;
 },{index:0,distance:Infinity});
 const sectionU=here.index/128,edgeL=plan.sample(road.road,sectionU,0),
  edgeR=plan.sample(road.road,sectionU,1),section=sub(edgeR,edgeL);
 const runnerLaneV=dot(sub(runner.p,edgeL),section)/(dot(section,section)||1);
 const consecutiveCount=rows.length;
 return {schema:'k4ct-real-b48-two-b51-readonly-v1',simTime:round(runner.time,4),
  nativeRoad:runner.surface||runner.lastSurface,
  speedMps:round(hypot(runner.v)),runnerLateralV:round(runnerLaneV,3),
  rowCount:consecutiveCount,rows,
  intervalM:rows.length===2?round(rows[1].metres-rows[0].metres):null,
  intervalSeconds:rows.length===2?round((rows[1].metres-rows[0].metres)/Math.max(25,hypot(runner.v))):null,
  realB48:true,realB51:28,originalRunnerPhysicsUnchanged:true,
  NOT_HUMAN_VERIFIED:true,NOT_COLLISION_PROJECTION:true,NOT_GUARANTEED_SAFE_LANE:true};
}
/** R54: fast-chase display only. Predictions do NOT certify any safe lane.
 * Original B51 movement, B48 road, Runner, camera and input remain untouched.
 */
export function formatK4CTNativeDualCue(decision){
 if(!decision||!Array.isArray(decision.rows)||decision.rows.length===0)
  return 'B51 - NO UPCOMING HAZARD';
 const cleanSide=s=>['LEFT','RIGHT','CENTER'].includes(s)?s:'UNKNOWN';
 const line=(r,first)=>{
  const id=String(r.id??'').match(/(\d+)$/)?.[1]??'?';
  const metres=Number.isFinite(r.metres)?Math.max(0,Math.round(r.metres)):'?';
  const eta=Number.isFinite(r.etaSeconds)?Math.max(0,r.etaSeconds).toFixed(1):'?';
  return `${first?'NEXT':'THEN'} B51-${id}  ${metres}m / ${eta}s  MOVING ${cleanSide(r.predictedObstacleSide)}`;
 };
 const next=decision.rows.slice(0,2).map((r,i)=>line(r,i===0));
 return [...next,'A/D STEER  |  PREDICTION ONLY - NO GUARANTEED SAFE LANE'].join('\n');
}

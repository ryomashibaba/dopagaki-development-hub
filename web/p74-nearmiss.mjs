/**
 * P74: fixed-physics-tick near-miss telemetry. VISUAL FEEDBACK ONLY.
 * No steering assistance, trajectory edits, score manipulation or collision changes.
 * Requires the existing canonical B51-C movingObstaclePose and
 * sphereBoxSeparation samplers injected from the 3D host.
 */
export const NEAR_MISS_CLEARANCE=3.5;
export function createNearMissTracker(){
 return {total:0,latest:null,byId:new Map(),eventCursor:0};
}
const dotXZ=(a,b)=>a[0]*b[0]+a[2]*b[2];
function direction(runner){
 const v=runner.v||[0,0,0],f=runner.forward||[0,0,1],speed=Math.hypot(v[0],v[2]);
 return speed>6?[v[0]/speed,0,v[2]/speed]:f;
}
export function stepNearMiss(tracker,obstacles,runner,poseAt,separate,ballRadius){
 if(typeof poseAt!=='function'||typeof separate!=='function')throw Error('Canonical moving-obstacle pose and sphere separation are required');
 if(!tracker||!(tracker.byId instanceof Map))throw Error('Missing near-miss tracker');
 if(!(ballRadius>0&&Number.isFinite(ballRadius)))throw Error('Valid physical ball radius is required');
 const events=runner.events||[];
 for(let i=tracker.eventCursor;i<events.length;i++){
  const e=events[i];
  if(e.type==='moving-contact'&&typeof e.id==='string'){
   const state=tracker.byId.get(e.id)||{approached:false,minClearance:Infinity,contacted:false,completed:false};
   state.contacted=true;tracker.byId.set(e.id,state);
  }
  if(e.type==='moving-crush'){
   for(const id of e.ids||[]){
    const state=tracker.byId.get(id)||{approached:false,minClearance:Infinity,contacted:false,completed:false};
    state.contacted=true;tracker.byId.set(id,state);
   }
  }
 }
 tracker.eventCursor=events.length;
 // Never award a collision/failure as a skillful near miss.
 if(runner.status!=='running'||!Array.isArray(obstacles)||!obstacles.length)return null;
 const forward=direction(runner);
 for(const ob of obstacles){
  if(ob.enabled===false)continue;
  let state=tracker.byId.get(ob.id);
  if(state?.completed)continue;
  const p=poseAt(ob,runner.time),offset=p.center.map((x,i)=>x-runner.p[i]);
  const distance=Math.hypot(...offset);
  if(distance>180)continue;
  const ahead=dotXZ(offset,forward);
  if(!state){
   if(ahead<8||ahead>145)continue;
   state={approached:true,minClearance:Infinity,contacted:false,completed:false};
   tracker.byId.set(ob.id,state);
  }
  if(!state.approached)continue;
  // Expensive exact OBB separation only in the actionable vicinity. This
  // catches the ball radius and the machine's *real* sampled yaw/size.
  if(distance<Math.max(30,...p.halfSize)+15){
   const separation=separate(runner.p,ballRadius,p).separation;
   if(separation<=.05)state.contacted=true;
   else state.minClearance=Math.min(state.minClearance,separation);
  }
  // A real fly-by ends when the machine is behind the player's velocity.
  // This is not an inferred safe path or auto-avoidance recommendation.
  if(ahead< -Math.max(6,Math.min(22,Math.max(...p.halfSize)+2))){
   state.completed=true;
   if(!state.contacted&&state.minClearance>=.15&&state.minClearance<=NEAR_MISS_CLEARANCE){
    tracker.total++;
    const event={type:'near-miss',id:ob.id,mode:ob.collision?.mode||'fail',
     clearance:Number(state.minClearance.toFixed(2)),time:runner.time,total:tracker.total};
    tracker.latest=event;return event;
   }
  }
 }
 return null;
}
export function nearMissDisplay(tracker,time){
 const latest=tracker?.latest;
 return latest&&time-latest.time<1.8&&time>=latest.time?latest:null;
}

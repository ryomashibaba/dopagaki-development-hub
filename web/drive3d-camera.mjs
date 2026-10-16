/**
 * P70 — display-only, ball-locked chase camera. No B45/B48 physics edits.
 * Render interpolation uses immutable snapshots of two committed 240 Hz steps.
 * Only heading is filtered: the ball/eye share the exact same interpolated
 * world-space origin, preventing positional lag or lateral camera drifting.
 */
const clamp=(x,min,max)=>Math.max(min,Math.min(max,x));
const mix=(a,b,t)=>a+(b-a)*t;
const add=(a,b)=>a.map((x,i)=>x+b[i]);
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const dot=(a,b)=>a.reduce((v,x,i)=>v+x*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const unit=v=>{const n=Math.hypot(...v)||1;return v.map(x=>x/n);};
const shortest=(a,b)=>Math.atan2(Math.sin(b-a),Math.cos(b-a));
const yawOf=(forward,fallback=0)=>Math.hypot(forward[0],forward[2])>1e-5?
 Math.atan2(forward[0],forward[2]):fallback;

export const cameraTuning=Object.freeze({
 followDistance:14,followHeight:7,lookAhead:20,lookHeight:1,
 headingResponseSeconds:.15
});

export function capturePose(runner){
 return {position:[...runner.p],forward:[...runner.forward],time:runner.time};
}
export function interpolatePose(previous,current,alpha){
 if(!current)throw Error('No current physics pose');
 if(!previous)return {position:[...current.position],forward:[...current.forward],time:current.time};
 const t=clamp(alpha,0,1);
 const start=yawOf(previous.forward),end=yawOf(current.forward,start);
 const yaw=start+shortest(start,end)*t;
 return {
  position:previous.position.map((v,i)=>mix(v,current.position[i],t)),
  forward:[Math.sin(yaw),0,Math.cos(yaw)],
  time:mix(previous.time,current.time,t)
 };
}
/**
 * P71 — avoid interpolation into the past while simulation is paused/finished.
 * A paused or failed run displays the last committed ball pose exactly.
 */
export function resolveDisplayPose(previous,current,remainder,step,simActive){
 if(!current)throw Error('No committed physics pose');
 if(!simActive||!previous)return interpolatePose(current,current,1);
 const alpha=step>0?clamp(remainder/step,0,1):1;
 return interpolatePose(previous,current,alpha);
}
export function cameraYawErrorRadians(state,forward){
 return Math.abs(shortest(state.yaw,yawOf(forward,state.yaw)));
}
export function createCameraState(forward){return {yaw:yawOf(forward)};}
export function advanceCamera(state,forward,elapsed,tau=cameraTuning.headingResponseSeconds){
 const target=yawOf(forward,state.yaw);
 const dt=clamp(elapsed,0,.05),a=tau>0?1-Math.exp(-dt/tau):1;
 return {yaw:state.yaw+shortest(state.yaw,target)*a};
}
export function viewForPose(pose,state){
 const f=[Math.sin(state.yaw),0,Math.cos(state.yaw)],p=pose.position;
 const eye=add(sub(p,f.map(x=>x*cameraTuning.followDistance)),[0,cameraTuning.followHeight,0]);
 const target=add(add(p,f.map(x=>x*cameraTuning.lookAhead)),[0,cameraTuning.lookHeight,0]);
 const front=unit(sub(target,eye)),right=unit(cross(front,[0,1,0])),up=unit(cross(right,front));
 // Note: the ball stays at a fixed relative location even if heading changes.
 return {eye,front,right,up,ballPosition:[...p],time:pose.time};
}
export function projectBallRelative(view){
 const relative=sub(view.ballPosition,view.eye);
 return [dot(relative,view.right),dot(relative,view.up),dot(relative,view.front)];
}

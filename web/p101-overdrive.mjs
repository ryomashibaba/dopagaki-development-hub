
/**
 * P101 VELOCITY OVERDRIVE — experimental additive physical acceleration.
 * B48/B51-C native CCD/contacts/240 Hz remain immutable; this applies
 * bounded per-step accelerations to the native velocity BEFORE Runner.step.
 * No teleports, no forced safe lane, no speed resets, no camera movement.
 */
export const P101_TUNINGS=Object.freeze({
 RAPID:Object.freeze({id:'RAPID',groundMultiplier:4.0,airMultiplier:3.0,extraForward:5.5}),
 OVERDRIVE:Object.freeze({id:'OVERDRIVE',groundMultiplier:4.8,airMultiplier:3.7,extraForward:7.5}),
 HYPER:Object.freeze({id:'HYPER',groundMultiplier:6.0,airMultiplier:4.5,extraForward:9.5})
});
export const P101_DEFAULT='OVERDRIVE';
export const P101_STEP=1/240;
const clamp=(x,a,b)=>Math.max(a,Math.min(x,b));
function normal(a){
 const mag=Math.hypot(...a);
 if(!Number.isFinite(mag)||mag<1e-8)throw Error('P101 invalid driving frame');
 return a.map(v=>v/mag);
}
function cross(a,b){return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];}
function dot(a,b){return a.reduce((z,v,i)=>z+v*b[i],0);}
export function p101Tune(mode=P101_DEFAULT){
 const result=P101_TUNINGS[mode];
 if(!result)throw Error('Unknown P101 physical profile: '+mode);
 return result;
}
/**
 * P101 high-speed tangent anticipation. B48 already automatically aligns
 * its travel frame with the real authored road. At 200+ m/s its fixed
 * 12-metre/6Hz preview undershoots giant curves, so this PR experiments with
 * earlier course orientation ONLY. No lateral correction, route snap,
 * input rewrite, collision bypass, velocity reset or hidden support.
 * A limited yaw rate avoids a jerky camera.
 */
export const P101_HEADING=Object.freeze({
 lookAheadSeconds:.22,lookAheadMinMeters:18,lookAheadMaxMeters:76,
 responsePerSecond:10.5,maxYawRadiansPerSecond:1.75,maxRoadDistance:65
});
const shortest=(a,b)=>Math.atan2(Math.sin(b-a),Math.cos(b-a));
export function p101AnticipateRoadHeading(runner,{
 lookAheadSeconds=P101_HEADING.lookAheadSeconds,
 responsePerSecond=P101_HEADING.responsePerSecond,
 maxYawRadiansPerSecond=P101_HEADING.maxYawRadiansPerSecond
}={}){
 if(runner.doc?.stageForge?.id!=='VB-P101')throw Error('P101 road heading stage only');
 if(!runner.grounded||!runner.surface||!runner.guides)return {applied:false,reason:'airborne-or-no-guide'};
 const guide=runner.guides.find(g=>g.surface===runner.surface);
 if(!guide?.points||guide.points.length<4)return {applied:false,reason:'no-physical-guide'};
 const pts=guide.points;
 let best={dist:Infinity,index:0,progress:0};
 for(let i=0;i<pts.length-1;i++){
  const a=pts[i],b=pts[i+1],d=b.map((x,k)=>x-a[k]);
  const len2=dot(d,d)||1,t=clamp(dot(runner.p.map((x,k)=>x-a[k]),d)/len2,0,1);
  const dx=runner.p[0]-a[0]-d[0]*t,dz=runner.p[2]-a[2]-d[2]*t;
  const dist=Math.hypot(dx,dz);
  if(dist<best.dist)best={dist,index:i,progress:t};
 }
 if(best.dist>P101_HEADING.maxRoadDistance)return {applied:false,reason:'outside-actual-road'};
 const ahead=clamp(Math.hypot(...runner.v)*lookAheadSeconds,
  P101_HEADING.lookAheadMinMeters,P101_HEADING.lookAheadMaxMeters);
 let remaining=ahead,target=Math.min(pts.length-2,best.index+1);
 while(target<pts.length-2&&remaining>0){
  const len=Math.hypot(...pts[target+1].map((x,k)=>x-pts[target][k]));
  remaining-=len; if(remaining>0)target++;
 }
 const before=pts[Math.max(0,target-1)],after=pts[Math.min(pts.length-1,target+1)];
 let dx=after[0]-before[0],dz=after[2]-before[2];
 if(Math.hypot(dx,dz)<1e-6)return {applied:false,reason:'invalid-tangent'};
 const desired=Math.atan2(dx,dz),current=Math.atan2(runner.forward[0],runner.forward[2]);
 const error=shortest(current,desired);
 const delta=clamp(error*(1-Math.exp(-P101_STEP*responsePerSecond)),
  -maxYawRadiansPerSecond*P101_STEP,maxYawRadiansPerSecond*P101_STEP);
 const yaw=current+delta,ground=normal(runner.normal);
 const horizontal=[Math.sin(yaw),0,Math.cos(yaw)];
 const tangent=horizontal.map((x,i)=>x-ground[i]*dot(horizontal,ground));
 if(Math.hypot(...tangent)>1e-8)runner.forward=normal(tangent);
 return {applied:true,delta,roadDistance:best.dist,previewMeters:ahead};
}
export function p101Step(runner,input=0,mode=P101_DEFAULT){
 if(!runner||typeof runner.step!=='function')throw Error('Native B48 runner required');
 if(runner.doc?.stageForge?.id!=='VB-P101')throw Error('P101 acceleration may only affect the independent P101 stage');
 const config=p101Tune(mode),steer=clamp(input,-1,1);
 if(!Number.isFinite(steer))throw Error('Non-finite steering');
 if(runner.status==='failed'||runner.status==='finished')return;
 p101AnticipateRoadHeading(runner);
 // Match native B48 tangent frame (oldForward and right) from its existing contact.
 let f=normal(runner.forward);
 const up=normal(runner.normal);
 const tangent=f.map((x,i)=>x-up[i]*dot(f,up));
 if(Math.hypot(...tangent)>1e-7)f=normal(tangent);
 const right=normal(cross(f,up));
 const nativeSideAccel=runner.grounded?36:7;
 const multiplier=runner.grounded?config.groundMultiplier:config.airMultiplier;
 const extraSide=nativeSideAccel*(multiplier-1)*steer;
 // Constant mild acceleration remains at speed; no soft/hard speed cap or reset.
 // Upward/downward gravity, native collision response and ground friction remain.
 const extraForward=config.extraForward;
 runner.v=runner.v.map((v,i)=>v+P101_STEP*(right[i]*extraSide+f[i]*extraForward));
 runner.step(steer); // The native 240 Hz B48/B51-C physics owns all movement and collisions.
}

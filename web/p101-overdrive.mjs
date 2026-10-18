
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
export function p101Step(runner,input=0,mode=P101_DEFAULT){
 if(!runner||typeof runner.step!=='function')throw Error('Native B48 runner required');
 if(runner.doc?.stageForge?.id!=='VB-P101')throw Error('P101 acceleration may only affect the independent P101 stage');
 const config=p101Tune(mode),steer=clamp(input,-1,1);
 if(!Number.isFinite(steer))throw Error('Non-finite steering');
 if(runner.status==='failed'||runner.status==='finished')return;
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

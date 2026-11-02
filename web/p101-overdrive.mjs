
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
 * Candidate B3 positive-only power profile. Stage-local, continuous at the
 * boundaries. Neither limits current speed nor modifies existing velocity:
 * the added force simply ramps on when the REAL final three roads begin.
 * Earlier giant U turns retain the P100 native base acceleration.
 */
export const P101_LATE_PLANS=Object.freeze({
 MODERATE:Object.freeze([.4,.85,1.35]),
 BALANCED:Object.freeze([.75,1.5,2.1]),
 AGGRESSIVE:Object.freeze([1.15,2.1,3.0])
});
const smooth=t=>{const x=clamp(t,0,1);return x*x*(3-2*x);};
export function p101LateSurgeGain(section,progress=0,plan='BALANCED'){
 const targets=P101_LATE_PLANS[plan];
 if(!targets)throw Error('Unknown P101 forward power plan');
 if(!Number.isInteger(section)||section<0||section>6||!Number.isFinite(progress)||progress<0||progress>1)throw Error('P101 invalid physical chapter progress');
 if(section<4)return 0;
 const i=section-4;
 const start=i===0?0:targets[i-1];
 return start+(targets[i]-start)*smooth(progress/.24);
}
export function p101RoadProgress(runner){
 if(runner.doc?.stageForge?.id!=='VB-P101')throw Error('P101 progress must read P101 real road');
 const road=runner.surface||runner.lastSurface;
 const section=runner.doc.surfaces.findIndex(s=>s.id===road);
 if(section<0)return {section:0,u:0};
 const guide=runner.guides?.find(g=>g.surface===road)?.points;
 if(!guide||guide.length<2)return {section,u:0};
 let near={dist:Infinity,u:0};
 for(let i=0;i<guide.length-1;i++){
  const a=guide[i],b=guide[i+1],d=b.map((x,k)=>x-a[k]);
  const sq=dot(d,d)||1,step=clamp(dot(runner.p.map((x,k)=>x-a[k]),d)/sq,0,1);
  const dist=runner.p.reduce((v,x,k)=>v+(x-a[k]-step*d[k])**2,0);
  if(dist<near.dist)near={dist,u:(i+step)/(guide.length-1)};
 }
 return {section,u:near.u};
}
/**
 * P101 nonlethal rebound recovery - candidate, W9-C1/B5 MANUAL ONLY.
 * The normal 1.1 + 7.5*.12 = ~2.0 m/s2 forward force takes ~15 s to undo
 * a -30 m/s bounce on level road. Apply a temporary, bounded *physical*
 * longitudinal driving force after a legitimate nonlethal moving contact.
 * Never touch native CCD/impulses, position, colliders, gravity, side steering,
 * stages W7F Gold/W9-X/P100, or native scripted baseline when not opted in.
 */
export const P101_REBOUND_RECOVERY=Object.freeze({
 maxForwardAccelMps2:440,
 reverseBaseAccelMps2:180,
 reverseSpeedGain:2.6,
 positiveAccelMps2:135,
 restoreForwardMps:28,
 armBelowForwardMps:16,
 minimumReboundSeconds:.16,
 maxRecoverySeconds:3,
 rearmCooldownSeconds:.45,
 eligibleRecordIds:Object.freeze(['VB-P101-A13-W9C1-CONTROL','VB-P101-A13-W9C1-ULTRA',
  'VB-P101-A13-W9C2-RIBBON','VB-P101-A13-W9C2-EDGE'])
});
const nonlethalRecovery=new WeakMap();
function reboundEligible(runner){
 const sf=runner?.doc?.stageForge;
 return sf?.id==='VB-P101'&&(
  sf.variant==='B5_HYPER_ARC_ISOLATED'||
  (sf.variant==='A13_GAMEPLAY_ISOLATED'&&P101_REBOUND_RECOVERY.eligibleRecordIds.includes(sf.recordStageId)));
}
function reboundFrame(runner){
 // The native B48 runner owns the forward axis, not the velocity heading.
 const up=normal(runner.normal),ahead=normal(runner.forward);
 const tangent=ahead.map((x,i)=>x-up[i]*dot(ahead,up));
 return Math.hypot(...tangent)>1e-7?normal(tangent):ahead;
}
export function p101ReboundRecoveryState(runner){
 const s=runner&&nonlethalRecovery.get(runner);
 if(!s||runner.time<s.armedAt)return {active:false,armedAt:null,obstacleId:null};
 return {active:true,armedAt:s.armedAt,obstacleId:s.obstacleId};
}
function endReboundRecovery(runner,reason,s){
 const forwardMps=dot(runner.v,reboundFrame(runner));
 runner.events?.push({type:'rebound-recovery-end',t:runner.time,id:s.obstacleId,
  reason,forwardAfterMps:forwardMps,peakAppliedAccelMps2:s.peakAccel});
 nonlethalRecovery.delete(runner);
}
function applyReboundRecovery(runner){
 const s=nonlethalRecovery.get(runner);
 if(!s)return;
 if(runner.time<s.armedAt){nonlethalRecovery.delete(runner);return;} // resumeAt reset
 const elapsed=runner.time-s.armedAt,forward=reboundFrame(runner);
 const speed=dot(runner.v,forward);
 if(speed>=P101_REBOUND_RECOVERY.restoreForwardMps){
  endReboundRecovery(runner,'forward-restored',s);return;
 }
 if(elapsed>=P101_REBOUND_RECOVERY.maxRecoverySeconds){
  endReboundRecovery(runner,'window-expired',s);return;
 }
 // Never accelerate a floating ball toward an artificial floor/landing.
 if(!runner.grounded||elapsed<P101_REBOUND_RECOVERY.minimumReboundSeconds)return;
 const cfg=P101_REBOUND_RECOVERY;
 const force=speed<0
  ?Math.min(cfg.maxForwardAccelMps2,cfg.reverseBaseAccelMps2+(-speed)*cfg.reverseSpeedGain)
  :cfg.positiveAccelMps2*Math.max(0,1-speed/cfg.restoreForwardMps);
 if(force<=0)return;
 s.peakAccel=Math.max(s.peakAccel,force);
 runner.v=runner.v.map((v,i)=>v+P101_STEP*force*forward[i]);
}
function captureNonlethalContact(runner,startingEventIndex){
 if(!Array.isArray(runner.events)||runner.status==='failed'||runner.status==='finished')return;
 const cfg=P101_REBOUND_RECOVERY;
 const candidate=runner.events.slice(startingEventIndex).find(e=>
  e.type==='moving-contact'&&(e.mode==='push'||e.mode==='bounce'));
 if(!candidate)return;
 const forwardMps=dot(runner.v,reboundFrame(runner));
 if(forwardMps>=cfg.armBelowForwardMps)return;
 const existing=nonlethalRecovery.get(runner);
 if(existing&&runner.time-existing.armedAt<cfg.rearmCooldownSeconds)return;
 nonlethalRecovery.set(runner,{armedAt:runner.time,obstacleId:candidate.id,peakAccel:0});
 runner.events.push({type:'rebound-recovery-start',t:runner.time,id:candidate.id,
  mode:candidate.mode,forwardBeforeMps:candidate.forwardBeforeMps??null,
  forwardAfterMps:forwardMps});
}
export function p101Step(runner,input=0,mode=P101_DEFAULT,{forwardScale=1,lateSurge=null,collisionRecovery=false}={}){
 if(!runner||typeof runner.step!=='function')throw Error('Native B48 runner required');
 if(runner.doc?.stageForge?.id!=='VB-P101')throw Error('P101 acceleration may only affect the independent P101 stage');
 const config=p101Tune(mode),steer=clamp(input,-1,1);
 if(lateSurge!==null&&!P101_LATE_PLANS[lateSurge])throw Error('P101 valid experimental lateSurge plan required');
 if(!Number.isFinite(forwardScale)||forwardScale<0||forwardScale>1)throw Error('P101 bounded native forwardScale 0..1 required');
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
 const gain=lateSurge===null?1:(()=>{const p=p101RoadProgress(runner);return p101LateSurgeGain(p.section,p.u,lateSurge);})();
 const extraForward=config.extraForward*forwardScale*gain;
 runner.v=runner.v.map((v,i)=>v+P101_STEP*(right[i]*extraSide+f[i]*extraForward));
 // Opted-in local human trials only. W7F Gold/W9-X and scripted native QA
 // continue using their exact pre-existing force law.
 const recoveryAllowed=collisionRecovery===true&&reboundEligible(runner);
 if(recoveryAllowed)applyReboundRecovery(runner);
 const eventCursor=recoveryAllowed?(runner.events?.length??0):0;
 runner.step(steer); // The native 240 Hz B48/B51-C physics owns all movement and collisions.
 if(recoveryAllowed)captureNonlethalContact(runner,eventCursor);
}

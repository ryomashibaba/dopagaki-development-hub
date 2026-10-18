/**
 * P101 B5 native 7.28km HUMAN-TEST CANDIDATE force profile. No artificial
 * adhesion, speed cap, teleport, forced jump or change to native B48 CCD.
 * Real 240Hz sweep A6: OVERDRIVE 4.8x lateral + base .12 forward throttle,
 * then +.13 smooth additional throttle after physical section IV =>
 * 7/7 finish 53.150s peak 205.26m/s (scripted QA ONLY).
 */
import {p101RoadProgress} from './p101-overdrive.mjs';
const clamp=(v,a,b)=>Math.max(a,Math.min(v,b));
const smooth=v=>{const x=clamp(v,0,1);return x*x*(3-2*x);};
export const P101_B5_PROVEN_LAW=Object.freeze({
 activeVariant:'B5_HYPER_ARC_ISOLATED',requiredLowerReversalLength:1800,
 baseForwardScale:.12,positiveLateAddition:.13,startSection:4,rampProgress:.45,
 profile:'OVERDRIVE',verifiedNativePeakSpeedMps:205.26,verifiedNativeSeconds:53.15,
 humanApproval:'NOT_RUN'
});
export function createP101B5SurgeState(){return {section:0,u:0};}
export function p101B5ForwardScale(runner,state){
 if(runner?.doc?.stageForge?.variant!==P101_B5_PROVEN_LAW.activeVariant ||
    runner.doc.stageForge.lowerReversalLength!==P101_B5_PROVEN_LAW.requiredLowerReversalLength)
  throw Error('P101 B5 7.28km confirmed physical course required');
 if(!state||!Number.isInteger(state.section)||!Number.isFinite(state.u))
  throw Error('P101 B5 acceleration needs current real physical road state');
 if(runner.surface){
  const value=p101RoadProgress(runner);
  state.section=value.section;
  state.u=value.u;
 }
 const l=P101_B5_PROVEN_LAW;
 const ramp=state.section<l.startSection?0:state.section>l.startSection?1:smooth(state.u/l.rampProgress);
 return l.baseForwardScale+l.positiveLateAddition*ramp;
}

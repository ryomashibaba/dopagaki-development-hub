/**
 * P101 A13 independent 7.28km forward force schedule. Reuses the physical
 * B5 law numbers only: no B5 finish or fairness evidence transfers to A13.
 * Velocity/CCD/contacts remain native B48/B51-C without hidden speed caps.
 */
import {p101RoadProgress} from './p101-overdrive.mjs';
import {P101_B5_PROVEN_LAW} from './p101-b5-forward.mjs';
const clamp=(x,a,b)=>Math.max(a,Math.min(x,b));
const smooth=x=>{const v=clamp(x,0,1);return v*v*(3-2*v);};
export const createA13SurgeState=()=>({section:0,u:0});
export function p101A13ForwardScale(runner,state){
 const stage=runner?.doc?.stageForge;
 if(stage?.variant!=='A13_GAMEPLAY_ISOLATED'||stage.nominalLengthMeters!==7280)
  throw Error('A13 requires independent real 7.28km stage');
 if(!state||!Number.isInteger(state.section)||!Number.isFinite(state.u))
  throw Error('A13 requires native road progress state');
 if(runner.surface){const p=p101RoadProgress(runner);state.section=p.section;state.u=p.u;}
 const b=P101_B5_PROVEN_LAW;
 return b.baseForwardScale+b.positiveLateAddition*(
  state.section<b.startSection?0:state.section>b.startSection?1:smooth(state.u/b.rampProgress));
}

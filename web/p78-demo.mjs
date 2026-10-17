/**
 * P78 spectator-only demonstration inputs from P77's measured native run.
 * This module NEVER writes to Runner, never skips collision steps or alters
 * steering of a player-controlled run. The host passes the input to the
 * untouched 240 Hz Runner only after selecting explicit DEMO mode.
 */
import {p94NativeSteer} from './p94-native-steer.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from './p96-avoidance-steer.mjs';
import {movingObstaclePose} from '../reference_only/director/moving/moving-obstacles.mjs';
export const DEMO_STAGE_ID='EP-P66';
export const DEMO_START_SPAWN=0;
export const DEMO_EXPECTED_FINISH_SECONDS=83.21;
export function createNativeDemoState(){return {forkAt:null,p96Plan:null};}
export function recordDemoMilestone(state,runner){
 if(state.forkAt===null&&runner.surface?.includes('FORK_APPROACH'))state.forkAt=runner.time;
}
export function nativeDemoSteer(state,runner){
 if(runner?.doc?.stageForge?.id==='VB-P93')return p94NativeSteer(runner,'corrective');
 if(runner?.doc?.stageForge?.id==='VB-P95'){
  if(!state.p96Plan)state.p96Plan=makeP96RoutePlan(runner.doc,runner);
  return p96DodgeSteer(runner,state.p96Plan,'early-soft',movingObstaclePose).input;
 }
 let steer=state.forkAt!==null&&runner.time>=state.forkAt&&runner.time<state.forkAt+5?-1:0;
 if(runner.time>=75.45&&runner.time<75.90)steer=1;
 else if(runner.time>=75.90&&runner.time<76.35)steer=-1;
 return steer;
}
export const isDemoEligible=doc=>['EP-P66','VB-P93','VB-P95'].includes(doc?.stageForge?.id);

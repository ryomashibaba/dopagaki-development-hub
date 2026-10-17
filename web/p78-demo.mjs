/**
 * P78 spectator-only demonstration inputs from P77's measured native run.
 * This module NEVER writes to Runner, never skips collision steps or alters
 * steering of a player-controlled run. The host passes the input to the
 * untouched 240 Hz Runner only after selecting explicit DEMO mode.
 */
export const DEMO_STAGE_ID='EP-P66';
export const DEMO_START_SPAWN=0;
export const DEMO_EXPECTED_FINISH_SECONDS=83.21;
export function createNativeDemoState(){return {forkAt:null};}
export function recordDemoMilestone(state,runner){
 if(state.forkAt===null&&runner.surface?.includes('FORK_APPROACH'))state.forkAt=runner.time;
}
export function nativeDemoSteer(state,runner){
 let steer=state.forkAt!==null&&runner.time>=state.forkAt&&runner.time<state.forkAt+5?-1:0;
 if(runner.time>=75.45&&runner.time<75.90)steer=1;
 else if(runner.time>=75.90&&runner.time<76.35)steer=-1;
 return steer;
}
export const isDemoEligible=doc=>doc?.stageForge?.id===DEMO_STAGE_ID;

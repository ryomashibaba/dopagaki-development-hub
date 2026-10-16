/**
 * P72 — bounded, deterministic simulation catch-up on low-render-FPS clients.
 * No alteration of B45/B48 physics, DT or collision behavior.
 * Unlike the old 12-substep cap, 10/15fps can execute 24/16 fixed steps
 * per rendered frame and keep real time. When the CPU is truly overloaded,
 * drop backlog explicitly instead of entering an unbounded death spiral.
 */
export const FRAME_LIMIT_SECONDS=.125;
export const MAX_STEPS_PER_RENDER=30;
export function stepFixedClock(accumulator,renderDelta,physicsDelta,onStep,maxSteps=MAX_STEPS_PER_RENDER){
 if(!(physicsDelta>0)||!Number.isFinite(physicsDelta))throw Error('Invalid fixed physics step');
 const original=Math.max(0,Number.isFinite(renderDelta)?renderDelta:0);
 const dt=Math.min(FRAME_LIMIT_SECONDS,original);
 let remaining=Math.max(0,Number.isFinite(accumulator)?accumulator:0)+dt;
 let executed=0;
 const budget=Math.max(1,Math.floor(maxSteps));
 let halted=false;
 while(remaining+1e-12>=physicsDelta&&executed<budget){
  halted=onStep()===false;
  remaining=Math.max(0,remaining-physicsDelta);
  executed++;
  if(halted)break;
 }
 const overloaded=original>FRAME_LIMIT_SECONDS+1e-9||(!halted&&remaining+1e-12>=physicsDelta);
 if(overloaded)remaining=Math.min(remaining,physicsDelta);
 return {accumulator:remaining,steps:executed,overloaded,halted,elapsed:dt};
}

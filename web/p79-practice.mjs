/**
 * P79: practice chapters reached by actual deterministic 240Hz physical
 * replay from the original start, not a teleport / injected checkpoint.
 * The same P78 spectator steering is applied to the native B48 Runner.
 * On reaching the requested surface the ORIGINAL Runner is handed to the
 * player: exact momentum, collision state, scene time and moving phase.
 */
import {createNativeDemoState,nativeDemoSteer,recordDemoMilestone} from './p78-demo.mjs';
export const PRACTICE_CHAPTERS=Object.freeze([
 Object.freeze({id:'return',surface:'p66-PIPE_RETURN-01',label:'HALO RETURN / 180° U字回廊'}),
 Object.freeze({id:'spiral-exit',surface:'p66-SPIRAL_CATHEDRAL-06',label:'450°螺旋の出口'}),
 Object.freeze({id:'fork',surface:'p66-FORK_APPROACH-01',label:'空中分岐の手前'}),
 Object.freeze({id:'rejoin',surface:'p66-FORK_REJOIN-01',label:'合流〜機械地帯'}),
 Object.freeze({id:'machines',surface:'p66-MACHINE_CHAMBER-01',label:'移動障害物の入り口'}),
 Object.freeze({id:'jump',surface:'p66-GAP_TAKEOFF-01',label:'自然ジャンプの手前'}),
 Object.freeze({id:'landing',surface:'p66-GAP_LANDING-02',label:'実際の着地点（第2区画）'})
]);
export const SEEK_BATCH_STEPS=96;
export function createPracticeSeek(chapterId){
 const chapter=PRACTICE_CHAPTERS.find(c=>c.id===chapterId);
 if(!chapter)throw Error('Unsupported practice chapter: '+chapterId);
 return {chapter,driver:createNativeDemoState(),steps:0,status:'seeking'};
}
export function advancePracticeSeek(seek,runner,budget=SEEK_BATCH_STEPS){
 if(seek.status!=='seeking')return {status:seek.status,steps:0,time:runner.time};
 if(!Number.isInteger(budget)||budget<1||budget>2048)throw Error('Invalid practice replay budget');
 let advanced=0;
 for(let i=0;i<budget;i++){
  if(runner.status==='failed'||runner.status==='finished'){
   seek.status='failed';break;
  }
  const steer=nativeDemoSteer(seek.driver,runner);
  runner.step(steer);
  recordDemoMilestone(seek.driver,runner);
  seek.steps++;advanced++;
  if(runner.status==='failed'||runner.status==='finished'){
   seek.status='failed';break;
  }
  if(runner.surface===seek.chapter.surface){
   seek.status='ready';break;
  }
 }
 return {status:seek.status,steps:advanced,time:runner.time,surface:runner.surface};
}
export function practiceElapsed(physicsTime,startedAt){
 return startedAt===null?0:Math.max(0,physicsTime-startedAt);
}

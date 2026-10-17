/**
 * P88: same-clock spatial separation to the non-colliding native ghost.
 * Never use Euclidean separation as elapsed-time lead/lag, especially around
 * self-crossing loops. This is purely a visual racing reference.
 */
import {referenceGhostAt,ghostEligible} from './p87-ghost.mjs';
export function ghostGapView(data,doc,spawn,mode,enabled,playerPosition,simulationTime){
 if(!enabled||!ghostEligible(doc,spawn,mode)||!data)return {visible:false,reason:'not-eligible'};
 const other=referenceGhostAt(data,simulationTime);
 if(!other||!Array.isArray(playerPosition)||playerPosition.length!==3||
    playerPosition.some(x=>!Number.isFinite(x)))return {visible:false,reason:'no-pose'};
 const delta=other.map((x,i)=>x-playerPosition[i]);
 const separation=Math.hypot(...delta);
 return {visible:true,separation,meters:Number(separation.toFixed(1)),heightDelta:Number(delta[1].toFixed(1)),
  sameClockSeconds:simulationTime,withinTenMeters:separation<=10};
}

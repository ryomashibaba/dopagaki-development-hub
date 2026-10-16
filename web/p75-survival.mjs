/**
 * P75 SURVIVAL RUSH — display-only score and personal-best records.
 * DOPAGAKI rule: survival time dominates; optional NEAR MISS contributes
 * no more than 5% of the combined score under any input combination.
 * Does not modify Runner points, physics, assisted movement or course data.
 */
export const RECORD_SCHEMA='dopagaki.survival-record/1';
export const SCORE_PER_SECOND=100;
export const NEAR_MISS_POINTS=15;

const validNumber=x=>typeof x==='number'&&Number.isFinite(x);
export function survivalScore(seconds,nearMisses=0){
 if(!validNumber(seconds)||seconds<0||!Number.isSafeInteger(nearMisses)||nearMisses<0)
  throw Error('Invalid survival score inputs');
 const survival=Math.floor(seconds*SCORE_PER_SECOND+1e-9);
 const bonus=Math.min(nearMisses*NEAR_MISS_POINTS,Math.floor(survival/19));
 const total=survival+bonus;
 return {survival,bonus,total,bonusShare:total?bonus/total:0};
}
export function runRecordKey(stageId,spawn){
 if(typeof stageId!=='string'||!/^[A-Za-z0-9-]{1,60}$/.test(stageId)||
    !Number.isInteger(spawn)||spawn<0||spawn>256)throw Error('Invalid stage or spawn record key');
 return 'dopagaki:survival:1:'+stageId+':'+spawn;
}
export function buildRunRecord({stageId,spawn,seconds,nearMisses=0,outcome}){
 if(!['failed','finished'].includes(outcome))throw Error('Only completed or failed runs can be recorded');
 const score=survivalScore(seconds,nearMisses);
 return {schema:RECORD_SCHEMA,stageId,spawn,seconds:Number(seconds.toFixed(3)),nearMisses,
  outcome,...score};
}
export function betterRecord(a,b){
 if(!b)return true;
 // Survival duration is always the primary rank, even when optional bonus
 // might make a shorter run's score marginally larger.
 if(a.seconds!==b.seconds)return a.seconds>b.seconds;
 if(a.total!==b.total)return a.total>b.total;
 return a.outcome==='finished'&&b.outcome!=='finished';
}
export function readBest(storage,stageId,spawn){
 const key=runRecordKey(stageId,spawn);
 try{
  const raw=storage?.getItem?.(key);
  if(!raw)return null;
  const entry=JSON.parse(raw);
  if(entry?.schema!==RECORD_SCHEMA||entry.stageId!==stageId||entry.spawn!==spawn||
     !validNumber(entry.seconds)||entry.seconds<0||
     !Number.isSafeInteger(entry.nearMisses)||entry.nearMisses<0||
     !['failed','finished'].includes(entry.outcome))return null;
  const expected=survivalScore(entry.seconds,entry.nearMisses);
  if(expected.total!==entry.total||expected.bonus!==entry.bonus)return null;
  return entry;
 }catch{return null;}
}
export function storeBest(storage,entry){
 const key=runRecordKey(entry.stageId,entry.spawn);
 const previous=readBest(storage,entry.stageId,entry.spawn);
 const improved=betterRecord(entry,previous);
 if(!improved)return {best:previous,improved:false,saved:true};
 let saved=false;
 try{storage?.setItem?.(key,JSON.stringify(entry));saved=Boolean(storage?.setItem);}
 catch{saved=false;}
 return {best:entry,improved:true,saved};
}
export const scoreString=n=>Math.max(0,Math.floor(n)).toLocaleString('en-US');

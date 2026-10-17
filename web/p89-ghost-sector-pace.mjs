/**
 * P89 — same-physical-sector ghost pace. Comparing equal positions in time
 * would mislead on curves, forks and vertical overlaps; instead compare the
 * actual first native Runner crossing of each of the eight P80 road chapters.
 * The reference is generated offline from the accepted 83s P77 full native run.
 * Display-only; no changes to Runner, scoring, control or collision geometry.
 */
import {FLOW_CHAPTERS} from './p80-trackflow.mjs';
export function validateReferenceSectors(data){
 const sectors=data?.sectors;
 if(!Array.isArray(sectors)||sectors.length!==FLOW_CHAPTERS.length)
  throw Error('Native reference sector count mismatch');
 let prev=0;
 for(let i=0;i<sectors.length;i++){
  const e=sectors[i];
  if(e?.id!==FLOW_CHAPTERS[i].id||!Number.isFinite(e.time)||!Number.isFinite(e.duration)||
     e.time<=prev||e.duration<0||e.duration>e.time+.001)
    throw Error('Invalid or reordered native sector timestamp at '+i);
  prev=e.time;
 }
 if(!Number.isFinite(data.finishSeconds)||Math.abs(prev-data.finishSeconds)>.002)
  throw Error('Native reference final sector is not the real finish');
 return sectors;
}
export function compareGhostSector(event,reference){
 if(!event||!reference)return null;
 const sectors=validateReferenceSectors(reference);
 const index=sectors.findIndex(x=>x.id===event.id);
 if(index<0||index!==event.index||!Number.isFinite(event.time)||
    !Number.isFinite(event.duration)||event.time<0||event.duration<0)return null;
 const matched=sectors[index];
 // Signed difference from first native crossing of the SAME road chapter.
 // Negative = player ahead; positive = ghost ahead.
 const delta=Number((event.time-matched.time).toFixed(3));
 const sectorDelta=Number((event.duration-matched.duration).toFixed(3));
 return {
  id:event.id,label:FLOW_CHAPTERS[index].label,index,
  time:Number(event.time.toFixed(3)),referenceTime:matched.time,
  delta,sectorDelta,
  sign:delta<-.005?'ahead':delta>.005?'behind':'tie'
 };
}
export function paceCaption(pace){
 if(!pace)return '基準走行と比較できません';
 if(pace.sign==='tie')return pace.label+' · 基準と同タイム';
 return pace.label+' · '+(pace.sign==='ahead'?'基準より ':'基準から +')+
  (pace.sign==='ahead'?'−':'')+Math.abs(pace.delta).toFixed(2)+'s'+
  (pace.sign==='ahead'?' 速い':' 遅い');
}

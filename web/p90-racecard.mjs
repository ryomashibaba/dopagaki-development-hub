/** P90 full eight-sector reference comparison, display-only. */
import {FLOW_CHAPTERS} from './p80-trackflow.mjs';
import {compareGhostSector,validateReferenceSectors} from './p89-ghost-sector-pace.mjs';
export function buildRacecard(completed,reference){
 const sectors=validateReferenceSectors(reference);
 if(!Array.isArray(completed))throw Error('Completed sector events required');
 const result=[];
 for(let i=0;i<FLOW_CHAPTERS.length;i++){
  const event=completed[i]||null;
  const matched=event?compareGhostSector(event,reference):null;
  if(event&&!matched)throw Error('Inconsistent physical sector crossing at '+i);
  result.push({id:FLOW_CHAPTERS[i].id,label:FLOW_CHAPTERS[i].label,index:i,
   reference:sectors[i].time,player:matched?.time??null,
   delta:matched?.delta??null,sectorDelta:matched?.sectorDelta??null,
   status:matched?.sign||'pending'});
 }
 return result;
}
export function racecardTotals(rows){
 if(!Array.isArray(rows)||rows.length!==FLOW_CHAPTERS.length)throw Error('Invalid racecard');
 const completed=rows.filter(x=>x.status!=='pending');
 const last=completed.at(-1);
 const best=completed.filter(x=>x.sectorDelta!==null).sort((a,b)=>a.sectorDelta-b.sectorDelta)[0]||null;
 const worst=completed.filter(x=>x.sectorDelta!==null).sort((a,b)=>b.sectorDelta-a.sectorDelta)[0]||null;
 return {completed:completed.length,currentDelta:last?.delta??null,bestSector:best?.id??null,
  slowestSector:worst?.id??null,finished:completed.length===FLOW_CHAPTERS.length};
}
export function racecardDeltaText(delta){
 if(delta===null)return '—';
 if(!Number.isFinite(delta))throw Error('Non-finite sector delta');
 return (Math.abs(delta)<.005?'±':delta<0?'−':'+')+Math.abs(delta).toFixed(2)+'s';
}

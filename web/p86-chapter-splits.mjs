/**
 * P86 — actual native 240Hz road-chapter timing, display/record only.
 * Chapter boundaries come exclusively from the real Runner contact surface,
 * not predicted path progress, a video, camera position, or wall-clock time.
 * No changes to Runner, physics steering, B45/B48/B51-C, score or rewards.
 */
import {chapterFromSurface,FLOW_CHAPTERS} from './p80-trackflow.mjs';

export const CHAPTER_RECORD_SCHEMA='dopagaki.chapter-split/1';
const rounded=t=>Number(t.toFixed(3));
const numeric=x=>typeof x==='number'&&Number.isFinite(x);

export function chapterRecordKey(stageId,spawn,chapterId){
 if(!/^[A-Za-z0-9-]{1,60}$/.test(stageId)||!Number.isInteger(spawn)||
    spawn<0||spawn>256||!FLOW_CHAPTERS.some(c=>c.id===chapterId))
  throw Error('Invalid chapter personal best key');
 return 'dopagaki:chapter:1:'+stageId+':'+spawn+':'+chapterId;
}
export function createChapterSplits(stageId,spawn,surface,time=0){
 if(stageId!=='EP-P66')return null;
 if(!numeric(time)||time<0)throw Error('Invalid physics clock');
 chapterRecordKey(stageId,spawn,FLOW_CHAPTERS[0].id);
 const entry=chapterFromSurface(surface);
 return {
  stageId,spawn,initialTime:time,lastTime:time,
  index:entry?.index??-1,enteredAt:time,
  completed:[],done:false
 };
}
/**
 * Call ONCE PER native physics tick, after Runner.step().
 * Reversed chapter transitions do not erase a completed section or fabricate
 * a record. A run started at a practice checkpoint times only from takeover.
 */
export function observeChapterSplits(tracker,surface,lastSurface,time,status='running'){
 if(!tracker||tracker.done)return null;
 if(!numeric(time)||time+1e-8<tracker.lastTime)throw Error('Physics chapter time reversed');
 tracker.lastTime=time;
 const contact=chapterFromSurface(surface)||chapterFromSurface(lastSurface);
 const next=contact?.index??-1;
 let event=null;
 if(tracker.index<0&&next>=0){
  tracker.index=next;tracker.enteredAt=time;
 }else if(next>tracker.index&&tracker.index>=0){
  event=finishChapter(tracker,time);
  tracker.index=next;
  tracker.enteredAt=time;
 }
 if(status==='finished'){
  if(!event&&tracker.index>=0)event=finishChapter(tracker,time);
  tracker.done=true;
 }else if(status==='failed')tracker.done=true;
 return event;
}
function finishChapter(tracker,time){
 const chapter=FLOW_CHAPTERS[tracker.index];
 if(!chapter||tracker.completed.some(x=>x.id===chapter.id))return null;
 const duration=rounded(Math.max(0,time-tracker.enteredAt));
 const event={id:chapter.id,label:chapter.label,index:tracker.index,
  duration,time:rounded(time),stageId:tracker.stageId,spawn:tracker.spawn};
 tracker.completed.push(event);
 return event;
}
export function chapterTimerView(tracker,time){
 if(!tracker)return {visible:false};
 const chapter=FLOW_CHAPTERS[tracker.index];
 return {
  visible:!!chapter,id:chapter?.id??null,
  label:chapter?.label??'WAIT',elapsed:rounded(Math.max(0,time-tracker.enteredAt)),
  completed:tracker.completed.length,
  latest:tracker.completed.at(-1)??null
 };
}
export function readChapterBest(storage,stageId,spawn,chapterId){
 const key=chapterRecordKey(stageId,spawn,chapterId);
 try{
  const s=storage?.getItem?.(key);
  if(!s)return null;
  const r=JSON.parse(s);
  if(r?.schema!==CHAPTER_RECORD_SCHEMA||r.stageId!==stageId||
    r.spawn!==spawn||r.id!==chapterId||!numeric(r.duration)||
    r.duration<0||!numeric(r.time)||r.time<r.duration)return null;
  return r;
 }catch{return null;}
}
export function storeChapterBest(storage,event){
 const key=chapterRecordKey(event.stageId,event.spawn,event.id);
 if(!numeric(event.duration)||event.duration<0||
    !numeric(event.time)||event.time<event.duration)throw Error('Invalid split result');
 const old=readChapterBest(storage,event.stageId,event.spawn,event.id);
 if(old&&old.duration<=event.duration)return {best:old,improved:false,saved:true};
 const value={schema:CHAPTER_RECORD_SCHEMA,...event};
 let saved=false;
 try{if(storage?.setItem){storage.setItem(key,JSON.stringify(value));saved=true;}}
 catch{saved=false;}
 return {best:value,improved:true,saved};
}
export const splitSeconds=t=>Number(t).toFixed(2)+' s';

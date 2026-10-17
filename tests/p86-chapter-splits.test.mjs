import test from 'node:test';
import assert from 'node:assert/strict';
import {createChapterSplits,observeChapterSplits,chapterTimerView,
 readChapterBest,storeChapterBest,chapterRecordKey,splitSeconds} from '../web/p86-chapter-splits.mjs';
import {FLOW_CHAPTERS} from '../web/p80-trackflow.mjs';
import {generateEchoRush} from '../scripts/p66-echo-rebuild.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {createNativeDemoState,nativeDemoSteer,recordDemoMilestone} from '../web/p78-demo.mjs';

const store=()=>{const m=new Map();return {getItem:key=>m.get(key)||null,setItem:(key,value)=>m.set(key,value),map:m}};
const sid=id=>'p66-'+id+'-01';

test('P86 8 native road chapters: explicit physical contact, monotonic passes and no unearned skipped sectors',()=>{
 const tracker=createChapterSplits('EP-P66',0,sid('PIPE_DIVE_A'),0);
 assert.equal(chapterTimerView(tracker,0).id,'pipe');
 const events=[];
 const sequence=[
  [sid('PIPE_DIVE_A'),2],['p66-PIPE_RETURN-01',10],
  [sid('SPIRAL_CATHEDRAL'),32],[sid('FORK_APPROACH'),60],
  [sid('FORK_R'),62],[sid('FORK_REJOIN'),69],
  [sid('MACHINE_CHAMBER'),74],[sid('GAP_TAKEOFF'),78],
  [null,80],[sid('GAP_LANDING'),82],[sid('GAP_LANDING'),84,'finished']
 ];
 let previous=sid('PIPE_DIVE_A');
 for(const [surface,time,status='running'] of sequence){
  const e=observeChapterSplits(tracker,surface,previous,time,status);
  if(e)events.push(e);
  previous=surface||previous;
 }
 assert.equal(tracker.done,true);
 assert.deepEqual(tracker.completed.map(x=>x.id),FLOW_CHAPTERS.map(x=>x.id));
 assert.equal(tracker.completed.length,8);
 assert.equal(tracker.completed[0].duration,10);
 assert.equal(tracker.completed[1].duration,22);
 assert.equal(tracker.completed[2].duration,28);
 assert.equal(tracker.completed[3].duration,9);
 assert.equal(tracker.completed[4].duration,5);
 assert.equal(tracker.completed[5].duration,4);
 assert.equal(tracker.completed[6].duration,4);
 assert.equal(tracker.completed[7].duration,2);
 assert.equal(observeChapterSplits(tracker,sid('PIPE_DIVE_A'),null,90,'finished'),null);
 assert.equal(chapterTimerView(tracker,84).completed,8);
 assert.equal(splitSeconds(3.25),'3.25 s');
});
test('P86 practice checkpoint starts at takeover time without inherited spectator clock',()=>{
 const t=createChapterSplits('EP-P66',0,sid('MACHINE_CHAMBER'),74.2);
 assert.equal(chapterTimerView(t,74.2).elapsed,0);
 const e=observeChapterSplits(t,sid('GAP_TAKEOFF'),null,78.1,'running');
 assert.equal(e.id,'machines');
 assert.equal(e.duration,3.9);
 const p=createChapterSplits('EP-P66',2,sid('FORK_L'),1);
 assert.equal(chapterTimerView(p,1).id,'fork');
 assert.equal(observeChapterSplits(p,sid('FORK_R'),null,2,'running'),null);
 assert.equal(observeChapterSplits(p,sid('PIPE_RETURN'),null,3,'running'),null);
 assert.equal(chapterTimerView(p,3).id,'fork');
 observeChapterSplits(p,sid('FORK_REJOIN'),null,4,'failed');
 assert.equal(p.done,true);
 assert.equal(p.completed.length,1);
 assert.equal(createChapterSplits('EP-001',0,sid('PIPE_DIVE_A'),0),null);
 assert.throws(()=>observeChapterSplits(t,sid('GAP_LANDING'),null,70),/reversed/);
});
test('P86 records are faster-is-better, isolated per spawn and resilient to localStorage errors',()=>{
 const memory=store(),a={stageId:'EP-P66',spawn:0,id:'spiral',label:'SPIRAL',index:2,duration:16.125,time:45.200};
 assert.equal(storeChapterBest(memory,a).improved,true);
 assert.equal(readChapterBest(memory,'EP-P66',0,'spiral').duration,16.125);
 assert.equal(storeChapterBest(memory,{...a,duration:17.5}).improved,false);
 assert.equal(storeChapterBest(memory,{...a,duration:15.2}).improved,true);
 assert.equal(readChapterBest(memory,'EP-P66',0,'spiral').duration,15.2);
 assert.equal(readChapterBest(memory,'EP-P66',1,'spiral'),null);
 assert.equal(readChapterBest(memory,'EP-P66',0,'machines'),null);
 memory.setItem(chapterRecordKey('EP-P66',0,'spiral'),'{bad json');
 assert.equal(readChapterBest(memory,'EP-P66',0,'spiral'),null);
 memory.setItem(chapterRecordKey('EP-P66',0,'spiral'),JSON.stringify({...a,duration:-99}));
 assert.equal(readChapterBest(memory,'EP-P66',0,'spiral'),null);
 const denied={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}};
 assert.equal(storeChapterBest(denied,a).saved,false);
 assert.equal(readChapterBest(denied,'EP-P66',0,'spiral'),null);
 assert.throws(()=>chapterRecordKey('EP-P66',0,'unsafe-chapter'));
});
test('P86 exact P77/P78 full native 240Hz Runner finishes 8 sections without modifying physics',()=>{
 const doc=generateEchoRush(),world=compile(doc);
 const runner=new Runner(doc,world,0,44),driver=createNativeDemoState();
 const tracker=createChapterSplits(doc.stageForge.id,0,runner.surface,runner.time);
 const events=[];
 for(let i=0;i<Math.ceil(90/DT)&&!['failed','finished'].includes(runner.status);i++){
  runner.step(nativeDemoSteer(driver,runner));
  recordDemoMilestone(driver,runner);
  const e=observeChapterSplits(tracker,runner.surface,runner.lastSurface,runner.time,runner.status);
  if(e)events.push(e);
 }
 assert.equal(runner.status,'finished','native full route did not finish');
 assert.equal(events.length,8,'real road contacts must reach all eight sections');
 assert.deepEqual(events.map(x=>x.id),FLOW_CHAPTERS.map(x=>x.id));
 assert(events.every(x=>x.duration>0),'physical sectors must have positive travel time');
 assert(events.every((x,i)=>i===0||x.time>events[i-1].time),'physical split times must progress');
 assert.equal(events.at(-1).time,Number(runner.time.toFixed(3)));
 assert(runner.time>82&&runner.time<85);
 assert.equal(runner.failure,null);
 console.log('P86_NATIVE_FULL_CHAPTER_SPLITS '+JSON.stringify({time:Number(runner.time.toFixed(3)),
  chapters:events.map(x=>({id:x.id,duration:x.duration,at:x.time}))}));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {generateEchoRush} from '../scripts/p66-echo-rebuild.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {createNativeDemoState,nativeDemoSteer,recordDemoMilestone} from '../web/p78-demo.mjs';
import {PRACTICE_CHAPTERS,SEEK_BATCH_STEPS,createPracticeSeek,advancePracticeSeek,practiceElapsed} from '../web/p79-practice.mjs';

test('P79 all 7 practice targets are real, physically reachable surfaces of the 83s P78 replay',()=>{
 const doc=generateEchoRush(),world=compile(doc),runner=new Runner(doc,world,0,44);
 const director=createNativeDemoState(),first=new Map();
 const known=new Set(doc.surfaces.map(s=>s.id));
 for(const target of PRACTICE_CHAPTERS)assert(known.has(target.surface),'chapter target not in physical world: '+target.id);
 for(let i=0;i<240*90&&runner.status!=='failed'&&runner.status!=='finished';i++){
  runner.step(nativeDemoSteer(director,runner));
  recordDemoMilestone(director,runner);
  for(const target of PRACTICE_CHAPTERS)
   if(runner.surface===target.surface&&!first.has(target.id))
    first.set(target.id,{time:runner.time,position:[...runner.p],velocity:[...runner.v],surface:runner.surface});
 }
 assert.equal(runner.status,'finished');
 for(const target of PRACTICE_CHAPTERS){
  assert(first.has(target.id),'P78 canonical trajectory did not reach practice chapter '+target.id);
  assert(first.get(target.id).time>0);
 }
 console.log('P79_PHYSICAL_CHAPTER_TIMES '+JSON.stringify(Object.fromEntries(
  [...first].map(([k,v])=>[k,Number(v.time.toFixed(3))]))));
});

test('P79 chapter seek runs exact native 240Hz motion in bounded chunks then gives up native Runner at real chapter',()=>{
 const doc=generateEchoRush(),world=compile(doc),target='machines';
 const seek=createPracticeSeek(target);
 const runner=new Runner(doc,world,0,44);
 const control=new Runner(doc,world,0,44),controlDir=createNativeDemoState();
 const physicalOriginal=doc.surfaces.map(s=>s.id);
 let calls=0;
 while(seek.status==='seeking'){
  const result=advancePracticeSeek(seek,runner,SEEK_BATCH_STEPS);
  assert(result.steps>=1&&result.steps<=SEEK_BATCH_STEPS);
  assert.equal(result.status,seek.status);
  calls++;
  assert(calls<300,'practice seek did not reach machine chamber in bounded frame batches');
 }
 assert.equal(seek.status,'ready');
 assert.equal(runner.surface,'p66-MACHINE_CHAMBER-01');
 assert.equal(seek.steps,Math.round(runner.time/DT));
 // Independent original P78 real physics must reach the EXACT same state;
 // no direct p, v, time, surface or obstacle-phase injection may occur.
 for(let i=0;i<seek.steps;i++){
  control.step(nativeDemoSteer(controlDir,control));
  recordDemoMilestone(controlDir,control);
 }
 assert.deepEqual(runner.p,control.p,'practice position differs from canonical 240Hz re-simulation');
 assert.deepEqual(runner.v,control.v,'practice velocity differs from canonical 240Hz re-simulation');
 assert.deepEqual(runner.forward,control.forward);
 assert.equal(runner.time,control.time);
 assert.equal(runner.surface,control.surface);
 assert.deepEqual(runner.events,control.events);
 assert.equal(practiceElapsed(runner.time,runner.time),0);
 assert.equal(practiceElapsed(runner.time+2.5,runner.time),2.5);
 assert.equal(practiceElapsed(runner.time,null),0);
 // The resumed user applies 240Hz manual steering on the very same runner.
 const before=runner.time,p=[...runner.p];
 for(let i=0;i<60;i++)runner.step(i<30?-1:1);
 assert(runner.time>before);
 assert.notDeepEqual(runner.p,p);
 assert.deepEqual(doc.surfaces.map(s=>s.id),physicalOriginal);
 console.log('P79_EXACT_NATIVE_HANDOFF '+JSON.stringify({surface:control.surface,time:control.time,speed:Math.hypot(...control.v),batches:calls}));
});

test('P79 invalid chapter and unsafe batch sizes fail closed',()=>{
 assert.throws(()=>createPracticeSeek('not-a-real-surface'),/Unsupported practice chapter/);
 const runner={time:0,status:'ready'};
 const seek=createPracticeSeek('fork');
 assert.throws(()=>advancePracticeSeek(seek,runner,0),/Invalid practice replay budget/);
 assert.throws(()=>advancePracticeSeek(seek,runner,99999),/Invalid practice replay budget/);
 seek.status='ready';
 assert.deepEqual(advancePracticeSeek(seek,runner),{status:'ready',steps:0,time:0});
});

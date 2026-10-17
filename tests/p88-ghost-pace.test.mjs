import test from 'node:test';
import assert from 'node:assert/strict';
import {generateEchoRush} from '../scripts/p66-echo-rebuild.mjs';
import {generateReferenceGhost} from '../scripts/p87-ghost-generate.mjs';
import {validateReferenceSectors,compareGhostSector,paceCaption} from '../web/p88-ghost-pace.mjs';
import {FLOW_CHAPTERS} from '../web/p80-trackflow.mjs';
import {createChapterSplits,observeChapterSplits} from '../web/p86-chapter-splits.mjs';
import {createNativeDemoState,nativeDemoSteer,recordDemoMilestone} from '../web/p78-demo.mjs';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {compile} from '../private/reference_only/director/collision.js';

test('P88 offline native reference contains eight ordered real physical sector milestones',()=>{
 const course=generateEchoRush();
 const original=JSON.stringify(course);
 const replay=generateReferenceGhost(course);
 const sectors=validateReferenceSectors(replay);
 assert.equal(sectors.length,8);
 assert.deepEqual(sectors.map(s=>s.id),FLOW_CHAPTERS.map(c=>c.id));
 assert.equal(sectors.at(-1).time,replay.finishSeconds);
 assert.equal(JSON.stringify(course),original,'ghost generation cannot modify any course data');
 for(let i=0;i<sectors.length;i++){
  assert(sectors[i].time>=(i?sectors[i-1].time:0));
  const same={id:sectors[i].id,index:i,time:sectors[i].time,duration:sectors[i].duration};
  const compared=compareGhostSector(same,replay);
  assert.equal(compared.delta,0);
  assert.equal(compared.sign,'tie');
  assert.equal(compared.referenceTime,sectors[i].time);
 }
 const earlier={id:sectors[0].id,index:0,time:sectors[0].time-1,duration:sectors[0].duration};
 const later={id:sectors[0].id,index:0,time:sectors[0].time+1.5,duration:sectors[0].duration};
 assert.equal(compareGhostSector(earlier,replay).sign,'ahead');
 assert.equal(compareGhostSector(later,replay).sign,'behind');
 assert(paceCaption(compareGhostSector(earlier,replay)).includes('速い'));
 assert(paceCaption(compareGhostSector(later,replay)).includes('遅い'));
 console.log('P88_NATIVE_GHOST_SECTOR_GATE '+JSON.stringify({sectors:sectors.map(x=>[x.id,x.time]),finishSeconds:replay.finishSeconds}));
});
test('P88 reject fabricated/duplicate/reversed native sector reference and cross-sector mismatches',()=>{
 const sectors=FLOW_CHAPTERS.map((c,i)=>({id:c.id,time:i*8+8,duration:8}));
 const replay={sectors,finishSeconds:64};
 assert.equal(validateReferenceSectors(replay),sectors);
 assert.equal(compareGhostSector({id:'pipe',index:2,time:9,duration:8},replay),null);
 assert.equal(compareGhostSector(null,replay),null);
 for(const wrong of [
  {...replay,sectors:sectors.slice(0,7)},
  {...replay,sectors:sectors.map((x,i)=>i===3?{...x,id:'fake'}:x)},
  {...replay,sectors:sectors.map((x,i)=>i===5?{...x,time:18}:x)},
  {...replay,finishSeconds:63}
 ])assert.throws(()=>validateReferenceSectors(wrong),/sector|timestamp|finish/);
});
test('P88 comparison is read-only in original native 240Hz Runner, no points or steering changes',()=>{
 const doc=generateEchoRush(),world=compile(doc),a=new Runner(doc,world,0,44),b=new Runner(doc,world,0,44);
 const splits=createChapterSplits(doc.stageForge.id,0,b.surface,b.time),director=createNativeDemoState();
 const reference={sectors:FLOW_CHAPTERS.map((x,i)=>({id:x.id,time:(i+1)*10,duration:10})),finishSeconds:80};
 for(let i=0;i<240*18;i++){
  const steer=nativeDemoSteer(director,a);
  a.step(steer);b.step(steer);recordDemoMilestone(director,a);
  const event=observeChapterSplits(splits,b.surface,b.lastSurface,b.time,b.status);
  if(event)compareGhostSector(event,reference);
  if(a.status!=='running'||b.status!=='running')break;
 }
 assert.deepEqual(a.p,b.p);assert.deepEqual(a.v,b.v);
 assert.deepEqual(a.events,b.events);
 assert.equal(a.points,b.points);
 assert.equal(a.status,b.status);
 assert(splits.completed.length>=1,'native pipe-to-halo crossing expected');
});

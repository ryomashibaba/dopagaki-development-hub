import test from 'node:test';
import assert from 'node:assert/strict';
import {survivalScore,runRecordKey,buildRunRecord,betterRecord,readBest,storeBest,scoreString,RECORD_SCHEMA} from '../web/p75-survival.mjs';
import {generateEchoRush} from '../scripts/p66-echo-rebuild.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';

const memoryStore=()=>{const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v),values:m};};
test('P75 survival is ALWAYS >=95% of full score at any near-miss count',()=>{
 for(const seconds of [0,.001,.01,.12,1,5,30,90,360,3600]){
  for(const n of [0,1,2,3,10,100,10000]){
   const score=survivalScore(seconds,n);
   assert.equal(score.total,score.survival+score.bonus);
   assert(score.bonus>=0&&score.survival>=0);
   assert(score.bonusShare<=.05+1e-12,'bonus share exceeded 5%');
   assert(score.total===0||score.survival/score.total>=.95-1e-12);
  }
 }
 assert.equal(survivalScore(60,0).total,6000);
 assert.equal(survivalScore(60,100000).bonus,Math.floor(6000/19));
 assert.equal(scoreString(12345),'12,345');
});
test('P75 only genuine ended runs are stored, and survival duration outranks score bonus',()=>{
 const store=memoryStore();
 const fast=buildRunRecord({stageId:'EP-P66',spawn:4,seconds:31.2,nearMisses:0,outcome:'failed'});
 const slower=buildRunRecord({stageId:'EP-P66',spawn:4,seconds:30.6,nearMisses:100,outcome:'failed'});
 assert(fast.total<slower.total,'control: bonus should make shorter score numerically larger');
 assert.equal(storeBest(store,fast).improved,true);
 assert.equal(storeBest(store,slower).improved,false);
 assert.equal(readBest(store,'EP-P66',4).seconds,31.2);
 assert.equal(readBest(store,'EP-P66',5),null);
 assert.equal(readBest(store,'EP-001',4),null);
 assert.equal(storeBest(store,buildRunRecord({stageId:'EP-P66',spawn:4,seconds:32.1,nearMisses:0,outcome:'finished'})).improved,true);
 assert.equal(readBest(store,'EP-P66',4).outcome,'finished');
 assert.throws(()=>buildRunRecord({stageId:'EP-P66',spawn:4,seconds:9,nearMisses:0,outcome:'running'}),/Only completed/);
 assert.equal(betterRecord({seconds:20,total:2000,outcome:'failed'}, {seconds:20,total:2000,outcome:'finished'}),false);
});
test('P75 storage failures and malformed/tampered records never crash or inflate the score',()=>{
 const fail={getItem(){throw Error('storage denied')},setItem(){throw Error('storage denied')}};
 const record=buildRunRecord({stageId:'HS-001',spawn:0,seconds:9.9999,nearMisses:2,outcome:'failed'});
 assert.equal(record.schema,RECORD_SCHEMA);
 assert.equal(record.seconds,10);
 assert.equal(record.total,record.survival+record.bonus);
 assert.equal(storeBest(fail,record).saved,false);
 assert.equal(readBest(fail,'HS-001',0),null);
 const store=memoryStore();
 store.setItem(runRecordKey('HS-001',0),'{bad');
 assert.equal(readBest(store,'HS-001',0),null);
 store.setItem(runRecordKey('HS-001',0),JSON.stringify({...record,total:999999}));
 assert.equal(readBest(store,'HS-001',0),null);
 assert.throws(()=>survivalScore(-1,1));
 assert.throws(()=>survivalScore(20,-1));
 assert.throws(()=>runRecordKey('../foo',0));
});
test('P75 score stays read-only with real B48 Runner after native 240Hz gameplay',()=>{
 const course=generateEchoRush(),world=compile(course);
 const a=new Runner(course,world,2,44),b=new Runner(course,world,2,44);
 for(let i=0;i<240;i++){
  a.step(0);b.step(0);
  const summary=survivalScore(b.time,0);
  assert(summary.bonusShare<=.05);
 }
 assert.deepEqual(a.p,b.p);
 assert.deepEqual(a.v,b.v);
 assert.deepEqual(a.events,b.events);
 assert.equal(a.points,b.points);
 assert.equal(a.status,b.status);
 assert(Math.abs(b.time-240*DT)<1e-9);
});

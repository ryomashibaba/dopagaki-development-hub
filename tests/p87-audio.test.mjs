import test from 'node:test';
import assert from 'node:assert/strict';
import {createArcadeAudio,soundEvent,MOTIF_MIDI,TEMPO,BEAT_SECONDS,midiHz} from '../web/p87-audio.mjs';
import {generateEchoRush} from '../scripts/p66-echo-rebuild.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner} from '../private/reference_only/director/physics.js';

class FakeParam{
 constructor(){this.value=0;this.values=[];}
 setValueAtTime(v,t){this.value=v;this.values.push([v,t]);}
 exponentialRampToValueAtTime(v,t){this.value=v;this.values.push([v,t]);}
 setTargetAtTime(v,t,k){this.value=v;this.values.push([v,t,k]);}
}
class FakeAudioContext{
 constructor(){this.currentTime=0;this.destination={};this.oscillators=[];this.gains=[];this.suspended=false;}
 createOscillator(){
  const ctx=this;
  const o={frequency:new FakeParam(),type:'sine',connect(){},start(time){this.startTime=time;},stop(time){this.stopTime=time;}};
  ctx.oscillators.push(o);return o;
 }
 createGain(){const g={gain:new FakeParam(),connect(){}};this.gains.push(g);return g;}
 async resume(){this.suspended=false;}
 async suspend(){this.suspended=true;}
}
test('P87 original six-note dark melodic motif has >=2 second introduction and valid bounded notes',()=>{
 assert.equal(TEMPO,134);
 assert.equal(MOTIF_MIDI.length,6);
 assert(BEAT_SECONDS>0&&BEAT_SECONDS<1);
 assert.equal(soundEvent(0).intro,true);
 assert.equal(soundEvent(8).intro,true);
 assert.equal(soundEvent(10).intro,false);
 assert.equal(soundEvent(10).melodic,true);
 assert.equal(soundEvent(11).melodic,false);
 assert.equal(soundEvent(10).pitch,midiHz(64));
 assert.equal(soundEvent(12).pitch,midiHz(67));
 assert.equal(soundEvent(20).pitch,midiHz(62));
 assert(soundEvent(10,140).pitch>soundEvent(10,44).pitch);
 assert.equal(soundEvent(10,140).intensity,1);
 assert.throws(()=>soundEvent(-1),/Invalid/);
});
test('P87 audio is permanently silent until user opt-in and respects explicit mute and pause',async()=>{
 const fake=new FakeAudioContext(),audio=createArcadeAudio(()=>fake);
 assert.equal(audio.state.enabled,false);
 for(let i=0;i<100;i++){fake.currentTime=i*.1;audio.tick({velocity:80});audio.effect('near-miss');}
 assert.equal(fake.oscillators.length,0);
 assert.equal(await audio.enable(),true);
 assert.equal(audio.state.enabled,true);
 const first=audio.tick({velocity:44,running:true,paused:false,visible:true});
 assert(first.scheduled>=1&&first.scheduled<=3);
 assert(fake.oscillators.length>0);
 const after=fake.oscillators.length;
 fake.currentTime+=.25;audio.tick({velocity:80,running:true,paused:true,visible:true});
 assert.equal(fake.oscillators.length,after,'pause must schedule no further notes');
 assert.equal(fake.gains[0].gain.value,0,'pause must attenuate output');
 audio.tick({velocity:44,running:true,paused:false,visible:false});
 assert.equal(fake.oscillators.length,after,'hidden tab should schedule no notes');
 audio.effect('near-miss');assert(fake.oscillators.length>after);
 await audio.disable();
 assert.equal(fake.suspended,true);
 const beforeMuted=fake.oscillators.length;
 audio.effect('finish');audio.tick({velocity:120,running:true});
 assert.equal(fake.oscillators.length,beforeMuted);
 assert.equal(audio.state.enabled,false);
});
test('P87 short lookahead prevents audio-node explosions at slow or stalled render FPS',async()=>{
 const fake=new FakeAudioContext(),audio=createArcadeAudio(()=>fake);
 await audio.enable();
 for(let i=0;i<200;i++){
  fake.currentTime=i*.1;
  const report=audio.tick({velocity:60+60*Math.sin(i*.07)});
  assert(report.scheduled<=3);
 }
 assert(audio.state.voices<190,'avoid unbounded polyphony at 10fps');
 const before=audio.state.step;
 audio.reset();
 assert.equal(audio.state.step,0);
 assert(before>0);
 assert(audio.effect('unknown')===false);
 for(const effect of ['jump','land','near-miss','finish','failed']){
  assert.equal(audio.effect(effect),true);
 }
 assert(fake.oscillators.every(x=>x.stopTime>x.startTime));
});
test('P87 audio engine degrades safely if unavailable or blocked',async()=>{
 const unsupported=createArcadeAudio(()=>{throw Error('AudioContext disabled');});
 assert.equal(await unsupported.enable(),false);
 assert.equal(unsupported.tick({running:true}).enabled,false);
 assert.equal(unsupported.effect('near-miss'),false);
 const fake=new FakeAudioContext(),blocked=createArcadeAudio(()=>fake);
 fake.resume=async()=>{throw Error('NotAllowedError');};
 assert.equal(await blocked.enable(),false);
 assert.equal(blocked.state.enabled,false);
});
test('P87 sound cue polling leaves actual B48 Runner position, velocity, events and score unchanged',async()=>{
 const doc=generateEchoRush(),world=compile(doc);
 const a=new Runner(doc,world,0,44),b=new Runner(doc,world,0,44);
 const fake=new FakeAudioContext(),sound=createArcadeAudio(()=>fake);
 await sound.enable();
 for(let i=0;i<480;i++){
  a.step(0);b.step(0);
  if(i%4===0){fake.currentTime+=1/60;sound.tick({velocity:Math.hypot(...b.v),running:b.status==='running'});}
  if(i===90)sound.effect('near-miss');
 }
 assert.deepEqual(a.p,b.p);
 assert.deepEqual(a.v,b.v);
 assert.deepEqual(a.events,b.events);
 assert.equal(a.points,b.points);
 assert.equal(a.time,b.time);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {p101Step,p101ReboundRecoveryState,P101_REBOUND_RECOVERY,P101_STEP} from '../web/p101-overdrive.mjs';
import {generateP101B5Speedway} from '../scripts/p101-b5-speedway-build.mjs';
import {generateP101W9C1AbyssCandidate} from '../scripts/p101-w9c1-abyss-narrow.mjs';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner} from '../private/reference_only/director/physics.js';

// A controlled native-step surrogate injects precisely one nonlethal contact
// AFTER the impulse, then continues 240 Hz on flat ground. This is explicitly
// fault-injection, not proof that the real authored obstacle was hit.
function mockRunner({recordStageId='VB-P101-A13-W9C1-CONTROL',variant='A13_GAMEPLAY_ISOLATED',
 contactAt=8,mode='bounce',reverseMps=-65,grounded=true}={}){
 let ticks=0;
 return {
  doc:{stageForge:{id:'VB-P101',variant,recordStageId}},
  p:[0,0,200],v:[0,0,52],forward:[0,0,1],normal:[0,1,0],
  events:[],grounded,status:'running',time:0,collisions:0,
  step(){
   ticks++;this.time+=P101_STEP;
   this.v[2]+=1.1*P101_STEP; // native P101 forward thrust on flat support
   this.p[2]+=this.v[2]*P101_STEP;
   if(ticks===contactAt){
    const before=this.v[2];this.v[2]=reverseMps;this.collisions++;
    this.events.push({type:'moving-contact',t:this.time,id:'injected-machine',
     mode,forwardBeforeMps:before,forwardAfterMps:reverseMps});
   }
  }
 };
}
const power={forwardScale:.12,collisionRecovery:true};
const run=(r,frames,opts=power)=>{
 for(let i=0;i<frames;i++)p101Step(r,0,'OVERDRIVE',opts);
 return r;
};

test('nonlethal rebound retains initial backwards motion but physically restores positive travel',()=>{
 const recovered=mockRunner(),baseline=mockRunner();
 run(recovered,8);run(baseline,8,{forwardScale:.12});
 assert.equal(p101ReboundRecoveryState(recovered).active,true);
 const recoil=recovered.v[2];
 assert(recoil<-60);
 run(recovered,25);run(baseline,25,{forwardScale:.12});
 assert(recovered.v[2]<-50,'must preserve observable knockback and never instant-reset velocity');
 const positionAtRecoil=recovered.p[2];
 run(recovered,475);run(baseline,475,{forwardScale:.12});
 assert(recovered.v[2]>P101_REBOUND_RECOVERY.restoreForwardMps,
  'forward recovery must end in moving forward, not a stuck negative longitudinal velocity');
 assert(baseline.v[2]<-55,'2m/s2 vanilla thrust cannot undo -65m/s recoil in two seconds');
 assert(recovered.p[2]>positionAtRecoil,'ball moves forward by integrated velocity');
 const events=recovered.events.filter(x=>x.type.startsWith('rebound-recovery-'));
 assert.deepEqual(events.map(x=>x.type),['rebound-recovery-start','rebound-recovery-end']);
 assert.equal(events[1].reason,'forward-restored');
 assert.equal(p101ReboundRecoveryState(recovered).active,false);
 assert.equal(recovered.collisions,1,'nonlethal contact is retained');
 assert(recovered.events.every(e=>e.type!=='teleport'&&e.type!=='invincible'));
});

test('slow stop after push also recovers, without creating a false contact event',()=>{
 const stopped=mockRunner({mode:'push',reverseMps:0});
 run(stopped,650);
 assert(stopped.v[2]>28,'almost stopped ball must regain normal forward movement');
 assert.equal(stopped.events.filter(x=>x.type==='moving-contact').length,1);
 const untouched=mockRunner({contactAt:-1,reverseMps:0});
 run(untouched,500);
 assert.equal(p101ReboundRecoveryState(untouched).active,false,'must not boost without genuine contact');
 assert(untouched.events.every(e=>!e.type.startsWith('rebound-recovery-')));
});

test('airborne rebound is not converted to artificial aerial propulsion',()=>{
 const airborne=mockRunner({grounded:false,reverseMps:-65}),normal=mockRunner({grounded:false,reverseMps:-65});
 run(airborne,170);run(normal,170,{forwardScale:.12});
 assert.equal(airborne.v[2],normal.v[2],'no collision recovery force when airborne');
 assert(airborne.v[2]<-60);
});

test('Gold W7F, W9-X and generic P101 are never activated, even with opt-in',()=>{
 for(const [variant,id] of [
  ['A13_GAMEPLAY_ISOLATED','VB-P101-A13-W7F'],
  ['A13_GAMEPLAY_ISOLATED','VB-P101-A13-W9X-B1'],
  ['P101_GENERIC','VB-P101']]){
  const r=mockRunner({variant,recordStageId:id});
  run(r,300);
  assert.equal(p101ReboundRecoveryState(r).active,false,id);
  assert.equal(r.events.filter(e=>e.type.startsWith('rebound-recovery-')).length,0,id);
  assert(r.v[2]<-55,id+' should retain original physics');
 }
 const b5=mockRunner({variant:'B5_HYPER_ARC_ISOLATED',recordStageId:'VB-P101-B5'});
 run(b5,500);
 assert(b5.v[2]>28,'B5 human run also benefits from recovery');
});

test('actual 240Hz B48 Runner remains unmodified without contact: 28m trial and frozen W7F',()=>{
 const control=generateP101W9C1AbyssCandidate('control');
 const gold=generateP101A13W7Candidate(),goldBefore=JSON.stringify(gold);
 for(const doc of [control,gold]){
  const world=compile(doc),trial=new Runner(doc,world,0,52),baseline=new Runner(doc,world,0,52);
  for(let i=0;i<70;i++){
   if(trial.status!=='running'&&trial.status!=='ready')break;
   p101Step(trial,0,'OVERDRIVE',{forwardScale:.12,collisionRecovery:true});
   p101Step(baseline,0,'OVERDRIVE',{forwardScale:.12,collisionRecovery:false});
  }
  assert.deepEqual(trial.p,baseline.p);
  assert.deepEqual(trial.v,baseline.v);
  assert.equal(p101ReboundRecoveryState(trial).active,false);
 }
 assert.equal(JSON.stringify(gold),goldBefore);
 const b5=generateP101B5Speedway({lowerReversalLength:1800});
 assert.equal(b5.stageForge.variant,'B5_HYPER_ARC_ISOLATED');
});

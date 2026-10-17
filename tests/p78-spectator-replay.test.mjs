import test from 'node:test';
import assert from 'node:assert/strict';
import {generateEchoRush} from '../scripts/p66-echo-rebuild.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT,RADIUS} from '../private/reference_only/director/physics.js';
import {createNativeDemoState,recordDemoMilestone,nativeDemoSteer,isDemoEligible,DEMO_EXPECTED_FINISH_SECONDS} from '../web/p78-demo.mjs';

test('P78 spectator replays full P77 proven native trajectory without changing Runner physics',()=>{
 const doc=generateEchoRush(),world=compile(doc);
 assert(isDemoEligible(doc));assert.equal(RADIUS,.65);assert.equal(DT,1/240);
 const state=createNativeDemoState(),runner=new Runner(doc,world,0,44);
 let finish=null;const surfaces=new Set();
 const sampled={atFork:0,atReturn:0,atSpiral:0,atMachine:0,atJump:0,atLanding:0};
 for(let i=0;i<240*90&&!['failed','finished'].includes(runner.status);i++){
  const steer=nativeDemoSteer(state,runner);
  assert([-1,0,1].includes(steer));
  runner.step(steer);
  recordDemoMilestone(state,runner);
  if(runner.surface)surfaces.add(runner.surface);
  for(const [key,match] of [['atReturn','PIPE_RETURN'],['atSpiral','SPIRAL_CATHEDRAL'],['atFork','FORK_APPROACH'],['atMachine','MACHINE_CHAMBER'],['atJump','GAP_TAKEOFF'],['atLanding','GAP_LANDING']])
   if(!sampled[key]&&runner.surface?.includes(match))sampled[key]=runner.time;
 }
 finish=runner.time;
 const unsafe=runner.events.filter(e=>['moving-contact','moving-crush','failure'].includes(e.type));
 console.log('P78_SPECTATOR_FULL_NATIVE_RUN '+JSON.stringify({time:finish,status:runner.status,first:sampled,unsafe,finishEvent:runner.events.some(x=>x.type==='finish')}));
 assert.equal(runner.status,'finished','Native spectator must truly finish full route');
 assert.equal(unsafe.length,0,'Cannot fake moving-obstacle survival');
 assert(Math.abs(finish-DEMO_EXPECTED_FINISH_SECONDS)<.5);
 assert(state.forkAt>58.8&&state.forkAt<59.2,'fork entry time must match real P77 contact');
 assert(sampled.atReturn>0&&sampled.atSpiral>sampled.atReturn);
 assert(sampled.atFork>sampled.atSpiral&&sampled.atMachine>sampled.atFork);
 assert(sampled.atJump>sampled.atMachine&&sampled.atLanding>sampled.atJump);
 for(let i=1;i<=6;i++)assert(surfaces.has('p66-SPIRAL_CATHEDRAL-'+String(i).padStart(2,'0')));
 assert(runner.events.some(x=>x.type==='finish'));
 assert.equal(doc.stageForge.humanPlaytest,'NOT_RUN','Do not falsely certify human play');
});
test('P78 demo director defaults neutral, steering pulses are deterministic and mode is restricted to P69 ECHO stage',()=>{
 const state=createNativeDemoState();
 const r={time:0,surface:'p66-PIPE_DIVE_A-01'};
 assert.equal(nativeDemoSteer(state,r),0);
 recordDemoMilestone(state,r);assert.equal(state.forkAt,null);
 r.time=61.96;r.surface='p66-FORK_APPROACH-01';recordDemoMilestone(state,r);
 assert.equal(state.forkAt,61.96);
 assert.equal(nativeDemoSteer(state,r),-1);
 r.time=75.5;assert.equal(nativeDemoSteer(state,r),1);
 r.time=76;assert.equal(nativeDemoSteer(state,r),-1);
 r.time=77;assert.equal(nativeDemoSteer(state,r),0);
 assert.equal(isDemoEligible({stageForge:{id:'EP-001'}}),false);
 assert.equal(isDemoEligible(null),false);
});

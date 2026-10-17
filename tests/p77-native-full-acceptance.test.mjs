import test from 'node:test';
import assert from 'node:assert/strict';
import {generateEchoRush} from '../scripts/p66-echo-rebuild.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT,RADIUS,FIXTURE_IMPULSES} from '../private/reference_only/director/physics.js';

test('P77 first spawn: genuine 240Hz 83s through 520m return, full 450° spiral, fork, moving gauntlet and natural landing to FINISH',()=>{
 const doc=generateEchoRush(),world=compile(doc),runner=new Runner(doc,world,0,44);
 assert.equal(DT,1/240);assert.equal(RADIUS,.65);
 assert.equal(doc.surfaces.length,23);
 assert.equal(doc.stageForge.fullStartToFinish,'NATIVE_SCRIPTED_SPAWN0_TO_FINISH_PASS');
 assert.equal(doc.stageForge.highSpeedLandingDropMeters,8);
 assert.equal(doc.stageForge.humanPlaytest,'NOT_RUN');
 assert.deepEqual(FIXTURE_IMPULSES.shove,{side:10,lift:8,forward:3});
 let forkAt=null,firstAir=null,firstLanding=null,takeoffSpeed=null;
 const reached=new Set(),contacts=[];
 for(let i=0;i<Math.ceil(95/DT)&&!['failed','finished'].includes(runner.status);i++){
  let steer=forkAt&&runner.time>=forkAt&&runner.time<forkAt+5?-1:0;
  if(runner.time>=75.45&&runner.time<75.90)steer=1;
  else if(runner.time>=75.90&&runner.time<76.35)steer=-1;
  runner.step(steer);
  const surface=runner.surface;
  if(surface)reached.add(surface);
  if(!forkAt&&surface?.includes('FORK_APPROACH'))forkAt=runner.time;
  if(takeoffSpeed===null&&surface?.includes('GAP_TAKEOFF'))takeoffSpeed=Math.hypot(...runner.v);
  if(!runner.grounded&&!firstAir)firstAir=runner.time;
  if(!firstLanding&&surface?.includes('GAP_LANDING'))firstLanding=runner.time;
 }
 for(const event of runner.events)if(event.type==='moving-contact'||event.type==='failure')contacts.push(event);
 const evidence={time:Number(runner.time.toFixed(3)),state:runner.status,firstAir,
  firstLanding,forkAt,takeoffSpeed,finished:runner.events.some(x=>x.type==='finish'),
  spiral:[...reached].filter(x=>x.includes('SPIRAL_CATHEDRAL')),
  machine:[...reached].filter(x=>x.includes('MACHINE_CHAMBER')),
  contacts};
 console.log('P77_ACCEPTED_NATIVE_FULL_START_TO_FINISH '+JSON.stringify(evidence));
 assert.equal(runner.status,'finished','full native run must finish, not merely reach jump');
 assert.equal(runner.failure,null);
 assert(contacts.length===0,'scripted player inputs must avoid the six moving machines, not disable their collision');
 assert(firstAir!==null&&firstAir>79&&firstAir<81,'natural jump must be from genuine ramp after no airborne earlier');
 assert(firstLanding!==null&&firstLanding>81&&firstLanding<84,'must touch down on true physical landing road');
 assert(takeoffSpeed>90,'full run must test the previously broken high-speed landing');
 assert(runner.time>82&&runner.time<85);
 for(const part of ['PIPE_DIVE_A-01','PIPE_DIVE_A-02','PIPE_RETURN-01','PIPE_RETURN-02','FORK_R-01','FORK_R-02','FORK_REJOIN-01','MACHINE_CHAMBER-01','MACHINE_CHAMBER-02','MACHINE_CHAMBER-03','GAP_TAKEOFF-01','GAP_LANDING-01','GAP_LANDING-02'])
  assert(reached.has('p66-'+part),'missing actual physical chapter '+part);
 for(let i=1;i<=6;i++)assert(reached.has('p66-SPIRAL_CATHEDRAL-'+String(i).padStart(2,'0')),'skipped spiral '+i);
 assert(runner.events.some(x=>x.type==='finish'),'course did not emit native finish event');
});

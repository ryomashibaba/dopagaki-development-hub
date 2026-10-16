import test from 'node:test';
import assert from 'node:assert/strict';
import {generateEchoRush} from '../scripts/p66-echo-rebuild.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT,FIXTURE_IMPULSES} from '../private/reference_only/director/physics.js';

test('P69 native 450-degree spiral traverses six segments and reaches natural jump runway with actual steering',()=>{
 const course=generateEchoRush();
 assert.equal(course.surfaces.length,21);
 assert.equal(course.stageForge.spiralExit,'NATIVE_SCRIPTED_FROM_SPIRAL_SPAWN_PASS');
 assert.equal(DT,1/240);
 assert.deepEqual(FIXTURE_IMPULSES.shove,{side:10,lift:8,forward:3});
 const rider=new Runner(course,compile(course),1,44);
 const reached=new Set();
 let firstAir=null,failed=null,encounteredFork=false,encounteredJump=false;
 for(let i=0;i<Math.round(85/DT)&&rider.status!=='failed'&&rider.status!=='finished';i++){
  const steer=rider.time>=62.15&&rider.time<67.15?-1:0;
  rider.step(steer);
  if(rider.surface)reached.add(rider.surface);
  if(rider.surface?.includes('FORK_APPROACH'))encounteredFork=true;
  if(rider.surface?.includes('GAP_TAKEOFF'))encounteredJump=true;
  if(!rider.grounded&&!firstAir)firstAir={t:rider.time,p:[...rider.p]};
  if(rider.status==='failed')failed=rider.failure;
 }
 const note={time:rider.time,status:rider.status,firstAir,failed,position:rider.p,speed:Math.hypot(...rider.v),lastSurface:rider.surface,spiralSegments:[...reached].filter(x=>x.includes('SPIRAL_CATHEDRAL'))};
 console.log('P69_ACCEPTED_REAL_RUN '+JSON.stringify(note));
 assert.equal(failed,null,'P69 scripted native line must survive to natural launch approach');
 assert(note.time>=84.9,'run ended early');
 for(let i=1;i<=6;i++)assert(reached.has('p66-SPIRAL_CATHEDRAL-'+String(i).padStart(2,'0')),'missing full spiral segment '+i);
 assert(encounteredFork,'failed to enter broad real 3D fork approach');
 assert(encounteredJump,'failed to reach natural jump takeoff with actual physics');
 assert.equal(firstAir,null,'no unplanned flight before natural ramp');
 assert(rider.status==='running','no false finish');
});

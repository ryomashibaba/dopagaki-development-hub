import test from 'node:test';
import assert from 'node:assert/strict';
import {generateEchoRush} from '../scripts/p66-echo-rebuild.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT,RADIUS} from '../private/reference_only/director/physics.js';

const doc=generateEchoRush(),world=compile(doc);
export function nativeFullReplay(mode='timed',seconds=115){
 const r=new Runner(doc,world,0,44);
 let air=null,failed=null,firstSpiral=null,firstFork=null,firstMachine=null,firstTakeoff=null,landing=null;
 let firstSurface='';const visited=new Set(),transitions=[];
 let firstAtSpiral=0;
 const maxSteps=Math.round(seconds/DT);
 for(let k=0;k<maxSteps&&!['failed','finished'].includes(r.status);k++){
  const relative=firstSpiral?r.time-firstSpiral:null;
  // Former P69 successful steering was a strong-left 5s at the spiral exit
  // 62.15 seconds after spawn 1 (.2 through spiral part 1). For start 00
  // the true entrance begins at t~16.82; do not assume that offset is exact.
  const steering=mode==='neutral'?0:relative!==null&&relative>66.8&&relative<71.8?-1:0;
  r.step(steering);
  if(r.surface){
   visited.add(r.surface);
   if(r.surface!==firstSurface&&transitions.length<40){
    transitions.push({t:+r.time.toFixed(3),s:r.surface,speed:+Math.hypot(...r.v).toFixed(2)});
    firstSurface=r.surface;
   }
   if(!firstSpiral&&r.surface.includes('SPIRAL_CATHEDRAL'))firstSpiral=r.time;
   if(!firstFork&&r.surface.includes('FORK_APPROACH'))firstFork=r.time;
   if(!firstMachine&&r.surface.includes('MACHINE_CHAMBER'))firstMachine=r.time;
   if(!firstTakeoff&&r.surface.includes('GAP_TAKEOFF'))firstTakeoff=r.time;
   if(!landing&&r.surface.includes('GAP_LANDING'))landing=r.time;
  }
  if(!r.grounded&&!air)air={t:+r.time.toFixed(3),p:r.p.map(x=>+x.toFixed(1)),surface:r.surface};
  if(r.failure&&!failed)failed=r.failure;
 }
 return {mode,time:+r.time.toFixed(3),status:r.status,failed,firstSpiral:+(firstSpiral||0).toFixed(3),
  firstFork:+(firstFork||0).toFixed(3),firstMachine:+(firstMachine||0).toFixed(3),
  firstTakeoff:+(firstTakeoff||0).toFixed(3),landing:+(landing||0).toFixed(3),
  air,transitions,visitedSpiral:[...visited].filter(s=>s.includes('SPIRAL_CATHEDRAL')),
  visitedMachines:[...visited].filter(s=>s.includes('MACHINE_CHAMBER')),
  maxSpeed:Math.hypot(...r.v),endPosition:r.p,endSurface:r.surface,
  contactEvents:r.events.filter(e=>['moving-contact','failure','finish'].includes(e.type)).slice(0,12)};
}
test('P77 native full first-spawn replay evidence (diagnostic only; not full route approval)',()=>{
 assert.equal(DT,1/240);assert.equal(RADIUS,.65);
 assert.equal(doc.surfaces.length,23);
 const control=nativeFullReplay('neutral');
 console.log('P77_NATIVE_FULL_ROUTE_NEUTRAL '+JSON.stringify(control));
 assert(control.firstSpiral>16&&control.firstSpiral<18,'P76 native intake must not regress');
 const steered=nativeFullReplay('timed');
 console.log('P77_NATIVE_FULL_ROUTE_TIMED '+JSON.stringify(steered));
 assert(steered.firstSpiral>16&&steered.firstSpiral<18,'P76 entry must remain real');
 // Later gates require every real spiral segment, fork, machine and natural landing.
 // Until measured, this test is intentionally an evidence probe, not a false PASS.
});

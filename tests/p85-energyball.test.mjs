import test from 'node:test';
import assert from 'node:assert/strict';
import {makeEnergyBallVisual,energyBallFrame,CORE_RADIUS,FILAMENT_RADIUS,ORBIT_RADIUS,MAX_TRAIL_METERS,ENERGY_VERTEX_BUDGET} from '../web/p85-energyball.mjs';
import {generateEchoRush} from '../scripts/p66-echo-rebuild.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,RADIUS,DT,FIXTURE_IMPULSES} from '../private/reference_only/director/physics.js';

const visual=makeEnergyBallVisual();
test('P85 layered energy ball has a large meaningful luminous spherical shell but bounded GPU budget',()=>{
 assert(visual.shell.length/6>3000,'simple legacy orb not replaced');
 assert(visual.filaments.length/6>600);
 assert(visual.orbits.length/6>180);
 assert(visual.trails.length/6>100);
 assert(visual.totalVertices<ENERGY_VERTEX_BUDGET);
 assert.equal(visual.totalVertices,
  (visual.shell.length+visual.filaments.length+visual.orbits.length+visual.trails.length)/6);
 for(const [name,v] of Object.entries(visual)){
  if(name==='totalVertices')continue;
  assert.equal(v.length%6,0,name+' malformed vertices');
  assert(v.every(Number.isFinite),name+' bad vertex');
  for(let i=0;i<v.length;i+=6){
   assert(v[i+3]>=0&&v[i+3]<=1);
   assert(v[i+4]>=0&&v[i+4]<=1);
   assert(v[i+5]>=0&&v[i+5]<=1);
  }
 }
 assert.deepEqual(makeEnergyBallVisual(),visual,'no random flicker / non-deterministic model build');
});
test('P85 core and circuit filament keep the original 0.65m player collider radius unchanged',()=>{
 assert.equal(RADIUS,.65);
 assert(CORE_RADIUS<RADIUS);
 assert(FILAMENT_RADIUS-RADIUS<.004,'light filament protrusion must stay purely sub-centimeter');
 assert(ORBIT_RADIUS<1,'decorative outer ring must not obscure a broad collision lane');
 const points=[['shell',CORE_RADIUS],['filaments',FILAMENT_RADIUS],['orbits',ORBIT_RADIUS+.002]];
 for(const [key,r] of points){
  const v=visual[key];
  for(let i=0;i<v.length;i+=6)
   assert(Math.hypot(v[i],v[i+1],v[i+2])<=r+.002,
    key+' escaped expected visual bound');
 }
});
test('P85 trail tracks actual horizontal velocity, displays at speed and pauses with simulation clock',()=>{
 const a=energyBallFrame(12.5,[55,5,44],[0,0,1],1);
 assert(a.trailActive);
 assert(a.orbitActive);
 assert(a.trailMaxMeters<MAX_TRAIL_METERS);
 assert(Math.abs(a.directionYaw-Math.atan2(55,44))<1e-12);
 assert.deepEqual(energyBallFrame(12.5,[55,5,44],[0,0,1],1),a,
  'same 240Hz simulation clock and physical speed must render identical visuals');
 const b=energyBallFrame(12.5,[55,5,44],[0,0,1],.6);
 assert.equal(b.trailActive,false);
 assert.equal(b.orbitActive,false);
 assert.equal(b.spin,a.spin);
 assert.equal(b.directionYaw,a.directionYaw);
 assert.equal(energyBallFrame(0,[10,0,0],[0,0,1],1).trailActive,false);
 assert.throws(()=>energyBallFrame(-1,[40,0,0],[0,0,1]),/Invalid/);
});
test('P85 visual geometry and speed-state remain read-only during real B48 240Hz Runner trajectory',()=>{
 const doc=generateEchoRush(),world=compile(doc);
 const original=JSON.stringify(doc);
 const A=new Runner(doc,world,0,44),B=new Runner(doc,world,0,44);
 assert.deepEqual(FIXTURE_IMPULSES.shove,{side:10,lift:8,forward:3});
 assert.equal(DT,1/240);
 for(let i=0;i<1200;i++){
  A.step(0);B.step(0);
  const s=energyBallFrame(B.time,B.v,B.forward,(i%3===0)?.6:1);
  assert(s.trailMaxMeters<=MAX_TRAIL_METERS);
 }
 assert.deepEqual(A.p,B.p);
 assert.deepEqual(A.v,B.v);
 assert.deepEqual(A.events,B.events);
 assert.equal(A.status,B.status);
 assert.equal(A.collisions,B.collisions);
 assert.equal(JSON.stringify(doc),original);
});

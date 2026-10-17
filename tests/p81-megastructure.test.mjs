import test from 'node:test';
import assert from 'node:assert/strict';
import {generateEchoRush} from '../scripts/p66-echo-rebuild.mjs';
import {megastructureGeometry} from '../web/p81-megastructure.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT,FIXTURE_IMPULSES} from '../private/reference_only/director/physics.js';

const course=generateEchoRush();
test('P81 four contrasting 3D architectural precincts are GPU-only and within vertex budget',()=>{
 const before=JSON.stringify(course);
 const world=megastructureGeometry(course);
 const names=world.sections.map(x=>x.name);
 assert.deepEqual(names,['HALO_CROWN','SPIRAL_SKY_VAULT','FORK_SKY_BRIDGES','DISTANT_CITY_SILHOUETTES']);
 assert(world.sections.every(x=>x.triangles>250),'P81 building area missing large 3D architecture');
 assert(world.vertices.length>100000,'P81 is too small to be a megastructure pass');
 assert(world.vertices.length<900000,'GPU buffer has excessive tessellation');
 assert.equal(world.vertices.length%18,0,'triangle RGB vertex stream is malformed');
 assert(world.vertices.every(Number.isFinite),'invalid GPU geometry coordinates');
 for(let i=3;i<world.vertices.length;i+=6)for(let j=0;j<3;j++)
  assert(world.vertices[i+j]>=0&&world.vertices[i+j]<=1,'invalid HDR vertex RGB');
 assert.equal(JSON.stringify(course),before,'P81 generator altered collision geometry or stage JSON');
 console.log('P81_ARCHITECTURE_TRIANGLES '+JSON.stringify({total:world.vertices.length/18,parts:world.sections}));
});
test('P81 yields deterministic visually distinct 3D spaces without placing solid roads in frozen stages',()=>{
 const first=megastructureGeometry(course);
 const again=megastructureGeometry(course);
 assert.deepEqual(again,first);
 for(const id of ['EP-001','HS-001','WV-001','HG-001']){
  const frozen=megastructureGeometry({stageForge:{id}});
  assert.equal(frozen.vertices.length,0);
  assert.deepEqual(frozen.sections,[]);
 }
 assert.throws(()=>megastructureGeometry({stageForge:{id:'EP-P66'}}),/visual blueprint/);
});
test('P81 untouched B48 Runner still follows real HALO start route with identical physical contacts',()=>{
 assert.equal(course.surfaces.length,23);
 assert.equal(DT,1/240);
 assert.deepEqual(FIXTURE_IMPULSES.shove,{side:10,lift:8,forward:3});
 const world=compile(course),baseline=new Runner(course,world,0,44),augmented=new Runner(course,world,0,44);
 for(let i=0;i<1440;i++){
  baseline.step(0);
  if(i%90===0)megastructureGeometry(course);
  augmented.step(0);
 }
 assert.deepEqual(augmented.p,baseline.p);
 assert.deepEqual(augmented.v,baseline.v);
 assert.deepEqual(augmented.events,baseline.events);
 assert.equal(augmented.status,baseline.status);
 assert.equal(augmented.points,baseline.points);
});

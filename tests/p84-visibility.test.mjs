import test from 'node:test';
import assert from 'node:assert/strict';
import {generateEchoRush} from '../scripts/p66-echo-rebuild.mjs';
import {sample,frame} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,RADIUS,FIXTURE_IMPULSES,DT} from '../private/reference_only/director/physics.js';
import {roadShoulderLights,fogFraction,FOG_MAX,FOG_START_METERS,FOG_SPAN_METERS,LIGHT_MAX_VERTICES} from '../web/p84-visibility.mjs';

const stage=generateEchoRush();
test('P84 real 3D shoulder lamps are B48-sampled, pairwise and GPU-only, no road mutation',()=>{
 const before=JSON.stringify(stage.surfaces),fixtures=JSON.stringify(stage.fixtures);
 const data=roadShoulderLights(stage,sample,frame);
 console.log('P84_SHOULDER_LIGHTS '+JSON.stringify({beacons:data.beacons,roads:data.roads,vertices:data.vertices.length/6}));
 assert.equal(data.physical,false);
 assert.equal(data.roads,stage.surfaces.filter(x=>x.rideable&&x.visible!==false).length);
 assert(data.beacons>120,'real 23-road cathedral too poorly illuminated');
 assert(data.vertices.length===data.beacons*24,'each beacon needs 2 GPU line segments');
 assert(data.vertices.length/6<LIGHT_MAX_VERTICES,'visibility vertex budget exceeded');
 assert(data.vertices.every(Number.isFinite));
 for(let i=0;i<data.vertices.length;i+=6)
  for(let c=3;c<6;c++)assert(data.vertices[i+c]>=0&&data.vertices[i+c]<=1);
 assert.equal(JSON.stringify(stage.surfaces),before);
 assert.equal(JSON.stringify(stage.fixtures),fixtures);
 assert.deepEqual(roadShoulderLights(stage,sample,frame),data,'GPU geometry must be deterministic');
});
test('P84 frozen P62 original stage geometry is left untouched even for passing sampler',()=>{
 const stageCopy=structuredClone(stage);
 stageCopy.stageForge.id='EP-001';
 const data=roadShoulderLights(stageCopy,sample,frame);
 assert.deepEqual(data,{vertices:[],beacons:0,roads:0,physical:false});
});
test('P84 atmospheric depth fog starts only beyond local gameplay and is clamped',()=>{
 for(const d of [0,1,200,FOG_START_METERS])assert.equal(fogFraction(d),0);
 assert(Math.abs(fogFraction(FOG_START_METERS+FOG_SPAN_METERS/2)-FOG_MAX/2)<1e-12);
 assert.equal(fogFraction(100000),FOG_MAX);
 assert.equal(fogFraction(100000,false),0);
 assert.throws(()=>fogFraction(-1),/distance/);
 assert.throws(()=>fogFraction(NaN),/distance/);
});
test('P84 pure display mesh generation does not modify real 240Hz Runner',()=>{
 const world=compile(stage),one=new Runner(stage,world,0,44),two=new Runner(stage,world,0,44);
 roadShoulderLights(stage,sample,frame);
 for(let i=0;i<480;i++){one.step(0);two.step(0);}
 assert.deepEqual(one.p,two.p);
 assert.deepEqual(one.v,two.v);
 assert.deepEqual(one.events,two.events);
 assert.equal(DT,1/240);assert.equal(RADIUS,.65);
 assert.deepEqual(FIXTURE_IMPULSES.shove,{side:10,lift:8,forward:3});
});

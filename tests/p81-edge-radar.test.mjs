import test from 'node:test';
import assert from 'node:assert/strict';
import {generateEchoRush} from '../scripts/p66-echo-rebuild.mjs';
import {sample,frame} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT,RADIUS} from '../private/reference_only/director/physics.js';
import {locateRoadLateral,edgeRadarLabel} from '../web/p81-edge-radar.mjs';

const stage=generateEchoRush();
const approx=(a,b,tol=.08)=>assert(Math.abs(a-b)<tol,'expected '+a+' close to '+b);
const find=id=>stage.surfaces.find(s=>s.id==='p66-'+id);
test('P81 real Catmull-Rom road center and left/right margins are correctly classified',()=>{
 const s=find('SPIRAL_CATHEDRAL-03');
 for(const [v,classification,edge] of [[.5,'clear',null],[.025,'danger','LEFT'],[.975,'danger','RIGHT']]){
  const p=sample(s,.49,v);
  const r=locateRoadLateral(stage,s.id,p,sample,frame,{ballRadius:RADIUS});
  assert(r);
  approx(r.v,v,.13);
  assert.equal(r.approximate,true);
  assert(r.width>20);
  assert(Number.isFinite(r.tiltDegrees));
  if(classification==='danger'){assert.equal(r.severity,'danger');assert.equal(r.edge,edge);}
  else assert.equal(r.severity,'clear');
 }
});
test('P81 banked HALO and spiral surfaces produce finite real surface tilt and both road-edge distances',()=>{
 for(const s of [find('PIPE_RETURN-02'),find('SPIRAL_CATHEDRAL-03'),find('FORK_L-01'),find('MACHINE_CHAMBER-02')]){
  const p=sample(s,.4,.50);
  const r=locateRoadLateral(stage,s.id,p,sample,frame,{ballRadius:RADIUS});
  assert(r&&r.width>5);
  assert(Math.abs((r.leftMargin+r.rightMargin)-(r.width-2*RADIUS))<1e-5);
  assert(Number.isFinite(r.u)&&r.u>=0&&r.u<=1);
  assert(Number.isFinite(r.tiltDegrees)&&r.tiltDegrees>=0&&r.tiltDegrees<=90);
  assert(edgeRadarLabel(r).includes('m'));
 }
});
test('P81 airborne and missing contact surfaces do not show fabricated safe lane guidance',()=>{
 const s=find('PIPE_RETURN-01'),p=sample(s,.4,.5);
 assert.equal(locateRoadLateral(stage,s.id,p,sample,frame,{grounded:false}),null);
 assert.equal(locateRoadLateral(stage,null,p,sample,frame),null);
 assert.equal(locateRoadLateral(stage,'fake',p,sample,frame),null);
 assert.equal(locateRoadLateral({surfaces:[]},s.id,p,sample,frame),null);
 assert.throws(()=>locateRoadLateral(stage,s.id,p,null,frame),/Native road samplers/);
 assert.equal(edgeRadarLabel(null),'接地中のみ道路端を表示');
});
test('P81 native B48 240Hz steering/physics remains bit-identical with repeated lane telemetry',()=>{
 const world=compile(stage),control=new Runner(stage,world,0,44),radar=new Runner(stage,world,0,44);
 for(let i=0;i<720;i++){
  const input=i%240<80?.2:0;
  control.step(input);
  radar.step(input);
  if(i%12===0)locateRoadLateral(stage,radar.surface,radar.p,sample,frame,{grounded:radar.grounded,ballRadius:RADIUS});
 }
 assert.deepEqual(radar.p,control.p);
 assert.deepEqual(radar.v,control.v);
 assert.deepEqual(radar.events,control.events);
 assert.deepEqual(radar.collisions,control.collisions);
 assert.equal(radar.status,control.status);
 assert.equal(DT,1/240);
});

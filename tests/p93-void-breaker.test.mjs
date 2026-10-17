import test from 'node:test';
import assert from 'node:assert/strict';
import {generateVoidBreaker,P93_GEOMETRY} from '../scripts/p93-void-breaker-build.mjs';
import {generateEchoRush} from '../scripts/p66-echo-rebuild.mjs';
import {validate,sample} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT,RADIUS} from '../private/reference_only/director/physics.js';
import {voidBreakerGeometry} from '../web/p93-void-breaker-visual.mjs';

test('P93 is an original 3990m seven-skin physical world, NOT a P66 course reskin',()=>{
 const base=generateEchoRush(),baseBefore=JSON.stringify(base);
 const doc=generateVoidBreaker();
 assert.equal(P93_GEOMETRY.totalLengthMeters,3990);
 assert.equal(P93_GEOMETRY.roadSurfaces,7);
 assert.equal(doc.stageForge.id,'VB-P93');
 assert.equal(doc.surfaces.length,7);
 assert.deepEqual(doc.surfaces.map(s=>s.id),[
  'p93-ABYSS_DIVE-01','p93-CROWN_REVERSAL-01','p93-SCISSOR_RISE-01',
  'p93-LOWER_REVERSAL-01','p93-VOID_SURGE-01','p93-PRISM_CREST-01','p93-FINISH_RIDGE-01']);
 assert(doc.surfaces.every(s=>s.rideable&&s.collidable&&s.material==='road'));
 assert(doc.routeSegments.length===7);
 assert(doc.fixtures.length===0&&doc.movingObstacles.length===0,'no hidden jump boosters or reset');
 assert.equal(doc.stageForge.humanPlaytest,'NOT_RUN');
 assert.equal(doc.stageForge.fullStartToFinish,'NOT_YET_PROVEN');
 assert.equal(JSON.stringify(base),baseBefore,'P93 must not mutate frozen P66');
 assert.equal(base.surfaces.length,23);
 assert.equal(DT,1/240);assert.equal(RADIUS,.65);
 assert.doesNotThrow(()=>validate(doc));
});
test('P93 has mathematically joined physical segments with genuine ±100m elevation and enormous turns',()=>{
 const doc=generateVoidBreaker(),s=doc.surfaces;
 const allY=s.flatMap(r=>r.points.map(p=>p[1]));
 assert(Math.max(...allY)-Math.min(...allY)>200,'not a real vertical world');
 for(let i=0;i<s.length-1;i++){
  const a=sample(s[i],1,.5),b=sample(s[i+1],0,.5);
  assert(Math.hypot(...a.map((x,k)=>x-b[k]))<.03,'Discontinuous road seam '+s[i].id);
 }
 assert(doc.route.length>120&&doc.route.length<4096);
 const minx=Math.min(...doc.route.map(p=>p[0])),maxx=Math.max(...doc.route.map(p=>p[0]));
 assert(maxx-minx>1500,'world lacks megascale planar reach');
 assert.equal(doc.spawns.length,6);
});
test('P93 WebGL architecture renders 7 massive chapters with immutable B48 road geometry',()=>{
 const doc=generateVoidBreaker(),before=JSON.stringify(doc);
 const a=voidBreakerGeometry(doc,sample);
 assert.equal(a.sections.length,7);
 assert(a.sections.every(x=>x.triangles>300),'missing real 3D roof/bridge section');
 assert(a.vertices.length>25000,'world architectural detail is trivial');
 assert(a.vertices.length<500000,'GPU vertex budget exceeded');
 assert.equal(a.vertices.length%18,0,'triangles must be xyz-rgb');
 assert(a.vertices.every(Number.isFinite));
 assert.deepEqual(voidBreakerGeometry(generateEchoRush(),sample),{vertices:[],beams:0,sections:[]});
 assert.equal(JSON.stringify(doc),before,'visuals may never mutate physical road');
});
test('P93 each physical chapter can initialize an actual unmodified 240Hz Runner and progress',()=>{
 const doc=generateVoidBreaker(),world=compile(doc);
 for(let i=0;i<doc.spawns.length;i++){
  const r=new Runner(doc,world,i,44),initial=[...r.p];
  for(let k=0;k<Math.ceil(1.5/DT)&&r.status!=='failed'&&r.status!=='finished';k++)r.step(0);
  assert.notEqual(r.status,'failed',doc.spawns[i].name+': '+JSON.stringify(r.failure));
  assert(r.time>1,'Physical simulation stalled: '+i);
  assert(Math.hypot(...r.p.map((x,j)=>x-initial[j]))>20,'No physical travel from '+doc.spawns[i].name);
 }
});

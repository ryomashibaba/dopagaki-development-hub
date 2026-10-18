import test from 'node:test';
import assert from 'node:assert/strict';
import {generateVoidBreaker} from '../scripts/p93-void-breaker-build.mjs';
import {generateVoidHazardCandidate} from '../scripts/p95-void-hazard-build.mjs';
import {generateEchoRush} from '../scripts/p66-echo-rebuild.mjs';
import {sample,frame} from '../private/reference_only/director/surface.js';
import {roadShoulderLights} from '../web/p84-visibility.mjs';
import {voidBreakerGeometry} from '../web/p93-void-breaker-visual.mjs';
import {generateP96DodgeEvidence} from '../scripts/p96-acceptance-evidence.mjs';

test('P98 avoids overwhelming the physical drive sightline: 42 exterior monumental portals instead of 70 curbline columns',()=>{
 for(const doc of [generateVoidBreaker(),generateVoidHazardCandidate()]){
  const before=JSON.stringify(doc),arch=voidBreakerGeometry(doc,sample);
  assert.equal(arch.sections.length,7);
  assert.equal(arch.sections.reduce((n,x)=>n+x.portalCount,0),42);
  assert(arch.sections.every(x=>x.portalCount===6&&x.exteriorClearanceMeters>=26));
  assert(arch.sections.every(x=>x.triangles>300),'still a genuine large original structure, not an empty track');
  assert(arch.vertices.length>25000&&arch.vertices.length<500000);
  assert(arch.vertices.every(Number.isFinite));
  assert.equal(arch.visualReadability,'P98_SIX_EXTERIOR_GATES_PER_CHAPTER_WITH_OFFROAD_COLUMNS');
  assert.equal(JSON.stringify(doc),before,'GPU architecture may not change native road/physics');
 }
});
test('P98 actual B48 road boundary reflections in both VOID worlds, while original P62 and P66 sources remain protected',()=>{
 const p93=generateVoidBreaker(),p95=generateVoidHazardCandidate();
 for(const doc of [p93,p95]){
  const old=JSON.stringify(doc),v=roadShoulderLights(doc,sample,frame);
  assert.equal(v.roads,7);
  assert.equal(v.physical,false);
  assert(v.beacons>150&&v.beacons<500,'high-speed road still lacks meaningful real-edge depth markers');
  assert.equal(v.vertices.length,24*v.beacons);
  assert(v.vertices.every(Number.isFinite));
  assert(v.vertices.every((x,i)=>i%6<3||x>=0&&x<=1));
  assert.deepEqual(roadShoulderLights(doc,sample,frame),v,'layout needs reproducible geometry');
  assert.equal(JSON.stringify(doc),old);
 }
 const p66=generateEchoRush(),p62=structuredClone(p66);
 p62.stageForge.id='EP-001';
 assert.deepEqual(roadShoulderLights(p62,sample,frame),{vertices:[],beacons:0,roads:0,physical:false});
 const old=JSON.stringify(p66);
 assert(roadShoulderLights(p66,sample,frame).beacons>120);
 assert.equal(JSON.stringify(p66),old);
});
test('P98 visual cleanup retains unchanged full 12-collider B48+B51-C 240Hz native course finish proof',()=>{
 const proof=generateP96DodgeEvidence();
 assert.equal(proof.best.status,'SCRIPTED_NATIVE_FULL_PASS');
 assert.equal(proof.best.visited.length,7);
 assert.equal(proof.activeCollidingMachines,12);
 assert.equal(proof.humanPlaytest,'NOT_RUN');
});

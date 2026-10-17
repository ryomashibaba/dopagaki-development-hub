import test from 'node:test';
import assert from 'node:assert/strict';
import {generateEchoRush} from '../scripts/p66-echo-rebuild.mjs';
import {generateReferenceGhost,GHOST_STRIDE_STEPS} from '../scripts/p87-ghost-generate.mjs';
import {validateGhost,referenceGhostAt,ghostEligible,ghostLatticeVertices} from '../web/p87-ghost.mjs';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {compile} from '../private/reference_only/director/collision.js';

test('P87 accepted 83s native 240Hz full-ride snapshots preserve all original physical track objects',()=>{
 const doc=generateEchoRush(),baseline=JSON.stringify(doc);
 const ghost=validateGhost(generateReferenceGhost(doc));
 assert.equal(ghost.schema,'dopagaki.native-reference-ghost/1');
 assert.equal(ghost.stageId,'EP-P66');assert.equal(ghost.spawn,0);
 assert.equal(ghost.dt,1/240);
 assert.equal(ghost.stride,GHOST_STRIDE_STEPS);
 assert(ghost.samples.length>1200&&ghost.samples.length<1450);
 assert(ghost.finishSeconds>82&&ghost.finishSeconds<85);
 assert.deepEqual(ghost.samples[0].slice(1).map(x=>Number(x.toFixed(2))),
  new Runner(doc,compile(doc),0,44).p.map(x=>Number(x.toFixed(2))));
 assert.deepEqual(referenceGhostAt(ghost,0),ghost.samples[0].slice(1));
 const last=ghost.samples.at(-1);
 assert.deepEqual(referenceGhostAt(ghost,ghost.finishSeconds),last.slice(1));
 assert.equal(referenceGhostAt(ghost,ghost.finishSeconds+.001),null,'ghost must not keep moving after finish');
 const half=(ghost.samples[50][0]+ghost.samples[51][0])/2;
 assert.deepEqual(referenceGhostAt(ghost,half).map(x=>Number(x.toFixed(3))),
  [1,2,3].map(i=>Number(((ghost.samples[50][i]+ghost.samples[51][i])/2).toFixed(3))));
 assert.equal(JSON.stringify(doc),baseline,'ghost generation may not edit collision roads, moving machines, P62 snapshots or assists');
 console.log('P87_NATIVE_GHOST_PASS '+JSON.stringify({finishSeconds:ghost.finishSeconds,frames:ghost.samples.length,stride:ghost.stride}));
});
test('P87 ghost appears only for manual EP-P66 starting spawn00, never spectator or practice',()=>{
 const doc={stageForge:{id:'EP-P66'}};
 assert(ghostEligible(doc,0,'manual'));
 for(const mode of ['spectator-demo','practice','practice-seek','manual-other']){
  assert.equal(ghostEligible(doc,0,mode),false);
 }
 assert.equal(ghostEligible(doc,1,'manual'),false);
 assert.equal(ghostEligible({stageForge:{id:'EP-001'}},0,'manual'),false);
});
test('P87 noncolliding ghost wireframe uses fixed transparent-style lattice and safe interpolation',()=>{
 const geometry=ghostLatticeVertices();
 assert(geometry.length>1200&&geometry.length%12===0);
 for(let i=0;i<geometry.length;i+=6){
  assert(Math.hypot(...geometry.slice(i,i+3))<.651);
  assert(geometry.slice(i+3,i+6).every(c=>c>0&&c<=1));
 }
 const fake={schema:'dopagaki.native-reference-ghost/1',stageId:'EP-P66',spawn:0,finished:true,
  finishSeconds:83,samples:Array.from({length:1201},(_,i)=>[Number((83*i/1200).toFixed(4)),i,0,0])};
 const verified=validateGhost(fake);
 assert.deepEqual(referenceGhostAt(verified,0),[0,0,0]);
 assert.equal(referenceGhostAt(verified,-1),null);
 assert.equal(referenceGhostAt(verified,83.1),null);
 assert.deepEqual(referenceGhostAt(verified,verified.samples[600][0]),[600,0,0]);
 assert.throws(()=>validateGhost({...fake,samples:fake.samples.map((x,i)=>i===5?[0,1,2,3]:x)}),/samples/);
 assert.throws(()=>validateGhost({...fake,finished:false}),/metadata/);
});

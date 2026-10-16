import test from 'node:test';
import assert from 'node:assert/strict';
import {generateEchoRush} from '../scripts/p66-echo-rebuild.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT,FIXTURE_IMPULSES} from '../private/reference_only/director/physics.js';
import {epicGeometry} from '../web/p66-visual.mjs';

const doc=generateEchoRush();
const surface=id=>doc.surfaces.find(s=>s.id==='p66-'+id);
const diff=(a,b)=>a.map((x,i)=>x-b[i]);
const length=a=>Math.hypot(...a);
const world=compile(doc);
function simulate(spawn,seconds,steering=0,initialSpeed=44){
 const runner=new Runner(doc,world,spawn,initialSpeed);
 let airborne=0,firstAir=null;
 for(let i=0;i<Math.round(seconds/DT)&&!['failed','finished'].includes(runner.status);i++){
  runner.step(steering);
  if(!runner.grounded){airborne++;if(!firstAir)firstAir={time:+runner.time.toFixed(2),position:runner.p.map(x=>+x.toFixed(1))};}
 }
 return {spawn,time:+runner.time.toFixed(2),status:runner.status,reason:runner.failure?.reason??null,grounded:runner.grounded,airborne,
  lastSurface:runner.surface,position:runner.p.map(x=>+x.toFixed(1)),firstAir,
  forkHits:[...new Set(runner.events.filter(e=>e.type==='contact'&&e.surface?.includes('FORK_')).map(e=>e.surface))]};
}
test('P68 epic dual-fork megastructures are real GPU meshes, not collision surfaces',()=>{
 const b=doc.visualBlueprint;
 assert.equal(b.bellVaults.length,6);assert.equal(b.skyPortals.length,6);
 assert.equal(b.bellTowers.length,6);assert.equal(b.skyPylons.length,6);
 const vertices=epicGeometry(doc);
 assert(vertices.length>60000&&vertices.length%6===0,'missing enormous scene geometry');
 assert.equal(doc.surfaces.length,22,'must preserve B48 physical surface budget');
 assert.equal(doc.stageForge.spiralExit,'HOLD','do not mislabel unfinished spiral exit as verified');
});
test('P68 fork paths are disjoint collision ribbons at 0–100% progress',()=>{
 for(const t of [.001,.01,.03,.05,.1,.15,.25,.3,.5,.7,.85,.91,.95,.99,.999]){
  const i=t>=.5?1:0,u=t>=.5?(t-.5)*2:t*2;
  const L=surface('FORK_L-0'+(i+1)),R=surface('FORK_R-0'+(i+1));
  const separation=length(diff(sample(L,u,.5),sample(R,u,.5)));
  const wL=length(diff(sample(L,u,0),sample(L,u,1)));
  const wR=length(diff(sample(R,u,0),sample(R,u,1)));
  assert(separation>(wL+wR)/2+.1,'overlapping branch solids at '+t+': '+separation+' < '+(wL+wR)/2);
 }
 for(const suffix of ['L','R']){
  for(const [a,b] of [['FORK_APPROACH-02', 'FORK_'+suffix+'-01'],['FORK_'+suffix+'-02','FORK_REJOIN-01']]){
   const A=surface(a),B=surface(b);
   const offset=length(diff(sample(A,1,.5),sample(B,0,.5)));
   const widthA=length(diff(sample(A,1,0),sample(A,1,1)));
   const widthB=length(diff(sample(B,0,0),sample(B,0,1)));
   assert(offset<(widthA+widthB)/2,'fork has a physical gap at '+a+' to '+b);
  }
 }
});
test('P68 retains unchanged 240Hz B45 while both forks and intro are traversable',()=>{
 assert.equal(DT,1/240);
 assert.deepEqual(FIXTURE_IMPULSES.shove,{side:10,lift:8,forward:3});
 const intro=simulate(0,12),left=simulate(2,12),right=simulate(3,12);
 for(const result of [intro,left,right]){
  console.log('P68_ACCEPTANCE '+JSON.stringify(result));
  assert.equal(result.reason,null,'physical fork/intake regression: '+JSON.stringify(result));
  assert.equal(result.airborne,0,'unintended flight in grounded chapter: '+JSON.stringify(result));
 }
 assert(left.forkHits.some(x=>x.includes('FORK_L-02')),'left branch not traversed');
 assert(right.forkHits.some(x=>x.includes('FORK_R-02')),'right branch not traversed');
 assert.equal(left.lastSurface,'p66-FORK_REJOIN-01','left branch never reached actual merge');
 assert.equal(right.lastSurface,'p66-FORK_REJOIN-01','right branch never reached actual merge');
});
test('P68 neutral and steered fork-entry runs remain inspectable, no false claims',()=>{
 for(const value of [-.35,0,.35]){
  const result=simulate(6,7,value);
  console.log('P68_STEERING_DIAG '+JSON.stringify(result));
 }
 // Dynamic in-run fork choice remains pending a human-controlled steering test.
});

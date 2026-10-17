import test from 'node:test';
import assert from 'node:assert/strict';
import {generateEchoRush,P66_GEOMETRY} from '../scripts/p66-echo-rebuild.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';

const dist=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
const direction=(a,b)=>{const u=a.map((x,i)=>x-b[i]),d=Math.hypot(u[0],u[2])||1;return [u[0]/d,u[2]/d];};
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1];
test('P76 authentic 180° four-surface connection with no seam gaps or opposite-heading reversal',()=>{
 const doc=generateEchoRush();
 assert.equal(P66_GEOMETRY.returnDegrees,180);
 assert.equal(P66_GEOMETRY.roadSurfaces,25);
 assert.equal(doc.surfaces.length,25);
 const pick=id=>doc.surfaces.find(s=>s.id===id);
 const ids=['p66-PIPE_DIVE_A-02',...Array.from({length:4},(_,i)=>'p66-PIPE_RETURN_ARC-0'+(i+1)),'p66-SPIRAL_CATHEDRAL-01'];
 for(const id of ids)assert(pick(id),id+' missing');
 for(let i=1;i<ids.length;i++){
  const a=pick(ids[i-1]),b=pick(ids[i]);
  const p=sample(a,1,.5),q=sample(b,0,.5),offset=dist(p,q);
  const prev=direction(p,sample(a,.995,.5)),next=direction(sample(b,.005,.5),q);
  const angleDot=dot(prev,next);
  console.log('P76_SEAM '+JSON.stringify({from:ids[i-1],to:ids[i],distance:offset,tangentDot:angleDot}));
  assert(offset<1,'physical seam not continuous '+ids[i-1]);
  assert(angleDot>.78,'sharp road reversal '+ids[i-1]+' -> '+ids[i]+': '+angleDot);
 }
 assert.equal(doc.stageForge.pipeTurnRealCollision,true);
 assert.equal(doc.spawns[1].surface,'p66-SPIRAL_CATHEDRAL-01','P69 spiral spawn retained');
 assert.equal(doc.spawns[7].surface,'p66-PIPE_RETURN_ARC-01');
});
test('P76 native B48 run from first spawn into complete return loop and cathedral',()=>{
 const doc=generateEchoRush(),world=compile(doc),runner=new Runner(doc,world,0,44);
 const reached=new Set();let firstAir=null;
 for(let i=0;i<Math.ceil(39/DT)&&!['failed','finished'].includes(runner.status);i++){
  runner.step(0);
  if(runner.surface)reached.add(runner.surface);
  if(!runner.grounded&&!firstAir)firstAir=Number(runner.time.toFixed(3));
 }
 const summary={seconds:Number(runner.time.toFixed(3)),status:runner.status,fail:runner.failure?.reason,
  firstAir,last:runner.surface,position:runner.p.map(x=>Number(x.toFixed(2))),
  speed:Number(Math.hypot(...runner.v).toFixed(2)),
  returnRoads:[...reached].filter(x=>x.includes('PIPE_RETURN_ARC')),
  enteredSpiral:[...reached].some(x=>x.includes('SPIRAL_CATHEDRAL'))};
 console.log('P76_FULL_START_NATIVE '+JSON.stringify(summary));
 assert.equal(runner.failure,null,'first spawn should survive to complete return');
 assert.equal(firstAir,null,'HALO turnaround must be a grounded, physical run');
 assert.equal(summary.returnRoads.length,4,'must traverse all four return collision segments');
 assert.equal(summary.enteredSpiral,true,'must reach preserved spiral from actual first spawn');
});

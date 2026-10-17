import test from 'node:test';
import assert from 'node:assert/strict';
import {generateEchoRush} from '../scripts/p66-echo-rebuild.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {Runner,DT,FIXTURE_IMPULSES} from '../private/reference_only/director/physics.js';
import {compile} from '../private/reference_only/director/collision.js';

const doc=generateEchoRush(),world=compile(doc),road=name=>doc.surfaces.find(x=>x.id==='p66-'+name);
const sub=(a,b)=>a.map((x,i)=>x-b[i]),norm=v=>{const d=Math.hypot(...v)||1;return v.map(x=>x/d);},dot=(a,b)=>a.reduce((t,x,i)=>t+x*b[i],0);
test('P76 180 degree physical return ends at existing 450° spiral with C1-aligned tangent, height and width',()=>{
 const a=road('PIPE_DIVE_A-02'),b=road('SPIRAL_CATHEDRAL-01');
 const p=sample(a,1,.5),q=sample(b,0,.5);
 const tangentA=norm(sub(sample(a,1,.5),sample(a,.997,.5)));
 const tangentB=norm(sub(sample(b,.003,.5),sample(b,0,.5)));
 const alignment=dot(tangentA,tangentB);
 const dz=Math.hypot(...sub(p,q));
 console.log('P76_JOIN '+JSON.stringify({pipe:p,spiral:q,gapMeters:dz,tangentAlignment:alignment,tangentA,tangentB}));
 assert(dz<.01,'pipe and spiral physical centerlines must touch');
 assert(alignment>.99,'C1 heading must align with incoming spiral');
 const widthA=Math.hypot(...sub(sample(a,1,0),sample(a,1,1)));
 const widthB=Math.hypot(...sub(sample(b,0,0),sample(b,0,1)));
 assert(widthA>80&&widthB>80);
 assert.equal(doc.surfaces.length,21);
 assert.equal(DT,1/240);
 assert.deepEqual(FIXTURE_IMPULSES.shove,{side:10,lift:8,forward:3});
});
test('P76 actual native B48 12-second intake remains fully grounded without failure',()=>{
 const rider=new Runner(doc,world,0,44);
 let firstAir=null;
 for(let i=0;i<Math.round(12/DT)&&rider.status!=='failed'&&rider.status!=='finished';i++){
  rider.step(0);
  if(!rider.grounded&&!firstAir)firstAir={time:rider.time,position:rider.p};
 }
 console.log('P76_INTAKE_12 '+JSON.stringify({time:rider.time,status:rider.status,firstAir,position:rider.p,speed:Math.hypot(...rider.v),surface:rider.surface}));
 assert.equal(rider.failure,null);
 assert.equal(firstAir,null);
 assert(rider.time>=11.9);
});
test('P76 exploratory full-intake scripted steering diagnostics (no false approval)',()=>{
 for(const kind of ['neutral','left-on-second-segment']){
  const rider=new Runner(doc,world,0,44),visited=new Set(),key=[];
  let firstAir=null;
  for(let i=0;i<Math.round(60/DT)&&!['failed','finished'].includes(rider.status);i++){
   const steer=kind==='left-on-second-segment'&&rider.surface?.includes('PIPE_DIVE_A-02')?-1:0;
   rider.step(steer);
   if(rider.surface)visited.add(rider.surface);
   if(!rider.grounded&&!firstAir)firstAir=Number(rider.time.toFixed(2));
   if(Math.floor(rider.time)%5===0&&i%120===0)key.push({time:Number(rider.time.toFixed(1)),p:rider.p.map(x=>Number(x.toFixed(1))),surface:rider.surface,speed:Number(Math.hypot(...rider.v).toFixed(1))});
  }
  console.log('P76_FULL_INTAKE_PROBE '+JSON.stringify({kind,t:rider.time,status:rider.status,failure:rider.failure?.reason,firstAir,visited:[...visited],position:rider.p,speed:Math.hypot(...rider.v),samples:key}));
 }
});

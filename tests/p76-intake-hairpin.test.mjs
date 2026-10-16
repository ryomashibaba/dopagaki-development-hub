import test from 'node:test';
import assert from 'node:assert/strict';
import {generateEchoRush} from '../scripts/p66-echo-rebuild.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT,FIXTURE_IMPULSES,RADIUS} from '../private/reference_only/director/physics.js';
import {epicGeometry} from '../web/p66-visual.mjs';

const doc=generateEchoRush();
const surface=id=>doc.surfaces.find(x=>x.id==='p66-'+id);
const center=(id,u)=>sample(surface(id),u,.5);
const norm=v=>Math.hypot(...v);
const direction=(a,b)=>{const v=a.map((q,i)=>b[i]-q),m=Math.hypot(v[0],v[2]);return [v[0]/m,v[2]/m];};
const dist=(a,b)=>norm(a.map((x,i)=>x-b[i]));
function seam(a,b){
 const pa=center(a,1),pb=center(b,0);
 const headingA=direction(center(a,.995),pa),headingB=direction(pb,center(b,.005));
 return {distance:dist(pa,pb),directionDot:headingA[0]*headingB[0]+headingA[1]*headingB[1]};
}
test('P76 genuine 180-degree return arc replaces opposite-heading pipe/spiral contact seam',()=>{
 assert.equal(doc.surfaces.length,23);
 for(const [a,b] of [['PIPE_DIVE_A-01','PIPE_DIVE_A-02'],['PIPE_DIVE_A-02','PIPE_RETURN-01'],
  ['PIPE_RETURN-01','PIPE_RETURN-02'],['PIPE_RETURN-02','SPIRAL_CATHEDRAL-01']]){
  const v=seam(a,b);
  console.log('P76_NATIVE_SEAM '+a+' > '+b+' '+JSON.stringify(v));
  assert(v.distance<.02,'missing actual physical road at '+a+' -> '+b);
  assert(v.directionDot>.90,'unsafe >25-degree heading seam at '+a+' -> '+b);
 }
 const first=center('PIPE_DIVE_A-01',0),end=center('PIPE_RETURN-02',1);
 assert(dist(first,end)>450);
 assert.equal(doc.stageForge.fullStartToFinish,'NOT_YET_VERIFIED');
 assert.equal(doc.stageForge.humanPlaytest,'NOT_RUN');
 assert.equal(DT,1/240);
 assert.equal(RADIUS,.65);
 assert.deepEqual(FIXTURE_IMPULSES.shove,{side:10,lift:8,forward:3});
 assert.equal(doc.visualBlueprint.returnHoops.length,9);
 assert(epicGeometry(doc).length>60000);
});
test('P76 start spawn 00 enters real arc and spiral with native 240 Hz physics, not teleport',()=>{
 const rider=new Runner(doc,compile(doc),0,44);
 const seen=new Set();
 let firstAir=null,firstFailure=null;
 for(let step=0;step<Math.round(34/DT)&&!['failed','finished'].includes(rider.status);step++){
  rider.step(0);
  if(rider.surface)seen.add(rider.surface);
  if(!rider.grounded&&!firstAir)firstAir={time:Number(rider.time.toFixed(2)),position:rider.p};
  if(rider.failure)firstFailure=rider.failure;
  if(seen.has('p66-SPIRAL_CATHEDRAL-01'))break;
 }
 const note={time:Number(rider.time.toFixed(2)),status:rider.status,position:rider.p,surface:rider.surface,firstAir,firstFailure,
  seen:[...seen].filter(x=>x.includes('PIPE')||x.includes('SPIRAL')).slice(0,15)};
 console.log('P76_REAL_START_TO_SPIRAL '+JSON.stringify(note));
 assert.equal(firstFailure,null,'first spawn must not collide/fail in physical return skyway');
 assert.equal(firstAir,null,'return loop must not force an unplanned jump');
 assert(seen.has('p66-PIPE_RETURN-01')&&seen.has('p66-PIPE_RETURN-02'),'untraversed real physical return loop');
 assert(seen.has('p66-SPIRAL_CATHEDRAL-01'),'full original spawn must join native spiral without a heading snap');
});

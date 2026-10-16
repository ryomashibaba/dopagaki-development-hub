import test from 'node:test';
import assert from 'node:assert/strict';
import {generateEchoRush} from '../scripts/p66-echo-rebuild.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
const PI=Math.PI;
const ease=t=>t*t*(3-2*t);
const banked=(bank,width=96)=>{
 const doc=generateEchoRush();
 for(let segment=0;segment<6;segment++){
  const s=doc.surfaces.find(s=>s.id==='p66-SPIRAL_CATHEDRAL-'+String(segment+1).padStart(2,'0'));
  assert(s,'missing spiral segment '+segment);
  const points=[];
  for(let i=0;i<s.rows;i++){
   const u=i/(s.rows-1),t=(segment+u)/6,theta=PI+2.5*PI*t;
   const p=[-170+430*Math.cos(theta),150-58*ease(t),-10+430*Math.sin(theta)];
   const r=[-Math.cos(theta),0,-Math.sin(theta)];
   const w=width*(.95+.05*Math.cos(2*PI*u));
   const b=typeof bank==='function'?bank(t):bank;
   for(let j=0;j<s.cols;j++){
    const side=(j/(s.cols-1)-.5)*w;
    points.push([p[0]+r[0]*side*Math.cos(b),p[1]+side*Math.sin(b),p[2]+r[2]*side*Math.cos(b)]);
   }
  }
  s.points=points;
 }
 return doc;
};
function drive(doc,spawn,seconds=24,speed=44){
 const r=new Runner(doc,compile(doc),spawn,speed);
 let maxSegment=0,firstAir=null,contacts=0;
 for(let i=0;i<Math.round(seconds/DT)&&!['failed','finished'].includes(r.status);i++){
  r.step(0);
  const m=r.surface?.match(/SPIRAL_CATHEDRAL-(\d+)/);
  if(m)maxSegment=Math.max(maxSegment,Number(m[1]));
  if(!r.grounded&&!firstAir)firstAir={t:+r.time.toFixed(2),p:r.p.map(n=>+n.toFixed(1)),speed:+Math.hypot(...r.v).toFixed(1),last:r.events.at(-1)?.surface||null};
 }
 return {seconds:+r.time.toFixed(2),status:r.status,fail:r.failure?.reason||null,maxSegment,firstAir,position:r.p.map(n=>+n.toFixed(1)),speed:+Math.hypot(...r.v).toFixed(1),grounded:r.grounded,lastSurface:r.surface,contacts:r.collisions};
}
test('P69 geometry-only banking probes do not claim readiness',()=>{
 for(const [label,bank,width] of [
  ['OUTER_HIGH_025',-.25,96],
  ['OUTER_HIGH_035',-.35,96],
  ['OUTER_HIGH_045',-.45,96]
 ]){
  const course=banked(bank,width);
  const result=drive(course,1,65);
  console.log('P69_PROBE '+JSON.stringify({label,bank,width,...result}));
 }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {generateEchoRush} from '../scripts/p66-echo-rebuild.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
const PI=Math.PI;
const ease=t=>t*t*(3-2*t);
const clamp=t=>Math.max(0,Math.min(1,t));
function course(funnelWidth=0,fade=false,taper=.44,bump=0){
 const doc=generateEchoRush();
 for(let segment=0;segment<6;segment++){
  const s=doc.surfaces.find(s=>s.id==='p66-SPIRAL_CATHEDRAL-'+String(segment+1).padStart(2,'0'));
  for(let i=0;i<s.rows;i++){
   const u=i/(s.rows-1),t=(segment+u)/6,theta=PI+2.5*PI*t;
   const p=[-170+430*Math.cos(theta),150-58*ease(t),-10+430*Math.sin(theta)];
   const b=fade?-.25*(1-ease(clamp((t-.77)/.23))):-.25,w=96*(.95+.05*Math.cos(2*PI*u));
   for(let j=0;j<s.cols;j++){
    const side=(j/(s.cols-1)-.5)*w;
    s.points[i*s.cols+j]=[p[0]-Math.cos(theta)*side*Math.cos(b),p[1]+side*Math.sin(b),p[2]-Math.sin(theta)*side*Math.cos(b)];
   }
  }
 }
 if(funnelWidth)for(let segment=0;segment<2;segment++){
  const s=doc.surfaces.find(s=>s.id==='p66-FORK_APPROACH-'+String(segment+1).padStart(2,'0'));
  for(let i=0;i<s.rows;i++){
   const u=i/(s.rows-1),t=(segment+u)/2,sin=Math.sin(PI*t),cos=Math.cos(PI*t),base=[-170+320*t,92-8*ease(t),-440+(30+bump)*sin*sin];
   const dz=2*(30+bump)*PI*sin*cos,mag=Math.hypot(320,dz);
   const right=[-dz/mag,0,320/mag],bank=.04*Math.sin(2*PI*t);
   const width=(40+(funnelWidth-40)*(1-ease(clamp(t/taper))))*(.95+.05*Math.cos(2*PI*u));
   for(let j=0;j<s.cols;j++){
    const side=(j/(s.cols-1)-.5)*width;
    s.points[i*s.cols+j]=[base[0]+right[0]*side*Math.cos(bank),base[1]+side*Math.sin(bank),base[2]+right[2]*side*Math.cos(bank)];
   }
  }
 }
 return doc;
}
function drive(doc,maxSeconds){
 const runner=new Runner(doc,compile(doc),1,44);
 let air=null,approach=null,spiralSegment=0;
 for(let i=0;i<Math.round(maxSeconds/DT)&&!['failed','finished'].includes(runner.status);i++){
  runner.step(0);
  if(!runner.grounded&&!air)air={t:+runner.time.toFixed(2),p:runner.p.map(x=>+x.toFixed(1)),last:runner.events.at(-1)?.surface||null};
  if(runner.surface?.includes('FORK_APPROACH')&&!approach)approach={t:+runner.time.toFixed(2),surface:runner.surface};
  const match=runner.surface?.match(/SPIRAL_CATHEDRAL-(\d+)/);
  if(match)spiralSegment=Math.max(spiralSegment,+match[1]);
 }
 return {time:+runner.time.toFixed(2),status:runner.status,failure:runner.failure?.reason||null,air,approach,spiralSegment,last:runner.surface,pos:runner.p.map(x=>+x.toFixed(1)),speed:+Math.hypot(...runner.v).toFixed(1)};
}
test('P69 find real physically seamless spiral-to-fork catch without altering B45',()=>{
 for(const [width,fade,taper,bump] of [[150,true,.9,0],[150,true,.44,35],[180,true,.8,35]]){
  const stage=course(width,fade,taper,bump);
  const result=drive(stage,85);
  console.log('P69_EXIT_PROBE '+JSON.stringify({width,fade,taper,bump,...result}));
  assert.equal(stage.surfaces.length,21);
 }
});

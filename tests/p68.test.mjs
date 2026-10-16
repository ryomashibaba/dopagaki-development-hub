import test from 'node:test';
import assert from 'node:assert/strict';
import {generateEchoRush} from '../scripts/p66-echo-rebuild.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';

const doc=generateEchoRush();
const surface=id=>doc.surfaces.find(s=>s.id==='p66-'+id);
const subtract=(a,b)=>a.map((x,i)=>x-b[i]);
const norm=v=>Math.hypot(...v);
const unit=v=>v.map(x=>x/norm(v));
const dot=(a,b)=>a.reduce((n,x,i)=>n+x*b[i],0);

test('P68 entrance is tangent-aligned to the clockwise 450 degree road at full speed',()=>{
 const a=surface('PIPE_DIVE_A-02'),b=surface('SPIRAL_CATHEDRAL-01');
 const edge=sample(a,1,.5),begin=sample(b,0,.5);
 assert(norm(subtract(edge,begin))<.02,'must be physically connected');
 const va=unit(subtract(sample(a,1,.5),sample(a,.998,.5)));
 const vb=unit(subtract(sample(b,.002,.5),begin));
 assert(dot(va,vb)>.95,'P67 had near 180-degree tangent reversal at pipe/spiral seam: '+dot(va,vb));
});
test('P68 clockwise spiral outer edge elevated for real centrifugal banking',()=>{
 const s=surface('SPIRAL_CATHEDRAL-01');
 const outer=sample(s,.35,0),inner=sample(s,.35,1);
 assert(inner[1]-outer[1]>50,'incorrect outward-side banking on reversed 450-degree turn');
});
function trial(index,seconds,steer=0,speed=44){
 const r=new Runner(doc,compileCache,index,speed);let air=0,firstAir,furthest=-1,events=[];
 for(let i=0;i<Math.round(seconds/DT)&&!['failed','finished'].includes(r.status);i++){
  r.step(steer);
  const surface=r.surface||'';
  if(surface.includes('SPIRAL_CATHEDRAL'))furthest=Math.max(furthest,Number(surface.match(/(\d+)$/)?.[1]||0));
  if(!r.grounded){air++;if(!firstAir)firstAir={time:+r.time.toFixed(3),position:r.p.map(x=>+x.toFixed(1)),speed:+Math.hypot(...r.v).toFixed(1)}}
 }
 return {spawn:index,time:+r.time.toFixed(2),status:r.status,fail:r.failure?.reason??null,airFrames:air,firstAir,spiralSegment:furthest,surface:r.surface,position:r.p.map(x=>+x.toFixed(1))};
}
const compileCache=compile(doc);
test('P68 native target diagnostics: descent/spiral/left fork/right fork',()=>{
 const cases=[[0,19],[1,18],[2,12],[3,12],[6,9]];
 const results=cases.map(([spawn,seconds])=>trial(spawn,seconds));
 for(const row of results)console.log('P68_GATE_DIAG '+JSON.stringify(row));
 assert(results[0].time>=12&&results[0].status!=='failed','repaired entrance must at least preserve P67 opening survival');
 assert.equal(results[3].fail,null,'right fork must not regress');
});

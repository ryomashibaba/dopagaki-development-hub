import test from 'node:test';
import assert from 'node:assert/strict';
import {generateEchoRush} from '../scripts/p66-echo-rebuild.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';

const source=generateEchoRush(),ease=t=>t*t*(3-2*t),clamp=t=>Math.max(0,Math.min(1,t));
function adaptLanding(amount){
 const course=structuredClone(source);
 const parts=course.surfaces.filter(s=>s.id.includes('GAP_LANDING'));
 assert.equal(parts.length,2);
 parts.forEach((s,k)=>{
  for(let i=0;i<s.rows;i++){
   const globalT=(k+i/(s.rows-1))/2,delta=amount*ease(clamp((globalT-.42)/.40));
   for(let j=0;j<s.cols;j++)s.points[i*s.cols+j][1]-=delta;
  }
 });
 return course;
}
function replay(course,spawn,speed,seconds){
 const rider=new Runner(course,compile(course),spawn,speed);
 const visited=new Set(),samples=[];let air=null,contact=[],enteredFork=null;
 for(let i=0;i<Math.round(seconds/DT)&&rider.status!=='failed'&&rider.status!=='finished';i++){
  let steer=0;
  if(spawn===0){
   if(enteredFork&&rider.time>=enteredFork&&rider.time<enteredFork+5)steer=-1;
   if(rider.time>=75.45&&rider.time<75.90)steer=1;
   if(rider.time>=75.90&&rider.time<76.35)steer=-1;
  }
  rider.step(steer);
  if(rider.surface){visited.add(rider.surface);
   if(!enteredFork&&rider.surface.includes('FORK_APPROACH'))enteredFork=rider.time;
  }
  if(!rider.grounded&&!air)air=rider.time;
  if(spawn===0&&rider.time>=78.0&&Math.round(rider.time/DT)%120===0&&samples.length<15)
   samples.push({t:+rider.time.toFixed(2),p:rider.p.map(x=>+x.toFixed(2)),v:rider.v.map(x=>+x.toFixed(2)),s:rider.surface});
 }
 return {spawn,speed,time:+rider.time.toFixed(3),status:rider.status,reason:rider.failure?.reason??null,
  firstAir:air?+air.toFixed(3):null,landed:[...visited].some(x=>x.includes('GAP_LANDING')),
  jump:[...visited].some(x=>x.includes('GAP_TAKEOFF')),
  surface:rider.surface,position:rider.p,samples};
}
test.skip('P77 archived landing profile experiments; production now uses 8m drop',()=>{
 for(const amount of [0,8,16]){
  const course=adaptLanding(amount);
  const full=replay(course,0,44,92);
  console.log('P77_LANDING_CANDIDATE_FULL '+JSON.stringify({amount,...full}));
  for(const speed of [38,44,52,60]){
   const short=replay(course,5,speed,3.5);
   console.log('P77_LANDING_CANDIDATE_JUMP '+JSON.stringify({amount,speed,status:short.status,reason:short.reason,landed:short.landed,firstAir:short.firstAir,surface:short.surface}));
  }
 }
});

/** Real start00 (nonhuman P96) side-by-side AT/AV/AW B48 road2 comparison. */
import fs from 'node:fs';
import {generateG4E7AV} from './p101-w9c2-g4e7av-crest-shaping.mjs';
import {generateG4E7AW} from './p101-w9c2-g4e7aw-road2-flow.mjs';
import {AJ_ROADS} from './p101-w9c2-g4e7aj-reanchor-moving.mjs';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {compile} from '../private/reference_only/director/collision.js';
import {sample} from '../private/reference_only/director/surface.js';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const round=(x,n=4)=>Number(x.toFixed(n));
const dot=(a,b)=>a.reduce((v,x,i)=>v+x*b[i],0);
const norm=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
function line(s){return Array.from({length:129},(_,i)=>sample(s,i/128,.5));}
function nearest(a,p){let hit={u:0,d:Infinity};for(let i=0;i<128;i++){
 const o=a[i],z=a[i+1],v=o.map((x,k)=>z[k]-x),q=p.map((x,k)=>x-o[k]),
 t=Math.max(0,Math.min(1,dot(q,v)/(dot(v,v)||1)));
 const d=Math.hypot(...q.map((x,k)=>x-t*v[k]));
 if(d<hit.d)hit={u:(i+t)/128,d};
 }return hit;}
function run(doc,road,profile){
 const r=new Runner(doc,compile(doc),0,52),plan=makeP96RoutePlan(doc,r),
  surge=createA13SurgeState(),ids=doc.surfaces.map(x=>x.id),road2=ids[1],
  nearLine=line(doc.surfaces[1]),trace=[];
 let moving=0,staticFatal=0,eventsAt=0,air=0,peak=52,
  firstRoad2=null,lastRoad2Ground=null,lastNearRoad2=null,maxU2=0,firstAirOnRoad2=null,
  seen=new Set();
 for(let i=0;i<Math.round(21/DT)&&['ready','running'].includes(r.status);i++){
  const input=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose).input/4.8;
  p101Step(r,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,surge),collisionRecovery:false});
  peak=Math.max(peak,Math.hypot(...r.v));
  if(r.surface)seen.add(r.surface);
  if(r.surface===road2&&!firstRoad2)firstRoad2={t:round(r.time,5),speed:round(Math.hypot(...r.v),2)};
  for(const e of r.events.slice(eventsAt)){
   if(e.type==='moving-contact')moving++;
   if(e.type==='static-fatal-contact')staticFatal++;
   if(e.type==='air')air++;
  }
  eventsAt=r.events.length;
  if(i%24===0||r.status!=='running'){
   const near=nearest(nearLine,r.p);
   if(near.d<45&&firstRoad2){
    maxU2=Math.max(maxU2,near.u);
    lastNearRoad2={t:round(r.time,3),u:round(near.u,5),dist:round(near.d,3)};
    if(r.surface===road2&&r.grounded)lastRoad2Ground={
     t:round(r.time,3),u:round(near.u,5),speed:round(Math.hypot(...r.v),2)};
    if(r.surface!==road2&&!firstAirOnRoad2&&near.u>.04&&near.u<.99)
     firstAirOnRoad2={t:round(r.time,3),u:round(near.u,5),dist:round(near.d,3)};
    if(trace.length<70)trace.push({t:round(r.time,3),u:round(near.u,4),
     distanceToRoad2:round(near.d,2),grounded:r.surface===road2});
   }
  }
 }
 return {road,profile,time:round(r.time,5),status:r.status,failure:r.failure?.reason??null,
  visited:ids.filter(x=>seen.has(x)).length,firstRoad2,
  lastGroundedRoad2:lastRoad2Ground,firstOffRoad2:firstAirOnRoad2,
  lastNearRoad2,maxRoad2U:round(maxU2,5),peakMps:round(peak,2),
  movingContacts:moving,staticFatalContacts:staticFatal,airEvents:air,trace};
}
export function awComparison(){
 const results=AJ_ROADS.map(road=>({road,
  candidates:[
   ['AV_lineSoft',generateG4E7AV(road,'lineSoft')],
   ['AW_flowSoft',generateG4E7AW(road,'flowSoft')],
   ['AW_flowOpen',generateG4E7AW(road,'flowOpen')]
  ].map(([name,doc])=>run(doc,road,name))}));
 return {schema:'dopagaki.g4e7aw-real-road2-start00-240hz/1',results,
  physicsHz:1/DT,actualB48Roads:7,actualMovingObstacles:28,
  certifiedSlope2Meters:0,humanFairness:'HOLD',publish:'HOLD'};
}
const m=awComparison();
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(m,null,2)+'\n');
console.log('G4E7AW_REAL_240HZ '+JSON.stringify(m.results.map(x=>({
 road:x.road,runs:x.candidates.map(z=>({name:z.profile,t:z.time,status:z.status,
 visited:z.visited,road2:z.firstRoad2,lastGround:z.lastGroundedRoad2,
 firstOff:z.firstOffRoad2,maxU2:z.maxRoad2U,reason:z.failure,moving:z.movingContacts}))
}))));

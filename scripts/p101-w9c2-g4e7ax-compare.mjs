/** AX vs AV, same real start00 240Hz and same scripted nonhuman input.
 * Report progress and loss of support separately from final terminal failure.
 */
import fs from 'node:fs';
import {generateG4E7AV} from './p101-w9c2-g4e7av-crest-shaping.mjs';
import {generateG4E7AX} from './p101-w9c2-g4e7ax-long-crown.mjs';
import {AJ_ROADS} from './p101-w9c2-g4e7aj-reanchor-moving.mjs';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {compile} from '../private/reference_only/director/collision.js';
import {sample} from '../private/reference_only/director/surface.js';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const rnd=(x,n=4)=>Number(x.toFixed(n));
function locate(points,p){
 let best={u:0,meters:Infinity};
 for(let i=0;i<points.length-1;i++){
  const a=points[i],b=points[i+1],
   v=a.map((x,j)=>b[j]-x),w=a.map((x,j)=>p[j]-x),
   dot=v.reduce((a,x,j)=>a+x*w[j],0),norm=v.reduce((a,x)=>a+x*x,0),
   t=Math.max(0,Math.min(1,dot/(norm||1))),
   d=Math.hypot(...w.map((x,j)=>x-t*v[j]));
  if(d<best.meters)best={u:(i+t)/(points.length-1),meters:d};
 }return best;
}
function run(road,label,doc){
 const r=new Runner(doc,compile(doc),0,52),
  plan=makeP96RoutePlan(doc,r),surge=createA13SurgeState(),
  ids=doc.surfaces.map(x=>x.id),second=ids[1],
  samples=Array.from({length:129},(_,i)=>sample(doc.surfaces[1],i/128,.5)),
  visited=new Map();let firstAir=null,lastSupport=null,maxU2=0,eventsAt=0,moving=0,staticFatal=0,peak=52;
 for(let k=0;k<Math.round(21/DT)&&['ready','running'].includes(r.status);k++){
  const input=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose).input/4.8;
  p101Step(r,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,surge),collisionRecovery:false});
  peak=Math.max(peak,Math.hypot(...r.v));
  if(r.surface&&!visited.has(r.surface))visited.set(r.surface,rnd(r.time,4));
  for(const e of r.events.slice(eventsAt)){
   if(e.type==='moving-contact')moving++;
   if(e.type==='static-fatal-contact')staticFatal++;
  }
  eventsAt=r.events.length;
  if(k%12===0&&visited.has(second)){
   const near=locate(samples,r.p);
   if(near.meters<50){
    maxU2=Math.max(maxU2,near.u);
    if(r.grounded&&r.surface===second)lastSupport={t:rnd(r.time,4),u:rnd(near.u,5),speed:rnd(Math.hypot(...r.v),2)};
    if(!r.grounded&&!firstAir&&near.u>.03)
     firstAir={t:rnd(r.time,4),u:rnd(near.u,5),distanceMeters:rnd(near.meters,2)};
   }
  }
 }
 return {road,label,status:r.status,seconds:rnd(r.time,5),
  visitedRoads:[...visited.keys()].map(x=>({road:ids.indexOf(x)+1,time:visited.get(x)})),
  lastSupport,firstAirNearRoad2:firstAir,maxRoad2U:rnd(maxU2,5),
  peakSpeedMps:rnd(peak,2),movingContacts:moving,staticFatalContacts:staticFatal,
  failedBecause:r.failure?.reason??null};
}
export function axComparison(){
 const records=AJ_ROADS.map(road=>({road,
  runs:[
   run(road,'AV_lineSoft',generateG4E7AV(road,'lineSoft')),
   run(road,'AX_longLead',generateG4E7AX(road,'longLead')),
   run(road,'AX_wideArc',generateG4E7AX(road,'wideArc'))
  ]}));
 return {schema:'dopagaki.g4e7ax-real-long-crown-from-start00/1',records,
  nativeHz:1/DT,trueRoads:7,trueMoving:28,certifiedSlope2Meters:0,
  humanQA:'HOLD',artQA:'HOLD',publish:'HOLD'};
}
const answer=axComparison();
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(answer,null,2)+'\n');
console.log('G4E7AX_NATIVE_REAL '+JSON.stringify(answer.records));

/** G4E-7AV extended actual Runner 240Hz. Genuine initial spawn00, no
 * checkpoint, no stage mutation, no publishing. P96 input NOT human QA.
 */
import fs from 'node:fs';
import {generateG4E7AV} from './p101-w9c2-g4e7av-crest-shaping.mjs';
import {AJ_ROADS} from './p101-w9c2-g4e7aj-reanchor-moving.mjs';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {compile} from '../private/reference_only/director/collision.js';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const f=(x,n=4)=>Number(x.toFixed(n));
function run(road,grade){
 const doc=generateG4E7AV(road,grade),r=new Runner(doc,compile(doc),0,52),
  plan=makeP96RoutePlan(doc,r),surge=createA13SurgeState(),surfaces=doc.surfaces.map(s=>s.id);
 let peak=52,eventsAt=0,contacts=0,air=0,staticFatal=0,
  order=[],reached={};
 for(let i=0;i<Math.round(38/DT)&&['ready','running'].includes(r.status);i++){
  const input=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose).input/4.8;
  p101Step(r,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,surge),collisionRecovery:false});
  peak=Math.max(peak,Math.hypot(...r.v));
  if(r.surface&&!order.includes(r.surface)){order.push(r.surface);
   reached[surfaces.indexOf(r.surface)+1]={t:f(r.time,4),speedMps:f(Math.hypot(...r.v),2)};}
  for(const e of r.events.slice(eventsAt)){
   if(e.type==='moving-contact')contacts++;
   if(e.type==='static-fatal-contact')staticFatal++;
   if(e.type==='air')air++;
  }
  eventsAt=r.events.length;
 }
 return {road,grade,status:r.status,seconds:f(r.time,5),peakMps:f(peak,2),
  actualRoadsVisited:order.length,reached,
  movingContacts:contacts,staticFatalContacts:staticFatal,airEvents:air,
  reason:r.failure?.reason??null,failedAt:r.failure?.position?.map(x=>f(x,2))??null,
  physicallyFinished:r.status==='finished'&&!r.failure&&order.length===7,
  humanEnjoyment:'UNTESTED'};
}
const result={schema:'g4e7av-real-38s-240hz-start00-nonhuman/1',
 results:AJ_ROADS.flatMap(road=>['lineSoft','lineLevel'].map(grade=>run(road,grade))),
 realNative240Hz:true,realB48:7,realB51:28,formalSlope2Meters:0,
 humanFairness:'HOLD',production:'HOLD'};
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(result,null,2)+'\n');
console.log('G4E7AV_EXTENDED_240HZ '+JSON.stringify(result.results));

/** G4E-7AV scripted P96 native 240Hz first-road continuity matrix.
 * A test passes when truthfully measured, NOT only if candidate survives.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {generateG4E7AT} from './p101-w9c2-g4e7at-crown-chasm.mjs';
import {generateG4E7AV,AV_GRADES} from './p101-w9c2-g4e7av-crest-shaping.mjs';
import {AJ_ROADS} from './p101-w9c2-g4e7aj-reanchor-moving.mjs';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {compile} from '../private/reference_only/director/collision.js';
import {sample} from '../private/reference_only/director/surface.js';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const rnd=(v,n=4)=>Number(v.toFixed(n));
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const d=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
function centerline(s){return Array.from({length:257},(_,i)=>sample(s,i/256,.5))}
function project(line,p){
 let b={u:0,d:Infinity};
 for(let i=0;i<256;i++){
  const a=line[i],delta=a.map((v,k)=>line[i+1][k]-v),q=p.map((v,k)=>v-a[k]),
   t=Math.max(0,Math.min(1,dot(q,delta)/(dot(delta,delta)||1))),
   dist=Math.hypot(...q.map((v,k)=>v-t*delta[k]));
  if(dist<b.d)b={u:(i+t)/256,d:dist};
 }
 return b;
}
function run(stage,mode){
 const r=new Runner(stage,compile(stage),0,52),
  plan=makeP96RoutePlan(stage,r),surge=createA13SurgeState(),line=centerline(stage.surfaces[0]),
  seen=new Set();let firstAir=null,lastGround=null,first2=null,eventCursor=0,firstContact=null,maxU=0;
 for(let k=0;k<Math.round(12/DT)&&['ready','running'].includes(r.status);k++){
  const input=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose).input/4.8;
  p101Step(r,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,surge),collisionRecovery:false});
  const p=project(line,r.p);if(p.d<30)maxU=Math.max(maxU,p.u);
  if(r.surface)seen.add(r.surface);
  if(r.grounded&&r.surface===stage.surfaces[0].id)lastGround={t:rnd(r.time,5),u:rnd(p.u,5),xyz:r.p.map(x=>rnd(x,2))};
  if(!r.grounded&&!firstAir)firstAir={t:rnd(r.time,5),u:rnd(p.u,5),xyz:r.p.map(x=>rnd(x,2))};
  if(r.surface===stage.surfaces[1].id&&!first2)first2={t:rnd(r.time,5)};
  for(const e of r.events.slice(eventCursor))if(e.type==='moving-contact'&&!firstContact)firstContact={t:rnd(e.t,5),id:e.id};
  eventCursor=r.events.length;
 }
 return {mode,status:r.status,seconds:rnd(r.time,5),failure:r.failure?.reason??null,
  firstAir,lastGround,firstRoad2:first2,realFirstRoadMaxProgress:rnd(maxU,4),
  visitedRoads:seen.size,firstMovingContact:firstContact};
}
export function g4e7avMatrix(){
 const records=AJ_ROADS.map(road=>({
  road,
  runs:[run(generateG4E7AT(road),'AT_CONTROL'),
   ...Object.keys(AV_GRADES).map(g=>run(generateG4E7AV(road,g),g))]
 }));
 return {schema:'dopagaki.g4e7av-real-crest-continuity-240hz/1',records,
  actualPhysicsHz:1/DT,formalSlope2Meters:0,human:'HOLD',art:'HOLD',publish:'HOLD'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const v=g4e7avMatrix();if(process.argv[2]){
  fs.mkdirSync(path.dirname(process.argv[2]),{recursive:true});
  fs.writeFileSync(process.argv[2],JSON.stringify(v,null,2)+'\n');
 }
 console.log('G4E7AV_CREST_REAL_PHYSICS '+JSON.stringify(v.records));
}

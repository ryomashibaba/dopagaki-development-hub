/** AZ true 240Hz start00 P96 scripted nonhuman comparative evidence.
 * Distinguishes last physical support from later fall terminal state.
 */
import fs from 'node:fs';
import {generateG4E7AY} from './p101-w9c2-g4e7ay-tangent-bridge.mjs';
import {generateG4E7AZ} from './p101-w9c2-g4e7az-crown-chasm-ribbon.mjs';
import {AJ_ROADS} from './p101-w9c2-g4e7aj-reanchor-moving.mjs';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {compile} from '../private/reference_only/director/collision.js';
import {sample} from '../private/reference_only/director/surface.js';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const rnd=(x,n=4)=>Number(x.toFixed(n));
function closest(line,p){
 let best={u:0,d:Infinity};
 for(let i=0;i<line.length-1;i++){
  const a=line[i],b=line[i+1],v=a.map((x,k)=>b[k]-x),q=a.map((x,k)=>p[k]-x),
   t=Math.max(0,Math.min(1,q.reduce((x,y,k)=>x+y*v[k],0)/(v.reduce((x,y)=>x+y*y,0)||1))),
   d=Math.hypot(...q.map((x,k)=>x-t*v[k]));
  if(d<best.d)best={u:(i+t)/(line.length-1),d};
 }
 return best;
}
function run(stage,name,road){
 const r=new Runner(stage,compile(stage),0,52),plan=makeP96RoutePlan(stage,r),
  surge=createA13SurgeState(),ids=stage.surfaces.map(x=>x.id),second=ids[1],
  line=Array.from({length:129},(_,i)=>sample(stage.surfaces[1],i/128,.5)),
  visited=new Map();
 let peak=52,lastGround=null,maximumU=0,firstRoad2=null,contacts=0,staticFatal=0,eventsAt=0;
 const supportTrace=[];let lastWasSupported=false,firstSupportLoss=null;
 for(let k=0;k<Math.round(29/DT)&&['running','ready'].includes(r.status);k++){
  const steer=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose).input/4.8;
  p101Step(r,steer,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,surge),collisionRecovery:false});
  if(r.surface&&!visited.has(r.surface))visited.set(r.surface,rnd(r.time,5));
  if(r.surface===second&&!firstRoad2)firstRoad2={seconds:rnd(r.time,4),speed:rnd(Math.hypot(...r.v),2)};
  peak=Math.max(peak,Math.hypot(...r.v));
  for(const e of r.events.slice(eventsAt)){
   if(e.type==='moving-contact')contacts++;
   if(e.type==='static-fatal-contact')staticFatal++;
  }
  eventsAt=r.events.length;
  const supported=r.grounded&&r.surface===second;
  if(firstRoad2&&(k%12===0||(lastWasSupported&&!supported))){
   const a=closest(line,r.p);
   if(a.d<60&&a.u>=.27&&a.u<=.52&&supportTrace.length<100){
    const left=sample(stage.surfaces[1],a.u,0),right=sample(stage.surfaces[1],a.u,1),
     edge=left.map((x,j)=>right[j]-x),relative=left.map((x,j)=>r.p[j]-x),
     lane=relative.reduce((z,x,j)=>z+x*edge[j],0)/
       (edge.reduce((z,x)=>z+x*x,0)||1),
     surface=sample(stage.surfaces[1],a.u,Math.max(0,Math.min(1,lane))),
     measured={t:rnd(r.time,4),u:rnd(a.u,5),laneFraction:rnd(lane,4),
      heightAboveSurface:rnd(r.p[1]-surface[1],3),speedMps:rnd(Math.hypot(...r.v),2),
      steerInput:rnd(steer,4),supported,
      lateralBallMarginMeters:rnd(Math.min(lane,1-lane)*Math.hypot(...edge)-.65,3)};
    supportTrace.push(measured);
    if(!supported&&lastWasSupported&&!firstSupportLoss)firstSupportLoss=measured;
   }
   if(r.grounded&&r.surface===second&&a.d<40){
    maximumU=Math.max(maximumU,a.u);
    lastGround={u:rnd(a.u,5),seconds:rnd(r.time,4),speed:rnd(Math.hypot(...r.v),2)};
   }
  }
  lastWasSupported=supported;
 }
 return {road,design:name,seconds:rnd(r.time,5),status:r.status,
  physicalRoadsVisited:[...visited.entries()].map(([x,t])=>({road:ids.indexOf(x)+1,t})),
  firstRoad2,lastGround,firstSupportLoss,supportTrace,maxGroundedRoad2U:rnd(maximumU,5),maxSpeed:rnd(peak,2),
  movingContacts:contacts,staticFatalContacts:staticFatal,failure:r.failure?.reason??null};
}
const records=AJ_ROADS.map(road=>({road,runs:[
 run(generateG4E7AY(road,'bankedSweep'),'AY_BANKEDSWEEP',road),
 run(generateG4E7AZ(road,'longGlide'),'AZ_LONGGLIDE',road),
 run(generateG4E7AZ(road,'skySwerve'),'AZ_SKYSWERVE',road)
]}));
const output={schema:'dopagaki.g4e7az-real-crown-chasm-29s-native/1',
 realHz:1/DT,sevenRealRoads:7,realMovingB51:28,records,
 formallyApprovedSlope2Meters:0,humanQA:'HOLD',artQA:'HOLD',publish:'HOLD'};
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(output,null,2)+'\n');
console.log('G4E7AZ_NATIVE '+JSON.stringify(records));

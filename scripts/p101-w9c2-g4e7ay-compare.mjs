/** AY physical 240Hz start00; record actual road2 progress & surface loss,
 * compare against protected AX. Not representative of human play quality.
 */
import fs from 'node:fs';
import {generateG4E7AX} from './p101-w9c2-g4e7ax-long-crown.mjs';
import {generateG4E7AY} from './p101-w9c2-g4e7ay-tangent-bridge.mjs';
import {AJ_ROADS} from './p101-w9c2-g4e7aj-reanchor-moving.mjs';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {compile} from '../private/reference_only/director/collision.js';
import {sample} from '../private/reference_only/director/surface.js';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const round=(x,n=4)=>Number(x.toFixed(n));
function projection(line,p){
 let hit={u:0,meters:Infinity};
 for(let i=0;i<line.length-1;i++){
  const a=line[i],b=line[i+1],v=a.map((x,k)=>b[k]-x),q=p.map((x,k)=>x-a[k]),
   dot=v.reduce((s,x,k)=>s+x*q[k],0),ss=v.reduce((s,x)=>s+x*x,0),
   t=Math.max(0,Math.min(1,dot/(ss||1))),
   dist=Math.hypot(...q.map((x,k)=>x-t*v[k]));
  if(dist<hit.meters)hit={u:(i+t)/(line.length-1),meters:dist};
 }
 return hit;
}
function run(stage,road,candidate){
 const r=new Runner(stage,compile(stage),0,52),plan=makeP96RoutePlan(stage,r),
  surge=createA13SurgeState(),ids=stage.surfaces.map(x=>x.id),
  road2=ids[1],line=Array.from({length:129},(_,i)=>sample(stage.surfaces[1],i/128,.5));
 let firstRoad2=null,lastGroundRoad2=null,maxU2=0,eventsAt=0,contacts=0,
  fatals=0,peak=52,maxNearU2=0;
 const visited=new Map(),trail=[];
 for(let i=0;i<Math.round(25/DT)&&['ready','running'].includes(r.status);i++){
  const input=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose).input/4.8;
  p101Step(r,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,surge),collisionRecovery:false});
  peak=Math.max(peak,Math.hypot(...r.v));
  if(r.surface&&!visited.has(r.surface))visited.set(r.surface,round(r.time,4));
  if(r.surface===road2&&!firstRoad2)firstRoad2={t:round(r.time,4),speedMps:round(Math.hypot(...r.v),2)};
  for(const e of r.events.slice(eventsAt)){
   if(e.type==='moving-contact')contacts++;
   if(e.type==='static-fatal-contact')fatals++;
  }
  eventsAt=r.events.length;
  if(i%18===0&&firstRoad2){
   const p=projection(line,r.p);
   if(p.meters<60){
    maxNearU2=Math.max(maxNearU2,p.u);
    if(r.grounded&&r.surface===road2){
     maxU2=Math.max(maxU2,p.u);
     lastGroundRoad2={t:round(r.time,4),u:round(p.u,5),speedMps:round(Math.hypot(...r.v),2)};
    }
    if(trail.length<65&&p.u>.12){
     const s=stage.surfaces[1],
      left=sample(s,p.u,0),right=sample(s,p.u,1),
      cross=right.map((x,k)=>x-left[k]),off=r.p.map((x,k)=>x-left[k]),
      fraction=off.reduce((sum,x,k)=>sum+x*cross[k],0)/
       (cross.reduce((sum,x)=>sum+x*x,0)||1);
     trail.push({t:round(r.time,3),u:round(p.u,5),
      fraction:round(fraction,4),distance:round(p.meters,2),
      grounded:r.grounded&&r.surface===road2});
    }
   }
  }
 }
 return {road,candidate,status:r.status,seconds:round(r.time,5),
  failure:r.failure?.reason??null,firstRoad2,
  lastGroundRoad2,maximumSupportedU2:round(maxU2,5),maxNearbyU2:round(maxNearU2,5),
  visited:[...visited.entries()].map(([id,t])=>({road:ids.indexOf(id)+1,t})),
  topSpeedMps:round(peak,2),movingContacts:contacts,staticFatalContacts:fatals,trail};
}
export function ayNativeComparison(){
 const results=AJ_ROADS.map(road=>({road,cases:[
  run(generateG4E7AX(road,'longLead'),road,'AX_BASELINE'),
  run(generateG4E7AY(road,'tangentDeck'),road,'AY_TANGENT_DECK'),
  run(generateG4E7AY(road,'bankedSweep'),road,'AY_BANKED_SWEEP')
 ]}));
 return {schema:'dopagaki.g4e7ay-true-b48-long-radius-crown/1',results,
  actualHz:1/DT,realRoads:7,realB51C:28,
  certifiedSlope2Meters:0,humanFairness:'HOLD',art:'HOLD',publish:'HOLD'};
}
const report=ayNativeComparison();
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(report,null,2)+'\n');
console.log('G4E7AY_NATIVE '+JSON.stringify(report.results.map(x=>({
 road:x.road,cases:x.cases.map(z=>({name:z.candidate,status:z.status,seconds:z.seconds,
 reached:z.visited.map(v=>v.road),lastGround:z.lastGroundRoad2,
 supportedU:z.maximumSupportedU2,maxNearbyU:z.maxNearbyU2,moving:z.movingContacts,
 staticFatal:z.staticFatalContacts,reason:z.failure}))
}))));

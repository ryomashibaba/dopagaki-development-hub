import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {generateG4E7TRejoin,G4E7T_REJOIN} from './p101-w9c2-g4e7t-lower-landing-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {sample} from '../private/reference_only/director/surface.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const fmt=(x,n=4)=>Number(x.toFixed(n));
const dot=(a,b)=>a.reduce((sum,x,i)=>sum+x*b[i],0);
function along(points,p){
 let d=Infinity,u=0;
 for(let i=0;i<points.length-1;i++){
  const a=points[i],v=a.map((x,k)=>points[i+1][k]-x),
   delta=p.map((x,k)=>x-a[k]),t=Math.max(0,Math.min(1,dot(delta,v)/(dot(v,v)||1))),
   sep=Math.hypot(...delta.map((x,k)=>x-t*v[k]));
  if(sep<d){d=sep;u=(i+t)/(points.length-1);}
 }
 return {u,sep:d};
}
function trial(variant){
 const doc=generateG4E7TRejoin(variant),r=new Runner(doc,compile(doc),0,52),
  plan=makeP96RoutePlan(doc,r),surge=createA13SurgeState(),
  line=Array.from({length:129},(_,i)=>sample(doc.surfaces[0],i/128,.5)),
  gap=doc.stageForge.g4e7tRejoin.gap;
 let preGround=0,airNearGap=0,airStart=null,firstLanding=null,
  peak=52,visited=[],seen=new Set(),targetEntry=null;
 const around=[];
 for(let tick=1;tick<=70/DT&&!['failed','finished'].includes(r.status);tick++){
  const steer=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose).input/4.8;
  p101Step(r,steer,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,surge),collisionRecovery:false});
  const speed=Math.hypot(...r.v),q=along(line,r.p),s=r.surface||r.lastSurface;
  peak=Math.max(peak,speed);
  if(s&&!seen.has(s)){seen.add(s);visited.push(s);}
  if(gap&&q.sep<22){
   if(q.u>gap.uTakeoff-.022&&q.u<gap.uTakeoff&&r.grounded)preGround++;
   if(q.u>=gap.uTakeoff&&q.u<=gap.uLanding&&targetEntry===null)
    targetEntry={t:fmt(r.time),u:fmt(q.u,5),grounded:r.grounded,speedMps:fmt(speed,2)};
   if(q.u>=gap.uTakeoff-.006&&q.u<=gap.uLanding+.018&&!r.grounded){
    airNearGap++;
    if(!airStart)airStart={t:fmt(r.time),u:fmt(q.u,5),speedMps:fmt(speed,2)};
   }
   if(airStart&&r.grounded&&r.surface===doc.surfaces[0].id&&
    q.u>gap.uLanding&&!firstLanding)
    firstLanding={t:fmt(r.time),u:fmt(q.u,5),speedMps:fmt(speed,2)};
  }
  if(q.sep<22&&q.u>.48&&q.u<.75&&tick%12===0)
   around.push({t:fmt(r.time),u:fmt(q.u,5),grounded:r.grounded,speedMps:fmt(speed,2)});
 }
 const roads=doc.surfaces.map(s=>s.id);
 return {variant,status:r.status,finished:r.status==='finished'&&!r.failure,
  allSevenInOrder:roads.every((id,i)=>seen.has(id)&&(i===0||visited.indexOf(roads[i-1])<visited.indexOf(id))),
  visitedRoads:visited,timeSeconds:fmt(r.time),peakMps:fmt(peak,2),
  preGapGroundTicks:preGround,actualGapAirTicks:airNearGap,
  startAir:airStart,firstLanding,targetEntry,realGap:gap,
  failure:r.failure??null,trace:around,humanFairness:'HOLD',officialSlope2Meters:0};
}
export function g4e7tLandingMatrix(){
 const v=G4E7T_REJOIN.map(x=>trial(x.id));
 return {schema:'dopagaki.g4e7t-early-lower-landing-native/1',
  physicsHz:1/DT,start00:true,startSpeedMps:52,
  candidateRuns:v,scriptedSteerOnly:true,
  realGapEffectNotAssumed:true,officialSlope2Meters:0,humanFairness:'HOLD'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const d=g4e7tLandingMatrix();
 if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(d,null,2)+'\n');
 console.log('G4E7T_LANDING '+JSON.stringify(d.candidateRuns.map(({trace,realGap,visitedRoads,...rest})=>({...rest,
  gapMeters:realGap?.lengthMeters??null,lowerBy:realGap?.landingBelowTakeoffMeters??null,
  visited:visitedRoads.length}))));
}

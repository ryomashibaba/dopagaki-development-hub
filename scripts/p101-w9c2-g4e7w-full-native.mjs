/**
 * G4E-7W B — FULL native 240Hz canonical start00 after the short 9-second
 * causality screen. The 9-second screen is NOT mistaken for a completion.
 * All four independent START00 runs use genuine CCD, ORIGINAL 28 moving
 * B51-C, REAL seven physical B48 roads and P96 scripted research steering.
 */
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {generateG4E7WPhysical} from './p101-w9c2-g4e7w-grounded-cut-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {sample} from '../private/reference_only/director/surface.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const f=(x,n=4)=>Number(x.toFixed(n)),dot=(a,b)=>a.reduce((v,x,i)=>v+x*b[i],0);
function positionOn(line,p){
 let near={u:0,dist:Infinity};
 for(let i=0;i<line.length-1;i++){
  const a=line[i],v=a.map((x,k)=>line[i+1][k]-x),d=p.map((x,k)=>x-a[k]),
   w=Math.max(0,Math.min(1,dot(d,v)/(dot(v,v)||1))),s=Math.hypot(...d.map((x,k)=>x-w*v[k]));
  if(s<near.dist)near={u:(i+w)/(line.length-1),dist:s};
 }
 return near;
}
function simulate(profile,cell,voidExists){
 const doc=generateG4E7WPhysical(profile,cell);
 if(!voidExists)delete doc.surfaces[0].voidLongitudinalCells;
 const r=new Runner(doc,compile(doc),0,52),
  plan=makeP96RoutePlan(doc,r),surge=createA13SurgeState(),
  line=Array.from({length:193},(_,i)=>sample(doc.surfaces[0],i/192,.5)),
  gap=doc.stageForge.g4e7wStudy.gap;
 const order=[],seen=new Set();let max=52,minAfter=Infinity,firstAir=null,firstRejoin=null,
  maxLoss=0,lossPoint=null,airTicks=0,landingSpeed=null,
  nearGapSamples=[],movingContacts=0,firstGapExit=null;
 for(let tick=1;tick<=70/DT;tick++){
  if(!['running','ready'].includes(r.status))break;
  const speedBefore=Math.hypot(...r.v),cursor=r.events.length;
  const input=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose).input/4.8;
  p101Step(r,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,surge),collisionRecovery:false});
  const speed=Math.hypot(...r.v),p=positionOn(line,r.p),loss=speedBefore-speed;
  max=Math.max(max,speed);
  for(const event of r.events.slice(cursor))if(event.type==='moving-contact')movingContacts++;
  if(r.surface&&!seen.has(r.surface)){seen.add(r.surface);order.push(r.surface);}
  if(p.dist<35){
   if(p.u>=gap.uTakeoff-.005&&p.u<=gap.uLanding+.025&&!r.grounded&&!firstAir)
    firstAir={t:f(r.time,5),u:f(p.u,6),speed:f(speed,2)};
   if(p.u>=gap.uTakeoff&&p.u<=.92&&!r.grounded)airTicks++;
   if(firstAir&&p.u>gap.uLanding&&r.grounded&&r.surface===doc.surfaces[0].id&&!firstRejoin)
    firstRejoin={t:f(r.time,5),u:f(p.u,6),speed:f(speed,2)};
   if(p.u>=gap.uLanding&&p.u<.92)minAfter=Math.min(minAfter,speed);
   if(p.u>=gap.uTakeoff-.03&&p.u<.75&&loss>maxLoss){
    maxLoss=loss;lossPoint={t:f(r.time,5),u:f(p.u,6),before:f(speedBefore,2),after:f(speed,2),
     loss:f(loss,3),position:r.p.map(x=>f(x,2))};
   }
   if(p.u>=gap.uLanding&&p.u<.92&&tick%80===0)
    nearGapSamples.push({time:f(r.time,3),u:f(p.u,5),speed:f(speed,2),grounded:r.grounded});
  }
 }
 const ids=doc.surfaces.map(x=>x.id);
 const finished=r.status==='finished'&&!r.failure&&ids.every((id,i)=>
  seen.has(id)&&(i===0||order.indexOf(ids[i-1])<order.indexOf(id)));
 return {profile,cell,hasRealGap:voidExists,actualGapLengthMeters:voidExists?gap.gapMeters:0,
  widthAtPhysicalLipMeters:gap.lipWidthMeters,
  state:r.status,allSevenInOrder:finished,
  roadsTouched:order.length,actualFinishSeconds:finished?f(r.time):null,
  stopTimeSeconds:f(r.time),maxSpeedMps:f(max,2),minAfterGapSpeedMps:Number.isFinite(minAfter)?f(minAfter,2):null,
  firstAir,firstB48GroundedRejoin:firstRejoin,airTicksInFirstRoadWindow:airTicks,
  largestIndividualSpeedLossNearGap:lossPoint,movingContactEvents:movingContacts,
  firstRoadStateSamples:nearGapSamples,failure:r.failure??null,forcedSpeedReset:false,
  humanApproval:'NOT_TESTED',officialSlope2Meters:0};
}
export function g4e7wFullNative(){
 const pairs=[];
 for(const profile of ['exit4','exit6']){
  const intact=simulate(profile,52,false),cut=simulate(profile,52,true);
  pairs.push({profile,cell:52,
   solidControl:intact,trueGap:cut,
   gapCausesDistinctRun:Math.abs((cut.actualFinishSeconds??cut.stopTimeSeconds)-
    (intact.actualFinishSeconds??intact.stopTimeSeconds))>.0001,
   provisionalPhysicsCandidate:cut.allSevenInOrder&&Boolean(cut.firstB48GroundedRejoin)&&
    cut.minAfterGapSpeedMps!==null&&cut.minAfterGapSpeedMps>=60,
   neverAutomaticallyHumanApproved:true});
 }
 return {schema:'dopagaki.g4e7w-actual-full-240hz-seven-road/1',physicsHz:1/DT,
  start00:true,initialSpeedMps:52,P96:'SCRIPTED_NON_HUMAN',
  verifiedGenuineNarrowRoads:7,originalMovingMachines:28,
  pairs,officialSlope2Meters:0,
  humanFairness:'HOLD',publish:'HOLD'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const d=g4e7wFullNative();
 if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(d,null,2)+'\n');
 console.log('G4E7W_FULL '+JSON.stringify(d.pairs.map(p=>({
  profile:p.profile,control:{status:p.solidControl.state,time:p.solidControl.actualFinishSeconds??p.solidControl.stopTimeSeconds},
  gap:{status:p.trueGap.state,time:p.trueGap.actualFinishSeconds??p.trueGap.stopTimeSeconds,
   roads:p.trueGap.roadsTouched,rejoin:p.trueGap.firstB48GroundedRejoin,
   minSpeed:p.trueGap.minAfterGapSpeedMps,airTicks:p.trueGap.airTicksInFirstRoadWindow,
   shock:p.trueGap.largestIndividualSpeedLossNearGap,failure:p.trueGap.failure?.reason??null},
  physicsShortlisted:p.provisionalPhysicsCandidate,runDiff:p.gapCausesDistinctRun}))));
}

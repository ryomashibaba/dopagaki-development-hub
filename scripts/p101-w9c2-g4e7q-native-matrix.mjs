/** G4E-7Q: native scripted physics; never a human result or approval. */
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {generateG4E7QPhysical,G4E7Q_VARIANTS} from './p101-w9c2-g4e7q-dive-build.mjs';
import {g4e7mNativeRun} from './p101-w9c2-g4e7m-native-matrix.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step,p101RoadProgress} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const round=(v,n=3)=>Number(v.toFixed(n));
export function g4e7qNativeRun(variant,{maxSeconds=70}={}){
 if(!G4E7Q_VARIANTS.includes(variant)||maxSeconds<55||maxSeconds>80)
  throw Error('G4E-7Q declared candidate and bounded time required');
 const doc=generateG4E7QPhysical(variant),r=new Runner(doc,compile(doc),0,52),
  p96=makeP96RoutePlan(doc,r),surge=createA13SurgeState(),expected=doc.surfaces.map(s=>s.id),
  visited=[],seen=new Set(),localSamples=[];
 const gap=doc.stageForge.g4e7qStudy.gap;
 let airborneTicks=0,peakSpeed=52,nearGapAirTicks=0,landingAfterGap=false,
  reachedPreGap=false,reachedGapEnd=false;
 for(let tick=0;tick<maxSeconds/DT&&r.status!=='failed'&&r.status!=='finished';tick++){
  const steer=p96DodgeSteer(r,p96,'early-soft',movingObstaclePose).input/4.8;
  p101Step(r,steer,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,surge),collisionRecovery:false});
  peakSpeed=Math.max(peakSpeed,Math.hypot(...r.v));
  if(!r.grounded)airborneTicks++;
  const s=r.surface||r.lastSurface;
  if(s&&!seen.has(s)){seen.add(s);visited.push(s);}
  if(s===expected[0]){
   const {u}=p101RoadProgress(r);
   if(u>=.74)reachedPreGap=true;
   if(gap&&u>=gap.uTakeoff&&u<=gap.uLanding&&!r.grounded)nearGapAirTicks++;
   if(gap&&u>gap.uLanding)reachedGapEnd=true;
   if(gap&&reachedGapEnd&&r.grounded)landingAfterGap=true;
   if(tick%36===0&&u>.67&&u<.96)localSamples.push({t:round(r.time),u:round(u,4),
    speedMps:round(Math.hypot(...r.v),2),grounded:r.grounded,xyz:r.p.map(x=>round(x,2))});
  }
 }
 const finished=r.status==='finished'&&!r.failure,ordered=expected.every((s,i)=>
  seen.has(s)&&(i===0||visited.indexOf(expected[i-1])<visited.indexOf(s)));
 return {variant,source:'NATIVE_240HZ_P96_SCRIPTED_NOT_HUMAN',hz:1/DT,start00:true,
  initialSpeedMps:52,realB48:true,actualGap:variant==='leap',
  originalMovingCount:doc.movingObstacles.length,sevenRoads:doc.surfaces.length,
  timeSeconds:round(r.time),peakSpeedMps:round(peakSpeed,2),status:r.status,
  finished,allSevenInOrder:ordered,visitedRoads:visited,airborneSeconds:round(airborneTicks*DT,4),
  nearGapAirSeconds:round(nearGapAirTicks*DT,4),reachedPreGap,reachedGapEnd,landingAfterGap,
  localSamples,movingContacts:r.events.filter(e=>e.type==='moving-contact').length,
  failure:r.failure??null,approvedSlopeDnaMeters:0,humanPlayability:'HOLD',release:'HOLD'};
}
export function g4e7qNativeMatrix(){
 const gold=g4e7mNativeRun('GOLD'),glide=g4e7mNativeRun('GLIDE');
 if(!gold.finished||!glide.finished||!gold.allSevenInOrder||!glide.allSevenInOrder||
  gold.originalMovingCount!==28||glide.originalMovingCount!==28)
  throw Error('G4E-7Q preexisting Gold and GLIDE native controls must pass');
 return {schema:'dopagaki.w9c2.g4e7q-real-B48-dive/1',
  control:{gold:{finished:gold.finished,seconds:gold.elapsedSeconds},
   glide:{finished:glide.finished,seconds:glide.elapsedSeconds}},
  candidates:G4E7Q_VARIANTS.map(x=>g4e7qNativeRun(x)),
  nativeProofOnly:true,human:'NOT_RUN',release:'HOLD',officiallyApprovedSlopeDnaMeters:0};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const result=g4e7qNativeMatrix();
 if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(result,null,2)+'\n');
 console.log('G4E7Q_NATIVE '+JSON.stringify({control:result.control,
  candidates:result.candidates.map(({localSamples,...c})=>c),release:result.release}));
}

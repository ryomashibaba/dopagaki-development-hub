/**
 * G4E-7R independent native 240Hz surveys.
 * Full start00 is a canonical SCRIPTED QA. The artificial inspection-spawn
 * study is a LOCAL PHYSICS DIAGNOSTIC and never passes full-course fairness.
 */
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {generateG4E7RPhysical,G4E7R_VARIANTS} from './p101-w9c2-g4e7r-grade-build.mjs';
import {g4e7mNativeRun} from './p101-w9c2-g4e7m-native-matrix.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {sample} from '../private/reference_only/director/surface.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const fmt=(x,n=3)=>Number(x.toFixed(n));
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const difference=(a,b)=>a.map((x,i)=>x-b[i]);
function curveProjection(points,p){
 let best={distance:Infinity,u:0};
 for(let i=0;i<points.length-1;i++){
  const a=points[i],v=difference(points[i+1],a),
   t=Math.max(0,Math.min(1,dot(difference(p,a),v)/(dot(v,v)||1))),
   nearest=a.map((x,k)=>x+v[k]*t),
   dist=Math.hypot(...difference(p,nearest));
  if(dist<best.distance)best={distance:dist,u:(i+t)/(points.length-1)};
 }
 return best;
}
function run(variant,{local=false,speed=52,maxSeconds=70}={}){
 const doc=generateG4E7RPhysical(variant,{inspectionSpawns:local}),
  idx=local?doc.stageForge.g4e7rStudy.inspectionSpawnStart:0,
  r=new Runner(doc,compile(doc),idx,speed),
  plan=makeP96RoutePlan(doc,r),surge=createA13SurgeState();
 const road=doc.surfaces[0],gap=doc.stageForge.g4e7rStudy.gap;
 const line=Array.from({length:257},(_,i)=>sample(road,i/256,.5));
 const visited=new Set(),ordered=[],trace=[];
 let earliestGapAir=null,landingAfterGap=null,atLip=false,enteredVoid=false,
  peakSpeed=speed,previousU=local ? .765 : 0,lastU=previousU;
 for(let tick=0;tick<maxSeconds/DT&&r.status!=='failed'&&r.status!=='finished';tick++){
  const steer=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose).input/4.8;
  p101Step(r,steer,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,surge),collisionRecovery:false});
  const velocity=Math.hypot(...r.v);peakSpeed=Math.max(peakSpeed,velocity);
  if(r.surface&&!visited.has(r.surface)){visited.add(r.surface);ordered.push(r.surface);}
  const projected=curveProjection(line,r.p),u=projected.u;
  // For start00, only classify the first road as candidate-local when near
  // the actual B48 first-road centerline; never allow far road nearest matches.
  if(projected.distance<22&&(r.surface===road.id||!r.grounded||local)&&u>.66&&u<.96){
   lastU=u;
   if(gap){
    if(previousU<gap.uTakeoff&&u>=gap.uTakeoff)atLip=true;
    if(u>=gap.uTakeoff&&u<=gap.uLanding)enteredVoid=true;
    if(enteredVoid&&!r.grounded&&!earliestGapAir)
     earliestGapAir={t:fmt(r.time,4),u:fmt(u,5),xyz:r.p.map(x=>fmt(x,2)),speedMps:fmt(velocity,2)};
    if(earliestGapAir&&u>gap.uLanding&&r.grounded&&r.surface===road.id&&!landingAfterGap)
     landingAfterGap={t:fmt(r.time,4),u:fmt(u,5),xyz:r.p.map(x=>fmt(x,2)),speedMps:fmt(velocity,2)};
   }
   if(tick%12===0)trace.push({time:fmt(r.time,4),u:fmt(u,4),distanceToRoad:fmt(projected.distance,2),
     speedMps:fmt(velocity,1),grounded:r.grounded,road:r.surface});
  }
  previousU=u;
  if(local&&u>.91&&r.grounded)break;
  if(local&&r.time>5)break;
 }
 const expected=doc.surfaces.map(s=>s.id);
 const finished=r.status==='finished'&&!r.failure,
  fullInOrder=expected.every((id,i)=>visited.has(id)&&
   (i===0||ordered.indexOf(expected[i-1])<ordered.indexOf(id)));
 return {variant,local,initialSpeedMps:speed,
  status:r.status,failed:!!r.failure,finished,fullInOrder,
  elapsedSeconds:fmt(r.time,3),peakSpeedMps:fmt(peakSpeed,2),
  visitedRoadCount:expected.filter(id=>visited.has(id)).length,
  failure:r.failure?{timeSeconds:fmt(r.failure.t),reason:r.failure.reason,surface:r.failure.surface}:null,
  gapMeters:gap?.gapMeters??null,lipReached:atLip,enteredVoid,
  physicalAirInsideOrAfterVoid:!!earliestGapAir,
  actualLandingOnOriginalRoad:!!landingAfterGap,
  earliestGapAir,landingAfterGap,trace,
  humanFairness:'HOLD',certifiedSlope2Meters:0,
  interpretation:local?'LOCAL_INSPECTION_SPAWN_NOT_START00':'START00_SCRIPTED_NOT_HUMAN'};
}
export function g4e7rNativeSurvey(){
 const gold=g4e7mNativeRun('GOLD'),glide=g4e7mNativeRun('GLIDE');
 if(!gold.finished||!glide.finished||!gold.allSevenInOrder||!glide.allSevenInOrder)
  throw Error('G4E-7R requires authentic unmodified Gold/GLIDE 240Hz controls');
 const canonical=G4E7R_VARIANTS.map(variant=>run(variant));
 const local=G4E7R_VARIANTS.flatMap(variant=>[85,115].map(speed=>run(variant,{local:true,speed,maxSeconds:5})));
 return {schema:'dopagaki.g4e7r-native/1',hz:1/DT,goldControl:gold.elapsedSeconds,
  glideControl:glide.elapsedSeconds,canonical,local,
  noPhysicsAssistsAdded:true,humanPlaytest:'NOT_RUN',
  approval:'HOLD',certifiedSlope2Meters:0};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const result=g4e7rNativeSurvey();
 if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(result,null,2)+'\n');
 console.log('G4E7R_NATIVE '+JSON.stringify({
  controls:[result.goldControl,result.glideControl],
  canonical:result.canonical.map(({trace,...r})=>r),
  local:result.local.map(({trace,...r})=>r),approval:result.approval}));
}

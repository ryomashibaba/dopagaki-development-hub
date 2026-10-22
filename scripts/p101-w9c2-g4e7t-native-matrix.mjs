/**
 * G4E-7T: honest canonical 240Hz start00 native matrix for the independent
 * EARLY and LATE real B48 gaps vs SOLID under same narrow geometry.
 * CRITICAL: no gap-caused flight claim without baseline-grounded contrast.
 */
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {generateG4E7TPhysical,G4E7T_VARIANTS} from './p101-w9c2-g4e7t-real-early-gap-build.mjs';
import {g4e7mNativeRun} from './p101-w9c2-g4e7m-native-matrix.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {sample} from '../private/reference_only/director/surface.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const rd=(n,p=4)=>Number(n.toFixed(p));
const diff=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
const dot=(a,b)=>a.reduce((x,v,i)=>x+v*b[i],0);
function nearest(points,p){
 let dist=Infinity,u=0;
 for(let i=0;i<points.length-1;i++){
  const a=points[i],v=a.map((x,j)=>points[i+1][j]-x),
   d=p.map((x,j)=>x-a[j]),t=Math.min(1,Math.max(0,dot(d,v)/(dot(v,v)||1))),
   m=Math.hypot(...d.map((x,j)=>x-v[j]*t));
  if(m<dist){dist=m;u=(i+t)/(points.length-1);}
 }
 return {u,dist};
}
function setup(variant){
 const doc=generateG4E7TPhysical(variant);
 return {variant,doc,runner:new Runner(doc,compile(doc),0,52),
  surge:createA13SurgeState(),path:Array.from({length:129},(_,i)=>sample(doc.surfaces[0],i/128,.5)),
  plan:null,airTicks:0,seen:new Set(),ordered:[],peak:52,
  nearGapAirTicks:0,firstAir:null,landing:null,nearLipGroundTicks:0,firstLip:null,
  trace:[]};
}
const summarize=s=>{
 const r=s.runner,ids=s.doc.surfaces.map(x=>x.id),
  ordered=ids.every((id,i)=>s.seen.has(id)&&(i===0||s.ordered.indexOf(ids[i-1])<s.ordered.indexOf(id)));
 return {variant:s.variant,status:r.status,finished:r.status==='finished'&&!r.failure,
  allSevenInOrder:ordered,visitedRoads:s.ordered,timeSeconds:rd(r.time,3),
  maxSpeedMps:rd(s.peak,2),realRoadCount:s.doc.surfaces.length,
  movingMachines:s.doc.movingObstacles.length,realGap:s.doc.stageForge.g4e7tStudy.gap,
  nearLipGroundTicks:s.nearLipGroundTicks,firstLip:s.firstLip,
  airSeconds:rd(s.airTicks*DT,4),nearGapAirTicks:s.nearGapAirTicks,
  firstAir:s.firstAir,landedBackOnFirstB48:!!s.landing,landing:s.landing,
  failure:r.failure??null,trace:s.trace,
  humanFairness:'HOLD',certifiedSlope2Meters:0};
};
export function g4e7tNativeMatrix(){
 const gold=g4e7mNativeRun('GOLD'),glide=g4e7mNativeRun('GLIDE');
 if(!gold.finished||!glide.finished||!gold.allSevenInOrder||!glide.allSevenInOrder)
  throw Error('G4E-7T immutable Gold and GLIDE native controls failed');
 const states=G4E7T_VARIANTS.map(setup);
 for(const s of states)s.plan=makeP96RoutePlan(s.doc,s.runner);
 const cutWindow={early:[.58,.68],late:[.64,.73]};
 const relative={early:{extraAirTicks:0,maxPositionDivergence:0,firstPhysicalDifference:null},
  late:{extraAirTicks:0,maxPositionDivergence:0,firstPhysicalDifference:null}};
 for(let tick=1;tick<70/DT;tick++){
  for(const s of states){
   const r=s.runner;if(r.status!=='running')continue;
   const steer=p96DodgeSteer(r,s.plan,'early-soft',movingObstaclePose).input/4.8;
   p101Step(r,steer,'OVERDRIVE',{
    forwardScale:p101A13ForwardScale(r,s.surge),collisionRecovery:false});
   const speed=Math.hypot(...r.v);s.peak=Math.max(s.peak,speed);
   if(!r.grounded)s.airTicks++;
   if(r.surface&&!s.seen.has(r.surface)){s.seen.add(r.surface);s.ordered.push(r.surface);}
   const q=nearest(s.path,r.p),gap=s.doc.stageForge.g4e7tStudy.gap;
   if(gap&&q.dist<22){
    if(q.u>=gap.uTakeoff-.015&&q.u<gap.uTakeoff&&r.grounded)s.nearLipGroundTicks++;
    if(q.u>=gap.uTakeoff&&!s.firstLip)
     s.firstLip={time:rd(r.time,4),u:rd(q.u,5),grounded:r.grounded,
      speedMps:rd(speed,2)};
    if(q.u>=gap.uTakeoff&&q.u<=gap.uLanding&&!r.grounded)s.nearGapAirTicks++;
    if(!r.grounded&&q.u>=gap.uTakeoff-.015&&q.u<=gap.uLanding+.03&&!s.firstAir)
     s.firstAir={time:rd(r.time,4),u:rd(q.u,5),speedMps:rd(speed,2)};
    if(s.firstAir&&r.grounded&&r.surface===s.doc.surfaces[0].id&&
     q.u>gap.uLanding&&!s.landing)
     s.landing={time:rd(r.time,4),u:rd(q.u,5),speedMps:rd(speed,2)};
   }
   if(q.dist<22&&q.u>.40&&q.u<.82&&tick%18===0)
    s.trace.push({time:rd(r.time,4),u:rd(q.u,5),grounded:r.grounded,speed:rd(speed,2)});
  }
  const control=states[0].runner;
  for(const trial of states.slice(1)){
   const name=trial.variant,r=trial.runner,w=cutWindow[name],q=nearest(states[0].path,control.p);
   if(q.dist<25&&q.u>=w[0]&&q.u<=w[1]){
    const delta=diff(control.p,r.p),item=relative[name];
    item.maxPositionDivergence=Math.max(item.maxPositionDivergence,delta);
    if(control.grounded&&!r.grounded)item.extraAirTicks++;
    if(!item.firstPhysicalDifference&&(delta>.01||control.grounded!==r.grounded))
     item.firstPhysicalDifference={time:rd(r.time,4),u:rd(q.u,5),
      distanceMeters:rd(delta,5),solidGrounded:control.grounded,
      gapGrounded:r.grounded};
   }
  }
  if(states.every(s=>s.runner.status!=='running'))break;
 }
 const candidates=states.map(summarize);
 return {schema:'dopagaki.g4e7t-real-gap-native-matrix/1',
  controls:{goldSeconds:gold.elapsedSeconds,glideSeconds:glide.elapsedSeconds},
  physicsHz:1/DT,start00:true,startSpeedMps:52,
  steering:'P96_4_8_SCRIPTED_NOT_HUMAN',candidates,
  relativeGapCausality:relative,
  noNativeAssistAdded:true,noPublication:true,
  certifiedSlope2Meters:0,humanFairness:'HOLD'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const r=g4e7tNativeMatrix();
 if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(r,null,2)+'\n');
 console.log('G4E7T_NATIVE '+JSON.stringify({controls:r.controls,
  candidates:r.candidates.map(({trace,realGap,visitedRoads,...rest})=>({...rest,gapMeters:realGap?.gapMeters??null,visitedRoadCount:visitedRoads.length})),
  causality:r.relativeGapCausality,human:r.humanFairness}));
}

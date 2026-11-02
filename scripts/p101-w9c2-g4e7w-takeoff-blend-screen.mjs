/**
 * G4E-7W R2 240Hz causal screen: alpha-specific cut vs EXACT alpha-specific
 * solid. Native P96 steering research only; no 7-road assertions from 9s.
 */
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {generateG4E7WBlend,W_BLEND_LEVELS} from './p101-w9c2-g4e7w-takeoff-blend-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {sample} from '../private/reference_only/director/surface.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const round=(x,p=4)=>Number(x.toFixed(p)),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
function project(points,p){
 let best={dist:Infinity,u:0};
 for(let i=0;i<points.length-1;i++){
  const a=points[i],v=a.map((x,k)=>points[i+1][k]-x),d=p.map((x,k)=>x-a[k]),
   t=Math.max(0,Math.min(1,dot(d,v)/(dot(v,v)||1))),dist=Math.hypot(...d.map((x,k)=>x-t*v[k]));
  if(dist<best.dist)best={dist,u:(i+t)/(points.length-1)};
 }
 return best;
}
function setup(doc){
 const r=new Runner(doc,compile(doc),0,52);
 return {r,plan:makeP96RoutePlan(doc,r),surge:createA13SurgeState(),
  rejoin:null,firstAir:null,groundAtExit:0,minSpeed:Infinity};
}
function tick(x){
 const r=x.r;
 if(!['ready','running'].includes(r.status))return;
 const input=p96DodgeSteer(r,x.plan,'early-soft',movingObstaclePose).input/4.8;
 p101Step(r,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,x.surge),collisionRecovery:false});
}
function check(alpha){
 const doc=generateG4E7WBlend(alpha),gap=doc.stageForge.g4e7wStudy.gap,
  control=structuredClone(doc);
 delete control.surfaces[0].voidLongitudinalCells;
 const solid=setup(control),cut=setup(doc),
  line=Array.from({length:161},(_,i)=>sample(doc.surfaces[0],i/160,.5));
 let groundedApproach=0,airBeforeLip=0,additionalAir=0,maxDelta=0,
  firstCausal=null,matchedCount=0,firstDifference=null;
 for(let i=1;i<=9/DT;i++){
  tick(solid);tick(cut);
  const a=solid.r,b=cut.r,p=project(line,a.p),q=project(line,b.p);
  if(p.dist<25&&q.dist<25&&a.status==='running'&&b.status==='running'){
   if(p.u>=gap.uTakeoff-.025&&p.u<gap.uTakeoff-.005){
    if(a.grounded&&b.grounded)groundedApproach++;
    if(!a.grounded||!b.grounded)airBeforeLip++;
   }
   if(p.u>=gap.uTakeoff-.03&&p.u<=gap.uLanding+.10){
    matchedCount++;
    const d=Math.hypot(...a.p.map((x,j)=>x-b.p[j]));
    maxDelta=Math.max(maxDelta,d);
    if(!firstDifference&&(d>.01||a.grounded!==b.grounded))
     firstDifference={t:round(b.time,5),u:round(p.u,6),dist:round(d,6)};
    if(a.grounded&&!b.grounded){
     additionalAir++;
     if(!firstCausal)firstCausal={t:round(b.time,5),u:round(p.u,6)};
    }
   }
  }
  if(b.status==='running'&&q.dist<28){
   if(q.u>=gap.uTakeoff&&q.u<=gap.uLanding+.12&&!b.grounded&&!cut.firstAir)
    cut.firstAir={t:round(b.time,5),u:round(q.u,6),speed:round(Math.hypot(...b.v),2)};
   if(cut.firstAir&&!cut.rejoin&&b.grounded&&b.surface===doc.surfaces[0].id&&
      q.u>gap.uLanding)
    cut.rejoin={t:round(b.time,5),u:round(q.u,6),speed:round(Math.hypot(...b.v),2)};
   if(q.u>=gap.uLanding&&q.u<.91){
    cut.minSpeed=Math.min(cut.minSpeed,Math.hypot(...b.v));
    if(b.grounded)cut.groundAtExit++;
   }
  }
  if(['failed','finished'].includes(a.status)&&['failed','finished'].includes(b.status))break;
 }
 const min=Number.isFinite(cut.minSpeed)?round(cut.minSpeed,2):null;
 return {alpha,realWidthMeters:gap.lipWidthMeters,realGapMeters:gap.gapMeters,
  groundedApproach,airBeforeLip,additionalGapAirTicks:additionalAir,
  maxPositionDeltaMeters:round(maxDelta,4),firstCausal,firstDifference,
  rejoin:cut.rejoin,minPostGapSpeedMps:min,groundedAfterGapTicks:cut.groundAtExit,
  cutStatusAt9s:cut.r.status,solidStatusAt9s:solid.r.status,
  prior9SecondScreenNotFullRun:true,
  recommendFullRun:groundedApproach>=5&&airBeforeLip<=3&&
    additionalAir>=4&&maxDelta>=.5&&Boolean(cut.rejoin)&&
    (cut.rejoin.t<7.7)&&min!==null&&min>=65&&cut.r.status!=='failed',
  humanFairness:'HOLD',officialSlope2Meters:0};
}
export function g4e7wTakeoffBlendScreen(){
 const results=W_BLEND_LEVELS.map(check);
 return {schema:'dopagaki.g4e7w-blended-true-gap-causal/1',hz:1/DT,start00:true,
  screenSeconds:9,results,
  shortlisted:results.filter(x=>x.recommendFullRun).map(x=>x.alpha),
  allMustBeCheckedFullLengthSeparately:true,officialSlope2Meters:0,
  release:'HOLD',humanFairness:'HOLD'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const r=g4e7wTakeoffBlendScreen();
 if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(r,null,2)+'\n');
 console.log('G4E7W_BLEND '+JSON.stringify(r.results));
}

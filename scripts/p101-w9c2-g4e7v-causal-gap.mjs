/**
 * G4E-7V G: selected SLOPE6 / EXIT6 actual 240Hz physics gap causality.
 * Isolated copy with IDENTICAL actual B48 control points, just one missing
 * longitudinal collision strip [53] vs no missing strip. No style/engine edits.
 */
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {generateG4E7VExit} from './p101-w9c2-g4e7v-exit-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {sample} from '../private/reference_only/director/surface.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const dot=(a,b)=>a.reduce((v,x,i)=>v+x*b[i],0),
 dist=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i])),
 f=(x,n=4)=>Number(x.toFixed(n));
function near(points,p){
 let min=Infinity,u=0;
 for(let i=0;i<points.length-1;i++){
  const a=points[i],d=a.map((x,k)=>points[i+1][k]-x),v=p.map((x,k)=>x-a[k]),
   k=Math.min(1,Math.max(0,dot(d,v)/(dot(d,d)||1))),dd=Math.hypot(...v.map((x,j)=>x-k*d[j]));
  if(dd<min){min=dd;u=(i+k)/(points.length-1);}
 }
 return {u,distance:min};
}
function create(name,cut){
 const doc=generateG4E7VExit(name),realGap=doc.stageForge.g4e7uStudy.gap;
 if(!cut)delete doc.surfaces[0].voidLongitudinalCells;
 const r=new Runner(doc,compile(doc),0,52);
 return {doc,r,plan:makeP96RoutePlan(doc,r),surge:createA13SurgeState(),
  nearGapTicks:0,startedAirBeforeLipTicks:0,
  roadIds:new Set(),gap:realGap,
  airFirst:null,rejoin:null,maxSpeed:52};
}
export function g4e7vGapCause(){
 const comparisons=[];
 for(const name of ['original','exit6','slope6']){
  const solid=create(name,false),gap=create(name,true);
  if(JSON.stringify(solid.doc.surfaces.map(x=>x.points))!==
      JSON.stringify(gap.doc.surfaces.map(x=>x.points))||
    JSON.stringify(solid.doc.movingObstacles)!==
      JSON.stringify(gap.doc.movingObstacles))
   throw Error('Causal experiment requires matching physical 13m B48 and 28 machines');
  const line=Array.from({length:193},(_,i)=>sample(gap.doc.surfaces[0],i/192,.5));
  let bothRunning=0,solidGroundGapAir=0,solidAirGapGround=0,
   preLipBothAir=0,preLipGapAir=0,nearGapComparisons=0,maxDelta=0,
   firstDivergence=null,atLipSolid=null,atLipGap=null;
  for(let tick=1;tick<=70/DT;tick++){
   for(const s of [solid,gap]){
    const r=s.r;if(!['ready','running'].includes(r.status))continue;
    const input=p96DodgeSteer(r,s.plan,'early-soft',movingObstaclePose).input/4.8;
    p101Step(r,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,s.surge),collisionRecovery:false});
    s.maxSpeed=Math.max(s.maxSpeed,Math.hypot(...r.v));
    if(r.surface)s.roadIds.add(r.surface);
    const p=near(line,r.p),g=s.gap;
    if(p.distance<28&&p.u>=g.uTakeoff-.02&&p.u<=g.uTakeoff&&!r.grounded)
     s.startedAirBeforeLipTicks++;
    if(p.distance<28&&p.u>=g.uTakeoff&&p.u<=g.uLanding&&!r.grounded)
     s.nearGapTicks++;
    if(!s.airFirst&&!r.grounded&&p.distance<28&&p.u>=g.uTakeoff-.008)
     s.airFirst={time:f(r.time,5),u:f(p.u,6),speed:f(Math.hypot(...r.v),2)};
    if(s.airFirst&&!s.rejoin&&r.grounded&&r.surface===s.doc.surfaces[0].id&&
       p.u>g.uLanding&&p.distance<28)
     s.rejoin={time:f(r.time,5),u:f(p.u,6),speed:f(Math.hypot(...r.v),2)};
   }
   if(solid.r.status==='running'&&gap.r.status==='running'){
    bothRunning++;
    const p=near(line,solid.r.p);
    if(p.distance<28&&p.u>=gap.gap.uTakeoff-.03&&p.u<=gap.gap.uLanding+.11){
     nearGapComparisons++;
     const d=dist(solid.r.p,gap.r.p);maxDelta=Math.max(maxDelta,d);
     if(solid.r.grounded&&!gap.r.grounded)solidGroundGapAir++;
     if(!solid.r.grounded&&gap.r.grounded)solidAirGapGround++;
     if(!solid.r.grounded&&!gap.r.grounded&&p.u<gap.gap.uTakeoff)
      preLipBothAir++;
     if(!gap.r.grounded&&p.u<gap.gap.uTakeoff)preLipGapAir++;
     if(!firstDivergence&&(d>.01||solid.r.grounded!==gap.r.grounded))
      firstDivergence={time:f(gap.r.time,5),u:f(p.u,6),meters:f(d,6),
       solidGrounded:solid.r.grounded,gapGrounded:gap.r.grounded};
    }
   }
   if(['finished','failed'].includes(solid.r.status)&&
     ['finished','failed'].includes(gap.r.status))break;
  }
  comparisons.push({variant:name,firstB48GapCell:53,gapMeters:gap.gap.gapMeters,
   samePhysicalRoadSkin:true,originalMovingMachines:28,actualRoads:7,
   controlled240Hz:1/DT,firstDivergence,nearGapComparedTicks:nearGapComparisons,
   solidGroundGapAirTicks:solidGroundGapAir,solidAirGapGroundTicks:solidAirGapGround,
   preLipBothAirTicks:preLipBothAir,preLipGapAirTicks:preLipGapAir,
   maxPositionDeltaMeters:f(maxDelta,5),
   genuineAdditionalGapAirObserved:solidGroundGapAir>0,
   intactRoad:{status:solid.r.status,time:f(solid.r.time),roads:solid.roadIds.size,
     preLipAirTicks:solid.startedAirBeforeLipTicks,
     gapAirTicks:solid.nearGapTicks,rejoin:solid.rejoin,peak:f(solid.maxSpeed,2)},
   realGap:{status:gap.r.status,time:f(gap.r.time),roads:gap.roadIds.size,
     preLipAirTicks:gap.startedAirBeforeLipTicks,
     gapAirTicks:gap.nearGapTicks,rejoin:gap.rejoin,peak:f(gap.maxSpeed,2)},
   humanFairness:'HOLD'});
 }
 return {schema:'dopagaki.g4e7v-240hz-causal-B48-cut-vs-solid/1',
  start00:true,startSpeedMps:52,physicsHz:1/DT,
  input:'P96_NONHUMAN_DIV4_8',
  comparisons,officialSlope2Meters:0,publication:'HOLD'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const d=g4e7vGapCause();
 if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(d,null,2)+'\n');
 console.log('G4E7V_CAUSAL '+JSON.stringify(d.comparisons));
}

/**
 * G4E-7AH — complete original start00 240Hz game physics on the 15.76m
 * true grounded gap. Paired no-cut road uses IDENTICAL physical control
 * skin at each alpha. Never certify from nonhuman P96 full-course success.
 */
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {generateG4E7AH} from './p101-w9c2-g4e7ah-narrow-real-b48.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {sample} from '../private/reference_only/director/surface.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const f=(x,n=4)=>Number(x.toFixed(n)),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
function project(line,p){
 let best={dist:Infinity,u:0};
 for(let i=0;i<line.length-1;i++){
  const a=line[i],v=a.map((x,k)=>line[i+1][k]-x),d=p.map((x,k)=>x-a[k]),
   u=Math.max(0,Math.min(1,dot(d,v)/(dot(v,v)||1))),
   dist=Math.hypot(...d.map((x,k)=>x-u*v[k]));
  if(dist<best.dist)best={dist,u:(i+u)/(line.length-1)};
 }
 return best;
}
function full(variant,hasGap){
 const doc=generateG4E7AH(variant),gap=doc.stageForge.g4e7ahStudy.gap;
 if(!hasGap)delete doc.surfaces[0].voidLongitudinalCells;
 const runner=new Runner(doc,compile(doc),0,52),
  plan=makeP96RoutePlan(doc,runner),surge=createA13SurgeState(),
  line=Array.from({length:129},(_,i)=>sample(doc.surfaces[0],i/128,.5));
 let firstAir=null,firstRejoin=null,minAfter=Infinity,
  peak=52,largestShock=null,actualLandingSurface=null;
 const seen=new Set(),order=[],events={moving:0,fatalStatic:0,air:0};
 for(let i=1;i<=70/DT&&['running','ready'].includes(runner.status);i++){
  const before=Math.hypot(...runner.v),collisions=runner.collisions,
   evIndex=runner.events.length,
   input=p96DodgeSteer(runner,plan,'early-soft',movingObstaclePose).input/4.8;
  p101Step(runner,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(runner,surge),collisionRecovery:false});
  const sp=Math.hypot(...runner.v),p=project(line,runner.p);
  peak=Math.max(peak,sp);
  if(runner.surface&&!seen.has(runner.surface)){seen.add(runner.surface);order.push(runner.surface);}
  for(const e of runner.events.slice(evIndex)){
   if(e.type==='moving-contact')events.moving++;
   if(e.type==='static-fatal-contact')events.fatalStatic++;
   if(e.type==='air')events.air++;
  }
  if(p.dist<32){
   if(!runner.grounded&&p.u>=gap.uTakeoff-.004&&p.u<=gap.uLanding+.12&&!firstAir)
    firstAir={time:f(runner.time,5),u:f(p.u,6),speed:f(sp,2)};
   if(firstAir&&!firstRejoin&&p.u>gap.uLanding&&runner.grounded&&
      runner.surface===doc.surfaces[0].id)
    firstRejoin={time:f(runner.time,5),u:f(p.u,6),speed:f(sp,2)};
   if(p.u>=gap.uLanding&&p.u<.89){
    minAfter=Math.min(minAfter,sp);
    const drop=before-sp;
    if(!largestShock||drop>largestShock.lossMps)
     largestShock={time:f(runner.time,5),u:f(p.u,6),
      before:f(before,3),after:f(sp,3),lossMps:f(drop,3),
      newContacts:runner.collisions-collisions};
   }
  }
 }
 const roads=doc.surfaces.map(s=>s.id),
  sevenInOrder=roads.every((id,i)=>seen.has(id)&&(i===0||order.indexOf(roads[i-1])<order.indexOf(id))),
  finished=runner.status==='finished'&&!runner.failure&&sevenInOrder;
 return {variant,realGap:hasGap,realLipWidthMeters:gap.lipWidthMeters,
  minimumRealRoadWidthMeters:doc.stageForge.g4e7ahStudy.widthMinMeters,
  gapLengthMeters:hasGap?gap.gapMeters:0,
  visitedRoads:order.length,sevenRoadsInOrder:sevenInOrder,
  status:runner.status,finished,timeSeconds:f(runner.time),
  peakSpeedMps:f(peak,2),firstGapAir:firstAir,firstB48Rejoin:firstRejoin,
  minimumPostGapSpeed:Number.isFinite(minAfter)?f(minAfter,2):null,
  maxSingleStepShockNearGap:largestShock,events,failure:runner.failure??null,
  longGapHumanFairness:'UNTESTED',public:'HOLD',
  certifiedSlope2Meters:0};
}
export function g4e7ahFullMatrix(){
 const pairs=['true-pinch','pinch-switch'].map(variant=>{
  const intact=full(variant,false),cut=full(variant,true);
  return {variant,originalPhysicalB48IdenticalExceptHole:true,
   fullRoadCut:cut,fullRoadIntact:intact,
   trueGapChangedOutcome:Math.abs(cut.timeSeconds-intact.timeSeconds)>.0001||
    cut.status!==intact.status,
   candidateForHumanReview:cut.finished&&Boolean(cut.firstB48Rejoin)&&
    cut.minimumPostGapSpeed!==null&&cut.minimumPostGapSpeed>=70&&
    cut.timeSeconds<60,
   automaticSuccessNeverSufficient:true};
 });
 return {schema:'dopagaki.g4e7ac-r2-macro-preserved-lip-full-240hz/1',hz:1/DT,start00:true,
  startSpeedMps:52,source:'G4E7AC_R2_APPROACH_ARC_FROZEN_JUMP',realRoads:7,originalMovingB51C:28,
  nonhumanSteer:'P96_EARLY_SOFT_DIV4_8',
  pairs,formalSlope2Meters:0,publication:'HOLD',humanFairness:'HOLD'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const x=g4e7ahFullMatrix();
 if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(x,null,2)+'\n');
 console.log('G4E7AH_BLENDED_FULL '+JSON.stringify(x.pairs.map(({variant,fullRoadCut,fullRoadIntact,candidateForHumanReview})=>({
  variant,control:{status:fullRoadIntact.status,sec:fullRoadIntact.timeSeconds},
  cut:{status:fullRoadCut.status,sec:fullRoadCut.timeSeconds,
   roads:fullRoadCut.visitedRoads,rejoin:fullRoadCut.firstB48Rejoin,
   minSpeed:fullRoadCut.minimumPostGapSpeed,shock:fullRoadCut.maxSingleStepShockNearGap,
   failure:fullRoadCut.failure?.reason??null},
  physicsEligible: candidateForHumanReview}))));
}

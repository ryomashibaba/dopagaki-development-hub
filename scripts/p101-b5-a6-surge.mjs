/**
 * B5 A6 genuine high-speed positive thrust ONLY AFTER proven 180° lower
 * reversal traversal. Retains B5 7.28km physical road with real -155m
 * drop, native B48 240Hz and all original B51-C moving hazards.
 * No caps, brakes, teleports, unsupported rails, or steering weakening.
 */
import {generateP101B5Speedway} from './p101-b5-speedway-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step,p101RoadProgress} from '../web/p101-overdrive.mjs';

const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const smooth=n=>{let u=clamp(n,0,1);return u*u*(3-2*u);};
export const P101_B5_A6_CASES=Object.freeze([
 {afterSection:4,extra:.00}, // bit-exact A4 baseline 194.52m/s
 {afterSection:4,extra:.05},
 {afterSection:4,extra:.09},
 {afterSection:4,extra:.13},
 {afterSection:5,extra:.07},
 {afterSection:5,extra:.11},
 {afterSection:5,extra:.16}
]);
export function p101B5AfterTurnSurge({maxSeconds=73}={}){
 if(!Number.isFinite(maxSeconds)||maxSeconds<54||maxSeconds>95)throw Error('B5 A6 full 7/7 simulation horizon required');
 const doc=generateP101B5Speedway({lowerReversalLength:1800}),world=compile(doc),cases=[];
 for(const exp of P101_B5_A6_CASES){
  const r=new Runner(doc,world,0,44),plan=makeP96RoutePlan(doc,r),seen=new Set(),timeline=[];
  let peakSpeed=0,cruiseStage=0,cruiseU=0,firstAir=null,longestAir=0,airTime=0,energy=0;
  for(let i=0;i<Math.round(maxSeconds/DT)&&!['failed','finished'].includes(r.status);i++){
   const guide=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose);
   if(r.surface){
    const now=p101RoadProgress(r);
    cruiseStage=now.section;cruiseU=now.u;
   }
   const powerRamp=cruiseStage<exp.afterSection?0:cruiseStage>exp.afterSection?1:smooth(cruiseU/.45);
   const effectiveForward=.12+exp.extra*powerRamp;
   if(effectiveForward<.12||effectiveForward>.4)throw Error('B5 A6 changed physical boost out of positive-only range');
   p101Step(r,guide.input/4.8,'OVERDRIVE',{forwardScale:effectiveForward});
   if(r.surface){seen.add(r.surface);airTime=0;}
   else{
    if(firstAir===null)firstAir=r.time;
    airTime+=DT;longestAir=Math.max(longestAir,airTime);
   }
   const v=Math.hypot(...r.v);peakSpeed=Math.max(peakSpeed,v);
   if(i%480===0)timeline.push({t:+r.time.toFixed(2),speed:+v.toFixed(1),
    road:r.surface||'AIR',extraForward:+effectiveForward.toFixed(3)});
  }
  cases.push({
   afterSection:exp.afterSection,extra:exp.extra,
   physicsHz:1/DT,roadCount:seen.size,finished:r.status==='finished'&&seen.size===7&&!r.failure,
   seconds:+r.time.toFixed(3),maxSpeed:+peakSpeed.toFixed(2),
   firstAir:firstAir===null?null:+firstAir.toFixed(2),longestAir:+longestAir.toFixed(2),
   movingContacts:r.events.filter(e=>e.type==='moving-contact').length,
   failure:r.failure&&{time:+r.failure.t.toFixed(2),reason:r.failure.reason},
   tail:timeline.slice(-6)
  });
 }
 return cases;
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
 const arr=p101B5AfterTurnSurge();
 for(const result of arr)console.log('P101_B5_A6_SURGE '+JSON.stringify(result));
 console.log('P101_B5_A6_SUMMARY '+JSON.stringify({
  fastFinishes:arr.filter(a=>a.finished&&a.maxSpeed>=200).map(a=>({
   afterSection:a.afterSection,extra:a.extra,speed:a.maxSpeed,seconds:a.seconds
  })),
  allFinishes:arr.filter(a=>a.finished).map(a=>({afterSection:a.afterSection,extra:a.extra,speed:a.maxSpeed})),
  humanManualFairness:'NOT_RUN',status:'PR_DRAFT_HOLD'}));
}

/**
 * P101 B5 A4 physically lengthen the *real* 155m-drop, opposed 180°
 * lower reversal. Larger arc length reduces both horizontal curvature
 * and vertical convex-downhill curvature WITHOUT sticky/magnetic physics.
 * Every candidate has 12 real B51-C machines, native CCD and 240 Hz.
 */
import {generateP101B5Speedway,measureP101B5Geometry} from './p101-b5-speedway-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
export const P101_B5_A4_LENGTHS=Object.freeze([1450,1650,1800,1950]);
export const P101_B5_A4_POWERS=Object.freeze([.12,.24,.32]);
export function p101B5LongDropSweep({maxSeconds=82}={}){
 if(!Number.isFinite(maxSeconds)||maxSeconds<30||maxSeconds>95)throw Error('Bounded native B5 long drop proof required');
 const results=[];
 for(const length of P101_B5_A4_LENGTHS){
  const doc=generateP101B5Speedway({lowerReversalLength:length}),world=compile(doc);
  const geometry=measureP101B5Geometry(doc);
  if(geometry.bounds.some(x=>Math.max(Math.abs(x.min),Math.abs(x.max))>=2000))
   throw Error('B5 long drop crosses hard B48 ±2000m coordinate limit at '+length);
  if(geometry.seams.some(s=>s.gap>3||s.cosine<.93))
   throw Error('B5 real surface arc seam no longer contiguous at '+length);
  for(const power of P101_B5_A4_POWERS){
   const r=new Runner(doc,world,0,44),plan=makeP96RoutePlan(doc,r),
    visited=new Set(),samples=[];
   let peak=0,airStart=null,airContinuous=0,maxAirContinuous=0,lastGround=null;
   for(let tick=0;tick<Math.round(maxSeconds/DT)&&!['failed','finished'].includes(r.status);tick++){
    const a=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose).input;
    p101Step(r,a/4.8,'OVERDRIVE',{forwardScale:power});
    if(r.surface){visited.add(r.surface);lastGround=r.surface;airContinuous=0;}
    else {
     if(airStart===null)airStart=r.time;
     airContinuous+=DT;maxAirContinuous=Math.max(maxAirContinuous,airContinuous);
    }
    const v=Math.hypot(...r.v);peak=Math.max(peak,v);
    if(tick%480===0)samples.push({t:+r.time.toFixed(2),v:+v.toFixed(1),surface:r.surface||'AIR'});
   }
   results.push({
    length,power,nominalStageLength:geometry.nominalLength,
    nativeHz:1/DT,finished:r.status==='finished'&&visited.size===7&&!r.failure,
    seconds:+r.time.toFixed(3),status:r.status,roads:visited.size,
    peakSpeed:+peak.toFixed(2),lastGround,firstAir:airStart===null?null:+airStart.toFixed(2),
    maxAirContinuous:+maxAirContinuous.toFixed(2),
    movingContacts:r.events.filter(e=>e.type==='moving-contact').length,
    failure:r.failure&&{reason:r.failure.reason,t:+r.failure.t.toFixed(2)},
    tail:samples.slice(-5)
   });
  }
 }
 return results;
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
 const cases=p101B5LongDropSweep();
 for(const c of cases)console.log('P101_B5_A4_LONG_DROP '+JSON.stringify(c));
 console.log('P101_B5_A4_SUMMARY '+JSON.stringify({
  actualFast7Of7:cases.filter(c=>c.finished&&c.peakSpeed>=200).map(c=>({length:c.length,power:c.power,speed:c.peakSpeed,time:c.seconds})),
  maxRoads:Math.max(...cases.map(c=>c.roads)),claims:'PHYSICAL_ONLY_HUMAN_UNVERIFIED_P100_UNTOUCHED',
  noUserDeployment:true
 }));
}

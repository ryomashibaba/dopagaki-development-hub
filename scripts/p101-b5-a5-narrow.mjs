/**
 * B5 A5 narrow true-native 200m/s crossing, after B5 A4 successful
 * 1800m-long real section-IV 155m descent finished 7/7 @194.52m/s.
 * No synthetic cap, forced braking, teleport, side-force reduction or
 * hidden collider. Narrow positive thrust samples only.
 */
import {generateP101B5Speedway,measureP101B5Geometry} from './p101-b5-speedway-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';

export const P101_B5_A5_POWERS=Object.freeze([.12,.125,.13,.135,.14,.15,.16,.18]);
export function p101B5NarrowPowerSweep({maxSeconds=72}={}){
 if(!Number.isFinite(maxSeconds)||maxSeconds<50||maxSeconds>95)throw Error('B5 A5 cannot shorten legitimate 7/7 native proof');
 const road=generateP101B5Speedway({lowerReversalLength:1800}),geom=measureP101B5Geometry(road),
  world=compile(road),results=[];
 if(geom.seams.some(s=>s.gap>1||s.cosine<.94)||
    geom.bounds.some(v=>Math.max(Math.abs(v.min),Math.abs(v.max))>=2000))
  throw Error('B5 A5 genuine authoring integrity violation');
 for(const power of P101_B5_A5_POWERS){
  const r=new Runner(road,world,0,44),plan=makeP96RoutePlan(road,r),visited=new Set(),trace=[];
  let max=0,firstAir=null,airDuration=0,longestAir=0;
  for(let tick=0;tick<Math.round(maxSeconds/DT)&&!['failed','finished'].includes(r.status);tick++){
   const steer=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose).input/4.8;
   p101Step(r,steer,'OVERDRIVE',{forwardScale:power});
   if(r.surface){visited.add(r.surface);airDuration=0;}
   else{
    if(firstAir===null)firstAir=r.time;
    airDuration+=DT;longestAir=Math.max(longestAir,airDuration);
   }
   max=Math.max(max,Math.hypot(...r.v));
   if(tick%480===0)trace.push({s:+r.time.toFixed(2),speed:+Math.hypot(...r.v).toFixed(1),surface:r.surface||'AIR'});
  }
  results.push({power,roadLength:geom.nominalLength,real240Hz:1/DT,roads:visited.size,
   status:r.status,finish:r.status==='finished'&&visited.size===7&&!r.failure,
   seconds:+r.time.toFixed(3),maxSpeed:+max.toFixed(2),
   firstAir:firstAir===null?null:+firstAir.toFixed(2),
   longestAir:+longestAir.toFixed(2),movingContacts:r.events.filter(x=>x.type==='moving-contact').length,
   failure:r.failure&&{time:+r.failure.t.toFixed(2),reason:r.failure.reason,xyz:r.failure.position.map(x=>+x.toFixed(1))},
   tail:trace.slice(-7)});
 }
 return results;
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
 const cases=p101B5NarrowPowerSweep();
 for(const x of cases)console.log('P101_B5_A5_NARROW '+JSON.stringify(x));
 console.log('P101_B5_A5_SUMMARY '+JSON.stringify({
  highSpeedFullFinishes:cases.filter(x=>x.finish&&x.maxSpeed>=200).map(x=>({power:x.power,maxSpeed:x.maxSpeed,seconds:x.seconds,air:x.longestAir})),
  allNative7Of7:cases.filter(x=>x.finish).map(x=>({power:x.power,maxSpeed:x.maxSpeed})),
  humanManualPlay:'NOT_RUN',status:'DRAFT_HOLD'}));
}

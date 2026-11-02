/**
 * B5 real high speed fine sweep. The original 240Hz native Runner owns
 * route contact and all twelve moving-obstacle collisions in every trial.
 * Never alters lateral player authority 4.8x / 6x, HUD, camera, velocity
 * state or B48 engine. A scaled QA steering input is NOT a player assist.
 */
import {generateP101B5Speedway} from './p101-b5-speedway-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';

export const P101_B5_SCALE_SAMPLES=Object.freeze([0,.08,.12,.18,.24,.32,.42]);
export function sweepP101B5Speed({maxSeconds=80}={}){
 if(!Number.isFinite(maxSeconds)||maxSeconds<20||maxSeconds>95)throw Error('P101 B5 speed sample needs bounded native seconds');
 const doc=generateP101B5Speedway(),world=compile(doc),out=[];
 for(const power of P101_B5_SCALE_SAMPLES){
  const r=new Runner(doc,world,0,44),route=makeP96RoutePlan(doc,r),seen=new Set(),timeline=[];
  let peak=0,firstAir=null,previousRoad=r.surface;
  for(let n=0;n<Math.round(maxSeconds/DT)&&!['failed','finished'].includes(r.status);n++){
   const input=p96DodgeSteer(r,route,'early-soft',movingObstaclePose).input;
   p101Step(r,input/4.8,'OVERDRIVE',{forwardScale:power});
   if(r.surface){seen.add(r.surface);previousRoad=r.surface;}
   else if(firstAir===null)firstAir=r.time;
   const v=Math.hypot(...r.v);peak=Math.max(peak,v);
   if(n%480===0)timeline.push({time:+r.time.toFixed(2),speed:+v.toFixed(2),surface:r.surface||'AIR'});
  }
  out.push({power,realNativePhysicsHz:1/DT,roads:seen.size,finished:r.status==='finished'&&seen.size===7&&!r.failure,
   status:r.status,seconds:+r.time.toFixed(3),peakSpeed:+peak.toFixed(2),lastRoad:previousRoad,
   movingContacts:r.events.filter(e=>e.type==='moving-contact').length,
   firstAir:firstAir===null?null:+firstAir.toFixed(2),
   failure:r.failure&&{reason:r.failure.reason,t:+r.failure.t.toFixed(2),position:r.failure.position.map(x=>+x.toFixed(1))},
   timeline});
 }
 return out;
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
 const cases=sweepP101B5Speed();
 for(const x of cases)console.log('P101_B5_SPEED_SWEEP '+JSON.stringify(x));
 console.log('P101_B5_SPEED_SUMMARY '+JSON.stringify({
  fastTrueFinishes:cases.filter(x=>x.finished&&x.peakSpeed>=200&&x.peakSpeed<=250).map(x=>({power:x.power,seconds:x.seconds,peak:x.peakSpeed})),
  anyFinishes:cases.filter(x=>x.finished).map(x=>({power:x.power,peak:x.peakSpeed})),
  accurateController:'SCRIPTED_QA_NOT_HUMAN_PROOF',status:'DRAFT_HOLD'}));
 if(cases.some(x=>!Number.isFinite(x.peakSpeed)||x.realNativePhysicsHz!==240))
  throw Error('Invalid B5 physical measurement');
}

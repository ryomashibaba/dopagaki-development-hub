/**
 * P101 B5 A3: separate insufficient *scripted* steering authority from
 * geometric/CCD speed constraints. Human 4.8x steering is always available.
 * This module does not change the live B48 player input implementation.
 */
import {generateP101B5Speedway} from './p101-b5-speedway-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';

export const P101_B5_STEER_CASES=Object.freeze([.16,.24,.32].flatMap(power=>
 [.26,.4,.55,.7].map(inputGain=>Object.freeze({power,inputGain}))));
export function p101B5SteeringSweep({maxSeconds=67}={}){
 if(!Number.isFinite(maxSeconds)||maxSeconds<25||maxSeconds>95)throw Error('B5 240Hz finite horizon required');
 const doc=generateP101B5Speedway(),world=compile(doc),res=[];
 for(const test of P101_B5_STEER_CASES){
  const r=new Runner(doc,world,0,44),plan=makeP96RoutePlan(doc,r),roads=new Set(),trace=[];
  let maxSpeed=0,firstAir=null,lastRoad=null;
  for(let i=0;i<Math.round(maxSeconds/DT)&&!['failed','finished'].includes(r.status);i++){
   const a=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose);
   p101Step(r,a.input*test.inputGain,'OVERDRIVE',{forwardScale:test.power});
   if(r.surface){lastRoad=r.surface;roads.add(r.surface);}
   else if(firstAir===null)firstAir=r.time;
   const s=Math.hypot(...r.v);maxSpeed=Math.max(maxSpeed,s);
   if(i%720===0)trace.push({t:+r.time.toFixed(2),v:+s.toFixed(1),road:r.surface||'AIR'});
  }
  res.push({
   power:test.power,steerInputGain:test.inputGain,nativeHz:1/DT,
   finish:r.status==='finished'&&roads.size===7&&!r.failure,roads:roads.size,
   seconds:+r.time.toFixed(3),status:r.status,
   peakSpeed:+maxSpeed.toFixed(2),lastRoad,firstAir:firstAir===null?null:+firstAir.toFixed(2),
   movingContacts:r.events.filter(e=>e.type==='moving-contact').length,
   failure:r.failure&&{reason:r.failure.reason,time:+r.failure.t.toFixed(2)},
   tail:trace.slice(-5)
  });
 }
 return res;
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
 const cases=p101B5SteeringSweep();
 for(const c of cases)console.log('P101_B5_STEERING_GRID '+JSON.stringify(c));
 console.log('P101_B5_STEERING_GRID_SUMMARY '+JSON.stringify({
  candidates:cases.length,finish:cases.filter(c=>c.finish).map(c=>({power:c.power,gain:c.steerInputGain,peakSpeed:c.peakSpeed,time:c.seconds})),
  bestRoads:Math.max(...cases.map(c=>c.roads)),humanHandling:'NOT_VERIFIED',
  completeHighSpeed:cases.some(c=>c.finish&&c.peakSpeed>=200&&c.peakSpeed<=250),
  status:'DRAFT_HOLD'}));
}

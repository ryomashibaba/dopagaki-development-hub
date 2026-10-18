/**
 * B3 P101 240Hz real late-surge trials. Input is scaled to match the proven
 * P100 early-soft controller, manual 4.8x input power remains unchanged.
 * Every trial uses 7 real B48 roads and original 12 B51-C machines.
 */
import {generateP101OverdriveCandidate} from './p101-overdrive-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step,P101_LATE_PLANS} from '../web/p101-overdrive.mjs';
export function p101LateSurgeTrial({limitSeconds=65}={}){
 if(!Number.isFinite(limitSeconds)||limitSeconds<20||limitSeconds>95)throw Error('P101 invalid native trial horizon');
 const course=generateP101OverdriveCandidate(),world=compile(course),results=[];
 for(const planName of Object.keys(P101_LATE_PLANS)){
  const r=new Runner(course,world,0,44),plan=makeP96RoutePlan(course,r),visited=new Set(),trace=[];
  let peak=0,latePeak=0;
  for(let i=0;i<Math.round(limitSeconds/DT)&&!['failed','finished'].includes(r.status);i++){
   const a=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose).input;
   p101Step(r,a/4.8,'OVERDRIVE',{lateSurge:planName});
   if(r.surface)visited.add(r.surface);
   const v=Math.hypot(...r.v);peak=Math.max(peak,v);
   if(visited.size>=5)latePeak=Math.max(latePeak,v);
   if(i%480===0)trace.push({t:+r.time.toFixed(2),speed:+v.toFixed(2),road:r.surface??'AIR'});
  }
  results.push({plan:planName,physicsHz:1/DT,status:r.status,finish:r.status==='finished'&&visited.size===7&&!r.failure,
    seconds:+r.time.toFixed(3),roadCount:visited.size,
    peakSpeed:+peak.toFixed(2),latePeakSpeed:+latePeak.toFixed(2),
    contacts:r.events.filter(e=>e.type==='moving-contact').map(e=>({id:e.id,mode:e.mode,time:+e.t.toFixed(2)})),
    failure:r.failure&&{time:+r.failure.t.toFixed(2),reason:r.failure.reason,road:r.failure.surface},
    traceTail:trace.slice(-8)});
 }
 return results;
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
 const attempts=p101LateSurgeTrial();
 for(const a of attempts)console.log('P101_LATE_SURGE '+JSON.stringify(a));
 console.log('P101_LATE_SUMMARY '+JSON.stringify({
  candidates:attempts.map(x=>x.plan),finishes:attempts.filter(x=>x.finish).map(x=>({plan:x.plan,seconds:x.seconds,peakSpeed:x.peakSpeed})),
  truth:'SCRIPTED_240HZ_ONLY_HUMAN_NOT_RUN_P100_IMMUTABLE',certification:'HOLD'}));
}

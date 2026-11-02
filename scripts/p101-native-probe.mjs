
/**
 * Independent P101 native full-road 240Hz B48/B51-C reconnaissance.
 * No scripted player input is evidence of human playability.
 */
import {generateP101OverdriveCandidate} from './p101-overdrive-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {P101_TUNINGS,p101Step} from '../web/p101-overdrive.mjs';

function lateralSpeed(r){
 const f=r.forward,n=r.normal;const right=[f[1]*n[2]-f[2]*n[1],
 f[2]*n[0]-f[0]*n[2],f[0]*n[1]-f[1]*n[0]];
 const z=Math.hypot(...right)||1;
 return Math.abs(right.reduce((a,b,i)=>a+b*r.v[i],0)/z);
}
export function trialP101({maxSeconds=55}={}){
 if(!Number.isFinite(maxSeconds)||maxSeconds<5||maxSeconds>95)throw Error('P101 bounded native sweep required');
 const course=generateP101OverdriveCandidate(),world=compile(course);
 return Object.keys(P101_TUNINGS).map(mode=>{
  const r=new Runner(course,world,0,44),plan=makeP96RoutePlan(course,r);
  const visited=new Set([r.surface]),trace=[],stations=new Set();
  let peakSpeed=0,peakSideSpeed=0;
  for(let i=0;i<Math.round(maxSeconds/DT)&&!['failed','finished'].includes(r.status);i++){
   const steer=p96DodgeSteer(r,plan,'near-soft',movingObstaclePose);
   if(steer.station)stations.add(steer.station);
   p101Step(r,steer.input,mode);
   if(r.surface)visited.add(r.surface);
   const speed=Math.hypot(...r.v);
   peakSpeed=Math.max(peakSpeed,speed);
   peakSideSpeed=Math.max(peakSideSpeed,lateralSpeed(r));
   if(i%240===0)trace.push({
    seconds:+r.time.toFixed(3),speed:+speed.toFixed(1),
    stage:r.surface||'AIR',input:+steer.input.toFixed(2),
    xyz:r.p.map(v=>+v.toFixed(1))
   });
  }
  const contacts=r.events.filter(e=>e.type==='moving-contact').length;
  const success=r.status==='finished'&&visited.size===7&&!r.failure;
  return {mode,status:r.status,finishProof:success,elapsed:+r.time.toFixed(3),
   roadCount:visited.size,visited:[...visited],obstaclesVisited:stations.size,
   peakSpeed:+peakSpeed.toFixed(2),peakSideSpeed:+peakSideSpeed.toFixed(2),
   movingContacts:contacts,failure:r.failure?{
    reason:r.failure.reason,time:+r.failure.t.toFixed(3),
    surface:r.failure.surface,position:r.failure.position.map(v=>+v.toFixed(1))
   }:null,trace,
   warning:'SCRIPTED_B48_240HZ_ONLY; HUMAN HANDLING, FAIRNESS_UNAPPROVED'};
 });
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
 const results=trialP101();
 for(const r of results)console.log('P101_NATIVE_'+r.mode+' '+JSON.stringify(r));
 console.log('P101_NATIVE_SUMMARY '+JSON.stringify({
  attemptedProfiles:results.map(x=>x.mode),fullFinishes:results.filter(x=>x.finishProof).map(x=>x.mode),
  highestObservedSpeed:Math.max(...results.map(x=>x.peakSpeed)),
  result:'EXPERIMENTAL_HOLD_HUMAN_UNTESTED',physicsHz:240
 }));
 if(results.length!==3||results.some(x=>!['running','failed','finished'].includes(x.status))||
    results.some(x=>!Number.isFinite(x.peakSpeed)))throw Error('P101 native probe integrity failed');
}

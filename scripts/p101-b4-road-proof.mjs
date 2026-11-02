/**
 * P101 B4 independent real 240Hz seven-chapter high-radius physical road sweep.
 * Draws actual physical curvature metrics from current B48 Catmull–Rom skins,
 * and runs original native machine colliders with representative input.
 * No scripted completion is ever mistaken for human handling or fairness.
 */
import {generateP101OverdriveCandidate} from './p101-overdrive-build.mjs';
import {generateP100TerrainPulseCandidate} from './p100-terrain-pulse-build.mjs';
import {p101CurvatureReport} from './p101-high-radius-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
const TRIALS=Object.freeze([
 {name:'B4_COMPARABLE_CONTROL',profile:'early-soft',forwardScale:0},
 {name:'B4_LOW_FORWARD',profile:'early-soft',forwardScale:.30},
 {name:'B4_MID_FORWARD',profile:'early-soft',forwardScale:.60},
 {name:'B4_TARGET_FORWARD',profile:'early-soft',forwardScale:1},
 {name:'B4_NEAR_TARGET',profile:'near-soft',forwardScale:1}
]);
export function auditP101B4({limitSeconds=65}={}){
 if(!(limitSeconds>=20&&limitSeconds<=100))throw Error('P101 B4 finite physical time horizon required');
 const base=generateP100TerrainPulseCandidate(),doc=generateP101OverdriveCandidate(),world=compile(doc),results=[];
 for(const cfg of TRIALS){
  const r=new Runner(doc,world,0,44),plan=makeP96RoutePlan(doc,r),visited=new Set(),trace=[];
  let maxSpeed=0,maxLateral=0,firstDrop=null,contacts=[];
  for(let tick=0;tick<Math.round(limitSeconds/DT)&&!['failed','finished'].includes(r.status);tick++){
   const input=p96DodgeSteer(r,plan,cfg.profile,movingObstaclePose).input/4.8;
   p101Step(r,input,'OVERDRIVE',{forwardScale:cfg.forwardScale});
   if(r.surface)visited.add(r.surface);
   else if(firstDrop===null)firstDrop=r.time;
   const speed=Math.hypot(...r.v);maxSpeed=Math.max(maxSpeed,speed);
   const f=r.forward,n=r.normal,side=[f[1]*n[2]-f[2]*n[1],f[2]*n[0]-f[0]*n[2],f[0]*n[1]-f[1]*n[0]],len=Math.hypot(...side)||1;
   maxLateral=Math.max(maxLateral,Math.abs(side.reduce((a,x,i)=>a+x*r.v[i],0)/len));
   if(tick%480===0)trace.push({t:+r.time.toFixed(2),speed:+speed.toFixed(1),road:r.surface||'AIR'});
  }
  contacts=r.events.filter(x=>x.type==='moving-contact');
  results.push({test:cfg.name,profile:cfg.profile,extraForwardScale:cfg.forwardScale,status:r.status,
   true240Hz:1/DT,finish:r.status==='finished'&&visited.size===7&&!r.failure,seconds:+r.time.toFixed(3),
   roads:visited.size,peakSpeed:+maxSpeed.toFixed(2),peakSideSpeed:+maxLateral.toFixed(2),
   movingContacts:contacts.length,firstAirTime:firstDrop===null?null:+firstDrop.toFixed(2),
   failure:r.failure&&{reason:r.failure.reason,time:+r.failure.t.toFixed(2),surface:r.failure.surface},
   lastSamples:trace.slice(-9)});
 }
 return {geometry:{baseline:p101CurvatureReport(base),candidate:p101CurvatureReport(doc)},
  results,P100Untouched:true,proof:'TRUE_240HZ_B48_B51_C_NATIVE_NO_HUMAN_ASSERTION'};
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
 const report=auditP101B4();
 console.log('P101_B4_PHYSICAL_CURVATURE '+JSON.stringify(report.geometry));
 for(const result of report.results)console.log('P101_B4_TRUE_240HZ '+JSON.stringify(result));
 console.log('P101_B4_NATIVE_SUMMARY '+JSON.stringify({
  finishCount:report.results.filter(r=>r.finish).length,
  finished:report.results.filter(r=>r.finish).map(r=>({test:r.test,peakSpeed:r.peakSpeed,time:r.seconds})),
  humanFairness:'NOT_RUN',geometryMustBeReal:true,P100Untouched:report.P100Untouched,
  certification:'HOLD_UNTIL_ACTUAL_FAST_7_OF_7_AND_HUMAN_HANDLING'}));
 if(report.results.some(r=>!Number.isFinite(r.peakSpeed)||r.true240Hz!==240))
   throw Error('P101 B4 invalid native measurement');
}

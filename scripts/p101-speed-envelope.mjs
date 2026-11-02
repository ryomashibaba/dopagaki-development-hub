/**
 * P101 B2: real 240Hz speed envelope to separate meaningful acceleration
 * from hairpin departure. The zero-extra-forward trial is a P100-comparable
 * CONTROL, NOT the proposed fast game. No hidden velocity clamps/brakes.
 * Human handling remains unverified.
 */
import {generateP101OverdriveCandidate} from './p101-overdrive-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step,p101Tune} from '../web/p101-overdrive.mjs';
const CASES=Object.freeze([
 {name:'control-near',steer:'near-soft',forwardScale:0},
 {name:'slow-near',steer:'near-soft',forwardScale:.30},
 {name:'medium-near',steer:'near-soft',forwardScale:.60},
 {name:'full-near',steer:'near-soft',forwardScale:1},
 {name:'control-early',steer:'early-soft',forwardScale:0},
 {name:'medium-early',steer:'early-soft',forwardScale:.60}
]);
export function p101SpeedEnvelope({limitSeconds=65}={}){
 if(!Number.isFinite(limitSeconds)||limitSeconds<20||limitSeconds>95)throw Error('Invalid P101 envelope horizon');
 const doc=generateP101OverdriveCandidate(),world=compile(doc),cases=[];
 for(const setting of CASES){
  const r=new Runner(doc,world,0,44),plan=makeP96RoutePlan(doc,r);
  const multiplier=p101Tune('OVERDRIVE').groundMultiplier,seen=new Set(),timeline=[];
  let peak=0,lastGround=0,firstAir=null,maxLateral=0;
  for(let tick=0;tick<Math.round(limitSeconds/DT)&&!['failed','finished'].includes(r.status);tick++){
   // P100-comparable scaled standard controller: higher manual authority does
   // NOT imply a permanently 4.8x stronger automatic correction.
   const ctrl=p96DodgeSteer(r,plan,setting.steer,movingObstaclePose).input;
   p101Step(r,ctrl/multiplier,'OVERDRIVE',{forwardScale:setting.forwardScale});
   if(r.surface){seen.add(r.surface);lastGround=r.time;}
   else if(firstAir===null)firstAir=r.time;
   const speed=Math.hypot(...r.v);peak=Math.max(peak,speed);
   const f=r.forward,n=r.normal,side=[f[1]*n[2]-f[2]*n[1],f[2]*n[0]-f[0]*n[2],f[0]*n[1]-f[1]*n[0]];
   const mag=Math.hypot(...side)||1;
   maxLateral=Math.max(maxLateral,Math.abs(side.reduce((a,x,i)=>a+x*r.v[i],0)/mag));
   if(tick%480===0)timeline.push({time:+r.time.toFixed(2),speed:+speed.toFixed(1),ground:r.surface||'AIR'});
  }
  cases.push({name:setting.name,profile:setting.steer,forwardScale:setting.forwardScale,
   seconds:+r.time.toFixed(3),status:r.status,finish:r.status==='finished'&&seen.size===7&&!r.failure,
   roadCount:seen.size,lastGroundTime:+lastGround.toFixed(2),firstAirTime:firstAir===null?null:+firstAir.toFixed(2),
   peakSpeed:+peak.toFixed(2),peakSide:+maxLateral.toFixed(2),movingContacts:r.events.filter(e=>e.type==='moving-contact').length,
   failure:r.failure?{reason:r.failure.reason,surface:r.failure.surface,time:+r.failure.t.toFixed(2)}:null,timeline});
 }
 return cases;
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
 const cases=p101SpeedEnvelope();
 for(const a of cases)console.log('P101_SPEED_ENVELOPE '+JSON.stringify(a));
 console.log('P101_SPEED_ENVELOPE_SUMMARY '+JSON.stringify({zeroExtra:cases.filter(x=>x.forwardScale===0).map(x=>({name:x.name,finish:x.finish,roads:x.roadCount})),
  finished:cases.filter(x=>x.finish).map(x=>({name:x.name,peakSpeed:x.peakSpeed,seconds:x.seconds})),
  untouchedP100:true,human:'NOT_RUN',promise:'No tuning adopted on scripted evidence alone'}));
}

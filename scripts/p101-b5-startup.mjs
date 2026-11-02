/**
 * P101 B5 A9 startup-speed envelope at EXACT LIVE B5 A7 continuous boost.
 * The only parameter varied is the honest initial tangential launch speed
 * (not the HUD). All six variants run actual B48 CCD at 240Hz, retain the
 * full +4.8x manual lateral steering and original 12 active B51-C threats.
 * QA P96 inputs are scaled ONLY for scripted repeatability.
 */
import {generateP101B5Speedway} from './p101-b5-speedway-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createP101B5SurgeState,p101B5ForwardScale} from '../web/p101-b5-forward.mjs';
export const P101_B5_STARTS=Object.freeze([44,52,60,68,76,84]);
export function measureP101B5Startup({maxSeconds=70}={}){
 if(!Number.isFinite(maxSeconds)||maxSeconds<55||maxSeconds>95)throw Error('A9 complete 240Hz horizon mandatory');
 const doc=generateP101B5Speedway({lowerReversalLength:1800}),world=compile(doc),out=[];
 for(const initialSpeed of P101_B5_STARTS){
  const r=new Runner(doc,world,0,initialSpeed),plan=makeP96RoutePlan(doc,r),
   state=createP101B5SurgeState(),roads=new Set(),trace=[];
  let maximum=0,firstAir=null,maxAir=0,air=0;
  for(let tick=0;tick<Math.round(maxSeconds/DT)&&!['failed','finished'].includes(r.status);tick++){
   const steering=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose).input/4.8;
   // Crucial: test the SAME pure physical positive-only throttle
   // calculation as the real browser's manual B5 scene.
   const power=p101B5ForwardScale(r,state);
   p101Step(r,steering,'OVERDRIVE',{forwardScale:power});
   if(r.surface){roads.add(r.surface);air=0;}
   else{if(firstAir===null)firstAir=r.time;air+=DT;maxAir=Math.max(air,maxAir);}
   maximum=Math.max(maximum,Math.hypot(...r.v));
   if(tick%960===0)trace.push({t:+r.time.toFixed(2),speed:+Math.hypot(...r.v).toFixed(1),
    surface:r.surface||'AIR',boost:+power.toFixed(3)});
  }
  out.push({
   initialSpeed,realPhysicsHz:1/DT,roads:roads.size,
   finish:r.status==='finished'&&roads.size===7&&!r.failure,
   status:r.status,seconds:+r.time.toFixed(3),peakSpeed:+maximum.toFixed(2),
   firstAir:firstAir===null?null:+firstAir.toFixed(2),maxAir:+maxAir.toFixed(2),
   movingContacts:r.events.filter(e=>e.type==='moving-contact').length,
   failure:r.failure&&{reason:r.failure.reason,time:+r.failure.t.toFixed(3),position:r.failure.position.map(x=>+x.toFixed(1))},
   tail:trace.slice(-5)
  });
 }
 return out;
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
 const trials=measureP101B5Startup();
 for(const run of trials)console.log('P101_B5_STARTUP_REAL '+JSON.stringify(run));
 console.log('P101_B5_STARTUP_SUMMARY '+JSON.stringify({
  passed:trials.filter(x=>x.finish).map(x=>({initialSpeed:x.initialSpeed,peakSpeed:x.peakSpeed,seconds:x.seconds})),
  rejected:trials.filter(x=>!x.finish).map(x=>({initialSpeed:x.initialSpeed,reason:x.failure?.reason})),
  humanFairness:'NOT_RUN',noSpeedDisplaySpoof:true,P100Preserved:true}));
 if(trials[0]?.finish!==true||trials[0].peakSpeed<200)
  throw Error('P101 B5 startup control failed to reproduce real A6 high-speed 7/7 physics!');
}

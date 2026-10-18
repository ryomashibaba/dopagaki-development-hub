/**
 * P101 B5 speedway: real native 240Hz B48+B51-C sweep, not spectator/demo.
 * No checkpoint, teleport, forced speed, disabled collider or impossible
 * scripted winning path. Logs ALL falls/hits honestly. Defaults are bounded.
 */
import {generateP101B5Speedway,measureP101B5Geometry} from './p101-b5-speedway-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';

const TRIALS=Object.freeze([
 {name:'B5_CONTROL_44',steer:'early-soft',start:44,forwardScale:0},
 {name:'B5_FAST_44',steer:'early-soft',start:44,forwardScale:1},
 {name:'B5_MEDIUM_44',steer:'early-soft',start:44,forwardScale:.6},
 {name:'B5_NEAR_44',steer:'near-soft',start:44,forwardScale:1},
 {name:'B5_FAST_85',steer:'early-soft',start:85,forwardScale:1}
]);
export function p101B5NativeRuns({maxSeconds=80}={}){
 if(!Number.isFinite(maxSeconds)||maxSeconds<20||maxSeconds>95)throw Error('P101 B5 bounded true native 240Hz required');
 const doc=generateP101B5Speedway(),world=compile(doc),geom=measureP101B5Geometry(doc);
 const cases=[];
 for(const variant of TRIALS){
  const r=new Runner(doc,world,0,variant.start),plan=makeP96RoutePlan(doc,r),
   visited=new Set(),records=[];
  let peak=0,firstAir=null,lastGround=null,contacts=0;
  for(let tick=0;tick<Math.round(maxSeconds/DT)&&!['failed','finished'].includes(r.status);tick++){
   const guide=p96DodgeSteer(r,plan,variant.steer,movingObstaclePose);
   // Auto test controller compensates for 4.8x manual gain, never changes
   // human's real 4.8x input authority.
   p101Step(r,guide.input/4.8,'OVERDRIVE',{forwardScale:variant.forwardScale});
   if(r.surface){visited.add(r.surface);lastGround=r.surface;}
   else if(firstAir===null)firstAir=r.time;
   const speed=Math.hypot(...r.v);peak=Math.max(peak,speed);
   if(tick%480===0)records.push({t:+r.time.toFixed(2),v:+speed.toFixed(1),road:r.surface||'AIR'});
  }
  contacts=r.events.filter(x=>x.type==='moving-contact').length;
  cases.push({name:variant.name,initialSpeed:variant.start,forwardScale:variant.forwardScale,
   status:r.status,finished:r.status==='finished'&&visited.size===7&&!r.failure,
   roadCount:visited.size,seconds:+r.time.toFixed(3),peakSpeed:+peak.toFixed(2),
   firstAir:firstAir===null?null:+firstAir.toFixed(2),lastGround,movingContacts:contacts,
   failure:r.failure?{reason:r.failure.reason,t:+r.failure.t.toFixed(3),xyz:r.failure.position.map(x=>+x.toFixed(1))}:null,
   trace:records});
 }
 return {geometry:geom,cases,integrity:'FULL_240HZ_NATIVE_B48_B51C_P101_B5_HUMAN_HOLD'};
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
 const report=p101B5NativeRuns();
 console.log('P101_B5_GEOMETRY '+JSON.stringify(report.geometry));
 for(const a of report.cases)console.log('P101_B5_PHYSICAL '+JSON.stringify(a));
 console.log('P101_B5_SUMMARY '+JSON.stringify({
  verifiedFastFinishes:report.cases.filter(x=>x.finished&&x.peakSpeed>=200).map(x=>({name:x.name,peak:x.peakSpeed,time:x.seconds})),
  anyRealFinishes:report.cases.filter(x=>x.finished).map(x=>x.name),
  userHandling:'UNTESTED',status:'DRAFT_HOLD_UNLESS_INDEPENDENTLY_CERTIFIED'}));
 if(report.geometry.bounds.some(a=>Math.max(Math.abs(a.min),Math.abs(a.max))>=2000))
  throw Error('P101 B5 exceeds authored B48 2000m geometry bounds');
 if(report.geometry.seams.some(x=>x.gap>3||x.cosine<.93))
  throw Error('P101 B5 true physical seam discontinuity');
}

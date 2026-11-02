/**
 * P101 B4D causality isolation on true original B48/B51-C physical roads.
 * Eight variants change only named sections; no fake road/velocity/CCD bypass.
 * The zero-weight branch uses EXACT P100 road AND machine definitions.
 */
import {generateP101OverdriveCandidate} from './p101-overdrive-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
const ZERO=[0,0,0,0,0,0,0];
export const P101_B4_ISOLATION=Object.freeze([
 {id:'CONTROL_TRUE_P100',weights:ZERO},
 {id:'II_TINY',weights:[0,.15,0,0,0,0,0]},
 {id:'II_SMALL',weights:[0,.3,0,0,0,0,0]},
 {id:'II_MEDIUM',weights:[0,.5,0,0,0,0,0]},
 {id:'II_ORIGINAL_B4C',weights:[0,1,0,0,0,0,0]},
 {id:'LATE_ONLY',weights:[0,0,0,0,.25,.25,.25]},
 {id:'EARLY_GENTLE',weights:[0,.15,.15,.15,0,0,0]},
 {id:'HYBRID_GENTLE',weights:[0,.15,.15,.15,.25,.25,.25]}
]);
export function isolateB4D({maxSeconds=65}={}){
 if(!Number.isFinite(maxSeconds)||maxSeconds<20||maxSeconds>95)throw Error('P101 B4D bounded 240Hz physical horizon');
 const out=[];
 for(const config of P101_B4_ISOLATION){
  const doc=generateP101OverdriveCandidate({radiusWeights:config.weights}),world=compile(doc);
  const runner=new Runner(doc,world,0,44),plan=makeP96RoutePlan(doc,runner);
  let topSpeed=0,lastGround='none',firstAir=null;const sections=new Set(),trace=[];
  for(let tick=0;tick<Math.round(maxSeconds/DT)&&!['failed','finished'].includes(runner.status);tick++){
   const input=p96DodgeSteer(runner,plan,'early-soft',movingObstaclePose).input/4.8;
   p101Step(runner,input,'OVERDRIVE',{forwardScale:0}); // separate actual real road from positive speed-force question
   if(runner.surface){sections.add(runner.surface);lastGround=runner.surface;}
   else if(firstAir===null)firstAir=runner.time;
   topSpeed=Math.max(topSpeed,Math.hypot(...runner.v));
   if(tick%720===0)trace.push({t:+runner.time.toFixed(2),speed:+Math.hypot(...runner.v).toFixed(1),surface:runner.surface||'AIR'});
  }
  out.push({id:config.id,weights:config.weights,status:runner.status,
   finish:runner.status==='finished'&&sections.size===7&&!runner.failure,roads:sections.size,
   seconds:+runner.time.toFixed(3),topSpeed:+topSpeed.toFixed(2),lastGround,firstAir:firstAir===null?null:+firstAir.toFixed(2),
   contacts:runner.events.filter(x=>x.type==='moving-contact').length,
   failure:runner.failure?{reason:runner.failure.reason,time:+runner.failure.t.toFixed(2)}:null,
   traceTail:trace.slice(-6)});
 }
 return out;
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
 const data=isolateB4D();
 for(const a of data)console.log('P101_B4D_CAUSAL '+JSON.stringify(a));
 console.log('P101_B4D_SUMMARY '+JSON.stringify({
  passed:data.filter(x=>x.finish).map(x=>x.id),
  failed:data.filter(x=>!x.finish).map(x=>x.id),
  noPrematureStaging:true,scope:'ORIGINAL_B48_240HZ_NATIVE_CORRIDOR_TEST_HUMAN_HOLD'}));
}


/** P101 PR-only instrumented native 240Hz steering reconnaissance.
 * Distinguishes authentic extra lateral authority from auto-controller
 * oversteer. This does NOT change manual player steering or the frozen B48.
 */
import {generateP101OverdriveCandidate} from './p101-overdrive-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step,P101_TUNINGS} from '../web/p101-overdrive.mjs';

const strategies=Object.freeze([
 {mode:'OVERDRIVE',kind:'scaled-near',profile:'near-soft',scale:1/4.8},
 {mode:'OVERDRIVE',kind:'scaled-early',profile:'early-soft',scale:1/4.8},
 {mode:'OVERDRIVE',kind:'two-x-response',profile:'near-soft',scale:.42},
 {mode:'OVERDRIVE',kind:'long-lead',profile:{id:'p101-long-lead',leadMeters:350,laneMeters:24,offsetGain:.04},scale:.25},
 {mode:'RAPID',kind:'scaled-near',profile:'near-soft',scale:1/4},
 {mode:'HYPER',kind:'scaled-near',profile:'near-soft',scale:1/6}
]);
export function reconP101({limitSeconds=55}={}){
 const doc=generateP101OverdriveCandidate(),world=compile(doc),results=[];
 for(const s of strategies){
  const r=new Runner(doc,world,0,44),plan=makeP96RoutePlan(doc,r),visited=new Set(),trace=[];
  let maxSpeed=0;
  for(let t=0;t<limitSeconds/DT&&!['failed','finished'].includes(r.status);t++){
   const a=p96DodgeSteer(r,plan,s.profile,movingObstaclePose).input;
   p101Step(r,a*s.scale,s.mode);
   if(r.surface)visited.add(r.surface);
   maxSpeed=Math.max(maxSpeed,Math.hypot(...r.v));
   if(t%480===0)trace.push({t:+r.time.toFixed(2),speed:+Math.hypot(...r.v).toFixed(1),road:r.surface??'AIR',input:+(a*s.scale).toFixed(2)});
  }
  results.push({kind:s.kind,mode:s.mode,scale:s.scale,status:r.status,time:+r.time.toFixed(3),
   roadCount:visited.size,peakSpeed:+maxSpeed.toFixed(2),
   finish:r.status==='finished'&&visited.size===7&&!r.failure,
   failure:r.failure?.reason??null,traceTail:trace.slice(-8)});
 }
 return results;
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
 for(const x of reconP101())console.log('P101_STEERING_RECON '+JSON.stringify(x));
}

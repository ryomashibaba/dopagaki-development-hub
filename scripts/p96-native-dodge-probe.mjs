/**
 * P96 native actual B48/B51-C route test — no frame hacks/teleportation.
 * Every profile is deliberately deterministic, bounded and assessed on
 * literal contact + native FINISH; no green CI implies a completed course.
 */
import {generateVoidHazardCandidate} from './p95-void-hazard-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {P94_TRACK} from './p94-void-native-acceptance.mjs';
import {makeP96RoutePlan,p96DodgeSteer,P96_PROFILES} from './p96-avoidance-controller.mjs';

export function probeP96(profile,{doc=null,world=null,limitSeconds=90}={}){
 const course=doc??generateVoidHazardCandidate(),scene=world??compile(course);
 if(!Number.isFinite(limitSeconds)||limitSeconds<1||limitSeconds>100)throw Error('Unbounded P96 native probe');
 const rider=new Runner(course,scene,0,44),plan=makeP96RoutePlan(course,rider);
 const visited=new Set([rider.surface]),decisionStations=new Set(),samples=[],contacts=[];
 let peakSpeed=0,steeringFrames=0;
 for(let tick=0;tick<Math.round(limitSeconds/DT)&&!['failed','finished'].includes(rider.status);tick++){
  const choice=p96DodgeSteer(rider,plan,profile);
  if(choice.station)decisionStations.add(choice.station);
  if(Math.abs(choice.input)>.03)steeringFrames++;
  rider.step(choice.input);
  if(P94_TRACK.includes(rider.surface))visited.add(rider.surface);
  peakSpeed=Math.max(peakSpeed,Math.hypot(...rider.v));
  if(tick%240===0)samples.push({time:+rider.time.toFixed(2),road:rider.surface,
   xyz:rider.p.map(n=>+n.toFixed(1)),speed:+Math.hypot(...rider.v).toFixed(1),
   steer:+choice.input.toFixed(3),target:choice.station});
 }
 for(const e of rider.events.filter(x=>x.type==='moving-contact')){
  contacts.push({id:e.id,mode:e.mode,time:+e.t.toFixed(3),position:e.position.map(v=>+v.toFixed(2))});
 }
 const done=rider.status==='finished'&&P94_TRACK.every(x=>visited.has(x))&&
  rider.events.some(x=>x.type==='finish')&&!rider.failure;
 return {
  profile:typeof profile==='string'?profile:profile.id,
  status:done?'SCRIPTED_NATIVE_FULL_PASS':'HOLD_NOT_FULLY_TRAVERSED',
  stageId:course.stageForge.id,physicsHz:1/DT,elapsed:+rider.time.toFixed(3),
  visited:P94_TRACK.filter(x=>visited.has(x)),missing:P94_TRACK.filter(x=>!visited.has(x)),
  decisionStations:[...decisionStations],machineContacts:contacts,
  failure:rider.failure?{t:+rider.failure.t.toFixed(3),reason:rider.failure.reason,
   surface:rider.failure.surface,position:rider.failure.position.map(v=>+v.toFixed(2))}:null,
  peakSpeed:+peakSpeed.toFixed(2),steeringFrames,
  finishEvent:rider.events.some(x=>x.type==='finish'),
  lastRoad:rider.surface||rider.lastSurface,
  finalPosition:rider.p.map(v=>+v.toFixed(2)),trace:samples,
  caveat:'Only actual unmodified native 240Hz physical movement; no human-fairness acceptance.'
 };
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
 const doc=generateVoidHazardCandidate(),world=compile(doc);
 for(const config of P96_PROFILES){
  const result=probeP96(config,{doc,world});
  const {trace,...rest}=result;
  console.log('P96_NATIVE_'+config.id.toUpperCase().replace(/-/g,'_')+' '+JSON.stringify({
   ...rest,lastFiveSnapshots:trace.slice(-5)
  }));
 }
}

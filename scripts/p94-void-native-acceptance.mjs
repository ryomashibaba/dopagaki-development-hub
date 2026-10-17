/**
 * P94 unmodified native B48 240Hz VOID BREAKER full-route diagnostic.
 * No teleportation, no physics edit, no scripted claim of human play quality.
 * Reports failure/partial traversals as HOLD, never as a successful finish.
 */
import {fileURLToPath} from 'node:url';
import {generateVoidBreaker} from './p93-void-breaker-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {p94NativeSteer} from '../web/p94-native-steer.mjs';

export function runNativeVoidBreaker(profile='corrective',{seconds=145,doc=null,world=null}={}){
 if(!['neutral','gentle','corrective'].includes(profile))throw Error('Unknown P94 controller profile');
 if(!Number.isFinite(seconds)||seconds<=0||seconds>180)throw Error('P94 bounded physics horizon required');
 const course=doc??generateVoidBreaker(),compiled=world??compile(course),r=new Runner(course,compiled,0,44);
 const start=Date.now(),visited=new Set([r.surface]),times={},air={frames:0},positions=[];
 let physicalDistance=0,groundedDistance=0;
 let maxSpeed=0,lowestY=Infinity,highestY=-Infinity,maxAir=0,firstFailure=null;
 for(let k=0;k<Math.ceil(seconds/DT)&&!['failed','finished'].includes(r.status);k++){
  const steer=p94NativeSteer(r,profile),before=[...r.p];
  r.step(steer);
  const traveled=Math.hypot(...r.p.map((v,i)=>v-before[i]));
  physicalDistance+=traveled;if(r.grounded)groundedDistance+=traveled;
  if(r.surface&&P94_TRACK.includes(r.surface)){
   visited.add(r.surface);
   if(times[r.surface]===undefined)times[r.surface]=Number(r.time.toFixed(3));
  }
  const speed=Math.hypot(...r.v);
  maxSpeed=Math.max(maxSpeed,speed);
  lowestY=Math.min(lowestY,r.p[1]);highestY=Math.max(highestY,r.p[1]);
  if(!r.grounded){air.frames++;maxAir=Math.max(maxAir,r.airTime);}
  if(k%240===0)positions.push({t:Number(r.time.toFixed(1)),road:r.surface||null,xyz:r.p.map(x=>Number(x.toFixed(1))),speed:Number(speed.toFixed(1))});
  if(r.status==='failed'&&!firstFailure)firstFailure={...r.failure};
 }
 const ordered=P94_TRACK.filter(id=>visited.has(id)),full=ordered.length===7&&r.status==='finished'&&!r.failure
  &&r.events.some(x=>x.type==='finish');
 return {
  schema:'dopagaki.void-breaker.native-acceptance/1',
  status:full?'NATIVE_FULL_PASS':'HOLD_NOT_FULLY_TRAVERSED',
  physicsHz:1/DT,profile,time:Number(r.time.toFixed(3)),
  runnerStatus:r.status,reason:r.failure?.reason??null,
  failure:firstFailure?{time:Number(firstFailure.t.toFixed(3)),reason:firstFailure.reason,surface:firstFailure.surface,position:firstFailure.position.map(v=>Number(v.toFixed(2)))}:null,
  visited:ordered,missing:P94_TRACK.filter(id=>!visited.has(id)),timeBySurface:times,
  maximumSpeed:Number(maxSpeed.toFixed(2)),distanceMeters:Number(physicalDistance.toFixed(2)),
  groundedDistanceMeters:Number(groundedDistance.toFixed(2)),
  altitudeRange:[Number(lowestY.toFixed(2)),Number(highestY.toFixed(2))],
  airborneFrames:air.frames,longestAirSeconds:Number(maxAir.toFixed(3)),
  movingContactCount:r.events.filter(x=>x.type==='moving-contact').length,
  finishEvent:r.events.some(x=>x.type==='finish'),lastRoad:r.surface||r.lastSurface,position:r.p.map(v=>Number(v.toFixed(2))),
  probeTrace:positions,hostMilliseconds:Date.now()-start,
  caveat:'Scripted controller is NOT evidence of human completion, fair handling or production readiness.'
 };
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const doc=generateVoidBreaker(),world=compile(doc);
 const profiles=process.argv.slice(2).filter(x=>['neutral','gentle','corrective'].includes(x));
 for(const profile of profiles.length?profiles:['neutral','corrective']){
  const report=runNativeVoidBreaker(profile,{doc,world});
  console.log('P94_VOID_NATIVE_'+profile.toUpperCase()+' '+JSON.stringify(report));
 }
}

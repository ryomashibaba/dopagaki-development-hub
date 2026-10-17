/**
 * P94 unmodified native B48 240Hz VOID BREAKER full-route diagnostic.
 * No teleportation, no physics edit, no scripted claim of human play quality.
 * Reports failure/partial traversals as HOLD, never as a successful finish.
 */
import {fileURLToPath} from 'node:url';
import {generateVoidBreaker} from './p93-void-breaker-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT,routeFrame} from '../private/reference_only/director/physics.js';

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const P94_TRACK=['ABYSS_DIVE','CROWN_REVERSAL','SCISSOR_RISE','LOWER_REVERSAL','VOID_SURGE','PRISM_CREST','FINISH_RIDGE'].map(s=>'p93-'+s+'-01');
const dot=(a,b)=>a.reduce((n,v,i)=>n+v*b[i],0);
const unit=a=>{const d=Math.hypot(...a)||1;return a.map(x=>x/d);};
function nativeControl(r,profile){
 if(profile==='neutral')return 0;
 // A proportional lane/heading correction, over exact native B48 sampled
 // road midlines. This is only a QA scripted player input; Runner's existing
 // steering/assist/collision law remains untouched.
 const guide=r.guides?.find(x=>x.surface===(r.surface||r.lastSurface));
 if(!guide)return 0;
 const at=routeFrame(guide.points,r.p);
 const forward=unit([at.forward[0],0,at.forward[2]]);
 const right=[-forward[2],0,forward[0]];
 const lateral=dot(r.p.map((v,i)=>v-at.point[i]),right);
 const physicalForward=unit([r.forward[0],0,r.forward[2]]);
 const physicalRight=[-physicalForward[2],0,physicalForward[0]];
 const turn=dot(forward,physicalRight);
 const multiplier=profile==='gentle'?.026:.058;
 const turnWeight=profile==='gentle'?1.0:2.1;
 return clamp(turn*turnWeight-lateral*multiplier,-1,1);
}
export function runNativeVoidBreaker(profile='corrective',{seconds=145,doc=null,world=null}={}){
 if(!['neutral','gentle','corrective'].includes(profile))throw Error('Unknown P94 controller profile');
 if(!Number.isFinite(seconds)||seconds<=0||seconds>180)throw Error('P94 bounded physics horizon required');
 const course=doc??generateVoidBreaker(),compiled=world??compile(course),r=new Runner(course,compiled,0,44);
 const start=Date.now(),visited=new Set([r.surface]),times={},speeds={},air={frames:0,longestSeconds:0},positions=[];
 let maxSpeed=0,lowestY=Infinity,highestY=-Infinity,maxAir=0,firstFailure=null;
 for(let k=0;k<Math.ceil(seconds/DT)&&!['failed','finished'].includes(r.status);k++){
  const steer=nativeControl(r,profile);
  r.step(steer);
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
 const ordered=P94_TRACK.filter(id=>visited.has(id)),full=ordered.length===7&&r.status==='finished'&&!r.failure;
 return {
  schema:'dopagaki.void-breaker.native-acceptance/1',
  status:full?'NATIVE_FULL_PASS':'HOLD_NOT_FULLY_TRAVERSED',
  physicsHz:1/DT,profile,time:Number(r.time.toFixed(3)),
  runnerStatus:r.status,reason:r.failure?.reason??null,
  failure:firstFailure?{time:Number(firstFailure.t.toFixed(3)),reason:firstFailure.reason,surface:firstFailure.surface,position:firstFailure.position.map(v=>Number(v.toFixed(2)))}:null,
  visited:ordered,missing:P94_TRACK.filter(id=>!visited.has(id)),timeBySurface:times,
  maximumSpeed:Number(maxSpeed.toFixed(2)),altitudeRange:[Number(lowestY.toFixed(2)),Number(highestY.toFixed(2))],
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

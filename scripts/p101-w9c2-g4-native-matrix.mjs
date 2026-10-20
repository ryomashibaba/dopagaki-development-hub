/** G4 physical-risk matrix: local, synthetic 150/180/205m/s 240Hz trials.
 * Do not interpret scripted passage as 7/7 human fairness or approval.
 */
import {generateW9C2G4MacroArc,G4_SECTION} from './p101-w9c2-g4-macro-arc-build.mjs';
import {generateP101A13W7Candidate} from './p101-a13-w7-gameplay-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {sample,frame} from '../private/reference_only/director/surface.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {p94NativeSteer} from '../web/p94-native-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
import {locateRoadLateral} from '../web/p81-edge-radar.mjs';
const round=(x,n=3)=>Number(x.toFixed(n));
const START=.045,EXIT=.955;
export function g4NativePass(kind,speed,{maxSeconds=16}={}){
 if(!['gold','sweep','skyline'].includes(kind)||![150,180,205].includes(speed)||
  !Number.isFinite(maxSeconds)||maxSeconds<5||maxSeconds>20)throw Error('G4 declared local QA only');
 const doc=kind==='gold'?generateP101A13W7Candidate():generateW9C2G4MacroArc(kind);
 const s=doc.surfaces[G4_SECTION];
 doc.spawns.push({name:'G4 OFFLINE synthetic u=.045 entrance (not start00)',
  surface:s.id,u:START,v:.5});
 const r=new Runner(doc,compile(doc),doc.spawns.length-1,speed);
 const surge=createA13SurgeState(),events=[],trace=[];
 let reached=false,exited=false,maxU=START,air=0,airLongest=0,minMargin=Infinity,
  lastEvent=0,contactModes={};
 for(let i=0;i<maxSeconds/DT&&r.status!=='failed'&&r.status!=='finished';i++){
  const steer=p94NativeSteer(r,'corrective');
  p101Step(r,steer,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,surge),
   collisionRecovery:false});
  if(!r.grounded){air+=DT;airLongest=Math.max(airLongest,air);}
  else air=0;
  for(;lastEvent<r.events.length;lastEvent++){
   const e=r.events[lastEvent];
   if(e.type==='moving-contact'){
    const key=e.mode||'unknown';contactModes[key]=(contactModes[key]||0)+1;
    events.push({type:e.type,mode:key,id:e.id,t:round(e.t)});
   }
  }
  if(i%12===0){
   const loc=locateRoadLateral(doc,s.id,r.p,sample,frame,{grounded:r.grounded});
   if(loc&&r.surface===s.id){
    maxU=Math.max(maxU,loc.u);
    minMargin=Math.min(minMargin,loc.margin);
    if(loc.u>=.06)reached=true;
    if(reached&&loc.u>=EXIT&&loc.margin>-.65){exited=true;break;}
   }
   if(i%120===0)trace.push({t:round(r.time),u:loc?.u??null,
    speed:round(Math.hypot(...r.v),1),surface:r.surface,
    grounded:r.grounded,margin:loc?round(loc.margin):null,steer:round(steer)});
  }
 }
 return {kind,startSpeedMps:speed,syntheticLocalStart:true,fullCourseStart:false,
  nativeHz:1/DT,realMachines:doc.movingObstacles.length,
  scriptedInput:'P94_CORRECTIVE_NOT_HUMAN',exited,entryReached:reached,
  maxU:round(maxU,4),minimumObservedEdgeMargin:Number.isFinite(minMargin)?round(minMargin):null,
  longestAirSeconds:round(airLongest),elapsed:round(r.time),
  status:r.status,contactModes,events,
  failure:r.failure?{reason:r.failure.reason,time:round(r.failure.t)}:null,
  trace,humanFairness:'NOT_PROVEN',productionApproved:false};
}
export function g4NativeMatrix(){
 const cases=[];
 for(const kind of ['gold','sweep','skyline'])
  for(const speed of [150,180,205])cases.push(g4NativePass(kind,speed));
 return {schema:'dopagaki.w9c2.g4-macro-arc-physical-matrix/1',cases,
  humanFairness:'HOLD',gameRegistration:'OFF',productionApproved:false,
  source:'W7F_GOLD_1800M_REAL_B48_SECTION_IV',
  caveat:'Artificial local entrance and scripted input, not naturally reached speed or a human pass'};
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href)
 console.log('W9C2_G4_NATIVE_MATRIX '+JSON.stringify(g4NativeMatrix()));

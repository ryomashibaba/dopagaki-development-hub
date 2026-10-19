/**
 * W9-C2 G3: genuine B48 240Hz, B51-C 28-body high-speed entrance and
 * geometric steering-risk inspection. Every synthetic start is a clearly
 * labelled local 52/105/150 m/s QA reset. NOT a human trial or full 7/7 proof.
 * Never edits velocity or transforms after Runner construction; any steering
 * is the existing 'corrective' script and native P101 4.8x player input.
 */
import {generateP101W9C2SCrestCandidate,W9C2_STUDY} from './p101-w9c2-s-crest-build.mjs';
import {generateP101A13W7Candidate} from './p101-a13-w7-gameplay-build.mjs';
import {sample,frame} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT,RADIUS} from '../private/reference_only/director/physics.js';
import {p94NativeSteer} from '../web/p94-native-steer.mjs';
import {locateRoadLateral} from '../web/p81-edge-radar.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';

const readSpeed=r=>Math.hypot(...r.v);
const round=(n,p=3)=>Number(n.toFixed(p));
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const START_U=.245,EXIT_U=.66,MAX_SECONDS=11;
const steeringLabel='P94_CORRECTIVE_SCRIPT_NOT_HUMAN';
function centerCurvature(s,u,step=.002){
 const before=sample(s,clamp(u-step,0,1),.5),
  center=sample(s,u,.5),after=sample(s,clamp(u+step,0,1),.5);
 const dx1=center[0]-before[0],dz1=center[2]-before[2];
 const dx2=after[0]-center[0],dz2=after[2]-center[2];
 const a=Math.hypot(dx1,dz1),b=Math.hypot(dx2,dz2);
 const chord=Math.hypot(after[0]-before[0],after[2]-before[2]);
 if(a<1e-6||b<1e-6||chord<1e-6)return 0;
 return Math.abs(dx1*dz2-dz1*dx2)*2/(a*b*chord);
}
export function w9c2CurvatureDiagnostics(doc){
 const s=doc.surfaces[W9C2_STUDY.section],values=[];
 const P=W9C2_STUDY;
 let peak={curvature:0,u:null},minWidth=Infinity;
 for(let i=0;i<=180;i++){
  const u=P.startU+(P.endU-P.startU)*i/180;
  const curvature=centerCurvature(s,u);
  const left=sample(s,u,0),right=sample(s,u,1);
  const width=Math.hypot(...left.map((x,j)=>x-right[j]));
  if(curvature>peak.curvature)peak={curvature,u};
  minWidth=Math.min(minWidth,width);
  values.push({u,curvature,width});
 }
 const boundedSteering=36*4.8;
 return {section:P.section,window:[P.startU,P.endU],
  peakU:round(peak.u,4),peakHorizontalCurvaturePerMeter:round(peak.curvature,6),
  minimumHorizontalTurnRadiusMeters:round(1/(peak.curvature||1e-20),2),
  minimumRealB48WidthMeters:round(minWidth,2),
  theoreticalHorizontalAccelDemandMps2:Object.fromEntries([52,105,150].map(speed=>
   [String(speed),round(speed*speed*peak.curvature,2)])),
  theoreticalSteeringForceCeilingMps2:boundedSteering,
  caveat:'Only horizontal centerline curvature; road bank, actual steering controls, friction, gravity and collision dynamics need real native simulation. Demand above steering ceiling implies risk, not proof of unavoidability.'};
}
function makeLocalSpawnDoc(original){
 const doc=structuredClone(original),s=doc.surfaces[W9C2_STUDY.section];
 doc.spawns.push({name:'W9-C2 G3 QA synthetic local entrance u=.245 (not full-course proof)',
  surface:s.id,u:START_U,v:.5});
 return doc;
}
export function runW9C2G3Passage(kind,speed,{maxSeconds=MAX_SECONDS}={}){
 if(!['gold','ribbon','edge'].includes(kind)||![52,105,150].includes(speed)||
  !Number.isFinite(maxSeconds)||maxSeconds<5||maxSeconds>16)throw Error('W9-C2 strict native QA matrix');
 const basis=kind==='gold'?generateP101A13W7Candidate():generateP101W9C2SCrestCandidate(kind);
 const doc=makeLocalSpawnDoc(basis),road=doc.surfaces[W9C2_STUDY.section];
 const runner=new Runner(doc,compile(doc),doc.spawns.length-1,speed);
 const surge=createA13SurgeState(),trace=[],contactCounts={};
 let reachedEntry=false,exited=false,furthestU=START_U,
  initialPhysicalSpeed=readSpeed(runner),lastU=START_U,
  airborneTicks=0,minimumMargin=Infinity,observed=0;
 const startsOnRealRoad=runner.surface===road.id&&runner.grounded;
 for(let tick=0;tick<maxSeconds/DT&&runner.status!=='failed'&&runner.status!=='finished';tick++){
  // The reference controller uses only legitimate [-1,1] player steering
  // and the original native 240Hz velocity/CCD solver, never position snaps.
  const steer=p94NativeSteer(runner,'corrective');
  p101Step(runner,steer,'OVERDRIVE',{
   forwardScale:p101A13ForwardScale(runner,surge),collisionRecovery:false});
  if(!runner.grounded)airborneTicks++;
  if(tick%12===0){
   const r=locateRoadLateral(doc,road.id,runner.p,sample,frame,{grounded:runner.grounded});
   if(r&&runner.surface===road.id){
    observed++;lastU=r.u;furthestU=Math.max(furthestU,r.u);
    minimumMargin=Math.min(minimumMargin,r.margin);
    if(r.u>=W9C2_STUDY.startU)reachedEntry=true;
    if(reachedEntry&&r.u>=EXIT_U&&r.margin>-.65){exited=true;break;}
   }
   if(tick%60===0)trace.push({seconds:round(runner.time),u:r?.u??null,
    marginMeters:r?round(r.margin):null,speedMps:round(readSpeed(runner),1),
    surface:runner.surface,grounded:runner.grounded,steer:round(steer)});
  }
 }
 for(const e of runner.events){
  if(e.type==='moving-contact'){
   const key=e.mode??'unknown';contactCounts[key]=(contactCounts[key]||0)+1;
  }
 }
 return {schema:'dopagaki.w9c2.g3-native-passage/1',
  kind,startSpeedMps:speed,localStartU:START_U,exitU:EXIT_U,
  explicitSyntheticLocalStart:true,fullCourseStart:false,
  actualRunner:true,physicsHz:1/DT,ballRadius:RADIUS,
  machineBodies:doc.movingObstacles.length,
  controller:steeringLabel,collisionRecovery:false,
  readyOnRealPhysicalRoad:startsOnRealRoad,
  observed,entryReached:reachedEntry,exited,
  maxU:round(furthestU,4),lastU:round(lastU,4),
  status:runner.status,elapsedSeconds:round(runner.time),
  maxSpeedMps:round(Math.max(initialPhysicalSpeed,...runner.records.map(x=>x.speed)),1),
  minimumObservedMarginMeters:Number.isFinite(minimumMargin)?round(minimumMargin):null,
  airborneSeconds:round(airborneTicks*DT),
  contacts:contactCounts,
  failure:runner.failure?{reason:runner.failure.reason,
   surface:runner.failure.surface,seconds:round(runner.failure.t)}:null,
  trace,
  limitations:['Scripted corrective input, not a real person','Artificial local speed initialization',
   'Road edge clearance sampled after collision resolution','No real-world runtime FPS evidence',
   'Obstacle collisions and air state are native, but a pass never certifies fairness']};
}
export function runW9C2G3Matrix(){
 const out=[];
 for(const kind of ['gold','ribbon','edge']){
  const doc=kind==='gold'?generateP101A13W7Candidate():generateP101W9C2SCrestCandidate(kind);
  const shape=w9c2CurvatureDiagnostics(doc);
  for(const speed of [52,105,150])out.push({kind,speed,shape,
   actual:runW9C2G3Passage(kind,speed)});
 }
 return {schema:'dopagaki.w9c2.g3-matrix/1',cases:out,
  productionApproved:false,humanFairness:'HOLD',humanEnjoyment:'HOLD',
  noRealPlatformGap:true,fullCourseScriptedFinish:'NOT_MEASURED',
  generatedAt:null};
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
 console.log('W9C2_G3_NATIVE_MATRIX '+JSON.stringify(runW9C2G3Matrix()));
}

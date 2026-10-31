/** G4E-7BB — 240 Hz observational trajectory/road-vector audit.
 * Identical pre-existing P96/OVERDRIVE user-input surrogate in all cases.
 * No model changes, autopilot assistance, force, new collider or game code.
 */
import fs from 'node:fs';
import {generateG4E7AY} from './p101-w9c2-g4e7ay-tangent-bridge.mjs';
import {generateG4E7BA} from './p101-w9c2-g4e7ba-left-catchment-contour.mjs';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {compile} from '../private/reference_only/director/collision.js';
import {sample} from '../private/reference_only/director/surface.js';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
import {analyzeRoadFrame,projectCenterline} from './p101-w9c2-g4e7bb-vector-math.mjs';
const round=(x,n=4)=>Number(x.toFixed(n));
const modes=['true-pinch','pinch-switch'];
function run(stage,variant,mode){
 if(stage.surfaces.length!==7||stage.movingObstacles.length!==28||
  stage.surfaces[0].voidLongitudinalCells?.join(',')!=='52'||
  stage.stageForge.productionPromoted!==false)throw Error('BB physical provenance/protection failed');
 const r=new Runner(stage,compile(stage),0,52),plan=makeP96RoutePlan(stage,r),
  surge=createA13SurgeState(),road2=stage.surfaces[1],second=road2.id,
  guide=Array.from({length:129},(_,i)=>sample(road2,i/128,.5)),
  visited=new Map();
 let lastGround=null,maxGroundedU=0,contacts=0,staticFatal=0,eventIndex=0,firstRoad2=null,
  prevSupport=null,airStart=null;const transition=[],episodes=[],samples=[];
 for(let k=0;k<Math.round(21/DT)&&['ready','running'].includes(r.status);k++){
  const steer=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose).input/4.8;
  p101Step(r,steer,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,surge),collisionRecovery:false});
  if(r.surface&&!visited.has(r.surface))visited.set(r.surface,round(r.time,5));
  if(r.surface===second&&!firstRoad2)firstRoad2=round(r.time,5);
  for(const e of r.events.slice(eventIndex)){
   if(e.type==='moving-contact')contacts++;
   if(e.type==='static-fatal-contact')staticFatal++;
  }
  eventIndex=r.events.length;
  if(firstRoad2===null)continue;
  const {u,distance3D}=projectCenterline(guide,r.p);
  if(u<.20||u>.55||distance3D>95)continue;
  const supported=r.grounded&&r.surface===second;
  // Contact state is sampled after Runner.step. It is an observed native state,
  // not a geometrical proof of contact at an interpolated exact location.
  const geometry=analyzeRoadFrame(road2,u,r.p,r.v);
  const snap={t:round(r.time,5),supported,grounded:r.grounded,nativeSurface:r.surface,
    steerInput:round(steer,5),nativeAssistFlag:r.assist,...geometry};
  if(supported){
   if(u>maxGroundedU){maxGroundedU=u;}
   lastGround={...snap};
  }
  if(prevSupport!==supported){
   transition.push({t:snap.t,u:snap.u,from:prevSupport,to:supported,
    edgeMarginM:snap.edgeMarginM,normalVelocityMps:snap.normalVelocityMps,
    signedHeadingErrorDeg:snap.signedHeadingErrorDeg});
   if(!supported)airStart=snap;
   else if(airStart){episodes.push({start:airStart,end:snap,durationSec:round(snap.t-airStart.t,5)});airStart=null;}
  }
  if(k%12===0||prevSupport!==supported) samples.push(snap);
  prevSupport=supported;
 }
 if(airStart)episodes.push({start:airStart,end:null,durationSec:round(r.time-airStart.t,5)});
 const significantLoss=episodes.filter(e=>e.durationSec>=.12).map(e=>({
  startT:e.start.t,startU:e.start.u,durationSec:e.durationSec,
  startMarginM:e.start.edgeMarginM,headingErrorDeg:e.start.signedHeadingErrorDeg,
  velocityNormalMps:e.start.normalVelocityMps,verticalVelocityMps:e.start.verticalVelocityMps,
  turnDegPer100m:e.start.turnDegPer100m,kinematicCurveAccelMps2:e.start.kinematicCurveAccelMps2,
  endedWithSupport:!!e.end}));
 const geometryStations=[.22,.26,.29,.32,.34,.36,.38,.40,.43,.46,.50].map(u=>
  ({u,...analyzeRoadFrame(road2,u,sample(road2,u,.5),[0,0,0])}));
 return {mode,variant,Hz:1/DT,sampleIntervalFrames:12,
  firstRoad2Sec:firstRoad2,physicsStatus:r.status,survivalSec:round(r.time,5),
  lastGround,maxGroundedU:round(maxGroundedU,6),
  visitedRoads:[...visited].map(([id,t])=>({road:stage.surfaces.findIndex(x=>x.id===id)+1,at:t})),
  movingContacts:contacts,staticFatalContacts:staticFatal,failure:r.failure?.reason??null,
  significantLoss,transitions:transition,samples,geometryStations};
}
const records=[];
for(const mode of modes){
 records.push(run(generateG4E7AY(mode,'bankedSweep'),'AY_BANKEDSWEEP',mode));
 records.push(run(generateG4E7BA(mode,'outerContour'),'BA_OUTERCONTOUR_REJECTED',mode));
}
const output={schema:'dopagaki.g4e7bb-true240hz-road-vectors/1',
 road2Analysis:'observational',modifiedEngine:false,modifiedControls:false,
 allNativeAssistFlagsPreserved:true,formallyAccreditedSlope2Meters:0,
 humanQA:'HOLD',artQA:'HOLD',publish:'HOLD',records};
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(output,null,2)+'\n');
console.log('BB_VECTOR_SUMMARY '+JSON.stringify(records.map(x=>({
 mode:x.mode,variant:x.variant,survivalSec:x.survivalSec,maximumGroundU:x.maxGroundedU,
 lastGround:x.lastGround&&{t:x.lastGround.t,u:x.lastGround.u,speed:x.lastGround.speedMps,
  headingError:x.lastGround.signedHeadingErrorDeg,edgeMargin:x.lastGround.edgeMarginM,
  pitch:x.lastGround.roadPitchDeg,normalVelocity:x.lastGround.normalVelocityMps},
 significantLoss:x.significantLoss,roads:x.visitedRoads.map(y=>y.road),
 movingContacts:x.movingContacts,staticFatalContacts:x.staticFatalContacts,
 kinematicRoadData:x.geometryStations.map(y=>({u:y.u,bankNormalY:y.roadBankNormalY,
  pitch:y.roadPitchDeg,curve:y.turnDegPer100m,width:y.widthM}))
}))));

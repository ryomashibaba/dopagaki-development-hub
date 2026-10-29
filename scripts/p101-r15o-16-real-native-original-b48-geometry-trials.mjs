/**
 * R15O real original native P101/240Hz collision vs isolated AUTHORED
 * B48 physical shoulder and curve alternatives. No scripted teleport,
 * fixed longitudinal movement, camera cheat or fake contact.
 *
 * Modes x native roads x input policies: ORIGINAL / A 8m / B 16m bank /
 * C 22m centerline, true-pinch+pinch-switch, original P96 input OR
 * preceding R15N2 cross-world +.18 at 15.75s = 16 genuine 0-start trials.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {buildR15OIsolatedB48} from './p101-r15o-isolated-original-crown-physical-shape-variants.mjs';
import {compile,contacts} from '../private/reference_only/director/collision.js';
import {Runner,DT,RADIUS} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
import {capturePose,createCameraState,advanceCamera,viewForPose} from '../web/drive3d-camera.mjs';
const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
const ROADS=['true-pinch','pinch-switch'],
 MODES=['ORIGINAL','A_OUTER_SHOULDER_8M','B_BANKED_OUTER_SHOULDER_16M','C_REAL_OUTER_CURVE_SHIFT_22M'];
const CONTROLS=[{id:'ORIGINAL_P96_EARLY_SOFT',start:null,bias:0},
 {id:'R15N2_CROSS_ROAD_BEST_EARLY_RIGHT_0P18',start:15.75,bias:.18}];
const round=(x,n=6)=>Number(x.toFixed(n)),vec=x=>x.map(v=>round(v));
const maxDiff=(x,y)=>Math.max(...x.map((v,i)=>Math.abs(v-y[i])));
const horizon=24;
export const realSource=(r,ref,mode,control,n2,horizonSeconds=horizon)=>{
 assert.ok(horizonSeconds>=24&&horizonSeconds<=36);
 const doc=buildR15OIsolatedB48(r,mode),str=JSON.stringify(doc);
 const collider=compile(doc);
 assert.ok(collider.count>28000&&collider.invalid===0);
 assert.equal(doc.surfaces.length,7);assert.equal(doc.movingObstacles.length,28);
 assert.equal(doc.stageForge.productionPromoted,false);
 const player=new Runner(doc,collider,0,52);
 const plan=makeP96RoutePlan(doc,player),surge=createA13SurgeState();
 let camera=createCameraState(player.forward),beforeCurvePreserved=false;
 let originalAt17=null,sourceGroundedLast=null;
 let firstPermanentExit=null,onRoadPrev=false,road18PlusTicks=0,all18PlusTicks=0;
 let contactTransitions=0,airTransitions=0,secondsSeen=0;
 let lastContiguousContactFrom17Ticks=0,maxContiguousContactFrom17Ticks=0;
 let originalReferenceT14CameraParity=null;const quarter=[];
 for(let tick=1;tick<=Math.round(horizonSeconds/DT);tick++){
  if(player.status==='failed'||player.status==='finished')break;
  const nativeSteer=p96DodgeSteer(player,plan,'early-soft',movingObstaclePose).input/4.8;
  const bias=control.start!==null&&tick*DT>=control.start?control.bias:0;
  const steer=Math.max(-1,Math.min(1,nativeSteer+bias));
  p101Step(player,steer,'OVERDRIVE',{forwardScale:p101A13ForwardScale(player,surge),
   collisionRecovery:false});
  camera=advanceCamera(camera,player.forward,DT);
  const touchingRoad=Boolean(player.grounded&&player.surface);
  if(tick===Math.round(13/DT)||tick===Math.round(14/DT)){
   const pose=capturePose(player),view=viewForPose(pose,camera);
   const refTime=tick===Math.round(13/DT)?'t1300':'t1400';
   const source=ref.originalFullTimelineFrames.find(x=>x.id===refTime);
   assert.ok(source);
   const parity=maxDiff(pose.position,source.playerPosition)<.00001 &&
    maxDiff(view.eye,source.eye)<.00001 && maxDiff(view.front,source.front)<.00001 &&
    (player.surface||player.lastSurface)===source.physicalRoad;
   // Original untouched scene and original steering must agree with stored
   // native 13/14s exact camera/position. A new physically modified road can
   // legitimately alter dynamics once the corrected road patch is reached.
   if(mode==='ORIGINAL')assert.ok(parity,mode+' '+control.id+' '+refTime);
   if(tick===Math.round(13/DT))beforeCurvePreserved=parity;
   if(tick===Math.round(14/DT))originalReferenceT14CameraParity=parity;
  }
  if(tick===Math.round(17/DT)){
   originalAt17={positionXYZ:vec(player.p),
    originalSourceSurfaceContact:player.surface,grounded:touchingRoad,
    velocityXYZ:vec(player.v),sourceViewEye:vec(viewForPose(capturePose(player),camera).eye)};
   if(mode==='ORIGINAL'&&control.bias===0){
    const f=ref.originalFullTimelineFrames.find(x=>x.id==='t1700');
    assert.ok(maxDiff(originalAt17.positionXYZ,f.playerPosition)<.00001);
    assert.ok(maxDiff(originalAt17.sourceViewEye,f.eye)<.00001);
   }
  }
  if(touchingRoad){
   sourceGroundedLast={tick,timeSeconds:round(player.time),
    road:player.surface,worldPositionXYZ:vec(player.p),
    speedMps:round(Math.hypot(...player.v),4)};
   if(player.time>=17){
    lastContiguousContactFrom17Ticks++;
    maxContiguousContactFrom17Ticks=Math.max(maxContiguousContactFrom17Ticks,lastContiguousContactFrom17Ticks);
   }
  }else{
   lastContiguousContactFrom17Ticks=0;
  }
  if(player.time>=17){
   all18PlusTicks++;
   if(touchingRoad)road18PlusTicks++;
   if(onRoadPrev&&!touchingRoad)airTransitions++;
   if(!onRoadPrev&&touchingRoad)contactTransitions++;
  }
  onRoadPrev=touchingRoad;
  // True native collision witness: do not claim grounded solely from RADIUS
  // distance; contacts are recorded but player.grounded is native.
  if(tick%60===0||player.status==='failed'||player.status==='finished'){
   if(player.time>=15){
    const p=player.p,
       support=contacts(collider,p,RADIUS)
        .filter(x=>x.triangle.rideable&&x.normal[1]>.15)
        .sort((a,b)=>a.distance-b.distance)[0];
    quarter.push({tick,seconds:round(player.time),playerWorldXYZ:vec(p),
      engineGrounded:touchingRoad,
      sourceRoad:player.surface,originalB48SupportWitness:support?
       {surface:support.triangle.surface,distance:round(support.distance),normalY:round(support.normal[1])}:null,
      speedMps:round(Math.hypot(...player.v),4),steer:round(steer,4),
      nativeStatus:player.status});
   }
  }
 }
 assert.ok(beforeCurvePreserved||mode!=='ORIGINAL');
 assert.equal(JSON.stringify(doc),str);
 assert.ok(player.time>=17);
 if(mode==='ORIGINAL'&&control.bias===0){
  assert.equal(player.status,ref.actualRunnerStatus);
  assert.ok(Math.abs(player.time-ref.actualRunnerTimeSeconds)<.00001);
 }
 if(mode==='ORIGINAL'&&control.bias>0){
  const t=n2.sourceEvidenceByRoad[r].find(x=>x.controlStartSeconds===15.75&&x.additiveRightInput===.18);
  assert.ok(t);
  assert.equal(player.status,t.originalSourceRunnerStatusAtEnd);
  assert.ok(Math.abs(player.time-t.actualOriginalRunnerEndTimeSeconds)<.00001);
  assert.ok(Math.abs(sourceGroundedLast.timeSeconds-t.physicalOriginalRoadLastGrounded.seconds)<.00001);
 }
 const last=sourceGroundedLast;
 const baselineKnown={};
 for(const key of ['originalSourceGameBlob','realSourceB48ChangedRows','original28B51PosesFrozenForIsolation',
  'studyRealRoadSourceGeomPost','sourceR15OFloatParameter','maxChangedMetres']){
  baselineKnown[key]=doc.stageForge.r15oPhysicalSourceStudy[key];
 }
 const res={road:r,geometryMode:mode,steering:control,
  sourceBlob:SHA,realSourceCollisionTriangles:collider.count,
  originallyExactlyParityAt13:beforeCurvePreserved,
  originallyExactlyParityAt14:originalReferenceT14CameraParity,
  sourceExact17RealPosCam:originalAt17,
  nativePhysicalLastB48Support:last,
  lastRoadContactAfter17Clock:round(last?.timeSeconds??0),
  originalSourceStatus:player.status,
  originalSourceTerminalTimeSeconds:round(player.time),
  originalNativeFailReason:player.failure?.reason??null,
  originalSourceGameActuallyFinished:player.status==='finished',
  sourceGroundedTickShareAfter17:round(road18PlusTicks/Math.max(1,all18PlusTicks),5),
  longestUninterruptedRealRoadContactAfter17Seconds:round(maxContiguousContactFrom17Ticks*DT,5),
  actualEngineAirTransitionsAfter17:airTransitions,
  actualEngineRecontactsAfter17:contactTransitions,
  nativeQuarterSecondSourcePhysicsTrace:quarter,
  originalGameEdited:false,originalB48SourcePhysicsUnchanged:true,
  sourceOriginalB51PositionsUnchanged:true,
  newGameColliders:0,realSourceB48StudyGeometryDifferent:mode!=='ORIGINAL',
  sourceB48StudyGeometryMetadata:baselineKnown,
  humanGameplayCertified:false,realBrowserWebGLRendered:false,
  ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD'};
 console.log('R15O_GENUINE_240HZ_REAL_B48_STUDY',JSON.stringify({
  road:r,mode,steer:control.id,originalGeometryAltered:mode!=='ORIGINAL',
  status:res.originalSourceStatus,terminal:res.originalSourceTerminalTimeSeconds,
  lastActualRoadContact:res.nativePhysicalLastB48Support.timeSeconds,
  sourceContactShareAfter17:res.sourceGroundedTickShareAfter17,
  continuousContact17plus:res.longestUninterruptedRealRoadContactAfter17Seconds,
  failure:res.originalNativeFailReason}));
 return res;
};
const argv=process.argv.slice(2),arg=k=>{const i=argv.indexOf(k);assert.ok(i>=0,k);return argv[i+1]};
const refs=Object.fromEntries(ROADS.map(r=>[r,JSON.parse(fs.readFileSync(arg('--'+r),'utf8'))]));
const n2=JSON.parse(fs.readFileSync(arg('--r15n2'),'utf8'));
assert.equal(n2.sourceBlob,SHA);
const all={};
for(const r of ROADS){
 assert.equal(refs[r].sourceBlob,SHA);
 all[r]={};
 for(const mode of MODES)all[r][mode]=CONTROLS.map(control=>realSource(r,refs[r],mode,control,n2));
}
const results={schema:'dopagaki.r15o-isolated-original-b48-physical-curve-multi-geometry-240hz/1',
 originalGameSourceBlob:SHA,realSourceRoads:ROADS,realNewGeometryModes:MODES,
 realOriginalInputPolicies:CONTROLS,realSource240Hz:true,
 fullActualNativeRealDrivingTrials:16,
 recordedSourceExperiments:all,originalGameSourceEdited:false,
 originalPhysicsCCDChanged:false,newGameColliders:0,
 originalB51DynamicHazardShapesAndPositionsFrozen:true,
 originalHumanGameWebGLRendered:false,officialArt:0,officialSlope2Meters:0,
 ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',
 INTEGRATION:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'};
fs.mkdirSync(arg('--out'),{recursive:true});
fs.writeFileSync(arg('--out')+'/R15O_REAL_16_NATIVE_CROWN_PHYSICAL_RESHAPE_240HZ_DRIVING.json',
 JSON.stringify(results,null,2)+'\n');

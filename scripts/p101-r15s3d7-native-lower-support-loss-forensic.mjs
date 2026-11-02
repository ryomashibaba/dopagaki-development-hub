/** R15S3D7: observe ORIGINAL Runner at true R15S3D6R1 loss of LOWER_REVERSAL
 * support in both worlds. SOURCE-ONLY; never infer individual CCD impact normal
 * from contacts() nor treat sample surface normals as actual CCD impulses.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {buildR15S3D6R1} from './p101-r15s3d6r1-real-lower-b48-runout-candidate.mjs';
import {sample,frame} from '../private/reference_only/director/surface.js';
import {compile,contacts} from '../private/reference_only/director/collision.js';
import {Runner,DT,RADIUS,routeFrame} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p94NativeSteer} from '../web/p94-native-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
const get=x=>{const i=process.argv.indexOf(x);assert.ok(i>=0&&process.argv[i+1],x);return process.argv[i+1];};
const original=JSON.parse(fs.readFileSync(get('--r1'),'utf8'));
const b16=JSON.parse(fs.readFileSync(get('--b16'),'utf8'));
assert.equal(original.originalSourceBlob,SHA);assert.equal(b16.sourceGameBlob,SHA);
const worlds=['true-pinch','pinch-switch'];
const mag=v=>Math.hypot(...v);
const dot=(a,b)=>a.reduce((n,x,i)=>n+x*b[i],0);
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const round=x=>Number(x.toFixed(6));
const vec=v=>v.map(round);
const same=(a,b,tol=1e-5)=>mag(sub(a,b))<=tol;
const startTick=Math.round(34.25/DT),endTick=Math.round(34.75/DT);
const norm=v=>{const n=mag(v)||1;return v.map(x=>x/n);};
const distSegment=(p,a,b,onlyXZ=false)=>{
 const q=onlyXZ?[p[0],p[2]]:p, u=onlyXZ?[a[0],a[2]]:a,v=onlyXZ?[b[0],b[2]]:b;
 const d=sub(v,u),t=Math.max(0,Math.min(1,dot(sub(q,u),d)/(dot(d,d)||1)));
 return {distanceM:round(mag(sub(q,u.map((x,i)=>x+t*d[i])))),t};
};
function trace(track,p){
 let best=null;
 for(let i=0;i<track.length-1;i++){
  const r=distSegment(p,track[i],track[i+1]);
  if(!best||r.distanceM<best.distanceM)best={...r,u:round((i+r.t)/(track.length-1)),segment:i};
 }
 return best;
}
function guideAt(player,road){
 const local=player.guides?.filter(g=>g.surface===road).map(g=>({g,f:routeFrame(g.points,player.p)})).sort((a,b)=>a.f.distance-b.f.distance)[0];
 const g=routeFrame(local?.g.points??player.doc.route,player.p);
 return {source:local?'original-generated-surface':'original-document-route',
   xyz:vec(g.forward),distanceM:round(g.distance),index:g.index};
}
function supportAt(compiled,p){
 const candidates=contacts(compiled,p,RADIUS);
 const support=candidates.filter(c=>c.triangle.rideable&&c.normal[1]>.15).sort((a,b)=>b.normal[1]-a.normal[1])[0]??null;
 const represent=c=>c?{
  road:c.triangle.surface,part:c.triangle.part,pointXYZ:vec(c.point),
  normalXYZ:vec(c.normal),triangleNormalXYZ:vec(c.triangle.normal),
  distanceM:round(c.distance),triangleRideable:c.triangle.rideable
 }:null;
 return {support:represent(support),
  nearestSolid:represent(candidates[0]??null),
  candidatesUnderRadius:candidates.length};
}
function geometry(doc){
 const s=doc.surfaces[3],rows=[];
 for(let row=6;row<=22;row++){
  const u=row/30,c=sample(s,u,.5),f=frame(s,u,.5);
  const a=sample(s,Math.max(0,u-.005),.5),b=sample(s,Math.min(1,u+.005),.5);
  const tangent=norm(sub(b,a));
  const nx=frame(s,Math.max(0,u-.01),.5).normal,ny=frame(s,Math.min(1,u+.01),.5).normal;
  const normalAngle=round(180/Math.PI*Math.acos(Math.max(-1,Math.min(1,dot(nx,ny)))));
  const left=sample(s,u,0),right=sample(s,u,1);
  rows.push({row,u:round(u),centerXYZ:vec(c),actualSurfaceCenterTangentXYZ:vec(tangent),
   actualSampledFrameNormalXYZ:vec(f.normal),normalAngleAcross0p02UProxyDegrees:normalAngle,
   actualSurfaceWidthXZ:round(Math.hypot(right[0]-left[0],right[2]-left[2])),
   widthVerticalSeparationM:round(Math.abs(right[1]-left[1]))});
 }
 return rows;
}
const output={schema:'dopagaki.r15s3d7-native-source-34p5-support-loss-observational/1',
 sourceOriginalBlob:SHA,sourceHz:240,sourceBallRadiusM:RADIUS,
 actualSourceWorlds:2,actualSourceGeometry:'R15S3D6R1 physical LOWER_REVERSAL, no edits',
 realB48Count:7,movingObstacleB51Count:28,extraPhysicsColliders:0,
 sourceRunnerSteeringCameraGuideModified:false,original17And21p5PrefixPreserved:true,
 observationalOnly:true,CCDInstantaneousCollisionNormalMeasured:false,
 individualFixedCollisionImpulseMeasured:false,
 geometricEdgeClearanceMeaning:'Samples from exact authored B48 Catmull-Rom u at 301 points across each edge; approximate closest polyline 3D/XZ distance, NOT true collider exact closest triangle or proof of lateral clearance.',
 sourceSupportMeaning:'contacts() PRE-STEP same as native Runner support selection; post-step support is prospective next tick, NOT CCD instantaneous collision normal',
 sourceCausalExplanationProven:false,
 timeWindowSeconds:[34.25,34.75],
 officialART:0,officialSlope2Metres:0,
 actualBrowserWebGL:false,humanFairnessEstablished:false,
 GAMEPLAY:'HOLD',ART:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',
 INTEGRATION:'HOLD',RELEASE:'HOLD',MERGE:'HOLD',
 results:{}};
for(const world of worlds){
 const doc=buildR15S3D6R1(world),snapshot=JSON.stringify(doc),compiled=compile(doc);
 assert.equal(doc.surfaces.length,7);assert.equal(doc.movingObstacles.length,28);
 const player=new Runner(doc,compiled,0,52),plan=makeP96RoutePlan(doc,player),surge=createA13SurgeState();
 const ref=original.cases[world].B_RUNOUT_SUPPORT;
 const frozen=new Map(b16.actualCases[world].E_BANKED_LANDING.P94_FULL_AFTER_21P5.checkpointAndQuarterSecondSourceTrajectory.map(x=>[x.tick,x]));
 const oldTenHz=new Map(ref.actualNativeTenHzPlusTransitionTimeline.map(x=>[x.tick,x]));
 const s=doc.surfaces[3],road=s.id;
 const centre=Array.from({length:301},(_,i)=>sample(s,i/300,.5));
 const left=Array.from({length:301},(_,i)=>sample(s,i/300,0));
 const right=Array.from({length:301},(_,i)=>sample(s,i/300,1));
 const actual=[],prefixTicks=[],lastSupports=[],hasLateSamples=[];
 let nextGroundedTicks=0,scissorGroundedTicks=0,oldSampleChecks=0,eventsCount=0;
 const startTime=ref.actualNextRoadLastContact.timeSeconds;
 for(let tick=1;tick<=Math.round(45/DT);tick++){
  if(player.status==='failed'||player.status==='finished')break;
  const steer=tick<=Math.round(21.5/DT)
    ?p96DodgeSteer(player,plan,'early-soft',movingObstaclePose).input/4.8
    :p94NativeSteer(player,'corrective');
  assert.ok(Number.isFinite(steer)&&steer>=-1&&steer<=1);
  const inWindow=tick>=startTick&&tick<=endTick;
  const prePosition=[...player.p],preVelocity=[...player.v],preForward=[...player.forward],collisionBefore=player.collisions;
  const pre=inWindow?supportAt(compiled,prePosition):null;
  const preGuide=inWindow?guideAt(player,pre?.support?.road??null):null;
  p101Step(player,steer,'OVERDRIVE',{forwardScale:p101A13ForwardScale(player,surge),collisionRecovery:false});
  if(player.grounded&&player.surface===doc.surfaces[3].id)nextGroundedTicks++;
  if(player.grounded&&player.surface===doc.surfaces[2].id)scissorGroundedTicks++;
  if([Math.round(17/DT),Math.round(21.5/DT)].includes(tick)){
   const expect=frozen.get(tick);assert.ok(expect);
   assert.ok(same(player.p,expect.xyz),'frozen B16 original position regression');
   assert.ok(Math.abs(mag(player.v)-expect.speedMps)<.000003);
   assert.ok(Math.abs(steer-expect.steer)<.000003);
   assert.equal(player.grounded,expect.grounded);assert.equal(player.surface,expect.physicalRoad);
   prefixTicks.push(tick);
  }
  const old=oldTenHz.get(tick);
  if(old){
   assert.ok(same(player.p,old.positionXYZ,3e-6),'R1 native evidence XYZ mismatch');
   assert.ok(same(player.v,old.velocityXYZ,3e-6),'R1 native evidence velocity mismatch');
   assert.ok(same(player.forward,old.forwardXYZ,3e-6),'R1 native evidence drive-frame mismatch');
   assert.ok(Math.abs(steer-old.legalInput)<3e-6,'R1 native input mismatch');
   assert.equal(player.status,old.status);assert.equal(player.surface,old.sourceGroundRoad);
   oldSampleChecks++;
  }
  if(inWindow){
   const post=supportAt(compiled,player.p);
   const nearest=trace(centre,player.p);
   const lf=trace(left,player.p),rt=trace(right,player.p);
   const closestPoint=sample(s,nearest.u,.5);
   const f=frame(s,nearest.u,.5);
   const guide=guideAt(player,player.surface);
   const record={tick,timeSeconds:round(player.time),
     prePositionXYZ:vec(prePosition),postPositionXYZ:vec(player.p),
     preVelocityXYZ:vec(preVelocity),postVelocityXYZ:vec(player.v),
     preForwardXYZ:vec(preForward),postForwardXYZ:vec(player.forward),
     actualNativeSteer:round(steer),nativeRunnerGrounded:player.grounded,
     nativeRunnerRoad:player.surface,nativeStatus:player.status,
     nativeRunnerCollisionDelta:player.collisions-collisionBefore,
     preStepSelectedSupport:pre.support,
     preStepClosestCollisionContact:pre.nearestSolid,
     postStepProspectiveSupport:post.support,
     postStepNearestCollisionContact:post.nearestSolid,
     nativeGuidePreStep:preGuide,nativeGuidePostStep:guide,
     fullStepDeltaVelocityMps:round(mag(sub(player.v,preVelocity))),
     nearestRoadCentreUProjectionProxy:nearest.u,
     roadCentreXYZAtU:vec(closestPoint),
     roadFrameTangentAtProxyXYZ:vec(f.forward),
     roadFrameNormalAtProxyXYZ:vec(f.normal),
     centerlineNearest3DPolylineDistanceM:nearest.distanceM,
     leftEdge3DPolylineDistanceM:lf.distanceM,
     rightEdge3DPolylineDistanceM:rt.distanceM,
     leftEdgeXZPolylineDistanceM:trace(left.map(v=>[v[0],v[1],v[2]]),player.p).distanceM,
     rightEdgeXZPolylineDistanceM:null,
     nativeForwardSpeedMps:round(dot(player.v,player.forward)),
     roadTangentForwardSpeedMps:round(dot(player.v,f.forward))
   };
   // Horizontal XZ-only segment distance (no elevation) is a separate approximation.
   const horizontalTrace=track=>{
    let best=Infinity;
    for(let i=0;i<track.length-1;i++)best=Math.min(best,distSegment(player.p,track[i],track[i+1],true).distanceM);
    return round(best);
   };
   record.leftEdgeXZPolylineDistanceM=horizontalTrace(left);
   record.rightEdgeXZPolylineDistanceM=horizontalTrace(right);
   actual.push(record);
   if(pre.support?.road===road)lastSupports.push({tick,timeSeconds:round(player.time),position:vec(prePosition)});
   hasLateSamples.push(tick);
  }
 }
 assert.equal(prefixTicks.length,2);
 assert.equal(JSON.stringify(doc),snapshot,'course source mutated');
 assert.equal(player.status,ref.trueNativeTerminalState);
 assert.ok(Math.abs(player.time-ref.terminalOrCapSeconds)<.000003);
 assert.ok(Math.abs(nextGroundedTicks*DT-ref.actualNextRoadGroundedSeconds)<.000003);
 assert.ok(Math.abs(scissorGroundedTicks*DT-ref.actualScissorGroundedSeconds)<.000003);
 assert.equal(oldSampleChecks,ref.actualNativeTenHzPlusTransitionTimeline.length);
 assert.equal(actual.length,endTick-startTick+1,'240Hz window was prematurely truncated');
 const lastSupported=actual.filter(x=>x.preStepSelectedSupport?.road===road).at(-1);
 const firstUnsupported=actual.find(x=>x.tick>lastSupported.tick && x.preStepSelectedSupport?.road!==road);
 assert.ok(lastSupported&&firstUnsupported);
 assert.ok(Math.abs(lastSupported.timeSeconds-startTime)<DT*2);
 output.results[world]={world,prefixTicks,priorR1NativeTimelineSamplesMatched:oldSampleChecks,
  nativeTerminalStatus:player.status,nativeTerminalTimeSeconds:round(player.time),
  actualLowerGroundedSeconds:round(nextGroundedTicks*DT),actualScissorGroundedSeconds:round(scissorGroundedTicks*DT),
  sourceR1NativeTelemetryParity:true,
  lastSupportedTick:lastSupported.tick,firstUnsupportedTick:firstUnsupported.tick,
  lastSupportedTimeSeconds:lastSupported.timeSeconds,
  lastSupportedPositionXYZ:lastSupported.prePositionXYZ,
  firstUnsupportedPrePositionXYZ:firstUnsupported.prePositionXYZ,
  lastSupportedContact:lastSupported.preStepSelectedSupport,
  firstUnsupportedPreStepNearestContact:firstUnsupported.preStepClosestCollisionContact,
  lastSupportedRoadCentreUProxy:lastSupported.nearestRoadCentreUProjectionProxy,
  lastSupportedLeftEdge3DM:lastSupported.leftEdge3DPolylineDistanceM,
  lastSupportedRightEdge3DM:lastSupported.rightEdge3DPolylineDistanceM,
  lastSupportedLeftEdgeXZApproxM:lastSupported.leftEdgeXZPolylineDistanceM,
  lastSupportedRightEdgeXZApproxM:lastSupported.rightEdgeXZPolylineDistanceM,
  maxNativePerStepDeltaInWindowMps:Math.max(...actual.map(x=>x.fullStepDeltaVelocityMps)),
  realOriginalB48Rows6To22Geometry:geometry(doc),
  allNative240HzWindowSamples:actual};
 console.log('R15S3D7_NATIVE_SUPPORT_FORENSIC',JSON.stringify({world,terminal:player.status,windowTicks:actual.length,
  oldParity:oldSampleChecks,lastSupported:output.results[world].lastSupportedTimeSeconds,
  lastSupportU:lastSupported.nearestRoadCentreUProjectionProxy,
  edgeDistances3D:[lastSupported.leftEdge3DPolylineDistanceM,lastSupported.rightEdge3DPolylineDistanceM],
  lastNormal:lastSupported.preStepSelectedSupport?.normalXYZ,
  noCcdImpulseProof:true}));
}
fs.mkdirSync(get('--out'),{recursive:true});
fs.writeFileSync(get('--out')+'/R15S3D7_TWO_WORLD_NATIVE_SUPPORT_LOSS_FORENSIC.json',JSON.stringify(output,null,2)+'\n');

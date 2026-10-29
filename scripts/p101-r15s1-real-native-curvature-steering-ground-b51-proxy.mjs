/**
 * R15S-1 RESEARCH ONLY. Native 240Hz physical support, true steering input,
 * actual source chase camera, time-synced B51 center-in-frustum PROXY, and
 * geometric ROAD curvature/edge PROXIES. Never confuse any proxy with native
 * CCD, genuine unobstructed vision, human control or gameplay certification.
 * Source code and base road B48/B51/240Hz engine are never modified.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {buildR15Q,R15Q_MODES} from './p101-r15q-isolated-b48-scissor-c1-curve-and-narrow-route.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT,RADIUS,routeFrame} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
import {capturePose,createCameraState,advanceCamera,viewForPose} from '../web/drive3d-camera.mjs';
const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
const ROADS=['true-pinch','pinch-switch'];
const get=(key)=>{const i=process.argv.indexOf(key);assert.ok(i>0&&process.argv[i+1],'missing '+key);return process.argv[i+1];};
const source=JSON.parse(fs.readFileSync(get('--r15q'),'utf8'));
assert.equal(source.originalGameSourceBlob,SHA);
assert.equal(source.trueOriginal240HzFullTrialCount,8);
const round=(x,n=5)=>Number(x.toFixed(n));
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const mag=(v)=>Math.hypot(...v);
const mul=(v,k)=>v.map(x=>x*k);
const safe=(v)=>mag(v)>1e-8?mul(v,1/mag(v)):[0,0,0];
const cross2=(a,b)=>a[0]*b[1]-a[1]*b[0];
const cl=(x)=>Math.max(0,Math.min(1,x));
const geometry=(s)=>{
 const out=[];
 for(let i=0;i<=240;i++){
  const u=i/240,a=sample(s,u,0),b=sample(s,u,1),c=sample(s,u,.5);
  out.push({u,centre:c,width:Math.hypot(b[0]-a[0],b[2]-a[2])});
 }
 for(let i=0;i<out.length;i++){
  const prev=out[Math.max(0,i-1)].centre,p=out[i].centre,next=out[Math.min(out.length-1,i+1)].centre;
  const a=[p[0]-prev[0],p[2]-prev[2]],b=[next[0]-p[0],next[2]-p[2]];
  const c=[next[0]-prev[0],next[2]-prev[2]];
  const denom=mag(a)*mag(b)*mag(c);
  out[i].signedCurvature=denom>1e-9?2*cross2(a,b)/denom:0;
  out[i].grade=Math.abs(next[1]-prev[1])/Math.max(1e-7,mag(c));
 }
 return out;
};
function nearestRoad(pos,curves){
 let best=null;
 for(const road of curves){
  const pts=road.samples;
  for(let i=0;i<pts.length-1;i++){
   const a=pts[i],b=pts[i+1],ab=[b.centre[0]-a.centre[0],b.centre[2]-a.centre[2]];
   const ap=[pos[0]-a.centre[0],pos[2]-a.centre[2]];
   const t=cl(dot(ap,ab)/(dot(ab,ab)||1));
   const delta=[ap[0]-ab[0]*t,ap[1]-ab[1]*t];
   const dist=mag(delta);
   if(!best||dist<best.distance){
    const sign=Math.sign(cross2(ab,ap))||1;
    const width=a.width+(b.width-a.width)*t;
    const curvature=a.signedCurvature+(b.signedCurvature-a.signedCurvature)*t;
    best={road:road.id,u:round(a.u+(b.u-a.u)*t,6),distance:dist,
      signedXZOffsetM:sign*dist,physicalSurfaceWidthXZApproxM:width,
      geometricEdgeMarginProxyM:width/2-dist-RADIUS,curvature,
      grade: a.grade+(b.grade-a.grade)*t};
   }
  }
 }
 return best;
}
function b51CameraProxy(doc,player,view){
 let closest=null,frustum=0,shortProxies=0;
 const aspect=1008/645;
 for(const obstacle of doc.movingObstacles){
  const pose=movingObstaclePose(obstacle,player.time);
  if(pose.enabled===false)continue;
  const d=sub(pose.center,player.p),distance=mag(d);
  const q=sub(pose.center,view.eye),z=dot(q,view.front);
  const ndcX=z>0?1.35*dot(q,view.right)/(z*aspect):Infinity;
  const ndcY=z>0?1.35*dot(q,view.up)/z:Infinity;
  const centreInside=z>0&&Math.abs(ndcX)<=1&&Math.abs(ndcY)<=1;
  if(centreInside)frustum++;
  const straightLineTimeProxy=distance/Math.max(1,mag(player.v));
  if(centreInside&&straightLineTimeProxy<2)shortProxies++;
  if(closest===null||distance<closest.distance)
   closest={id:obstacle.id,distance,centerInFrustum:centreInside,straightLineTimeProxy};
 }
 return {sourceB51Objects:doc.movingObstacles.length,centerInsideUnoccludedFrustumCount:frustum,
  centerInsideAndStraightLineUnder2sProxyCount:shortProxies,
  nearestCenter:closest&&{id:closest.id,distanceM:round(closest.distance),
   centerInsideUnoccludedFrustum:closest.centerInFrustum,
   straightLineTimeProxyS:round(closest.straightLineTimeProxy)}};
}
const results={schema:'dopagaki.r15s1-native-physics-curvature-control-b51-centre-proxy/1',
  sourceBlob:SHA,sourceHz:240,sourceP96EarlySoft:true,
  originalGameModified:false,sourceEngineModified:false,newGameColliders:0,
  sourceB48Variants:ROADS,sourceCurveModes:Object.keys(R15Q_MODES),
  actualNativeTrials:8,sourceR15QQuarterSecondParity:true,
  geometryLabel:'sampled XZ centerline/edge margin; NOT collision distance',
  curvatureLabel:'sampled geometric 2D plan curvature; not full physics force',
  b51Label:'time-correct B51 collision-box CENTERS in unoccluded mathematical source-camera frustum only; NOT actual WebGL visibility or true time-to-collision',
  steeringLabel:'original scaled P96 input; PRE-step nominal steering command 172.8 grounded / 25.9 airborne, but native step RECHECKS contact and lateral damping; NOT realized lateral acceleration or human achievable steering',
  sourceBrowserWebGLRendered:false,humanPlayableCertified:false,
  officialArt:0,officialSlope2Meters:0,
  ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',INTEGRATION:'HOLD',RELEASE:'HOLD',MERGE:'HOLD',
  trials:{}};
for(const road of ROADS){
 const roads={};results.trials[road]=roads;
 for(const mode of Object.keys(R15Q_MODES)){
  const doc=buildR15Q(road,mode),world=compile(doc);
  assert.equal(doc.movingObstacles.length,28);assert.equal(doc.surfaces.length,7);
  assert.equal(doc.surfaces[0].voidLongitudinalCells[0],52);
  const player=new Runner(doc,world,0,52),plan=makeP96RoutePlan(doc,player);
  const surge=createA13SurgeState();
  let camera=createCameraState(player.forward);
  const curves=[1,2].map(i=>({id:doc.surfaces[i].id,samples:geometry(doc.surfaces[i])}));
  const ref=source.nativeScissorRealEditableSurfaceGeometryTrials[road][mode].true240HzOriginalSourcePhysics;
  const byTick=new Map(ref.nativeQuarterSecondSourcePhysicsTrace.map(x=>[x.tick,x]));
  let checks=0,lastGrounded=null,firstScissorGrounded=null,groundedTicks=0;
  let prevGrounded=player.grounded,airStreak=0,maxAirStreak=0,maxConsecutiveGrounded=0,groundStreak=0;
  const samples=[];
  for(let tick=1;tick<=Math.round(32/DT);tick++){
   if(player.status==='failed'||player.status==='finished')break;
   const preStepGrounded=Boolean(player.grounded);
   const steer=p96DodgeSteer(player,plan,'early-soft',movingObstaclePose).input/4.8;
   p101Step(player,steer,'OVERDRIVE',{forwardScale:p101A13ForwardScale(player,surge),collisionRecovery:false});
   camera=advanceCamera(camera,player.forward,DT);
   const contact=Boolean(player.grounded&&player.surface);
   if(contact){
    groundedTicks++;groundStreak++;airStreak=0;
    lastGrounded={tick,timeSeconds:round(player.time,6),road:player.surface};
    if(player.surface===doc.surfaces[2].id&&firstScissorGrounded===null)
     firstScissorGrounded={tick,timeSeconds:round(player.time,6)};
    maxConsecutiveGrounded=Math.max(maxConsecutiveGrounded,groundStreak);
   }else{airStreak++;groundStreak=0;maxAirStreak=Math.max(maxAirStreak,airStreak);}
   prevGrounded=contact;
   if(tick>=Math.round(15/DT)&&(tick%60===0||player.status==='failed'||player.status==='finished')){
    const expected=byTick.get(tick);
    assert.ok(expected,'missing R15Q genuine reference tick '+road+' '+mode+' '+tick);
    assert.ok(mag(sub(player.p,expected.playerWorldXYZ))<1e-5,'source XYZ parity');
    assert.equal(contact,expected.engineGrounded,'source contact parity');
    assert.equal(player.surface,expected.sourceRoad,'source road parity');
    assert.ok(Math.abs(mag(player.v)-expected.speedMps)<.00011,'source velocity parity');
    assert.ok(Math.abs(steer-expected.steer)<.00011,'source original steer parity');
    assert.equal(player.status,expected.nativeStatus,'source status parity');
    checks++;
   }
   if(tick%12===0&&tick>=Math.round(15/DT)||tick%60===0||player.status==='failed'){
    const view=viewForPose(capturePose(player),camera);
    const near=nearestRoad(player.p,curves);
    const hz=b51CameraProxy(doc,player,view);
    const velocity=mag(player.v);
    const nominal=preStepGrounded?172.8:25.9;
    const required=velocity*velocity*Math.abs(near.curvature);
    const guide=routeFrame(doc.route,player.p);
    samples.push({tick,seconds:round(player.time,6),actualNativeStatus:player.status,
      actualNativeGrounded:contact,actualNativeRoad:player.surface,
      speedMps:round(velocity),trueNativeInput:round(steer,6),preStepGroundedForInput:preStepGrounded,
      nominalCommandedSteeringAccelerationMps2:round(nominal*steer),
      fullSteerNominalSourceAccelerationMps2:nominal,
      guideDistance3dM:round(guide.distance),roadCurveId:near.road,approxU:near.u,
      approxRoadWidthXZ:round(near.physicalSurfaceWidthXZApproxM),
      approxSignedXZTrackOffsetM:round(near.signedXZOffsetM),
      approxGeometricEdgeMarginM:round(near.geometricEdgeMarginProxyM),
      approxPlanCurvaturePerM:round(near.curvature,8),
      approxPlanTurnRadiusM:Math.abs(near.curvature)>1e-8?round(1/Math.abs(near.curvature)):null,
      approxPlanCurveRequiredLateralAccelerationMps2:round(required),
      approxCentreGrade:round(near.grade),
      b51CameraCenterProxy:hz});
   }
  }
  assert.equal(player.status,ref.originalSourceStatus,'original R15Q final status');
  assert.ok(Math.abs(player.time-ref.originalSourceTerminalTimeSeconds)<.00001,'R15Q terminal time');
  assert.equal(checks,byTick.size,'full R15Q source quarter trace compared');
  assert.equal(player.status,'failed','R15Q remains a failed fixed-input trial');
  roads[mode]={sourceB48Roads:doc.surfaces.length,sourceB51Count:doc.movingObstacles.length,
    sourceP96SteeringUnchanged:true,originalR15QQuarterTickParityChecks:checks,
    originalR15QTerminalStatus:player.status,terminalTimeSeconds:round(player.time,6),
    sourceFailReason:player.failure?.reason??null,sourceLastGrounded:lastGrounded,
    firstSCISSORGrounded:firstScissorGrounded,
    actualGroundedTickCount:groundedTicks,
    maxConsecutiveGroundedSeconds:round(maxConsecutiveGrounded*DT,6),
    maxConsecutiveAirborneSeconds:round(maxAirStreak*DT,6),
    actualSourceNativeFinished:player.status==='finished',
    samples,sourceGameplayPass:false,sourceArtPass:false};
  console.log('R15S1_NATIVE_240HZ',road,mode,'terminal',round(player.time,6),
    'lastGrounded',lastGrounded?.timeSeconds,'quarterParity',checks,'samples',samples.length);
 }
}
const out=get('--out');fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(out+'/R15S1_8_TRUE_NATIVE_CURVATURE_CONTROL_B51_CAMERA_PROXIES.json',JSON.stringify(results,null,2)+'\n');

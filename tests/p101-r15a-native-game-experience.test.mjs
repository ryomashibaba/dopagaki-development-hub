import test from 'node:test';
import assert from 'node:assert/strict';
import {centerProjection,inspectMover,auditNativeTimeline} from '../scripts/p101-r15a-native-game-experience-audit.mjs';
const source='af076d67492a677d2235e4730aef8cdf4808e106';
const frame={id:'t1100',front:[0,0,-1],eye:[0,0,0],playerPosition:[0,0,0],speedMps:100,seconds:11,tick:2640,grounded:true,collisions:0,physicalRoad:'road0'};
const mover=(id,center,enabled=true)=>({id,type:'slider',center,halfSize:[1,1,1],enabled});
test('R15A detects only center-frustum candidates, not collision or human fairness',()=>{
 const a=inspectMover(frame,mover('ahead',[0,0,-101]));
 assert.equal(a.projectedCenterInFrustum,true);
 assert.equal(a.withinTwoSecondDistanceEquivalent,true);
 assert.equal(a.potentialVisibleTwoSecondCandidate,true);
 assert.equal(inspectMover(frame,mover('behind',[0,0,20])).projectedCenterInFrustum,false);
 assert.equal(inspectMover(frame,mover('far',[0,0,-300])).withinTwoSecondDistanceEquivalent,false);
 assert.equal(inspectMover(frame,mover('disabled',[0,0,-20],false)).potentialVisibleTwoSecondCandidate,false);
 assert.equal(centerProjection(frame,[0,0,0]),null);
});
test('R15A refuses falsely promoted or changed-source evidence',()=>{
 const movers=Array.from({length:28},(_,i)=>mover('m'+i,[0,0,-100-i]));
 const timeline={sourceCXBlob:source,originalCX:18,originalB48:7,originalB51:28,originalCameras:5,
  physicsHz:240,sourceGameChanged:false,newGameColliders:0,officialArt:0,officialSlope2Meters:0,
  sampleTimesSeconds:Array.from({length:13},(_,i)=>11+i*.5),sampledTickWindow:{},
  originalTrajectoryParity:Array.from({length:7},(_,i)=>({id:'t'+i})),
  road:'true-pinch',frames:Array.from({length:13},(_,i)=>({...frame,id:'t'+i,moving:movers,
   originalSource:'ACTUAL_240HZ_START00_P96_FIXED_SCRIPT_NOT_HUMAN'}))};
 const r=auditNativeTimeline(timeline);
 assert.equal(r.observedFrames.length,13);
 assert.equal(r.summary.sourceFramesWithProjectedMoverCenters,13);
 assert.equal(r.actualBrowserWebGL,'NOT_RUN');
 assert.equal(r.officialArt,0);
 assert.equal(r.officialSlope2Meters,0);
 assert.equal(r.GAMEPLAY,'HOLD');
 assert.throws(()=>auditNativeTimeline({...timeline,officialArt:1}),/contract/);
 assert.throws(()=>auditNativeTimeline({...timeline,sourceGameChanged:true}),/contract/);
 assert.throws(()=>auditNativeTimeline({...timeline,frames:[...timeline.frames.slice(0,12),{...frame,moving:[]}]}),/28 original/);
});
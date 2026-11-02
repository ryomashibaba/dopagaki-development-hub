/**
 * R15S2A: quantify the P96 requested lateral avoidance offset against
 * source-real R15Q SCISSOR 16m road width. This is an INPUT-TARGET
 * incompatibility audit, NOT a proof of actual physics loss or human unfairness.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {R15Q_MODES,buildR15Q} from './p101-r15q-isolated-b48-scissor-c1-curve-and-narrow-route.mjs';
import {P96_PROFILES} from '../web/p96-avoidance-steer.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {RADIUS} from '../private/reference_only/director/physics.js';
const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
const ROADS=['true-pinch','pinch-switch'];
const BASE='B16_ONLY_REFERENCE',NARROW='C_CURVE_SHIFT_30M_NARROW_16M';
const round=(x,n=6)=>Number(x.toFixed(n));
const widthAt=(s,u)=>{
 const a=sample(s,u,0),b=sample(s,u,1);
 return Math.hypot(a[0]-b[0],a[2]-b[2]);
};
const minimum=(s)=>{
 const samples=Array.from({length:141},(_,i)=>{
  const u=i/(10*30),w=widthAt(s,u);
  return {u:round(u),widthM:round(w)};
 });
 return samples.reduce((a,b)=>a.widthM<b.widthM?a:b);
};
const output={schema:'dopagaki.r15s2a-source-real-16m-p96-desired-offset-feasibility/1',
 originalGameBlob:SHA,originalSourceUnmodified:true,physicsOrControllerModified:false,
 researchOnly:true,sourceWorlds:ROADS,sourceGeometry:[BASE,NARROW],
 genuineFull240HzRunsInThisAudit:0,sourceB51DefinitionsPreserved:true,
 question:'At the actual physically narrowed SCISSOR cross-section, is P96 desired avoidance lateral offset compatible with simple width/2 minus native ball radius?',
 caveat:'P96 desiredOffset is advisory input target used in offsetGain*leadWeight; NOT a commanded player position, no collision prediction, not evidence that actual P96 caused a particular fall.',
 performanceOrWebGLMeasured:false,humanFairnessMeasured:false,
 officialArt:0,officialSlope2Meters:0,ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',
 PERFORMANCE:'HOLD',INTEGRATION:'HOLD',RELEASE:'HOLD',MERGE:'HOLD',worlds:{}};
assert.equal(RADIUS,.65);
assert.equal(Object.keys(R15Q_MODES).length,4);
assert.deepEqual(P96_PROFILES.map(p=>p.id),['near-soft','early-soft','early-strong','fast-switch']);
for(const road of ROADS){
 const wide=buildR15Q(road,BASE),narrow=buildR15Q(road,NARROW);
 assert.equal(wide.surfaces.length,7);
 assert.equal(wide.movingObstacles.length,28);
 assert.deepEqual(wide.movingObstacles,narrow.movingObstacles);
 const w=minimum(wide.surfaces[2]),n=minimum(narrow.surfaces[2]);
 assert.ok(w.widthM>30,'real original SCISSOR road wide reference');
 assert.ok(n.widthM>=8&&n.widthM<=20,'real 16m local narrowed SCISSOR');
 assert.ok(n.widthM<w.widthM-20,'real narrowing found');
 const safe=n.widthM/2-RADIUS;
 assert.ok(safe>0);
 const profiles=P96_PROFILES.map(p=>({
  id:p.id,originalRequestedOffsetM:p.laneMeters,
  sourceProfileLeadMeters:p.leadMeters,sourceProfileOffsetGain:p.offsetGain,
  approximateMaxBallCenterOffsetBeforeEdgeM:round(safe),
  excessNominalOffsetBeyondEdgeM:round(p.laneMeters-safe),
  rawRequestedOffsetExceedsApproximateRoadEdge:p.laneMeters>safe
 }));
 assert.ok(profiles.every(p=>p.rawRequestedOffsetExceedsApproximateRoadEdge));
 output.worlds[road]={sourceB48Count:wide.surfaces.length,sourceB51Count:wide.movingObstacles.length,
  originalSCISSOREarlySampleMinimumXZWidth:w,
  narrowedSCISSOREarlySampleMinimumXZWidth:n,
  sourceBallRadiusM:RADIUS,profiles,conclusion:'STATIC_DESIRED_OFFSET_OUTSIDE_NARROW_CORRIDOR_NOT_ACTUAL_PLAYER_POSITION'};
 console.log('R15S2A_NARROW_P96_SOURCE_MISMATCH',road,JSON.stringify({wide:w,narrow:n,safe:round(safe),profiles}));
}
const args=process.argv.slice(2),i=args.indexOf('--out');
assert.ok(i>=0&&args[i+1],'missing --out');
fs.mkdirSync(args[i+1],{recursive:true});
fs.writeFileSync(args[i+1]+'/R15S2A_SOURCE_16M_P96_DESIRED_STEERING_WIDTH_COMPATIBILITY.json',JSON.stringify(output,null,2)+'\n');

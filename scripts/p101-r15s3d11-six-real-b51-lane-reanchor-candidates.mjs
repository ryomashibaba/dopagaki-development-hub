/** R15S3D11: PRIVATE two hazard approaches on R15S3D9 REAL FINISHED B48.
 * Only SIX of 28 original physical B51 are re-anchored; no new objects, no
 * original physics, CCD, input, route, rendering, camera, CROWN or B48 edits.
 * A: alternating readable outboard moving hazards (center remains possible).
 * B: inner-lane movers / real avoid-or-contact challenge.
 * Neither variant is human-certified or ART approved.
 */
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {buildR15S3D9} from './p101-r15s3d9-source-real-road5-road6-integrated-macro.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {validate} from '../private/reference_only/director/surface.js';
export const MODES=Object.freeze(['A_EDGE_READABLE','B_INNER_CROSSING']);
const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const norm=v=>{const d=Math.hypot(...v)||1;return v.map(x=>x/d)};
const anchors=Object.freeze([
 {road:5,u:.16,side:'right'},{road:5,u:.43,side:'left'},
 {road:5,u:.74,side:'right'},{road:6,u:.18,side:'left'},
 {road:6,u:.47,side:'right'},{road:6,u:.77,side:'left'}
]);
export function buildR15S3D11(world,mode){
 assert.ok(['true-pinch','pinch-switch'].includes(world));
 assert.ok(MODES.includes(mode));
 const baseline=buildR15S3D9(world,'A_CONTINUOUS_NARROW_MACRO'),before=JSON.stringify(baseline);
 assert.equal(baseline.surfaces.length,7);assert.equal(baseline.movingObstacles.length,28);
 const doc=structuredClone(baseline),chosen=doc.movingObstacles.slice(-6);
 assert.equal(chosen.length,6);
 const mutated=[];
 for(let i=0;i<6;i++){
  const old=baseline.movingObstacles[22+i],ob=doc.movingObstacles[22+i],anchor=anchors[i];
  assert.equal(ob.id,old.id);
  const s=doc.surfaces[anchor.road],right=anchor.side==='right';
  const v=mode==='A_EDGE_READABLE'?(right?.93:.07):(right?.66:.34);
  const position=sample(s,anchor.u,v),a=sample(s,anchor.u,0),b=sample(s,anchor.u,1);
  const axis=norm([b[0]-a[0],0,b[2]-a[2]]);
  const newPosition=[position[0],position[1]+1.9,position[2]];
  // Original object IDs, types, collision modes, durations and phases are
  // preserved. Explicitly scale the REAL B51 collision/visible body for an
  // honest narrow 16m road instead of hiding a 50m-width old physics box.
  ob.position=newPosition;
  ob.size=ob.type==='rotator'?[3.4,3.4,2.8]:[3.6,3.4,3.6];
  if(ob.type==='slider')ob.motion={...ob.motion,axis,amplitude:mode==='A_EDGE_READABLE'?1.8:3.2};
  if(ob.type==='piston')ob.motion={...ob.motion,stroke:mode==='A_EDGE_READABLE'?1:2};
  assert.ok(eq(old.collision,ob.collision));
  assert.equal(old.type,ob.type);assert.equal(old.period,ob.period);assert.equal(old.phase,ob.phase);
  assert.ok(!eq(old,ob));
  mutated.push({id:ob.id,type:ob.type,originalWorldXYZ:old.position,
   editedWorldXYZ:ob.position,roadIndex:anchor.road,roadName:s.id,
   u:anchor.u,laneV:v,realApproxWidthM:Math.hypot(b[0]-a[0],b[2]-a[2]),
   bodyXYZ:ob.size,collisionMode:ob.collision?.mode??'fail',
   originalPeriodSeconds:ob.period,originalPhase:ob.phase,
   positionChanged:true,actualOriginalMovingSolid:true,
   alteredSourceObjectIndex:22+i});
 }
 assert.equal(JSON.stringify(baseline),before,'source generator mutated baseline');
 assert.ok(eq(doc.surfaces,baseline.surfaces));
 assert.ok(eq(doc.route,baseline.route)&&eq(doc.routeSegments,baseline.routeSegments));
 assert.ok(eq(doc.spawns,baseline.spawns));
 assert.ok(eq(doc.fixtures,baseline.fixtures));
 assert.ok(doc.movingObstacles.slice(0,22).every((x,i)=>eq(x,baseline.movingObstacles[i])));
 assert.equal(mutated.length,6);assert.equal(new Set(mutated.map(x=>x.id)).size,6);
 const resultHash=crypto.createHash('sha256').update(JSON.stringify(doc.movingObstacles)).digest('hex');
 doc.name=baseline.name+' R15S3D11 '+mode+' REAL PRIVATE SIX-MACHINE STUDY';
 doc.stageForge={...doc.stageForge,productionPromoted:false,r15s3d11:{
  schema:'dopagaki.r15s3d11-6-real-original-b51-reanchor-private/1',
  world,mode,originalGameBlob:SHA,realB48:7,realB51:28,
  originalB48EntireSourcePreserved:true,originalMachineCountUnchanged:true,
  onlyLastSixPhysicalB51Relocated:true,originalOther22B51Frozen:true,
  originalIDsTypesPhasesPeriodsCollisionModesPreserved:true,
  source240HzCCDInputRouteCameraUnchanged:true,
  extraHazards:0,hiddenRescueOrPhysicalFloor:0,
  changedMachines:mutated,movingPhysicalB51SHA256:resultHash,
  genuineSourceFinishedPrior2of2:true,variantCanBeFailed:true,
  realBrowserNotYetTested:true,humanPlayabilityNotCertified:true,
  officialArt:0,formalSlope2Meters:0,GAMEPLAY:'HOLD',ART:'HOLD',HUMAN:'HOLD',
  RELEASE:'HOLD'}};
 const validated=validate(doc);
 assert.equal(validated.surfaces.length,7);assert.equal(validated.movingObstacles.length,28);
 return validated;
}

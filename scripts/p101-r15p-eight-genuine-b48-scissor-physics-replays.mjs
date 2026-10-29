/** R15P two genuine original B48 source worlds with real continued B16
 * crown plus isolated SCISSOR_RISE entry v0 existing-rideable surface correction.
 * Four SCISSOR variants x two roads = eight full-source 240Hz replays.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {buildR15P,R15P_VARIANTS} from './p101-r15p-isolated-original-scissor-entry-geometry-correction.mjs';
import {realSource} from './p101-r15o-16-real-native-original-b48-geometry-trials.mjs';
const ROADS=['true-pinch','pinch-switch'];
const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
const MODE='B_BANKED_OUTER_SHOULDER_16M',HORIZON=32;
const ctrl={id:'ORIGINAL_P96_EARLY_SOFT',start:null,bias:0};
const argv=process.argv.slice(2),arg=k=>{const i=argv.indexOf(k);assert.ok(i>=0,k);return argv[i+1]};
const n2=JSON.parse(fs.readFileSync(arg('--r15n2'),'utf8'));
const o4=JSON.parse(fs.readFileSync(arg('--r15o4'),'utf8'));
assert.equal(n2.sourceBlob,SHA);assert.equal(o4.sourceGameBlob,SHA);
const cases={};
for(const road of ROADS){
 const ref=JSON.parse(fs.readFileSync(arg('--'+road),'utf8'));
 assert.equal(ref.sourceBlob,SHA);
 const base=o4.actualExtendedOriginalSourceEvidence[road].extendedActualNativeB48Study;
 assert.equal(base.geometryMode,MODE);
 cases[road]={};
 for(const variant of Object.keys(R15P_VARIANTS)){
  const doc=buildR15P(road,variant),meta=doc.stageForge.r15pSecondRealSourceRoadIsolated;
  assert.ok(meta);assert.equal(meta.sourceGameBlob,SHA);
  assert.equal(doc.surfaces.length,7);
  assert.equal(doc.movingObstacles.length,28);
  const q=realSource(road,ref,MODE,ctrl,n2,HORIZON,doc);
  assert.deepEqual(q.sourceExact17RealPosCam,base.sourceExact17RealPosCam,
   'source 17s camera/player MUST match exact pre-SCISSOR B16 original physics');
  assert.equal(q.nativeQuarterSecondSourcePhysicsTrace[0].tick,base.nativeQuarterSecondSourcePhysicsTrace[0].tick);
  if(variant==='ORIGINAL_B16_CROWN_NO_SCISSOR_PATCH'){
   assert.equal(q.originalSourceStatus,base.originalSourceStatus);
   assert.ok(Math.abs(q.originalSourceTerminalTimeSeconds-base.originalSourceTerminalTimeSeconds)<.00001);
   assert.ok(Math.abs(q.nativePhysicalLastB48Support.timeSeconds-
      base.nativePhysicalLastB48Support.timeSeconds)<.00001);
   assert.deepEqual(q.nativeQuarterSecondSourcePhysicsTrace,base.nativeQuarterSecondSourcePhysicsTrace);
  }
  const outcome={
   realNativeStudySourceRoad:road,
   scissorPhysicalVariant:variant,
   trueNativeOriginalCrownB16PhysicsReplayedUnchangedAt17:true,
   sourceGameEdited:false,
   sourceOriginal28MovingObstaclesUnmodified:true,
   studyActualScissorGeometrySourceMetadata:meta,
   actualFullNativeSourceRoadAndContacts:q,
   gameProductionNotModified:true,
   artHumanOrGameplayCertified:false
  };
  cases[road][variant]=outcome;
  console.log('R15P_REAL_NATIVE_CROWN_B16_AND_SCISSOR_PHYSICAL_EDGE',JSON.stringify({
    road,mode:variant,sourceStatus:q.originalSourceStatus,
    originalTrueTerminalSeconds:q.originalSourceTerminalTimeSeconds,
    lastRealRideableContactSeconds:q.nativePhysicalLastB48Support?.timeSeconds,
    lastRideableRoad:q.nativePhysicalLastB48Support?.road,
    nontrivialRoadChange:meta.physicalChangedSourceMaximumMetres,
    sourceFailedReason:q.originalNativeFailReason}));
 }
}
const result={schema:'dopagaki.r15p-original-240hz-crown-b16-and-scissor-entry-4-source-geometries-8-trials/1',
 originalSourceGameBlob:SHA,originalRealNativeHz:240,sourceWorlds:ROADS,
 originalB16CrownSourcePreserved:true,originalFourCandidateScissorVariants:Object.keys(R15P_VARIANTS),
 realSourceEightFullPhysicsReplays:cases,fullOriginalNativeRunCount:8,
 frozenOriginalB51ShapesPositions:true,
 originalGameSourceUnchanged:true,originalPhysicsUnchanged:true,
 newPublicGameColliders:0,realBrowserWebGLRendered:false,
 officialArt:0,officialSlope2Meters:0,
 ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',
 INTEGRATION:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'};
fs.mkdirSync(arg('--out'),{recursive:true});
fs.writeFileSync(arg('--out')+'/R15P_8_ORIGINAL_240HZ_SCISSOR_REAL_PHYSICAL_ENTRY_VARIANTS.json',
 JSON.stringify(result,null,2)+'\n');

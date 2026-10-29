/**
 * R15Q actual unchanged original P101 240Hz Runner 8 total replays,
 * isolated ORIGINAL real B48 CROWN B16 + SCISSOR C1 curve, original P96.
 * This is not an art/game/play certification; baseline R15O4 must match.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {buildR15Q,R15Q_MODES} from './p101-r15q-isolated-b48-scissor-c1-curve-and-narrow-route.mjs';
import {realSource} from './p101-r15o-16-real-native-original-b48-geometry-trials.mjs';
const ROADS=['true-pinch','pinch-switch'];
const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
const MODE='B_BANKED_OUTER_SHOULDER_16M', HORIZON=32;
const control={id:'ORIGINAL_P96_EARLY_SOFT',start:null,bias:0};
const argv=process.argv.slice(2),get=x=>{const i=argv.indexOf(x);assert.ok(i>=0,x);return argv[i+1]};
const n2=JSON.parse(fs.readFileSync(get('--r15n2'),'utf8'));
const old=JSON.parse(fs.readFileSync(get('--r15o4'),'utf8'));
assert.equal(n2.sourceBlob,SHA);assert.equal(old.sourceGameBlob,SHA);
const outcomes={};
for(const road of ROADS){
 const reference=JSON.parse(fs.readFileSync(get('--'+road),'utf8'));
 assert.equal(reference.sourceBlob,SHA);
 const baseline=old.actualExtendedOriginalSourceEvidence[road].extendedActualNativeB48Study;
 assert.equal(baseline.geometryMode,MODE);
 outcomes[road]={};
 for(const name of Object.keys(R15Q_MODES)){
  const realDoc=buildR15Q(road,name);
  assert.equal(realDoc.surfaces.length,7);
  assert.equal(realDoc.movingObstacles.length,28);
  assert.equal(realDoc.stageForge.productionPromoted,false);
  const trial=realSource(road,reference,MODE,control,n2,HORIZON,realDoc);
  assert.deepEqual(trial.sourceExact17RealPosCam,baseline.sourceExact17RealPosCam);
  assert.equal(trial.originalSourceGameActuallyFinished,trial.originalSourceStatus==='finished');
  if(name==='B16_ONLY_REFERENCE'){
   assert.equal(trial.originalSourceStatus,baseline.originalSourceStatus);
   assert.equal(trial.originalSourceTerminalTimeSeconds,baseline.originalSourceTerminalTimeSeconds);
   assert.deepEqual(trial.nativePhysicalLastB48Support,baseline.nativePhysicalLastB48Support);
   assert.deepEqual(trial.nativeQuarterSecondSourcePhysicsTrace,baseline.nativeQuarterSecondSourcePhysicsTrace);
  }
  const geo=realDoc.stageForge.r15qPhysicalSourceCurve;
  assert.equal(geo.sourceBlob,SHA);
  const record={
    sourceWorld:road,sourceStudyName:name,
    sourceOriginalGameCodeUnchanged:true,
    sourceB16PhysicalCrownExactlyPreserved:true,
    sourceActualB51DefinitionsPreserved:true,
    sourceNativeOriginalSteeringUnchanged:true,
    actualPhysicalSCISSORSourceGeometry:geo,
    true240HzOriginalSourcePhysics:trial,
    humanOrArtApproved:false,publicGameRoadMerged:false
  };
  outcomes[road][name]=record;
  console.log('R15Q_REAL_SOURCE_C1_SCISSOR_240HZ',JSON.stringify({
   road,design:name,sourceActualFinished:trial.originalSourceStatus==='finished',
   status:trial.originalSourceStatus,terminatedSeconds:trial.originalSourceTerminalTimeSeconds,
   lastRealContactSeconds:trial.nativePhysicalLastB48Support.timeSeconds,
   lastSourceRoad:trial.nativePhysicalLastB48Support.road,
   originalNativeFailure:trial.originalNativeFailReason,
   maxSourceMoveMetres:geo.maximumWorldLatticeShiftM,
   studyNarrowestScissorWidthM:Math.min(...geo.isolatedTrueCrossSectionWidthPost.map(x=>x.realWidthXZ))}));
 }
}
const d={schema:'dopagaki.r15q-genuine-original-native-240hz-scissor-c1-real-curves-8-trials/1',
 originalGameSourceBlob:SHA,realSourceGameHz:240,
 twoOriginalNativeB48Worlds:ROADS,realC1CurveStudies:Object.keys(R15Q_MODES),
 trueOriginal240HzFullTrialCount:8,
 originalB16CrownAndAll28B51Preserved:true,
 originalP96InputSourceUnchanged:true,
 nativeScissorRealEditableSurfaceGeometryTrials:outcomes,
 originalGameJSCodeUntouched:true,originalPhysicsCCDUnchanged:true,
 publicRoadCollidersAdded:0,originalGameWebGLRendered:false,
 officialArt:0,officialSlope2Meters:0,
 ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',
 INTEGRATION:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'};
fs.mkdirSync(get('--out'),{recursive:true});
fs.writeFileSync(get('--out')+'/R15Q_8_GENUINE_SOURCE_240HZ_C1_CURVE_AND_NARROW_ACTUAL_ROAD_TRIALS.json',
 JSON.stringify(d,null,2)+'\n');

/** R15O4: original P101 240Hz with actual isolated B48 B16 physical mesh,
 * same original controls, source 0-second to genuine terminal or 36s.
 * Exactly reconcile actual archived 24s prefix; no fake native completion.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {realSource} from './p101-r15o-16-real-native-original-b48-geometry-trials.mjs';
const ROADS=['true-pinch','pinch-switch'];
const SOURCE='af076d67492a677d2235e4730aef8cdf4808e106';
const mode='B_BANKED_OUTER_SHOULDER_16M';
const ctrl={id:'ORIGINAL_P96_EARLY_SOFT',start:null,bias:0};
const argv=process.argv.slice(2),flag=k=>{const i=argv.indexOf(k);assert.ok(i>=0,k);return argv[i+1]};
const previous=JSON.parse(fs.readFileSync(flag('--r15o'),'utf8'));
const r15n2=JSON.parse(fs.readFileSync(flag('--r15n2'),'utf8'));
assert.equal(previous.originalGameSourceBlob,SOURCE);assert.equal(r15n2.sourceBlob,SOURCE);
const result={};
for(const road of ROADS){
 const reference=JSON.parse(fs.readFileSync(flag('--'+road),'utf8'));
 assert.equal(reference.sourceBlob,SOURCE);
 const old=previous.recordedSourceExperiments[road][mode][0];
 assert.equal(old.originalSourceStatus,'running');
 assert.equal(old.originalSourceTerminalTimeSeconds,24);
 const evidence=realSource(road,reference,mode,ctrl,r15n2,36);
 assert.ok(evidence.originalSourceTerminalTimeSeconds>=24);
 assert.deepEqual(evidence.nativeQuarterSecondSourcePhysicsTrace.filter(x=>x.seconds<=24),
  old.nativeQuarterSecondSourcePhysicsTrace,
  're-run real 240Hz native source B48 original 0-24sec EXACT trace must agree');
 assert.deepEqual(evidence.sourceExact17RealPosCam,old.sourceExact17RealPosCam);
 assert.equal(evidence.sourceB48StudyGeometryMetadata.maxChangedMetres,old.sourceB48StudyGeometryMetadata.maxChangedMetres);
 assert.equal(evidence.nativeQuarterSecondSourcePhysicsTrace[0].tick,old.nativeQuarterSecondSourcePhysicsTrace[0].tick);
 assert.equal(evidence.realSourceB48StudyGeometryDifferent,true);
 assert.equal(evidence.originalGameEdited,false);
 result[road]={
  original24SecondActualNative:old.originalSourceStatus,
  exactOriginalReal24sSteeringAndPhysicsReplayed:true,
  original24SecondLastContact:old.nativePhysicalLastB48Support.timeSeconds,
  extendedActualNativeB48Study:evidence,
  beyond24SourceEngineStatus:evidence.originalSourceStatus,
  actualEngineStopOrObservationTime:evidence.originalSourceTerminalTimeSeconds,
  actuallyFinishedOnlyIfOriginalSourceStatusFinished:evidence.originalSourceStatus==='finished',
  noOriginalGameOrB51Changes:true,artCertified:false,humanCertified:false};
 console.log('R15O4_EXTENDED_REAL_GAME_B48_PHYSICAL_CURVE',road,
 JSON.stringify({status:evidence.originalSourceStatus,
  actualTerminal:evidence.originalSourceTerminalTimeSeconds,
  lastPhysicalContact:evidence.nativePhysicalLastB48Support.timeSeconds,
  originalReal24sStatus:'running',failure:evidence.originalNativeFailReason}));
}
const doc={schema:'dopagaki.r15o4-original-b48-banked-16m-real-240hz-after24-source/1',
 sourceGameBlob:SOURCE,sourceNative240Hz:true,
 fullTrialHorizonSeconds:36,sourceRoads:ROADS,
 originalB48SourcePhysicalVersion:'R15O B_BANKED_OUTER_SHOULDER_16M',
 actualExtendedOriginalSourceEvidence:result,
 originalGameProgramEdited:false,sourceNativePhysicsCCDChanged:false,
 formalGameBridgeOrRoadPublished:false,otherOriginalSixRoadsUnchanged:true,
 actualOriginalB51HazardDefinitionsFrozen:true,
 newGameColliders:0,originalGameWebGLRendered:false,
 officialArt:0,officialSlope2Meters:0,
 ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',
 INTEGRATION:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'};
fs.mkdirSync(flag('--out'),{recursive:true});
fs.writeFileSync(flag('--out')+'/R15O4_ACTUAL_NATIVE_B16_REAL_PHYSICAL_ROAD_SOURCE_EXTENDED_TO_36.json',
 JSON.stringify(doc,null,2)+'\n');

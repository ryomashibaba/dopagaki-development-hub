/**
 * P99 real unmodified 240Hz B48/B51-C measurement on new narrowed skins.
 * Same ordinary [-1,1] steering as the verified P96 run. Never claim the
 * P96 baseline completion also holds for this separate physical candidate.
 */
import {generateP99VariableWidthCandidate,measureP99LaneWidths} from './p99-variable-width-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {probeP96} from './p96-native-dodge-probe.mjs';

export function makeP99PhysicalEvidence(doc=generateP99VariableWidthCandidate()){
 const world=compile(doc);
 const profiles=['near-soft','early-soft','early-strong','fast-switch'];
 const results=profiles.map(profile=>{
  const r=probeP96(profile,{doc,world,limitSeconds:95});
  const {trace,...summary}=r;
  return {...summary,head:trace.slice(0,3),tail:trace.slice(-5)};
 });
 const passed=results.filter(x=>x.status==='SCRIPTED_NATIVE_FULL_PASS'&&x.visited.length===7&&x.finishEvent&&x.machineContacts.length===0);
 const failed=results.filter(x=>x.status==='HOLD_NOT_FULLY_TRAVERSED');
 const machineCount=doc.movingObstacles.filter(x=>x.enabled!==false).length;
 const widths=measureP99LaneWidths(doc);
 if(machineCount!==12||widths.length!==7)throw Error('P99 genuine physical road/moving-machine evidence incomplete');
 // Source metadata is permitted only because the exact new stage was physically
 // proven here, never because the P96 wider road completed in a prior release.
 if(passed.length<2||failed.length<1)throw Error('P99 gameplay gate regressed: expected 2+ native completions and a meaningful physical failure');
 return {
  schema:'dopagaki.p99.native-roadplay/1',
  stageId:doc.stageForge.id,originalP95StageUntouched:true,
  physics:'UNMODIFIED_B48_B51_C_240HZ',activeColliders:machineCount,
  autoSteerGameChange:false,scriptedProfileWins:passed.length,
  verdict:passed.length?'SCRIPTED_FINISH_DEMONSTRATED_HUMAN_HOLD':'HOLD_NO_SCRIPTED_FULL_FINISH',
  nativeProfiles:results,physicalWidths:widths.map(({surface,profile,narrowestWidthMeters,samples})=>({
   surface,profile,narrowestWidthMeters,widthSamples:samples.map(({u,widthMeters})=>({u,widthMeters}))
  })),
  humanPlaytest:'NOT_RUN',playerFairness:'NOT_ASSESSED',
  caveat:'Each run uses the existing input bounds and exact CCD. PASS does not imply the player can handle 140m/s turns.'
 };
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
 const out=makeP99PhysicalEvidence();
 for(const result of out.nativeProfiles){
  console.log('P99_NATIVE_'+result.profile.toUpperCase().replace(/-/g,'_')+' '+JSON.stringify(result));
 }
 console.log('P99_PHYSICAL_SUMMARY '+JSON.stringify({
  verdict:out.verdict,scriptedProfileWins:out.scriptedProfileWins,
  widths:out.physicalWidths.map(({surface,narrowestWidthMeters})=>({surface,narrowestWidthMeters})),
  activeColliders:out.activeColliders,humanPlaytest:out.humanPlaytest
 }));
}

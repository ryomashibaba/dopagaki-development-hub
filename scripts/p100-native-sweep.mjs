/**
 * P100 independent full-course native 240Hz reconnaissance.
 * Runs real B48 collision and twelve active B51-C machines; reports ALL
 * failures, never relabels a P99 finish as proof for reshaped P100 geometry.
 * No spectator eligibility or game steering is enabled by this module.
 */
import {generateP100TerrainPulseCandidate} from './p100-terrain-pulse-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {probeP96} from './p96-native-dodge-probe.mjs';

export function probeP100(){
 const doc=generateP100TerrainPulseCandidate(),world=compile(doc);
 const profiles=['near-soft','early-soft','early-strong','fast-switch'];
 const attempts=profiles.map(profile=>{
  const {trace,...summary}=probeP96(profile,{doc,world,limitSeconds:95});
  return {...summary,traceTail:trace.slice(-4)};
 });
 const finish=attempts.filter(a=>a.status==='SCRIPTED_NATIVE_FULL_PASS'&&a.visited.length===7&&a.machineContacts.length===0);
 const result={
  stageId:'VB-P100',physicsHz:240,enabledMovingColliders:doc.movingObstacles.filter(x=>x.enabled!==false).length,
  originalP99GeometryPreserved:true,
  verdict:finish.length?'SCRIPTED_NATIVE_FINISH_OBSERVED_HUMAN_HOLD':'HOLD_NO_FULL_NATIVE_FINISH',
  successfulProfiles:finish.map(x=>x.profile),
  attempts,humanPlaytest:'NOT_RUN',fairness:'NOT_APPROVED',
  caveat:'Only an independent P100 probe. No automated finish is evidence of human fairness.'
 };
 if(result.enabledMovingColliders!==12)throw Error('P100 real moving machine count regressed');
 return result;
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
 const report=probeP100();
 for(const row of report.attempts)console.log('P100_NATIVE_'+row.profile.toUpperCase().replace(/-/g,'_')+' '+JSON.stringify(row));
 console.log('P100_NATIVE_SUMMARY '+JSON.stringify({
  verdict:report.verdict,successfulProfiles:report.successfulProfiles,
  activeColliders:report.enabledMovingColliders,humanPlaytest:report.humanPlaytest
 }));
}

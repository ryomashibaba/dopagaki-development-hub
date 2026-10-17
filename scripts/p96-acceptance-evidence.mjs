/** True 240Hz proof: independent P95 has a feasible native manual-input trajectory.
 * This is NOT evidence that human players can reliably execute the route.
 */
import {generateVoidHazardCandidate} from './p95-void-hazard-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {probeP96} from './p96-native-dodge-probe.mjs';
const trim=result=>{
 const {trace,...summary}=result;
 return {...summary,traceSamples:trace};
};
export function generateP96DodgeEvidence(course=generateVoidHazardCandidate()){
 const world=compile(course);
 const best=trim(probeP96('early-soft',{doc:course,world}));
 const unsafe=trim(probeP96('near-soft',{doc:course,world}));
 const active=course.movingObstacles.filter(o=>o.enabled!==false).length;
 const pass=best.status==='SCRIPTED_NATIVE_FULL_PASS'&&
  best.visited.length===7&&best.missing.length===0&&best.finishEvent&&
  best.machineContacts.length===0&&best.decisionStations.length===12&&
  best.elapsed>=35&&best.elapsed<65&&active===12;
 if(!pass)throw Error('P96 true moving-hazard completion regressed: '+JSON.stringify({
  status:best.status,time:best.elapsed,visited:best.visited.length,contacts:best.machineContacts,
  stations:best.decisionStations.length,reason:best.failure?.reason,active
 }));
 if(unsafe.status==='SCRIPTED_NATIVE_FULL_PASS')throw Error('P96 near-range policy changed: re-evaluate human fairness');
 return {schema:'dopagaki.void-breaker.p96-native-evidence/1',source:'240HZ_UNMODIFIED_RUNNER',
  stageId:course.stageForge.id,activeCollidingMachines:active,scriptedFullPass:true,
  humanPlaytest:'NOT_RUN',difficultyAndFairness:'HOLD',best,unsafe};
}

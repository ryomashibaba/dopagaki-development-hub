/**
 * P95 native B48+B51-C full-run probe. Native physics and animation are used,
 * but the stage is deliberately NOT accepted on the basis of a green CI job.
 * A failed scripted trajectory is an actionable HOLD, not a test crash.
 */
import {generateVoidHazardCandidate} from './p95-void-hazard-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {runNativeVoidBreaker} from './p94-void-native-acceptance.mjs';
const doc=generateVoidHazardCandidate(),world=compile(doc);
for(const profile of ['neutral','corrective']){
 const result=runNativeVoidBreaker(profile,{doc,world,seconds:110});
 const {probeTrace,hostMilliseconds,...compact}=result;
 console.log('P95_HAZARD_NATIVE_'+profile.toUpperCase()+' '+JSON.stringify({
  ...compact,hostMilliseconds,finalPhysicalSnapshots:probeTrace.slice(-5),
  newHazardCount:doc.movingObstacles.length,
  criticalGate:result.status==='NATIVE_FULL_PASS'?'SCRIPTED_TRAVERSAL_ONLY_HUMAN_HOLD':'HOLD_NO_FULL_NATIVE_TRAVERSAL'
 }));
}

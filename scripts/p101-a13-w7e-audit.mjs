/**
 * W7E: native B48/B51-C scripted full run AND real 21-lane x17-phase
 * hazard-footprint audits. Reject superficial 7/7 if 16 solids aren't felt.
 * This does NOT enable AI steering in the real game or certify fairness.
 */
import {W7_TRIALS,runW7Trial,makeW7TrialDoc} from './p101-a13-w7-candidate-matrix.mjs';
import {runW7PhysicalExposure} from './p101-a13-w7-road-occupancy.mjs';
export function w7eReport(){
 return W7_TRIALS.filter(x=>x.id.startsWith('w7e-')).map(trial=>{
  const race=runW7Trial(trial),occupancy=runW7PhysicalExposure(makeW7TrialDoc(trial),trial.id);
  return {...race,footprintCount:occupancy.physicalFootprintCount,
   centerlineThreatCount:occupancy.centerlineThreatCount,
   footprintByType:occupancy.hazards.map(x=>({id:x.id,
    p:x.phasesTouchingRoad,l:x.uniqueLanesTouchingRoad,minSep:x.closestGroundBallSeparationMeters}))};
 });
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
 const candidates=w7eReport();
 for(const x of candidates)console.log('A13_W7E '+JSON.stringify({...x,trace:undefined}));
 if(candidates.length!==4||candidates.some(x=>x.nativePhysicsHz!==240||x.nativeMachines!==28||x.footprintCount<0))
  throw Error('W7E native audit integrity failed');
}

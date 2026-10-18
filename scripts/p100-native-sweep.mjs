/**
 * P100 independent full-course native 240Hz reconnaissance.
 * Runs real B48 collision and twelve active B51-C machines; reports ALL
 * failures, never relabels a P99 finish as proof for reshaped P100 geometry.
 * No spectator eligibility or game steering is enabled by this module.
 */
import {generateP100TerrainPulseCandidate} from './p100-terrain-pulse-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {probeP96} from './p96-native-dodge-probe.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {P95_HAZARD_SPECS} from '../web/p95-hazard-layout.mjs';

export function probeP100(){
 const doc=generateP100TerrainPulseCandidate(),world=compile(doc);
 const profiles=['near-soft','early-soft','early-strong','fast-switch'];
 const attempts=profiles.map(profile=>{
  const {trace,...summary}=probeP96(profile,{doc,world,limitSeconds:95});
  return {...summary,traceTail:trace.slice(-4)};
 });
 const finish=attempts.filter(a=>a.status==='SCRIPTED_NATIVE_FULL_PASS'&&a.visited.length===7&&a.machineContacts.length===0);
 // Gameplay-first road/hazard relationship: original machines stayed fixed
 // while seven REAL road corridors changed. Report actual centerline offsets
 // rather than treating 12 enabled colliders as evidence they are on-road.
 const machineFootprints=P95_HAZARD_SPECS.map(([section,u],i)=>{
  const s=doc.surfaces[section],machine=doc.movingObstacles[i];
  const l=sample(s,u,0),m=sample(s,u,.5),r=sample(s,u,1);
  const across=[r[0]-l[0],r[2]-l[2]],width=Math.hypot(...across);
  const unit=across.map(x=>x/(width||1));
  const lateral=(machine.position[0]-m[0])*unit[0]+(machine.position[2]-m[2])*unit[1];
  const outside=Math.max(0,Math.abs(lateral)-width/2);
  return {id:machine.id,section,u,type:machine.type,
   lateralMeters:Number(lateral.toFixed(2)),halfRoadWidthMeters:Number((width/2).toFixed(2)),
   centerOutsideRoadMeters:Number(outside.toFixed(2)),
   verticalAnchorOffsetMeters:Number((machine.position[1]-m[1]).toFixed(2))};
 });
 const result={
  stageId:'VB-P100',physicsHz:240,enabledMovingColliders:doc.movingObstacles.filter(x=>x.enabled!==false).length,
  originalP99GeometryPreserved:true,
  verdict:finish.length?'SCRIPTED_NATIVE_FINISH_OBSERVED_HUMAN_HOLD':'HOLD_NO_FULL_NATIVE_FINISH',
  successfulProfiles:finish.map(x=>x.profile),
  attempts,machineFootprints,humanPlaytest:'NOT_RUN',fairness:'NOT_APPROVED',
  nativeAcceptancePassed:finish.length>=2&&finish.some(a=>a.profile==='near-soft'),
  caveat:'Only an independent P100 probe. No automated finish is evidence of human fairness.'
 };
 if(result.enabledMovingColliders!==12)throw Error('P100 real moving machine count regressed');
 // Scripted failures are observations, not mandatory game goals.
 // Human difficulty is separately HOLD even if all four strategies finish.
 return result;
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
 const report=probeP100();
 for(const row of report.attempts)console.log('P100_NATIVE_'+row.profile.toUpperCase().replace(/-/g,'_')+' '+JSON.stringify(row));
 console.log('P100_NATIVE_SUMMARY '+JSON.stringify({
  verdict:report.verdict,successfulProfiles:report.successfulProfiles,
  activeColliders:report.enabledMovingColliders,humanPlaytest:report.humanPlaytest,
  machineCenterOutsideRoadCount:report.machineFootprints.filter(m=>m.centerOutsideRoadMeters>0).length,
  machineFootprints:report.machineFootprints,
  nativeAcceptancePassed:report.nativeAcceptancePassed
 }));
 if(!report.nativeAcceptancePassed)throw Error('P100 physical spectator gate HOLD: fewer than 2 real 7/7 native finishes or near-soft failed');
}

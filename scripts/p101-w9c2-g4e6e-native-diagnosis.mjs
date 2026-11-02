/**
 * G4E-6E narrow physical-cell position scan around C0-55-1.
 * Runs the same real 240Hz start00 P96-scripted Gold experiment for every
 * candidate. This script does not alter core physics, speed law, steering,
 * moving machines or read-only original Gold route.
 * Human fairness / publish remains on HOLD regardless of numeric success.
 */
import {generateG4E6EMicroGap,G4E6E_CELLS,g4e6eId} from './p101-w9c2-g4e6e-micro-gap-build.mjs';
import {g4e6NativeRun} from './p101-w9c2-g4e6-native-matrix.mjs';
import {g4e6SpeedQuality} from './p101-w9c2-g4e6b-speed-retention.mjs';
const round=(v,p=3)=>Number(v.toFixed(p));
export function g4e6eNativeDiagnosis(){
 const gold=g4e6NativeRun('GOLD');
 if(!gold.completed||!gold.visitedOriginalRoadsInOrder||
    gold.originalRoads!==7||gold.originalMovingBodies!==28)
  throw Error('G4E6E frozen full-course Gold is not PASS');
 const control=g4e6NativeRun('C0-55-1');
 if(!control.completed||!control.genuineLandingOnSameOriginalRoad||
    !control.visitedOriginalRoadsInOrder)
  throw Error('G4E6E proven C0-55-1 local physical control regressed');
 const results=G4E6E_CELLS.map(cell=>{
  const id=g4e6eId(cell);
  return g4e6NativeRun(id,{docOverride:generateG4E6EMicroGap(cell)});
 });
 const goldTime=gold.elapsedSeconds;
 const sectionIds=gold.visitedOrder;
 const checkpointDelays=(r)=>Object.fromEntries(sectionIds.map((s,i)=>{
  const gt=gold.roadFirstContactTimes[s],ct=r.roadFirstContactTimes[s];
  return [String(i),ct===undefined?null:round(ct-gt)];
 }));
 const markerDelays=(r)=>Object.fromEntries(
  Object.entries(gold.roadIProgressMilestones).map(([k,g])=>[
   k,r.roadIProgressMilestones[k]?{
    delaySeconds:round(r.roadIProgressMilestones[k].t-g.t),
    goldMps:g.speedMps,candidateMps:r.roadIProgressMilestones[k].speedMps
   }:null]));
 const diagnostics=(r)=>({
  id:r.id,
  ...g4e6SpeedQuality(r,goldTime),
  firstRoadDelaySeconds:checkpointDelays(r),
  firstRoadSpeedMps:r.roadFirstContactSpeeds,
  roadIProgressDelta:markerDelays(r),
  airSecondsGold:gold.totalAirborneSeconds,
  airSecondsCandidate:r.totalAirborneSeconds,
  airSecondsDelta:round(r.totalAirborneSeconds-gold.totalAirborneSeconds),
  movingContactsGold:gold.nativeMovingContactDetails,
  movingContactsCandidate:r.nativeMovingContactDetails,
  physicalSectionsVisited:r.visitedOriginalCount,
  verifiedAllOriginalRoads:r.visitedOriginalRoadsInOrder,
  finished:r.completed,
  potentialFollowupOnly:r.completed&&r.genuineLandingOnSameOriginalRoad&&
   r.visitedOriginalRoadsInOrder&&r.humanFairness==='HOLD'
 });
 const controlDiagnostics=diagnostics(control),
  summaries=results.map(diagnostics);
 return {schema:'dopagaki.w9c2.g4e6e-native-diagnosis/1',
  world:'W7F_GOLD_UNMODIFIED',physicsHz:240,startSpeedMps:52,
  originalRoads:7,originalMovingHazards:28,
  gold:{elapsedSeconds:goldTime,peakSpeedMps:gold.peakSpeedMps,
   firstRoads:gold.roadFirstContactTimes,
   firstRoadSpeeds:gold.roadFirstContactSpeeds,
   roadIProgress:gold.roadIProgressMilestones,
   totalAirborneSeconds:gold.totalAirborneSeconds,
   movingContacts:gold.nativeMovingContactDetails},
  establishedControl:controlDiagnostics,
  summaries,
  physicallyQualified: summaries.filter(x=>x.finished&&x.landing&&
    x.verifiedAllOriginalRoads).map(x=>x.id),
  speedQualified:summaries.filter(x=>x.speedQualityGate).map(x=>x.id),
  rawResults:results,
  release:'HOLD',human:'NOT_TESTED',approvedSlopeDNAMeters:0};
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href)
 console.log('G4E6E_DIAGNOSIS '+JSON.stringify(g4e6eNativeDiagnosis()));

/**
 * G4E-6F actual start00 native 240Hz Gold vs shorter physical gaps.
 * The baseline physical Gold still uses original 90 longitudinal mesh
 * cells. Each candidate is a separate real B48 collider triangulation.
 */
import {generateG4E6FSubcellGap,G4E6F_VARIANTS} from './p101-w9c2-g4e6f-subcell-gap-build.mjs';
import {g4e6NativeRun} from './p101-w9c2-g4e6-native-matrix.mjs';
import {g4e6SpeedQuality} from './p101-w9c2-g4e6b-speed-retention.mjs';
const round=(v,n=3)=>Number(v.toFixed(n));
export function g4e6fSubcellNativeMatrix(){
 const gold=g4e6NativeRun('GOLD');
 if(!gold.completed||!gold.visitedOriginalRoadsInOrder||
    gold.originalRoads!==7||gold.originalMovingBodies!==28)
  throw Error('G4E6F W7F baseline must be 7/7 real native PASS');

 // 6C frozen authored reference is included separately from the 6F new
 // mesh-resolution candidates. All must use one identical native controller.
 const reference=g4e6NativeRun('C0-55-1');
 if(!reference.completed||!reference.genuineLandingOnSameOriginalRoad||
   !reference.visitedOriginalRoadsInOrder)
  throw Error('G4E6F C0-55-1 reference landing regressed');
 const results=G4E6F_VARIANTS.map(v=>g4e6NativeRun(v.id,{
  docOverride:generateG4E6FSubcellGap(v.id)
 }));
 const verdict=results.map((r,i)=>{
  const cfg=G4E6F_VARIANTS[i],
   quality=g4e6SpeedQuality(r,gold.elapsedSeconds),
   airborneDuration=quality.flightSeconds??0,
   visualJumpCandidate=quality.airborne&&quality.landing&&airborneDuration>=.15;
  return {...quality,
   resolution:cfg.resolution,cutCells:cfg.cells,
   nativeGenuineFlightDurationSeconds:round(airborneDuration),
   meaningfulAirborneDuration:visualJumpCandidate,
   strictGameCandidate:quality.speedQualityGate&&visualJumpCandidate,
   originalRoadVisits:r.visitedOriginalCount,
   firstRoadDelays:r.roadFirstContactTimes,
   additionalAirborneVsGoldSeconds:
    round(r.totalAirborneSeconds-gold.totalAirborneSeconds),
   originalGoldPhysicsUnchanged:true,manualHumanFairness:'HOLD'};
 });
 return {schema:'dopagaki.w9c2.g4e6f-native-resolution-matrix/1',
  gold:{time:gold.elapsedSeconds,peak:gold.peakSpeedMps,
   guideCount:gold.originalGuideCount,moving:gold.originalMovingBodies},
  reference:g4e6SpeedQuality(reference,gold.elapsedSeconds),
  physicsHz:240,startSpeedMps:52,
  candidates:verdict,
  strictSpeedCandidates:verdict.filter(x=>x.strictGameCandidate).map(x=>x.id),
  physicalComplete:verdict.filter(x=>x.completed&&x.landing&&x.airborne).map(x=>x.id),
  rawResults:results,
  human:'HOLD',release:'HOLD',approvedSlopeDNAMeters:0};
}

if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href)
 console.log('G4E6F_NATIVE '+JSON.stringify(g4e6fSubcellNativeMatrix()));

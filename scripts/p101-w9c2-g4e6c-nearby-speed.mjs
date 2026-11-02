/**
 * G4E-6C 240Hz native start00 neighborhood scan for real physical gap placement.
 * Fixed native physics/52m/s/28 bodies/7 Gold roads, genuine gap/ground contact.
 * Human review still mandatory even when an automated speed gate succeeds.
 */
import {G4E6C_SITES} from './p101-w9c2-g4e6-early-gap-build.mjs';
import {g4e6NativeRun} from './p101-w9c2-g4e6-native-matrix.mjs';
import {g4e6SpeedQuality} from './p101-w9c2-g4e6b-speed-retention.mjs';
export function g4e6cNearbyMatrix(){
 const gold=g4e6NativeRun('GOLD');
 if(!gold.completed||!gold.visitedOriginalRoadsInOrder)
   throw Error('Original W7F Gold must finish 7/7');
 const prior=g4e6NativeRun('B0-65-1');
 if(!prior.completed||!prior.genuineLandingOnSameOriginalRoad||
   !prior.visitedOriginalRoadsInOrder)
   throw Error('Known successful G4E-6B physical baseline regressed');
 const results=G4E6C_SITES.map(site=>g4e6NativeRun(site.id));
 const verdict=results.map(x=>g4e6SpeedQuality(x,gold.elapsedSeconds));
 const eligible=verdict.filter(x=>x.speedQualityGate);
 return {schema:'dopagaki.w9c2.g4e6c-native/1',
  gold:{finished:gold.completed,elapsed:gold.elapsedSeconds,
   peak:gold.peakSpeedMps},
  knownPass:g4e6SpeedQuality(prior,gold.elapsedSeconds),
  verdict,eligibleForHumanTrial:eligible.map(x=>x.id),
  results,production:'HOLD',humanFairness:'NOT_TESTED',
  noPhysicsAssist:true,noPublish:true};
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href)
 console.log('G4E6C_NATIVE '+JSON.stringify(g4e6cNearbyMatrix()));

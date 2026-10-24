/**
 * G4E-3B physical site search. The same one-cell true collision void is placed
 * at four authored u positions; no steering/physics/speed changes.
 * Real start00 at 52m/s, 240Hz, 28 moving hazards, every failure retained.
 */
import {g4e3NativeRun} from './p101-w9c2-g4e3-native-gap-matrix.mjs';
export const G4E3B_SITES=Object.freeze([.40,.59,.70,.78]);
export function scanG4E3BSites(){
 const results=G4E3B_SITES.map(centerU=>g4e3NativeRun(1,{centerU}));
 return {schema:'dopagaki.w9c2.g4e3b-native-site-scan/1',
  actualPhysicalGap:true,physicsHz:240,fromRealStart00:true,
  results,rankedByNativeEvidence:results.map(x=>({
   centerU:x.centerU,actualGapMeters:x.realGapMeters,
   reachedPhysicalTakeoff:x.firstNear!==null,
   physicallyAirborne:x.realGapAirObserved,
   genuineLanding:x.realGapLandingObserved,
   finished:x.finished,closestGroundedTakeoffMeters:x.closestGroundedTakeoffMeters,
   failure:x.failure,staticFatalContacts:x.staticFatalContacts,
   movingContacts:x.movingContacts})),
  approved:false,human:'NOT_TESTED',published:false};
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href)
 console.log('G4E3B_SITE_SCAN '+JSON.stringify(scanG4E3BSites()));

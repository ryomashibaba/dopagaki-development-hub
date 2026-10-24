/**
 * G4E-6B genuine native early-gap speed-quality QA:
 * width and placement changes only, never physics acceleration, speed cap,
 * rebound recovery, steering, or any original Gold road/route/hazard.
 */
import {G4E6B_SITES} from './p101-w9c2-g4e6-early-gap-build.mjs';
import {g4e6NativeRun} from './p101-w9c2-g4e6-native-matrix.mjs';
const round=(n,p=3)=>Number(n.toFixed(p));
export function g4e6SpeedQuality(r,baselineSeconds){
 const air=r.airAtSeconds,land=r.landingConfirmedSeconds;
 const trace=r.trace??[];
 const near=(t,min=-Infinity,max=Infinity)=>{
  const candidates=trace.filter(x=>x.time>=min&&x.time<=max&&Number.isFinite(x.speed));
  return candidates.length?candidates.reduce((a,b)=>Math.abs(a.time-t)<Math.abs(b.time-t)?a:b):null;
 };
 const atTakeoff=air===null?null:near(air,air-.16,air+.06);
 const atLanding=land===null?null:near(land,land-.06,land+.16);
 const before=atTakeoff?.speed??null,after=atLanding?.speed??null;
 const flight=air===null?[]:trace.filter(x=>x.time>=air&&
  x.time<=Math.min(air+4,(land??air+4)));
 const minFlightSpeed=flight.length?Math.min(...flight.map(x=>x.speed)):null;
 const speedRetention=before!==null&&after!==null&&before>0?after/before:null;
 const fullPass=r.completed&&r.visitedOriginalRoadsInOrder&&
  r.genuineAirborneAtGap&&r.genuineLandingOnSameOriginalRoad;
 // Explicit quality gate: aim not to trade the Slope sensation for a
 // brief 15m/s stall. This is provisional numeric QA, NOT human approval.
 const qualityPass=fullPass&&speedRetention!==null&&speedRetention>=.7&&
  minFlightSpeed>=30&&r.elapsedSeconds<=baselineSeconds+3;
 return {id:r.id,gapMeters:round(r.physicalGapMeters,2),
  airborne:r.genuineAirborneAtGap,
  landing:r.genuineLandingOnSameOriginalRoad,
  flightSeconds:air!==null&&land!==null?round(land-air):null,
  beforeAirMps:before,afterLandingMps:after,
  minimumFlightMps:minFlightSpeed,
  speedRetentionRatio:speedRetention===null?null:round(speedRetention,3),
  completed:r.completed,allOriginalRoadsInOrder:r.visitedOriginalRoadsInOrder,
  timeSeconds:r.elapsedSeconds,lossVsGoldSeconds:round(r.elapsedSeconds-baselineSeconds),
  speedQualityGate:qualityPass,
  reason:r.failure?.reason??null,human:'NOT_TESTED'};
}
export function g4e6bSpeedMatrix(){
 const gold=g4e6NativeRun('GOLD');
 if(!gold.completed||!gold.visitedOriginalRoadsInOrder)
  throw Error('G4E6B original Gold must PASS');
 const sixA=g4e6NativeRun('A0-35-2');
 const results=G4E6B_SITES.map(x=>g4e6NativeRun(x.id));
 return {schema:'dopagaki.w9c2.g4e6b-speed-retention/1',
  gold:{finished:gold.completed,elapsed:gold.elapsedSeconds,peak:gold.peakSpeedMps},
  successfulG4E6AControl:g4e6SpeedQuality(sixA,gold.elapsedSeconds),
  verdict:results.map(x=>g4e6SpeedQuality(x,gold.elapsedSeconds)),
  rawResults:results,
  humanFairness:'HOLD',publish:'HOLD'};
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href)
 console.log('G4E6B_SPEED '+JSON.stringify(g4e6bSpeedMatrix()));


/**
 * P101 trial is cloned from P100, with its real S-bends and 12 physical
 * B51-C hazards EXACTLY intact. Only P101's separate per-step acceleration
 * adapter changes driving feel. Avoid borrowing P100 native finish claims.
 */
import {generateP100TerrainPulseCandidate} from './p100-terrain-pulse-build.mjs';
import {P101_DEFAULT,P101_TUNINGS} from '../web/p101-overdrive.mjs';
import {validate,sample} from '../private/reference_only/director/surface.js';
import {P101_B4_PROFILES,p101ReshapeRoad,p101ReanchorMachines,p101CurvatureReport} from './p101-high-radius-build.mjs';
export function generateP101OverdriveCandidate({radiusWeights=Array(7).fill(1)}={}){
 if(!Array.isArray(radiusWeights)||radiusWeights.length!==7||radiusWeights.some(x=>!Number.isFinite(x)||x<0||x>1.6))
  throw Error('P101 physical radiusWeights must be 7 bounded explicit strengths');
 const original=generateP100TerrainPulseCandidate(),next=structuredClone(original);
 // Independently regenerate P101-only road physics while leaving P100 byte-identical.
 next.surfaces=original.surfaces.map((s,i)=>p101ReshapeRoad(s,i,{scale:radiusWeights[i]}));
 next.movingObstacles=p101ReanchorMachines(original.movingObstacles,next.surfaces,{weights:radiusWeights});
 next.route=next.surfaces.flatMap(s=>Array.from({length:22},(_,i)=>sample(s,(i+.015)/22,.5)));
 next.route.push(sample(next.surfaces.at(-1),.999,.5));
 next.name='VOID BREAKER / HIGH-RADIUS VELOCITY OVERDRIVE — P101 PHYSICAL TRIAL';
 next.stageForge={
  ...original.stageForge,
  id:'VB-P101',batch:'P101_SPEED_LATERAL_ACCELERATION_PHYSICAL_HOLD',
  name:'VOID BREAKER / VELOCITY OVERDRIVE',
  status:'EXPERIMENTAL_B4_HIGH_RADIUS_NATIVE_AND_HUMAN_HOLD',
  roadRedesign:'P101_ONLY_REAL_B48_HIGH_RADIUS_7_SKINS',
  radiusProfiles:P101_B4_PROFILES.map(x=>({...x})),
  radiusWeights:[...radiusWeights],
  P100SurfacesModified:false,
  B51NativeMachineCountUnchanged:12,
  machineAnchors:'P101_REANCHORED_TO_ACTUAL_RESHAPED_B48_SURFACE',
  baseStage:'VB-P100',
  firstPartyPhysics:'FROZEN_B48_CORE_WITH_ADDITIVE_240HZ_ACCELERATION_ADAPTER',
  movementLaw:'FORWARD_TANGENTIAL_EXTRA_ACCEL_AND_PLAYER_LATERAL_INPUT_ONLY',
  defaultTuning:P101_DEFAULT,
  tunings:Object.values(P101_TUNINGS).map(x=>({...x})),
  fullStartToFinish:'NOT_VERIFIED_P101',
  priorP100CompletionApplicable:false,
  spectatorFullRun:'DISABLED_UNTIL_P101_PROVEN',
  humanPlaytest:'NOT_RUN',fairness:'NOT_APPROVED',
  finalVisualQuality:'NOT_APPROVED',
  physicsModified:false,
  externalPerStepForce:true
 };
 const result=validate(next);
 result.stageForge.curvatureAudit=p101CurvatureReport(result);
 return validate(result);
}

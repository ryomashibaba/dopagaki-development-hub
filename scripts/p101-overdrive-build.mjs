
/**
 * P101 trial is cloned from P100, with its real S-bends and 12 physical
 * B51-C hazards EXACTLY intact. Only P101's separate per-step acceleration
 * adapter changes driving feel. Avoid borrowing P100 native finish claims.
 */
import {generateP100TerrainPulseCandidate} from './p100-terrain-pulse-build.mjs';
import {P101_DEFAULT,P101_TUNINGS} from '../web/p101-overdrive.mjs';
import {validate} from '../private/reference_only/director/surface.js';
export function generateP101OverdriveCandidate(){
 const original=generateP100TerrainPulseCandidate(),next=structuredClone(original);
 next.name='VOID BREAKER / VELOCITY OVERDRIVE — P101 REAL-PHYSICS TRIAL';
 next.stageForge={
  ...original.stageForge,
  id:'VB-P101',batch:'P101_SPEED_LATERAL_ACCELERATION_PHYSICAL_HOLD',
  name:'VOID BREAKER / VELOCITY OVERDRIVE',
  status:'EXPERIMENTAL_NATIVE_AND_HUMAN_HOLD',
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
 return validate(next);
}

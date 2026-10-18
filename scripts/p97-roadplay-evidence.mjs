/**
 * P97 evidence that gives future course designers accurate reaction-time
 * information. These are potential sighting windows at an assumed speed,
 * NOT a claim that the 12 moving obstacles are human-fair or easily dodged.
 */
import {generateVoidHazardCandidate} from './p95-void-hazard-build.mjs';
import {sample,frame} from '../private/reference_only/director/surface.js';
import {hazardRoadGateVertices,makeHazardRoadPlan,hazardSpacingAudit} from '../web/p97-roadplay-gates.mjs';
export function generateP97RoadplayEvidence(doc=generateVoidHazardCandidate()){
 const plan=makeHazardRoadPlan(doc,sample);
 const gates=hazardRoadGateVertices(doc,sample,frame);
 const referenceSpeed=130;
 const spacing=hazardSpacingAudit(plan,{speedMps:referenceSpeed});
 if(spacing.length!==12||gates.gates.length!==36||gates.solidVertices.length<1000
  ||doc.stageForge.fullStartToFinish!=='SCRIPTED_240HZ_12_ACTIVE_7_OF_7_PASS_P96'
  ||doc.stageForge.humanPlaytest!=='NOT_RUN')
   throw Error('P97 evidence cannot certify incomplete or mutated physical course');
 return {
  schema:'dopagaki.void-breaker.p97-readability-evidence/1',
  stageId:doc.stageForge.id,physicsModified:false,
  nativeCollidersActive:doc.movingObstacles.filter(x=>x.enabled!==false).length,
  physicalSurfaceCount:doc.surfaces.length,
  warningDistancesMeters:[400,270,140],
  advanceGateCount:gates.gates.length,solidTriangles:gates.solidVertices.length/18,
  arrivalAssumptionMps:referenceSpeed,
  warningBudgetSeconds:Number((400/referenceSpeed).toFixed(2)),
  hazardSpacing:spacing,
  shortTransitionRisks:spacing.filter(x=>x.secondsSincePrevious!==null&&x.secondsSincePrevious<1.7)
   .map(x=>({id:x.id,seconds:x.secondsSincePrevious,spacingMeters:x.spacingMeters})),
  evaluation:'STATIC_VISUAL_SIGHTING_AND_ROUTE_TIME_ONLY',
  scriptedNativeFullCompletion:'P96_12_ACTIVE_7_OF_7_PASS',
  humanPlaytest:'NOT_RUN',fairness:'UNASSESSED',
  caveat:'Warning gates are visible guidance; time estimates are speed-based and do not guarantee a safe lane, reaction time, or survivable contact.'
 };
}

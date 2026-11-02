/**
 * W9-C2 G4E-7G: private same-normalized-road-pose WebGL inspection.
 * Baseline cloned from frozen W7F. 'glide' only from independently-tested
 * G4E-7F generator. Two research spawns with the same section/u/v are added
 * to both cloned docs. NO camera, collision, machine, acceleration or jump aids.
 */
import {generateP101A13W7Candidate} from './p101-a13-w7-gameplay-build.mjs';
import {generateG4E7FEarlyPhysicalCandidate} from './p101-w9c2-g4e7f-real-slope-build.mjs';
import {validate,sample} from '../private/reference_only/director/surface.js';
export const G4E7G_STAGES=Object.freeze({
 gold:'VB-P101-A13-W9C2-G4E7G-GOLD',
 glide:'VB-P101-A13-W9C2-G4E7G-GLIDE'
});
export const G4E7G_VIEWPOINTS=Object.freeze([
 Object.freeze({id:'skyline',section:0,u:.52,v:.5}),
 Object.freeze({id:'crown',section:1,u:.15,v:.5})
]);
export function generateG4E7GVisualDocument(kind){
 if(!Object.hasOwn(G4E7G_STAGES,kind))throw Error('G4E7G explicit private view kind only');
 const doc=kind==='gold'?structuredClone(generateP101A13W7Candidate()):
  generateG4E7FEarlyPhysicalCandidate('glide');
 if(doc.stageForge.productionPromoted!==false||doc.stageForge.id!=='VB-P101'||
    doc.stageForge.variant!=='A13_GAMEPLAY_ISOLATED'||doc.surfaces.length!==7||
    doc.movingObstacles.length!==28||doc.spawns.length<1)
  throw Error('G4E7G original physics source changed');
 const initialSpawns=doc.spawns.length;
 for(const p of G4E7G_VIEWPOINTS){
  const road=doc.surfaces[p.section],point=sample(road,p.u,p.v);
  if(!point.every(Number.isFinite))throw Error('Invalid B48 normalized camera probe');
  doc.spawns.push({name:'G4E-7G '+p.id+' / u='+p.u+' / 52m/s local VISUAL QA (NOT start00)',
   surface:road.id,u:p.u,v:p.v});
 }
 const visual=doc.stageForge.g4e7fPhysicalStudy;
 if(kind==='gold'&&visual)throw Error('Visual Gold cannot inherit modified physics');
 if(kind==='glide'&&(visual?.variant!=='glide'||visual.nominalExperimentalMeters!==300))
  throw Error('G4E7G only supports proven 300m GLIDE');
 doc.name='G4E-7G '+kind.toUpperCase()+' / INDEPENDENT PRIVATE SAME-U WEBGL REVIEW, NOT HUMAN';
 doc.stageForge={...doc.stageForge,
  revision:'W9C2-G4E-7G-'+kind.toUpperCase(),
  recordStageId:G4E7G_STAGES[kind],
  studyOnly:'LOCAL_PRIVATE_VISUAL_NOT_GAMEPLAY',
  nativeScriptedProof:null,
  fullStartToFinish:'REFER_G4E7F_SEPARATE_OFFLINE_PROOF_NOT_THIS_LOCAL_SPAWN',
  productionPromoted:false,gameAutoSteering:false,humanPlaytest:'NOT_RUN',
  fairness:'NOT_APPROVED',
  g4e7gVisualTrial:{
   kind,originalSpawns:initialSpawns,
   comparison:'SAME_NORMALIZED_B48_SECTION_U_V_BUT_NOT_IDENTICAL_WORLD_POSE',
   viewpoints:G4E7G_VIEWPOINTS.map(p=>({...p})),
   realB48Colliders:true,unchangedOriginalMovingBodies:28,
   scriptedW7FFinishReferentialOnly:kind==='glide'?'G4E7F_NATIVE_GLIDE_7_7':'W7F_GOLD_7_7',
   privateAssetOnly:true,staticFramesAreNotHumanDriving:true,
   originalPhysicsUntouched:true,approvedSlopeDnaMeters:0,
   visualVerdict:'NOT_YET_AUDITED',publish:'HOLD'
  }};
 return validate(doc);
}

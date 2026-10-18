/**
 * Selected W7F physically validated but HUMAN-UNAPPROVED A13 candidate.
 * Native P101 actual 240Hz 7/7, 28 B51-C moving machines, 52m/s start.
 * One actual moving bounce, 53.275s, peak203.6m/s SCRIPTED ONLY.
 * B5, W1, P100 and all earlier freezes are untouched.
 */
import {validate} from '../private/reference_only/director/surface.js';
import {makeW7TrialDoc,W7_TRIALS} from './p101-a13-w7-candidate-matrix.mjs';
export const A13_W7_SELECTED='w7f-gentle';
export function generateP101A13W7Candidate(){
 const trial=W7_TRIALS.find(x=>x.id===A13_W7_SELECTED);
 if(!trial)throw Error('W7F physical benchmark variant not found');
 const doc=makeW7TrialDoc(trial);
 if(doc.stageForge.variant!=='A13_GAMEPLAY_ISOLATED'||doc.surfaces.length!==7||doc.movingObstacles.length!==28)
  throw Error('A13 W7F needs 7 true road skins and 28 B51-C solids');
 const {studyOnly,...base}=doc.stageForge;
 doc.name='A13 W7F / HYPER RUSH — 7.28km, 28 native moving hazards, HUMAN HOLD';
 doc.stageForge={...base,
  revision:'W7F',selectedTrial:A13_W7_SELECTED,
  batch:'P101_A13_W7F_240HZ_NATIVE_28_MOVING_SCRIPTED_PASS_HUMAN_HOLD',
  name:'VOID BREAKER / A13 ACTIVE DANGER CIRCUIT W7F',
  fullStartToFinish:'P101_A13_W7F_7_OF_7_53_275S_28_NATIVE_MOVING_SCRIPTED_ONLY',
  nativeScriptedProof:{physicsHz:240,startMps:52,peakMps:203.6,
   elapsedSeconds:53.275,sections:7,movingColliders:28,movingContacts:1,
   source:'P96_ORIGINAL12_CORRECTIVE_SCRIPTED_QA_NOT_HUMAN'},
  status:'EXPERIMENTAL_SCRIPTED_PASS_HUMAN_VISUAL_HOLD',
  gameAutoSteering:false,originalB5BaselinePreserved:true,
  originalA13W1Preserved:true,productionPromoted:false,
  humanPlaytest:'NOT_RUN',fairness:'NOT_APPROVED',genuineFastLaw:null};
 return validate(doc);
}

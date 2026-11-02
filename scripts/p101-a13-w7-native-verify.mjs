/**
 * Fast-lane 240Hz physically completed selected course proof.
 * Historical W6/W7 trial sweeps remain in GitHub artifacts, not rerun
 * on every tiny iteration.
 */
import {generateP101A13W7Candidate,A13_W7_SELECTED} from './p101-a13-w7-gameplay-build.mjs';
import {W7_TRIALS,makeW7TrialDoc,runW7Trial} from './p101-a13-w7-candidate-matrix.mjs';
const trial=W7_TRIALS.find(x=>x.id===A13_W7_SELECTED);
if(!trial)throw Error('Missing reviewed A13 W7F choice');
const stage=generateP101A13W7Candidate(),source=makeW7TrialDoc(trial);
if(JSON.stringify(stage.surfaces)!==JSON.stringify(source.surfaces)||
   JSON.stringify(stage.movingObstacles)!==JSON.stringify(source.movingObstacles))
 throw Error('Site assets DO NOT match native reviewed candidate');
const run=runW7Trial(trial);
console.log('A13_W7F_SELECTED_NATIVE '+JSON.stringify({...run,trace:undefined}));
if(!run.finished||run.sections!==7||run.nativeMachines!==28||run.nativePhysicsHz!==240||
 run.contacts.length<1||run.peakMps<190||run.seconds<50||run.seconds>56)
 throw Error('W7F FULL SCRIPTED native physical QA FAILED: hold unapproved stage');

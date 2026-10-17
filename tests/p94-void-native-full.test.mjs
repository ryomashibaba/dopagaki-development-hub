import test from 'node:test';
import assert from 'node:assert/strict';
import {generateVoidBreaker} from '../scripts/p93-void-breaker-build.mjs';
import {generateVoidAcceptanceEvidence,P94_TRACK} from '../scripts/p94-void-native-acceptance.mjs';
import {p94NativeSteer} from '../web/p94-native-steer.mjs';
import {DT,RADIUS} from '../private/reference_only/director/physics.js';

test('P94 P93 full native 3990m route passes with legitimate scripted steering and 7/7 real road contacts',()=>{
 const doc=generateVoidBreaker(),before=JSON.stringify(doc),out=generateVoidAcceptanceEvidence(doc);
 assert.equal(out.schema,'dopagaki.void-breaker.acceptance-evidence/1');
 assert.equal(DT,1/240);assert.equal(RADIUS,.65);
 assert.equal(out.corrective.status,'NATIVE_FULL_PASS');
 assert.equal(out.corrective.runnerStatus,'finished');
 assert.equal(out.corrective.finishEvent,true);
 assert.deepEqual(out.corrective.visited,P94_TRACK);
 assert.deepEqual(out.corrective.missing,[]);
 assert.equal(out.corrective.physicsHz,240);
 assert(out.corrective.time>25&&out.corrective.time<75);
 assert(out.corrective.distanceMeters>3400);
 assert(out.corrective.maximumSpeed<200&&out.corrective.maximumSpeed>95);
 assert.equal(out.corrective.reason,null);
 assert.equal(out.corrective.movingContactCount,0);
 assert.equal(out.scriptedFullPass,true);
 assert.equal(out.humanPlaytest,'NOT_RUN');
 assert.equal(doc.stageForge.humanPlaytest,'NOT_RUN');
 assert.equal(JSON.stringify(doc),before,'native acceptance cannot change original P93 3990m course');
});
test('P94 neutral path is a genuine loss, not claimed to be balanced, and stored evidence is reproducible',()=>{
 const a=generateVoidAcceptanceEvidence(),b=generateVoidAcceptanceEvidence();
 assert.deepEqual(a,b,'native acceptance proof must have stable physics snapshots and no nondeterministic host timing');
 assert.equal(a.neutral.profile,'neutral');
 assert.equal(a.neutral.status,'HOLD_NOT_FULLY_TRAVERSED');
 assert.equal(a.neutral.runnerStatus,'failed');
 assert.notEqual(a.neutral.reason,null);
 assert.equal(a.neutral.finishEvent,false);
 assert(a.neutral.visited.length>=2&&a.neutral.visited.length<7);
});
test('P94 steering calculation is read-only and bounded',()=>{
 const fake={surface:null,lastSurface:null,p:[1,2,3],forward:[0,0,1],guides:[]};
 const old=JSON.stringify(fake);
 for(const mode of ['neutral','gentle','corrective'])assert.equal(p94NativeSteer(fake,mode),0);
 assert.throws(()=>p94NativeSteer(fake,'teleport'),/controller profile/);
 assert.equal(JSON.stringify(fake),old);
});

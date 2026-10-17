import test from 'node:test';
import assert from 'node:assert/strict';
import {generateVoidBreaker} from '../scripts/p93-void-breaker-build.mjs';
import {runNativeVoidBreaker,P94_TRACK} from '../scripts/p94-void-native-acceptance.mjs';
import {DT} from '../private/reference_only/director/physics.js';

test('P94 gate: an early valid physical run cannot be misreported as a full P93 finish',()=>{
 const doc=generateVoidBreaker(),before=JSON.stringify(doc);
 const out=runNativeVoidBreaker('neutral',{doc,seconds:1.25});
 assert.equal(out.schema,'dopagaki.void-breaker.native-acceptance/1');
 assert.equal(out.physicsHz,240);
 assert.equal(DT,1/240);
 assert.equal(out.status,'HOLD_NOT_FULLY_TRAVERSED');
 assert.notEqual(out.runnerStatus,'finished');
 assert.equal(out.finishEvent,false);
 assert(out.visited.length>=1&&out.visited.length<7);
 assert.equal(out.visited.length+out.missing.length,7);
 assert.deepEqual(out.visited.concat(out.missing).sort(),[...P94_TRACK].sort());
 assert.deepEqual(out.probeTrace[0].road,doc.spawns[0].surface);
 assert.equal(JSON.stringify(doc),before,'sampling must not alter physical course');
 assert.equal(doc.stageForge.humanPlaytest,'NOT_RUN');
 assert.equal(doc.stageForge.fullStartToFinish,'NATIVE_SCRIPTED_240HZ_7_OF_7_PASS_P94');
});

test('P94 prevents invalid artificial QA driver profiles and unbounded simulation',()=>{
 assert.throws(()=>runNativeVoidBreaker('teleport'),/controller profile/);
 assert.throws(()=>runNativeVoidBreaker('neutral',{seconds:181}),/bounded physics horizon/);
});

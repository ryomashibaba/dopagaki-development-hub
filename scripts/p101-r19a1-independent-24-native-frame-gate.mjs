/** Independent source/camera proof: reject mismatched native traces, fake PNG, and false approval. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const dir=path.resolve('r19-evidence/r19a1');
const p=JSON.parse(fs.readFileSync(path.join(dir,'R19_A1_TRUE_NATIVE_CAMERA_AND_B51_GATE.json')));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function validate(report){
 assert.equal(report.schema,'dopagaki.r19a1-real-game-webgl2-native-tick-sync/1');
 assert.equal(report.originalGameSourceBlob,'af076d67492a677d2235e4730aef8cdf4808e106');
 assert.equal(report.errors.length,0);
 assert.equal(report.sessions.length,4);
 assert.equal(report.ART,'HOLD');assert.equal(report.HUMAN,'HOLD');
 assert.equal(report.SLOPE2_CERTIFIED_METRES,0);
 const seen=new Set();let frames=0;
 for(const session of report.sessions){
  const k=session.kind+'/'+session.scenery;
  assert.ok(['control','ultra'].includes(session.kind));
  assert.ok(['on','off'].includes(session.scenery));
  assert.ok(!seen.has(k));seen.add(k);
  assert.equal(session.initial.webGL2,true);
  assert.equal(session.initial.bodyCount,28);
  assert.equal(session.shots.length,6);
  for(const shot of session.shots){
   assert.ok(report.targetTicks.includes(shot.tick));
   assert.ok(shot.measuredSourceNativeXYZDeltaM<.08);
   assert.ok(shot.measuredSourceNativeSpeedDeltaMps<.05);
   assert.equal(shot.originalSourceView.nativeTick,shot.tick);
   assert.equal(shot.originalSourceView.originalCamera,'ball-lock-unfiltered-heading');
   assert.equal(shot.originalSourceView.occlusionUnmeasured,'true');
   assert.equal(shot.visualOriginalB51Occlusion,'NOT_ASSESSED');
   assert.equal(shot.humanHazardLegibility,'HOLD');
   const raw=fs.readFileSync(path.join(dir,shot.image));
   assert.equal(raw.length,shot.imageBytes);
   assert.equal(sha(raw),shot.pngSHA256);
   frames++;
  }
 }
 assert.equal(frames,24);
 return {sessions:seen.size,originalCanvasFrames:frames,shaVerified:frames,
  nativeTickMatched:true,sourceB51:28,occlusion:'UNTESTED',HUMAN:'HOLD',ART:'HOLD'};
}
const result=validate(p);
const mutate=structuredClone(p);mutate.sessions[0].shots[0].measuredSourceNativeXYZDeltaM=.12;
assert.throws(()=>validate(mutate));
const fake=structuredClone(p);fake.ART='PASS';assert.throws(()=>validate(fake));
const fake2=structuredClone(p);fake2.sessions[1].shots[0].originalSourceView.nativeTick=0;assert.throws(()=>validate(fake2));
const fake3=structuredClone(p);fake3.sessions[2].shots[0].visualOriginalB51Occlusion='VISIBLE';assert.throws(()=>validate(fake3));
console.log('R19_A1_INDEPENDENT_ORIGINAL_WEBGL2_GATE',JSON.stringify({...result,forgeriesRejected:4}));

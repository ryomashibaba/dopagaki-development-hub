import test from 'node:test';
import assert from 'node:assert/strict';
import {runR19A0,POLICY} from '../scripts/p101-r19a0-real-12s-integrated-gameplay-city.mjs';
test('R19 first real 12s compares actual 14m / 28m B48 with 28 live B51 and existing opt-in art',()=>{
 const q=runR19A0();
 assert.equal(q.schema,POLICY.schema);
 assert.equal(q.sourceBlob,'af076d67492a677d2235e4730aef8cdf4808e106');
 assert.equal(q.studies.length,2);
 assert.deepEqual(q.studies.map(x=>x.mode),['control','ultra']);
 assert.ok(Math.abs(q.studies[0].trueB48WidthAt330M-28)<3);
 assert.ok(Math.abs(q.studies[1].trueB48WidthAt330M-14)<3);
 for(const x of q.studies){
  assert.equal(x.unchangedB48Roads,7);
  assert.equal(x.unchangedNativeB51,28);
  assert.equal(x.existingNoncollidingCity.defaultOff,true);
  assert.ok(x.existingNoncollidingCity.triangles>50);
  assert.equal(x.existingNoncollidingCity.ART,'HOLD_NOT_ORIGINAL_CAMERA_VERIFIED');
  assert.ok(x.physical.seconds>0&&x.physical.seconds<=12.005);
  assert.ok(x.physical.ticks>0&&x.physical.ticks<=2881);
  assert.ok(x.physical.maxSpeedMps>=52);
  assert.ok(['running','failed','finished'].includes(x.physical.status));
  assert.ok(x.physical.samples.length>=1);
  assert.equal(x.physical.source240Hz,true);
  assert.equal(x.physical.scriptedP96NotHuman,true);
  assert.equal(x.physical.ART,'HOLD');
  assert.equal(x.physical.HUMAN,'HOLD');
  if(x.physical.actualNoticeToCoreSeconds===null)
   assert.equal(x.physical.firstNoticeAtLeast2S,false);
 }
 assert.equal(q.decision.officialSlope2Meters,0);
 assert.equal(q.decision.ART,'HOLD');
 assert.equal(q.decision.GAMEPLAY,'HOLD');
 assert.equal(q.decision.HUMAN,'HOLD');
 assert.equal(q.decision.RELEASE,'HOLD');
 console.log('R19A0_GENUINE_12S_COMPARE',JSON.stringify(q.studies.map(x=>({
  variant:x.mode,widthM:x.trueB48WidthAt330M,
  seconds:x.physical.seconds,status:x.physical.status,peakMps:x.physical.maxSpeedMps,
  noticeSeconds:x.physical.actualNoticeToCoreSeconds,
  real12SecondFrames:x.physical.samples.length,
  existingArtTriangles:x.existingNoncollidingCity.triangles,
  certifiedSlopeMeters:0,manualQA:'HOLD',art:'HOLD'}))));
});
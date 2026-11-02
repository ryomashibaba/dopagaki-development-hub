/** R19 A2 independent 36 PNG exact-native provenance and fraud-negative QA. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const dir=path.resolve('r19-evidence/r19a2');
const proof=JSON.parse(fs.readFileSync(path.join(dir,'R19_A2_ORIGINAL_CAMERA_LAYER_ATTRIBUTION.json')));
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const layers=['all','without-epic','without-mega','without-w9','without-frames','without-g5b','road-hazards-only'];
function verify(x){
 assert.equal(x.schema,'dopagaki.r19a2-original-12second-layer-attribution/1');
 assert.equal(x.originalSourceSHA,'af076d67492a677d2235e4730aef8cdf4808e106');
 assert.equal(x.originalB48,7);assert.equal(x.originalMovingB51,28);
 assert.equal(x.failures.length,0);assert.equal(x.sessions.length,9);
 assert.equal(x.ART,'HOLD');assert.equal(x.GAMEPLAY,'HOLD');assert.equal(x.HUMAN,'HOLD');
 assert.equal(x.PERFORMANCE,'HOLD');assert.equal(x.SLOPE2_OFFICIALLY_CERTIFIED_M,0);
 const unique=new Set(),sameTick=new Map();
 let count=0,changedBaselineComparison=0;
 for(const s of x.sessions){
  assert.ok(['ultra','control'].includes(s.kind));
  assert.ok(layers.includes(s.layer));
  assert.ok(s.kind==='ultra'||['all','road-hazards-only'].includes(s.layer));
  const combo=s.kind+'/'+s.layer;assert.ok(!unique.has(combo));unique.add(combo);
  assert.equal(s.rawCamera,true);assert.equal(s.nativeP96NotHuman,true);
  assert.equal(s.sourceGameChanged,false);
  assert.equal(s.before.webgl2,true);
  assert.equal(s.before.originalB51,28);
  assert.equal(s.screens.length,4);
  for(let i=0;i<4;i++){
   const frame=s.screens[i];
   assert.equal(frame.tick,x.nativeTicks[i]);
   assert.equal(frame.sourceScreenshotState.tick,frame.tick);
   assert.equal(frame.sourceScreenshotState.actualMask,s.layer);
   assert.equal(frame.sourceScreenshotState.currentB51,28);
   assert.equal(frame.sourceScreenshotState.occlusion,'true');
   assert.equal(frame.sourceScreenshotState.camera,'ball-lock-unfiltered-heading');
   assert.ok(frame.actualPhysicalXYZDeltaM<.08);
   assert.ok(frame.actualPhysicalSpeedDeltaMps<.05);
   assert.equal(frame.sourceScreenshotState.road,frame.sourceNativeB48Road);
   const pathToImage=path.resolve(dir,frame.file);
   assert.ok(pathToImage.startsWith(dir+path.sep));
   const raw=fs.readFileSync(pathToImage);
   assert.equal(frame.pngBytes,raw.length);
   assert.equal(frame.pngSHA256,sha(raw));
   const id=s.kind+'/'+frame.tick;
   const already=sameTick.get(id);
   const position=frame.sourceScreenshotState.xyz;
   if(already){
    assert.ok(Math.hypot(...already.position.map((v,j)=>v-position[j]))<.0001,
     'different native physical XYZ between compared art layers '+id);
    assert.ok(Math.abs(already.speed-frame.sourceScreenshotState.speed)<.0001,
     'actual speed changed between scene layers '+id);
    if(already.sha!==frame.pngSHA256)changedBaselineComparison++;
   }else sameTick.set(id,{position,speed:frame.sourceScreenshotState.speed,sha:frame.pngSHA256});
   count++;
  }
 }
 assert.equal(count,36);assert.equal(unique.size,9);
 assert.ok(changedBaselineComparison>=1,'all tested original scenery layers rendered identical pixels');
 return {sessions:unique.size,pngFramesVerified:count,physicsSameTickChecks:count-8,
  visibleDifferentSourceLayerFrames:changedBaselineComparison,
  sourceB48:7,sourceB51:28,formalArt:'HOLD',human:'HOLD'};
}
const result=verify(proof);
const tampered=structuredClone(proof);tampered.ART='PASS';assert.throws(()=>verify(tampered));
const pos=structuredClone(proof);pos.sessions[1].screens[0].sourceScreenshotState.xyz[0]+=1;assert.throws(()=>verify(pos));
const fake=structuredClone(proof);fake.sessions[0].screens[0].pngSHA256='0'.repeat(64);assert.throws(()=>verify(fake));
const fakeB51=structuredClone(proof);fakeB51.sessions[0].screens[0].sourceScreenshotState.currentB51=0;assert.throws(()=>verify(fakeB51));
console.log('R19A2_INDEPENDENT_36_NATIVE_WEBGL2',JSON.stringify({...result,forgeriesRejected:4}));

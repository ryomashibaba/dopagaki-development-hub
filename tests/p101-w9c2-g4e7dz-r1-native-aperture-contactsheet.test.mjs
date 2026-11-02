import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {aperture,project,projection,verifyBaseline,PROFILES} from '../scripts/p101-w9c2-g4e7dz-r1-native-aperture-contactsheet.mjs';
test('Frozen native 36mm vertical sensor, 24.3mm lens projection directions',()=>{
 const f={eye:[0,0,0],front:[0,0,1]};
 assert.deepEqual([project(f,[0,0,100]).x,project(f,[0,0,100]).y],[504,322.5]);
 assert.ok(project(f,[-10,0,100]).x>504);
 assert.ok(project(f,[0,10,100]).y<322.5);
 assert.equal(project(f,[0,0,-1]),null);
});
test('Three distinct native site anchors and four-stage frame requirements',()=>{
 assert.equal(PROFILES.length,3);
 assert.equal(new Set(PROFILES.map(p=>p.anchor)).size,3);
 for(const p of PROFILES){
  assert.equal(p.frames.length,4);
  const c=aperture({pose:{position:[0,0,100],forward:[0,0,1]}},p);
  assert.equal(c.length,4);
  assert.equal(c[0][1],p.base);
  assert.equal(c[2][1],p.base+p.height);
 }
});
test('Never confuse view bounds with occlusion / art / safe 3D structure',()=>{
 const f={eye:[0,0,0],front:[0,0,1]};
 const q=projection(f,[[-10,0,100],[10,0,100],[10,20,100],[-10,20,100]]);
 assert.equal(q.visible,true);
 assert.equal(q.reason,'ON_SCREEN_NOT_OCCLUSION_TESTED');
 assert.equal(projection(f,[[900,0,100],[1000,0,100],[1000,20,100],[900,20,100]]).visible,false);
 assert.equal(projection(f,[[0,0,-10],[1,0,-10],[1,1,-10],[0,1,-10]]).visible,false);
});
test('Original screen files must pass all twenty SHA256 verifications',()=>{
 const bytes=Buffer.from('sample');
 const m={id:'G4E7DJ_PRIVATE_NATIVE_STORYBOARD',coreNativeFramesMatched:true,
  original7B48:true,original28B51:true,gap52:true,art:'HOLD',human:'HOLD',publish:'HOLD',officialSlope2Meters:0,
  frames:Array.from({length:20},(_,i)=>({road:i<10?'true-pinch':'pinch-switch',
   file:'file-'+i+'.png',nativeCameraIdentity:true,
   sha256:crypto.createHash('sha256').update(bytes).digest('hex')}))};
 assert.equal(verifyBaseline(m,()=>bytes),true);
 assert.throws(()=>verifyBaseline(m,()=>Buffer.from('bad')),/SHA256 mismatch/);
 assert.throws(()=>verifyBaseline({...m,original7B48:false},()=>bytes),/baseline rejected/);
});

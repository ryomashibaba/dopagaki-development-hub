/** R19 A3: independent real WebGL2 16-image native proof.
 * Compare exactly one design versus bare original B48+28 B51,
 * same 4 native ticks and no physical source modifications.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const dir=path.resolve('r19-evidence/r19a3');
const proof=JSON.parse(fs.readFileSync(path.join(dir,'R19_A3R_ONE_CITY_TWO_ROAD_TRUE_CAMERA.json'),'utf8'));
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
function verify(p){
 assert.equal(p.schema,'dopagaki.r19a3r-one-city-two-road-actual-12second-art-comparison/1');
 assert.equal(p.originalSourceSHA,'af076d67492a677d2235e4730aef8cdf4808e106');
 assert.equal(p.originalB48,7);assert.equal(p.originalMovingB51,28);
 assert.equal(p.failures.length,0);assert.equal(p.sessions.length,4);
 assert.equal(p.ART,'HOLD');assert.equal(p.GAMEPLAY,'HOLD');assert.equal(p.HUMAN,'HOLD');
 assert.equal(p.PERFORMANCE,'HOLD');assert.equal(p.SLOPE2_OFFICIALLY_CERTIFIED_M,0);
 const ids=new Set(),baselines=new Map();let n=0,realDifferent=0;
 for(const s of p.sessions){
  const id=s.kind+'/'+s.layer;
  assert.ok(['control','ultra'].includes(s.kind));
  assert.ok(['off','on'].includes(s.layer));
  assert.ok(!ids.has(id));ids.add(id);
  assert.equal(s.rawCamera,true);assert.equal(s.nativeP96NotHuman,true);
  assert.equal(s.sourceGameChanged,false);
  assert.equal(s.before.webgl2,true);assert.equal(s.before.originalB51,28);
  assert.equal(s.before.r19a3Active,s.layer==='on');
  if(s.layer==='on'){
   assert.equal(s.before.r19a3ColliderCount,0);
   assert.ok(s.before.r19a3Triangles>2000);
  }
  assert.equal(s.screens.length,6);
  for(let i=0;i<6;i++){
   const f=s.screens[i];
   assert.equal(f.tick,p.nativeTicks[i]);assert.equal(f.sourceScreenshotState.tick,f.tick);
   assert.equal(f.sourceScreenshotState.status,'running');
   assert.equal(f.sourceScreenshotState.actualMask,'road-hazards-only');
   assert.equal(f.sourceScreenshotState.civicCityEnabled,s.layer==='on'?'true':'false');
   assert.equal(f.sourceScreenshotState.currentB51,28);
   assert.equal(f.sourceScreenshotState.occlusion,'true');
   assert.equal(f.sourceScreenshotState.camera,'ball-lock-unfiltered-heading');
   assert.equal(f.sourceScreenshotState.road,f.sourceNativeB48Road);
   assert.ok(f.actualPhysicalXYZDeltaM<.08);
   assert.ok(f.actualPhysicalSpeedDeltaMps<.05);
   const filename=path.resolve(dir,f.file);
   assert.ok(filename.startsWith(dir+path.sep));
   const raw=fs.readFileSync(filename);
   assert.equal(raw.length,f.pngBytes);
   assert.equal(sha(raw),f.pngSHA256);
   const key=s.kind+'/'+f.tick;
   if(s.layer==='off')baselines.set(key,f);
   else {
    const base=baselines.get(key);
    assert.ok(base,'bare original baseline absent for '+key);
    const delta=Math.hypot(...f.sourceScreenshotState.xyz.map((v,j)=>v-base.sourceScreenshotState.xyz[j]));
    assert.ok(delta<.0001,'private art changed true physical ball position '+key);
    assert.ok(Math.abs(f.sourceScreenshotState.speed-base.sourceScreenshotState.speed)<.0001);
    if(base.pngSHA256!==f.pngSHA256)realDifferent++;
   }
   n++;
  }
 }
 assert.equal(ids.size,4);assert.equal(n,24);assert.ok(realDifferent>0);
 return {sessions:ids.size,native24Frames:n,independentPNGHashVerified:n,
  artTrulyChangesSourceCanvasFrames:realDifferent,sourceRoads:7,realB51:28,
  sourcePhysicsUnchanged:true,officialArtApproved:0,officialSlope40Meters:0};
}
const result=verify(proof);
const change=p=>structuredClone(p);
const fake=change(proof);fake.ART='PASS';assert.throws(()=>verify(fake));
const fake2=change(proof);fake2.sessions[2].screens[0].sourceScreenshotState.xyz[0]+=1;assert.throws(()=>verify(fake2));
const fake3=change(proof);fake3.sessions[3].screens[0].pngSHA256='0'.repeat(64);assert.throws(()=>verify(fake3));
const fake4=change(proof);fake4.sessions[3].before.r19a3ColliderCount=4;assert.throws(()=>verify(fake4));
console.log('R19A3_INDEPENDENT_REAL_NATIVE_CITY_GATE',JSON.stringify({...result,fakeProofRejected:4}));

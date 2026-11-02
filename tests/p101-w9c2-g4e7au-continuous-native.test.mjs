import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {g4e7auEvidence} from '../scripts/p101-w9c2-g4e7au-continuous-native.mjs';

test('AU compare actual start00 and real second-road checkpoint without falsely certifying',()=>{
 const r=g4e7auEvidence({seconds:40});
 assert.equal(r.actualNativeHz,240);assert.equal(r.realB48Roads,7);
 assert.equal(r.realB51Moving,28);assert.equal(r.authoredFormalSlope2Meters,0);
 assert.equal(r.actualHumanPlay,'HOLD');assert.equal(r.publish,'HOLD');
 assert.deepEqual(r.records.map(x=>x.road),['true-pinch','pinch-switch']);
 for(const road of r.records){
  assert.deepEqual(road.compare.map(x=>x.id),['AS_BASELINE','AT_CROWN_CHASM']);
  for(const {start00:s} of road.compare){
   assert(s.endedSeconds>0&&s.endedSeconds<=40.005);
   assert(['running','failed','finished'].includes(s.status));
   assert(s.visitedSurfaceIds.length>=1);
   assert(s.closestRoad2.meters!==null);
   assert.equal(s.realPhysicsHz,240);
   assert.equal(s.method,'REAL_START00_P96_FIXED_PROFILE_DIV4_8_NOT_HUMAN');
  }
  assert.deepEqual(road.isolatedSecondRoad.map(x=>[x.u,x.speedMps]),
   [[.18,105],[.18,165],[.7,105],[.7,165]]);
  for(const trial of road.isolatedSecondRoad){
   assert(trial.seconds>0&&trial.seconds<=3.405);
   assert(['running','failed','finished'].includes(trial.status));
   assert(Number.isFinite(trial.projectedForwardU));
   assert.equal(trial.normalGameplayReachability,'UNPROVEN');
   assert.equal(trial.method,'ISOLATED_2ND_ROAD_CHECKPOINT_240HZ_NOT_A_NORMAL_START00');
  }
 }
 if(process.env.DOPAGAKI_G4E7AU_EVIDENCE){
  const file=process.env.DOPAGAKI_G4E7AU_EVIDENCE;
  fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(r,null,2)+'\n');
 }
});
test('AU refuses tiny test horizon',()=>assert.throws(()=>g4e7auEvidence({seconds:2}),/test seconds bound/));

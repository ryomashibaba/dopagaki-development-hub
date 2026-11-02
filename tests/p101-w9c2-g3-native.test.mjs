import test from 'node:test';
import assert from 'node:assert/strict';
import {generateP101W9C2SCrestCandidate} from '../scripts/p101-w9c2-s-crest-build.mjs';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {runW9C2G3Passage,w9c2CurvatureDiagnostics} from '../scripts/p101-w9c2-g3-native-passage.mjs';
import {DT,RADIUS} from '../private/reference_only/director/physics.js';

test('W9-C2 G3 measured horizontal curvature is finite and strictly separated from Gold',()=>{
 const baseline=w9c2CurvatureDiagnostics(generateP101A13W7Candidate());
 for(const kind of ['ribbon','edge']){
  const shape=w9c2CurvatureDiagnostics(generateP101W9C2SCrestCandidate(kind));
  assert(Number.isFinite(shape.minimumHorizontalTurnRadiusMeters)&&shape.minimumHorizontalTurnRadiusMeters>0);
  assert(shape.minimumRealB48WidthMeters>10);
  assert(shape.peakHorizontalCurvaturePerMeter>baseline.peakHorizontalCurvaturePerMeter);
  assert(shape.theoreticalHorizontalAccelDemandMps2['150']>
   shape.theoreticalHorizontalAccelDemandMps2['52']);
  assert(shape.caveat.includes('simulation'),'cannot confuse static curvature with full physics');
 }
});
test('G3 uses an authentic native 240Hz local ballistic run with real solid machines and honest HOLD',()=>{
 assert.equal(1/DT,240);assert.equal(RADIUS,.65);
 const result=runW9C2G3Passage('ribbon',52,{maxSeconds:5.1});
 assert.equal(result.actualRunner,true);
 assert.equal(result.explicitSyntheticLocalStart,true);
 assert.equal(result.fullCourseStart,false);
 assert.equal(result.controller,'P94_CORRECTIVE_SCRIPT_NOT_HUMAN');
 assert.equal(result.collisionRecovery,false);
 assert.equal(result.physicsHz,240);
 assert.equal(result.machineBodies,28);
 assert.equal(result.readyOnRealPhysicalRoad,true);
 assert(result.elapsedSeconds>0);
 assert(['running','failed','finished'].includes(result.status));
 assert(result.trace.every(x=>x.speedMps>=0&&Number.isFinite(x.speedMps)));
 assert(result.trace.every(x=>x.steer>=-1&&x.steer<=1));
 assert(result.limitations.some(x=>x.includes('not a real person')));
});
test('G3 fails closed on undeclared speed or kind and does not rewrite stage assets',()=>{
 for(const args of [['edge',200],['unknown',52],['gold',-52]]){
  assert.throws(()=>runW9C2G3Passage(...args),/strict native QA matrix/);
 }
 const baseline=generateP101A13W7Candidate(),before=JSON.stringify(baseline);
 w9c2CurvatureDiagnostics(baseline);
 assert.equal(JSON.stringify(baseline),before);
});

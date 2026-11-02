import test from 'node:test';
import assert from 'node:assert/strict';
import {buildDtMassingPlan,DT_CLEFS,DT_TIMES} from '../scripts/p101-w9c2-g4e7dt-three-clef-plan.mjs';
import {g4e7djNativeStoryboard} from '../scripts/p101-w9c2-g4e7dj-native-storyboard.mjs';
test('DT three distinctly sculpted and cleared inhabited clefs in same protected original 240Hz real B48 city',()=>{
 const native=g4e7djNativeStoryboard();
 const a=buildDtMassingPlan('true-pinch',native);
 const b=buildDtMassingPlan('pinch-switch',native);
 assert.equal(DT_CLEFS.length,3);
 assert.deepEqual(DT_TIMES,['t1550','t1600','t1650']);
 for(const z of [a,b]){
  assert.equal(z.schema,'dopagaki.g4e7dt-three-clef-unadopted/1');
  assert.equal(z.candidateCount,1);
  assert.equal(z.mainSculpturalDistricts,3);
  assert.equal(z.sites.length,3);
  assert.equal(z.sites.every(s=>s.roadGuideMinimumDistance>s.radius+19),true);
  assert.equal(z.sites.every(s=>s.projectionProbeOnly.length===3),true);
  assert.equal(z.sites.every(s=>s.projectionProbeOnly.every(p=>p.z>80&&p.x>.12&&p.x<.89&&p.y>.11&&p.y<.83)),true);
  assert.equal(z.additionalGameColliders,0);
  assert.equal(z.changedGameplay,false);
  assert.equal(z.formalSlope2Meters,0);
  assert.equal(z.art,'HOLD');
  assert.equal(z.realWebGL,'NOT_RUN');
 }
 assert.deepEqual(a.sites.map(s=>s.center),b.sites.map(s=>s.center));
 assert.equal(a.sourceOriginalCXVertexSha256,b.sourceOriginalCXVertexSha256);
 assert.throws(()=>buildDtMassingPlan('arbitrary',native),/unsupported BC road/);
});
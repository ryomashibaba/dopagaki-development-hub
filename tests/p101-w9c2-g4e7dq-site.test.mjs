import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {g4e7dqNativePlacement} from '../scripts/p101-w9c2-g4e7dq-native-site.mjs';
import {g4e7djNativeStoryboard} from '../scripts/p101-w9c2-g4e7dj-native-storyboard.mjs';
test('DQ existing authored BW R3 spans all original 240Hz views without changing protected BC stage',()=>{
 assert.ok(fs.statSync('artifacts/private/g4e7bw-halocut-concourse-r3/G4E7BW_HALOCUT_CONCOURSE_SOURCE.blend').size>1000000);
 const native=g4e7djNativeStoryboard();
 const a=g4e7dqNativePlacement('true-pinch',native);
 const b=g4e7dqNativePlacement('pinch-switch',native);
 for(const z of [a,b]){
  assert.equal(z.schema,'dopagaki.g4e7dq-readonly-original-bw-r3-site/1');
  assert.equal(z.assetSource,'EXISTING_R3_ALREADY_UNADOPTED_NOT_NEW_DESIGN');
  assert.equal(z.projections.length,5);
  assert.equal(z.scale,.38);
  assert.ok(z.projections.every(p=>p.visibleArea>.016&&p.visibleArea<.45));
  assert.equal(z.newRoads,0);
  assert.equal(z.newColliders,0);
  assert.equal(z.newMovers,0);
  assert.equal(z.officialSlope2Meters,0);
  assert.equal(z.art,'HOLD');
  assert.equal(z.human,'HOLD');
  assert.equal(z.publish,'HOLD');
 }
 assert.deepEqual(a.worldOrigin,b.worldOrigin);
 assert.equal(a.cxVertexSha256,b.cxVertexSha256);
 assert.throws(()=>g4e7dqNativePlacement('invalid',native),/unsupported BC road/);
});

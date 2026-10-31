import test from 'node:test';
import assert from 'node:assert/strict';
import {DS_SITES,dsSpatialProof} from '../scripts/p101-w9c2-g4e7ds-meridian-site.mjs';
import {g4e7djNativeStoryboard} from '../scripts/p101-w9c2-g4e7dj-native-storyboard.mjs';
test('DS one common five-district city stands off EVERY genuine B48 road, through both native 240Hz routes',()=>{
 const native=g4e7djNativeStoryboard();
 const a=dsSpatialProof('true-pinch',native);
 const b=dsSpatialProof('pinch-switch',native);
 assert.equal(DS_SITES.length,5);
 for(const v of [a,b]){
  assert.equal(v.schema,'dopagaki.g4e7ds-one-world-meridian-native-camera-planning/1');
  assert.equal(v.siteCount,5);assert.equal(v.sameArtWorldAcrossRoads,true);
  assert.ok(v.sites.every(s=>s.visibleCameras===5));
  assert.ok(v.sites.every(s=>s.minB48GuideXYDistanceMeters>s.radius+30));
  assert.ok(v.sites.every(s=>s.cameraProjections.filter(p=>p.id==='t1550'||p.id==='t1600'||p.id==='t1650').every(p=>p.x>.15&&p.x<.85&&p.y>.14&&p.y<.78)));
  assert.equal(v.gamePhysicsChanged,false);
  assert.equal(v.newColliders,0);
  assert.equal(v.art,'HOLD');
  assert.equal(v.formalSlope2Meters,0);
 }
 assert.deepEqual(a.sites.map(s=>s.worldCenter),b.sites.map(s=>s.worldCenter));
 assert.equal(a.originalCXVertexSha256,b.originalCXVertexSha256);
 assert.throws(()=>dsSpatialProof('hypothetical-road',native),/unsupported BC road/);
});
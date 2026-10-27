import test from 'node:test';
import assert from 'node:assert/strict';
import {buildDyIntegratedSlice,DY_ROADS,DY_GATES,DY_METRES}
 from '../scripts/p101-w9c2-g4e7dy-integrated-slice.mjs';

test('DY original real B48 360m route-centered integrated city guide, no art/play claims',()=>{
 const {report,objs}=buildDyIntegratedSlice();
 assert.equal(report.originalCXSourceBlob,'af076d67492a677d2235e4730aef8cdf4808e106');
 assert.equal(report.originalPhysicalRoadCount,7);
 assert.equal(report.originalB51MovingCount,28);
 assert.equal(report.originalGap52,true);
 assert.equal(report.sourceRoadModified,false);
 assert.equal(report.sourceCameraModified,false);
 assert.equal(report.newGameColliders,0);
 assert.equal(report.newGameRoads,0);
 assert.equal(report.requestedPhysicalArcMeters,DY_METRES);
 assert.deepEqual(Object.keys(report.roads),[...DY_ROADS]);
 for(const road of DY_ROADS){
  const r=report.roads[road];
  assert.ok(r.sourceRoadId);
  assert.ok(r.sourceSection>=0&&r.sourceSection<7);
  assert.ok(Number.isFinite(r.distance16sPlayerToB48CenterMeters));
  assert.ok(r.physicalSourceSectionArcMeters>=360);
  assert.equal(r.sampledPhysicalWindowMeters,360);
  assert.equal(r.stationCount,21);
  assert.equal(r.originalMovingHazards,28);
  assert.ok(r.minRealRoadWidthMeters>1.3);
  assert.ok(r.maxRealRoadWidthMeters>=r.minRealRoadWidthMeters);
  assert.deepEqual(r.gates.map(x=>x.name),DY_GATES);
  for(const [i,g] of r.gates.entries()){
   assert.equal(g.physicalArcRelativeMeters,i*90);
   assert.ok(g.worldB48Center.every(Number.isFinite));
   assert.deepEqual(g.nativeFrames.map(x=>x.id),['t1550','t1600','t1650']);
   assert.ok(g.nativeFrames.every(x=>typeof x.onScreen==='boolean'));
   assert.equal(g.physicalFloor,'EXISTING_SOURCE_B48_ONLY');
   assert.equal(g.futureCivicDecks,'NOT_BUILT');
  }
  assert.equal(objs[road].split('\n').filter(s=>s.startsWith('v ')).length,105);
  assert.ok(objs[road].includes('g CENTER_SOURCE_GUIDE'));
  assert.ok(!objs[road].includes('\nf '));
 }
 assert.equal(report.actualWebGL,'NOT_RENDERED');
 assert.equal(report.architecture,'NOT_MODELLED_WIREFRAME_ONLY');
 assert.equal(report.fullOcclusion,'NOT_TESTED');
 assert.equal(report.clearance,'NOT_CERTIFIED');
 assert.equal(report.manualHumanTest,'NOT_RUN');
 assert.equal(report.art,'HOLD');
 assert.equal(report.gameplay,'HOLD');
 assert.equal(report.formalArtAdoptionCount,0);
 assert.equal(report.formalSlope2Meters,0);
 assert.equal(report.publish,'HOLD');
 assert.equal(report.merge,'HOLD');
});
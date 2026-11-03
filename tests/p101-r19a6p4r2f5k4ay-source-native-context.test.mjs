import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {buildK4AY} from '../scripts/p101-r19a6p4r2f5k4ay-export-true-road5-b51.mjs';
const cameraFile='docs/K4AX_TRUE_SOURCE_ROAD5_CAMERA_REFERENCE_20261103.json';
const load=()=>JSON.parse(fs.readFileSync(cameraFile,'utf8'));
test('source B48 is actual Road5 tessellation for both authentic W9C1 native stages',()=>{
  const doc=buildK4AY(load());
  assert.equal(doc.frozenOriginalGameGitBlob,'af076d67492a677d2235e4730aef8cdf4808e106');
  assert.deepEqual(Object.keys(doc.modes),['control','ultra']);
  for(const [mode,m] of Object.entries(doc.modes)){
    assert.equal(m.roadID,'p93-PRISM_CREST-01');
    assert.equal(m.allB48SurfaceIDs.length,7);
    assert.equal(m.B51Count,28);
    assert.equal(m.mesh.degenerate,0);
    assert.equal(m.mesh.positions.length%3,0);
    assert.equal(m.mesh.indices.length%3,0);
    assert.equal(m.mesh.indices.length/3,m.trueSourceTriangleCount);
    assert.equal(m.mesh.topIndexCount/3,m.trueSourceTopTriangleCount);
    assert.ok(m.mesh.positions.every(Number.isFinite));
    assert.ok(m.mesh.indices.every(i=>Number.isInteger(i)&&i>=0&&i<m.mesh.positions.length/3));
    assert.equal(m.sourceTimeRecords.length,3);
    assert.ok(m.sourceStageID.endsWith(mode.toUpperCase()));
  }
});
test('28 original B51 collision OBBS for all 6 original camera native ticks',()=>{
  const doc=buildK4AY(load());
  for(const [mode,m] of Object.entries(doc.modes)){
    for(const r of m.sourceTimeRecords){
      assert.equal(r.mode,mode);
      assert.ok(Math.abs(r.sourceNativeSeconds-r.tick/240)<1e-12);
      assert.equal(r.B51CollisionOBBNotOriginalVisibleMesh.length,28);
      assert.equal(new Set(r.B51CollisionOBBNotOriginalVisibleMesh.map(x=>x.id)).size,28);
      for(const p of r.B51CollisionOBBNotOriginalVisibleMesh){
        assert.equal(p.sourceDescriptorId,p.id);
        assert.equal(p.center.length,3);
        assert.equal(p.halfSize.length,3);
        assert.ok(p.halfSize.every(x=>x>0));
        assert.ok(Number.isFinite(p.yawRadians));
      }
      assert.equal(r.originalRoadIDFromK4AV,'p93-PRISM_CREST-01');
    }
  }
  assert.equal(doc.modes.control.allB51DescriptorsSHA256,doc.modes.ultra.allB51DescriptorsSHA256);
  assert.equal(doc.alteredGameRoads,0);
  assert.equal(doc.newGameColliders,0);
  assert.equal(doc.formalArtAccepted,0);
  assert.equal(doc.slope2DNAMetres,0);
  assert.equal(doc.gates.ART,'REJECT_HOLD');
});
test('camera evidence may not be silently replaced with synthetic or changed provenance',()=>{
  const altered=load();
  altered.records[0].tick=11260;
  assert.throws(()=>buildK4AY(altered));
  const altered2=load();altered2.evidenceSource.gamePhysicsHz=60;
  assert.throws(()=>buildK4AY(altered2));
  const altered3=load();altered3.evidenceSource.sourceBlob='invalid';
  assert.throws(()=>buildK4AY(altered3));
});

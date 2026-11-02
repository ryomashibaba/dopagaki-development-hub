import test from 'node:test';
import assert from 'node:assert/strict';
import {auditArtistGLB} from '../scripts/p101-w9c2-g4e7bp-artist-asset-intake.mjs';

function fixture(overrides={}){
 const vertices=Buffer.from(new Float32Array([
  0,0,0, 5,0,0, 0,8,0,
  0,0,0, 0,8,0, 0,0,5,
  0,0,0, 5,0,0, 0,0,5
 ]).buffer);
 const j={asset:{version:'2.0'},scenes:[{nodes:[0]}],scene:0,
  nodes:[{mesh:0}],meshes:[{primitives:[{mode:4,attributes:{POSITION:0},material:0}]}],
  materials:[{pbrMetallicRoughness:{baseColorFactor:[.7,.8,.9,1],roughnessFactor:.33}}],
  buffers:[{byteLength:vertices.length}],
  bufferViews:[{buffer:0,byteOffset:0,byteLength:vertices.length}],
  accessors:[{bufferView:0,componentType:5126,type:'VEC3',count:9,min:[0,0,0],max:[5,8,5]}],...overrides};
 const raw=Buffer.from(JSON.stringify(j)),json=Buffer.alloc(Math.ceil(raw.length/4)*4,32);raw.copy(json);
 const total=12+8+json.length+8+vertices.length,b=Buffer.alloc(total);
 b.writeUInt32LE(0x46546c67,0);b.writeUInt32LE(2,4);b.writeUInt32LE(total,8);
 b.writeUInt32LE(json.length,12);b.writeUInt32LE(0x4e4f534a,16);json.copy(b,20);
 const p=20+json.length;b.writeUInt32LE(vertices.length,p);b.writeUInt32LE(0x004e4942,p+4);vertices.copy(b,p+8);
 return b;
}
const claim={assetId:'g4e7bp-original-urban-001',author:'Model Author',
 sourceTool:'Blender glTF2 exporter',sourceFile:'urban-block-01.blend',rights:'original-work',
 unitsMetersPerUnit:1,coordinateSystem:'glTF-Y-UP',reviewStatus:'HOLD',publicationStatus:'HOLD'};
test('BP original-model intake validates real binary GLB, not aesthetic certification',()=>{
 const report=auditArtistGLB(fixture(),claim);
 assert.equal(report.glb.triangles,3);
 assert.equal(report.glb.materials,1);
 assert.deepEqual(report.glb.meshLocalAABB.span,[5,8,5]);
 assert.equal(report.provenanceClaim.verification,'SELF_DECLARED_NOT_INDEPENDENTLY_VERIFIED');
 assert.equal(report.realCameraWebGLProof,'NOT_YET_RUN');
 assert.equal(report.publicRelease,'FORBIDDEN');
 assert.equal(report.humanVisualReview,'HOLD');
 assert.equal(report.officialSlope2CertifiedMeters,0);
 assert.equal(report.sha256.length,64);
 assert(report.warnings.some(s=>s.startsWith('LOW_GEOMETRY_COMPLEXITY')));
});
test('BP requires declared original-work or documented licensable third-party rights',()=>{
 const glb=fixture();
 assert.throws(()=>auditArtistGLB(glb,{...claim,rights:'stolen'}),/rights/);
 assert.throws(()=>auditArtistGLB(glb,{...claim,rights:'appropriately-licensed-third-party'}),/license/);
 const accepted=auditArtistGLB(glb,{...claim,rights:'appropriately-licensed-third-party',
  licenseName:'CC BY 4.0',licenseEvidence:'https://creativecommons.org/licenses/by/4.0/'});
 assert.equal(accepted.provenanceClaim.rights,'appropriately-licensed-third-party');
 assert.equal(accepted.provenanceClaim.verification,'SELF_DECLARED_NOT_INDEPENDENTLY_VERIFIED');
});
test('BP rejects remote files, unsupported compression and corrupt glTF headers',()=>{
 assert.throws(()=>auditArtistGLB(fixture({images:[{uri:'https://example.com/x.png'}]}),claim),/embedded/);
 assert.throws(()=>auditArtistGLB(fixture({buffers:[{uri:'https://example.com/mesh.bin',byteLength:108}]}),claim),/embedded/);
 assert.throws(()=>auditArtistGLB(fixture({extensionsRequired:['KHR_draco_mesh_compression']}),claim),/compressed/);
 const bad=fixture();bad.writeUInt32LE(0,0);assert.throws(()=>auditArtistGLB(bad,claim),/binary glTF2/);
});
test('BP preserves explicit HOLD and meter / Y-up contracts',()=>{
 assert.throws(()=>auditArtistGLB(fixture(),{...claim,reviewStatus:'PASS'}),/approvals/);
 assert.throws(()=>auditArtistGLB(fixture(),{...claim,unitsMetersPerUnit:.01}),/meter scale/);
 assert.throws(()=>auditArtistGLB(fixture(),{...claim,coordinateSystem:'Z-up'}),/Y-up/);
});

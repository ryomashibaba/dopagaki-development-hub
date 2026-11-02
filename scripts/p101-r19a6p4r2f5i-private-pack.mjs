/**
 * PRIVATE ONLY source-certified I GLB, original+F+G2 frozen.
 * Reuse H strict SHA-pinned archived GLB readback.
 */
import './p101-r19a6p4r2f5h-archived-native-private-pack.mjs';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {unpackBlenderEditedGLB,verifySourceOfBlenderEdit} from './p101-r19a6p1-read-blender-glb.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const src=path.join(root,'r19-evidence/r19a6p4r2f5i');
const dst=path.join(root,'dist-private/r19a6p4r2f5i');
const original=path.join(root,'dist-private/r19a6');
assert.ok(fs.existsSync(path.join(original,'drive3d.mjs')));
fs.rmSync(dst,{recursive:true,force:true});fs.cpSync(original,dst,{recursive:true});
let code=fs.readFileSync(path.join(dst,'drive3d.mjs'),'utf8');
const manifest={schema:'dopagaki.r2f5i-real-native-two-original-road-modes/1',
sourceBlob:'af076d67492a677d2235e4730aef8cdf4808e106',ART:'HOLD',collidersAdded:0,
architecture:'LONGITUDINAL_INHABITED_STREET_NOT_STANDALONE_TOWERS',I:{},previousArchivedRun:41299372268};
for(const mode of ['ultra','control']){
 const name='P4R2F5I_'+mode;
 const report=JSON.parse(fs.readFileSync(path.join(src,name+'_blender_report.json')));
 const binary=fs.readFileSync(path.join(src,name+'_edited.glb'));
 assert.equal(sha(binary),report.edited_glb_sha256);
 assert.equal(report.originalSourceBlob,manifest.sourceBlob);
 assert.equal(verifySourceOfBlenderEdit(report),true);
 assert.equal(report.new_colliders,0);
 assert.equal(report.globalB48B51ClearanceVerified,false);
 assert.equal(report.districts.length,5);
 const first=report.districts[0].roadsidePublicFacilities[0],old=report.districts[1].roadsidePublicFacilities[0];
 assert.equal(first.nativeOriginalRoad1U,.125);assert.equal(first.offsetFromOriginalRoadEdgeM,45);
 assert.equal(old.nativeOriginalRoad1U,.350);assert.equal(old.offsetFromOriginalRoadEdgeM,35);
 assert.ok(first.nativeBlenderPartCount>=105);
 const read=unpackBlenderEditedGLB(binary,report);
 assert.equal(read.meshInstances,5);assert.ok(read.triangles>10566&&read.triangles<50000);
 const buf=Buffer.from(read.vertices.buffer,read.vertices.byteOffset,read.vertices.byteLength);
 fs.writeFileSync(path.join(dst,'R19A6_'+mode+'_GPU_VERTICES.bin'),buf);
 manifest.I[mode]={editedGlbSha256:sha(binary),bytes:buf.length,triangles:read.triangles};
 if(manifest.I.triangles!==undefined)assert.equal(manifest.I.triangles,read.triangles);
 manifest.I.triangles=read.triangles;
}
assert.equal(code.split("get('r19a6')").length,2);
code=code.replace("get('r19a6')","get('r19a6p4r2f5i')");
const expected=/const expected=r19a6Kind==='ultra'\?\d+:\d+;/;
assert.ok(expected.test(code));
code=code.replace(expected,"const expected=r19a6Kind==='ultra'?"+manifest.I.ultra.bytes+":"+manifest.I.control.bytes+";");
assert.equal(code.split('PINNED_ORIGINAL_GLB_IMPORTED_ART_REJECT').length,2);
code=code.replace('PINNED_ORIGINAL_GLB_IMPORTED_ART_REJECT','R2F5I_VERIFIED_NATIVE_STREET_ART_HOLD');
fs.writeFileSync(path.join(dst,'drive3d.mjs'),code);
fs.mkdirSync(src,{recursive:true});
fs.writeFileSync(path.join(src,'R2F5I_PINNED_ASSETS.json'),JSON.stringify(manifest,null,2)+'\n');
console.log('R2F5I_NATIVE_GLTF_SOURCE_PINNED',JSON.stringify(manifest));

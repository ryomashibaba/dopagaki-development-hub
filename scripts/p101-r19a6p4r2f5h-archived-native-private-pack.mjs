/** R2F5-H rehydrate only verified F and G2 GLB assets, no Blender. */
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
import {unpackBlenderEditedGLB,verifySourceOfBlenderEdit} from './p101-r19a6p1-read-blender-glb.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+b.length+'\0'),b])).digest('hex');
const ORIGINAL='af076d67492a677d2235e4730aef8cdf4808e106';
assert.equal(blob(fs.readFileSync(path.join(root,'web/p101-w9c2-g4e7ci-integrated-streetscape.mjs'))),ORIGINAL);
const base=path.join(root,'dist-private/r19a6');
assert.ok(fs.existsSync(path.join(base,'drive3d.mjs')),'need original A6 runtime');
const expect={
f:{ultra:'c489483dd2c75b404bb7ae51327d2cb7b7b2cbadb7e2be70a82529303b80a22a',
control:'7ac07e104f863ce0844bfa432e9abe3b7105e318438d0feb2808dd0abe909587',tris:44172},
g2:{ultra:'13f00329b41f727eec22d95f54152b36272570ca7f883314e2311c7f71813250',
control:'2194aac95d1cf4c30d2b0f9940e1737e08b08db92a3ace7601bcad7ba1fee587',tris:44568}
};
const manifest={schema:'dopagaki.r2f5h-frozen-gltf-private/1',
originalGitBlob:ORIGINAL,sourceRun:41299372268,sourceArtifact:13080348046,
sourcePhysicsUnmodified:true,newColliders:0,ART:'HOLD',variants:{}};
for(const variant of ['f','g2']){
 const id='r19a6p4r2f5h'+variant,dst=path.join(root,'dist-private',id);
 fs.rmSync(dst,{recursive:true,force:true});fs.cpSync(base,dst,{recursive:true});
 const modes={};let code=fs.readFileSync(path.join(dst,'drive3d.mjs'),'utf8');
 for(const mode of ['ultra','control']){
  const prefix='P4R2F5'+variant.toUpperCase()+'_'+mode;
  const input=path.join(root,'r19-evidence/r19a6p4r2f5'+variant);
  const binary=fs.readFileSync(path.join(input,prefix+'_edited.glb'));
  const report=JSON.parse(fs.readFileSync(path.join(input,prefix+'_blender_report.json')));
  assert.equal(sha(binary),expect[variant][mode]);
  assert.equal(report.edited_glb_sha256,expect[variant][mode]);
  assert.equal(report.originalSourceBlob,ORIGINAL);
  assert.equal(report.new_colliders,0);
  assert.equal(report.globalB48B51ClearanceVerified,false);
  assert.equal(verifySourceOfBlenderEdit(report),true);
  const gpu=unpackBlenderEditedGLB(binary,report);
  assert.equal(gpu.meshInstances,5);assert.equal(gpu.triangles,expect[variant].tris);
  assert.ok(gpu.triangles<50000);
  const data=Buffer.from(gpu.vertices.buffer,gpu.vertices.byteOffset,gpu.vertices.byteLength);
  fs.writeFileSync(path.join(dst,'R19A6_'+mode+'_GPU_VERTICES.bin'),data);
  modes[mode]={sha256:sha(binary),gpuBytes:data.length,triangles:gpu.triangles};
 }
 assert.equal(code.split("get('r19a6')").length,2);
 code=code.replace("get('r19a6')","get('"+id+"')");
 const pattern=/const expected=r19a6Kind==='ultra'\?\d+:\d+;/;
 assert.ok(pattern.test(code));
 code=code.replace(pattern,"const expected=r19a6Kind==='ultra'?"+modes.ultra.gpuBytes+":"+modes.control.gpuBytes+";");
 assert.equal(code.split('PINNED_ORIGINAL_GLB_IMPORTED_ART_REJECT').length,2);
 code=code.replace('PINNED_ORIGINAL_GLB_IMPORTED_ART_REJECT','R2F5H_'+variant.toUpperCase()+'_VERIFIED_GLTF_HOLD');
 fs.writeFileSync(path.join(dst,'drive3d.mjs'),code);
 manifest.variants[variant]={id,modes};
}
const dest=path.join(root,'r19-evidence/r19a6p4r2f5h');
fs.mkdirSync(dest,{recursive:true});
fs.writeFileSync(path.join(dest,'R2F5H_PINNED_ASSETS.json'),JSON.stringify(manifest,null,2)+'\n');
console.log('R2F5H_FROZEN_GLTF_VALIDATED',JSON.stringify(manifest));

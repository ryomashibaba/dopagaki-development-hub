/** K4 private only: one native Road0 marketplace added to original archived source 3D.
 * No new movement surfaces/colliders, no core/source, production, or main edits.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {unpackBlenderEditedGLB,verifySourceOfBlenderEdit} from './p101-r19a6p1-read-blender-glb.mjs';
const ORIGINAL='af076d67492a677d2235e4730aef8cdf4808e106';
const blob=b=>crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+b.length+'\0'),b])).digest('hex');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
assert.equal(blob(fs.readFileSync('web/p101-w9c2-g4e7ci-integrated-streetscape.mjs')),ORIGINAL);
const base=path.resolve('dist-private/r19a6');
const out=path.resolve('dist-private/r19a6p4r2f5k4');
const src=path.resolve('r19-evidence/r19a6p4r2f5k4');
assert.ok(fs.existsSync(path.join(base,'drive3d.mjs')));
fs.rmSync(out,{recursive:true,force:true});
fs.cpSync(base,out,{recursive:true});
const manifest={schema:'dopagaki.k4-one-road0-real-native-market-webgl2/1',
 sourceBlob:ORIGINAL,sourceB48:7,sourceB51:28,sourceHz:240,
 renderer:'PRIVATE_ONLY',newColliders:0,ART:'HOLD',HUMAN:'HOLD',
 PERFORMANCE:'HOLD',SAFETY:'HOLD',RELEASE:'HOLD',MERGE:'HOLD',modes:{}};
for(const mode of ['ultra','control']){
 const prefix='P4R2F5K4_'+mode;
 const report=JSON.parse(fs.readFileSync(path.join(src,prefix+'_blender_report.json'),'utf8'));
 const glb=fs.readFileSync(path.join(src,prefix+'_edited.glb'));
 assert.equal(report.originalSourceBlob,ORIGINAL);
 assert.equal(report.edited_glb_sha256,sha(glb));
 assert.equal(verifySourceOfBlenderEdit(report),true);
 assert.equal(report.new_colliders,0);
 assert.equal(report.globalB48B51ClearanceVerified,false);
 assert.equal(report.k4OriginalBuilderGitBlob,'a6ee111319a81c7e83b1a85664d0b1c4da40bbcb');
 assert.equal(report.k4OfficialArtAcceptance,false);
 const k4=report.k4SingleCandidate;
 assert.equal(k4.originalRoad,0);assert.equal(k4.originalRoadU,.75);
 assert.equal(k4.side,'right');assert.equal(k4.offsetFromOriginalEdgeM,70);
 assert.ok(k4.meshModules>=24&&k4.actuallyRooflessCentralCourt);
 assert.equal(k4.sourcePhysicsChanged,false);assert.equal(k4.newColliders,0);
 const gpu=unpackBlenderEditedGLB(glb,report);
 assert.equal(gpu.meshInstances,5);
 assert.ok(gpu.triangles>10566&&gpu.triangles<50000);
 const data=Buffer.from(gpu.vertices.buffer,gpu.vertices.byteOffset,gpu.vertices.byteLength);
 fs.writeFileSync(path.join(out,'R19A6_'+mode+'_GPU_VERTICES.bin'),data);
 manifest.modes[mode]={glbSha256:sha(glb),blendSha256:report.blend_sha256,
   triangles:gpu.triangles,bytes:data.length,meshInstances:gpu.meshInstances,
   realK4Modules:k4.meshModules,realK4Bounds:[k4.minLocalXYZ,k4.maxLocalXYZ]};
}
let code=fs.readFileSync(path.join(out,'drive3d.mjs'),'utf8');
assert.equal(code.split("get('r19a6')").length,2);
code=code.replace("get('r19a6')","get('r19a6p4r2f5k4')");
assert.match(code,/const expected=r19a6Kind==='ultra'\?\d+:\d+;/);
code=code.replace(/const expected=r19a6Kind==='ultra'\?\d+:\d+;/,
 "const expected=r19a6Kind==='ultra'?"+manifest.modes.ultra.bytes+":"+manifest.modes.control.bytes+";");
assert.equal(code.split('PINNED_ORIGINAL_GLB_IMPORTED_ART_REJECT').length,2);
code=code.replace('PINNED_ORIGINAL_GLB_IMPORTED_ART_REJECT','R2F5K4_NATIVE_MARKET_ART_HOLD');
fs.writeFileSync(path.join(out,'drive3d.mjs'),code);
fs.mkdirSync(src,{recursive:true});
fs.writeFileSync(path.join(src,'K4_PINNED_NATIVE_ASSETS.json'),JSON.stringify(manifest,null,2)+'\n');
console.log('K4_PRIVATE_NATIVE_MARKET_GLTF_PINNED_ART_HOLD',JSON.stringify(manifest));

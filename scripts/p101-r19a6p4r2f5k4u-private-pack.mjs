/** K4U private only: one native Road0 marketplace added to original archived source 3D.
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
const out=path.resolve('dist-private/r19a6p4r2f5k4u');
const src=path.resolve('r19-evidence/r19a6p4r2f5k4u');
assert.ok(fs.existsSync(path.join(base,'drive3d.mjs')));
fs.rmSync(out,{recursive:true,force:true});
fs.cpSync(base,out,{recursive:true});
const manifest={schema:'dopagaki.k4u-one-road0-real-native-market-webgl2/1',
 sourceBlob:ORIGINAL,sourceB48:7,sourceB51:28,sourceHz:240,
 renderer:'PRIVATE_ONLY',newColliders:0,ART:'HOLD',HUMAN:'HOLD',
 PERFORMANCE:'HOLD',SAFETY:'HOLD',RELEASE:'HOLD',MERGE:'HOLD',modes:{}};
for(const mode of ['ultra','control']){
 const prefix='P4R2F5K4U_'+mode;
 const report=JSON.parse(fs.readFileSync(path.join(src,prefix+'_blender_report.json'),'utf8'));
 const glb=fs.readFileSync(path.join(src,prefix+'_edited.glb'));
 assert.equal(report.originalSourceBlob,ORIGINAL);
 assert.equal(report.edited_glb_sha256,sha(glb));
 assert.equal(verifySourceOfBlenderEdit(report),true);
 assert.equal(report.new_colliders,0);
 assert.equal(report.globalB48B51ClearanceVerified,false);
 assert.equal(report.k4uBaselineMode,'DIRECT_ORIGINAL_A5_NO_HISTORICAL_REJECTED_ART');
 assert.equal(report.k4uOfficialArtAcceptance,false);
 const k4u=report.k4uSingleCandidate;
 assert.equal(k4u.originalRoad,0);assert.equal(k4u.originalRoadU,.85);
 assert.equal(k4u.relocatedFromRoadU,.75);
 assert.equal(k4u.noArchitecturalGeometryRedesign,true);
 assert.equal(k4u.originalArtworkSource,'EXACT_FROZEN_K4R_34_MODULES_668_FACES');
 assert.equal(report.added_faces,668);assert.equal(k4u.meshModules,34);
 assert.equal(k4u.side,'right');assert.equal(k4u.offsetFromOriginalEdgeM,70);
 assert.ok(k4u.meshModules>=29&&k4u.actuallyRooflessCentralCourt&&k4u.visibleFloorIsNotCollisionSurface);
 assert.equal(k4u.sourcePhysicsChanged,false);assert.equal(k4u.newColliders,0);
 const gpu=unpackBlenderEditedGLB(glb,report);
 assert.equal(gpu.meshInstances,5);
 assert.equal(gpu.triangles,11902,'K4U must ONLY relocate exact original K4R shape');
 const data=Buffer.from(gpu.vertices.buffer,gpu.vertices.byteOffset,gpu.vertices.byteLength);
 fs.writeFileSync(path.join(out,'R19A6_'+mode+'_GPU_VERTICES.bin'),data);
 manifest.modes[mode]={glbSha256:sha(glb),blendSha256:report.blend_sha256,
   triangles:gpu.triangles,bytes:data.length,meshInstances:gpu.meshInstances,
   realK4UModules:k4u.meshModules,realK4UBounds:[k4u.minLocalXYZ,k4u.maxLocalXYZ]};
}
let code=fs.readFileSync(path.join(out,'drive3d.mjs'),'utf8');
assert.equal(code.split("get('r19a6')").length,2);
code=code.replace("get('r19a6')","get('r19a6p4r2f5k4u')");
assert.match(code,/const expected=r19a6Kind==='ultra'\?\d+:\d+;/);
code=code.replace(/const expected=r19a6Kind==='ultra'\?\d+:\d+;/,
 "const expected=r19a6Kind==='ultra'?"+manifest.modes.ultra.bytes+":"+manifest.modes.control.bytes+";");
assert.equal(code.split('PINNED_ORIGINAL_GLB_IMPORTED_ART_REJECT').length,2);
code=code.replace('PINNED_ORIGINAL_GLB_IMPORTED_ART_REJECT','R2F5K4U_NATIVE_MARKET_ART_HOLD');
fs.writeFileSync(path.join(out,'drive3d.mjs'),code);
fs.mkdirSync(src,{recursive:true});
fs.writeFileSync(path.join(src,'K4U_PINNED_NATIVE_ASSETS.json'),JSON.stringify(manifest,null,2)+'\n');
console.log('K4U_PRIVATE_NATIVE_MARKET_GLTF_PINNED_ART_HOLD',JSON.stringify(manifest));

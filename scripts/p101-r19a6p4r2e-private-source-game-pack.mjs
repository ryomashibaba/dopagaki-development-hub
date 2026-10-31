/** R19 A6 P4 source-native private WebGL2 pack for genuine Blender GLBs.
 * Five source-pinned real Blender editable district meshes, no physics/colliders.
 * Previous P2 and original game are UNMODIFIED. ART is unapproved.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {verifySourceOfBlenderEdit,unpackBlenderEditedGLB} from './p101-r19a6p1-read-blender-glb.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const original=path.join(root,'dist-private/r19a6');
const dir=path.join(root,'dist-private/r19a6p4r2e');
const src=path.join(root,'r19-evidence/r19a6p4r2e');
assert.ok(fs.existsSync(path.join(original,'drive3d.mjs')),'requires original A6 pinned GLB private renderer');
fs.rmSync(dir,{recursive:true,force:true});fs.cpSync(original,dir,{recursive:true});
const manifest={schema:'dopagaki.r19a6p4r2e-original-source-unified-urban-private/1',
 originalSourceBlob:'af076d67492a677d2235e4730aef8cdf4808e106',
 sourceB48:7,sourceB51:28,newColliders:0,privateOnly:true,
 ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',RELEASE:'HOLD',modes:{}};
for(const mode of ['ultra','control']){
 const report=JSON.parse(fs.readFileSync(path.join(src,'P4R2E_'+mode+'_blender_report.json'),'utf8'));
 assert.equal(verifySourceOfBlenderEdit(report),true);
 assert.equal(report.schema,'dopagaki.r19a6p4r2e-open-civic-programmed-urban-courts/1');
 assert.equal(report.originalSourceBlob,manifest.originalSourceBlob);
 assert.equal(report.districts.length,5);
 assert.equal(report.architecturalLanguage,'PHYSICALLY_CONNECTED_RING_WALKWAYS_PROGRAMMED_PUBLIC_ARCHITECTURE');
 assert.equal(report.designRevision,'R2E_COURT_AND_REAL_WALKABLE_MESH_METHOD_AFTER_R2D_ART_REJECT');
 assert.ok(report.districts.every(x=>x.actualOpenCourt===true&&x.publicWalkDeckGraph?.connected===true&&x.publicWalkDeckGraph?.maxJointGapM<1e-8&&x.programmedReal3DVolumes?.length>=3));
 assert.equal(report.districts.length,5);
 assert.equal(report.cameraProjectionOnlyNotActualB51RasterMask,true);
 assert.equal(report.globalB48B51ClearanceVerified,false);
 const image=unpackBlenderEditedGLB(fs.readFileSync(path.join(src,'P4R2E_'+mode+'_edited.glb')),report);
 assert.equal(image.meshInstances,5);
 assert.ok(image.triangles>10566&&image.triangles<80000);
 const buf=Buffer.from(image.vertices.buffer,image.vertices.byteOffset,image.vertices.byteLength);
 fs.writeFileSync(path.join(dir,'R19A6_'+mode+'_GPU_VERTICES.bin'),buf);
 manifest.modes[mode]={sourceGLBSHA:report.source_glb_sha256,
  editedGLBSHA:report.edited_glb_sha256,triangles:image.triangles,gpuBytes:buf.length,
  districtMeshes:image.meshInstances,verifiedPhysicsCollidersAdded:0,ART:'HOLD'};
}
let code=fs.readFileSync(path.join(dir,'drive3d.mjs'),'utf8');
assert.equal(code.split("get('r19a6')").length,2);
code=code.replace("get('r19a6')","get('r19a6p4r2e')");
const pattern=/const expected=r19a6Kind==='ultra'\?\d+:\d+;/;
assert.ok(pattern.test(code));
code=code.replace(pattern,"const expected=r19a6Kind==='ultra'?"+
 manifest.modes.ultra.gpuBytes+":"+manifest.modes.control.gpuBytes+";");
assert.equal(code.split('PINNED_ORIGINAL_GLB_IMPORTED_ART_REJECT').length,2);
code=code.replace('PINNED_ORIGINAL_GLB_IMPORTED_ART_REJECT',
 'P4R2E_UNIFIED_URBAN_CANYON_UNAPPROVED_ART_HOLD');
fs.writeFileSync(path.join(dir,'drive3d.mjs'),code);
assert.ok(!fs.readFileSync(path.join(original,'drive3d.mjs'),'utf8').includes("get('r19a6p4r2e')"));
fs.writeFileSync(path.join(dir,'P4R2E_EDITABLE_BLENDER_PRIVATE_GLB_MANIFEST.json'),
 JSON.stringify(manifest,null,2)+'\n');
console.log('R19A6P4R2E_GENUINE_BLENDER_FIVE_DISTRICTS_WEBGL2_PRIVATE',JSON.stringify(manifest));

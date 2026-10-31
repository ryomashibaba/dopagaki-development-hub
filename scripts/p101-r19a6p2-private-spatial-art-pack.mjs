/** R19 A6 P2 isolated PRIVATE original-game rendering of Blender-edited GLBs.
 * A5 original source and A6 P0 are untouched. This is artwork comparison,
 * not release, collision geometry or human gameplay certification.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {verifySourceOfBlenderEdit,unpackBlenderEditedGLB} from './p101-r19a6p2-read-blender-glb.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const original=path.join(root,'dist-private/r19a6');
const dir=path.join(root,'dist-private/r19a6p2');
const src=path.join(root,'r19-evidence/r19a6p2');
assert.ok(fs.existsSync(path.join(original,'drive3d.mjs')),'requires verified original A6 P0');
fs.rmSync(dir,{recursive:true,force:true});fs.cpSync(original,dir,{recursive:true});
let manifest={schema:'dopagaki.r19a6p2-blender-edited-GLB-source-game-private/1',
 originalSourceBlob:'af076d67492a677d2235e4730aef8cdf4808e106',
 sourceRoads:7,sourceB51:28,newColliders:0,private:true,
 artStatus:'HOLD',gameplay:'HOLD',human:'HOLD',performance:'HOLD',release:'HOLD',
 imported:{}};
for(const mode of ['ultra','control']){
 const record=JSON.parse(fs.readFileSync(path.join(src,'P2_'+mode+'_blender_report.json'),'utf8'));
 assert.equal(verifySourceOfBlenderEdit(record),true);
 assert.equal(record.schema,'dopagaki.r19a6p2-source-road-anchored-spatial-redesign/1');
 assert.equal(record.districts.length,5);
 assert.ok(record.min_local_nominal_outboard_m>=40);
 assert.equal(record.globalB48B51ClearanceVerified,false);
 const art=unpackBlenderEditedGLB(fs.readFileSync(path.join(src,'P2_'+mode+'_edited.glb')),record);
 const buffer=Buffer.from(art.vertices.buffer,art.vertices.byteOffset,art.vertices.byteLength);
 const name='R19A6_'+mode+'_GPU_VERTICES.bin';
 fs.writeFileSync(path.join(dir,name),buffer);
 manifest.imported[mode]={mode,sourceSHA:record.source_glb_sha256,editedSHA:record.edited_glb_sha256,
  gpuBytes:buffer.length,triangles:art.triangles,districts:art.meshInstances,
  newColliders:0,artStatus:'HOLD'};
}
let code=fs.readFileSync(path.join(dir,'drive3d.mjs'),'utf8');
assert.equal(code.split("get('r19a6')").length,2);
code=code.replace("get('r19a6')","get('r19a6p2')");
const expected=/const expected=r19a6Kind==='ultra'\?\d+:\d+;/;
assert.ok(expected.test(code),'original A6 GPU byte size anchor changed');
code=code.replace(expected,"const expected=r19a6Kind==='ultra'?"+
 manifest.imported.ultra.gpuBytes+":"+manifest.imported.control.gpuBytes+";");
assert.equal(code.split('PINNED_ORIGINAL_GLB_IMPORTED_ART_REJECT').length,2);
code=code.replace('PINNED_ORIGINAL_GLB_IMPORTED_ART_REJECT','P2_BLENDER_EDITED_GLB_ART_HOLD');
assert.ok(!code.includes("get('r19a6')"));
fs.writeFileSync(path.join(dir,'drive3d.mjs'),code);
const p0=fs.readFileSync(path.join(original,'drive3d.mjs'),'utf8');
assert.ok(p0.includes("get('r19a6')")&&!p0.includes("get('r19a6p2')"));
fs.writeFileSync(path.join(dir,'R19A6_P2_SPATIAL_MANIFEST.json'),JSON.stringify(manifest,null,2)+'\n');
console.log('R19_A6P2_PRIVATE_REAL_BLENDER_GLB_READY',JSON.stringify(manifest));

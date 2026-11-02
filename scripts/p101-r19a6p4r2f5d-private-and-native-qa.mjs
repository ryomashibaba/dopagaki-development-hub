/** R2F5-D: isolated native WebGL2 original two-camera proof using archived B QA. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(here,'..');
const gitBlob=b=>crypto.createHash('sha1').update(Buffer.concat([
 Buffer.from('blob '+b.length+'\0'),b])).digest('hex');
const c=JSON.parse(fs.readFileSync(path.join(root,'r19-evidence/r19a6p4r2f5c/R2F5C_ARCHIVED_BOTH_MODE_FULL_FRAME_RESEARCH_ONLY.json')));
assert.equal(c.preselectedForFutureArtOnly.road1U,.125);
assert.equal(c.preselectedForFutureArtOnly.offsetM,45);
assert.deepEqual([...c.preselectedForFutureArtOnly.modes].sort(),['control','ultra']);
for(const mode of ['ultra','control']){
 const r=JSON.parse(fs.readFileSync(path.join(root,'r19-evidence/r19a6p4r2f5d',`P4R2F5D_${mode}_blender_report.json`)));
 assert.equal(r.originalSourceBlob,'af076d67492a677d2235e4730aef8cdf4808e106');
 assert.equal(r.districts.length,5);
 assert.equal(r.new_colliders,0);assert.equal(r.globalB48B51ClearanceVerified,false);
 const a=r.districts[0].roadsidePublicFacilities[0],b=r.districts[1].roadsidePublicFacilities[0];
 assert.equal(a.nativeOriginalRoad1U,.125);assert.equal(a.offsetFromOriginalRoadEdgeM,45);
 assert.equal(b.nativeOriginalRoad1U,.350);assert.equal(b.offsetFromOriginalRoadEdgeM,35);
 assert.ok(a.nativeBlenderPartCount>=55);
 assert.equal(a.actualHumanWalkabilityAndLandSupport,'NOT_VERIFIED');
}
for(const [name,sha] of [
 ['p101-r19a6p4r2f5b-private-scene-pack.mjs','3fd0e886fb19f688d649e2f002aae947a4c4d006'],
 ['p101-r19a6p4r2f5b-2-native-art-preview.mjs','e907aa31e345e2cfc44a58e9e328199bbab67863']]){
 const old=fs.readFileSync(path.join(here,name));
 assert.equal(gitBlob(old),sha,'Archived source changed');
 const text=old.toString('utf8');
 assert.ok(text.includes('R2F5B')&&text.includes('r2f5b'));
 const updated=text.replaceAll('r2f5b','r2f5d').replaceAll('R2F5B','R2F5D');
 const runtime=path.join(here,'.'+name.replace('r2f5b','r2f5d')+'.runtime.mjs');
 fs.writeFileSync(runtime,updated);
 try{
  const child=spawnSync(process.execPath,[runtime],{cwd:root,stdio:'inherit',timeout:240000});
  if(child.error)throw child.error;
  assert.equal(child.status,0,'R2F5-D real native stage failed: '+name);
 }finally{fs.rmSync(runtime,{force:true});}
}
const r=JSON.parse(fs.readFileSync(path.join(root,'r19-evidence/r19a6p4r2f5d/R19A6P4R2F5D_REAL_12_NATIVE_WEBGL2_REPORT.json')));
assert.equal(r.actualWebGL2,true);
assert.equal(r.comparisons.length,2);assert.deepEqual(r.errors,[]);
assert.deepEqual(r.comparisons.map(x=>x.mode).sort(),['control','ultra']);
assert.equal(r.ART,'HOLD');
console.log('R2F5D_REAL_WEBGL2_FRAMES_RECORDED_ART_UNREVIEWED');

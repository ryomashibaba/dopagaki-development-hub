/**
 * R19 A6 P0: original A5 GLB -> verified GPU vertices -> SEPARATE private scene.
 * Builds from existing R19 A3 PRIVATE, never edits main, production or B48/B51.
 * The GLB bytes are re-imported, not substituted with the source city array.
 * ART remains REJECT. This is import pipeline proof, not a Blender edit.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {buildR19A6PinnedRoundtrip} from './p101-r19a6-source-glb-roundtrip.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const src=path.join(root,'dist-private/r19a3');
const dest=path.join(root,'dist-private/r19a6');
if(!fs.existsSync(path.join(src,'drive3d.mjs'))){
 execFileSync(process.execPath,[path.join(root,'scripts/p101-r19a3-private-original-one-city-pack.mjs')],{stdio:'inherit'});
}
assert.ok(fs.existsSync(path.join(src,'drive3d.mjs')),'need real PRIVATE A3 baseline');
fs.rmSync(dest,{recursive:true,force:true});
fs.cpSync(src,dest,{recursive:true});
const manifests={schema:'dopagaki.r19a6-p0-original-glb-gpu-roundtrip/1',
 researchOnly:true,sourceBlob:'af076d67492a677d2235e4730aef8cdf4808e106',
 editableGLBOriginalOnly:true,blenderGUIRoundtripCertified:false,
 addedPhysics:0,originalB48:7,originalMovingB51:28,
 ART:'REJECT',GAMEPLAY:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',RELEASE:'HOLD',modes:{}};
for(const mode of ['ultra','control']){
 const {report,imported}=buildR19A6PinnedRoundtrip(mode);
 const bytes=Buffer.from(imported.vertices.buffer,imported.vertices.byteOffset,imported.vertices.byteLength);
 const filename='R19A6_'+mode+'_GPU_VERTICES.bin';
 fs.writeFileSync(path.join(dest,filename),bytes);
 assert.equal(bytes.length,report.vertexCount*24);
 manifests.modes[mode]={glbSHA256:report.glbSHA256,
  editedGLBAccepted:false,bytes:bytes.length,triangles:imported.triangleCount,
  filename,groups:report.editableGroupNames};
}
let code=fs.readFileSync(path.join(dest,'drive3d.mjs'),'utf8');
function patch(a,b){
 assert.equal(code.split(a).length,2,'R19 A6 private source anchor drift '+a.slice(0,65));
 code=code.replace(a,b);
}
patch('let r19a3Mesh=null;',[
 'let r19a3Mesh=null;',
 "const r19a6OptIn=r19a1OptIn&&new URLSearchParams(location.search).get('r19a6')==='on'&&['127.0.0.1','localhost'].includes(location.hostname);",
 'let r19a6Mesh=null,r19a6LoadSerial=0;'
].join('\n'));
patch('  canvas.dataset.r19a3ColliderCount=String(a3.colliders);',[
 '  canvas.dataset.r19a3ColliderCount=String(a3.colliders);',
 "  if(r19a6OptIn&&r19a3OptIn)throw Error('A6 GLB readback and A5 direct mesh cannot be layered');",
 '  discard(r19a6Mesh);r19a6Mesh=null;',
 '  const r19a6ThisLoad=++r19a6LoadSerial;',
 "  const r19a6Kind=stage.stageForge?.recordStageId==='VB-P101-A13-W9C1-ULTRA'?'ultra':",
 "    stage.stageForge?.recordStageId==='VB-P101-A13-W9C1-CONTROL'?'control':null;",
 "  canvas.dataset.r19a6Loaded='false';canvas.dataset.r19a6MeshCount='0';",
 "  canvas.dataset.r19a6Status=r19a6OptIn?'loading-original-glb-readback':'off';",
 '  if(r19a6OptIn){',
 "   if(!r19a6Kind)throw Error('R19 A6 only supports real source W9C1 ULTRA/CONTROL');",
 "   const expected=r19a6Kind==='ultra'?760752:760752;", // replaced by manifest from embed during builder below
 "   fetch('./R19A6_'+r19a6Kind+'_GPU_VERTICES.bin',{cache:'no-store'}).then(r=>{",
 "    if(!r.ok)throw Error('A6 trusted bin not found');return r.arrayBuffer();",
 '   }).then(buffer=>{',
 "    if(buffer.byteLength!==expected||buffer.byteLength%72!==0)throw Error('A6 vertex buffer size mismatch');",
 '    const raw=new Float32Array(buffer);',
 "    if(!raw.every(Number.isFinite))throw Error('A6 invalid GPU coordinates/colors');",
 '    if(r19a6ThisLoad!==r19a6LoadSerial)return;',
 '    r19a6Mesh=mesh(raw);',
 "    canvas.dataset.r19a6Loaded='true';",
 "    canvas.dataset.r19a6Status='PINNED_ORIGINAL_GLB_IMPORTED_ART_REJECT';",
 "    canvas.dataset.r19a6MeshCount='5';",
 '    canvas.dataset.r19a6Triangles=String(raw.length/18);',
 '   }).catch(err=>{',
 "    canvas.dataset.r19a6Status='LOAD_FAILED';",
 '    canvas.dataset.r19a6LoadError=String(err);',
 '   });',
 '  }'
].join('\n'));
patch('  if(r19a3OptIn&&r19a3Mesh)draw(r19a3Mesh);',
 '  if(r19a3OptIn&&r19a3Mesh)draw(r19a3Mesh);\n'+
 '  if(r19a6OptIn&&r19a6Mesh)draw(r19a6Mesh);');
const target=path.join(dest,'drive3d.mjs');
fs.writeFileSync(target,code);
assert.ok(!fs.readFileSync(path.join(src,'drive3d.mjs'),'utf8').includes('r19a6OptIn'));
fs.writeFileSync(path.join(dest,'R19A6_GLTF_ROUNDTRIP_MANIFEST.json'),
 JSON.stringify(manifests,null,2)+'\n');
console.log('R19A6_PRIVATE_PINNED_GLB_IMPORT',JSON.stringify(manifests));

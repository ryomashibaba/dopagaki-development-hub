/** R48: study-only flat proxy in generated PRIVATE original-240Hz game.
 * NOT genuine Blender art, NOT connected water/machinery. No protected edits.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const OUT='test-results/k4ct-r48-native-diagnostic';
fs.mkdirSync(OUT,{recursive:true});
function blob(s){const b=fs.readFileSync(s);return crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+b.length+'\0'),b])).digest('hex');}
assert.equal(blob('web/p101-w9c2-g4e7ci-integrated-streetscape.mjs'),'af076d67492a677d2235e4730aef8cdf4808e106');
assert.equal(blob('scripts/p101-k4ct-native-spillway-dcc.py'),'096fffbc1627915eb0122224955bb02cfba6b3ae');
const dcc=JSON.parse(fs.readFileSync('test-results/k4ct-contact-retry/K4CT_DCC_BLENDER_TO_NATIVE_GEOMETRY.json','utf8'));
const r44=JSON.parse(fs.readFileSync('test-results/k4ct-r44-art/R44_SOURCE_UNDERBANK_CONDUIT_MANIFEST.json','utf8'));
assert.equal(dcc.triangles,32004);assert.equal(r44.totalSceneTriangles,dcc.triangles);
assert.equal(dcc.originalB48,7);assert.equal(dcc.originalB51,28);assert.equal(dcc.newColliders,0);
assert.equal(Object.keys(dcc.objects).length,43);
assert(r44.sourceGroup19Untouched&&r44.protectedEightExactBeforeExport);
const F=[.92049565,0,-.3907528],S=[-.3907528,0,-.92049565],O=[1157.592,0,-494.670];
const xyz=(d,t,y)=>[O[0]+S[0]*d+F[0]*t,y,O[2]+S[2]*d+F[2]*t];
function quad(a,b,c,d,rgb){return [a,b,c,a,c,d].flatMap(v=>[...v,...rgb]);}
function plane(d0,d1,t0,t1,y0,y1,rgb){
 return quad(xyz(d0,t0,y0),xyz(d1,t0,y0),xyz(d1,t1,y1),xyz(d0,t1,y1),rgb);}
function wall(d0,d1,t,y0,y1,rgb){
 return quad(xyz(d0,t,y0),xyz(d1,t,y0),xyz(d1,t,y1),xyz(d0,t,y1),rgb);}
// R47's only selected parameters; no alternate candidate, no design tuning.
const geo={
 HEADRACE:plane(130,190,125,145,91,92.3,[.16,.88,.82]),
 FALL:wall(130,190,125,91,75,[.95,.91,.74]),
 RECEIVER:plane(130,190,83,125,74.35,75,[.10,.50,.74]),
 GATE_PROXY:wall(191,203,125,103,79,[.98,.64,.19])
};
for(const [name,a] of Object.entries(geo)){assert.equal(a.length,36,name);assert(a.every(Number.isFinite));}
const original=path.resolve('dist-private/k4ct/drive3d.mjs');
let js=fs.readFileSync(original,'utf8');
function patch(before,after){const n=js.split(before).length-1;assert.equal(n,1,'R48 generated private anchor count '+n+': '+before.slice(0,70));js=js.replace(before,after);}
patch('let k4ctDccMesh=null;',
 'let k4ctDccMesh=null;\nlet k4ctR48ProxyMeshes={};\nwindow.__k4ctR48ResearchDiagnosticOn=false;\nwindow.__k4ctR48ProxyMask="ALL";');
patch('k4ctDccMesh=mesh(K4CT_R9_ROAD_VERTICES);k4ctR9LoadMaterialMesh();',
 'k4ctDccMesh=mesh(K4CT_R9_ROAD_VERTICES);k4ctR9LoadMaterialMesh();'
 +'\nfor(const m of Object.values(k4ctR48ProxyMeshes))discard(m);'
 +'\nk4ctR48ProxyMeshes={};'
 +'\nfor(const [name,verts] of Object.entries('+JSON.stringify(geo)+'))k4ctR48ProxyMeshes[name]=mesh(verts);');
patch('if(r12Skip===null){\n  gl.drawArrays(gl.TRIANGLES,0,k4ctR9MaterialVertexCount);',
 'if(r12Skip===null&&window.__k4ctR48ResearchDiagnosticOn!==true){\n  gl.drawArrays(gl.TRIANGLES,0,k4ctR9MaterialVertexCount);');
patch('if(part.name===r12Skip){found=true;continue;}\n   gl.drawArrays(gl.TRIANGLES,part.first,part.count);',
 'if(part.name===r12Skip){found=true;continue;}'
 +'\n   if(window.__k4ctR48ResearchDiagnosticOn===true&&["15","16","17","23","24"].includes(part.name.slice(0,2)))continue;'
 +'\n   gl.drawArrays(gl.TRIANGLES,part.first,part.count);');
patch("if(!found)throw Error('R12 unknown Blender group in original scene '+r12Skip);",
 "if(r12Skip!==null&&!found)throw Error('R12 unknown Blender group in original scene '+r12Skip);");
patch('k4ctR9DrawMaterialWorld(view,w/h,visibilityFx?1:0);',
 'k4ctR9DrawMaterialWorld(view,w/h,visibilityFx?1:0);'
 +'\nif(window.__k4ctR48ResearchDiagnosticOn===true){'
 +'\n const r48Mode=window.__k4ctR48ProxyMask||"ALL";'
 +'\n if(!["ALL","NONE","SKIP_HEADRACE","SKIP_FALL","SKIP_RECEIVER","SKIP_GATE_PROXY"].includes(r48Mode))throw Error("R48 invalid research mask "+r48Mode);'
 +'\n for(const [name,object] of Object.entries(k4ctR48ProxyMeshes)){'
 +'\n  if(r48Mode!=="NONE"&&r48Mode!=="SKIP_"+name)draw(object);'
 +'\n }'
 +'\n canvas.dataset.k4ctR48ProxyMode=r48Mode;'
 +'\n}else canvas.dataset.k4ctR48ProxyMode="OFF";');
assert(js.includes('R48 invalid research mask')&&js.includes('R12 unknown Blender group'));
fs.writeFileSync(original,js);
const manifest={schema:'k4ct-r48-original-webgl2-temporal-four-flat-proxy-diagnostic-v1',
 originalGameBlob:'af076d67492a677d2235e4730aef8cdf4808e106',
 originalBlenderBlob:'096fffbc1627915eb0122224955bb02cfba6b3ae',
 r44RealBlenderTriangles:32004,originalB48:7,originalB51:28,newColliders:0,
 originalCameraAnd240HzPreserved:true,protectedEightUnmodified:true,
 diagnosticOnlyFlatProxyNotGenuineBlender:true,
 sourceHydraulicAndMechanicConnectionsUNPROVEN:true,
 rejectedNonprotectedGroupsHiddenWhenDiagnosticOn:['15','16','17','23','24'],
 temporalConcept:{d0:130,d1:190,sourceT:145,fallT:125,receiverT:83,headY:91,lowerY:75},
 proxyTrianglesByComponent:{headrace:2,fall:2,receiver:2,gate_proxy:2},
 officialARTAdopted:0,slope2DNAmeters:0,ART:'HOLD',HUMAN:'HOLD',
 SAT:'HOLD',CCD:'HOLD',FPS:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'};
fs.writeFileSync(path.join(OUT,'R48_GENERATED_PRIVATE_DIAGNOSTIC_MANIFEST.json'),JSON.stringify(manifest,null,2)+'\n');
console.log('R48_ORIGINAL_GL_PRIVATE_ONLY_PROXY_READY',{sourceProtected:true,componentCount:4,noNewColliders:true});

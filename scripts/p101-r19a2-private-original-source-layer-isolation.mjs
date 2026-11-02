/** R19 A2: controlled ONE-LAYER-AT-A-TIME subtractive real WebGL2 diagnostics.
 * Reuses tested R19 A1 exact native gameplay; only PRIVATE renderer changes.
 * Never hides B48 collision roads, 28 actual B51 machines, native HUD, physics,
 * warning cues or ball, and never passes ART/ human merely from image deltas.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
execFileSync(process.execPath,[path.join(root,'scripts/p101-r19a1-private-original-native-camera-pack.mjs')],{stdio:'inherit'});
const dist=path.join(root,'dist-private');
const source=path.join(dist,'r19a1'),target=path.join(dist,'r19a2');
fs.rmSync(target,{force:true,recursive:true});
fs.cpSync(source,target,{recursive:true});
const file=path.join(target,'drive3d.mjs');
let js=fs.readFileSync(file,'utf8');
function patch(n,r){assert.equal(js.split(n).length,2,'Original source scene anchor drift '+n.slice(0,110));js=js.replace(n,r);}
patch('let r19a1Plan=null,r19a1Ticks=0;',[
 'let r19a1Plan=null,r19a1Ticks=0;',
 "const r19a2Requested=new URLSearchParams(location.search).get('r19a2Layer')||'all';",
 "const r19a2Allowed=new Set(['all','without-epic','without-mega','without-w9','without-frames','without-g5b','road-hazards-only']);",
 "const r19a2Layer=r19a1OptIn&&r19a2Allowed.has(r19a2Requested)?r19a2Requested:'all';",
 "let r19a2MachineMesh=null,r19a2W9HeroMesh=null;",
 "const r19a2Show=id=>r19a2Layer==='all'||",
 " (r19a2Layer==='road-hazards-only'?false:r19a2Layer!=='without-'+id);"
].join('\n'));
patch("a13ArchMesh=mesh([...arch.vertices,...hero.vertices]);",[
 "a13ArchMesh=mesh([...arch.vertices,...hero.vertices]);",
 "  r19a2MachineMesh=mesh(arch.vertices);",
 "  r19a2W9HeroMesh=mesh(hero.vertices);",
 "  canvas.dataset.r19a2MachineTriangles=String(arch.vertices.length/18);",
 "  canvas.dataset.r19a2W9Triangles=String(hero.vertices.length/18);"
].join('\n'));
patch("if(g4e7yScene!=='open')draw(scenery);",[
 "canvas.dataset.r19a2Layer=r19a2Layer;",
 "  if(r19a2Show('epic')&&g4e7yScene!=='open')draw(scenery);"
].join('\n'));
patch("if(megaEnabled&&g4e7yScene!=='open'){draw(megaWorld);draw(g5bSceneryMesh);}",[
 "if(megaEnabled&&g4e7yScene!=='open'){",
 " if(r19a2Show('mega'))draw(megaWorld);",
 " if(r19a2Show('g5b'))draw(g5bSceneryMesh);",
 "}"
].join('\n'));
patch("if(g4e7yScene!=='open')draw(g4dSkywayMesh);",[
 "if(r19a2Layer!=='road-hazards-only'&&g4e7yScene!=='open')draw(g4dSkywayMesh);"
].join('\n'));
patch("draw(a13ArchMesh);if(g4e7yScene!=='open')draw(g4e7sShardMesh);",[
 "if(r19a2Show('frames'))draw(r19a2MachineMesh);",
 "if(r19a2Show('w9'))draw(r19a2W9HeroMesh);",
 "if(r19a2Layer!=='road-hazards-only'&&g4e7yScene!=='open')draw(g4e7sShardMesh);"
].join('\n'));
patch("draw(g4e7adCityMesh);",[
 "if(r19a2Layer!=='road-hazards-only')draw(g4e7adCityMesh);"
].join('\n'));
fs.writeFileSync(file,js);
const original=fs.readFileSync(path.join(dist,'drive3d','drive3d.mjs'),'utf8');
assert.ok(!original.includes('r19a2Show')&&!original.includes('r19a1OptIn'));
assert.ok(!fs.readFileSync(path.join(source,'drive3d.mjs'),'utf8').includes('r19a2Show'));
console.log('R19A2_REAL_ORIGINAL_CAMERA_SUBTRACTIVE_MASKS',JSON.stringify({
 private:'dist-private/r19a2/',layers:['all','without-epic','without-mega','without-w9','without-frames','without-g5b','road-hazards-only'],
 source:'R19A1 original actual WebGL2 copied unchanged physics',
 B48:7,B51:28,unmodifiedOriginal:true,ART:'HOLD',human:'HOLD'}));

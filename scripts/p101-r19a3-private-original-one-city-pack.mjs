/** R19 A3: One integrated civic city, isolated ORIGINAL WebGL2 camera only.
 * Builds genuine A1 and subtractive A2 then privately inserts one new city mesh
 * over actual road + 28 B51 physical shapes. No background masking in original.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
execFileSync(process.execPath,[path.join(root,'scripts/p101-r19a2-private-original-source-layer-isolation.mjs')],{stdio:'inherit'});
const dist=path.join(root,'dist-private');
const a2=path.join(dist,'r19a2'),a3=path.join(dist,'r19a3');
fs.rmSync(a3,{recursive:true,force:true});fs.cpSync(a2,a3,{recursive:true});
fs.copyFileSync(path.join(root,'scripts/p101-r19a3-one-integrated-civic-basilica-source.mjs'),
 path.join(a3,'r19a3-one-integrated-civic-basilica-source.mjs'));
const file=path.join(a3,'drive3d.mjs');let code=fs.readFileSync(file,'utf8');
function patch(a,b){
 assert.equal(code.split(a).length,2,'original private scene module anchor drift '+a.slice(0,100));
 code=code.replace(a,b);
}
patch("import {originalB51TrueSpatialCue} from './r19a1-source-B51-fov.mjs';",
 "import {originalB51TrueSpatialCue} from './r19a1-source-B51-fov.mjs';\n"+
 "import {buildR19A3IntegratedCivicCity} from './r19a3-one-integrated-civic-basilica-source.mjs';");
patch("let r19a2MachineMesh=null,r19a2W9HeroMesh=null;",[
 "let r19a2MachineMesh=null,r19a2W9HeroMesh=null;",
 "const r19a3OptIn=r19a1OptIn&&new URLSearchParams(location.search).get('r19a3')==='on';",
 "let r19a3Mesh=null;"
].join('\n'));
patch("canvas.dataset.r19a2W9Triangles=String(hero.vertices.length/18);",[
 "canvas.dataset.r19a2W9Triangles=String(hero.vertices.length/18);",
 "  const a3=buildR19A3IntegratedCivicCity(stage,sample,{enabled:r19a3OptIn});",
 "  r19a3Mesh=a3.active?mesh(a3.vertices):null;",
 "  canvas.dataset.r19a3Enabled=String(a3.active);",
 "  canvas.dataset.r19a3Triangles=String(a3.triangles);",
 "  canvas.dataset.r19a3RealRoads='7';canvas.dataset.r19a3B51='28';",
 "  canvas.dataset.r19a3ArtApproved='false';",
 "  canvas.dataset.r19a3OpenAtrium=String(a3.singleOpenAtrium??0);",
 "  canvas.dataset.r19a3ColliderCount=String(a3.colliders);"
].join('\n'));
patch("if(r19a2Layer!=='road-hazards-only')draw(g4e7adCityMesh);",
 "if(r19a2Layer!=='road-hazards-only')draw(g4e7adCityMesh);\n"+
 "  if(r19a3OptIn&&r19a3Mesh)draw(r19a3Mesh);");
fs.writeFileSync(file,code);
const baseline=fs.readFileSync(path.join(dist,'drive3d','drive3d.mjs'),'utf8');
const pre=fs.readFileSync(path.join(a2,'drive3d.mjs'),'utf8');
assert.ok(!baseline.includes('r19a3OptIn')&&!pre.includes('r19a3OptIn'));
console.log('R19A3_ONE_CITY_SOURCE_PACK',JSON.stringify({source:'TRUE ORIGINAL B48 B51 P96',
 private:'dist-private/r19a3',renderer:'original RAW camera',
 hero:1,artApprovals:0,physicsOriginal:7,B51:28,notMerged:true}));

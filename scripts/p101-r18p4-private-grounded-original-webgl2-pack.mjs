/** Real original WebGL2 ART candidate comparison, ISOLATED PRIVATE.
 * Copies D11's actual game to an entirely separate r18p4 root, retains
 * identical world physics 7 B48 & 28 B51, original HUD and scripted legal
 * P96/P94 A13. Selects exactly ONE actual GPU urban macro mesh, replacing
 * old scaffold/gates in DRAW order, not layering on them.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {buildR18P4City,DESIGNS} from './p101-r18p4-original-road-grounded-urban-fabric.mjs';
import {sample} from '../private/reference_only/director/surface.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist-private');
const original=fs.readFileSync(path.join(root,'web/p101-w9c2-g4e7ci-integrated-streetscape.mjs'));
const hash=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+original.length+'\0'),original])).digest('hex');
assert.equal(hash,'af076d67492a677d2235e4730aef8cdf4808e106');
const prev=path.join(dist,'r15s3d11');
assert.ok(fs.existsSync(path.join(prev,'drive3d.mjs')),'Run original build, D10, and D11 private packs first');
const target=path.join(dist,'r18p4');
fs.rmSync(target,{recursive:true,force:true});
fs.cpSync(prev,target,{recursive:true});
const ids={},checks=[];
for(const world of ['true-pinch','pinch-switch']){
 const oldName='R15S3D11_'+world.toUpperCase().replace('-','_')+'_A_EDGE_READABLE_PRIVATE.json';
 const originalStage=JSON.parse(fs.readFileSync(path.join(dist,'generated',oldName),'utf8'));
 assert.equal(originalStage.surfaces.length,7);assert.equal(originalStage.movingObstacles.length,28);
 assert.equal(originalStage.stageForge.r15s3d11.mode,'A_EDGE_READABLE');
 const frozen=JSON.stringify(originalStage);
 for(const mode of DESIGNS){
  const candidate=buildR18P4City(originalStage,sample,{mode});
  assert.equal(JSON.stringify(originalStage),frozen);
  assert.equal(candidate.addedColliders,0);
  assert.ok(candidate.trueOpenCourts>=10);
  assert.ok(candidate.roadLevelVolumes>=44);
  const doc=structuredClone(originalStage);
  doc.stageForge.r18p4Private={mode,world,engine:'SOURCE_DRIVE3D_WEBGL2',
   actualB48Count:7,originalB51Count:28,artCollisionGeometryAdded:0,
   generatedThreeDimensionalArchitecturalTriangleCount:candidate.triangles,
   candidateSpatialProgram:{cityDistricts:candidate.sourceRoadNeighborhoods,
    cameraSource:candidate.groundAlignedOriginalRoadSections,realRoof:candidate.groundedFoundations,
    civicDecks:candidate.roadLevelVolumes,actualOpenCourts:candidate.trueOpenCourts,
    originalB48Roads:7,originalB51Hazards:28},
   cityReplacementNotOverlay:true,sourceOriginalGameBlob:hash,
   manualHumanTest:'HOLD',officialArt:'HOLD',publish:'HOLD'};
  doc.stageForge.productionPromoted=false;
  const id='R18P4-'+world.toUpperCase()+'-'+(mode===DESIGNS[0]?'BOULEVARD':'GARDEN');
  const name=id+'_PRIVATE_REAL_CITY.json';
  fs.writeFileSync(path.join(dist,'generated',name),JSON.stringify(doc)+'\n');
  ids[id]=name;
  checks.push({id,world,mode,triangles:candidate.triangles,
   voids:candidate.trueOpenCourts,units:candidate.roadLevelVolumes,
   physicsEqualsBase:JSON.stringify(doc.surfaces)===JSON.stringify(originalStage.surfaces)&&
    JSON.stringify(doc.movingObstacles)===JSON.stringify(originalStage.movingObstacles)});
 }
}
const src=path.join(target,'drive3d.mjs'),before=fs.readFileSync(src,'utf8');
let js=before;
function change(old,next){
 assert.equal(js.split(old).length,2,'isolated real renderer source anchor must occur once: '+old.slice(0,95));
 js=js.replace(old,next);
}
change("new URLSearchParams(window.location.search).get('r15s3d11')==='on'",
 "new URLSearchParams(window.location.search).get('r18p4')==='on'");
const anchor="// G4E-1 physical trials are private opt-in; Gold remains the visible default.";
change(anchor,[
 "// R18P4 original WebGL2 renderer isolated REPLACEMENT art (not layered).",
 "if(r15s3d10OptIn){for(const [id,name] of Object.entries("+JSON.stringify(ids)+")){",
 " assets[id]=name;",
 " const opt=document.createElement('option'); opt.value=id;",
 " opt.textContent='R18P4 ROAD-ALIGNED GENUINE GROUNDED CITY-FABRIC PRIVATE '+id+' (ART / HUMAN HOLD)';",
 " $('stage').append(opt);",
 "}}",
 anchor].join('\n'));
change("import {originalB51TrueSpatialCue} from './r15s3d10-physical-b51-hud-cue.mjs';",
 "import {originalB51TrueSpatialCue} from './r15s3d10-physical-b51-hud-cue.mjs';\nimport {buildR18P4City} from './r18p4-original-road-grounded-urban-fabric.mjs';");
change("function buildVisual(stage){\n const vertex=[],wire=[];",
 "let r18p4ArtMesh=null;\nfunction buildVisual(stage){\n const vertex=[],wire=[];\n discard(r18p4ArtMesh);r18p4ArtMesh=null;\n if(stage.stageForge?.r18p4Private){\n  const info=stage.stageForge.r18p4Private;\n  if(info.sourceOriginalGameBlob!=="+JSON.stringify(hash)+"||info.artCollisionGeometryAdded!==0||\n    stage.surfaces.length!==7||stage.movingObstacles.length!==28)throw Error('R18P4 protected source art doc failed');\n  const art=buildR18P4City(stage,sample,{mode:info.mode});\n  if(art.triangles!==info.generatedThreeDimensionalArchitecturalTriangleCount)\n    throw Error('R18P4 actual 3D art triangles mismatch');\n  r18p4ArtMesh=mesh(art.vertices);\n  canvas.dataset.r18p4City=info.mode;\n  canvas.dataset.r18p4Triangles=String(art.triangles);\n  canvas.dataset.r18p4CarvedEmptyBays=String(art.trueOpenCourts);\n  canvas.dataset.r18p4HabitableElements=String(art.roadLevelVolumes);\n  canvas.dataset.r18p4PrivateOriginalB48='7';\n  canvas.dataset.r18p4PrivateOriginalB51='28';\n }else canvas.dataset.r18p4City='off';");
change("if((g4e7aiOptIn&&g4e7aiBackdrop==='quiet')||(g4e7akOptIn&&g4e7akBackdrop==='quiet')){",
 "if(r18p4ArtMesh){\n  // This replaces EVERY old rejected cubic wall/portal/gate; original true\n  // B48/B51 and HUD remain drawn in original source later in render().\n  draw(r18p4ArtMesh);\n }else if((g4e7aiOptIn&&g4e7aiBackdrop==='quiet')||(g4e7akOptIn&&g4e7akBackdrop==='quiet')){");
fs.copyFileSync(path.join(root,'scripts/p101-r18p4-original-road-grounded-urban-fabric.mjs'),
 path.join(target,'r18p4-original-road-grounded-urban-fabric.mjs'));
// R18P4 is self-contained; do NOT inherit the previous city's
// dependency contract. Reject Node-only imports from the real browser module.
const artModule=fs.readFileSync(path.join(target,'r18p4-original-road-grounded-urban-fabric.mjs'),'utf8');
assert.ok(artModule.includes('export function buildR18P4City'));
assert.ok(!artModule.includes("from 'node:"));
fs.writeFileSync(src,js);
const html=path.join(target,'index.html');
let body=fs.readFileSync(html,'utf8');
assert.ok(body.includes('R15S3D11 PRIVATE'));
body=body.replace('R15S3D11 PRIVATE','R18P4 PRIVATE / FIVE-TIME INHABITED FUTURE CITY TWO REAL ART CONSTRUCTIONS');
fs.writeFileSync(html,body);
assert.ok(!fs.readFileSync(path.join(prev,'drive3d.mjs'),'utf8').includes('r18p4ArtMesh'));
assert.ok(!fs.readFileSync(path.join(dist,'drive3d/drive3d.mjs'),'utf8').includes('r18p4ArtMesh'));
console.log('R18P4_PRIVATE_REAL_CITY_PACK',JSON.stringify({
 actualOriginalRendererCopied:true,artOriginalSourceNotOverwritten:true,
 real7RoadsAnd28Machines:true,realGpuMeshArtResearchOnly:true,
 originalGameSourceBlob:hash,privateDir:'dist-private/r18p4/',
 cityModes:DESIGNS,studies:checks,actualBrowserNotYetTested:true,
 originalCCDRunnerAnd240HzUntouched:true,ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',RELEASE:'HOLD'}));

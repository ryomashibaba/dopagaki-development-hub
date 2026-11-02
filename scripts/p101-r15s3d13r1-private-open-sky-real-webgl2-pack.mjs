/** Real original WebGL2 ART candidate comparison, ISOLATED PRIVATE.
 * Copies D11's actual game to an entirely separate r15s3d13r1 root, retains
 * identical world physics 7 B48 & 28 B51, original HUD and scripted legal
 * P96/P94 A13. Selects exactly ONE actual GPU urban macro mesh, replacing
 * old scaffold/gates in DRAW order, not layering on them.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {buildR15S3D13R1City,DESIGNS} from './p101-r15s3d13r1-open-sky-continuous-civic-spine.mjs';
import {sample} from '../private/reference_only/director/surface.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist-private');
const original=fs.readFileSync(path.join(root,'web/p101-w9c2-g4e7ci-integrated-streetscape.mjs'));
const hash=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+original.length+'\0'),original])).digest('hex');
assert.equal(hash,'af076d67492a677d2235e4730aef8cdf4808e106');
const prev=path.join(dist,'r15s3d11');
assert.ok(fs.existsSync(path.join(prev,'drive3d.mjs')),'Run original build, D10, and D11 private packs first');
const target=path.join(dist,'r15s3d13r1');
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
  const candidate=buildR15S3D13R1City(originalStage,sample,{mode});
  assert.equal(JSON.stringify(originalStage),frozen);
  assert.equal(candidate.addedPhysicsColliders,0);
  const doc=structuredClone(originalStage);
  doc.stageForge.r15s3d13r1Private={mode,world,engine:'SOURCE_DRIVE3D_WEBGL2',
   actualB48Count:7,originalB51Count:28,artCollisionGeometryAdded:0,
   generatedThreeDimensionalArchitecturalTriangleCount:candidate.triangles,
   candidateSpatialProgram:{unbrokenBackbones:candidate.unbrokenLongitudinalStructuralLinks,minimumRoadSetbackM:candidate.minTrueRoadLateralSetback,connectedSpineSegments:candidate.connectedSpineSegments,openCells:candidate.openSurfaceCells,
    inhabitedDecks:candidate.publicDeckCells,undercity:candidate.undercitySegments,
    nativeRoadSections:candidate.roadSections},
   cityReplacementNotOverlay:true,sourceOriginalGameBlob:hash,
   manualHumanTest:'HOLD',officialArt:'HOLD',publish:'HOLD'};
  doc.stageForge.productionPromoted=false;
  const id='R15S3D13R1-'+world.toUpperCase()+'-'+(mode===DESIGNS[0]?'SKYOPEN':'FREEEDGE');
  const name=id+'_PRIVATE_REAL_CITY.json';
  fs.writeFileSync(path.join(dist,'generated',name),JSON.stringify(doc)+'\n');
  ids[id]=name;
  checks.push({id,world,mode,triangles:candidate.triangles,
   voids:candidate.openSurfaceCells,units:candidate.publicDeckCells,
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
 "new URLSearchParams(window.location.search).get('r15s3d13r1')==='on'");
const anchor="// G4E-1 physical trials are private opt-in; Gold remains the visible default.";
change(anchor,[
 "// R15S3D13R1 original WebGL2 renderer isolated REPLACEMENT art (not layered).",
 "if(r15s3d10OptIn){for(const [id,name] of Object.entries("+JSON.stringify(ids)+")){",
 " assets[id]=name;",
 " const opt=document.createElement('option'); opt.value=id;",
 " opt.textContent='R15S3D13R1 SOURCE REAL CITY '+id+' (ART / HUMAN HOLD)';",
 " $('stage').append(opt);",
 "}}",
 anchor].join('\n'));
change("import {originalB51TrueSpatialCue} from './r15s3d10-physical-b51-hud-cue.mjs';",
 "import {originalB51TrueSpatialCue} from './r15s3d10-physical-b51-hud-cue.mjs';\nimport {buildR15S3D13R1City} from './r15s3d13r1-open-sky-continuous-civic-spine.mjs';");
change("function buildVisual(stage){\n const vertex=[],wire=[];",
 "let r15s3d13r1ArtMesh=null;\nfunction buildVisual(stage){\n const vertex=[],wire=[];\n discard(r15s3d13r1ArtMesh);r15s3d13r1ArtMesh=null;\n if(stage.stageForge?.r15s3d13r1Private){\n  const info=stage.stageForge.r15s3d13r1Private;\n  if(info.sourceOriginalGameBlob!=="+JSON.stringify(hash)+"||info.artCollisionGeometryAdded!==0||\n    stage.surfaces.length!==7||stage.movingObstacles.length!==28)throw Error('R15S3D13R1 protected source art doc failed');\n  const art=buildR15S3D13R1City(stage,sample,{mode:info.mode});\n  if(art.triangles!==info.generatedThreeDimensionalArchitecturalTriangleCount)\n    throw Error('R15S3D13R1 actual 3D art triangles mismatch');\n  r15s3d13r1ArtMesh=mesh(art.vertices);\n  canvas.dataset.r15s3d13r1City=info.mode;\n  canvas.dataset.r15s3d13r1Triangles=String(art.triangles);\n  canvas.dataset.r15s3d13r1CarvedEmptyBays=String(art.openSurfaceCells);\n  canvas.dataset.r15s3d13r1HabitableElements=String(art.publicDeckCells);\n  canvas.dataset.r15s3d13r1PrivateOriginalB48='7';\n  canvas.dataset.r15s3d13r1PrivateOriginalB51='28';\n }else canvas.dataset.r15s3d13r1City='off';");
change("if((g4e7aiOptIn&&g4e7aiBackdrop==='quiet')||(g4e7akOptIn&&g4e7akBackdrop==='quiet')){",
 "if(r15s3d13r1ArtMesh){\n  // This replaces EVERY old rejected cubic wall/portal/gate; original true\n  // B48/B51 and HUD remain drawn in original source later in render().\n  draw(r15s3d13r1ArtMesh);\n }else if((g4e7aiOptIn&&g4e7aiBackdrop==='quiet')||(g4e7akOptIn&&g4e7akBackdrop==='quiet')){");
fs.copyFileSync(path.join(root,'scripts/p101-r15s3d13r1-open-sky-continuous-civic-spine.mjs'),
 path.join(target,'r15s3d13r1-open-sky-continuous-civic-spine.mjs'));
fs.writeFileSync(src,js);
const html=path.join(target,'index.html');
let body=fs.readFileSync(html,'utf8');
assert.ok(body.includes('R15S3D11 PRIVATE'));
body=body.replace('R15S3D11 PRIVATE','R15S3D13R1 PRIVATE / / CONTINUOUS CIVIC SPINE 3D, TWO CANDIDATES');
fs.writeFileSync(html,body);
assert.ok(!fs.readFileSync(path.join(prev,'drive3d.mjs'),'utf8').includes('r15s3d13r1ArtMesh'));
assert.ok(!fs.readFileSync(path.join(dist,'drive3d/drive3d.mjs'),'utf8').includes('r15s3d13r1ArtMesh'));
console.log('R15S3D13R1_PRIVATE_REAL_CITY_PACK',JSON.stringify({
 actualOriginalRendererCopied:true,artOriginalSourceNotOverwritten:true,
 real7RoadsAnd28Machines:true,realGpuMeshArtResearchOnly:true,
 originalGameSourceBlob:hash,privateDir:'dist-private/r15s3d13r1/',
 cityModes:DESIGNS,studies:checks,actualBrowserNotYetTested:true,
 originalCCDRunnerAnd240HzUntouched:true,ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',RELEASE:'HOLD'}));

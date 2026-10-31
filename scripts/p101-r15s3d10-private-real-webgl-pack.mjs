/** PRIVATE-ONLY actual drive3d WebGL2 engine extension.
 * Run AFTER npm run build:private. Only dist-private/r15s3d10/ is patched.
 * Original drive3d.mjs, web sources, production and default preview untouched.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {buildR15S3D9} from './p101-r15s3d9-source-real-road5-road6-integrated-macro.mjs';
import {validate} from '../private/reference_only/director/surface.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist-private');
const orig=path.join(root,'web/p101-w9c2-g4e7ci-integrated-streetscape.mjs');
const originalData=fs.readFileSync(orig);
const blob=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+originalData.length+'\0'),originalData])).digest('hex');
assert.equal(blob,'af076d67492a677d2235e4730aef8cdf4808e106','protected game source mismatch');
assert.ok(fs.existsSync(path.join(dist,'drive3d/drive3d.mjs')),'npm run build:private must run FIRST');
assert.ok(fs.existsSync(path.join(dist,'reference_only/director/physics.js')),'real original Runner missing');
const assets={};
for(const world of ['true-pinch','pinch-switch']){
 const doc=buildR15S3D9(world,'A_CONTINUOUS_NARROW_MACRO');
 assert.equal(doc.surfaces.length,7);assert.equal(doc.movingObstacles.length,28);
 assert.ok(doc.stageForge.r15s3d9?.unchangedCompleteRoads0Through4);
 assert.equal(doc.stageForge.r15s3d9.newHiddenRoadsOrPhysicsColliders,0);
 doc.stageForge={...doc.stageForge,id:'VB-P101',variant:'A13_GAMEPLAY_ISOLATED',
  recordStageId:'R15S3D10_'+world.toUpperCase().replace('-','_')+'_REAL_PRIVATE_WEBGL',
  productionPromoted:false,
  r15s3d10Private:{
   schema:'dopagaki.r15s3d10-real-game-private-stage/1',
   world,sourceGameBlob:blob,realB48:7,realB51:28,
   genuineMacro:'A_CONTINUOUS_NARROW_MACRO',sourceRunnerFinish2of2PreviouslyProven:true,
   webGLHumanCameraArtStillUnderTest:true,formalArt:0,formalSlope2Meters:0,release:'HOLD'}};
 const doc2=validate(doc);
 const name='R15S3D10_'+world.toUpperCase().replace('-','_')+'_REAL_PRIVATE_WEBGL.json';
 fs.writeFileSync(path.join(dist,'generated',name),JSON.stringify(doc2)+'\n');
 assets['R15S3D10-'+world.toUpperCase()]=name;
}
const dest=path.join(dist,'r15s3d10');
fs.rmSync(dest,{recursive:true,force:true});
fs.cpSync(path.join(dist,'drive3d'),dest,{recursive:true});
let js=fs.readFileSync(path.join(dest,'drive3d.mjs'),'utf8');
let html=fs.readFileSync(path.join(dest,'index.html'),'utf8');
function edit(needle,replacement){
 assert.equal(js.split(needle).length,2,'Private original renderer source anchor missing or ambiguous: '+needle.slice(0,130));
 js=js.replace(needle,replacement);
}
edit("// G4E-1 physical trials are private opt-in; Gold remains the visible default.",[
 "// R15S3D10 exists ONLY in the isolated PRIVATE copy of original renderer.",
 "const r15s3d10OptIn=['localhost','127.0.0.1','[::1]'].includes(window.location.hostname)&&new URLSearchParams(window.location.search).get('r15s3d10')==='on';",
 "let r15s3d10Plan=null,r15s3d10NativeTicks=0;",
 "if(r15s3d10OptIn){for(const [id,name] of Object.entries("+JSON.stringify(assets)+")){",
 " assets[id]=name;const opt=document.createElement('option');opt.value=id;opt.textContent='R15S3D10 PRIVATE REAL 240Hz · '+id+' (HUMAN/ART HOLD)';$('stage').append(opt);",
 "}}",
 "// G4E-1 physical trials are private opt-in; Gold remains the visible default."
].join('\n'));
edit("import {movingObstaclePose,sphereBoxSeparation} from '../reference_only/director/moving/moving-obstacles.mjs';",
 "import {movingObstaclePose,sphereBoxSeparation} from '../reference_only/director/moving/moving-obstacles.mjs';\\nimport {originalB51TrueSpatialCue} from './r15s3d10-physical-b51-hud-cue.mjs';".replace('\\n','\n'));
edit("import {p101Step,P101_DEFAULT,p101ReboundRecoveryState} from './p101-overdrive.mjs';",[
 "import {makeP96RoutePlan,p96DodgeSteer} from './p96-avoidance-steer.mjs';",
 "import {p94NativeSteer} from './p94-native-steer.mjs';",
 "import {p101Step,P101_DEFAULT,p101ReboundRecoveryState} from './p101-overdrive.mjs';"
].join('\n'));
edit("runner=new Runner(doc,world,spawn,physicalQaLaunch);runner.assist=true;accum=0;paused=false;",[
 "runner=new Runner(doc,world,spawn,physicalQaLaunch);runner.assist=true;accum=0;paused=false;",
 " r15s3d10Plan=(r15s3d10OptIn&&doc.stageForge?.r15s3d10Private)?makeP96RoutePlan(doc,runner):null;",
 " r15s3d10NativeTicks=0;",
 " canvas.dataset.r15s3d10OriginalGame=r15s3d10Plan?'REAL_WEBGL2_SOURCE_240HZ':'OFF';"
].join('\n'));
edit("if(!isDemoEligible(doc)||!runner)return;",
 "if(!(isDemoEligible(doc)||r15s3d10Plan)||!runner)return;");
edit("const steer=g4e7bQa?qaSteer(g4e7bQa,runner,movingObstaclePose):demoMode?nativeDemoSteer(demoDirector,runner,movingObstaclePose):manualSteer;",
 [
 "const scriptDemo=Boolean(r15s3d10Plan&&demoMode);",
 "   const steer=g4e7bQa?qaSteer(g4e7bQa,runner,movingObstaclePose):",
 "   scriptDemo?(r15s3d10NativeTicks<Math.round(21.5/DT)?",
 "     p96DodgeSteer(runner,r15s3d10Plan,'early-soft',movingObstaclePose).input/4.8:",
 "     p94NativeSteer(runner,'corrective')):",
 "     demoMode?nativeDemoSteer(demoDirector,runner,movingObstaclePose):manualSteer;"
 ].join('\n'));
edit("currentPose=capturePose(runner);\n   if(g4e7bQa)qaStep",[
 "currentPose=capturePose(runner);",
 "   if(r15s3d10Plan){r15s3d10NativeTicks++;",
 "    canvas.dataset.r15s3d10NativeTicks=String(r15s3d10NativeTicks);",
 "    canvas.dataset.r15s3d10Status=runner.status;",
 "    canvas.dataset.r15s3d10Road=runner.surface||'air';",
 "    canvas.dataset.r15s3d10FinishEvents=String(runner.events.filter(e=>e.type==='finish').length);",
 "    canvas.dataset.r15s3d10DriveMode=demoMode?'SCRIPTED_P96_THEN_P94_NOT_HUMAN':'ORIGINAL_MANUAL_UNCERTIFIED';}",
 "   if(g4e7bQa)qaStep"
].join('\n'));
edit("  $('demoRun').disabled=!isDemoEligible(doc)||id==='VB-P101-A13-W9X-B1'||Boolean(doc.stageForge.slopeDNAStudy);",
 "  $('demoRun').disabled=!(isDemoEligible(doc)||r15s3d10OptIn&&Boolean(value.stageForge?.r15s3d10Private))||id==='VB-P101-A13-W9X-B1'||Boolean(doc.stageForge.slopeDNAStudy);");
edit("   if(seq!==loading)return;\n   buildVisual(value);doc=value;world=compiled;ghostData=replay;",
 [
 "   if(seq!==loading)return;",
 "   if(r15s3d10OptIn&&value.stageForge?.r15s3d10Private){",
 "    const v=value.stageForge.r15s3d10Private;",
 "    if(v.sourceGameBlob!=="+JSON.stringify(blob)+"||v.realB48!==7||v.realB51!==28||",
 "       value.stageForge.productionPromoted!==false||!['true-pinch','pinch-switch'].includes(v.world))",
 "      throw Error('R15S3D10 PRIVATE actual source provenance failed');",
 "   }",
 "   buildVisual(value);doc=value;world=compiled;ghostData=replay;"
].join('\n'));
// PRIVATE inspector only. A Playwright explicit variable freezes at the exact
// 240Hz committed tick (±1/240s), not a coarse HUD 500ms polling target.
// Absent this variable, ordinary manual/source-demo gameplay is identical.
edit("   return runner.status!=='failed'&&runner.status!=='finished';\n  });",[
 "   if(r15s3d10Plan&&Number.isFinite(window.__r15s3d10PauseAt)&&",
 "      runner.time+1e-9>=window.__r15s3d10PauseAt&&runner.status==='running'){",
 "    paused=true;accum=0;",
 "    canvas.dataset.r15s3d10PausedAt=runner.time.toFixed(6);",
 "    window.__r15s3d10PauseAt=null;",
 "    $('pause').textContent='再開 (Space)';",
 "    hud();",
 "    return false;",
 "   }",
 "   return runner.status!=='failed'&&runner.status!=='finished';",
 "  });"
].join('\n'));
edit("  const advance=['VB-P95','VB-P99','VB-P100','VB-P101'].includes(doc?.stageForge?.id)",
 [
 "  if(r15s3d10Plan){",
 "   const view=viewForPose(capturePose(runner),cameraState??createCameraState(runner.forward));",
 "   const physical=originalB51TrueSpatialCue(doc,runner,view,movingObstaclePose,sphereBoxSeparation,RADIUS);",
 "   machineLabel.hidden=false;",
 "   machineLabel.textContent=physical.message;",
 "   machineLabel.dataset.mode=physical.next?.mode||'none';",
 "   machineLabel.dataset.urgency=physical.next?.actualBoxSurfaceSeparationM<30?'spatial-near':'none';",
 "   canvas.dataset.hazardUrgency=machineLabel.dataset.urgency;",
 "   canvas.dataset.hazardTarget=physical.next?.id||'none';",
 "   canvas.dataset.hazardEta='NOT_EVALUATED';",
 "   canvas.dataset.r15s3d10PhysicallyNearB51=physical.next?physical.next.actualBoxSurfaceSeparationM.toFixed(2):'none';",
 "   canvas.dataset.r15s3d10FovOnlyNotVisibility=String(physical.occlusionUntested);",
 "  }else{",
 "  const advance=['VB-P95','VB-P99','VB-P100','VB-P101'].includes(doc?.stageForge?.id)"
].join('\n'));
edit("  else if(cue)machineLabel.textContent=cue.typeLabel+' / '+cue.modeLabel+' · '+cue.lateralLabel+' '+cue.distance+'m';\n }\n updateChapterHUD();",[
 "  else if(cue)machineLabel.textContent=cue.typeLabel+' / '+cue.modeLabel+' · '+cue.lateralLabel+' '+cue.distance+'m';",
 "  }",
 " }",
 " updateChapterHUD();"
].join('\n'));
fs.copyFileSync(path.join(root,'scripts/p101-r15s3d10-physical-b51-hud-cue.mjs'),
 path.join(dest,'r15s3d10-physical-b51-hud-cue.mjs'));
const banner='<aside style="position:fixed;bottom:10px;left:12px;z-index:1000;max-width:420px;background:#071728e8;border:1px solid #73dcdd;color:#b6f5ef;border-radius:10px;padding:10px;font:12px/1.5 system-ui;pointer-events:none">R15S3D10 PRIVATE · REAL GAME WEBGL2 / 240Hz · B48×7 B51×28　<br>原ゲーム描画・カメラ・HUD。自動デモはP96→P94研究用。人間・ART・本番はHOLD。</aside>';
assert.equal(html.split('<script type="module" src="./drive3d.mjs"></script>').length,2);
html=html.replace('<script type="module" src="./drive3d.mjs"></script>',banner+'<script type="module" src="./drive3d.mjs"></script>');
fs.writeFileSync(path.join(dest,'drive3d.mjs'),js);
fs.writeFileSync(path.join(dest,'index.html'),html);
assert.ok(!fs.readFileSync(path.join(dist,'drive3d/drive3d.mjs'),'utf8').includes('r15s3d10OptIn'));
console.log('R15S3D10_PRIVATE_GAME_PACK',JSON.stringify({isolatedPath:'dist-private/r15s3d10/',
 stageIds:Object.keys(assets),originalGameSourceBlob:blob,originalDrive3dUntouched:true,
 originalRunnerPhysics:true,originalWebGL2Renderer:true,actualWebGLBrowserMeasured:false,
 humanArtRelease:'HOLD'}));

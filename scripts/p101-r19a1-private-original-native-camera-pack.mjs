/** R19A1: PRIVATE original WebGL2 exact native 0..12s screenshot pack. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {runR19A0} from './p101-r19a0-real-12s-integrated-gameplay-city.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist-private');
const source=fs.readFileSync(path.join(root,'web/p101-w9c2-g4e7ci-integrated-streetscape.mjs'));
const blob=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+source.length+'\0'),source])).digest('hex');
assert.equal(blob,'af076d67492a677d2235e4730aef8cdf4808e106');
assert.ok(fs.existsSync(path.join(dist,'drive3d/drive3d.mjs')),'build:private first');
const evidence=path.join(root,'r19-evidence');fs.mkdirSync(evidence,{recursive:true});
const native=runR19A0();
fs.writeFileSync(path.join(evidence,'R19_A1_NATIVE12S_SOURCE.json'),JSON.stringify(native,null,2)+'\n');
const dest=path.join(dist,'r19a1');
fs.rmSync(dest,{recursive:true,force:true});fs.cpSync(path.join(dist,'drive3d'),dest,{recursive:true});
const target=path.join(dest,'drive3d.mjs');let js=fs.readFileSync(target,'utf8');
function patch(needle,replacement){
 assert.equal(js.split(needle).length,2,'Original renderer anchor unavailable: '+needle.slice(0,90));
 js=js.replace(needle,replacement);
}
patch("import {p101Step,P101_DEFAULT,p101ReboundRecoveryState} from './p101-overdrive.mjs';",
 "import {makeP96RoutePlan,p96DodgeSteer} from './p96-avoidance-steer.mjs';\n"+
 "import {originalB51TrueSpatialCue} from './r19a1-source-B51-fov.mjs';\n"+
 "import {p101Step,P101_DEFAULT,p101ReboundRecoveryState} from './p101-overdrive.mjs';");
patch("const pairTrialIds=new Set(['VB-P101-A13-W9C1-CONTROL','VB-P101-A13-W9C1-ULTRA']);",
 [
  "const pairTrialIds=new Set(['VB-P101-A13-W9C1-CONTROL','VB-P101-A13-W9C1-ULTRA']);",
  "const r19a1OptIn=['localhost','127.0.0.1','[::1]'].includes(location.hostname)&&",
  " new URLSearchParams(location.search).get('r19a1')==='on';",
  "let r19a1Plan=null,r19a1Ticks=0;"
 ].join('\n'));
patch("runner=new Runner(doc,world,spawn,physicalQaLaunch);runner.assist=true;accum=0;paused=false;",
 [
 "runner=new Runner(doc,world,spawn,physicalQaLaunch);runner.assist=true;accum=0;paused=false;",
 " r19a1Plan=(r19a1OptIn&&pairTrialIds.has(doc?.stageForge?.recordStageId)&&spawn===0)?",
 "  makeP96RoutePlan(doc,runner):null;",
 " r19a1Ticks=0;canvas.dataset.r19a1PauseTick='none';",
 " canvas.dataset.r19a1Mode=r19a1Plan?'ORIGINAL_SOURCE_240HZ_NOT_HUMAN':'OFF';"
 ].join('\n'));
patch("buildVisual(value);doc=value;world=compiled;ghostData=replay;\n  $('demoRun').disabled=!isDemoEligible(doc)||id==='VB-P101-A13-W9X-B1'||Boolean(doc.stageForge.slopeDNAStudy);",
 [
  "buildVisual(value);doc=value;world=compiled;ghostData=replay;",
  "  $('demoRun').disabled=!(isDemoEligible(doc)||(r19a1OptIn&&pairTrialIds.has(value.stageForge?.recordStageId)))||",
  "   id==='VB-P101-A13-W9X-B1'||Boolean(doc.stageForge.slopeDNAStudy&&!r19a1OptIn);"
 ].join('\n'));
patch("if(!isDemoEligible(doc)||!runner)return;",
 "if(!(isDemoEligible(doc)||(r19a1OptIn&&pairTrialIds.has(doc?.stageForge?.recordStageId)))||!runner)return;");
patch("const steer=g4e7bQa?qaSteer(g4e7bQa,runner,movingObstaclePose):demoMode?nativeDemoSteer(demoDirector,runner,movingObstaclePose):manualSteer;",
 [
 "const steer=(r19a1Plan&&demoMode)?",
 " p96DodgeSteer(runner,r19a1Plan,'early-soft',movingObstaclePose).input/4.8:",
 " g4e7bQa?qaSteer(g4e7bQa,runner,movingObstaclePose):",
 " demoMode?nativeDemoSteer(demoDirector,runner,movingObstaclePose):manualSteer;"
 ].join('\n'));
patch("currentPose=capturePose(runner);\n   if(g4e7bQa)qaStep(g4e7bQa,runner);",
 [
  "currentPose=capturePose(runner);",
  "   if(r19a1Plan&&demoMode){",
  "    r19a1Ticks++;canvas.dataset.r19a1NativeTicks=String(r19a1Ticks);",
  "    canvas.dataset.r19a1Speed=Math.hypot(...runner.v).toFixed(7);",
  "    canvas.dataset.r19a1XYZ=runner.p.map(v=>v.toFixed(7)).join(',');",
  "    canvas.dataset.r19a1Time=runner.time.toFixed(7);",
  "    canvas.dataset.r19a1Road=runner.surface||'AIR';",
  "    canvas.dataset.r19a1Status=runner.status;",
  "    canvas.dataset.r19a1B51=String(doc.movingObstacles.length);",
  "   }",
  "   if(g4e7bQa)qaStep(g4e7bQa,runner);"
 ].join('\n'));
patch("return runner.status!=='failed'&&runner.status!=='finished';\n  });",
 [
  "if(r19a1Plan&&demoMode&&Number.isSafeInteger(window.__r19a1PauseAtTick)&&",
  " r19a1Ticks>=window.__r19a1PauseAtTick&&runner.status==='running'){",
  " paused=true;accum=0;",
  " canvas.dataset.r19a1PauseTick=String(r19a1Ticks);",
  " window.__r19a1PauseAtTick=null;",
  " $('pause').textContent='再開 (Space)';hud();return false;",
  "}",
  "return runner.status!=='failed'&&runner.status!=='finished';",
  "  });"
 ].join('\n'));
patch("const view=viewForPose(pose,cameraState);\n  // CJ: read-only evidence",
 [
  "const view=viewForPose(pose,cameraState);",
  " if(r19a1Plan&&demoMode){",
  "  const h=originalB51TrueSpatialCue(doc,runner,view,movingObstaclePose,sphereBoxSeparation,RADIUS);",
  "  canvas.dataset.r19a1FovCandidates=String(h.estimatedFovBodyCenters);",
  "  canvas.dataset.r19a1ClosestB51=h.next?.id||'none';",
  "  canvas.dataset.r19a1B51Separation=String(h.next?.actualBoxSurfaceSeparationM??'none');",
  "  canvas.dataset.r19a1B51ScreenX=String(h.next?.cameraNormalizedX??'none');",
  "  canvas.dataset.r19a1B51ScreenY=String(h.next?.cameraNormalizedY??'none');",
  "  canvas.dataset.r19a1B51OcclusionUntested='true';",
  "  canvas.dataset.r19a1Eye=view.eye.map(n=>n.toFixed(6)).join(',');",
  "  canvas.dataset.r19a1Front=view.front.map(n=>n.toFixed(6)).join(',');",
  " }",
  " // CJ: read-only evidence"
 ].join('\n'));
fs.copyFileSync(path.join(root,'scripts/p101-r15s3d10-physical-b51-hud-cue.mjs'),
 path.join(dest,'r19a1-source-B51-fov.mjs'));
let html=fs.readFileSync(path.join(dest,'index.html'),'utf8');
const marker='<script type="module" src="./drive3d.mjs"></script>';
assert.equal(html.split(marker).length,2);
html=html.replace(marker,'<aside style="position:fixed;bottom:8px;left:8px;z-index:1000;background:#071625df;color:#bff3ff;padding:5px;font:11px system-ui;pointer-events:none">R19A1 PRIVATE · true 240Hz · scripted not human · ART HOLD</aside>'+marker);
fs.writeFileSync(path.join(dest,'index.html'),html);
fs.writeFileSync(target,js);
assert.ok(!fs.readFileSync(path.join(dist,'drive3d/drive3d.mjs'),'utf8').includes('r19a1OptIn'));
console.log('R19A1_PRIVATE_NATIVE_CAMERA_PACK',JSON.stringify({protectedBlob:blob,stage:'W9C1 original 14m/28m',nativeTrace:'r19-evidence/R19_A1_NATIVE12S_SOURCE.json',originalGameUnmodified:true,ART:'HOLD',HUMAN:'HOLD'}));

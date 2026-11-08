/** R57 installer: ONLY generated dist-private/k4ct, after R49 real Blender installation.
 * Source original, R12A author, 240Hz physics, B48/B51/CCD/camera are immutable.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const base=path.resolve('dist-private/k4ct'),file=path.join(base,'drive3d.mjs');
const source=fs.readFileSync(file,'utf8');
function replaceOnce(before,after){
 assert.equal(js.split(before).length,2,'R57 missing/duplicate generated anchor: '+before);
 js=js.replace(before,after);
}
assert.equal(execFileSync('git',['hash-object','web/p101-w9c2-g4e7ci-integrated-streetscape.mjs'],{encoding:'utf8'}).trim(),
 'af076d67492a677d2235e4730aef8cdf4808e106');
assert.equal(execFileSync('git',['hash-object','scripts/p101-k4ct-native-spillway-dcc.py'],{encoding:'utf8'}).trim(),
 '096fffbc1627915eb0122224955bb02cfba6b3ae');
const stage=JSON.parse(fs.readFileSync('dist-private/generated/K4CT_TWO_REAL_B51_NATIVE_CHOICE_PRIVATE.json','utf8'));
assert.equal(stage.surfaces.length,7);assert.equal(stage.movingObstacles.length,28);
assert.equal(stage.stageForge.k4ctPrivate.newColliders,0);
assert.ok(source.includes("k4ctResearchRedundantCue='hidden-dual-original-B51-retained'"),
 'DCC research installer not run');
assert.ok(!source.includes('applyK4CTR57Hud('),'not idempotent');
let js=source;
const importAnchor="import {readK4CTTwoTrueB51,formatK4CTNativeDualCue} from './k4ct-dual-real-b51-decision.mjs';";
replaceOnce(importAnchor,importAnchor+"\nimport {applyK4CTR57Hud} from './k4ct-r57-live-hud.mjs';");
const anchor='k4ctPanel.textContent=formatK4CTNativeDualCue(dual);';
replaceOnce(anchor,anchor+"\n if(doc?.stageForge?.k4ctPrivate)applyK4CTR57Hud(canvas,k4ctPanel,dual);");
fs.copyFileSync('scripts/k4ct-r57-live-hud.mjs',path.join(base,'k4ct-r57-live-hud.mjs'));
fs.writeFileSync(file,js);
assert.ok(js.includes("applyK4CTR57Hud(canvas,k4ctPanel,dual)"));
console.log('R57_PRIVATE_RESEARCH_LIVE_HUD_INSTALLED',JSON.stringify({
 privateGeneratedOnly:true,originalGameChanged:false,originalBlenderAuthorChanged:false,
 originalCameraChanged:false,originalPhysicsChanged:false,originalB48:7,originalB51:28,
 newColliders:0,reversible:'window.__k4ctR57HudMode=BASE/CANDIDATE',default:'CANDIDATE',
 rewardLogicChanged:false,ART:'HOLD',HUMAN:'HOLD'}));

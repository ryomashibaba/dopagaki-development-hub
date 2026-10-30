/** R15S3D11: PRIVATE ONLY real original WebGL2 viewer of physically moved
 * six original B51 on actual R15S3D9 native-finish B48. Previous D10
 * renderer is copied, not modified; it still runs original 240Hz Runner,
 * original viewForPose camera, B51 mesh, and physical OBB HUD.
 * No human certification, no formal art, no release, no original game edit.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {buildR15S3D11,MODES} from './p101-r15s3d11-six-real-b51-lane-reanchor-candidates.mjs';
import {validate} from '../private/reference_only/director/surface.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist-private');
const source=fs.readFileSync(path.join(root,'web/p101-w9c2-g4e7ci-integrated-streetscape.mjs'));
const sha=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+source.length+'\0'),source])).digest('hex');
assert.equal(sha,'af076d67492a677d2235e4730aef8cdf4808e106');
assert.ok(fs.existsSync(path.join(dist,'r15s3d10/drive3d.mjs')),'R15S3D10 private actual game pack must be built first');
const dest=path.join(dist,'r15s3d11');
fs.rmSync(dest,{recursive:true,force:true});
fs.cpSync(path.join(dist,'r15s3d10'),dest,{recursive:true});
const names={};
for(const world of ['true-pinch','pinch-switch'])for(const mode of MODES){
 const doc=buildR15S3D11(world,mode),old=doc.stageForge.r15s3d11;
 assert.equal(doc.movingObstacles.length,28);
 assert.equal(old.changedMachines.length,6);
 doc.stageForge={...doc.stageForge,
  id:'VB-P101',variant:'A13_GAMEPLAY_ISOLATED',productionPromoted:false,
  recordStageId:'R15S3D11_'+world.toUpperCase().replace('-','_')+'_'+mode+'_REAL_PRIVATE_WEBGL',
  r15s3d10Private:{schema:'dopagaki.r15s3d10-real-game-private-stage/1',
   world,sourceGameBlob:sha,realB48:7,realB51:28,
   genuineMacro:'A_CONTINUOUS_NARROW_MACRO',sourceRunnerFinish2of2PreviouslyProven:true,
   webGLHumanCameraArtStillUnderTest:true,formalArt:0,formalSlope2Meters:0,release:'HOLD'},
  r15s3d11Private:{schema:'dopagaki.r15s3d11-actual-source-hazard-webgl/1',
   world,mode,actualPhysicalB51Moved:6,sourceGameBlob:sha,
   old22OriginalBodiesFrozen:true,trueNativeSourcedFramesPending:true,
   artistApproved:false,manualApproval:false,productionPromoted:false}};
 const checked=validate(doc);
 const name='R15S3D11_'+world.toUpperCase().replace('-','_')+'_'+mode+'_PRIVATE.json';
 fs.writeFileSync(path.join(dist,'generated',name),JSON.stringify(checked)+'\n');
 names['R15S3D11-'+world.toUpperCase()+'-'+(mode===MODES[0]?'EDGE':'CROSS')]=name;
}
const src=path.join(dest,'drive3d.mjs');
let js=fs.readFileSync(src,'utf8');
const anchor="// G4E-1 physical trials are private opt-in; Gold remains the visible default.";
assert.equal(js.split(anchor).length,2);
js=js.replace(anchor,[
 "// R15S3D11 inserted only into private copy of actual R15S3D10 original renderer.",
 "if(r15s3d10OptIn){for(const [id,name] of Object.entries("+JSON.stringify(names)+")){",
 " assets[id]=name;",
 " const opt=document.createElement('option');opt.value=id;",
 " opt.textContent='R15S3D11 '+id+' | REAL 6 B51 RE-ANCHORED · HUMAN/ART HOLD';",
 " $('stage').append(opt);",
 "}}",
 anchor].join('\n'));
const oldGate="new URLSearchParams(window.location.search).get('r15s3d10')==='on'";
assert.equal(js.split(oldGate).length,2);
js=js.replace(oldGate,"new URLSearchParams(window.location.search).get('r15s3d11')==='on'");
fs.writeFileSync(src,js);
const htmlPath=path.join(dest,'index.html');
let html=fs.readFileSync(htmlPath,'utf8');
assert.ok(html.includes('R15S3D10 PRIVATE'));
html=html.replace('R15S3D10 PRIVATE','R15S3D11 PRIVATE / 6 ORIGINAL B51 PHYSICALLY RE-ANCHORED');
fs.writeFileSync(htmlPath,html);
assert.ok(!fs.readFileSync(path.join(dist,'r15s3d10/drive3d.mjs'),'utf8').includes('R15S3D11 inserted'));
assert.ok(!fs.readFileSync(path.join(dist,'drive3d/drive3d.mjs'),'utf8').includes('r15s3d10OptIn'));
console.log('R15S3D11_PRIVATE_ACTUAL_WEBGL2_PACK',JSON.stringify({
 originalGameBlob:sha,realStageCount:4,stageKeys:Object.keys(names),
 originalDrive3dUnchanged:true,originalR15S3D10PreviewUnchanged:true,
 truePrivateGame:'dist-private/r15s3d11/',
 realPhysicalB51AlteredPerStage:6,totalB51PerStage:28,
 realWebGL2NotYetBrowserVerified:true,manualGameplay:'HOLD',ART:'HOLD'}));

/** K4AC-S: synchronous WebGL2 readback INSIDE a source render callback.
 * PRIVATE K4AB renderer clone only. Never alters the original source game,
 * 240Hz physics, camera, B48 roads or B51 hazard bodies.
 * Previous after-screenshot depth probes could sample a discarded buffer.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import crypto from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sourcePath=path.join(root,'web/p101-w9c2-g4e7ci-integrated-streetscape.mjs');
const bytes=fs.readFileSync(sourcePath);
const blob=crypto.createHash('sha1').update(Buffer.concat([
 Buffer.from('blob '+bytes.length+'\0'),bytes])).digest('hex');
assert.equal(blob,'af076d67492a677d2235e4730aef8cdf4808e106');
const from=path.join(root,'dist-private/r19a6p4r2f5k4ab');
const to=path.join(root,'dist-private/r19a6p4r2f5k4acsync');
const input=fs.readFileSync(path.join(from,'drive3d.mjs'),'utf8');
assert.ok(input.includes('k4abBufferTags'),'K4AB private draw provenance missing');
assert.ok(input.includes("const k4abAuditOn="),'original native provenance gate missing');
assert.ok(!input.includes('k4acSyncReadDepthInRender'),'cannot patch twice');
const probe=fs.readFileSync(path.join(root,
 'scripts/p101-r19a6p4r2f5k4ac-native-depth-probe.mjs'),'utf8');
const begin='return page.evaluate(()=>{';
const stop='\n });\n}';
assert.equal(probe.split(begin).length,2,'depth probe anchor must be unique');
const start=probe.indexOf(begin)+begin.length,end=probe.indexOf(stop,start);
assert.ok(end>start,'depth read body not found');
const readBody=probe.slice(start,end);
assert.ok(readBody.includes('gl.blitFramebuffer('));
assert.ok(readBody.includes('gl.readPixels('));
assert.ok(readBody.includes('gl.bindFramebuffer(gl.READ_FRAMEBUFFER,saved.read)'));
assert.ok(readBody.includes('gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,saved.draw)'));
assert.ok(readBody.includes('saved.unitZeroBinding'));
const func='function k4acSyncReadDepthInRender(){\n'+readBody+'\n}\n';
const gate=[
 'const k4acSyncOnly=r19a1OptIn&&',
 " ['localhost','127.0.0.1','[::1]'].includes(location.hostname)&&",
 " new URLSearchParams(location.search).get('k4acsync')==='on';",
 'let k4acSyncLastSeq=-1;',
 func,
 'function k4acSyncRenderSample(){',
 ' if(!k4acSyncOnly)return;',
 ' const request=window.__k4acSyncCapture;',
 ' if(!request||!Number.isSafeInteger(request.seq)||request.seq<=k4acSyncLastSeq)return;',
 ' if(!Number.isSafeInteger(request.tick)||request.tick!==r19a1Ticks)return;',
 ' if(request.mask!==k4abActiveMask())return;',
 " if(!runner||runner.status!=='running'||!paused)return;",
 ' const result=k4acSyncReadDepthInRender();',
 ' canvas.dataset.k4acSyncCapture=JSON.stringify({',
 "  schema:'dopagaki.K4AC-S.draw-callback-native-depth-probe/1',",
 "  provenance:'INSIDE_NATIVE_RENDER_AFTER_DRAWS_BEFORE_FRAME_PRESENT',",
 '  seq:request.seq,tick:r19a1Ticks,mask:k4abActiveMask(),',
 "  sourceBlob:'af076d67492a677d2235e4730aef8cdf4808e106',",
 '  sourceRoad:runner.surface,sourceB48:doc.surfaces.length,',
 '  sourceB51:doc.movingObstacles.length,depth:result,',
 "  art:'NOT_TESTED_HOLD',originalGameModified:false",
 ' });',
 ' k4acSyncLastSeq=request.seq;',
 '}'
].join('\n');
let script=input;
function patch(a,b){
 assert.equal(script.split(a).length,2,'K4AC-S anchor moved: '+a.slice(0,80));
 script=script.replace(a,b);
}
const anchor='let r19a1Plan=null,r19a1Ticks=0;';
patch(anchor,anchor+'\n'+gate+'\n');
const endRender="canvas.dataset.energyTrail=energyFx&&effect.trailActive?'active':'inactive';";
patch(endRender,
 'if(k4acSyncOnly)k4acSyncRenderSample();\n '+endRender);
assert.ok(script.indexOf('k4acSyncRenderSample();')>script.indexOf('function render('));
assert.ok(script.indexOf('k4acSyncRenderSample();')<script.indexOf(
 "canvas.dataset.energyTrail=energyFx&&effect.trailActive?'active':'inactive';"));
fs.rmSync(to,{recursive:true,force:true});
fs.cpSync(from,to,{recursive:true});
fs.writeFileSync(path.join(to,'drive3d.mjs'),script,'utf8');
assert.equal(fs.readFileSync(path.join(from,'drive3d.mjs'),'utf8'),input,
 'original K4AB private renderer must be byte-identical');
console.log('K4AC_SYNC_PRIVATE_RENDERER_BUILT',JSON.stringify({
 sourceBlob:blob,from:'r19a6p4r2f5k4ab',to:'r19a6p4r2f5k4acsync',
 patchedAnchors:2,captureTiming:'INSIDE_NATIVE_RENDER_AFTER_DRAWS_BEFORE_PRESENT',
 patchOriginalPhysics:false,patchOriginalCamera:false,
 newModels:0,newColliders:0,originalArt:'NOT_TESTED_HOLD',
 driverLimitations:'Actual depth may remain unavailable on WebGL2 drivers'}));

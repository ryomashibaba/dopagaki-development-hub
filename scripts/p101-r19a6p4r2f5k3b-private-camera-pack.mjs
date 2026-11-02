/** K3B: copy PRIVATE source A1, legal late P94/3 after tick7680.
 * Never patch original game, built base, Gold or published URLs.
 */
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const raw=fs.readFileSync(path.join(root,'web/p101-w9c2-g4e7ci-integrated-streetscape.mjs'));
const sha=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+raw.length+'\0'),raw])).digest('hex');
assert.equal(sha,'af076d67492a677d2235e4730aef8cdf4808e106');
const from=path.join(root,'dist-private/r19a1');
const out=path.join(root,'dist-private/r19a6p4r2f5k3b');
assert.ok(fs.existsSync(path.join(from,'drive3d.mjs')));
fs.rmSync(out,{recursive:true,force:true});fs.cpSync(from,out,{recursive:true});
const orig=fs.readFileSync(path.join(from,'drive3d.mjs'),'utf8');
let text=orig;
function replaceExactly(needle,replacement){
 assert.equal(text.split(needle).length,2,'Private original source patch anchor drift '+needle.slice(0,120));
 text=text.replace(needle,replacement);
}
const imp="import {makeP96RoutePlan,p96DodgeSteer} from './p96-avoidance-steer.mjs';";
replaceExactly(imp,imp+"\nimport {p94NativeSteer} from './p94-native-steer.mjs';");
const src="p96DodgeSteer(runner,r19a1Plan,'early-soft',movingObstaclePose).input/4.8:";
const dst="(r19a1Ticks<7680 ? p96DodgeSteer(runner,r19a1Plan,'early-soft',movingObstaclePose).input/4.8 : p94NativeSteer(runner,'corrective')/3):";
replaceExactly(src,dst);
replaceExactly("canvas.dataset.r19a1Mode=r19a1Plan?'ORIGINAL_SOURCE_240HZ_NOT_HUMAN':'OFF';",
"canvas.dataset.r19a1Mode=r19a1Plan?'K3B_LEGAL_LATE_P94_DIV3__NOT_HUMAN':'OFF';");
const p=path.join(out,'drive3d.mjs');fs.writeFileSync(p,text);
assert.equal(fs.readFileSync(path.join(from,'drive3d.mjs'),'utf8'),orig);
assert.ok(!fs.readFileSync(path.join(root,'dist-private/drive3d/drive3d.mjs'),'utf8').includes('K3B_LEGAL_LATE'));
console.log('R2F5K3B_PRIVATE_SOURCE_STEERING_ONLY',JSON.stringify({sha,source:'r19a1',
 switchAfterNativeTicks:7680,scriptedSteering:'P94_CORRECTIVE_DIV_3',
 geometryChanged:false,sourceCameraChanged:false,physicsChanged:false,originalPrivateUnchanged:true}));

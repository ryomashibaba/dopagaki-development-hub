/** K4AG genuine original B51 visual-only individual draw suppression. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const originalFile=path.join(root,'web/p101-w9c2-g4e7ci-integrated-streetscape.mjs');
const source=fs.readFileSync(originalFile);
const sha=crypto.createHash('sha1').update(Buffer.concat([
 Buffer.from('blob '+source.length+'\0'),source])).digest('hex');
assert.equal(sha,'af076d67492a677d2235e4730aef8cdf4808e106');
const src=path.join(root,'dist-private/r19a6p4r2f5k4ad');
const dst=path.join(root,'dist-private/r19a6p4r2f5k4ag');
let script=fs.readFileSync(path.join(src,'drive3d.mjs'),'utf8');
const immutable=script;
assert.ok(script.includes('k4adMeasure')&&script.includes('k4abBufferTags'));
function patch(a,b){
 assert.equal(script.split(a).length,2,'K4AG source anchor changed: '+a.slice(0,60));
 script=script.replace(a,b);
}
patch('const k4adEnabled=r19a1OptIn&&',[
 "const k4agEnabled=r19a1OptIn&&",
 " ['localhost','127.0.0.1'].includes(location.hostname)&&",
 " new URLSearchParams(location.search).get('k4ag')==='on';",
 "let k4agSuppressedThisFrame=[];",
 "const k4adEnabled=r19a1OptIn&&"
].join('\n'));
patch('if(k4adActive)k4adCalls=[];',[
 'if(k4adActive)k4adCalls=[];',
 '  if(k4agEnabled)k4agSuppressedThisFrame=[];'
].join('\n'));
patch([
 'for(const o of doc.movingObstacles){',
 '  if(!o.enabled)continue;',
 '  const obstaclePose=movingObstaclePose(o,pose.time);'
].join('\n'),[
 'for(const o of doc.movingObstacles){',
 '  if(!o.enabled)continue;',
 '  if(k4agEnabled&&k4adActive&&window.__k4agExcludedB51Id===o.id){',
 '   // Display-only research gate. Never suppresses collision checks.',
 '   k4agSuppressedThisFrame.push(o.id);continue;',
 '  }',
 '  const obstaclePose=movingObstaclePose(o,pose.time);'
].join('\n'));
patch('if(k4adEnabled)k4adEnd();',[
 'if(k4agEnabled){',
 '  canvas.dataset.k4agAllB51Ids=JSON.stringify(doc.movingObstacles.map(o=>o.id));',
 '  canvas.dataset.k4agExcludedB51Ids=JSON.stringify(k4agSuppressedThisFrame);',
 ' }',
 ' if(k4adEnabled)k4adEnd();'
].join('\n'));
assert.equal(script.split('k4agSuppressedThisFrame.push(o.id)').length-1,1);
assert.ok(!immutable.includes('__k4agExcludedB51Id'));
fs.rmSync(dst,{force:true,recursive:true});fs.cpSync(src,dst,{recursive:true});
fs.writeFileSync(path.join(dst,'drive3d.mjs'),script,'utf8');
assert.equal(fs.readFileSync(path.join(src,'drive3d.mjs'),'utf8'),immutable);
console.log('K4AG_GENUINE_SOURCE_B51_ID_VISUAL_ONLY_BUILT',
 JSON.stringify({sourceBlob:sha,isolated:'r19a6p4r2f5k4ag',
  physicsChanged:false,cameraChanged:false,collisionChanged:false,
  newModels:0,newColliders:0,art:'NOT_TESTED_HOLD'}));

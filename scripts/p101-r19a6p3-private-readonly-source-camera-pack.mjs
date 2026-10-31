/**
 * R19 A6 P3: private copy of original R19 A3, ONLY read-only projection
 * after original viewForPose. No camera controls, P96, GL2, B48, B51 or art edits.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const baseline=path.join(root,'dist-private/r19a3');
const dest=path.join(root,'dist-private/r19a6p3');
assert.ok(fs.existsSync(path.join(baseline,'drive3d.mjs')),'P3 needs source-private A3 baseline');
fs.rmSync(dest,{recursive:true,force:true});
fs.cpSync(baseline,dest,{recursive:true});
fs.copyFileSync(path.join(root,'scripts/p101-r19a6p3-readonly-source-camera-and-b51.mjs'),
 path.join(dest,'r19a6p3-readonly-source-camera-and-b51.mjs'));
let code=fs.readFileSync(path.join(dest,'drive3d.mjs'),'utf8');
const needle="const view=viewForPose(pose,cameraState);";
assert.equal(code.split(needle).length,2,'canonical actual camera render anchor changed');
const importAnchor="import {originalB51TrueSpatialCue} from './r19a1-source-B51-fov.mjs';";
assert.equal(code.split(importAnchor).length,2,'P3 requires known original B51 source private camera');
code=code.replace(importAnchor,importAnchor+"\n"+
 "import {sourceP3ReadOnlyActualFrame} from './r19a6p3-readonly-source-camera-and-b51.mjs';");
code=code.replace(needle,needle+"\n"+
 " if(r19a1OptIn&&new URLSearchParams(location.search).get('r19a6p3')==='on'){\n"+
 "  const proof=sourceP3ReadOnlyActualFrame(doc,runner,pose,view,w,h,movingObstaclePose);\n"+
 "  canvas.dataset.r19a6p3ActualCamera=JSON.stringify(proof);\n"+
 " }");
fs.writeFileSync(path.join(dest,'drive3d.mjs'),code);
assert.ok(!fs.readFileSync(path.join(baseline,'drive3d.mjs'),'utf8').includes('r19a6p3ActualCamera'));
assert.ok(!fs.readFileSync(path.join(root,'dist-private/drive3d/drive3d.mjs'),'utf8').includes('r19a6p3ActualCamera'));
console.log('R19_A6P3_PRIVATE_READONLY_ACTUAL_VIEW_B51_28',
 JSON.stringify({source:'original actual viewForPose',B48:7,B51:28,collisionAdded:0,
 nativeGameUnchanged:true,ART:'HOLD',privateOnly:true}));

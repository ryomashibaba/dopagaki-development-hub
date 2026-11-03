/** K4AH: capture original B51 OBB and actual camera/ball pose IN SAME native draw.
 * Extra evidence only in isolated private K4AD clone; original source untouched.
 * This file never adjusts a solid, its physics time, camera or GPU draw.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const protectedSource=fs.readFileSync(path.join(root,'web/p101-w9c2-g4e7ci-integrated-streetscape.mjs'));
const blob=crypto.createHash('sha1').update(Buffer.concat([
 Buffer.from('blob '+protectedSource.length+'\0'),protectedSource])).digest('hex');
assert.equal(blob,'af076d67492a677d2235e4730aef8cdf4808e106');
const from=path.join(root,'dist-private/r19a6p4r2f5k4ad');
const to=path.join(root,'dist-private/r19a6p4r2f5k4ah');
const original=fs.readFileSync(path.join(from,'drive3d.mjs'),'utf8');
let script=original;
function patch(a,b){assert.equal(script.split(a).length,2,'K4AH anchor changed: '+a);script=script.replace(a,b);}
patch('const k4adEnabled=r19a1OptIn&&',[
 "const k4ahEnabled=r19a1OptIn&&",
 " ['127.0.0.1','localhost'].includes(location.hostname)&&",
 " new URLSearchParams(location.search).get('k4ah')==='on';",
 "const k4adEnabled=r19a1OptIn&&"
].join('\n'));
patch('if(k4adEnabled)k4adEnd();',[
 "if(k4ahEnabled&&k4adActive&&k4abActiveMask()==='none'&&",
 " window.__k4adRequest?.tick===r19a1Ticks){",
 " const ids=doc.movingObstacles.filter(o=>o.id==='p95-hazard-12');",
 " if(ids.length!==1)throw Error('K4AH_B51_SOURCE_ID_NOT_UNIQUE');",
 " const descriptor=ids[0],originalPose=movingObstaclePose(descriptor,pose.time);",
 " const ball=sphereBoxSeparation(pose.position,RADIUS,originalPose);",
 " const eyeSigned=sphereBoxSeparation(view.eye,0.001,originalPose);",
 " const diff=originalPose.center.map((x,i)=>x-view.eye[i]);",
 " const norm=Math.hypot(...diff);",
 " const dot=(a,b)=>a.reduce((x,v,i)=>x+v*b[i],0);",
 " const data={schema:'dopagaki.K4AH.original-in-render-pose/1',",
 "  sourceBlob:'af076d67492a677d2235e4730aef8cdf4808e106',",
 "  requestSeq:window.__k4adRequest.seq,nativeTick:r19a1Ticks,",
 "  sourceMask:k4abActiveMask(),sourceRoad:runner.surface,",
 "  sourceB51Count:doc.movingObstacles.length,",
 "  cameraMode:comparisonMode,sourceTimeSeconds:runner.time,",
 "  poseTimeSeconds:pose.time,ballPosition:[...pose.position],ballRadius:RADIUS,",
 "  camera:{eye:[...view.eye],front:[...view.front],right:[...view.right],up:[...view.up]},",
 "  obstacleDescriptor:structuredClone(descriptor),",
 "  originalMovingObstaclePose:structuredClone(originalPose),",
 "  signedBallSurfaceToOBBMeters:ball.separation,",
 "  signedCameraEyePointToOBBMeters:eyeSigned.separation+0.001,",
 "  ballSeparationNormal:ball.normal,",
 "  ballInsideOBB:ball.inside,cameraEyeInsideOBB:eyeSigned.inside,",
 "  eyeToOBBCenterMeters:norm,",
 "  eyeToOBBCenterProjection:{horizontal:dot(diff,view.right),",
 "    vertical:dot(diff,view.up),forward:dot(diff,view.front)},",
 "  originalGameModified:false,collisionChanged:false,",
 "  ART:'NOT_TESTED_HOLD'};",
 " canvas.dataset.k4ahGeometry=JSON.stringify(data);",
 "}",
 "if(k4adEnabled)k4adEnd();"
].join('\n'));
assert.ok(script.includes('movingObstaclePose(descriptor,pose.time)'));
assert.ok(script.includes('sphereBoxSeparation(pose.position,RADIUS,originalPose)'));
assert.ok(!original.includes('k4ahGeometry'));
fs.rmSync(to,{recursive:true,force:true});fs.cpSync(from,to,{recursive:true});
fs.writeFileSync(path.join(to,'drive3d.mjs'),script,'utf8');
assert.equal(fs.readFileSync(path.join(from,'drive3d.mjs'),'utf8'),original);
console.log('K4AH_READ_ONLY_ORIGINAL_B51_CAMERA_OBB_GEOMETRY_BUILT',JSON.stringify({
 sourceBlob:blob,sourceRendererImmutable:true,nativePhysicsCameraUnmodified:true,
 originalPhysicalOBBFunction:true,originalCollisionFunctionReadOnly:true,
 newModels:0,newColliders:0,art:'NOT_TESTED_HOLD'}));

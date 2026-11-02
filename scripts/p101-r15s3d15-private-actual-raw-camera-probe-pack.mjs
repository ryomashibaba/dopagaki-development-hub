/**
 * R15S3D15 source-native original-camera probe (private clone ONLY).
 * Original real drive3d viewForPose() vectors without changing geometry,
 * camera, native 240Hz physics, gameplay controls, Gold, or release.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=process.cwd(),privateDir=path.join(root,'dist-private');
const original=path.join(privateDir,'r15s3d14r1');
const target=path.join(privateDir,'r15s3d15');
assert.ok(fs.existsSync(path.join(original,'drive3d.mjs')));
fs.rmSync(target,{recursive:true,force:true});fs.cpSync(original,target,{recursive:true});
const src=path.join(target,'drive3d.mjs');let s=fs.readFileSync(src,'utf8');
const anchor=' const view=viewForPose(pose,cameraState);';
assert.equal(s.split(anchor).length,2);
const probe=[
' // R15S3D15 observational camera evidence, not new controls or rendering.',
' canvas.dataset.r15s3d15ActualCameraEye=JSON.stringify(view.eye);',
' canvas.dataset.r15s3d15ActualCameraFront=JSON.stringify(view.front);',
' canvas.dataset.r15s3d15ActualCameraRight=JSON.stringify(view.right);',
' canvas.dataset.r15s3d15ActualCameraUp=JSON.stringify(view.up);',
' canvas.dataset.r15s3d15ActualNativePose=JSON.stringify(pose.position);',
" canvas.dataset.r15s3d15OriginalWebGL='true';"
].join('\n');
s=s.replace(anchor,anchor+'\n'+probe);fs.writeFileSync(src,s);
const html=path.join(target,'index.html'),h=fs.readFileSync(html,'utf8');
fs.writeFileSync(html,h.replace('R15S3D14R1 PRIVATE','R15S3D15 ORIGINAL-CAMERA AUDIT PRIVATE'));
assert.ok(!fs.readFileSync(path.join(original,'drive3d.mjs'),'utf8').includes('r15s3d15ActualCameraEye'));
assert.ok(!fs.readFileSync(path.join(privateDir,'drive3d','drive3d.mjs'),'utf8').includes('r15s3d15ActualCameraEye'));
console.log('R15S3D15_PRIVATE_SOURCE_CAMERA_PROBE_READY',JSON.stringify({actualOriginalViewForPose:true,noncollisionOpticsOnly:true,publicGameUntouched:true}));

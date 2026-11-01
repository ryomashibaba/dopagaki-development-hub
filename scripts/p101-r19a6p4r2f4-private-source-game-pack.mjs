/** R19 A6 P4 source-native private WebGL2 pack for genuine Blender GLBs.
 * Five source-pinned real Blender editable district meshes, no physics/colliders.
 * Previous P2 and original game are UNMODIFIED. ART is unapproved.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {verifySourceOfBlenderEdit,unpackBlenderEditedGLB} from './p101-r19a6p1-read-blender-glb.mjs';
import {bakeR2F4CFlatNormals} from './p101-r19a6p4r2f4c-normal-bake.mjs';
import {buildR2F4DNormals} from './p101-r19a6p4r2f4d-gpu-normal-layout.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const original=path.join(root,'dist-private/r19a6');
const dir=path.join(root,'dist-private/r19a6p4r2f4');
const src=path.join(root,'r19-evidence/r19a6p4r2f4');
const shadedDir=path.join(root,'dist-private/r19a6p4r2f4shade');
const gpuDir=path.join(root,'dist-private/r19a6p4r2f4gpu');
fs.rmSync(shadedDir,{recursive:true,force:true});
fs.cpSync(original,shadedDir,{recursive:true});
fs.rmSync(gpuDir,{recursive:true,force:true});
fs.cpSync(original,gpuDir,{recursive:true});
const lightingStudies={schema:'dopagaki.r2f4c-private-normal-bake-comparison/1',
 researchOnly:true,immutableShader:true,PBRImplemented:false,
 originalGamePhysicsModified:false,originalGameStageModified:false,
 sourceBlob:'af076d67492a677d2235e4730aef8cdf4808e106',
 modes:{}};
assert.ok(fs.existsSync(path.join(original,'drive3d.mjs')),'requires original A6 pinned GLB private renderer');
fs.rmSync(dir,{recursive:true,force:true});fs.cpSync(original,dir,{recursive:true});
const manifest={schema:'dopagaki.r19a6p4r2f4-original-source-unified-urban-private/1',
 originalSourceBlob:'af076d67492a677d2235e4730aef8cdf4808e106',
 sourceB48:7,sourceB51:28,newColliders:0,privateOnly:true,
 ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',RELEASE:'HOLD',modes:{}};
for(const mode of ['ultra','control']){
 const report=JSON.parse(fs.readFileSync(path.join(src,'P4R2F4_'+mode+'_blender_report.json'),'utf8'));
 assert.equal(verifySourceOfBlenderEdit(report),true);
 assert.equal(report.schema,'dopagaki.r19a6p4r2f4-connected-street-urban-district/1');
 assert.equal(report.originalSourceBlob,manifest.originalSourceBlob);
 assert.equal(report.districts.length,5);
 assert.deepEqual(report.districts.map(d=>d.roadsidePublicFacilities.length),[1,1,0,0,0]);
 assert.ok(report.districts.slice(0,2).every(d=>
  d.roadsidePublicFacilities[0].interiorOpenGalleries===2 &&
  d.roadsidePublicFacilities[0].visibleRearMarketBays===3 &&
  d.roadsidePublicFacilities[0].fullWidthOverEntranceRoofPresent===false &&
  d.roadsidePublicFacilities[0].entranceSightlineWidthM>=18 &&
  d.roadsidePublicFacilities[0].interiorPublicAccessCertified===false &&
  d.roadsidePublicFacilities[0].actualReal3DNewVertexCount>100 &&
  d.roadsidePublicFacilities[0].projectedFrustumRectangleAreaPixels>3000 &&
  d.roadsidePublicFacilities[0].noncollidingArt===true &&
  d.roadsidePublicFacilities[0].staticSourceB48TriangleIntersections==='NOT_VERIFIED'));
 assert.deepEqual(report.districts.map(x=>x.heroOpenSkySlots),[1,1,1,0,0]);
 assert.ok(report.districts.slice(0,3).every(x=>
  Number.isInteger(x.heroFormIndexChosenByOriginalCamera) &&
  x.heroProjectedCandidateAreaNDCOnly[x.heroFormIndexChosenByOriginalCamera]>0));

 assert.deepEqual(report.districts.map(x=>x.publicStairMasses),[4,4,4,0,0]);
 assert.ok(report.districts.every(x=>x.actualHumanPathVerified===false));
 assert.ok(report.districts.slice(0,3).every(x=>
  x.civicGroundRealVolumeModules===4 &&
  x.civicUrbanRibButtresses===2 &&
  x.distinctMonolithicInhabitedWings===3 &&
  Number.isFinite(x.trueOriginalCameraPublicEntranceAzimuthRad) &&
  x.heroGeometryMode==='CAMERA_ORIENTED_TRUE_OPEN_PIAZZA'));
 assert.equal(report.architecturalLanguage,'R2F4_NATIVE_CAMERA_NEAR_ROAD_PUBLIC_EXCHANGE_CITY');
 assert.equal(report.designRevision,'R2F4B_TWO_OPEN_GALLERIES_EXPOSED_REAR_MARKET_ART_HOLD');
 assert.ok(report.districts.every(x=>x.actualOpenCourt===true&&x.publicWalkDeckGraph?.connected===true&&x.publicWalkDeckGraph?.maxJointGapM<1e-8&&x.programmedReal3DVolumes?.length>=3));
 assert.equal(report.districts.length,5);
 assert.equal(report.terrainSupportGate,'HOLD');
 assert.equal(report.sourceStreetHumanAccessVerified,false);
 assert.ok(report.districts.every(x=>x.urbanStreet?.segmentedStreetMeshes>=3&&
  x.urbanStreet?.humanScaleFrontageMasses>=1&&
  x.urbanStreet?.exactModuleSeamMaxM<1e-8&&
  x.urbanStreet?.originalRoadMeshClearance==='NOT_VERIFIED'));
 assert.equal(report.districts[0].urbanStreet.linksToSite,report.districts[1].siteID);
 assert.equal(report.districts[1].urbanStreet.linksToSite,report.districts[2].siteID);
 assert.equal(report.districts[2].urbanStreet.linksToSite,null);
 assert.equal(report.cameraProjectionOnlyNotActualB51RasterMask,true);
 assert.equal(report.globalB48B51ClearanceVerified,false);
 const image=unpackBlenderEditedGLB(fs.readFileSync(path.join(src,'P4R2F4_'+mode+'_edited.glb')),report);
 assert.equal(image.meshInstances,5);
 assert.ok(image.triangles>10566&&image.triangles<50000);
 const buf=Buffer.from(image.vertices.buffer,image.vertices.byteOffset,image.vertices.byteLength);
 fs.writeFileSync(path.join(dir,'R19A6_'+mode+'_GPU_VERTICES.bin'),buf);
 const shaded=bakeR2F4CFlatNormals(image.vertices);
 assert.equal(shaded.vertices.length,image.vertices.length);
 fs.writeFileSync(path.join(shadedDir,'R19A6_'+mode+'_GPU_VERTICES.bin'),
  Buffer.from(shaded.vertices.buffer,shaded.vertices.byteOffset,shaded.vertices.byteLength));
 lightingStudies.modes[mode]=shaded.stats;
 const normed=buildR2F4DNormals(image.vertices);
 const normalBuf=Buffer.from(normed.vertices.buffer,normed.vertices.byteOffset,normed.vertices.byteLength);
 if(!fs.existsSync(gpuDir))fs.mkdirSync(gpuDir,{recursive:true});
 fs.writeFileSync(path.join(gpuDir,'R19A6_'+mode+'_GPU_VERTICES.bin'),normalBuf);
 lightingStudies.modes[mode].gpuRealNormals=normed.report;

 manifest.modes[mode]={sourceGLBSHA:report.source_glb_sha256,
  editedGLBSHA:report.edited_glb_sha256,triangles:image.triangles,gpuBytes:buf.length,
  districtMeshes:image.meshInstances,verifiedPhysicsCollidersAdded:0,ART:'HOLD'};
}
let code=fs.readFileSync(path.join(dir,'drive3d.mjs'),'utf8');
assert.equal(code.split("get('r19a6')").length,2);
code=code.replace("get('r19a6')","get('r19a6p4r2f4')");
const pattern=/const expected=r19a6Kind==='ultra'\?\d+:\d+;/;
assert.ok(pattern.test(code));
code=code.replace(pattern,"const expected=r19a6Kind==='ultra'?"+
 manifest.modes.ultra.gpuBytes+":"+manifest.modes.control.gpuBytes+";");
assert.equal(code.split('PINNED_ORIGINAL_GLB_IMPORTED_ART_REJECT').length,2);
code=code.replace('PINNED_ORIGINAL_GLB_IMPORTED_ART_REJECT',
 'P4R2F4B_REAL_HOLLOW_SIDE_GALLERIES_ART_HOLD');
fs.writeFileSync(path.join(dir,'drive3d.mjs'),code);
let shadedCode=code;
assert.equal(shadedCode.split("get('r19a6p4r2f4')").length,2);
shadedCode=shadedCode.replace("get('r19a6p4r2f4')","get('r19a6p4r2f4shade')");
assert.equal(shadedCode.split("P4R2F4B_REAL_HOLLOW_SIDE_GALLERIES_ART_HOLD").length,2);
shadedCode=shadedCode.replace("P4R2F4B_REAL_HOLLOW_SIDE_GALLERIES_ART_HOLD",
 "P4R2F4C_NORMAL_BAKED_PRIVATE_ART_HOLD");
fs.writeFileSync(path.join(shadedDir,'drive3d.mjs'),shadedCode);
fs.writeFileSync(path.join(shadedDir,'R2F4C_PRIVATE_NORMAL_BAKE_MANIFEST.json'),
 JSON.stringify(lightingStudies,null,2)+'\n');
let gpuCode=code;
const r2dShaderPatches=[["'layout(location=0) in vec3 p;layout(location=1) in vec3 color;'","'layout(location=0) in vec3 p;layout(location=1) in vec3 color;layout(location=2) in vec3 r2dNormalIn;'"],["'out vec3 shade;out float haze;'","'out vec3 shade;out float haze;out vec3 r2dNormal;'"],["'gl_Position=vec4(1.35*x/aspect,1.35*y,1.00022*z-1.30014,z);shade=color;haze=clamp","'r2dNormal=vec3(c*r2dNormalIn.x+s*r2dNormalIn.z,r2dNormalIn.y,-s*r2dNormalIn.x+c*r2dNormalIn.z);gl_Position=vec4(1.35*x/aspect,1.35*y,1.00022*z-1.30014,z);shade=color;haze=clamp"],["'#version 300 es','precision highp float;in vec3 shade;in float haze;out vec4 outColor;'","'#version 300 es','precision highp float;in vec3 shade;in float haze;in vec3 r2dNormal;uniform float r2dLit;out vec4 outColor;'"],["'void main(){outColor=vec4(mix(shade,vec3(.019,.041,.083),haze),1.0);}'","'void main(){vec3 finalShade=shade;if(r2dLit>0.5){vec3 n=normalize(r2dNormal);vec3 key=normalize(vec3(-.44,.82,.36));vec3 fill=normalize(vec3(.48,.31,-.82));float kd=max(dot(n,key),0.);float ks=abs(dot(n,key));float fd=abs(dot(n,fill));finalShade=clamp(shade*(vec3(.29,.34,.41)+vec3(.83,.78,.69)*(kd*.58+ks*.42)+vec3(.17,.24,.34)*fd),0.,1.);}outColor=vec4(mix(finalShade,vec3(.019,.041,.083),haze),1.0);}'"],["'fogStrength','fogStart','fogSpan'])locations[name]","'fogStrength','fogStart','fogSpan','r2dLit'])locations[name]"],["function discard(m){if(m?.buffer)gl.deleteBuffer(m.buffer);}","function meshR2F4DLit(v){\n const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);\n gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(v),gl.STATIC_DRAW);\n return {buffer,count:v.length/9,r2dLit:true};\n}\nfunction discard(m){if(m?.buffer)gl.deleteBuffer(m.buffer);}"],["gl.bindBuffer(gl.ARRAY_BUFFER,m.buffer);gl.enableVertexAttribArray(0);gl.enableVertexAttribArray(1);","gl.bindBuffer(gl.ARRAY_BUFFER,m.buffer);gl.enableVertexAttribArray(0);gl.enableVertexAttribArray(1);gl.uniform1f(locations.r2dLit,m.r2dLit?1:0);if(m.r2dLit){gl.enableVertexAttribArray(2);gl.vertexAttribPointer(2,3,gl.FLOAT,false,36,24);}else{gl.disableVertexAttribArray(2);}"],["gl.vertexAttribPointer(0,3,gl.FLOAT,false,24,0);gl.vertexAttribPointer(1,3,gl.FLOAT,false,24,12);","gl.vertexAttribPointer(0,3,gl.FLOAT,false,m.r2dLit?36:24,0);gl.vertexAttribPointer(1,3,gl.FLOAT,false,m.r2dLit?36:24,12);"]];
for(const [before,after] of r2dShaderPatches){
 assert.equal(gpuCode.split(before).length,2,'R2F4-D source shader anchor drift '+before.slice(0,70));
 gpuCode=gpuCode.replace(before,after);
}
assert.equal(gpuCode.split("get('r19a6p4r2f4')").length,2);
gpuCode=gpuCode.replace("get('r19a6p4r2f4')","get('r19a6p4r2f4gpu')");
assert.equal(gpuCode.split("P4R2F4B_REAL_HOLLOW_SIDE_GALLERIES_ART_HOLD").length,2);
gpuCode=gpuCode.replace("P4R2F4B_REAL_HOLLOW_SIDE_GALLERIES_ART_HOLD",
 "P4R2F4D_GPU_NORMAL_LIGHTING_PRIVATE_ART_HOLD");
assert.equal(gpuCode.split('r19a6Mesh=mesh(raw);').length,2);
gpuCode=gpuCode.replace('r19a6Mesh=mesh(raw);','r19a6Mesh=meshR2F4DLit(raw);');
assert.equal(gpuCode.split("buffer.byteLength%72!==0").length,2);
gpuCode=gpuCode.replace("buffer.byteLength%72!==0","buffer.byteLength%108!==0");
const gpuBytes=Object.fromEntries(['ultra','control'].map(m=>[
 m,fs.statSync(path.join(gpuDir,'R19A6_'+m+'_GPU_VERTICES.bin')).size]));
assert.equal(gpuCode.split("const expected=r19a6Kind==='ultra'?"+manifest.modes.ultra.gpuBytes+":"+manifest.modes.control.gpuBytes+";").length,2);
gpuCode=gpuCode.replace("const expected=r19a6Kind==='ultra'?"+manifest.modes.ultra.gpuBytes+":"+manifest.modes.control.gpuBytes+";",
 "const expected=r19a6Kind==='ultra'?"+gpuBytes.ultra+":"+gpuBytes.control+";");
fs.copyFileSync(path.join(dir,'index.html'),path.join(gpuDir,'index.html'));
fs.writeFileSync(path.join(gpuDir,'drive3d.mjs'),gpuCode);
fs.writeFileSync(path.join(gpuDir,'R2F4D_PRIVATE_GPU_NORMALS_MANIFEST.json'),
 JSON.stringify({schema:'dopagaki.r2f4d-private-gpu-normal-light/1',
 originalSourceBlob:manifest.originalSourceBlob,
 noPBR:true,privateShaderOnly:true,originalGameUnmodified:true,
 originalMeshPositionAndColorBitIdentical:true,newColliders:0,
 lighting:lightingStudies.modes},null,2)+'\n');

assert.ok(!fs.readFileSync(path.join(original,'drive3d.mjs'),'utf8').includes("get('r19a6p4r2f4')"));
fs.writeFileSync(path.join(dir,'P4R2F4_EDITABLE_BLENDER_PRIVATE_GLB_MANIFEST.json'),
 JSON.stringify(manifest,null,2)+'\n');
console.log('R19A6P4R2F4_GENUINE_BLENDER_FIVE_DISTRICTS_WEBGL2_PRIVATE',JSON.stringify(manifest));

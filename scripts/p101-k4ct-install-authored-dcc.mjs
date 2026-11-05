/** Install REAL Blender-authored, editable, noncolliding scene to the isolated K4CT
 * original WebGL2 game's visual mesh input. Physics, source Camera, native Runner,
 * original 28 B51, all seven B48, production and PR #46 untouched.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const out=path.resolve('test-results/k4ct-contact-retry');
const dcc=JSON.parse(fs.readFileSync(path.join(out,'K4CT_DCC_BLENDER_TO_NATIVE_GEOMETRY.json'),'utf8'));
const stage=JSON.parse(fs.readFileSync('dist-private/generated/K4CT_TWO_REAL_B51_NATIVE_CHOICE_PRIVATE.json','utf8'));
assert.equal(dcc.schema,'k4ct-blender-authored-true-source-integrated-scene/1');
assert.ok(fs.existsSync(path.join(out,'K4CT_EDITABLE_SOURCE_ALIGNED_TIDAL_SPILLWAY_ART_REJECT.blend')));
assert.ok(dcc.triangles>2500&&dcc.vertices.length===dcc.triangles*18);
assert.ok(dcc.vertices.every(Number.isFinite));
assert.equal(dcc.sourcePhysicalRoad5SHA256,'4957a0e1ffb1a394c4bbaa2c502caad3fdec219c9713073f5236d7bbb6ab4e2b');
assert.equal(dcc.newColliders,0);
assert.equal(stage.surfaces.length,7);
assert.equal(stage.movingObstacles.length,28);
assert.ok(stage.stageForge.k4ctPrivate);
const target=path.resolve('dist-private/k4ct'),file=path.join(target,'drive3d.mjs');
let js=fs.readFileSync(file,'utf8');
const replace=(needle,value)=>{
 assert.equal(js.split(needle).length,2,'original K4CT renderer anchor not unique: '+needle.slice(0,120));
 js=js.replace(needle,value);
};
const imports="import {readK4CTTwoTrueB51,formatK4CTNativeDualCue} from './k4ct-dual-real-b51-decision.mjs';";
replace(imports,imports+"\nimport {K4CT_DCC_VERTICES,K4CT_DCC_TRIANGLES} from './k4ct-dcc-world-geometry.mjs';");
replace('let k4cqSceneMesh=null;', 'let k4ctDccMesh=null;\nlet k4cqSceneMesh=null;');
const buildAnchor="}else canvas.dataset.k4cqScene='off';";
replace(buildAnchor,buildAnchor+"\n"+
 "discard(k4ctDccMesh);k4ctDccMesh=null;"+
 "if(stage.stageForge?.k4ctPrivate){"+
 " if(stage.surfaces.length!==7||stage.movingObstacles.length!==28||"+
 " stage.stageForge.k4ctPrivate.newColliders!==0)throw Error('K4CT DCC source physical protection failed');"+
 " k4ctDccMesh=mesh(K4CT_DCC_VERTICES);"+
 " canvas.dataset.k4ctNativeDccTriangles=String(K4CT_DCC_TRIANGLES);"+
 " canvas.dataset.k4ctNativeDcc='GENUINE_BLENDER_EDITABLE_NONCOLLIDING';"+
 "}else{canvas.dataset.k4ctNativeDccTriangles='0';canvas.dataset.k4ctNativeDcc='off';}");
replace('if(k4cqSceneMesh){draw(k4cqSceneMesh);}',
 'if(k4cqSceneMesh&&!k4ctDccMesh){draw(k4cqSceneMesh);}');
// PRIVATE K4CT only. B48 original physics/mesh is drawn normally, then
// true Blender-authored noncolliding skin replaces legacy saturated striping.
// Machine B51, hazard signs, camera, input and CCD remain original.
const oldRoadVisual="draw(roads);draw(g4e7pQuietMesh||(g4e7kUi?.quiet&&g4e7kQuietMesh?g4e7kQuietMesh:a13RoadArtMesh));if(g4e7iUi?.active&&g4e7iContour?.active)draw(g4e7iMesh);if(g4e7cCueActive)draw(g4e7cCueMesh);draw(g4e7xCueMesh);draw(g4e7zCueMesh);draw(w9c1MarkMesh);draw(p100RoadRead);draw(p101B5RoadOptic);draw(lines,[0,0,0],[1,1,1],0,gl.LINES);";
replace(oldRoadVisual,"draw(roads);if(k4ctDccMesh){draw(k4ctDccMesh);canvas.dataset.k4ctRoadArtMode='ORIGINAL_B48_PLUS_DCC_CONFORMAL';}else{"+oldRoadVisual.slice('draw(roads);'.length)+"}");

const moduleFile=path.join(target,'k4ct-dcc-world-geometry.mjs');
// Isolated K4CT color mood; this does not mutate the original WebGL source.
replace("gl.clearColor(.019,.041,.083,1);","gl.clearColor(.115,.168,.192,1);");
replace("vec3(.019,.041,.083),haze","vec3(.115,.168,.192),haze");

const raw=JSON.stringify(dcc.vertices);
fs.writeFileSync(moduleFile,
 '/** REAL Blender-author output, from editable .blend. PRIVATE game artwork only, no colliders. */\n'+
 'export const K4CT_DCC_TRIANGLES='+dcc.triangles+';\n'+
 'export const K4CT_DCC_VERTICES='+raw+';\n');
fs.writeFileSync(file,js);
assert.ok(!fs.readFileSync('dist-private/k4cs/drive3d.mjs','utf8').includes('k4ctDccMesh'));
assert.ok(!fs.readFileSync('dist-private/drive3d/drive3d.mjs','utf8').includes('k4ctDccMesh'));
const audit={schema:'k4ct-real-blender-to-native-webgl2-integrated-v1',
 researchOnly:true,createdViaRealBlender:true,editableBlend:true,
 newWebGLNonCollidingTriangles:dcc.triangles,
 originalRoads:stage.surfaces.length,originalMovingB51:stage.movingObstacles.length,
 originalSourceBlob:stage.stageForge.k4ctPrivate.originalGameBlob,
 sameSourcePhysicalRoad5SHA256:dcc.sourcePhysicalRoad5SHA256,
 sourceArtVerticesSHA256:crypto.createHash('sha256').update(raw).digest('hex'),
 webGLGameDisplayTested:false,originalGameCameraAndSolverUntouched:true,
 extraCollisionSolids:0,formalART:0,slope2DNAmeters:0,ART:'REJECT',HUMAN:'HOLD',
 SAT:'HOLD',CCD:'HOLD',FPS:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'};
fs.writeFileSync(path.join(out,'K4CT_BLENDER_TO_ORIGINAL_WEBGL2_INSTALL_AUDIT.json'),JSON.stringify(audit,null,2)+'\n');
console.log('K4CT_ACTUAL_DCC_AUTHORED_WORLD_IN_NATIVE_GAME_READY',JSON.stringify(audit));

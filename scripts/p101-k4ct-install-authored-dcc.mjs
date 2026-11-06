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
replace('let k4cqSceneMesh=null;', 'let k4ctDccMesh=null;\nlet k4ctResearchB51Meshes={};\nwindow.__k4ctVisualABMode=\'R7C_MATERIAL\';\nlet k4cqSceneMesh=null;');
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


/* R6 read-only visual layer isolation, never changes true B51 or Runner.
   LEGACY = old monumental skyline/A13/guides; NO_A13 = old minus A13;
   R6 = authored DCC + original B51 only, with legacy decorative clutter off. */
replace("if(megaEnabled&&g4e7yScene!=='open'){draw(megaWorld);draw(g5bSceneryMesh);}",
 "if((!k4ctDccMesh||!['R6','R7_NO_SCENERY','R7_DCC'].includes(window.__k4ctVisualABMode))&&megaEnabled&&g4e7yScene!=='open'){draw(megaWorld);draw(g5bSceneryMesh);}");
replace("if(g4e7yScene!=='open')draw(g4dSkywayMesh);",
 "if((!k4ctDccMesh||!['R6','R7_NO_SCENERY','R7_DCC'].includes(window.__k4ctVisualABMode))&&g4e7yScene!=='open')draw(g4dSkywayMesh);");
replace("draw(a13ArchMesh);if(g4e7yScene!=='open')draw(g4e7sShardMesh);",
 "if(!k4ctDccMesh||window.__k4ctVisualABMode==='LEGACY')draw(a13ArchMesh);if(g4e7yScene!=='open')draw(g4e7sShardMesh);");
replace("draw(approachBeacons,[0,0,0],[1,1,1],0,gl.LINES);",
 "if(!k4ctDccMesh||!['R6','R7_NO_SCENERY','R7_DCC'].includes(window.__k4ctVisualABMode))draw(approachBeacons,[0,0,0],[1,1,1],0,gl.LINES);");
replace("for(const guide of guideMeshes)draw(guide.mesh,[0,0,0],[1,1,1],0,gl.LINES);",
 "if(!k4ctDccMesh||!['R6','R7_NO_SCENERY','R7_DCC'].includes(window.__k4ctVisualABMode))for(const guide of guideMeshes)draw(guide.mesh,[0,0,0],[1,1,1],0,gl.LINES);");
replace("draw(roads);if(k4ctDccMesh){draw(k4ctDccMesh);",
 "if(k4ctDccMesh)canvas.dataset.k4ctVisualABMode=window.__k4ctVisualABMode||'R7_DCC';\n draw(roads);if(k4ctDccMesh){if(window.__k4ctVisualABMode!=='R7_NO_SCENERY')draw(k4ctDccMesh);");
replace("k4ctPanel.textContent=formatK4CTNativeDualCue(dual);",
 "k4ctPanel.textContent=formatK4CTNativeDualCue(dual);"+
 "const oldCue=document.getElementById('machineCue');"+
 "if(oldCue){oldCue.style.display='none';canvas.dataset.k4ctResearchRedundantCue='hidden-dual-original-B51-retained';}");


/* R7 true camera provenance: original source 28 moving B51 always drawn.
 * A/B changes only existing noncolliding scenery and Blender-drawn environment. */
replace("if(g4e7yScene!=='open')draw(scenery);",
 "if(!k4ctDccMesh||!['R7_NO_SCENERY','R7_DCC'].includes(window.__k4ctVisualABMode))draw(scenery);");
replace("draw(g4e7adCityMesh);",
 "if(!k4ctDccMesh||!['R7_NO_SCENERY','R7_DCC'].includes(window.__k4ctVisualABMode))draw(g4e7adCityMesh);");


/* K4CT R7C research-only marine industrial body material.
 * Every XYZ triangle remains byte-identical to the source opaque B51 hull.
 * Collision B51×28, movingPose, original Camera and 240Hz untouched. */
replace("for(const type of ['slider','rotator','piston'])for(const mode of ['fail','bounce','push'])\n   {machineMeshes[type+':'+mode]=mesh(obstacleBodyVertices(type,mode));\n    a13MachineMeshes[type+':'+mode]=mesh(a13MachineBodyVertices(type,mode));}",
"for(const type of ['slider','rotator','piston'])for(const mode of ['fail','bounce','push']){"+
" const key=type+':'+mode;"+
" const a=a13MachineBodyVertices(type,mode),base=obstacleBodyVertices(type,mode);"+
" machineMeshes[key]=mesh(base);a13MachineMeshes[key]=mesh(a);"+
" const toned=(src)=>{const out=src.slice();"+
"  const palettes={fail:[[.14,.19,.20],[.80,.23,.16],[.53,.31,.24]],"+
"    bounce:[[.20,.22,.21],[.89,.57,.18],[.57,.42,.27]],"+
"    push:[[.15,.22,.24],[.20,.75,.71],[.34,.53,.53]]};"+
"  const p=palettes[mode];"+
"  for(let i=0;i<src.length;i+=6){const rgb=src.slice(i+3,i+6);"+
"   const max=Math.max(...rgb),min=Math.min(...rgb);"+
"   const target=max<.36?p[0]:(max-min>.28||max>.8?p[1]:p[2]);"+
"   for(let j=0;j<3;j++)out[i+3+j]=target[j];}"+
"  if(out.length!==src.length||out.some((v,i)=>i%6<3&&v!==src[i]))"+
"    throw Error('K4CT source B51 hull geometry invariant violated');"+
"  return out;};"+
" k4ctResearchB51Meshes[key]={a13:mesh(toned(a)),early:mesh(toned(base))};"+
"}");
replace("draw(o.id.startsWith('a13-machine-')?a13MachineMeshes[key]:machineMeshes[key],obstaclePose.center,obstaclePose.halfSize.map(x=>2*x),obstaclePose.yawRadians);",
 "const materialCandidate=Boolean(k4ctDccMesh&&doc.stageForge?.k4ctPrivate&&"+
 " window.__k4ctVisualABMode==='R7C_MATERIAL');"+
 "const a13=o.id.startsWith('a13-machine-');"+
 "const originalBody=a13?a13MachineMeshes[key]:machineMeshes[key];"+
 "const candidateBody=k4ctResearchB51Meshes[key];"+
 "const selected=materialCandidate?(a13?candidateBody.a13:candidateBody.early):originalBody;"+
 "draw(selected,obstaclePose.center,obstaclePose.halfSize.map(x=>2*x),obstaclePose.yawRadians);"+
 "if(k4ctDccMesh)canvas.dataset.k4ctNativeB51MaterialMode=materialCandidate?"+
 " 'RESEARCH_RECOLOR_SOURCE_OPAQUE_HULL_IDENTICAL_XYZ':'ORIGINAL_SOURCE_VISUAL';");

const moduleFile=path.join(target,'k4ct-dcc-world-geometry.mjs');
// Isolated K4CT color mood; this does not mutate the original WebGL source.
replace("gl.clearColor(.019,.041,.083,1);","gl.clearColor(.115,.168,.192,1);");
replace("vec3(.019,.041,.083),haze","vec3(.115,.168,.192),haze");

// Remove the previous P97 neon decorative gates and automated flow-trail
// visuals ONLY in this isolated K4CT DCC renderer. Preserve the real B51
// meshes, native moving collision, original warning calculation and A/D input.
// The new rock-anchored physical-station beacons supply world-scale context.
replace('draw(hazardGateSolidMesh);',
 "if(!k4ctDccMesh)draw(hazardGateSolidMesh);");
replace('draw(hazardGateMesh,[0,0,0],[1,1,1],0,gl.LINES);',
 "if(!k4ctDccMesh)draw(hazardGateMesh,[0,0,0],[1,1,1],0,gl.LINES);");
replace('draw(flowRoads,[0,0,0],[1,1,1],0,gl.LINES);',
 "if(!k4ctDccMesh)draw(flowRoads,[0,0,0],[1,1,1],0,gl.LINES);");

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

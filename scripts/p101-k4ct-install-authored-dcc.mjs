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
replace('let k4cqSceneMesh=null;', "let k4ctDccMesh=null;\nlet k4ctResearchB51Meshes={};\nlet k4ctFixtureIdentityTagMesh=null;\n\nfunction k4ctIndustrialMaterialOnly(src,mode){\n const out=src.slice();\n const palettes={\n fail:[[.14,.19,.20],[.80,.23,.16],[.53,.31,.24]],\n bounce:[[.20,.22,.21],[.89,.57,.18],[.57,.42,.27]],\n push:[[.15,.22,.24],[.20,.75,.71],[.34,.53,.53]]\n };\n const p=palettes[mode];\n for(let i=0;i<src.length;i+=6){\n  const rgb=src.slice(i+3,i+6),max=Math.max(...rgb),min=Math.min(...rgb);\n  const target=max<.36?p[0]:(max-min>.28||max>.8?p[1]:p[2]);\n  for(let j=0;j<3;j++)out[i+3+j]=target[j];\n }\n if(out.length!==src.length||out.some((v,i)=>i%6<3&&v!==src[i]))throw Error('B51 geometry modified');\n return out;\n}\n\nwindow.__k4ctVisualABMode='R7C_MATERIAL';\nlet k4cqSceneMesh=null;");
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


/* R7C install candidate material to ORIGINAL opaque mesh by a UNIQUE
 * one-line source anchor. Strict XYZ vertex equality is checked at runtime.
 * Stage-only research presentation; source visuals still available for A/B. */
replace("a13MachineMeshes[type+':'+mode]=mesh(a13MachineBodyVertices(type,mode));",
 "a13MachineMeshes[type+':'+mode]=mesh(a13MachineBodyVertices(type,mode));"+
 " k4ctResearchB51Meshes[type+':'+mode]={"+
 " a13:mesh(k4ctIndustrialMaterialOnly(a13MachineBodyVertices(type,mode),mode)),"+
 " early:mesh(k4ctIndustrialMaterialOnly(obstacleBodyVertices(type,mode),mode))};");
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


/* R7D: source fixture diagnostic: visual triangles/XYZ/OBB retained.
 * Only paused fixture colors turn magenta, not gameplay or ART. */
replace("for(const f of stage.fixtures??[]){",
 "const k4ctFixtureStart=vertex.length;for(const f of stage.fixtures??[]){");
replace("roads=mesh(vertex);lines=mesh(wire);",
 "roads=mesh(vertex);lines=mesh(wire);"+
 "const tagged=vertex.slice();"+
 "if(k4ctFixtureStart%6||tagged.length%6)throw Error('fixture geometry length invalid');"+
 "for(let i=k4ctFixtureStart;i<tagged.length;i+=6){"+
 " tagged[i+3]=.96;tagged[i+4]=.08;tagged[i+5]=.80;}"+
 "if(tagged.some((v,i)=>i%6<3&&v!==vertex[i]))throw Error('fixture XYZ changed');"+
 "discard(k4ctFixtureIdentityTagMesh);k4ctFixtureIdentityTagMesh=mesh(tagged);"+
 "canvas.dataset.k4ctFixtureSourceCount=String(stage.fixtures?.length||0);");
replace("draw(roads);if(k4ctDccMesh){if(window.__k4ctVisualABMode!=='R7_NO_SCENERY')draw(k4ctDccMesh);",
 "draw(k4ctDccMesh&&window.__k4ctVisualABMode==='R7D_TAG_FIXTURES'?"+
 "k4ctFixtureIdentityTagMesh:roads);"+
 "if(k4ctDccMesh){if(window.__k4ctVisualABMode!=='R7_NO_SCENERY')draw(k4ctDccMesh);");


/* R8 DIAGNOSTIC: same paused native source / no collision or camera changes.
 * Shader-only magenta render provenance: B48 ROAD, Blender DCC, all native
 * B51 opaque geometry, and OTHER preexisting visible meshes. Suppress NOTHING.
 * Never adopt tagged materials, never call tagged snapshots ART or HUMAN PASS.
 * Uniform enabled on private scene only; SOURCE renderer remains unmodified. */
replace("precision highp float;in vec3 shade;in float haze;out vec4 outColor;",
 "precision highp float;in vec3 shade;in float haze;uniform float k4ctProbeOn;uniform vec3 k4ctProbeRGB;out vec4 outColor;");
replace("outColor=vec4(mix(shade,vec3(.019,.041,.083),haze),1.0);",
 "outColor=vec4(mix(mix(shade,k4ctProbeRGB,k4ctProbeOn),vec3(.019,.041,.083),haze),1.0);");
replace("for(const name of ['eye','camRight','camUp','camFront','translation','scale','yaw','aspect','fogStrength','fogStart','fogSpan'])locations[name]=gl.getUniformLocation(program,name);",
 "for(const name of ['eye','camRight','camUp','camFront','translation','scale','yaw','aspect','fogStrength','fogStart','fogSpan'])locations[name]=gl.getUniformLocation(program,name);"+
 " locations.k4ctProbeOn=gl.getUniformLocation(program,'k4ctProbeOn');"+
 " locations.k4ctProbeRGB=gl.getUniformLocation(program,'k4ctProbeRGB');");
replace("  gl.drawArrays(primitive,0,m.count);",
 "  if(k4ctDccMesh&&doc?.stageForge?.k4ctPrivate){"+
 "   const isB51=Object.values(machineMeshes).includes(m)||Object.values(a13MachineMeshes).includes(m);"+
 "   const group=m===roads||m===k4ctFixtureIdentityTagMesh?'ROAD':"+
 "    m===k4ctDccMesh?'DCC':isB51?'B51':'OTHER';"+
 "   const requested=window.__k4ctRenderAttribution||'BASE';"+
 "   if(!['BASE','ROAD','DCC','B51','OTHER'].includes(requested))throw Error('K4CT attribution mode invalid');"+
 "   gl.uniform1f(locations.k4ctProbeOn,requested===group?1:0);"+
 "   gl.uniform3fv(locations.k4ctProbeRGB,[1,.015,.85]);"+
 "   canvas.dataset.k4ctAttributionMode=requested;"+
 "  }else gl.uniform1f(locations.k4ctProbeOn,0);"+
 "  gl.drawArrays(primitive,0,m.count);");

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

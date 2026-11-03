/**
 * K4AS: clone K4AR's already isolated K4AQ native game renderer; add opt-in
 * visual-only material strategy for the authentic Road5 screen.
 * No production WebGL, B48/B51, ball, camera or source physics writes.
 */
import fs from 'node:fs';import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const from=path.join(root,'dist-private/r19a6p4r2f5k4aq');
const to=path.join(root,'dist-private/r19a6p4r2f5k4as');
assert.ok(fs.existsSync(path.join(from,'drive3d.mjs')),'K4AS requires K4AR source-native K4AQ private pack');
const untouched=fs.readFileSync(path.join(from,'drive3d.mjs'),'utf8');
assert.ok(untouched.includes('k4aqSkyOnly')&&untouched.includes('k4adMeasure'));
assert.ok(!untouched.includes('k4asRoadMesh'));
let src=untouched,patches=0;
function patch(needle,replace){
 assert.equal(src.split(needle).length,2,'K4AS original native paint anchor drift '+needle.slice(0,95));
 src=src.replace(needle,replace);patches++;
}
const imp="import {buildK4AQRoad5Art,createK4AQScene,renderK4AQScene,releaseK4AQScene} from './p101-k4aq-road5-civic-rift-material-art.mjs';";
patch(imp,imp+"\nimport {k4asMatteRoadSurface,k4asQuietRoadArmour,k4asEdgeWayfinding,k4asMachineryMaterial,k4asScreenMaterialEligibility,k4asIsActualRoad5Visible} from './p101-k4as-road5-original-screen-material-system.mjs';");
patch("let k4aqScene=null;",
 "let k4aqScene=null;\n"+
 "const k4asEnabled=k4aqEnabled&&new URLSearchParams(location.search).get('k4as')==='materials';\n"+
 "let k4asRoadMesh=null,k4asLinesMesh=null,k4asRoadArtMesh=null;\n"+
 "const k4asMachineMeshes={},k4asA13MachineMeshes={};");
patch("a13MachineMeshes[type+':'+mode]=mesh(a13MachineBodyVertices(type,mode));}",
 "a13MachineMeshes[type+':'+mode]=mesh(a13MachineBodyVertices(type,mode));\n"+
 "if(k4asEnabled){\n"+
 "k4asMachineMeshes[type+':'+mode]=mesh(k4asMachineryMaterial(obstacleBodyVertices(type,mode),mode).vertices);\n"+
 "k4asA13MachineMeshes[type+':'+mode]=mesh(k4asMachineryMaterial(a13MachineBodyVertices(type,mode),mode).vertices);\n"+
 "}}");
patch("function buildVisual(stage){",
 "function buildVisual(stage){\n"+
 " if(k4asEnabled&&!k4asScreenMaterialEligibility(stage))throw Error('K4AS PROTECTED ACTUAL ROAD5 MISMATCH');\n"+
 " discard(k4asRoadMesh);discard(k4asLinesMesh);discard(k4asRoadArtMesh);\n"+
 " k4asRoadMesh=null;k4asLinesMesh=null;k4asRoadArtMesh=null;\n"+
 " canvas.dataset.k4asMode=k4asEnabled?'PRIVATE_ROAD5_ONLY_MATERIAL_CANDIDATE_HOLD':'OFF';\n"+
 " canvas.dataset.k4asGeometryModified='false';canvas.dataset.k4asNewColliders='0';");
patch("roads=mesh(vertex);lines=mesh(wire);",
 "roads=mesh(vertex);lines=mesh(wire);\n"+
 " if(k4asEnabled){\n"+
 " const base=k4asMatteRoadSurface(vertex),edge=k4asEdgeWayfinding(wire);\n"+
 " k4asRoadMesh=mesh(base.vertices);k4asLinesMesh=mesh(edge.vertices);\n"+
 " canvas.dataset.k4asBaseRecolored=String(base.changedVertices);\n"+
 " canvas.dataset.k4asEdgeRecolored=String(edge.changedVertices);\n"+
 " }");
patch("a13RoadArtMesh=mesh(art.vertices);",
 "a13RoadArtMesh=mesh(art.vertices);\n"+
 " if(k4asEnabled){\n"+
 " const roadArt=k4asQuietRoadArmour(art.vertices);\n"+
 " k4asRoadArtMesh=mesh(roadArt.vertices);\n"+
 " canvas.dataset.k4asArmourRecolored=String(roadArt.changedVertices);\n"+
 " }");
const roadDraw="draw(roads);draw(g4e7pQuietMesh||(g4e7kUi?.quiet&&g4e7kQuietMesh?g4e7kQuietMesh:a13RoadArtMesh));";
patch(roadDraw,
 "const k4asRoad5Active=k4asEnabled&&k4asIsActualRoad5Visible(runner);\n"+
 " canvas.dataset.k4asRendered=k4asRoad5Active?'true':'false';\n"+
 " draw(k4asRoad5Active?k4asRoadMesh:roads);\n"+
 " draw(k4asRoad5Active?k4asRoadArtMesh:(g4e7pQuietMesh||(g4e7kUi?.quiet&&g4e7kQuietMesh?g4e7kQuietMesh:a13RoadArtMesh)));");
patch("draw(lines,[0,0,0],[1,1,1],0,gl.LINES);",
 "draw(k4asRoad5Active?k4asLinesMesh:lines,[0,0,0],[1,1,1],0,gl.LINES);");
const originalMachine="draw(o.id.startsWith('a13-machine-')?a13MachineMeshes[key]:machineMeshes[key],obstaclePose.center,obstaclePose.halfSize.map(x=>2*x),obstaclePose.yawRadians);";
patch(originalMachine,
 "draw(k4asRoad5Active?(o.id.startsWith('a13-machine-')?k4asA13MachineMeshes[key]:k4asMachineMeshes[key]):(o.id.startsWith('a13-machine-')?a13MachineMeshes[key]:machineMeshes[key]),obstaclePose.center,obstaclePose.halfSize.map(x=>2*x),obstaclePose.yawRadians);");
assert.equal(patches,9);
fs.rmSync(to,{force:true,recursive:true});fs.cpSync(from,to,{recursive:true});
fs.copyFileSync(path.join(root,'web/p101-k4as-road5-original-screen-material-system.mjs'),
 path.join(to,'p101-k4as-road5-original-screen-material-system.mjs'));
fs.writeFileSync(path.join(to,'drive3d.mjs'),src,'utf8');
assert.equal(fs.readFileSync(path.join(from,'drive3d.mjs'),'utf8'),untouched);
console.log('K4AS_ORIGINAL_WEBGL2_ROAD5_ONLY_PALETTE_PACK_BUILT',JSON.stringify({
 patches,realB48:7,realB51:28,originalPhysicsModified:false,
 originalCameraModified:false,newColliders:0,ART:'NOT_TESTED_HOLD'
}));

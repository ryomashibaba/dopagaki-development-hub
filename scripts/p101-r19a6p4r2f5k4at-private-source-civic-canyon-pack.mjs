/** K4AT builder: only opt-in Road5 cinematic civic canyon. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const from=path.join(root,'dist-private/r19a6p4r2f5k4as');
const to=path.join(root,'dist-private/r19a6p4r2f5k4at');
assert.ok(fs.existsSync(path.join(from,'drive3d.mjs')),'Build K4AS isolated source first');
const original=fs.readFileSync(path.join(from,'drive3d.mjs'),'utf8');
assert.ok(original.includes('k4asRoad5Active')&&original.includes('r19a1OptIn'));
assert.ok(!original.includes('k4atCivicScene'));
let src=original,patchCount=0;
function patch(needle,replacement){
 assert.equal(src.split(needle).length,2,
  'K4AT native source render anchor has drifted: '+needle.slice(0,90));
 src=src.replace(needle,replacement);patchCount++;
}
const firstImport="import {buildK4AQRoad5Art,createK4AQScene,renderK4AQScene,releaseK4AQScene} from './p101-k4aq-road5-civic-rift-material-art.mjs';";
patch(firstImport,firstImport+
 "\nimport {buildK4ATCivicCanyon,buildK4ATInlaidRoad} from './p101-k4at-road5-sculpted-civic-canyon.mjs';");
const enabled="const k4asEnabled=k4aqEnabled&&new URLSearchParams(location.search).get('k4as')==='materials';";
patch(enabled,enabled+
 "\nconst k4atEnabled=k4asEnabled&&new URLSearchParams(location.search).get('k4at')==='on';\n"+
 "let k4atCivicScene=null,k4atSourceRoadInlay=null;");
patch('function buildVisual(stage){',
 "function buildVisual(stage){\n"+
 " if(k4atCivicScene)releaseK4AQScene(gl,k4atCivicScene);\n"+
 " discard(k4atSourceRoadInlay);k4atSourceRoadInlay=null;\n"+
 " const k4atArt=buildK4ATCivicCanyon(stage,sample,{enabled:k4atEnabled});\n"+
 " k4atCivicScene=k4atArt.active?createK4AQScene(gl,k4atArt):null;\n"+
 " canvas.dataset.k4atMode=k4atEnabled?'PRIVATE_SOURCE_CIVIC_SCULPTURE_ART_HOLD':'OFF';\n"+
 " canvas.dataset.k4atTriangles=String(k4atArt.triangles||0);\n"+
 " canvas.dataset.k4atAnchorU=String(k4atArt.anchorU||0);\n"+
 " canvas.dataset.k4atRoadName=k4atArt.sourceRoad||'OFF';\n"+
 " canvas.dataset.k4atNewColliders='0';\n canvas.dataset.k4atPhysicsChanged='false';");
patch("roads=mesh(vertex);lines=mesh(wire);",
 "roads=mesh(vertex);lines=mesh(wire);\n"+
 " if(k4atEnabled){\n"+
 " const k4atRoad=buildK4ATInlaidRoad(stage,sample,frame,{enabled:true});\n"+
 " k4atSourceRoadInlay=mesh(k4atRoad.vertices);\n"+
 " canvas.dataset.k4atInlayTriangles=String(k4atRoad.triangles);\n"+
 " }");
const oldRender="renderK4AQScene(gl,k4aqScene,view,w/h,{fogStrength:visibilityFx?1:0,architecture:!k4aqSkyOnly});";
patch(oldRender,
 "renderK4AQScene(gl,k4aqScene,view,w/h,{fogStrength:visibilityFx?1:0,architecture:!k4aqSkyOnly&&!k4atEnabled});\n"+
 " if(k4atEnabled)renderK4AQScene(gl,k4atCivicScene,view,w/h,{fogStrength:visibilityFx?1:0});");
const oldLines="draw(k4asRoad5Active?k4asLinesMesh:lines,[0,0,0],[1,1,1],0,gl.LINES);";
patch(oldLines,
 "draw(k4asRoad5Active&&k4atEnabled?k4atSourceRoadInlay:null);\n"+
 " draw(k4asRoad5Active?k4asLinesMesh:lines,[0,0,0],[1,1,1],0,gl.LINES);");
assert.equal(patchCount,6);
fs.rmSync(to,{force:true,recursive:true});
fs.cpSync(from,to,{recursive:true});
fs.copyFileSync(path.join(root,'web/p101-k4at-road5-sculpted-civic-canyon.mjs'),
 path.join(to,'p101-k4at-road5-sculpted-civic-canyon.mjs'));
fs.writeFileSync(path.join(to,'drive3d.mjs'),src);
assert.equal(fs.readFileSync(path.join(from,'drive3d.mjs'),'utf8'),original);
console.log('K4AT_NATIVE_SOURCE_ROAD5_SCULPTED_ART_CLONE_CREATED',JSON.stringify({
 patches:patchCount,source240Hz:true,sourceB48:7,sourceB51:28,
 originalGameFilesChanged:false,physicalCollidersAdded:0,ART:'NOT_TESTED_HOLD'}));

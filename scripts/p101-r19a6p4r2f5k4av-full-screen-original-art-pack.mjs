/**
 * K4AV FULL FRAME ART RESET (private WebGL2 only).
 * Composite one architectural world, not the old stack of art-rejected
 * giant diagonal beams. Native source ball/physics/OBB untouched.
 */
import fs from 'node:fs';import path from 'node:path';
import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const from=path.join(root,'dist-private/r19a6p4r2f5k4au');
const to=path.join(root,'dist-private/r19a6p4r2f5k4av');
assert.ok(fs.existsSync(path.join(from,'drive3d.mjs')),'Build isolated K4AU source first');
const original=fs.readFileSync(path.join(from,'drive3d.mjs'),'utf8');
assert.ok(original.includes('k4auLight')&&original.includes('k4atCivicScene'));
assert.ok(!original.includes('k4avWorld'));
let s=original,n=0;
function patch(old,newVal){
 assert.equal(s.split(old).length,2,
  'K4AV immutable source anchor count mismatch '+old.slice(0,100));
 s=s.replace(old,newVal);n++;
}
const imp="import {createK4AULight,renderK4AULitRoad,renderK4AULitB51,releaseK4AULight} from './p101-k4au-original-native-material-lighting.mjs';";
patch(imp,imp+
 "\nimport {buildK4AVRoad5Environment} from './p101-k4av-road5-full-screen-civic-environment.mjs';"+
 "\nimport {createK4AVAtmosphere,renderK4AVAtmosphere,releaseK4AVAtmosphere} from './p101-k4av-civic-basin-atmosphere.mjs';");
const flag="const k4auEnabled=k4atEnabled&&new URLSearchParams(location.search).get('k4au')==='on';";
patch(flag,flag+
 "\nconst k4avEnabled=k4auEnabled&&new URLSearchParams(location.search).get('k4av')==='on';"+
 "\nconst k4avCityEnabled=k4avEnabled&&new URLSearchParams(location.search).get('k4avArt')!=='off';\nlet k4avWorld=null,k4avSky=null;");
patch("function buildVisual(stage){",
 "function buildVisual(stage){\n"+
 " if(k4avWorld)releaseK4AQScene(gl,k4avWorld);\n"+
 " if(k4avSky)releaseK4AVAtmosphere(gl,k4avSky);\n"+
 " const k4avArt=buildK4AVRoad5Environment(stage,sample,{enabled:k4avCityEnabled});\n"+
 " k4avWorld=k4avArt.active?createK4AQScene(gl,k4avArt):null;\n"+
 " k4avSky=k4avEnabled?createK4AVAtmosphere(gl):null;\n"+
 " canvas.dataset.k4avMode=k4avEnabled?'PRIVATE_FULL_SCREEN_CIVIC_RESET_HOLD':'OFF';\n canvas.dataset.k4avCityEnabled=k4avCityEnabled?'true':'false';\n"+
 " canvas.dataset.k4avRoad5U=String(k4avArt.originalRoad5U||0);\n"+
 " canvas.dataset.k4avTriangles=String(k4avArt.triangles||0);\n"+
 " canvas.dataset.k4avEdgeSegments=String(k4avArt.visibleEdgeSegments||0);\n"+
 " canvas.dataset.k4avColliderWrites='0';\n"+
 " canvas.dataset.k4avSourceCameraModified='false';");
const prevRender="if(k4atEnabled)renderK4AQScene(gl,k4atCivicScene,view,w/h,{fogStrength:visibilityFx?1:0});";
patch(prevRender,
 "if(k4atEnabled&&!k4avEnabled)renderK4AQScene(gl,k4atCivicScene,view,w/h,{fogStrength:visibilityFx?1:0});\n"+
 " if(k4avEnabled){\n"+
 "  renderK4AVAtmosphere(gl,k4avSky,view,w/h);\n"+
 "  if(k4avCityEnabled)renderK4AQScene(gl,k4avWorld,view,w/h,{fogStrength:visibilityFx?1:0});\n"+
 " }");
const pArt="draw(k4asRoad5Active?k4asRoadArtMesh:(g4e7pQuietMesh||(g4e7kUi?.quiet&&g4e7kQuietMesh?g4e7kQuietMesh:a13RoadArtMesh)));";
patch(pArt,
 "if(!k4avEnabled){\n"+
 " draw(k4asRoad5Active?k4asRoadArtMesh:(g4e7pQuietMesh||(g4e7kUi?.quiet&&g4e7kQuietMesh?g4e7kQuietMesh:a13RoadArtMesh)));\n"+
 " }else{\n"+
 " // Art-only replacement: remove the REJECTED fluorescent scattered triangles;\n"+
 " // actual source B48 road skin, visible source hazard/edge guides, and all\n"+
 " // actual 28 animated moving hazard solids remain unchanged.\n"+
 " canvas.dataset.k4avOldA13Paint='OFF_NONCOLLIDING_VISUAL_LAYER';\n"+
 " }");
const inlay="draw(k4asRoad5Active&&k4atEnabled?k4atSourceRoadInlay:null);";
patch(inlay,"draw(k4asRoad5Active&&k4atEnabled&&!k4avEnabled?k4atSourceRoadInlay:null);");
assert.equal(n,6,'K4AV private source patch count');
fs.rmSync(to,{recursive:true,force:true});
fs.cpSync(from,to,{recursive:true});
for(const name of [
 'p101-k4av-road5-full-screen-civic-environment.mjs',
 'p101-k4av-civic-basin-atmosphere.mjs'
])fs.copyFileSync(path.join(root,'web',name),path.join(to,name));
fs.writeFileSync(path.join(to,'drive3d.mjs'),s);
assert.equal(fs.readFileSync(path.join(from,'drive3d.mjs'),'utf8'),original);
console.log('K4AV_FULL_FRAME_PRIVATE_SOURCE_ART_RESET_BUILT',JSON.stringify({
 sourceNativeHz:240,sourceB48:7,sourceB51:28,
 patchCount:n,physicsChanged:false,newColliders:0,
 priorK4AUPreserved:true,ART:'NOT_TESTED_HOLD',
 userConfirmationRequiredForWork:true
}));

/** K4AU opt-in original native source PBR-like surface material renderer. */
import fs from 'node:fs';import path from 'node:path';
import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const previous=path.join(root,'dist-private/r19a6p4r2f5k4at');
const next=path.join(root,'dist-private/r19a6p4r2f5k4au');
assert.ok(fs.existsSync(path.join(previous,'drive3d.mjs')),'Build native K4AT first');
const baseline=fs.readFileSync(path.join(previous,'drive3d.mjs'),'utf8');
assert.ok(baseline.includes('k4atCivicScene')&&baseline.includes('k4asRoad5Active'));
assert.ok(!baseline.includes('k4auLight'));
let code=baseline,changes=0;
function patch(original,newValue){
 assert.equal(code.split(original).length,2,
  'K4AU protected native render anchor mismatch '+original.slice(0,80));
 code=code.replace(original,newValue);changes++;
}
const sourceImport="import {buildK4ATCivicCanyon,buildK4ATInlaidRoad} from './p101-k4at-road5-sculpted-civic-canyon.mjs';";
patch(sourceImport,sourceImport+"\n"+
 "import {createK4AULight,renderK4AULitRoad,renderK4AULitB51,releaseK4AULight} from './p101-k4au-original-native-material-lighting.mjs';");
const enabled="const k4atEnabled=k4asEnabled&&new URLSearchParams(location.search).get('k4at')==='on';";
patch(enabled,enabled+"\n"+
 "const k4auEnabled=k4atEnabled&&new URLSearchParams(location.search).get('k4au')==='on';\n"+
 "let k4auLight=null;");
patch("function buildVisual(stage){",
 "function buildVisual(stage){\n"+
 " if(k4auEnabled&&!k4auLight)k4auLight=createK4AULight(gl);\n"+
 " canvas.dataset.k4auMode=k4auEnabled?'PRIVATE_ORIGINAL_SOURCE_LIT_ART_HOLD':'OFF';\n"+
 " canvas.dataset.k4auNewColliders='0';\n"+
 " canvas.dataset.k4auPhysicsModified='false';");
const road="draw(k4asRoad5Active?k4asRoadMesh:roads);";
patch(road,
 "canvas.dataset.k4auRendered=k4asRoad5Active&&k4auEnabled?'TRUE_SOURCE_MATERIALS':'OFF';\n"+
 "if(k4asRoad5Active&&k4auEnabled)\n"+
 " renderK4AULitRoad(gl,k4auLight,k4asRoadMesh,view,w/h,\n"+
 "  {enabled:visibilityFx,start:FOG_START_METERS,span:FOG_SPAN_METERS});\n"+
 "else draw(k4asRoad5Active?k4asRoadMesh:roads);");
const machine="draw(k4asRoad5Active?(o.id.startsWith('a13-machine-')?k4asA13MachineMeshes[key]:k4asMachineMeshes[key]):(o.id.startsWith('a13-machine-')?a13MachineMeshes[key]:machineMeshes[key]),obstaclePose.center,obstaclePose.halfSize.map(x=>2*x),obstaclePose.yawRadians);";
patch(machine,
 "if(k4asRoad5Active&&k4auEnabled){\n"+
 " const body=o.id.startsWith('a13-machine-')?k4asA13MachineMeshes[key]:k4asMachineMeshes[key];\n"+
 " renderK4AULitB51(gl,k4auLight,body,view,w/h,obstaclePose,\n"+
 "  o.collision?.mode||'fail',\n"+
 "  {enabled:visibilityFx,start:FOG_START_METERS,span:FOG_SPAN_METERS});\n"+
 "}else "+machine);
assert.equal(changes,5);
fs.rmSync(next,{recursive:true,force:true});
fs.cpSync(previous,next,{recursive:true});
fs.copyFileSync(path.join(root,'web/p101-k4au-original-native-material-lighting.mjs'),
 path.join(next,'p101-k4au-original-native-material-lighting.mjs'));
fs.writeFileSync(path.join(next,'drive3d.mjs'),code);
assert.equal(fs.readFileSync(path.join(previous,'drive3d.mjs'),'utf8'),baseline);
console.log('K4AU_TRUE_ORIGINAL_B48_B51_LIT_CLONE_BUILT',JSON.stringify({
 changes,materialOnly:true,originalCamera:true,nativeHz:240,
 originalB48:7,originalB51:28,newColliders:0,
 ART:'NOT_TESTED_HOLD',RELEASE:'HOLD'}));

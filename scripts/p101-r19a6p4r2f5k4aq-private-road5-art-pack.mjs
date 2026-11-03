/**
 * K4AQ: opt-in PRIVATE-only material-art variant on top of the exact
 * K4AD genuine native game camera / physics clone. The default clone,
 * original frozen shader, physics, B48/B51, main and production are untouched.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=fs.readFileSync(path.join(root,'web/p101-w9c2-g4e7ci-integrated-streetscape.mjs'));
const originalBlob=crypto.createHash('sha1').update(Buffer.concat([
 Buffer.from('blob '+source.length+'\0'),source])).digest('hex');
assert.equal(originalBlob,'af076d67492a677d2235e4730aef8cdf4808e106');
const from=path.join(root,'dist-private/r19a6p4r2f5k4ad');
const to=path.join(root,'dist-private/r19a6p4r2f5k4aq');
assert.ok(fs.existsSync(path.join(from,'drive3d.mjs')),'K4AQ requires frozen native K4AD private renderer');
const frozen=fs.readFileSync(path.join(from,'drive3d.mjs'),'utf8');
assert.ok(frozen.includes('k4adMeasure')&&frozen.includes('k4abBufferTags'));
assert.ok(!frozen.includes('k4aqScene'));
let body=frozen,patchCount=0;
function patch(a,b){
 assert.equal(body.split(a).length,2,'K4AQ isolated pack anchor drift '+a.slice(0,75));
 body=body.replace(a,b);patchCount++;
}
const importLine="import {g4e7ciIntegratedStreetscape,g4e7cqTracePixels,g4e7crHighlightStation2Left,g4e7ctColorSourcePart} from './p101-w9c2-g4e7ci-integrated-streetscape.mjs';";
patch(importLine,importLine+"\nimport {buildK4AQRoad5Art,createK4AQScene,renderK4AQScene,releaseK4AQScene} from './p101-k4aq-road5-civic-rift-material-art.mjs';");
patch('let g4e7bgShot=null,g4e7bgShots=null,g4e7ciMesh=null,g4e7cqArt=null;',
 "let g4e7bgShot=null,g4e7bgShots=null,g4e7ciMesh=null,g4e7cqArt=null;\n"+
 "const k4aqEnabled=r19a1OptIn&&g4e6LocalHost&&new URLSearchParams(location.search).get('k4aq')==='on';\n"+
 "let k4aqScene=null;\nconst k4aqSkyOnly=k4aqEnabled&&new URLSearchParams(location.search).get('k4aqMesh')==='off';");
patch('function buildVisual(stage){',
 "function buildVisual(stage){\n"+
 " if(k4aqScene)releaseK4AQScene(gl,k4aqScene);\n"+
 " const k4aqCandidate=buildK4AQRoad5Art(stage,sample,{enabled:k4aqEnabled});\n"+
 " k4aqScene=k4aqCandidate.active?createK4AQScene(gl,k4aqCandidate):null;\n"+
 " canvas.dataset.k4aqMode=k4aqEnabled?'PRIVATE_ART_CANDIDATE_HOLD':'ORIGINAL_SOURCE';\n canvas.dataset.k4aqSkyOnly=k4aqSkyOnly?'TRUE_SKY_ONLY_CONTROL':'false';\n"+
 " canvas.dataset.k4aqTriangles=String(k4aqCandidate.triangles||0);\n"+
 " canvas.dataset.k4aqSourceRoad=k4aqCandidate.sourceRoad||'off';\n"+
 " canvas.dataset.k4aqPhysicsChanged=String(Boolean(k4aqCandidate.changedPhysics));\n"+
 " canvas.dataset.k4aqRoads=String(stage.surfaces.length);\n"+
 " canvas.dataset.k4aqMovingHazards=String(stage.movingObstacles.length);");
patch("if((g4e7aiOptIn&&g4e7aiBackdrop==='quiet')||(g4e7akOptIn&&g4e7akBackdrop==='quiet')){",
 "if(k4aqEnabled){\n"+
 "  // ONLY the old unapproved scenery is replaced. Original visual roads,\n"+
 "  // collision surfaces, native B51 draw order, ball, camera remain below.\n"+
 "  renderK4AQScene(gl,k4aqScene,view,w/h,{fogStrength:visibilityFx?1:0,architecture:!k4aqSkyOnly});\n"+
 " }else if((g4e7aiOptIn&&g4e7aiBackdrop==='quiet')||(g4e7akOptIn&&g4e7akBackdrop==='quiet')){");
assert.equal(patchCount,4);
fs.rmSync(to,{recursive:true,force:true});
fs.cpSync(from,to,{recursive:true});
fs.copyFileSync(path.join(root,'web/p101-k4aq-road5-civic-rift-material-art.mjs'),
 path.join(to,'p101-k4aq-road5-civic-rift-material-art.mjs'));
fs.writeFileSync(path.join(to,'drive3d.mjs'),body);
assert.equal(fs.readFileSync(path.join(from,'drive3d.mjs'),'utf8'),frozen);
assert.ok(!frozen.includes('k4aqEnabled'));
console.log('K4AQ_PRIVATE_GAME_CAMERA_ART_RENDERER_BUILT',JSON.stringify({
 originalBlob,patchCount,isolatedFrom:'r19a6p4r2f5k4ad',art:'NOT_TESTED_HOLD',
 originalPhysicsModified:false,originalCameraModified:false,
 originalHazardsModified:false,addedColliderCount:0,
 officialARTAccepted:0,slope2DNAMetres:0
}));

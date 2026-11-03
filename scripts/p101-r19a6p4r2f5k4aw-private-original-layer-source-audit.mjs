/**
 * K4AW: source-origin attribution of individual colored Road5 GPU layers.
 * This private renderer diagnostic is NOT a playable variant. Hiding a
 * source safety cue in screenshots does NOT authorize its production removal.
 * B48 7 physical roads / B51 28 moving bodies / native Camera / 240Hz intact.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const src=fs.readFileSync(path.join(root,'web/p101-w9c2-g4e7ci-integrated-streetscape.mjs'));
const originalBlob=crypto.createHash('sha1').update(Buffer.concat([
 Buffer.from('blob '+src.length+'\0'),src])).digest('hex');
assert.equal(originalBlob,'af076d67492a677d2235e4730aef8cdf4808e106');
const from=path.join(root,'dist-private/r19a6p4r2f5k4av');
const to=path.join(root,'dist-private/r19a6p4r2f5k4aw');
assert.ok(fs.existsSync(path.join(from,'drive3d.mjs')),'Build private source K4AV first');
const immutable=fs.readFileSync(path.join(from,'drive3d.mjs'),'utf8');
assert.ok(immutable.includes('k4avWorld')&&immutable.includes('k4auLight'));
assert.ok(!immutable.includes('k4awEnabled'));
let code=immutable,patches=0;
function patch(needle,replacement){
 assert.equal(code.split(needle).length,2,'K4AW source anchor drift '+needle.slice(0,80));
 code=code.replace(needle,replacement);patches++;
}
const flag="const k4avEnabled=k4auEnabled&&new URLSearchParams(location.search).get('k4av')==='on';";
patch(flag,flag+'\n'+"const k4awEnabled=k4avEnabled&&new URLSearchParams(location.search).get('k4aw')==='layers'&&\n ['localhost','127.0.0.1','[::1]'].includes(location.hostname);\nconst k4awMasks=new Set([\"none\",\"noW9C1\",\"noP100\",\"noB5\",\"noXZCues\",\"noEdgeLines\",\"noHazardGates\",\"noA13Decor\"]);\nlet k4awDrawStats={};\nfunction k4awActive(){\n const m=window.__k4awMask||'none';\n return k4awEnabled&&runner?.surface==='p93-PRISM_CREST-01'&&k4awMasks.has(m)?m:'none';\n}\nfunction k4awCategory(m){\n if(m===w9c1MarkMesh)return 'W9C1_MARKS';\n if(m===p100RoadRead)return 'P100_ROAD_READABILITY';\n if(m===p101B5RoadOptic)return 'B5_ROAD_OPTICS';\n if(m===g4e7xCueMesh||m===g4e7zCueMesh||m===g4e7cCueMesh)return 'XZC_WARNING_CUES';\n if(m===lines||m===flowRoads||m===approachBeacons||m===shoulderLights)return 'SOURCE_EDGE_AND_FLOW_LINES';\n if(m===hazardGateMesh||m===hazardGateSolidMesh||m===g4e7aoMesh||\n   guideMeshes.some(x=>x.mesh===m))return 'SOURCE_B51_HAZARD_GUIDES';\n if(m===a13RoadArtMesh||m===g4e7pQuietMesh||m===g4e7kQuietMesh)return 'A13_NONPHYSICAL_DECOR';\n return 'OTHER_SOURCE_OR_CANDIDATE';\n}\nfunction k4awSkip(group,mask){\n return (mask==='noW9C1'&&group==='W9C1_MARKS')||\n (mask==='noP100'&&group==='P100_ROAD_READABILITY')||\n (mask==='noB5'&&group==='B5_ROAD_OPTICS')||\n (mask==='noXZCues'&&group==='XZC_WARNING_CUES')||\n (mask==='noEdgeLines'&&group==='SOURCE_EDGE_AND_FLOW_LINES')||\n (mask==='noHazardGates'&&group==='SOURCE_B51_HAZARD_GUIDES')||\n (mask==='noA13Decor'&&group==='A13_NONPHYSICAL_DECOR');\n}");
const draw="if(!m||!m.count)return;";
patch(draw,draw+`
 if(k4awEnabled&&m?.buffer){
  const layer=k4awCategory(m),mask=k4awActive(),drop=k4awSkip(layer,mask);
  const stat=k4awDrawStats[layer]||(k4awDrawStats[layer]={
    drawCalls:0,suppressedCalls:0,vertices:0,suppressedVertices:0});
  stat.vertices+=m.count;
  if(drop){stat.suppressedCalls++;stat.suppressedVertices+=m.count;return;}
  stat.drawCalls++;
 }`);
const clear="gl.viewport(0,0,w,h);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);";
patch(clear,clear+"\n if(k4awEnabled)k4awDrawStats={};");
const end="canvas.dataset.energyTrail=energyFx&&effect.trailActive?'active':'inactive';";
patch(end,end+`
 if(k4awEnabled){
  canvas.dataset.k4awMask=k4awActive();
  canvas.dataset.k4awNativeTick=String(r19a1Ticks);
  canvas.dataset.k4awGroups=JSON.stringify(k4awDrawStats);
  canvas.dataset.k4awSourceBlob='af076d67492a677d2235e4730aef8cdf4808e106';
  canvas.dataset.k4awPhysicsWrites='0';
  canvas.dataset.k4awB51BodiesStillDrawn='true';
  canvas.dataset.k4awSafety='HOLD';
 }`);
assert.equal(patches,4);
fs.rmSync(to,{recursive:true,force:true});
fs.cpSync(from,to,{recursive:true});
fs.writeFileSync(path.join(to,'drive3d.mjs'),code,'utf8');
assert.equal(fs.readFileSync(path.join(from,'drive3d.mjs'),'utf8'),immutable);
console.log('K4AW_ACTUAL_ORIGINAL_ROAD5_VISUAL_LAYER_MASKS',JSON.stringify({
  originalBlob,patches,masks:{"none":"UNCHANGED","noW9C1":"UNKNOWN_ROUTE_MARK","noP100":"ROAD_READABILITY_DIAGNOSTIC_ONLY","noB5":"B5_OPTIC_DIAGNOSTIC_ONLY","noXZCues":"HAZARD_CUE_DIAGNOSTIC_ONLY","noEdgeLines":"B48_EDGE_GUIDANCE_DIAGNOSTIC_ONLY","noHazardGates":"B51_WARNING_DIAGNOSTIC_ONLY","noA13Decor":"A13_ALREADY_DISABLED_IN_K4AV"},sourceB48:7,sourceB51:28,
  newColliders:0,physicsChanged:false,cameraChanged:false,
  ART:'HOLD',SAFETY:'HOLD',HUMAN:'HOLD',RELEASE:'HOLD'
}));

/** K4AB: read-only provenance instrumentation on PRIVATE K3B renderer clone.
 * Original source physics/240Hz/camera/B48/B51 and baseline WebGL2 draw unchanged.
 * A named visual group can be suppressed ONLY in isolated research copies AFTER
 * native pause at a true source tick. This is NOT a playable or shippable build.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const src=fs.readFileSync(path.join(root,'web/p101-w9c2-g4e7ci-integrated-streetscape.mjs'));
const blob=crypto.createHash('sha1').update(Buffer.concat([
 Buffer.from('blob '+src.length+'\0'),src])).digest('hex');
assert.equal(blob,'af076d67492a677d2235e4730aef8cdf4808e106');
const sourceDir=path.join(root,'dist-private/r19a6p4r2f5k3b');
const destDir=path.join(root,'dist-private/r19a6p4r2f5k4ab');
const originalPack=fs.readFileSync(path.join(root,
 'scripts/p101-r19a6p4r2f5k3b-private-camera-pack.mjs'),'utf8');
assert.ok(originalPack.includes("const from=path.join(root,'dist-private/r19a1');"));
assert.ok(fs.existsSync(path.join(sourceDir,'drive3d.mjs')));
fs.rmSync(destDir,{recursive:true,force:true});
fs.cpSync(sourceDir,destDir,{recursive:true});
const immutable=fs.readFileSync(path.join(sourceDir,'drive3d.mjs'),'utf8');
let script=immutable,patches=0;
function patch(needle,lines){
 assert.equal(script.split(needle).length,2,'K4AB original code anchor drift: '+needle.slice(0,90));
 script=script.replace(needle,lines);patches++;
}
const masks=['none','without-epic','without-mega','without-frames',
 'without-B48-and-fixtures-visuals','without-B51-bodies','without-road-optics'];
const labels=[
 ['roads','B48_AND_FIXTURES_RENDER_SKIN'],
 ['lines','B48_EDGES_AND_ROUTE_LINES'],
 ['p100RoadRead','ROAD_READABILITY_MARKERS'],
 ['p101B5RoadOptic','B5_ROAD_OPTICS'],
 ['a13RoadArtMesh','A13_ROAD_DECORATION'],
 ['g4e7kQuietMesh','G4E7K_QUIET_DECOR'],
 ['g4e7pQuietMesh','G4E7P_QUIET_DECOR'],
 ['w9c1MarkMesh','W9C1_ROAD_MARKERS'],
 ['scenery','EPIC_SCENERY'],
 ['megaWorld','MEGASTRUCTURE_SCENERY'],
 ['g5bSceneryMesh','G5B_SCENERY'],
 ['g4dSkywayMesh','G4D_SKYWAY_SCENERY'],
 ['a13ArchMesh','A13_MACHINE_FRAMES_AND_W9_HERO'],
 ['g4e7sShardMesh','G4E7S_SHARD_SCENERY'],
 ['g4e7adCityMesh','G4E7AD_OPTIONAL_CITY'],
 ['flowRoads','FLOW_ROAD_LINES'],
 ['approachBeacons','APPROACH_BEACON_LINES'],
 ['hazardGateMesh','HAZARD_GATE_LINES'],
 ['hazardGateSolidMesh','HAZARD_GATE_SOLIDS'],
 ['shoulderLights','SHOULDER_LIGHT_LINES'],
 ['g4e7aoMesh','G4E7AO_OPTIONAL_WARNING'],
 ['g4e7xCueMesh','G4E7X_CUES'],
 ['g4e7zCueMesh','G4E7Z_CUES'],
 ['g4e7cCueMesh','G4E7C_CUES'],
 ['ball','NATIVE_BALL'],
 ['ghostMesh','GHOST_LINE']
];
const anchor='let previousPose=null,currentPose=null,cameraState=null,comparisonMode=\'stable\',frameSkips=0,headingError=0;';
patch(anchor,[anchor,
 "// K4AB: private-only original GPU buffer provenance and subtraction.",
 "const k4abAuditOn=r19a1OptIn&&['localhost','127.0.0.1','[::1]'].includes(location.hostname)&&",
 " new URLSearchParams(location.search).get('k4ab')==='on';",
 'const k4abMasks=new Set('+JSON.stringify(masks)+');',
 'const k4abBufferTags=new Map();',
 'let k4abDrawCalls=[];',
 'function k4abRegister(m,label){if(m?.buffer)k4abBufferTags.set(m.buffer,label);}',
 "function k4abActiveMask(){if(!k4abAuditOn)return 'none';",
 " const v=window.__k4abMask??'none';return k4abMasks.has(v)?v:'none';}",
 'function k4abSuppress(tag,mask){',
 " if(mask==='without-epic')return tag==='EPIC_SCENERY';",
 " if(mask==='without-mega')return tag==='MEGASTRUCTURE_SCENERY'||tag==='G5B_SCENERY';",
 " if(mask==='without-frames')return tag==='A13_MACHINE_FRAMES_AND_W9_HERO';",
 " if(mask==='without-B48-and-fixtures-visuals')return tag==='B48_AND_FIXTURES_RENDER_SKIN';",
 " if(mask==='without-B51-bodies')return tag==='B51_BODY';",
 " if(mask==='without-road-optics')return ['ROAD_READABILITY_MARKERS',",
 " 'B5_ROAD_OPTICS','A13_ROAD_DECORATION','G4E7K_QUIET_DECOR','G4E7P_QUIET_DECOR',",
 " 'W9C1_ROAD_MARKERS'].includes(tag);",
 ' return false;}'
].join('\n'));
const registered=labels.map(([variable,label])=>
 '  k4abRegister('+variable+','+JSON.stringify(label)+');');
const datasetAnchor="canvas.dataset.hazardUrgency='none';canvas.dataset.hazardTarget='none';canvas.dataset.hazardEta='none';";
patch(datasetAnchor,[datasetAnchor,
 ' if(k4abAuditOn){',
 '  k4abBufferTags.clear();',
 ...registered,
 "  for(const m of Object.values(machineMeshes))k4abRegister(m,'B51_BODY');",
 "  for(const m of Object.values(a13MachineMeshes))k4abRegister(m,'B51_BODY');",
 "  for(const guide of guideMeshes)k4abRegister(guide.mesh,'B51_GUIDE_LINE');",
 "  for(const m of Object.values(energyMeshes))k4abRegister(m,'ENERGY_BALL_VISUAL');",
 ' }'].join('\n'));
const drawAnchor='if(!m||!m.count)return;\n  gl.uniform3fv(locations.translation,center);';
patch(drawAnchor,[
 'if(!m||!m.count)return;',
 '  if(k4abAuditOn){',
 "   const layer=k4abBufferTags.get(m.buffer)||'UNLABELLED_ORIGINAL_SOURCE_MESH';",
 '   const mask=k4abActiveMask(),suppressed=k4abSuppress(layer,mask);',
 '   k4abDrawCalls.push({layer,vertices:m.count,',
 "    primitive:primitive===gl.TRIANGLES?'TRIANGLES':primitive===gl.LINES?'LINES':'OTHER',",
 '    suppressedByResearchOnlyMask:suppressed});',
 '   if(suppressed)return;',
 '  }',
 '  gl.uniform3fv(locations.translation,center);'
].join('\n'));
const clearAnchor='gl.viewport(0,0,w,h);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);';
patch(clearAnchor,clearAnchor+'\n  if(k4abAuditOn)k4abDrawCalls=[];');
const endAnchor="canvas.dataset.energyTrail=energyFx&&effect.trailActive?'active':'inactive';";
patch(endAnchor,[endAnchor,
 '  if(k4abAuditOn){',
 '   const census={};',
 '   for(const item of k4abDrawCalls){',
 '    if(!census[item.layer])census[item.layer]={attemptedDrawCalls:0,',
 '      renderedDrawCalls:0,suppressedDrawCalls:0,',
 '      originalVerticesSubmitted:0,actuallyRenderedVertices:0,triangleDrawCalls:0,lineDrawCalls:0};',
 '    const stat=census[item.layer];',
 '    stat.attemptedDrawCalls++;stat.originalVerticesSubmitted+=item.vertices;',
 '    if(item.suppressedByResearchOnlyMask)stat.suppressedDrawCalls++;',
 '    else{stat.renderedDrawCalls++;stat.actuallyRenderedVertices+=item.vertices;}',
 "    if(item.primitive==='TRIANGLES')stat.triangleDrawCalls++;",
 "    if(item.primitive==='LINES')stat.lineDrawCalls++;",
 '   }',
 '   canvas.dataset.k4abEffectiveMask=k4abActiveMask();',
 '   canvas.dataset.k4abAudit=JSON.stringify({',
 "    schema:'dopagaki.k4ab-native-original-draw-provenance/1',",
 "    sourceBlob:'af076d67492a677d2235e4730aef8cdf4808e106',",
 "    originalSourceRenderer:'r19a1-with-K3B-private-legal-steering',",
 '    originalSceneA5R19A3OverlayRendered:false,',
 '    mask:k4abActiveMask(),sourceB48:doc.surfaces.length,',
 '    sourceB51:doc.movingObstacles.length,',
 '    sourceGeometryAndPhysicsUnchanged:true,',
 "    privateVisualLayerSuppressionOnly:k4abActiveMask()!=='none',",
 '    currentNativeTick:r19a1Ticks,sourceRoad:runner?.surface??\'AIR\',',
 '    originalSceneLayers:census,actualDrawCallCount:k4abDrawCalls.length,',
 "    art:'NOT_TESTED_HOLD'",
 '   });',
 '  }'
].join('\n'));
assert.equal(patches,5);
fs.writeFileSync(path.join(destDir,'drive3d.mjs'),script,'utf8');
assert.equal(fs.readFileSync(path.join(sourceDir,'drive3d.mjs'),'utf8'),immutable);
assert.ok(!immutable.includes('k4abBufferTags'));
console.log('K4AB_PRIVATE_DRAW_PROVENANCE_BUILT',JSON.stringify({
 sourceBlob:blob,patchAnchors:patches,groupLabels:labels.length+4,
 researchMasks:masks,realNativeCameraAndPhysicsUnchanged:true,
 baselineVisualDrawCallsNotChanged:true,newModels:0,newColliders:0,art:'NOT_TESTED_HOLD'
}));

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
// R9A reads a SECOND Blender-authored attribute bridge. Source road and
// all original moving B51 still use their unchanged original WebGL shader.
const r9=JSON.parse(fs.readFileSync(path.join(out,'K4CT_R9_BLENDER_TRUE_MATERIAL_BRIDGE.json'),'utf8'));
assert.equal(r9.schema,'k4ct-r9-blender-native-attribute-bridge-v1');
assert.equal(r9.strideFloats,14);
assert.ok(r9.fromActualBlenderMeshPolygons&&r9.fromActualBlenderBSDFInputs&&r9.fromActualBlenderUVLayer);
assert.equal(r9.totalDccTriangles,dcc.triangles);
assert.equal(r9.roadLegacyTriangles+r9.triangles,dcc.triangles);
assert.ok(r9.triangles>500&&r9.roadLegacyTriangles>500);
assert.equal(r9.vertices.length,r9.triangles*3*14);
assert.equal(r9.legacyRoadVertices.length,r9.roadLegacyTriangles*18);
assert.equal(r9.originalB48,7);
assert.equal(r9.originalB51,28);
assert.equal(r9.newColliders,0);
assert.equal(r9.sourcePhysicalRoad5SHA256,dcc.sourcePhysicalRoad5SHA256);
assert.ok(r9.materials.length>=20&&r9.materials.every((m,i)=>m.id===i));
for(let i=0;i<r9.legacyRoadVertices.length;i++)assert.equal(r9.legacyRoadVertices[i],dcc.vertices[i],'original road art must be byte-identical');
for(let i=0;i<r9.triangles*3;i++){
 const k=(r9.roadLegacyTriangles*3+i)*6, v=i*14;
 for(let j=0;j<3;j++)assert.equal(r9.vertices[v+j],dcc.vertices[k+j],'source 3D scenery position parity');
 const mag=Math.hypot(r9.vertices[v+6],r9.vertices[v+7],r9.vertices[v+8]);
 assert.ok(Number.isFinite(mag)&&Math.abs(mag-1)<.001);
 assert.ok(Number.isFinite(r9.vertices[v+9])&&Number.isFinite(r9.vertices[v+10]));
 assert.ok(Number.isInteger(r9.vertices[v+11])&&r9.vertices[v+11]>=0&&r9.vertices[v+11]<r9.materials.length);
 assert.ok(r9.vertices[v+12]>=0&&r9.vertices[v+12]<=1&&r9.vertices[v+13]>=0&&r9.vertices[v+13]<=1);
}
const r9WaterMaterialIds=r9.materials.filter(x=>['tide','shallows','foam'].includes(x.name)).map(x=>x.id);
assert.equal(r9WaterMaterialIds.length,3);
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
replace(imports,imports+"\nimport {K4CT_DCC_VERTICES,K4CT_DCC_TRIANGLES,K4CT_R9_ROAD_VERTICES,K4CT_R9_MATERIAL_VERTICES,K4CT_R9_WATER_MATERIAL_IDS} from './k4ct-dcc-world-geometry.mjs';");
replace('let k4cqSceneMesh=null;', "let k4ctDccMesh=null;\nlet k4ctResearchB51Meshes={};\nlet k4ctFixtureIdentityTagMesh=null;\n\nfunction k4ctIndustrialMaterialOnly(src,mode){\n const out=src.slice();\n const palettes={\n fail:[[.14,.19,.20],[.80,.23,.16],[.53,.31,.24]],\n bounce:[[.20,.22,.21],[.89,.57,.18],[.57,.42,.27]],\n push:[[.15,.22,.24],[.20,.75,.71],[.34,.53,.53]]\n };\n const p=palettes[mode];\n for(let i=0;i<src.length;i+=6){\n  const rgb=src.slice(i+3,i+6),max=Math.max(...rgb),min=Math.min(...rgb);\n  const target=max<.36?p[0]:(max-min>.28||max>.8?p[1]:p[2]);\n  for(let j=0;j<3;j++)out[i+3+j]=target[j];\n }\n if(out.length!==src.length||out.some((v,i)=>i%6<3&&v!==src[i]))throw Error('B51 geometry modified');\n return out;\n}\n\nwindow.__k4ctVisualABMode='R7C_MATERIAL';\nwindow.__k4ctSuppressK4CSGateOnly=true;\nlet k4cqSceneMesh=null;");
const buildAnchor="}else canvas.dataset.k4cqScene='off';";
replace(buildAnchor,buildAnchor+"\n"+
 "discard(k4ctDccMesh);k4ctDccMesh=null;"+
 "if(stage.stageForge?.k4ctPrivate){"+
 " if(stage.surfaces.length!==7||stage.movingObstacles.length!==28||"+
 " stage.stageForge.k4ctPrivate.newColliders!==0)throw Error('K4CT DCC source physical protection failed');"+
 " k4ctDccMesh=mesh(K4CT_R9_ROAD_VERTICES);k4ctR9LoadMaterialMesh();"+
 " canvas.dataset.k4ctNativeDccTriangles=String(K4CT_DCC_TRIANGLES);"+
 " canvas.dataset.k4ctNativeDcc='GENUINE_BLENDER_EDITABLE_NONCOLLIDING';"+
 "}else{canvas.dataset.k4ctNativeDccTriangles='0';canvas.dataset.k4ctNativeDcc='off';}");
replace('if(k4cqSceneMesh){draw(k4cqSceneMesh);}',
 'if(k4cqSceneMesh&&!k4ctDccMesh){draw(k4cqSceneMesh);}');
// PRIVATE K4CT only. B48 original physics/mesh is drawn normally, then
// true Blender-authored noncolliding skin replaces legacy saturated striping.
// Machine B51, hazard signs, camera, input and CCD remain original.
const oldRoadVisual="draw(roads);draw(g4e7pQuietMesh||(g4e7kUi?.quiet&&g4e7kQuietMesh?g4e7kQuietMesh:a13RoadArtMesh));if(g4e7iUi?.active&&g4e7iContour?.active)draw(g4e7iMesh);if(g4e7cCueActive)draw(g4e7cCueMesh);draw(g4e7xCueMesh);draw(g4e7zCueMesh);draw(w9c1MarkMesh);draw(p100RoadRead);draw(p101B5RoadOptic);draw(lines,[0,0,0],[1,1,1],0,gl.LINES);";
replace(oldRoadVisual,"draw(roads);if(k4ctDccMesh){draw(k4ctDccMesh);k4ctR9DrawMaterialWorld(view,w/h,visibilityFx?1:0);canvas.dataset.k4ctRoadArtMode='ORIGINAL_B48_PLUS_DCC_CONFORMAL';}else{"+oldRoadVisual.slice('draw(roads);'.length)+"}");


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
replace(" gl.drawArrays(primitive,0,m.count);",
 "  if(k4ctDccMesh&&doc?.stageForge?.k4ctPrivate){"+
 "   const isB51=Object.values(machineMeshes).includes(m)||Object.values(a13MachineMeshes).includes(m);"+
 "   const group=m===roads||m===k4ctFixtureIdentityTagMesh?'ROAD':"+
 "    m===k4csMarkerMesh?'K4CS':"+
 "    m===k4ctDccMesh?'DCC':isB51?'B51':'OTHER';"+
 "   const requested=window.__k4ctRenderAttribution||'BASE';"+
 "   if(!['BASE','ROAD','DCC','B51','OTHER','K4CS'].includes(requested))throw Error('K4CT attribution mode invalid');"+
 "   gl.uniform1f(locations.k4ctProbeOn,requested===group?1:0);"+
 "   gl.uniform3fv(locations.k4ctProbeRGB,[1,.015,.85]);"+
 "   canvas.dataset.k4ctAttributionMode=requested;"+
 "  }else gl.uniform1f(locations.k4ctProbeOn,0);"+
 "  gl.drawArrays(primitive,0,m.count);");


/* R8B: confirmed K4CS early warning pylons are GPU-only noncolliding.
 * PRIVATE K4CT trial hides ONLY these 18 legacy tall gates, NOT their B51
 * predicted-distance HUD, true moving solids, original warnings or physics.
 * Two source-grounded Blender industrial pylons remain in native DCC.
 * Flag is reversible at any frozen native tick; no formal ART adoption. */
replace("if(k4csMarkerMesh){draw(k4csMarkerMesh);}",
 "if(k4csMarkerMesh){"+
 " const isolated=Boolean(k4ctDccMesh&&doc?.stageForge?.k4ctPrivate);"+
 " const hide=Boolean(isolated&&window.__k4ctSuppressK4CSGateOnly);"+
 " canvas.dataset.k4ctK4csGateStatus=hide?'RESEARCH_ONLY_NONCOLLIDING_GATES_HIDDEN':'ORIGINAL_NONCOLLIDING_GATES_VISIBLE';"+
 " if(!hide)draw(k4csMarkerMesh);"+
 "}");


// R8I source-safe RESEARCH-only sky; genuine WebGL2 framebuffer sky
// behind ALL source objects, including the true 28 B51. No screenshots,
// physics, camera, obstacle material, B51 cue or production source edits.
// This modifies only dist-private/k4ct/drive3d.mjs (isolated copy).
const k4ctR9Declarations=String.raw`
// R9: real Blender normals/UV/BSDF material input survived source->GL.
// Render only the non-road OUTBOARD DCC scenery with this separate program.
let k4ctR9MaterialProgram=null;
let k4ctR9MaterialBuffer=null;
let k4ctR9MaterialVertexCount=0;
let k4ctR9Locations={};
function k4ctR9LoadMaterialMesh(){
 if(k4ctR9MaterialBuffer)gl.deleteBuffer(k4ctR9MaterialBuffer);
 k4ctR9MaterialBuffer=gl.createBuffer();
 gl.bindBuffer(gl.ARRAY_BUFFER,k4ctR9MaterialBuffer);
 gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(K4CT_R9_MATERIAL_VERTICES),gl.STATIC_DRAW);
 k4ctR9MaterialVertexCount=K4CT_R9_MATERIAL_VERTICES.length/14;
 canvas.dataset.k4ctR9MaterialVertexCount=String(k4ctR9MaterialVertexCount);
}
function k4ctR9DrawMaterialWorld(view,aspectRatio,fogStrength){
 if(!k4ctR9MaterialProgram||!k4ctR9MaterialBuffer||!k4ctDccMesh)return;
 gl.useProgram(k4ctR9MaterialProgram);
 const L=k4ctR9Locations;
 gl.uniform3fv(L.eye,view.eye);
 gl.uniform3fv(L.camRight,view.right);
 gl.uniform3fv(L.camUp,view.up);
 gl.uniform3fv(L.camFront,view.front);
 gl.uniform1f(L.aspect,aspectRatio);
 gl.uniform1f(L.fogStrength,fogStrength);
 gl.uniform1f(L.fogStart,FOG_START_METERS);
 gl.uniform1f(L.fogSpan,FOG_SPAN_METERS);
 gl.bindBuffer(gl.ARRAY_BUFFER,k4ctR9MaterialBuffer);
 const stride=14*4;
 for(const [slot,width,offset] of [[0,3,0],[1,3,3],[2,3,6],[3,2,9],
                                   [4,1,11],[5,1,12],[6,1,13]]){
  gl.enableVertexAttribArray(slot);
  gl.vertexAttribPointer(slot,width,gl.FLOAT,false,stride,offset*4);
 }
 gl.drawArrays(gl.TRIANGLES,0,k4ctR9MaterialVertexCount);
 for(let slot=2;slot<=6;slot++)gl.disableVertexAttribArray(slot);
 gl.useProgram(program); // Restore original road, B51 and ball renderer.
 canvas.dataset.k4ctR9Material='REAL_BLENDER_POLYGON_NORMAL_UV_BSDF_ATTRIBUTE_WEBGL2';
}
`;
const k4ctR9Setup=String.raw`
// R9 real isolated WebGL2 material shader, no source-game GLSL changed.
// Base color, normal, UV, roughness, metallic, material identity are
// retrieved from actual Blender polygons and real Principled BSDF nodes.
// This is stylized physically-informed light, NOT full PBR or shadows.
const k4ctR9VS=[
 '#version 300 es','precision highp float;',
 'layout(location=0) in vec3 p;layout(location=1) in vec3 col;',
 'layout(location=2) in vec3 n;layout(location=3) in vec2 uv;',
 'layout(location=4) in float matId;layout(location=5) in float rough;',
 'layout(location=6) in float metal;',
 'uniform vec3 eye,camRight,camUp,camFront;',
 'uniform float aspect,fogStrength,fogStart,fogSpan;',
 'out vec3 C;out vec3 N;out vec3 E;out vec2 UV;',
 'out float R;out float M;out float H;flat out int ID;',
 'void main(){vec3 w=p-eye;',
 'float x=dot(w,camRight),y=dot(w,camUp),z=dot(w,camFront);',
 'gl_Position=vec4(1.35*x/aspect,1.35*y,1.00022*z-1.30014,z);',
 'C=col;N=n;E=-w;UV=uv;R=rough;M=metal;ID=int(matId+.5);',
 'H=clamp((length(w)-fogStart)/fogSpan,0.,1.)*fogStrength;}'
].join('\n');
const k4ctR9SeaTest=K4CT_R9_WATER_MATERIAL_IDS.map(i=>'ID=='+i).join('||');
const k4ctR9FS=[
 '#version 300 es','precision highp float;',
 'in vec3 C;in vec3 N;in vec3 E;in vec2 UV;',
 'in float R;in float M;in float H;flat in int ID;',
 'out vec4 outColor;',
 'void main(){vec3 n=normalize(N),v=normalize(E);',
 'vec3 sun=normalize(vec3(.56,.76,-.34));',
 'float sunlight=max(0.,dot(n,sun));',
 'float grain=.012*sin(UV.x*6.3+UV.y*2.8)+.010*cos(UV.y*9.3-UV.x*1.7);',
 'bool sea=('+k4ctR9SeaTest+');',
 'float diffuse=.40+.52*sunlight;',
 'float fresnel=pow(1.-max(0.,dot(n,v)),3.);',
 'float spec=pow(max(0.,dot(reflect(-sun,n),v)),mix(55.,8.,clamp(R,0.,1.)));',
 'vec3 rgb=C*(diffuse+grain);',
 'rgb+=vec3(1.,.84,.65)*spec*(.04+.30*M)*(1.-.28*R);',
 'if(sea){float wave=.035*sin(UV.x*10.+UV.y*3.)*cos(UV.y*7.);',
 'rgb=C*(.66+wave+.20*sunlight)+vec3(.16,.34,.37)*(.13*fresnel+.12*spec);}',
 'rgb=mix(rgb,vec3(.115,.168,.192),H);',
 'outColor=vec4(clamp(rgb,0.,1.),1.);}'
].join('\n');
k4ctR9MaterialProgram=gl.createProgram();
gl.attachShader(k4ctR9MaterialProgram,shader(gl.VERTEX_SHADER,k4ctR9VS));
gl.attachShader(k4ctR9MaterialProgram,shader(gl.FRAGMENT_SHADER,k4ctR9FS));
gl.linkProgram(k4ctR9MaterialProgram);
if(!gl.getProgramParameter(k4ctR9MaterialProgram,gl.LINK_STATUS))
 throw Error('K4CT R9 genuine Blender material shader '+gl.getProgramInfoLog(k4ctR9MaterialProgram));
for(const uniform of ['eye','camRight','camUp','camFront','aspect',
                      'fogStrength','fogStart','fogSpan'])
 k4ctR9Locations[uniform]=gl.getUniformLocation(k4ctR9MaterialProgram,uniform);
canvas.dataset.k4ctR9MaterialProgram='R9_REAL_BLENDER_ATTRIBUTES_SOURCE_SAFE';
`;
const k4ctSkyDeclarations=String.raw`
let k4ctResearchSkyProgram=null;
let k4ctResearchSkyBuffer=null;
function k4ctDrawSourceSafeSky(){
 if(!k4ctDccMesh||!k4ctResearchSkyProgram)return;
 gl.disable(gl.DEPTH_TEST);
 gl.useProgram(k4ctResearchSkyProgram);
 gl.bindBuffer(gl.ARRAY_BUFFER,k4ctResearchSkyBuffer);
 gl.enableVertexAttribArray(0);
 gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
 gl.drawArrays(gl.TRIANGLES,0,3);
 gl.enable(gl.DEPTH_TEST);
 gl.useProgram(program);
}
`;
const k4ctSkySetup=String.raw`
const k4ctSkyVS=['#version 300 es','precision highp float;',
 'layout(location=0) in vec2 p;out float vSky;',
 'void main(){vSky=.5*(p.y+1.);gl_Position=vec4(p,1.0,1.0);}'].join('\n');
const k4ctSkyFS=['#version 300 es','precision highp float;',
 'in float vSky;out vec4 outColor;',
 'void main(){float h=smoothstep(.02,.95,vSky);',
 'vec3 low=vec3(.48,.565,.57),high=vec3(.12,.255,.36);',
 'vec3 c=mix(low,high,h);float glow=exp(-pow((vSky-.19)/.19,2.0));',
 'c=mix(c,vec3(.61,.51,.405),.12*glow);outColor=vec4(c,1.0);}'].join('\n');
k4ctResearchSkyProgram=gl.createProgram();
gl.attachShader(k4ctResearchSkyProgram,shader(gl.VERTEX_SHADER,k4ctSkyVS));
gl.attachShader(k4ctResearchSkyProgram,shader(gl.FRAGMENT_SHADER,k4ctSkyFS));
gl.linkProgram(k4ctResearchSkyProgram);
if(!gl.getProgramParameter(k4ctResearchSkyProgram,gl.LINK_STATUS))
 throw Error('K4CT real research-only sky shader: '+gl.getProgramInfoLog(k4ctResearchSkyProgram));
k4ctResearchSkyBuffer=gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,k4ctResearchSkyBuffer);
gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
canvas.dataset.k4ctResearchSky='R8I_REAL_WEBGL2_BACKGROUND_ONLY';
`;
replace('let k4ctDccMesh=null;',
 'let k4ctDccMesh=null;\n'+k4ctSkyDeclarations+k4ctR9Declarations);
replace('gl.useProgram(program);\n for(const name of [',
 'gl.useProgram(program);\n'+k4ctSkySetup+k4ctR9Setup+'\n for(const name of [');
replace('gl.viewport(0,0,w,h);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);',
 'gl.viewport(0,0,w,h);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);k4ctDrawSourceSafeSky();');

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
const r9Raw=JSON.stringify(r9.vertices);
const roadRaw=JSON.stringify(r9.legacyRoadVertices);
const waterIdsRaw=JSON.stringify(r9WaterMaterialIds);
fs.writeFileSync(moduleFile,
 '/** Real Blender author, PRIVATE visual only: ROAD uses original shader, SCENERY uses R9 bridge. */\n'+
 'export const K4CT_DCC_TRIANGLES='+dcc.triangles+';\n'+
 'export const K4CT_DCC_VERTICES='+raw+';\n'+
 'export const K4CT_R9_ROAD_VERTICES='+roadRaw+';\n'+
 'export const K4CT_R9_MATERIAL_VERTICES='+r9Raw+';\n'+
 'export const K4CT_R9_WATER_MATERIAL_IDS='+waterIdsRaw+';\n');
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
 r9BridgeShader:'REAL_BLENDER_POLYGON_NORMAL_UV_BSDF_MATERIAL_PRIVATE_WEBGL2',
 r9MaterialFloatStride:14,r9SceneTriangles:r9.triangles,
 r9RoadLegacyTriangles:r9.roadLegacyTriangles,
 r9NormalUVFromRealBlender:true,r9MaterialIndicesFromRealBlender:true,
 r9BSDFBaseColorMetallicRoughnessFromRealBlender:true,
 r9LegacyGeometryXYZParity:true,
 r9RoadRetainsOriginalShader:true,fullPBRProven:false,
 webGLGameDisplayTested:false,originalGameCameraAndSolverUntouched:true,
 extraCollisionSolids:0,formalART:0,slope2DNAmeters:0,ART:'REJECT',HUMAN:'HOLD',
 SAT:'HOLD',CCD:'HOLD',FPS:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'};
fs.writeFileSync(path.join(out,'K4CT_BLENDER_TO_ORIGINAL_WEBGL2_INSTALL_AUDIT.json'),JSON.stringify(audit,null,2)+'\n');
console.log('K4CT_ACTUAL_DCC_AUTHORED_WORLD_IN_NATIVE_GAME_READY',JSON.stringify(audit));

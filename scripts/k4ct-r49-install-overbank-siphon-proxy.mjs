/** R49: study-only source-native volumetric pressure-siphon silhouette in generated PRIVATE original-240Hz game.
 * NOT genuine Blender art, NOT hydraulic simulation or verified machine. No protected edits.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const OUT='test-results/k4ct-r49-native-diagnostic';
fs.mkdirSync(OUT,{recursive:true});
function blob(s){const b=fs.readFileSync(s);return crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+b.length+'\0'),b])).digest('hex');}
assert.equal(blob('web/p101-w9c2-g4e7ci-integrated-streetscape.mjs'),'af076d67492a677d2235e4730aef8cdf4808e106');
assert.equal(blob('scripts/p101-k4ct-native-spillway-dcc.py'),'096fffbc1627915eb0122224955bb02cfba6b3ae');
const dcc=JSON.parse(fs.readFileSync('test-results/k4ct-contact-retry/K4CT_DCC_BLENDER_TO_NATIVE_GEOMETRY.json','utf8'));
const r44=JSON.parse(fs.readFileSync('test-results/k4ct-r44-art/R44_SOURCE_UNDERBANK_CONDUIT_MANIFEST.json','utf8'));
assert.equal(dcc.triangles,32004);assert.equal(r44.totalSceneTriangles,dcc.triangles);
assert.equal(dcc.originalB48,7);assert.equal(dcc.originalB51,28);assert.equal(dcc.newColliders,0);
assert.equal(Object.keys(dcc.objects).length,43);
assert(r44.sourceGroup19Untouched&&r44.protectedEightExactBeforeExport);
const F=[.92049565,0,-.3907528],S=[-.3907528,0,-.92049565],O=[1157.592,0,-494.670];
const xyz=(d,t,y)=>[O[0]+S[0]*d+F[0]*t,y,O[2]+S[2]*d+F[2]*t];
function quad(a,b,c,d,rgb){return [a,b,c,a,c,d].flatMap(v=>[...v,...rgb]);}
function plane(d0,d1,t0,t1,y0,y1,rgb){
 return quad(xyz(d0,t0,y0),xyz(d1,t0,y0),xyz(d1,t1,y1),xyz(d0,t1,y1),rgb);}
function wall(d0,d1,t,y0,y1,rgb){
 return quad(xyz(d0,t,y0),xyz(d1,t,y0),xyz(d1,t,y1),xyz(d0,t,y1),rgb);}
// R49 new spatial hypothesis: source19 (Y~93) -> submerged intake ->
// bank-supported pressure siphon crest Y100 -> broad short true vertical
// discharge to VISIBLE terraced receiver Y85. Diagnostic shapes only:
// no water movement/priming, no actual mechanics, not authored Blender ART.
const ink={pipe:[.17,.45,.49],trim:[.68,.52,.29],flow:[.25,.70,.75],
 foam:[.70,.88,.78],pool:[.12,.45,.50],rock:[.22,.29,.30],
 footing:[.34,.38,.36],iron:[.32,.45,.47]};
const triangles={HEADRACE:[],FALL:[],RECEIVER:[],GATE_PROXY:[]};
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const add=(a,b,k=1)=>a.map((x,i)=>x+k*b[i]);
const norm=a=>{const m=Math.hypot(...a);assert(m>1e-7);return a.map(v=>v/m)};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
function pipe(arr,points,r,col,steps=10){
 for(let p=0;p<points.length-1;p++){
  const A=points[p],B=points[p+1],ax=norm(sub(B,A));
  const normal=norm(cross(ax,Math.abs(ax[1])>.85?F:[0,1,0])),side=cross(ax,normal);
  const radial=q=>add(add([0,0,0],normal,r*Math.cos(q)),side,r*Math.sin(q));
  for(let j=0;j<steps;j++){
   const x=radial(2*Math.PI*j/steps),y=radial(2*Math.PI*(j+1)/steps);
   arr.push(...quad(add(A,x),add(A,y),add(B,y),add(B,x),col));
  }
 }
}
function pillar(arr,bottom,top,dx,dz,col){
 const a=[bottom[0]-dx,bottom[1],bottom[2]-dz],b=[bottom[0]+dx,bottom[1],bottom[2]-dz],
 c=[bottom[0]+dx,bottom[1],bottom[2]+dz],d=[bottom[0]-dx,bottom[1],bottom[2]+dz],
 e=[top[0]-dx*.65,top[1],top[2]-dz*.7],f=[top[0]+dx*.65,top[1],top[2]-dz*.7],
 g=[top[0]+dx*.65,top[1],top[2]+dz*.7],h=[top[0]-dx*.65,top[1],top[2]+dz*.7];
 for(const face of [[a,b,f,e],[b,c,g,f],[c,d,h,g],[d,a,e,h],[e,f,g,h]])
   arr.push(...quad(...face,col));
}
// Pressurized intake is close to actual protected water19 by XZ seed
// (near d100,t145), connected as one swept manifold; physically priming
// and closed hydraulic seal remain UNPROVEN.
pipe(triangles.HEADRACE,[
 xyz(100,145,92.6),xyz(105,142,93.8),xyz(112,138,96.6),
 xyz(129,131,99.5),xyz(155,125,100)
],2.3,ink.pipe,12);
pipe(triangles.HEADRACE,[xyz(130,125,100),xyz(190,125,100)],2.5,ink.pipe,14);
for(const d of [133,155,188])
 pipe(triangles.HEADRACE,[xyz(d,125,100),xyz(d,125,100.6)],2.7,ink.trim,12);
// Art-legibility experiment: corrugated gravity curtain, 28x18 quads,
// NOT the previous unlit 2-triangle orange wall.
for(let y=0;y<18;y++)for(let j=0;j<28;j++){
 const point=(n,k)=>{
  const d=132+56*n/28,v=k/18,zz=100-15*v;
  return xyz(d,125-3.5*v*v+.5*Math.sin(n*.9+k*.48),zz);
 };
 triangles.FALL.push(...quad(point(j,y),point(j+1,y),point(j+1,y+1),point(j,y+1),
   ((j*7+y*3)%13===0)?ink.foam:ink.flow));
}
// An elevated, bank-supported lower catchment at Y85, not invisible Y75.
// Two asymmetric sloped banks are volumes, not painted flat rectangles.
for(let k=0;k<16;k++){
 const t0=83+42*k/16,t1=83+42*(k+1)/16;
 const w=t=>85-.65*(125-t)/42;
 triangles.RECEIVER.push(...quad(xyz(130,t0,w(t0)),xyz(190,t0,w(t0)),
     xyz(190,t1,w(t1)),xyz(130,t1,w(t1)),ink.pool));
}
for(const d of [126,194]){
 pillar(triangles.RECEIVER,xyz(d,103,75),xyz(d,103,88),2.8,18,ink.rock);
}
// Mechanical control is shown with manifold-to-footing link (not simulated).
pillar(triangles.GATE_PROXY,xyz(197,125,77),xyz(197,125,98),5,6.2,ink.footing);
pipe(triangles.GATE_PROXY,[xyz(197,125,98),xyz(197,125,105)],2.2,ink.trim,12);
pipe(triangles.GATE_PROXY,[xyz(197,125,103),xyz(186,125,100)],1.45,ink.iron,10);
pipe(triangles.GATE_PROXY,[xyz(197,125,103),xyz(193,116,84)],.95,ink.iron,8);
const geo=triangles;
for(const [name,arr] of Object.entries(geo)){
 assert(arr.length>=36&&arr.length%18===0&&arr.length<150000&&arr.every(Number.isFinite),
  'R49 nonproduction bounded volumetric proxy '+name);
}
const original=path.resolve('dist-private/k4ct/drive3d.mjs');
let js=fs.readFileSync(original,'utf8');
function patch(before,after){const n=js.split(before).length-1;assert.equal(n,1,'R49 generated private anchor count '+n+': '+before.slice(0,70));js=js.replace(before,after);}
patch('let k4ctDccMesh=null;',
 'let k4ctDccMesh=null;\nlet k4ctR49ProxyMeshes={};\nwindow.__k4ctR49ResearchDiagnosticOn=false;\nwindow.__k4ctR49ProxyMask="ALL";');
patch('k4ctDccMesh=mesh(K4CT_R9_ROAD_VERTICES);k4ctR9LoadMaterialMesh();',
 'k4ctDccMesh=mesh(K4CT_R9_ROAD_VERTICES);k4ctR9LoadMaterialMesh();'
 +'\nfor(const m of Object.values(k4ctR49ProxyMeshes))discard(m);'
 +'\nk4ctR49ProxyMeshes={};'
 +'\nfor(const [name,verts] of Object.entries('+JSON.stringify(geo)+'))k4ctR49ProxyMeshes[name]=mesh(verts);');
patch('if(r12Skip===null){\n  gl.drawArrays(gl.TRIANGLES,0,k4ctR9MaterialVertexCount);',
 'if(r12Skip===null&&window.__k4ctR49ResearchDiagnosticOn!==true){\n  gl.drawArrays(gl.TRIANGLES,0,k4ctR9MaterialVertexCount);');
patch('if(part.name===r12Skip){found=true;continue;}\n   gl.drawArrays(gl.TRIANGLES,part.first,part.count);',
 'if(part.name===r12Skip){found=true;continue;}'
 +'\n   if(window.__k4ctR49ResearchDiagnosticOn===true&&["15","16","17","23","24"].includes(part.name.slice(0,2)))continue;'
 +'\n   gl.drawArrays(gl.TRIANGLES,part.first,part.count);');
patch("if(!found)throw Error('R12 unknown Blender group in original scene '+r12Skip);",
 "if(r12Skip!==null&&!found)throw Error('R12 unknown Blender group in original scene '+r12Skip);");
patch('k4ctR9DrawMaterialWorld(view,w/h,visibilityFx?1:0);',
 'k4ctR9DrawMaterialWorld(view,w/h,visibilityFx?1:0);'
 +'\nif(window.__k4ctR49ResearchDiagnosticOn===true){'
 +'\n const r49Mode=window.__k4ctR49ProxyMask||"ALL";'
 +'\n if(!["ALL","NONE","SKIP_HEADRACE","SKIP_FALL","SKIP_RECEIVER","SKIP_GATE_PROXY"].includes(r49Mode))throw Error("R49 invalid research mask "+r49Mode);'
 +'\n for(const [name,object] of Object.entries(k4ctR49ProxyMeshes)){'
 +'\n  if(r49Mode!=="NONE"&&r49Mode!=="SKIP_"+name)draw(object);'
 +'\n }'
 +'\n canvas.dataset.k4ctR49ProxyMode=r49Mode;'
 +'\n}else canvas.dataset.k4ctR49ProxyMode="OFF";');
assert(js.includes('R49 invalid research mask')&&js.includes('R12 unknown Blender group'));
fs.writeFileSync(original,js);
const manifest={schema:'k4ct-r49-source-native-overbank-volumetric-siphon-diagnostic-v1',
 originalGameBlob:'af076d67492a677d2235e4730aef8cdf4808e106',
 originalBlenderBlob:'096fffbc1627915eb0122224955bb02cfba6b3ae',
 r44RealBlenderTriangles:32004,originalB48:7,originalB51:28,newColliders:0,
 originalCameraAnd240HzPreserved:true,protectedEightUnmodified:true,
 volumetricDiagnosticNotGenuineBlender:true,
 sourceHydraulicAndMechanicConnectionsUNPROVEN:true,
 rejectedNonprotectedGroupsHiddenWhenDiagnosticOn:['15','16','17','23','24'],
 temporalConcept:{intakeD:100,intakeT:145,intakeY:92.6,crestY:100,fallT:125,receiverT:83,receiverY:85,outboardD:[130,190],siphonPrimingUnverified:true},
 proxyTrianglesByComponent:Object.fromEntries(Object.entries(geo).map(([k,v])=>[k,v.length/18])),
 officialARTAdopted:0,slope2DNAmeters:0,ART:'HOLD',HUMAN:'HOLD',
 SAT:'HOLD',CCD:'HOLD',FPS:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'};
fs.writeFileSync(path.join(OUT,'R49_GENERATED_PRIVATE_DIAGNOSTIC_MANIFEST.json'),JSON.stringify(manifest,null,2)+'\n');
console.log('R49_ORIGINAL_GL_PRIVATE_ONLY_PROXY_READY',{sourceProtected:true,componentCount:4,noNewColliders:true});

/** R63 original WEBGL2 draw-only Y93 protected water surface A/B.
 * Source R49 3D data, original B48/B51, camera and physics NEVER changed.
 * A GROUP19 full-hide acts only as a separate positive control.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
const file='dist-private/k4ct/drive3d.mjs';
let s=fs.readFileSync(file,'utf8');
const d=JSON.parse(fs.readFileSync('test-results/k4ct-contact-retry/K4CT_DCC_BLENDER_TO_NATIVE_GEOMETRY.json','utf8'));
const r=JSON.parse(fs.readFileSync('test-results/k4ct-contact-retry/K4CT_R9_BLENDER_TRUE_MATERIAL_BRIDGE.json','utf8'));
assert.equal(d.triangles,32004);
assert.equal(d.originalB48,7);assert.equal(d.originalB51,28);assert.equal(d.newColliders,0);
assert.equal(r.roadLegacyTriangles,4608);assert.equal(r.totalDccTriangles,d.triangles);
assert.equal(d.sourcePhysicalRoad5SHA256,'4957a0e1ffb1a394c4bbaa2c502caad3fdec219c9713073f5236d7bbb6ab4e2b');
assert.ok(s.includes('applyK4CTR57Hud')&&s.includes('__k4ctR60ActualCamera'),'required original live stage not installed');
let off=0,waterName=null,water=[];
for(const [name,count] of Object.entries(d.objects)){
 if(name.startsWith('19_')){
  waterName=name;
  for(let t=off;t<off+count;t++){
   const k=t*18;
   if([1,7,13].every(j=>Math.abs(d.vertices[k+j]-93)<.1))water.push(t);
  }
 }
 off+=count;
}
assert.equal(off,d.triangles);
assert.equal(waterName,'19_R6_SOURCE_FRAMED_UPPER_TIDAL_FOREBAY');
assert.equal(water.length,144,'actual Y93 source surface must have 144 triangles');
const omit=new Set(water.map(i=>i-r.roadLegacyTriangles));
const spans=[];
for(let i=0;i<r.triangles;){
 if(omit.has(i)){i++;continue;}
 const start=i;
 while(i<r.triangles&&!omit.has(i))i++;
 spans.push([start*3,(i-start)*3]);
}
assert.equal(spans.reduce((sum,x)=>sum+x[1],0),3*(r.triangles-144));
const decl='let k4ctR9MaterialProgram=null;';
assert.equal(s.split(decl).length,2,'R9 declarations anchor not unique');
s=s.replace(decl,'const K4CT_R63_Y93_DRAW_SPANS='+JSON.stringify(spans)+';\n'+decl);
const before=[
 ' const r12Skip=window.__k4ctR12SkipGroup??null;',
 ' if(r12Skip===null){',
 '  gl.drawArrays(gl.TRIANGLES,0,k4ctR9MaterialVertexCount);',
 ' }else{'
].join('\n');
const after=[
 ' const r12Skip=window.__k4ctR12SkipGroup??null;',
 " const r63Mode=window.__k4ctR63WaterDrawMode??'BASE';",
 " if(r63Mode!=='BASE'&&r63Mode!=='HIDE_REAL_WATER_Y93')throw Error('Invalid R63 research mode');",
 ' if(r12Skip===null){',
 "  if(r63Mode==='BASE')gl.drawArrays(gl.TRIANGLES,0,k4ctR9MaterialVertexCount);",
 '  else for(const [first,count] of K4CT_R63_Y93_DRAW_SPANS)gl.drawArrays(gl.TRIANGLES,first,count);',
 ' }else{'
].join('\n');
assert.equal(s.split(before).length,2,'R63 exact original draw anchor absent');
s=s.replace(before,after);
const status=" canvas.dataset.k4ctR12SkippedGroup=r12Skip??'ALL';";
assert.equal(s.split(status).length,2,'R63 drawing status anchor absent');
s=s.replace(status,
 " canvas.dataset.k4ctR63WaterDrawMode=r12Skip===null?r63Mode:'GROUP19_CONTROL';\n"+
 " canvas.dataset.k4ctR63ProtectedY93Triangles='144';\n"+
 status);
fs.writeFileSync(file,s);
console.log('R63_SOURCE_WATER_Y93_DRAW_MASK_READY',JSON.stringify({
 surfaceTriangles:water.length,sourceGroup:waterName,drawCalls:spans.length,
 sourceOriginalB48:7,sourceOriginalB51:28,newColliders:0,
 noOriginalMeshChanges:true}));

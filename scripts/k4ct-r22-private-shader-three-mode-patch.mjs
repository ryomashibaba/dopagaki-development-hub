/**
 * R22: PRIVATE-copy ONLY, original source R9 shader controlled 0/1/2 A-B.
 * A/B is at SAME frozen original native 240Hz tick + genuine WebGL2 depth.
 * Original Game, source solver, camera, B48/B51, Blend meshes and production
 * renderer are never edited. This is not PBR or production ART acceptance.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const dccDir='test-results/k4ct-contact-retry/';
const r9=JSON.parse(fs.readFileSync(dccDir+'K4CT_R9_BLENDER_TRUE_MATERIAL_BRIDGE.json'));
const dcc=JSON.parse(fs.readFileSync(dccDir+'K4CT_DCC_BLENDER_TO_NATIVE_GEOMETRY.json'));
const r22=JSON.parse(fs.readFileSync(
 'test-results/k4ct-r22-proofs/K4CT_R22_REAL_R21_BLENDER_BRIDGE_SHA256_PROVENANCE.json'));
assert(r22.reconstructedTrueR21BridgeExactlyByteIdentical);
assert.equal(r22.reconstructedR9Sha256,r22.R21GenuineBridgeSha256);
assert.equal(r9.r21ActualBlenderNodeSemanticsProven,true);
assert.equal(dcc.triangles,25700);assert.equal(Object.keys(dcc.objects).length,43);
assert.equal(dcc.originalB48,7);assert.equal(dcc.originalB51,28);assert.equal(dcc.newColliders,0);
const game=fs.readFileSync('web/p101-w9c2-g4e7ci-integrated-streetscape.mjs');
assert.equal(crypto.createHash('sha1').update(Buffer.concat([
 Buffer.from('blob '+game.length+'\0'),game])).digest('hex'),
 'af076d67492a677d2235e4730aef8cdf4808e106');
const file='dist-private/k4ct/drive3d.mjs';
let s=fs.readFileSync(file,'utf8');
assert(s.includes("R9_REAL_BLENDER_ATTRIBUTES_SOURCE_SAFE"));
assert(!s.includes('k4ctR22HarborTest'));
const names=(prefix)=>r9.materials.filter(m=>m.name.startsWith(prefix));
const harbor=names('harbor_');
assert.equal(harbor.length,12);
const water=harbor.filter(m=>['harbor_abyss','harbor_tidal_steel','harbor_swell'].includes(m.name));
assert.equal(water.length,3);
const expr=xs=>xs.map(x=>'ID=='+x.id).join('||');
function replaceUnique(a,b){
 assert.equal(s.split(a).length,2,'R22 original PRIVATE shader anchor missing/duplicated: '+a.slice(0,100));
 s=s.replace(a,b);
}
replaceUnique("const k4ctR9FS=[",
  "const k4ctR22HarborTest="+JSON.stringify(expr(harbor))+";\n"+
  "const k4ctR22WaterTest="+JSON.stringify(expr(water))+";\n"+
  "const k4ctR9FS=[");
replaceUnique(" 'out vec4 outColor;',\n 'void main(){vec3 n=normalize(N),v=normalize(E);',",
 " 'out vec4 outColor;uniform int r22Mode;',\n 'void main(){vec3 n=normalize(N),v=normalize(E);',");
replaceUnique(" 'bool sea=('+k4ctR9SeaTest+');',",
 " 'bool sea=('+k4ctR9SeaTest+');',\n"+
 " 'bool harbor=('+k4ctR22HarborTest+');bool harborWater=('+k4ctR22WaterTest+');',");
replaceUnique(" 'rgb=mix(rgb,vec3(.115,.168,.192),H);',",
 " 'if(r22Mode>0&&harbor){float nv=max(0.,dot(n,v));',\n"+
 " 'vec3 halfV=normalize(v+sun);float nh=max(0.,dot(n,halfV));',\n"+
 " 'float micro=pow(nh,mix(110.,5.,clamp(R,0.,1.)));',\n"+
 " 'float f0=mix(.04,.70,clamp(M,0.,1.));float F=f0+(1.-f0)*pow(1.-nv,5.);',\n"+
 " 'rgb=C*(.32+.61*sunlight)*(1.-.16*M)+mix(vec3(.88,.93,1.),C,.50*M)*micro*(.14+2.2*F)*(1.-.25*R);}',\n"+
 " 'if(r22Mode==2&&harborWater){float graze=pow(1.-max(0.,dot(n,v)),3.);',\n"+
 " 'float ripple=.012*sin(UV.x*4.+UV.y*3.)*cos(UV.y*5.);',\n"+
 " 'vec3 coast=C*(.48+.22*sunlight)+vec3(.16,.25,.30)*(.38*graze)+vec3(ripple);',\n"+
 " 'rgb=mix(rgb,coast,.45);}',\n"+
 " 'rgb=mix(rgb,vec3(.115,.168,.192),H);',");
replaceUnique(" const L=k4ctR9Locations;\n gl.uniform3fv(L.eye,view.eye);",
 " const L=k4ctR9Locations;\n"+
 " const R22mode=window.__k4ctR22ShaderMode??0;\n"+
 " if(!Number.isInteger(R22mode)||R22mode<0||R22mode>2)throw Error('R22 invalid shader mode');\n"+
 " gl.uniform1i(L.r22Mode,R22mode);\n"+
 " canvas.dataset.k4ctR22ShaderMode=String(R22mode);\n"+
 " gl.uniform3fv(L.eye,view.eye);");
replaceUnique("canvas.dataset.k4ctR9MaterialProgram='R9_REAL_BLENDER_ATTRIBUTES_SOURCE_SAFE';",
 "k4ctR9Locations.r22Mode=gl.getUniformLocation(k4ctR9MaterialProgram,'r22Mode');\n"+
 "if(k4ctR9Locations.r22Mode===null)throw Error('R22 shader uniform unlinked');\n"+
 "canvas.dataset.k4ctR9MaterialProgram='R9_REAL_BLENDER_ATTRIBUTES_SOURCE_SAFE';");
assert(s.includes('if(r22Mode==2&&harborWater)'));
assert.equal((s.match(/__k4ctR22ShaderMode/g)||[]).length,1);
fs.writeFileSync(file,s);
fs.mkdirSync('test-results/k4ct-r22-proofs',{recursive:true});
const record={
 schema:'k4ct-r22-original-private-generated-webgl2-shader-only-three-modes-v1',
 trueR21MaterialBridgeSha256:r22.reconstructedR9Sha256,
 originalR20GeometryExactlyReused:true,
 originalGameGitBlob:'af076d67492a677d2235e4730aef8cdf4808e106',
 actualBlenderGroups:43,actualTriangles:25700,originalB48:7,originalB51:28,newColliders:0,
 harborMaterialIds:harbor.map(x=>({name:x.name,id:x.id})),
 waterMaterialIds:water.map(x=>({name:x.name,id:x.id})),
 originalWebGL2ShaderMode0UnalteredExpressions:true,
 mode1:'PRIVATE study material-response',
 mode2:'PRIVATE mode1 plus actual harbor-water recognition',
 productionAndOriginalSourceShadersNeverModified:true,
 noPBR:true,noFormalART:true,
 outputGeneratedPrivatePath:file
};
fs.writeFileSync('test-results/k4ct-r22-proofs/K4CT_R22_PRIVATE_SHADER_ONLY_PATCH.json',JSON.stringify(record,null,2)+'\n');
console.log('R22_REAL_BLENDER_MARINE_SHADER_PRIVATE_ONLY_READY',JSON.stringify({
groups:43,triangles:25700,harborIDs:harbor.map(x=>x.id),
waterIDs:water.map(x=>x.id)}));

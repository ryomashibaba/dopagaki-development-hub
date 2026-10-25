/**
 * G4E-7BK isolated GLB2 material renderer for PRIVATE visual proof.
 * PBR metallic-roughness factors are read from authentic GLB. Lighting
 * is a focused physically inspired study, NOT full glTF/PBR conformance.
 * No textures, animation, indices or nodes beyond authored world-space
 * triangle mesh in this first study. Fail CLOSED for unsupported features.
 */
const u32=(v,o)=>v.getUint32(o,true);
export function parseBKGLB(source,{expectedRoad}={}){
 if(!(source instanceof ArrayBuffer))throw Error('BK requires GLB ArrayBuffer');
 if(source.byteLength<32||source.byteLength>16000000)throw Error('BK wrong GLB size');
 const dv=new DataView(source);
 if(u32(dv,0)!==0x46546c67||u32(dv,4)!==2||u32(dv,8)!==source.byteLength)throw Error('BK GLB2 header mismatch');
 let pos=12,json=null,bin=null;
 while(pos+8<=source.byteLength){
  const count=u32(dv,pos),kind=u32(dv,pos+4);pos+=8;
  if(count%4||count<4||pos+count>source.byteLength)throw Error('BK GLB malformed chunk');
  if(kind===0x4e4f534a){
   if(json)throw Error('BK duplicate JSON');
   json=JSON.parse(new TextDecoder().decode(new Uint8Array(source,pos,count)).trim());
  }
  if(kind===0x004e4942){
   if(bin)throw Error('BK duplicate BIN');
   bin=new Uint8Array(source,pos,count);
  }
  pos+=count;
 }
 if(pos!==source.byteLength||!json||!bin||json.asset?.version!=='2.0')throw Error('BK missing real binary glTF2');
 const meta=json.extras,mesh=json.meshes?.[0];
 if(meta?.schema!=='dopagaki.g4e7bk-private-material-city/1'||meta.realB48!==7||
  meta.realB51!==28||meta.genuineCell52!==true||meta.officialSlope2Meters!==0||
  meta.publication!=='HOLD'||meta.artApproval!=='HOLD'||
  (expectedRoad&&meta.road!==expectedRoad)||
  !['true-pinch','pinch-switch'].includes(meta.road))
  throw Error('BK GLB asset provenance is not canonical protected BC');
 if(json.buffers?.length!==1||!mesh||json.meshes.length!==1||
   !json.nodes?.length||json.animations||json.skins||json.images||json.textures)
  throw Error('BK scene contains unsupported geometry or textures');
 if(!Array.isArray(json.materials)||json.materials.length!==6||
  !Array.isArray(mesh.primitives)||mesh.primitives.length<5)throw Error('BK missing six actual material zones');
 const materials=json.materials.map(m=>{
  const p=m.pbrMetallicRoughness;
  if(!p||!Array.isArray(p.baseColorFactor)||p.baseColorFactor.length!==4||
   !Array.isArray(m.emissiveFactor)||m.emissiveFactor.length!==3||
   p.baseColorFactor.some(x=>!Number.isFinite(x)||x<0||x>1)||
   m.emissiveFactor.some(x=>!Number.isFinite(x)||x<0||x>1))throw Error('BK invalid glTF2 material');
  return {name:m.name,base:p.baseColorFactor.slice(0,3),
   metal:p.metallicFactor,rough:p.roughnessFactor,emissive:m.emissiveFactor};
 });
 const accessor=(id)=>{
  const a=json.accessors?.[id],v=json.bufferViews?.[a?.bufferView];
  if(a?.type!=='VEC3'||a.componentType!==5126||a.count<3||a.count>300000||
   a.byteOffset||v?.buffer!==0||v.byteStride)throw Error('BK unsupported accessor');
  const start=(v.byteOffset||0),bytes=a.count*12;
  if(start%4||bytes>v.byteLength||start+bytes>bin.length)throw Error('BK accessor outside real BIN');
  return new Float32Array(source,bin.byteOffset+start,a.count*3);
 };
 let count=0;const primitives=mesh.primitives.map(p=>{
  if(p.mode!==4||p.indices!==undefined||!materials[p.material]||
    p.attributes?.POSITION===undefined||p.attributes?.NORMAL===undefined)throw Error('BK unsupported primitive');
  const positions=accessor(p.attributes.POSITION),normals=accessor(p.attributes.NORMAL);
  if(positions.length!==normals.length||positions.length%9||
    positions.some(x=>!Number.isFinite(x))||normals.some(x=>!Number.isFinite(x)))
    throw Error('BK nonfinite material mesh');
  const vertices=positions.length/3;
  const data=new Float32Array(vertices*6);
  for(let i=0;i<vertices;i++){data.set(positions.subarray(i*3,i*3+3),i*6);data.set(normals.subarray(i*3,i*3+3),i*6+3);}
  count+=vertices/3;
  return {material:p.material,vertices,data};
 });
 if(count<600||count>55000)throw Error('BK not a meaningful correctly bounded GLB scene');
 return {meta,materials,primitives,triangles:count,glbByteLength:source.byteLength};
}
const VERT=`#version 300 es
precision highp float;
layout(location=4) in vec3 p;
layout(location=5) in vec3 n;
uniform vec3 eye,camRight,camUp,camFront;
uniform float aspect;
out vec3 worldNormal;
out vec3 worldRelative;
void main(){
 vec3 w=p-eye;
 float x=dot(w,camRight), y=dot(w,camUp), z=dot(w,camFront);
 gl_Position=vec4(1.35*x/aspect,1.35*y,1.00022*z-1.30014,z);
 worldNormal=normalize(n);worldRelative=w;
}`;
const FRAG=`#version 300 es
precision highp float;
in vec3 worldNormal;
in vec3 worldRelative;
uniform vec3 base,emissive,camFront;
uniform float metal,roughness,fogStrength;
out vec4 outColor;
void main(){
 vec3 n=normalize(worldNormal);
 vec3 sun=normalize(vec3(-0.43,0.85,0.28));
 vec3 bounce=normalize(vec3(0.62,0.32,-0.73));
 float daylight=max(dot(n,sun),0.0);
 float skylight=max(n.y,0.0)*0.42;
 float secondary=max(dot(n,bounce),0.0)*0.22;
 float reverse=max(dot(n,-sun),0.0)*0.13;
 vec3 halfV=normalize(sun-normalize(worldRelative));
 float shine=pow(max(dot(n,halfV),0.0),mix(8.0,95.0,1.0-roughness));
 vec3 diffuse=base*(0.25+0.72*daylight+skylight+secondary+reverse);
 vec3 specular=mix(vec3(0.06),base,metal)*shine*(0.5+1.15*metal);
 vec3 color=diffuse+specular+emissive*1.28;
 float haze=clamp((length(worldRelative)-520.0)/1900.0,0.0,0.72)*fogStrength;
 color=mix(color,vec3(0.019,0.041,0.083),haze);
 outColor=vec4(clamp(color,0.0,1.0),1.0);
}`;
function shader(gl,kind,source){
 const s=gl.createShader(kind);gl.shaderSource(s,source);gl.compileShader(s);
 if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){
  const error=gl.getShaderInfoLog(s);gl.deleteShader(s);throw Error('BK shader '+error);
 }
 return s;
}
export function createBKLitScene(gl,source,options){
 const parsed=parseBKGLB(source,options);
 const vs=shader(gl,gl.VERTEX_SHADER,VERT),fs=shader(gl,gl.FRAGMENT_SHADER,FRAG);
 const program=gl.createProgram();
 gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
 gl.deleteShader(vs);gl.deleteShader(fs);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
  const error=gl.getProgramInfoLog(program);gl.deleteProgram(program);throw Error('BK program '+error);
 }
 const meshes=parsed.primitives.map(p=>{
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ARRAY_BUFFER,p.data,gl.STATIC_DRAW);
  return {buffer,count:p.vertices,mat:parsed.materials[p.material]};
 });
 const uniforms={};
 for(const name of ['eye','camRight','camUp','camFront','aspect','base','emissive','metal','roughness','fogStrength'])
  uniforms[name]=gl.getUniformLocation(program,name);
 return {...parsed,meshes,program,uniforms};
}
export function renderBKLitScene(gl,model,view,aspect,{fogStrength=1}={}){
 if(!model)return;
 const last=gl.getParameter(gl.CURRENT_PROGRAM);gl.useProgram(model.program);
 const u=model.uniforms;
 gl.uniform3fv(u.eye,view.eye);gl.uniform3fv(u.camRight,view.right);
 gl.uniform3fv(u.camUp,view.up);gl.uniform3fv(u.camFront,view.front);
 gl.uniform1f(u.aspect,aspect);gl.uniform1f(u.fogStrength,fogStrength);
 gl.enableVertexAttribArray(4);gl.enableVertexAttribArray(5);
 for(const mesh of model.meshes){
  gl.uniform3fv(u.base,mesh.mat.base);gl.uniform3fv(u.emissive,mesh.mat.emissive);
  gl.uniform1f(u.metal,mesh.mat.metal);gl.uniform1f(u.roughness,mesh.mat.rough);
  gl.bindBuffer(gl.ARRAY_BUFFER,mesh.buffer);
  gl.vertexAttribPointer(4,3,gl.FLOAT,false,24,0);
  gl.vertexAttribPointer(5,3,gl.FLOAT,false,24,12);
  gl.drawArrays(gl.TRIANGLES,0,mesh.count);
 }
 gl.disableVertexAttribArray(4);gl.disableVertexAttribArray(5);
 gl.useProgram(last);
}
export function releaseBKLitScene(gl,model){
 if(!model)return;
 for(const mesh of model.meshes)gl.deleteBuffer(mesh.buffer);
 gl.deleteProgram(model.program);
}

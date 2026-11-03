import test from 'node:test';
import assert from 'node:assert/strict';
import {K4AU_CONTRACT,createK4AULight,renderK4AULitRoad,renderK4AULitB51,
 releaseK4AULight} from '../web/p101-k4au-original-native-material-lighting.mjs';
function fakeGL(){
 const state={program:{prior:1},buffer:{prior:2},draws:[],uniforms:{},attribs:[]};
 const gl={
  VERTEX_SHADER:35633,FRAGMENT_SHADER:35632,COMPILE_STATUS:35713,LINK_STATUS:35714,
  CURRENT_PROGRAM:35725,ARRAY_BUFFER_BINDING:34964,ARRAY_BUFFER:34962,
  FLOAT:5126,TRIANGLES:4,
  createProgram:()=>({created:1}),createShader:type=>({type}),
  shaderSource(s,code){s.code=code;},compileShader(){},
  getShaderParameter:()=>true,getShaderInfoLog:()=>'',attachShader(){},linkProgram(){},
  deleteShader(){},deleteProgram(p){state.deleted=p;},
  getProgramParameter:()=>true,getProgramInfoLog:()=>'',getUniformLocation(_p,name){return name;},
  getParameter(p){return p===35725?state.program:state.buffer;},
  useProgram(p){state.program=p;},bindBuffer(_type,b){state.buffer=b;},
  enableVertexAttribArray(i){state.attribs.push(['enable',i]);},
  disableVertexAttribArray(i){state.attribs.push(['disable',i]);},
  vertexAttribPointer(i,size,type,norm,stride,offset){
   state.attribs.push(['pointer',i,size,type,norm,stride,offset]);
  },
  uniform3fv(name,v){state.uniforms[name]=[...v];},
  uniform1f(name,v){state.uniforms[name]=v;},
  uniform1i(name,v){state.uniforms[name]=v;},
  drawArrays(type,start,count){state.draws.push({type,start,count});}
 };
 return {gl,state};
}
const view={eye:[1010,153,-254],right:[1,0,0],up:[0,1,0],front:[0,0,-1]};
const sourceMesh={buffer:{realGpuMesh:true},count:258};
test('K4AU strict source contract keeps camera, real B48/B51, all gates HOLD',()=>{
 assert.equal(K4AU_CONTRACT.nativeHz,240);
 assert.equal(K4AU_CONTRACT.sourceB48,7);
 assert.equal(K4AU_CONTRACT.sourceB51,28);
 assert.equal(K4AU_CONTRACT.originalCamera,true);
 assert.equal(K4AU_CONTRACT.geometryChanged,false);
 assert.equal(K4AU_CONTRACT.collidersAdded,0);
 assert.equal(K4AU_CONTRACT.formalArtAccepted,0);
 for(const key of ['ART','HUMAN','SAT','CCD','FPS','RELEASE','MERGE'])
  assert.match(K4AU_CONTRACT[key],/HOLD/);
});
test('K4AU road is drawn through exact source native buffer, world XYZ unchanged',()=>{
 const {gl,state}=fakeGL(),scene=createK4AULight(gl),old=state.program;
 renderK4AULitRoad(gl,scene,sourceMesh,view,1365/930,
  {enabled:true,start:120,span:880});
 assert.equal(state.draws.length,1);
 assert.deepEqual(state.draws[0],{type:4,start:0,count:258});
 assert.deepEqual(state.uniforms.translation,[0,0,0]);
 assert.deepEqual(state.uniforms.modelScale,[1,1,1]);
 assert.equal(state.uniforms.yaw,0);
 assert.equal(state.uniforms.objectType,0);
 assert.deepEqual(state.uniforms.cameraEye,view.eye);
 assert.equal(state.uniforms.fogStart,120);
 assert.equal(state.program,old);
 assert.equal(state.buffer?.prior,2);
 releaseK4AULight(gl,scene);assert.equal(state.deleted,scene.program);
});
test('K4AU dynamic machine follows true native OBB center, yaw, halfSize exactly',()=>{
 const {gl,state}=fakeGL(),scene=createK4AULight(gl);
 const p={center:[1050.25,147.125,-350.5],
  halfSize:[3.25,6.5,2.75],yawRadians:-.82};
 const original=JSON.stringify(p);
 for(const [mode,index] of [['fail',0],['bounce',1],['push',2]]){
  renderK4AULitB51(gl,scene,sourceMesh,view,1.46,p,mode,{enabled:false});
  assert.equal(state.uniforms.objectType,1);
  assert.equal(state.uniforms.hazardMode,index);
  assert.deepEqual(state.uniforms.translation,p.center);
  assert.deepEqual(state.uniforms.modelScale,[6.5,13,5.5]);
  assert.equal(state.uniforms.yaw,-.82);
  assert.equal(state.draws.at(-1).count,258);
 }
 assert.equal(JSON.stringify(p),original);
 assert.equal(state.draws.length,3);
});
test('K4AU rejects fake B51 poses and untrusted camera and modes',()=>{
 const {gl}=fakeGL(),scene=createK4AULight(gl);
 const p={center:[2,3,4],halfSize:[1,2,3],yawRadians:0};
 assert.throws(()=>renderK4AULitB51(gl,scene,sourceMesh,view,1.46,p,'bonus'),/BAD ORIGINAL B51/);
 assert.throws(()=>renderK4AULitB51(gl,scene,sourceMesh,view,1.46,
  {...p,center:[Infinity,1,1]},'fail'),/TRUE ORIGINAL B51/);
 assert.throws(()=>renderK4AULitB51(gl,scene,sourceMesh,view,1.46,
  {...p,halfSize:[0,1,1]},'fail'),/TRUE ORIGINAL B51/);
 assert.throws(()=>renderK4AULitRoad(gl,scene,sourceMesh,
  {...view,eye:[NaN,3,2]},1.46),/ORIGINAL CAMERA/);
 assert.throws(()=>renderK4AULitRoad(gl,scene,sourceMesh,view,0),/MISSING REAL NATIVE/);
});

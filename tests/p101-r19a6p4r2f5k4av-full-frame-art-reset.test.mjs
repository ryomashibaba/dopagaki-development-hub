import test from 'node:test';
import assert from 'node:assert/strict';
import {K4AV_CONTRACT,buildK4AVRoad5Environment}
 from '../web/p101-k4av-road5-full-screen-civic-environment.mjs';
import {K4AV_SKY,createK4AVAtmosphere,renderK4AVAtmosphere}
 from '../web/p101-k4av-civic-basin-atmosphere.mjs';
const id='p93-PRISM_CREST-01';
function doc(){
 return {surfaces:Array.from({length:7},(_,i)=>({
    id:i===5?id:'ROAD-'+i,rows:31,resolution:1,cols:5,
    voidLongitudinalCells:[],visible:true,rideable:true})),
  movingObstacles:Array.from({length:28},(_,i)=>({id:'B51-'+i})),
  stageForge:{productionPromoted:false}};
}
function sample(_s,u,v){return [900+(u-.5)*600,105+3*u,
 -321-(u-.5)*380+(v-.5)*40];}
test('K4AV creates a full-screen genuinely Road5-grounded city without changing source physics',()=>{
 const d=doc(),before=JSON.stringify(d);
 const art=buildK4AVRoad5Environment(d,sample,{enabled:true});
 assert.equal(art.active,true);
 assert.ok(art.triangles>6000);
 assert.equal(art.vertices.length,art.triangles*21);
 assert.ok(art.vertices.every(Number.isFinite));
 assert.ok(art.originalRoad5Distance<350);
 assert.equal(art.sourceRoad,id);
 assert.equal(art.newColliders,0);
 assert.equal(art.originalPhysicsChanged,false);
 assert.equal(art.originalCameraChanged,false);
 assert.equal(JSON.stringify(d),before);
 assert.equal(art.ART,'NOT_TESTED_HOLD');
 const names=art.elements.map(v=>v.name);
 for(const name of ['CIVIC_GALLERY_OPEN_TERRACES','ASYMMETRIC_HALL_ROOF',
  'METROPOLITAN_STATION_PODIUM','FOUR_INTERLOCKED_PUBLIC_COURTS',
  'OCCUPIED_TAPERING_TOWER','STEPPED_CLIMATE_OFFICE_TOWER'])
  assert.ok(names.includes(name),name);
});
test('K4AV source void support stays absent, no invented road across gaps',()=>{
 const original=doc(),before=buildK4AVRoad5Environment(original,sample,{enabled:true});
 original.surfaces[5].voidLongitudinalCells=Array.from({length:31},(_,i)=>i);
 const allVoid=buildK4AVRoad5Environment(original,sample,{enabled:true});
 assert.ok(before.visibleEdgeSegments>0);
 assert.equal(allVoid.visibleEdgeSegments,0);
 assert.equal(allVoid.newColliders,0);
});
test('K4AV rejects any changed Road5 source, B48/B51 count and production promotion',()=>{
 for(const alter of [
  d=>d.surfaces.pop(),d=>d.movingObstacles.pop(),
  d=>d.surfaces[5].id='WRONG',d=>d.stageForge.productionPromoted=true
 ]){
  const x=doc();alter(x);
  assert.throws(()=>buildK4AVRoad5Environment(x,sample,{enabled:true}),/GUARD/);
 }
});
test('K4AV false visual success is blocked on invalid source samples',()=>{
 assert.equal(buildK4AVRoad5Environment(doc(),sample).active,false);
 assert.throws(()=>buildK4AVRoad5Environment(doc(),()=>[NaN,2,3],{enabled:true}),
  /GROUNDED|INVALID|SOURCE/);
 assert.equal(K4AV_CONTRACT.officialARTAccepted,0);
 assert.equal(K4AV_CONTRACT.slope2DNAMetres,0);
 assert.equal(K4AV_CONTRACT.ART,'NOT_TESTED_HOLD');
 assert.equal(K4AV_SKY.originalSourceChanged,false);
});
test('K4AV atmosphere uses original camera pitch and restores graphics depth',()=>{
 const gl={
  VERTEX_SHADER:35633,FRAGMENT_SHADER:35632,COMPILE_STATUS:35713,
  LINK_STATUS:35714,CURRENT_PROGRAM:35725,DEPTH_TEST:2929,
  DEPTH_WRITEMASK:2930,TRIANGLES:4,
  createShader:type=>({type}),shaderSource(s,v){s.src=v;},compileShader(){},
  getShaderParameter:()=>true,getShaderInfoLog:()=>'',createProgram:()=>({newProgram:1}),
  attachShader(){},linkProgram(){},deleteShader(){},getProgramParameter:()=>true,
  getProgramInfoLog:()=>'',getUniformLocation(_p,n){return n;},
  getParameter(n){return n===35725?'oldProgram':true;},
  isEnabled:()=>true,depthMask(v){this.mask=v;},disable(){this.depth=false;},
  enable(){this.depth=true;},useProgram(p){this.active=p;},
  uniform1f(n,v){this[n]=v;},drawArrays(kind,zero,count){
   this.drawn={kind,zero,count};
  }
 };
 const sky=createK4AVAtmosphere(gl);
 renderK4AVAtmosphere(gl,sky,{front:[.5,-.1,.86]},1.48);
 assert.deepEqual(gl.drawn,{kind:4,zero:0,count:3});
 assert.equal(gl.cameraPitch,-.1);
 assert.equal(gl.active,'oldProgram');
 assert.equal(gl.mask,true);assert.equal(gl.depth,true);
});

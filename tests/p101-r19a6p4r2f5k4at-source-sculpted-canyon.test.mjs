import test from 'node:test';
import assert from 'node:assert/strict';
import {K4AT_DESIGN,buildK4ATCivicCanyon,buildK4ATInlaidRoad}
 from '../web/p101-k4at-road5-sculpted-civic-canyon.mjs';
const target='p93-PRISM_CREST-01';
function doc(){
 return {
  surfaces:Array.from({length:7},(_,i)=>({
   id:i===5?target:'ROAD-'+i,rows:31,resolution:1,cols:5,
   voidLongitudinalCells:[],collidable:true,rideable:true
  })),
  movingObstacles:Array.from({length:28},(_,i)=>({id:'B51-'+i})),
  stageForge:{productionPromoted:false}
 };
}
function sample(_r,u,v){return [900+(u-.5)*600,105+3*u,
 -321-(u-.5)*380+(v-.5)*40];}
function frame(){return {normal:[0,1,0]};}
test('K4AT Road5 sculptural public canyon has REAL open 3D atria and original source grounding',()=>{
 const d=doc(),frozen=JSON.stringify(d);
 const a=buildK4ATCivicCanyon(d,sample,{enabled:true});
 assert.equal(a.active,true);assert.equal(a.newColliders,0);
 assert.equal(a.changedPhysics,false);assert.equal(a.sourceRoad,target);
 assert.equal(a.groundedInSourceRoad,true);
 assert.ok(a.anchorRoadXYDistance<350);
 assert.ok(a.triangles>1000&&a.triangles<90000);
 assert.equal(a.vertices.length,a.triangles*21);
 assert.ok(a.vertices.every(Number.isFinite));
 assert.ok(a.programs.some(p=>p.name==='CURVED_THICK_CIVIC_SHELL'));
 assert.ok(a.programs.some(p=>p.name==='TAPERED_CIVIC_NEEDLE'));
 assert.ok(a.programs.some(p=>p.terraces?.name==='OCCUPIED_FIVE_LEVEL_PUBLIC_ATRIA'));
 assert.equal(a.officialARTAccepted,0);
 assert.equal(a.ART,'NOT_TESTED_HOLD');
 assert.equal(JSON.stringify(d),frozen);
});
test('K4AT source-grounded inlays follow actual B48 vertices, no visual collision',()=>{
 const d=doc(),frozen=JSON.stringify(d);
 const x=buildK4ATInlaidRoad(d,sample,frame,{enabled:true});
 assert.equal(x.newColliders,0);assert.equal(x.changedPhysics,false);
 assert.equal(x.sourceRoad,target);assert.ok(x.triangles>=400);
 assert.equal(x.vertices.length,x.triangles*18);
 assert.ok(x.vertices.every(Number.isFinite));
 assert.equal(JSON.stringify(d),frozen);
});
test('K4AT obeys void longitudinal cells instead of drawing bridges',()=>{
 const d=doc(),b=buildK4ATInlaidRoad(d,sample,frame,{enabled:true});
 d.surfaces[5].voidLongitudinalCells=Array.from({length:30},(_,i)=>i);
 const blocked=buildK4ATInlaidRoad(d,sample,frame,{enabled:true});
 assert.ok(blocked.triangles<b.triangles);
});
test('K4AT rejects untrusted road, moving hazard and production changes',()=>{
 for(const mutator of [
   d=>d.surfaces.pop(),
   d=>d.surfaces[5].id='WRONG',
   d=>d.movingObstacles.pop(),
   d=>d.stageForge.productionPromoted=true
 ]){
  const x=doc();mutator(x);
  assert.throws(()=>buildK4ATCivicCanyon(x,sample,{enabled:true}),/GUARD/);
  assert.throws(()=>buildK4ATInlaidRoad(x,sample,frame,{enabled:true}),/GUARD/);
 }
});
test('K4AT rejects source geometry/normal corruption and never automatically approves ART',()=>{
 const empty=buildK4ATCivicCanyon(doc(),sample);
 assert.equal(empty.active,false);
 const bad=(_r,u,v)=>[Infinity,0,v];
 assert.throws(()=>buildK4ATCivicCanyon(doc(),bad,{enabled:true}),/SOURCE|INVALID|NO GENUINE|CANNOT GROUND/);
 assert.throws(()=>buildK4ATInlaidRoad(doc(),sample,()=>({normal:[NaN,1,0]}),{enabled:true}),/INVALID/);
 assert.equal(K4AT_DESIGN.officialARTAccepted,0);
 assert.equal(K4AT_DESIGN.slope2DNAMetres,0);
 assert.equal(K4AT_DESIGN.ART,'NOT_TESTED_HOLD');
 assert.equal(K4AT_DESIGN.RELEASE,'HOLD');
});

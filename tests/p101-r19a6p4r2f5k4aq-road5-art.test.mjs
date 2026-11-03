import test from 'node:test';
import assert from 'node:assert/strict';
import {
 K4AQ_CONTRACT,K4AQ_MATERIALS,buildK4AQRoad5Art
} from '../web/p101-k4aq-road5-civic-rift-material-art.mjs';
function doc(){
 const surfaces=Array.from({length:7},(_,i)=>({id:i===5?'p93-PRISM_CREST-01':'road-'+i,physical:true}));
 return {stageForge:{productionPromoted:false},surfaces,
  movingObstacles:Array.from({length:28},(_,i)=>({id:'hazard-'+i}))};
}
const sample=(road,u,lateral)=>[u*1600,0,(lateral-.5)*28];
test('K4AQ intentional candidate only, immutable original physics document',()=>{
 const d=doc(),frozen=JSON.stringify(d),orig=buildK4AQRoad5Art(d,sample,{enabled:false});
 assert.equal(orig.active,false);
 const art=buildK4AQRoad5Art(d,sample,{enabled:true});
 assert.equal(JSON.stringify(d),frozen);
 assert.equal(art.active,true);
 assert.equal(art.sourceRoad,'p93-PRISM_CREST-01');
 assert.equal(art.districts.length,4);
 assert.equal(art.skylineCount,11);
 assert.ok(art.triangles>=1000);
 assert.equal(art.vertices.length,art.triangles*3*7);
 assert.ok(art.vertices.every(Number.isFinite));
 const used=new Set(art.vertices.filter((_,i)=>i%7===6));
 assert.ok(used.size>=6,'at least six material classes actually assigned');
 assert.equal(art.newRoads,0);assert.equal(art.newColliders,0);
 assert.equal(art.newMovingHazards,0);assert.equal(art.changedPhysics,false);
 assert.equal(art.ART,'NOT_TESTED_HOLD');
 assert.equal(art.officialARTAccepted,0);assert.equal(art.slope2DNAMetres,0);
});
test('K4AQ refuses wrong road, absent original machine, or promoted stage',()=>{
 for(const mutation of [
   d=>{d.surfaces[5].id='FAKE_ROAD';},
   d=>{d.movingObstacles.pop();},
   d=>{d.stageForge.productionPromoted=true;},
   d=>{d.surfaces.pop();}
 ]){
  const d=doc();mutation(d);
  assert.throws(()=>buildK4AQRoad5Art(d,sample,{enabled:true}),/FROZEN ROAD5/);
 }
});
test('K4AQ material design roles are distinct and bounded',()=>{
 assert.equal(K4AQ_MATERIALS.length,8);
 assert.equal(K4AQ_CONTRACT.sourceBlob,'af076d67492a677d2235e4730aef8cdf4808e106');
 assert.ok(K4AQ_MATERIALS.some(x=>x.name==='smoked-blue-glass'&&x.rough<.3));
 assert.ok(K4AQ_MATERIALS.some(x=>x.name==='warm-interior-light'&&x.emit>.5));
 assert.ok(K4AQ_MATERIALS.some(x=>x.name==='porcelain-limestone'&&x.rough>.8));
 for(const m of K4AQ_MATERIALS){
  assert.ok(m.color.every(c=>c>=0&&c<=1));
  assert.ok(m.metal>=0&&m.metal<=1);
  assert.ok(m.rough>=0&&m.rough<=1);
 }
});

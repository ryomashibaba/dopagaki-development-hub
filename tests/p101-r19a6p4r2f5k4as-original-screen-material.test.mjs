import test from 'node:test';
import assert from 'node:assert/strict';
import {
 K4AS_CONTRACT,k4asMatteRoadSurface,k4asQuietRoadArmour,
 k4asEdgeWayfinding,k4asMachineryMaterial,
 k4asScreenMaterialEligibility,k4asIsActualRoad5Visible
} from '../web/p101-k4as-road5-original-screen-material-system.mjs';
const points=[[0,1,2],[3,4,5],[7,8,9]];
function triangles(c){return points.flatMap(p=>[...p,...c]);}
function firstColor(v){return v.slice(3,6);}
function sourceInvariant(a,b){
 assert.equal(a.length,b.length);
 for(let i=0;i<a.length;i++)if(i%6<3)assert.equal(b[i],a[i],
   'K4AS attempted protected original triangle vertex move');
}
function expectedDoc(){
 return {surfaces:Array.from({length:7},(_,i)=>({id:i===5?'p93-PRISM_CREST-01':String(i)})),
  movingObstacles:Array.from({length:28},(_,i)=>({id:i})),
  stageForge:{productionPromoted:false}};
}
test('K4AS protected Road5 only, no native B48/B51 writes',()=>{
 const doc=expectedDoc(),orig=JSON.stringify(doc);
 assert.equal(k4asScreenMaterialEligibility(doc),true);
 assert.equal(JSON.stringify(doc),orig);
 assert.equal(K4AS_CONTRACT.cameraModified,false);
 assert.equal(K4AS_CONTRACT.colliderModified,false);
 assert.equal(K4AS_CONTRACT.formalArtAccepted,0);
 assert.equal(K4AS_CONTRACT.slope2DNAMetres,0);
 assert.equal(K4AS_CONTRACT.ART,'NOT_TESTED_HOLD');
 for(const modify of [
  d=>d.surfaces[5].id='INVALID',
  d=>d.surfaces.pop(),
  d=>d.movingObstacles.pop(),
  d=>d.stageForge.productionPromoted=true
 ]){const t=expectedDoc();modify(t);assert.equal(k4asScreenMaterialEligibility(t),false);}
 assert.equal(k4asIsActualRoad5Visible({surface:'p93-PRISM_CREST-01'}),true);
 assert.equal(k4asIsActualRoad5Visible({surface:null,lastSurface:'p93-PRISM_CREST-01'}),true);
 assert.equal(k4asIsActualRoad5Visible({surface:'first',lastSurface:'p93-PRISM_CREST-01'}),false);
});
test('K4AS actual original road slate conversion changes colors not vertices',()=>{
 for(const [source,colorShouldChange] of [
  [[.35*.49,.85*.49,1*.49],true],
  [[.35*.62,.85*.62,1*.62],true],
  [[1,.19,.27],false], // source original DANGER fixture stays identified
  [[1,.86,.28],false] // source original REWARD fixture stays identified
 ]){
  const t=triangles(source),x=k4asMatteRoadSurface(t);
  sourceInvariant(t,x.vertices);
  assert.equal(x.changedVertices>0,colorShouldChange);
  assert.equal(x.originalVertexCount,3);
  assert.equal(x.newColliders,0);
  assert.equal(x.ART,'NOT_TESTED_HOLD');
 }
});
test('K4AS road ornament replaces saturated paints, never changes physical triangles',()=>{
 const c=triangles([1,.37,.5]);
 const q=k4asQuietRoadArmour(c);
 sourceInvariant(c,q.vertices);
 assert.equal(q.changedVertices,3);
 assert.equal(q.vertices.length,c.length);
 assert.ok(firstColor(q.vertices).every(x=>x>=0&&x<=1));
});
test('K4AS true original wireframe lines preserve all coordinates, line stride allowed',()=>{
 const c=[[0,1,2,.22,.95,1],[3,4,5,.22,.95,1]].flat();
 const a=k4asEdgeWayfinding(c);
 sourceInvariant(c,a.vertices);
 assert.equal(a.originalVertexCount,2);
 assert.equal(a.changedVertices,2);
 assert.equal(a.vertices.length,12);
});
test('K4AS actual P73 B51 fail/red, bounce/amber, push/violet semantics stay distinct',()=>{
 const original={
  fail:{body:[.36,.055,.12],light:[1,.15,.23],edge:[1,.49,.22]},
  bounce:{body:[.35,.23,.075],light:[1,.83,.21],edge:[1,.99,.56]},
  push:{body:[.24,.11,.43],light:[.79,.39,1],edge:[.38,.93,1]}
 };
 const lights=[];
 for(const mode of Object.keys(original)){
  const baseline=triangles(original[mode].body);
  const armor=k4asMachineryMaterial(baseline,mode);
  sourceInvariant(baseline,armor.vertices);
  assert.notDeepEqual(firstColor(armor.vertices),original[mode].body);
  assert.equal(armor.preservedOriginalCollision,true);
  assert.equal(armor.newColliders,0);
  const light=k4asMachineryMaterial(triangles(original[mode].light),mode);
  lights.push(firstColor(light.vertices));
  assert.ok(light.changedVertices>0);
  assert.equal(light.ART,'NOT_TESTED_HOLD');
 }
 // Preserve categorical coding: dominant red, amber, violet components.
 assert.ok(lights[0][0]>lights[0][1]&&lights[0][0]>lights[0][2]);
 assert.ok(lights[1][0]>lights[1][1]&&lights[1][1]>lights[1][2]);
 assert.ok(lights[2][2]>lights[2][0]&&lights[2][2]>lights[2][1]);
 assert.throws(()=>k4asMachineryMaterial(triangles([1,.2,.3]),'unknown'),/INVALID/);
});
test('K4AS never silently accepts corrupted renderer buffers',()=>{
 assert.throws(()=>k4asMatteRoadSurface([0,1]),/INVALID/);
 assert.throws(()=>k4asMatteRoadSurface(triangles([NaN,0,0])),/INVALID/);
 assert.throws(()=>k4asMatteRoadSurface(triangles([1.2,.6,.7])),/PALETTE|INVALID/);
});

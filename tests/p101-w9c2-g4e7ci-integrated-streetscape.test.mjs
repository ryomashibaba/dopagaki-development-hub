import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7BC} from '../scripts/p101-w9c2-g4e7bc-bank-contour.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {g4e7ciIntegratedStreetscape,g4e7cqTracePixels,g4e7crHighlightStation2Left,g4e7ctColorSourcePart} from '../web/p101-w9c2-g4e7ci-integrated-streetscape.mjs';
import {g4e7bgNativeFrames} from '../scripts/p101-w9c2-g4e7bg-native-visual-frames.mjs';
test('CI genuine 7 B48 / 28 B51 / gap52 road and physics preserved',()=>{
 for(const road of ['true-pinch','pinch-switch']){
  const doc=generateG4E7BC(road,'rollDeck'),frozen=JSON.stringify(doc);
  const shots=g4e7bgNativeFrames().stages[road].frames;
  const art=g4e7ciIntegratedStreetscape(doc,sample,{enabled:true,shots});
  assert.equal(JSON.stringify(doc),frozen);
  assert.equal(doc.surfaces.length,7);assert.equal(doc.movingObstacles.length,28);
  assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52]);
  assert.ok(art.triangles>=1000&&art.triangles<50000);
  assert.equal(art.stations,12);assert.equal(art.layers,3);
  assert.equal(art.landmarks,2);assert.equal(art.macroSilhouette,'LOW_OPEN_CONCOURSE_WITH_SPACED_ANCHORED_DISTRICTS');
  assert.equal(art.cameraEvidence,'BG240HZ_BOTH_15_AND_17_NOT_HUMAN');
  assert.equal(art.landmarksQA.length,2);
  assert.equal(art.sources.reduce((n,s)=>n+s.triangleCount,0),art.triangles);
  assert.equal(art.sources[0].firstTriangle,0);
  assert.ok(art.sources.some(x=>x.kind==='roadbank-inhabited'));
  assert.ok(art.sources.some(x=>x.kind==='anchored-civic-crescent'));
  assert.equal(art.czInhabitedSites,2);
  assert.equal(art.czCrescentQA.length,2);
  assert.ok(art.czCrescentQA.every(x=>x.floors===6&&x.openFacadeBays===18&&
   x.groundedLegs===4&&x.internalRamps===4&&x.existingPlazaConnections===2&&
   x.centralSkyVoidOpen===true));
  console.log('G4E7CZ_INHABITED_CRESCENT_QA',road,JSON.stringify(art.czCrescentQA));
  assert.ok(art.sources.some(x=>x.kind==='civic-concourse'));
  assert.equal(art.carvedFacades,true);assert.equal(art.openRearFacades,true);
  assert.equal(art.districtLinks,10);assert.ok(art.farRoofBays>=0&&art.farRoofBays<=10);
  console.log('G4E7CP_CONNECTED_SILHOUETTE_READ_ONLY',road,art.districtLinks,art.farRoofBays);
  assert.equal(art.clippedCellReliefs+art.fullDistrictCells,art.stations);
  assert.equal(art.cxNearVisionQA.length,art.stations);
  assert.equal(art.cxNearVisionQA.filter(x=>x.nearVisionVeto&&!x.originalVeto).length,
   art.cxNearVisionVetoes);
  assert.ok(art.cxNearVisionQA.every(x=>x.coverage.length===2&&
   x.coverage.every(y=>y.gridSamples===150&&Number.isFinite(y.occupiedFraction))));
  console.log('G4E7CX_NEAR_CAMERA_VISUAL_CELL_BUDGET',road,JSON.stringify(
   art.cxNearVisionQA.filter(x=>x.nearVisionVeto||x.originalVeto)));
  assert.ok(art.fullDistrictCells>=1,'at least one occupied distant district should survive camera protection');
  console.log('G4E7CO_RETAINED_VS_RELIEVED',road,art.fullDistrictCells,art.clippedCellReliefs);
  assert.ok(art.landmarksQA.every(x=>x.road===0||x.road===1));
  assert.ok(art.landmarksQA.every(x=>x.score>=0&&Number.isFinite(x.score)&&x.framesVisible>=1&&x.framesVisible<=2&&x.score>=.12));
  console.log('G4E7CM_READ_ONLY_CAMERA_SITE_EVIDENCE',road,JSON.stringify(art.landmarksQA));
  assert.equal(art.newRoads,0);assert.equal(art.newColliders,0);assert.equal(art.newMovingHazards,0);
  assert.equal(art.art,'HOLD');assert.equal(art.officialSlope2Meters,0);
 }
});
test('CI opt-in only, wrong physics denied',()=>{
 const doc=generateG4E7BC('true-pinch','rollDeck');
 assert.equal(g4e7ciIntegratedStreetscape(doc,sample,{enabled:false}).vertices.length,0);
 assert.throws(()=>g4e7ciIntegratedStreetscape(doc,sample,{enabled:true}),/CO requires both unchanged native cameras/);
 doc.movingObstacles.pop();
 assert.throws(()=>g4e7ciIntegratedStreetscape(doc,sample,{enabled:true}),/exact protected/);
});
test('CI native BG 240 Hz frames never misrepresented as human',()=>{
 const data=g4e7bgNativeFrames();
 for(const road of ['true-pinch','pinch-switch']){
  const r=data.stages[road];
  assert.equal(r.frames.length,3);assert.equal(r.actualB48,7);assert.equal(r.actualMovingB51,28);
  assert.ok(r.frames.every(x=>x.speedMps>90&&x.source.includes('NOT_HUMAN')));
 }
});

test('CQ perspective ray triangle attribution uses true projection, no mutations',()=>{
 const v=[
 -1,-1,10,.2,.5,.6,
 1,-1,10,.2,.5,.6,
 0,1,10,.2,.5,.6
 ];
 const source=[{kind:'unit-test-plane',station:1,firstTriangle:0,triangleCount:1}];
 const view={eye:[0,0,0],front:[0,0,1],right:[1,0,0],up:[0,1,0]};
 const a=g4e7cqTracePixels(v,source,view,1360,860,[[680,430],[100,100]]);
 assert.equal(a.schema,'G4E7CQ_ACTUAL_GL_PROJECTION_CPU_GEOMETRIC_CANDIDATES_NOT_PICK_BUFFER');
 assert.equal(a.probes[0].candidate.kind,'unit-test-plane');
 assert.equal(a.probes[0].candidate.source.station,1);
 assert.equal(a.probes[0].candidate.triangle,0);
 assert.equal(a.probes[1].candidate,null);
 assert.deepEqual(v,[
 -1,-1,10,.2,.5,.6,1,-1,10,.2,.5,.6,0,1,10,.2,.5,.6]);
});

test('CR private GPU source-ID recolor changes only station2 left bank vertex RGB',()=>{
 for(const road of ['true-pinch','pinch-switch']){
  const doc=generateG4E7BC(road,'rollDeck');
  const art=g4e7ciIntegratedStreetscape(doc,sample,{enabled:true,
   shots:g4e7bgNativeFrames().stages[road].frames});
  const src=art.sources.find(s=>s.station===2&&s.u===.62&&s.side===-1&&s.kind.startsWith('roadbank-'));
  assert.ok(src);
  const before=art.vertices.slice();
  const cr=g4e7crHighlightStation2Left(art);
  assert.equal(cr.triangles,src.triangleCount);
  assert.equal(cr.kind,src.kind);
  assert.equal(cr.vertices.length,before.length);
  const first=src.firstTriangle*18,last=(src.firstTriangle+src.triangleCount)*18;
  for(let i=0;i<before.length;i++){
   const colorChannel=(i%6)>=3;
   if(i>=first&&i<last&&colorChannel)
    assert.equal(cr.vertices[i],i%6===4?0:1);
   else assert.equal(cr.vertices[i],before[i]);
  }
  assert.deepEqual(art.vertices,before);
  assert.equal(art.newRoads,0);assert.equal(art.newColliders,0);
  assert.equal(art.newMovingHazards,0);
  assert.equal(art.art,'HOLD');
 }
});


test('CS fixed only proven three station2-left blue-green shelter panels',()=>{
 for(const road of ['true-pinch','pinch-switch']){
  const doc=generateG4E7BC(road,'rollDeck');
  const frozen=JSON.stringify(doc);
  const art=g4e7ciIntegratedStreetscape(doc,sample,{enabled:true,
   shots:g4e7bgNativeFrames().stages[road].frames});
  const source=art.sources.find(s=>s.station===2&&s.u===.62&&s.side===-1&&s.kind.startsWith('roadbank-'));
  assert.ok(source);
  if(road==='true-pinch'){
   assert.equal(source.kind,'roadbank-promenade');
   assert.equal(source.triangleCount,52,'CT-proven slab and 6 columns replaced by two offset supported canopies');
   const section=art.vertices.slice(source.firstTriangle*18,(source.firstTriangle+source.triangleCount)*18);
   let tealVertices=0;
   for(let k=3;k<section.length;k+=6)
    if(section[k]===.16&&section[k+1]===.53&&section[k+2]===.64)tealVertices++;
   assert.equal(tealVertices,0,'flat cyan planes must not silently return');
  }else{
   assert.ok(['roadbank-inhabited','roadbank-promenade'].includes(source.kind));
   assert.ok(source.triangleCount>0,'CX source remains authored and traceable');
  }
  assert.equal(JSON.stringify(doc),frozen);
  assert.equal(art.newRoads,0);assert.equal(art.newColliders,0);
  assert.equal(art.newMovingHazards,0);assert.equal(art.art,'HOLD');
 }
});


test('CT source-part colors isolate floor, shelters and left concourse without geometry change',()=>{
 const doc=generateG4E7BC('true-pinch','rollDeck'),frozen=JSON.stringify(doc);
 const art=g4e7ciIntegratedStreetscape(doc,sample,{enabled:true,
  shots:g4e7bgNativeFrames().stages['true-pinch'].frames});
 const promenade=art.sources.find(s=>s.kind==='roadbank-promenade'&&s.station===2&&s.u===.62&&s.side===-1);
 assert.equal(promenade?.triangleCount,52);
 assert.deepEqual(promenade.parts.map(x=>[x.kind,x.triangleCount]),
  [['promenade-floor',12],['promenade-transit',40]]);
 const before=art.vertices.slice(),spans=[];
 for(const kind of ['promenade-floor','promenade-transit','civic-concourse-left']){
  const result=g4e7ctColorSourcePart(art,kind);
  assert.equal(result.kind,kind);assert.equal(result.vertices.length,before.length);
  spans.push([result.firstTriangle,result.firstTriangle+result.triangles]);
  for(let i=0;i<before.length;i++){
   const touched=i>=result.firstTriangle*18&&i<(result.firstTriangle+result.triangles)*18&&i%6>=3;
   assert.equal(result.vertices[i],touched?(i%6===4?0:1):before[i]);
  }
 }
 for(let a=0;a<spans.length;a++)for(let b=a+1;b<spans.length;b++)
  assert.ok(spans[a][1]<=spans[b][0]||spans[b][1]<=spans[a][0],
   'GPU diagnostic sources must not overlap');
 assert.throws(()=>g4e7ctColorSourcePart(art,'not-a-source'),/allowed PRIVATE/);
 assert.deepEqual(art.vertices,before);assert.equal(JSON.stringify(doc),frozen);
 assert.equal(art.newColliders,0);assert.equal(art.newRoads,0);
 assert.equal(art.newMovingHazards,0);assert.equal(art.art,'HOLD');
});


test('CW proportional two-canopy plaza preserves geometry protection and source ranges',()=>{
 const doc=generateG4E7BC('true-pinch','rollDeck'),frozen=JSON.stringify(doc);
 const art=g4e7ciIntegratedStreetscape(doc,sample,{enabled:true,
  shots:g4e7bgNativeFrames().stages['true-pinch'].frames});
 const source=art.sources.find(s=>s.kind==='roadbank-promenade'&&s.station===2&&s.side===-1);
 assert.deepEqual(source.parts.map(x=>x.triangleCount),[12,40]);
 const piece=art.vertices.slice(source.firstTriangle*18,(source.firstTriangle+source.triangleCount)*18);
 assert.ok(piece.every(Number.isFinite));
 // Exactly two slimmer oblique box supports remain (2 * 12 triangles).
 assert.equal(source.parts[1].triangleCount,40);
 assert.equal(JSON.stringify(doc),frozen);
 assert.equal(art.newRoads,0);assert.equal(art.newColliders,0);
 assert.equal(art.newMovingHazards,0);assert.equal(art.officialSlope2Meters,0);
 assert.equal(art.art,'HOLD');
});

test('CX near-camera preservation is real 240Hz view aware, not a hard-coded station allowlist',()=>{
 for(const road of ['true-pinch','pinch-switch']){
  const stage=generateG4E7BC(road,'rollDeck'),snap=JSON.stringify(stage);
  const shots=g4e7bgNativeFrames().stages[road].frames;
  const art=g4e7ciIntegratedStreetscape(stage,sample,{enabled:true,shots});
  assert.equal(art.cxNearVisionQA.length,12);
  assert.equal(art.cxNearVisionQA.filter(x=>x.rendered==='roadbank-promenade').length,
   art.clippedCellReliefs);
  const target=art.cxNearVisionQA.find(x=>x.station===2&&x.side===-1);
  assert.ok(target&&target.coverage[1].gridSamples===150);
  // GPU provenance already proved the entire screen-wide nearby facade is
  // on this bank in pinch-switch/17s; it must never survive a new render.
  if(road==='pinch-switch'){
   assert.ok(target.nearVisionVeto||target.originalVeto,
    'pinch-switch camera-screen city block must be replaced by open promenade');
   assert.equal(target.rendered,'roadbank-promenade');
  }
  assert.equal(JSON.stringify(stage),snap);
  assert.equal(art.newRoads,0);assert.equal(art.newColliders,0);
  assert.equal(art.newMovingHazards,0);assert.equal(art.art,'HOLD');
 }
});

test('CZ monumental crescent inhabitation uses the existing grounded landmarks without extra roads',()=>{
 for(const road of ['true-pinch','pinch-switch']){
  const original=generateG4E7BC(road,'rollDeck'),frozen=JSON.stringify(original),
   shots=g4e7bgNativeFrames().stages[road].frames;
  const art=g4e7ciIntegratedStreetscape(original,sample,{enabled:true,shots});
  assert.equal(art.czInhabitedSites,art.landmarks);
  assert.equal(art.czScene,'INHABITED_CRESCENT_CANYON_VISUAL_ONLY');
  assert.equal(art.czCrescentQA.reduce((n,x)=>n+x.floors,0),12);
  assert.equal(art.czCrescentQA.reduce((n,x)=>n+x.openFacadeBays,0),36);
  assert.equal(art.czCrescentQA.reduce((n,x)=>n+x.groundedLegs,0),8);
  assert.equal(art.czCrescentQA.reduce((n,x)=>n+x.internalRamps,0),8);
  assert.ok(art.czCrescentQA.every(x=>x.centralSkyVoidOpen));
  assert.equal(art.sources.filter(x=>x.kind==='anchored-civic-crescent').length,2);
  assert.equal(art.sources.filter(x=>x.kind==='civic-echelons').length,0,
   'rejected CY independent decorative rods must not return');
  assert.equal(JSON.stringify(original),frozen);
  assert.deepEqual([art.newRoads,art.newColliders,art.newMovingHazards],[0,0,0]);
  assert.equal(art.officialSlope2Meters,0);
  assert.equal(art.art,'HOLD');
 }
});

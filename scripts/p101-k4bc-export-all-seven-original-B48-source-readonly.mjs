/**
 * K4BC v2: EXACT source B48 ALL SEVEN original roads, control/ultra.
 * Read only native stage generator / original tessellate; never game writes.
 * This closes the missing-source-surfaces problem of one-road DCC renders.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {generateP101W9C1AbyssCandidate} from './p101-w9c1-abyss-narrow.mjs';
import {tessellate} from '../private/reference_only/director/surface.js';
const SRC='af076d67492a677d2235e4730aef8cdf4808e106';
const ROAD5='p93-PRISM_CREST-01';
const h=value=>crypto.createHash('sha256').update(typeof value==='string'?value:JSON.stringify(value)).digest('hex');
function option(key){
 const i=process.argv.indexOf(key);assert.ok(i>=0&&i+1<process.argv.length,'missing '+key);
 return process.argv[i+1];
}
const prior=JSON.parse(fs.readFileSync(option('--k4ay'),'utf8'));
assert.equal(prior.schema,'dopagaki.K4AY.original-B48-tessellated-B51-native-clock-readonly/1');
assert.equal(prior.frozenOriginalGameGitBlob,SRC);
assert.equal(prior.originalPhysicsHz,240);
assert.equal(prior.originalB48Roads,7);
assert.equal(prior.originalB51MovingObstacles,28);
const result={
 schema:'dopagaki.K4BC.exact-all-seven-original-B48-control-ultra-surfaces/1',
 frozenOriginalGameGitBlob:SRC,
 originalStageGenerator:'generateP101W9C1AbyssCandidate',
 exactOriginalSourceTessellator:'tessellate',
 B48SurfaceCount:7,sourcePhysicsHz:240,originalB51MovingBodies:28,
 readonlyNoNativeGameWrites:true,sourcePhysicsOrCollisionChanged:false,
 sourceWebGL2Screenshots:false,sourceCameraNumericsUnchanged:true,
 importedOtherRoad5GameColliders:0,formalARTAccepted:0,
 Slope2DNACertifiedMetres:0,
 ART:'REJECT_HOLD',SAT:'HOLD',CCD:'HOLD',
 HUMAN:'HOLD',FPS:'HOLD',RELEASE:'HOLD',MERGE:'HOLD',
 modes:{}
};
for(const mode of ['control','ultra']){
 const stage=generateP101W9C1AbyssCandidate(mode);
 assert.equal(stage.stageForge.recordStageId,'VB-P101-A13-W9C1-'+mode.toUpperCase());
 assert.equal(stage.surfaces.length,7);
 assert.deepEqual(stage.surfaces.map(s=>s.id),prior.modes[mode].allB48SurfaceIDs);
 const docs=[];
 for(const [index,road] of stage.surfaces.entries()){
   const oldPoints=JSON.stringify(road.points);
   const m=tessellate(road);
   assert.equal(JSON.stringify(road.points),oldPoints,'native source road changed during tessellation');
   assert.ok(m.positions.length>0&&m.positions.length%3===0);
   assert.ok(m.indices.length>0&&m.indices.length%3===0);
   assert.ok(m.indices.every(i=>Number.isInteger(i)&&i>=0&&i<m.positions.length/3));
   const originalPointSHA=h(road.points);
   const originalTopologySHA=h(m.indices);
   const originalVerticesSHA=h(m.positions);
   if(road.id===ROAD5){
     assert.equal(index,5);
     assert.equal(originalPointSHA,prior.modes[mode].originalRoadSourcePointsSHA256);
     assert.deepEqual(m.positions,prior.modes[mode].mesh.positions);
     assert.deepEqual(m.indices,prior.modes[mode].mesh.indices);
     assert.equal(m.indices.length/3,4728);
   }
   const bounds={
     min:[Math.min(...road.points.flat().filter(Number.isFinite)),0,0],
     max:[0,0,0]
   };
   // Robust world-coordinate bounds are taken from tessellated source
   // vertices (x/y/z triple), including actual source underface.
   bounds.min=[0,1,2].map(axis=>{
     let x=Infinity;
     for(let i=axis;i<m.positions.length;i+=3)x=Math.min(x,m.positions[i]);
     return x;
   });
   bounds.max=[0,1,2].map(axis=>{
     let x=-Infinity;
     for(let i=axis;i<m.positions.length;i+=3)x=Math.max(x,m.positions[i]);
     return x;
   });
   docs.push({
     sourceIndex:index,sourceSurfaceId:road.id,
     originalPointSHA256:originalPointSHA,
     originalVertexArraySHA256:originalVerticesSHA,
     originalTriangleIndexSHA256:originalTopologySHA,
     originalSourceMaterial:road.material,
     originalCollidable:road.collidable===true,
     originalRideable:road.rideable===true,
     originalVoidLongitudinalCells:road.voidLongitudinalCells??[],
     trueVertices:m.positions.length/3,
     trueTriangles:m.indices.length/3,
     topTriangles:m.topIndexCount/3,
     degenerateTriangleCount:m.degenerate,
     sourceBounds:bounds,
     trianglesComeFromNativeTessellate:true,
     mesh:{
       positions:m.positions,indices:m.indices,
       topIndexCount:m.topIndexCount,
       bottomIndexCount:m.bottomIndexCount,
       sideIndexCount:m.sideIndexCount,
       thickness:m.thickness
     }
   });
 }
 assert.equal(docs.length,7);
 assert.equal(docs[5].sourceSurfaceId,ROAD5);
 result.modes[mode]={
   exactOriginalStageId:stage.stageForge.recordStageId,
   allSourceSurfaceIDs:docs.map(x=>x.sourceSurfaceId),
   B48SourceRoads:docs,
   sourceB51DescriptorSHA256:prior.modes[mode].allB51DescriptorsSHA256,
   sourceCameraNativeTicks:prior.modes[mode].sourceTimeRecords.map(x=>x.tick),
   originalRoad5Triangles:docs[5].trueTriangles,
   originalRoad5ControlPointsSHA256:docs[5].originalPointSHA256,
   exactOriginalSourceRoadMeshNoModification:true
 };
}
assert.equal(result.modes.control.B48SourceRoads.length,7);
assert.equal(result.modes.ultra.B48SourceRoads.length,7);
assert.deepEqual(result.modes.control.allSourceSurfaceIDs,result.modes.ultra.allSourceSurfaceIDs);
const out=option('--out');fs.mkdirSync(out,{recursive:true});
const filename=path.join(out,'K4BC_ALL7_TRUE_ORIGINAL_SOURCE_B48_ROADS_READONLY.json');
fs.writeFileSync(filename,JSON.stringify(result)+'\n');
const report={
 schema:'dopagaki.K4BC.original-all-seven-B48-export-SHA/1',
 sourceBlob:SRC,sourceB48Count:7,sourceB51Count:28,
 modes:Object.fromEntries(Object.entries(result.modes).map(([mode,data])=>[
   mode,{originalStageId:data.exactOriginalStageId,sourceNativeCameraTicks:data.sourceCameraNativeTicks,
         roads:data.B48SourceRoads.map(x=>({
           index:x.sourceIndex,id:x.sourceSurfaceId,
           sourcePointsSHA256:x.originalPointSHA256,
           triangles:x.trueTriangles,sourceBounds:x.sourceBounds,
           originalCollidable:x.originalCollidable,
           originalRideable:x.originalRideable,
           voidCount:x.originalVoidLongitudinalCells.length
         }))}]))
};
fs.writeFileSync(path.join(out,'K4BC_ALL7_B48_ORIGINAL_SURFACE_SOURCE_AUDIT.json'),JSON.stringify(report,null,2)+'\n');
console.log('K4BC_EXACT_NATIVE_ALL_SEVEN_CONTROL_ULTRA_B48_ROADS_EXPORTED_NOT_ART_PASS',
 JSON.stringify(report.modes));

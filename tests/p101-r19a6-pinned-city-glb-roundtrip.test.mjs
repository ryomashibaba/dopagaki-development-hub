import test from 'node:test';
import assert from 'node:assert/strict';
import {buildR19A6PinnedRoundtrip,importR19A6PinnedSourceGLB} from '../scripts/p101-r19a6-source-glb-roundtrip.mjs';
import {generateP101W9C1AbyssCandidate} from '../scripts/p101-w9c1-abyss-narrow.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {buildR19A3IntegratedCivicCity} from '../scripts/p101-r19a3-one-integrated-civic-basilica-source.mjs';

test('R19 A6 P0 GLB -> GPU vertices matches source A5 for 14m/28m, without changing physics',()=>{
 const sums=[];
 for(const mode of ['ultra','control']){
  const stage=generateP101W9C1AbyssCandidate(mode);
  const stageBefore=JSON.stringify(stage);
  const city=buildR19A3IntegratedCivicCity(stage,sample,{enabled:true});
  assert.equal(JSON.stringify(stage),stageBefore,'must not mutate real B48/B51');
  const {glb,report,imported}=buildR19A6PinnedRoundtrip(mode);
  assert.equal(imported.vertices.length,city.vertices.length);
  assert.equal(imported.triangleCount,city.triangles);
  assert.equal(imported.meshCount,5);
  assert.equal(imported.nonColliding,true);
  assert.equal(imported.ART,'HOLD');
  assert.equal(imported.HUMAN,'HOLD');
  for(let i=0;i<city.vertices.length;i++)
   assert.equal(imported.vertices[i],Math.fround(city.vertices[i]),'GPU float32 mismatch at '+mode+' vertex element '+i);
  sums.push(imported.inputSHA256);
  const malicious=Buffer.from(glb);malicious[malicious.length-64]^=0x1;
  assert.throws(()=>importR19A6PinnedSourceGLB(malicious,report),/edited\/unapproved GLB/);
  assert.throws(()=>importR19A6PinnedSourceGLB(glb,{...report,glbSHA256:'f'.repeat(64)}),/edited\/unapproved GLB/);
  assert.throws(()=>importR19A6PinnedSourceGLB(glb,{...report,sourceBlob:'bad'}));
  assert.throws(()=>importR19A6PinnedSourceGLB(glb,{...report,mode:'unsupported'}));
  assert.equal(stage.surfaces.length,7);
  assert.equal(stage.movingObstacles.length,28);
 }
 assert.notEqual(sums[0],sums[1],'different source road widths must remain separate assets');
 console.log('R19A6_PINNED_SOURCE_GLB_GPU_ABI',JSON.stringify({modes:2,meshCount:5,sha256:sums,ART:'HOLD',HUMAN:'HOLD'}));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {makeR19A4GLB,verifyR19A4GLB} from '../scripts/p101-r19a4-export-editable-source-city-glb.mjs';
test('R19 A4 exports true editable Blender-compatible glTF 2 GLB for original 14m/28m source scenes',()=>{
 const inputs={};
 for(const kind of ['ultra','control']){
  const {glb,report}=makeR19A4GLB(kind);
  assert.equal(verifyR19A4GLB(glb,report),true);
  assert.ok(glb.length>100000&&glb.length<3000000);
  assert.ok(report.triangleCount>8000&&report.triangleCount<25000);
  assert.ok(report.inhabitedBays>=24);
  assert.equal(report.recessedWindows,report.inhabitedBays);
  assert.equal(report.mainHeroCount,1);
  assert.equal(report.editableObjectCount,5);
  assert.equal(report.editableGroupNames.length,5);
  assert.equal(new Set(report.editableGroupNames).size,5);
  assert.equal(report.publicQuarters,4);
  assert.equal(report.colliders,0);
  assert.equal(report.sourceRoads,7);
  assert.equal(report.sourceB51,28);
  assert.equal(report.ART,'HOLD');
  assert.equal(report.productionQualityMaterials,false);
  inputs[kind]=report.glbSHA256;
  // Negative authenticity gate: a tampered GPU buffer must NOT pass.
  const counterfeit=Buffer.from(glb);counterfeit[counterfeit.length-40]^=0x4a;
  assert.throws(()=>verifyR19A4GLB(counterfeit,report));
 }
 assert.notEqual(inputs.ultra,inputs.control,
  'distinct genuine W9C1 physical widths must produce genuinely different 3D positions');
 console.log('R19A4_GLTF_EDITABLE_TRUE_SOURCE_GATE',JSON.stringify(inputs));
});

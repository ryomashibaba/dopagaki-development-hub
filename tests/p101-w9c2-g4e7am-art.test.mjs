import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7AJ} from '../scripts/p101-w9c2-g4e7aj-reanchor-moving.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {g4e7amUpturnedCity} from '../web/p101-w9c2-g4e7am-upturned-city.mjs';
for(const road of ['true-pinch','pinch-switch']){
 test('AM '+road+' non-collision 0m-certified huge real-road anchored 3D skyline',()=>{
  const doc=generateG4E7AJ(road,'reanchor'),frozen=JSON.stringify(doc);
  const art=g4e7amUpturnedCity(doc,sample,{enabled:true});
  assert.equal(art.active,true);
  assert.equal(art.banks,2);
  assert.equal(art.terraces,8);
  assert.equal(art.citySpines,6);
  assert(art.negativeSpaceBays>=210);
  assert(art.macroSkyOpenings>=150);
  assert(art.triangles>=1000&&art.triangles<18000);
  assert(art.maxRiseMeters>650);
  assert(art.minimumOutboardMeters>=220);
  assert.equal(art.physicalChanges,false);
  assert.equal(art.extraRoads,0);
  assert.equal(art.extraMachines,0);
  assert.equal(art.certifiedSlope2Meters,0);
  assert.equal(art.publish,'HOLD');
  assert(art.vertices.every(Number.isFinite));
  assert.equal(JSON.stringify(doc),frozen);
  const off=g4e7amUpturnedCity(doc,sample);
  assert.equal(off.active,false);
  assert.equal(off.vertices.length,0);
  assert.equal(JSON.stringify(doc),frozen);
 });
}
test('AM rejects unanchored or production-promoted source',()=>{
 const original=generateG4E7AJ('true-pinch','original');
 assert.throws(()=>g4e7amUpturnedCity(original,sample,{enabled:true}),/only for actual private/);
 const promoted=generateG4E7AJ('true-pinch','reanchor');
 promoted.stageForge.productionPromoted=true;
 assert.throws(()=>g4e7amUpturnedCity(promoted,sample,{enabled:true}),/only for actual private/);
});

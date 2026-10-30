import test from 'node:test';
import assert from 'node:assert/strict';
import {generateP101W9C1AbyssCandidate} from '../scripts/p101-w9c1-abyss-narrow.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {buildR19A3IntegratedCivicCity} from '../scripts/p101-r19a3-one-integrated-civic-basilica-source.mjs';
test('A3 one architectural composition grounded to actual 14m/28m B48 without any physical stage mutation',()=>{
 const meshes=[];
 for(const kind of ['ultra','control']){
  const stage=generateP101W9C1AbyssCandidate(kind),before=JSON.stringify(stage);
  const empty=buildR19A3IntegratedCivicCity(stage,sample,{enabled:false});
  assert.equal(empty.active,false);assert.equal(empty.vertices.length,0);
  const a=buildR19A3IntegratedCivicCity(stage,sample,{enabled:true});
  assert.equal(JSON.stringify(stage),before);
  assert.equal(a.active,true);
  assert.equal(a.mode,'ONE_CIVIC_BASILICA_A4_VOLUMETRIC_INHABITED_TWO_ROAD');
  assert.equal(a.originalB48,7);assert.equal(a.originalB51,28);
  assert.equal(a.colliders,0);assert.equal(a.noDriveableArt,true);
  assert.equal(a.heroBuildingCount,1);assert.equal(a.singleOpenAtrium,1);
  assert.equal(a.centralCourtOpen,true);
  assert.ok(a.trueEmptyBays>=6);
  assert.equal(a.publicCourtyards,4);
  assert.ok(a.inhabitedBays>=24);
  assert.equal(a.recessedWindows,a.inhabitedBays);
  assert.equal(a.primaryInteriorVoidVerifiedByGeometry,true);
  assert.equal(a.habitableProgrammes.length,4);
  assert.ok(a.triangles>=8000&&a.triangles<=20000);
  assert.deepEqual(a.cityCoversSourceRoadSections,[0,1]);
  assert.ok(a.sourceEdgePiers>=16);
  assert.ok(a.openRibTies>=12);
  assert.equal(a.sourceBasedNominalClearanceNotActualGlobalProof,true);
  assert.equal(a.supportingProgrammes.length,4);
  assert.ok(a.heroRoadEdgeClearanceLowerBoundM>=45);
  assert.ok(a.triangles>2000&&a.triangles<25000);
  assert.equal(a.vertices.length,a.triangles*18);
  assert.ok(a.vertices.every(Number.isFinite));
  for(const k of ['ART','GAMEPLAY','HUMAN','PERFORMANCE','RELEASE','MERGE'])
   assert.equal(a[k],'HOLD');
  meshes.push(a.vertices);
  console.log('R19A3_ONE_CIVIC_CITY_REAL_SOURCE',JSON.stringify({
   kind,triangles:a.triangles,heroCount:a.heroBuildingCount,
   actualAtriumCount:a.singleOpenAtrium,
   actualEmptyFacadeBays:a.trueEmptyBays,
   outboardPublicQuarters:a.publicCourtyards,
   noNewColliders:true,sourceB48:7,sourceB51:28,ART:'HOLD'}));
 }
 assert.notDeepEqual(meshes[0],meshes[1],'original 14m and 28m source coordinates should remain distinct');
});
test('A3 refuses unsupported or mutated physical conditions',()=>{
 const stage=generateP101W9C1AbyssCandidate('ultra');
 const tampered=structuredClone(stage);tampered.movingObstacles.pop();
 assert.throws(()=>buildR19A3IntegratedCivicCity(tampered,sample,{enabled:true}));
 const fake=structuredClone(stage);fake.surfaces[0].collidable=false;
 assert.throws(()=>buildR19A3IntegratedCivicCity(fake,sample,{enabled:true}));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7ACR2} from '../../scripts/p101-w9c2-g4e7ac-r2-physical.mjs';
import {g4e7afFractureCity} from '../../web/p101-w9c2-g4e7af-fracture-city.mjs';
import {sample} from '../../private/reference_only/director/surface.js';
test('AF independently models noncollision hollow and illuminated megacity; 7 real B48 roads stay frozen',()=>{
 const stage=generateG4E7ACR2('approach-arc');
 const before=JSON.stringify(stage),off=g4e7afFractureCity(stage,sample,{enabled:false}),
  art=g4e7afFractureCity(stage,sample,{enabled:true});
 assert.equal(off.enabled,false);
 assert.equal(art.enabled,true);
 assert.equal(art.districts,8);
 assert(art.atriumHoles>=65);
 assert(art.litShearFolds>=45);
 assert(art.triangles>1500&&art.triangles<15000);
 assert.equal(art.minimumOutboardMeters,70);
 assert.equal(art.addedCollision,0);
 assert.equal(art.addedRoads,0);
 assert.equal(art.physicalChanges,false);
 assert.deepEqual(stage.surfaces[0].voidLongitudinalCells,[52]);
 assert.equal(stage.surfaces.length,7);
 assert.equal(stage.movingObstacles.length,28);
 assert.equal(art.certifiedSlope2Meters,0);
 assert.equal(art.publish,'HOLD');
 assert.equal(JSON.stringify(stage),before);
});
test('AF refuses unrelated or non-authorized physics stage',()=>{
 assert.throws(()=>g4e7afFractureCity(generateG4E7ACR2('landing-crescent'),sample,{enabled:true}),/requires private/);
});

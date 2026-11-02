import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7VExit} from '../scripts/p101-w9c2-g4e7v-exit-build.mjs';
import {a13RacingRoadArt} from '../web/p101-a13-road-art.mjs';
import {p100RoadReadGeometry} from '../web/p100-road-read.mjs';
import {p101B5OpticalRoadGeometry} from '../web/p101-b5-road-optic.mjs';
import {sample,frame} from '../private/reference_only/director/surface.js';
test('G4E-7V authentic ONE53 gap remains visible, no false chevrons, stripes or fake road',()=>{
 const d=generateG4E7VExit('slope6');
 const art=a13RacingRoadArt(d,sample,frame);
 const p=p100RoadReadGeometry(d,sample,frame);
 const q=p101B5OpticalRoadGeometry(d,sample,frame);
 assert.equal(art.g4e6RealGapVisualClearance,true);
 assert.equal(art.nonCollision,true);assert(art.vertices.length>5000);
 assert(p.vertices.length>1000);
 assert(q.vertices.length>1000);
 assert(d.surfaces[0].voidLongitudinalCells.includes(53));
 assert.equal(d.stageForge.g4e7vStudy.officialSlope2Meters,0);
});

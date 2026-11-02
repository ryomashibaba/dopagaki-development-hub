/** DF: analyze frozen historical variants without changing the real game. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {generateG4E7BC} from './p101-w9c2-g4e7bc-bank-contour.mjs';
import {g4e7bgNativeFrames} from './p101-w9c2-g4e7bg-native-visual-frames.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {g4e7ciIntegratedStreetscape as CX} from '../web/p101-w9c2-g4e7ci-integrated-streetscape.mjs';
import {g4e7ciIntegratedStreetscape as DA} from '../tests/fixtures/g4e7de/DA-0158742.mjs';
import {g4e7ciIntegratedStreetscape as DB} from '../tests/fixtures/g4e7de/DB-63c58d6.mjs';
import {g4e7ciIntegratedStreetscape as DC} from '../tests/fixtures/g4e7de/DC-2be6997.mjs';
import {g4e7ddAuditMacroView} from '../web/p101-w9c2-g4e7dd-macro-camera-audit.mjs';
import {dfDescribeHeroMasks,dfCompareCameraMoments,dfOwnershipSvg} from './p101-w9c2-g4e7df-screen-shape.mjs';
const variants=[['CX',CX],['DA',DA],['DB',DB],['DC',DC]];
const frames=g4e7bgNativeFrames().stages,rows=[],pairs=[];
const out=path.resolve('test-results/g4e7ci-real-game');
fs.mkdirSync(out,{recursive:true});
for(const road of ['true-pinch','pinch-switch']){
 const doc=generateG4E7BC(road,'rollDeck'),frozen=JSON.stringify(doc);
 assert.equal(doc.surfaces.length,7);assert.equal(doc.movingObstacles.length,28);
 assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52]);
 for(const [variant,make] of variants){
  const art=make(doc,sample,{enabled:true,shots:frames[road].frames});
  assert.equal(JSON.stringify(doc),frozen);
  assert.equal(art.newRoads,0);assert.equal(art.newColliders,0);
  assert.equal(art.newMovingHazards,0);assert.equal(art.officialSlope2Meters,0);
  const snap=JSON.stringify(art.vertices);
  const views=[];
  for(const shot of frames[road].frames.slice(0,2)){
   const audit=g4e7ddAuditMacroView(art,shot,{includePrivateOwnership:true});
   const shape=dfDescribeHeroMasks(audit);
   assert.equal(JSON.stringify(art.vertices),snap);
   assert.equal(shape.grid[0]*shape.grid[1],audit.privateOwnership.sourceIndexByCell.length);
   const result={variant,road,shot:shot.id,knownArt:variant==='CX'?'HOLD_BASELINE':'REJECT_FROM_GENUINE_HISTORIC_WEBGL',
    occupiedCells:audit.occupiedCells,
    heroSourcesVisible:audit.heroSourcesVisible,
    nearCrossing:audit.nearPlaneClassification.nearCrossing,
    ...shape};
   views.push(result);rows.push(result);
   fs.writeFileSync(path.join(out,'G4E7DF_'+variant+'_'+road+'_'+shot.id+'_CPU.svg'),
    dfOwnershipSvg(audit,shape));
  }
  pairs.push({variant,road,temporal:dfCompareCameraMoments(views[0],views[1])});
 }
}
assert.equal(rows.length,16);assert.equal(pairs.length,8);
assert.ok(rows.every(x=>x.grid[0]===48&&x.grid[1]===30));
const result={schema:'G4E7DF_HISTORIC_CPU_MORPHOLOGY_OBSERVATIONS_NOT_ART_GATE',
 note:'17-second morphology is measured but NOT automatically classified. CX is only a HOLD baseline.',
 historicalArt:{CX:'HOLD',DA:'REJECT',DB:'REJECT',DC:'REJECT'},
 source:'Frozen DA/DB/DC and unchanged BG240Hz camera. CPU low-resolution DD raster, NOT final GPU pixel visibility.',
 originalB48:7,originalB51C:28,gapCell:52,officialSlope2Meters:0,
 numericalArtApprovalForbidden:true,art:'HOLD',human:'HOLD',publish:'HOLD',merge:'HOLD',
 rows,pairs};
fs.writeFileSync(path.join(out,'G4E7DF_HERO_MORPHOLOGY_HOLD.json'),JSON.stringify(result,null,2));
console.log('G4E7DF_17S_SHAPES',JSON.stringify(rows.filter(x=>x.shot==='t1700').map(x=>({
 variant:x.variant,road:x.road,nearCrossing:x.nearCrossing,
 hero:x.masks.map(m=>({slot:m.slot,pixels:m.occupiedCells,fill:m.boxFillFraction,
  aspect:m.aspectRatio,segments:m.multipleRunRows,components:m.componentCount,
  holes:m.enclosedVoidCells,edge:m.touchesViewport}))
}))));
console.log('G4E7DF_TEMPORAL_SLOTS',JSON.stringify(pairs.map(p=>({
 variant:p.variant,road:p.road,changes:p.temporal.perSlot}))));

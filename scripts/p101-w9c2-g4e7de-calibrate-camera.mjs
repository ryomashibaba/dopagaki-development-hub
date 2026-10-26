/** G4E-7DE: immutable DA/DB/DC replay, real BG240Hz cameras, NOT ART certification. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {generateG4E7BC} from './p101-w9c2-g4e7bc-bank-contour.mjs';
import {g4e7bgNativeFrames} from './p101-w9c2-g4e7bg-native-visual-frames.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {g4e7ciIntegratedStreetscape as CX} from '../web/p101-w9c2-g4e7ci-integrated-streetscape.mjs';
import {g4e7ciIntegratedStreetscape as DA} from '../tests/fixtures/g4e7de/DA-0158742.mjs';
import {g4e7ciIntegratedStreetscape as DB} from '../tests/fixtures/g4e7de/DB-63c58d6.mjs';
import {g4e7ciIntegratedStreetscape as DC} from '../tests/fixtures/g4e7de/DC-2be6997.mjs';
import {g4e7ddAuditMacroView} from '../web/p101-w9c2-g4e7dd-macro-camera-audit.mjs';
const variants=[
 ['CX',CX,'reference CX: ART HOLD'],
 ['DA',DA,'ART REJECT: large opaque cliff and clipped upper skyline'],
 ['DB',DB,'ART REJECT: spindly supports and isolated ledges'],
 ['DC',DC,'ART REJECT: low wide pale slab and weak 17s silhouette']
];
const native=g4e7bgNativeFrames().stages,rows=[];
for(const road of ['true-pinch','pinch-switch']){
 const doc=generateG4E7BC(road,'rollDeck'),unchanged=JSON.stringify(doc);
 assert.equal(doc.surfaces.length,7);
 assert.equal(doc.movingObstacles.length,28);
 assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52]);
 for(const [version,fn,knownArt] of variants){
  const art=fn(doc,sample,{enabled:true,shots:native[road].frames});
  assert.equal(JSON.stringify(doc),unchanged,'immutable B48 '+version);
  assert.equal(art.newRoads,0);assert.equal(art.newColliders,0);
  assert.equal(art.newMovingHazards,0);assert.equal(art.officialSlope2Meters,0);
  for(const shot of native[road].frames.slice(0,2)){
   const audit=g4e7ddAuditMacroView(art,shot);
   assert.equal(audit.totalTriangles,art.triangles);
   assert.equal(audit.art,'HOLD');
   assert.equal(audit.unknownNearTriangles,
     Object.values(audit.nearPlaneClassification).reduce((n,x)=>n+x,0));
   rows.push({version,road,knownArt,...audit});
  }
 }
}
assert.equal(rows.length,16);
const delta=[];
for(const road of ['true-pinch','pinch-switch'])for(const shot of ['t1500','t1700']){
 const old=rows.find(x=>x.version==='CX'&&x.road===road&&x.shot===shot);
 for(const version of ['DA','DB','DC']){
  const now=rows.find(x=>x.version===version&&x.road===road&&x.shot===shot);
  const stats={
   sceneryOccupancy:Number((now.occupancy-old.occupancy).toFixed(5)),
   upperSkyOccupied:now.upperSky.occupied-old.upperSky.occupied,
   centralSceneryOccupied:now.center.occupied-old.center.occupied,
   heroSourcesVisible:now.heroSourcesVisible-old.heroSourcesVisible,
   edgeCrossingTriangles:now.edgeCrossingTriangles-old.edgeCrossingTriangles,
   nearPlaneCrossings:now.nearPlaneClassification.nearCrossing-old.nearPlaneClassification.nearCrossing
  };
  const large=now.sourceScreenBoxes.filter(s=>s.widthFraction>=.4&&s.screenFraction>=.02);
  delta.push({version,road,shot,knownArt:now.knownArt,
    deltaFromCX:stats,warnings:now.warningSignals,
    baselineWarnings:old.warningSignals,wideAreaSources:large.slice(0,8)});
 }
}
const hits={};
for(const version of ['DA','DB','DC']){
 const cases=delta.filter(x=>x.version===version);
 hits[version]={cases:cases.length,
  oldWideSource:cases.filter(x=>x.warnings.wideSource||x.warnings.wideTriangle).length,
  newWideFamilyOrComposite:cases.filter(x=>x.warnings.wideKind||x.warnings.wideComposite).length,
  clippedWideMass:cases.filter(x=>x.warnings.clippedWideMass).length,
  anyScreenCandidate:cases.filter(x=>Object.entries(x.warnings).some(
    ([key,on])=>on&&['wideTriangle','wideSource','wideKind','wideComposite','clippedWideMass'].includes(key))).length};
}
// Classification unit cases are pure authored triangles, not a camera hack.
const shot={id:'t1500',source:'ACTUAL_240HZ_START00_P96_FIXED_SCRIPT_NOT_HUMAN',
 eye:[0,0,0],front:[0,0,1]};
const single=(points)=>({active:true,vertices:points.flatMap(p=>[...p,.3,.4,.5]),
 sources:[{kind:'synthetic-near',firstTriangle:0,triangleCount:1}]});
const behind=g4e7ddAuditMacroView(single([[-3,-2,-4],[2,-1,-8],[0,4,-6]]),shot);
const cross=g4e7ddAuditMacroView(single([[-3,-2,-4],[2,-1,10],[0,4,10]]),shot);
const touching=g4e7ddAuditMacroView(single([[-3,-2,.3],[2,-1,.5],[0,4,1]]),shot);
assert.equal(behind.nearPlaneClassification.fullyBehind,1);
assert.equal(behind.nearPlaneClassification.nearCrossing,0);
assert.equal(cross.nearPlaneClassification.nearCrossing,1);
assert.equal(touching.nearPlaneClassification.nearTouching,1);
const output={schema:'G4E7DE_HISTORIC_REJECT_CALIBRATION_NOT_AN_ART_GATE',
 historicalCommits:{DA:'0158742798af56193f3ec0225fac903472171194',
 DB:'63c58d630d22915b5b5280b5f16e0bbd7e3f06d9',
 DC:'2be6997035a6dad8f884184bfa8129d058aabc3e'},
 authenticity:'Unmodified original BG240Hz road and camera, exact historic generator modules',
 warningsAreNotArtApproval:true,art:'HOLD',human:'HOLD',officialSlope2Meters:0,
 hits,comparisons:delta,rawCameraAudits:rows};
const dest=path.resolve('test-results/g4e7ci-real-game');
fs.mkdirSync(dest,{recursive:true});
fs.writeFileSync(path.join(dest,'G4E7DE_REJECT_CALIBRATION_HOLD.json'),JSON.stringify(output,null,2));
console.log('G4E7DE_HISTORY_COUNTS',JSON.stringify(hits));
console.log('G4E7DE_PAIRED_DETAILS',JSON.stringify(delta.map(d=>({
 variant:d.version,road:d.road,shot:d.shot,
 delta:d.deltaFromCX,warnings:d.warnings,wideAreas:d.wideAreaSources.length
}))));

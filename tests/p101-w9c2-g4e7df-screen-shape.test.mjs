import test from 'node:test';
import assert from 'node:assert/strict';
import {dfDescribeHeroMasks,dfCompareCameraMoments,dfOwnershipSvg} from '../scripts/p101-w9c2-g4e7df-screen-shape.mjs';
const audit=(lines)=>({
 shot:'t1700',privateOwnership:{grid:[lines[0].length,lines.length],
 sourceMetadata:[{kind:'hero',slot:0},{kind:'ordinary',slot:null}],
 sourceIndexByCell:lines.join('').split('').map(c=>c==='H'?0:c==='B'?1:-1)},
 unknownNearTriangles:0,nearPlaneClassification:{nearCrossing:0}
});
test('DF read-only solid versus true enclosed aperture distinguishes silhouette, not ART',()=>{
 const solid=audit(['........','..HHHH..','..HHHH..','..HHHH..','..HHHH..','........']);
 const hollow=audit(['........','..HHHH..','..H..H..','..H..H..','..HHHH..','........']);
 const x=JSON.stringify(hollow);
 const a=dfDescribeHeroMasks(solid).masks[0],b=dfDescribeHeroMasks(hollow).masks[0];
 assert.equal(a.enclosedVoidCells,0);assert.equal(b.enclosedVoidCells,4);
 assert.ok(b.boxFillFraction<a.boxFillFraction);
 assert.equal(JSON.stringify(hollow),x);
 assert.match(dfOwnershipSvg(hollow,dfDescribeHeroMasks(hollow)),/NOT WebGL/);
});
test('DF multi-component bars differ from filled mass; ordinary surfaces excluded',()=>{
 const bars=audit(['........','H...H...','H...H...','H...H...','........','........']);
 const occupied=dfDescribeHeroMasks(bars).masks[0];
 assert.equal(occupied.componentCount,2);
 assert.equal(occupied.multipleRunRows,3);
 const none=audit(['........','BBBBBBBB','BBBBBBBB','........','........','........']);
 assert.equal(dfDescribeHeroMasks(none).masks.length,0);
});
test('DF cannot equate disappearance with artistic failure and cannot invent human approval',()=>{
 const on=dfDescribeHeroMasks(audit(['........','..HH....','..HH....','........','........','........']));
 const off=dfDescribeHeroMasks(audit(['........','........','........','........','........','........']));
 const pair=dfCompareCameraMoments({...on,shot:'t1500'},off);
 assert.equal(pair.perSlot[0].visibility,'EXITED_CPU_VIEW');
 assert.equal(pair.perSlot[0].cannotConcludeArtQuality,true);
 assert.throws(()=>dfDescribeHeroMasks({}),/explicit private ownership/);
});

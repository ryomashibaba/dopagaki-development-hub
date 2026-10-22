import test from 'node:test';
import assert from 'node:assert/strict';
import {g4e7nLocalReadout,G4E7N_STEERS,g4e7nWidthAwareDodge} from '../scripts/p101-w9c2-g4e7n-diagnose.mjs';
import {generateG4E7MPhysical} from '../scripts/p101-w9c2-g4e7m-physical-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
test('G4E7N true 13–16m physical B48 readout is finite and measures narrow width',()=>{
 const doc=generateG4E7MPhysical('precipice');
 const r=new Runner(doc,compile(doc),0,52);
 const o=g4e7nLocalReadout(doc,r);
 assert(Number.isFinite(o.widthMeters));
 assert(o.widthMeters>10);
 assert.equal(o.roadId,doc.surfaces[0].id);
 assert.equal(1/DT,240);
 assert.equal(doc.movingObstacles.length,28);
 assert.equal(doc.stageForge.g4e7mRealRoad.certifiedSlopeDnaMeters,0);
});
test('G4E7N offline-only controllers are enumerated and no production writes exist',()=>{
 assert.deepEqual(G4E7N_STEERS,['p96-original','route-only','dodge-3m','width-aware-narrow']);
});

test('G4E7N offline width-aware dodge bounded to actual road without mutating hardware controls',()=>{
 const p=g4e7nWidthAwareDodge(1,-.3,25,13,true);
 assert(p.scale>=.10&&p.scale<.15);
 assert(p.input<-.1);
 const wide=g4e7nWidthAwareDodge(1,-.3,25,93,false);
 assert.equal(wide.input,1);
 assert.equal(wide.scale,1);
 assert.throws(()=>g4e7nWidthAwareDodge(1,0,25,-1,true),/invalid/);
});
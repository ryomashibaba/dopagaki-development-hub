import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
test('G geometry-only gate retains both real source cameras, negative control, and ART HOLD',()=>{
 const s=spawnSync(process.execPath,[path.join(root,'scripts/p101-r19a6p4r2f5g-camera-readability-gate.mjs')],{cwd:root,encoding:'utf8',timeout:15000});
 assert.equal(s.status,0,s.stderr);
 const j=JSON.parse(fs.readFileSync(path.join(root,'r19-evidence/r19a6p4r2f5g/R2F5G_ORIGINAL_A1_CAMERA_PROJECTION_RESEARCH_ONLY.json')));
 assert.equal(j.sourceGitBlob,'af076d67492a677d2235e4730aef8cdf4808e106');
 assert.equal(j.usedRealNativeWebGL2,false);
 assert.equal(j.BlenderCreated,false);
 assert.equal(j.actualPixelMask,false);
 assert.equal(j.verifiedB48B51Contact,false);
 assert.equal(j.ART,'HOLD');
 assert.deepEqual(j.candidates.map(c=>c.id),['G0_F_ENVELOPE_NEGATIVE_CONTROL','G1_DEEP_POROUS_STATION','G2_SUNKEN_COURT_AND_TRANSFER']);
 assert.equal(j.candidates[0].passedBothModes,false);
 const good=j.candidates[2];assert.equal(good.passedBothModes,true);
 assert.deepEqual(good.modes.map(m=>m.mode),['ultra','control']);
 for(const m of good.modes){assert.ok(m.backingOverlapProxy<.35);assert.ok(m.openingWidthPx>60);assert.ok(m.passed)}
 assert.equal(j.preselectedGeometryOnly,'G2_SUNKEN_COURT_AND_TRANSFER');
});

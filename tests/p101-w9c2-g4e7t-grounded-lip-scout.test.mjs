import test from 'node:test';
import assert from 'node:assert/strict';
import {g4e7tCausalScout} from '../scripts/p101-w9c2-g4e7t-grounded-lip-scout.mjs';
test('G4E-7T inspect 12 genuine B48 gaps against native grounded lips, no approval',()=>{
 const d=g4e7tCausalScout();
 assert.equal(d.physicalHz,240);assert.equal(d.results.length,12);
 assert(d.control.points.length>50);
 assert.equal(d.certifiedSlope2Meters,0);assert.equal(d.officialApproval,'HOLD');
 for(const x of d.results){
  assert(x.lipU>.4&&x.lipU<.9);
  assert(x.widthMeters>10);assert(x.nonEmptyRealVoid);
  assert(x.nativeTimeSeconds>3);
 }
});

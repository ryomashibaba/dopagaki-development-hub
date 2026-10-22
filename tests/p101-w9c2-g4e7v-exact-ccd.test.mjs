import test from 'node:test';
import assert from 'node:assert/strict';
import {g4e7vExactContactAudit} from '../scripts/p101-w9c2-g4e7v-exact-ccd-audit.mjs';
test('G4E-7V records actually SELECTED collision tri without altering Gold/native source',async()=>{
 const v=await g4e7vExactContactAudit();
 assert.equal(v.hz,240);assert(v.originalPhysicsIntact);
 assert.equal(v.control.identicalNativeStateAllSteps,true);
 assert.equal(v.one53.identicalNativeStateAllSteps,true);
 assert(v.one53.selectedCCDContacts.length>0);
 assert(v.one53.largestSpeedLoss.speedDropMps>20);
 assert(v.one53.selectedCCDContacts.some(x=>x.time===v.one53.largestSpeedLoss.time));
 for(const x of v.one53.selectedCCDContacts){
  assert(['top','underside','edge','fixture'].includes(x.part));
  assert(x.triangleVertices.length===3);
  assert(Number.isFinite(x.impulseRemovedMps));
 }
 assert.equal(v.certifiedSlope2Meters,0);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {g4e7uPhysicalContactAudit} from '../scripts/p101-w9c2-g4e7u-impact-audit.mjs';
test('G4E-7U 240Hz must truthfully record collision speed loss on real one53',()=>{
 const a=g4e7uPhysicalContactAudit();
 assert.equal(a.hz,240);assert.equal(a.control.variant,'control');
 assert.equal(a.one53.variant,'one53');
 assert(a.one53.worstSpeedDrop.speedDropMps>10);
 assert(a.one53.largeContactRecords.length>0);
 assert.equal(a.noPhysicalChanges,true);
 assert.equal(a.certifiedSlope2Meters,0);
 assert.equal(a.gameplayAcceptance,'HOLD');
});

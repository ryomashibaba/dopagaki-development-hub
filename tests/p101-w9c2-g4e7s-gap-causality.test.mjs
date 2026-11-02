import test from 'node:test';
import assert from 'node:assert/strict';
import {g4e7sGapCausality} from '../scripts/p101-w9c2-g4e7s-gap-causality.mjs';
test('G4E-7S cannot credit a physical void with airborne it did not cause',()=>{
 const d=g4e7sGapCausality();
 assert.equal(d.hz,240);assert.equal(d.start00,true);
 assert.equal(d.sameB48ControlPoints,true);
 assert.equal(d.same28MovingObstacles,true);
 assert(d.realGapMeters>2&&d.realGapMeters<20);
 assert(d.bothAlreadyAirborneBeforeGapTicks>0);
 assert(d.cutAirInRealGapTicks>0);
 assert(d.matchedTicks>800);
 assert(d.maxPositionDeltaMeters>=0);
 assert.equal(d.gapCausallyCausedExtraAirborne,d.cutAirWhileIntactGroundedTicks>0);
 assert.equal(d.officialSlope2Meters,0);
 assert.equal(d.humanFairness,'HOLD');
});

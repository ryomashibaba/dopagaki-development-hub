import test from 'node:test';
import assert from 'node:assert/strict';
import {runW7PhysicalExposure,W7_PASSING_TRIAL_ID} from '../scripts/p101-a13-w7-road-occupancy.mjs';
test('W7D native sampled collision exposure, no false safe lane or fake collision audit',()=>{
 const a=runW7PhysicalExposure();
 assert.equal(a.candidate,W7_PASSING_TRIAL_ID);
 assert.equal(a.nativeMachines,28);
 assert.equal(a.hazards.length,16);
 assert(a.hazards.every(x=>x.id.startsWith('a13-machine-')&&
  Number.isFinite(x.closestGroundBallSeparationMeters)&&x.ofPhases===17&&x.ofLanes===21));
 assert(a.physicalFootprintCount>=0&&a.physicalFootprintCount<=16);
 assert(a.centerlineThreatCount>=0&&a.centerlineThreatCount<=16);
});

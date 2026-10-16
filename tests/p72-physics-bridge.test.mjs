import test from 'node:test';
import assert from 'node:assert/strict';
import {physicsHandoff,PHYSICS_HANDOFF_CASES,isApprovedCourseCase} from '../scripts/p72-physics-compat.mjs';

test('P72 physical-engine integration remains HOLD without an approved candidate source',async()=>{
 const report=await physicsHandoff({full:false});
 console.log('P72_BASELINE_FORK_AND_JUMP '+JSON.stringify(report.baseline.map(
  r=>({id:r.id,status:r.status,reason:r.failure,air:r.airFrames,landing:r.naturalLanding,end:r.endSurface}))));
 assert.equal(report.decision,'HOLD_NO_APPROVED_CANDIDATE');
 assert.equal(report.baselinePass,true,'frozen physical baseline should pass');
 assert.equal(report.source,'B48_FROZEN_BASELINE');
 assert.equal(report.tested.length,7);
 assert(PHYSICS_HANDOFF_CASES.some(x=>x.extended),'85s P69 integration scenario must exist');
});
test('P72 rejects incomplete full spiral route even when runner says running',()=>{
 assert.equal(isApprovedCourseCase({id:'spiral-to-takeoff',failure:null,remainingGrounded:true,
  visitedSpiral:3,reachedForkApproach:false,reachedTakeoff:false,seconds:85}),false);
 assert.equal(isApprovedCourseCase({id:'spiral-to-takeoff',failure:null,remainingGrounded:true,
  visitedSpiral:6,reachedForkApproach:true,reachedTakeoff:true,seconds:85}),true);
 assert.equal(isApprovedCourseCase({id:'jump-44',failure:null,airFrames:0,naturalLanding:true}),false);
 assert.equal(isApprovedCourseCase({id:'right-fork',failure:'contact-solver overflow',
  remainingGrounded:true,reachedForkRejoin:true,seconds:12}),false);
});

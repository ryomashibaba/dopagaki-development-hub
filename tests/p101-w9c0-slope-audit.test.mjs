import test from 'node:test';
import assert from 'node:assert/strict';
import {auditW9C0,W9C0_POLICY,W9C0_WINDOWS,W9C0_ULTRANARROW} from '../scripts/p101-w9c0-slope-audit.mjs';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {generateP101A13W9XCandidate} from '../scripts/p101-a13-w9b-road-candidate.mjs';

test('W9-C0 freezes realistic 40% distance target without counting plans as implemented',()=>{
 const report=auditW9C0();
 assert.equal(report.schema,'dopagaki.w9c0.slope40-inventory/1');
 assert.equal(report.measured.sections,7);
 assert.equal(report.measured.baselineLengthMeters,7280);
 assert.equal(report.policy.targetMeters,2912);
 assert.equal(report.target.plannedMeters,2910);
 assert.equal(report.target.deficitAgainstExact40PercentMeters,2);
 assert.equal(report.target.windowCount,18);
 assert.equal(report.target.plannedPercent,39.973);
 assert.equal(report.target.status,'DESIGN_ONLY_ZERO_IMPLEMENTED_SLOPE_ZONES');
 assert.equal(report.target.ultraNarrow.length,3);
 assert.equal(report.policy.superNarrowTrialTotalMeters,180);
 assert.equal(W9C0_ULTRANARROW.reduce((a,x)=>a+x.endM-x.startM,0),180);
 assert(W9C0_WINDOWS.every(w=>w.features.length>0));
 assert.equal(report.measured.nativeMachines,28);
 assert.equal(report.measured.totalApproxBelow16Meters,0,'gold must not silently become a new thin track');
 assert(report.sections.every(s=>s.plannedWindows.length>=2));
 assert(report.sections.every(s=>s.physicalSkin.rows===31&&s.physicalSkin.cols===5));
 assert.deepEqual(report.sections.map(s=>s.plannedLengthMeters),[240,510,430,650,470,340,270]);
 assert.deepEqual(report.measured.bankTrialChanges.map(s=>s.section),[0,1,2,3,4,5,6]);
 assert.deepEqual(report.measured.bankTrialChanges.filter(s=>s.changedControlPoints!==0).map(s=>s.section),[3]);
 assert(report.measured.bankTrialChanges.every(s=>s.centerChanged===0));
 assert.equal(report.safety.physicsEngineModified,false);
 assert.equal(report.safety.productionPromoted,false);
 assert.equal(report.nextGate.id,'W9-C1');
});

test('W9-C0 is observational only: W7F and W9-X JSON remain byte-equivalent in memory',()=>{
 const w7=generateP101A13W7Candidate(),w9=generateP101A13W9XCandidate();
 const a=JSON.stringify(w7),b=JSON.stringify(w9);
 const report=auditW9C0({gold:w7,bank:w9});
 assert.equal(JSON.stringify(w7),a);
 assert.equal(JSON.stringify(w9),b);
 assert.equal(w7.stageForge.recordStageId,'VB-P101-A13-W7F');
 assert.equal(w9.stageForge.recordStageId,'VB-P101-A13-W9X-B1');
 assert.equal(w7.movingObstacles.length,28);
 assert.equal(report.target.ultraNarrow.filter(x=>x.experimental).length,3);
 assert(report.sections.every(s=>s.movingAnchors.extra16ExactAnchorCount>=2));
 for(const u of report.target.ultraNarrow){
  assert(u.targetWidthMeters[0]>=10&&u.targetWidthMeters[1]<=16);
  assert(u.lengthM<=75);
  assert.equal(u.humanSafety,'NOT_ASSESSED');
 }
 assert.throws(()=>auditW9C0({gold:{...w7,surfaces:[]},bank:w9}));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {generateVoidHazardCandidate} from '../scripts/p95-void-hazard-build.mjs';
import {generateVoidBreaker} from '../scripts/p93-void-breaker-build.mjs';
import {sample,frame} from '../private/reference_only/director/surface.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {hazardRoadGateVertices,makeHazardRoadPlan,nextRoadHazardCue,hazardSpacingAudit} from '../web/p97-roadplay-gates.mjs';
import {generateP96DodgeEvidence} from '../scripts/p96-acceptance-evidence.mjs';

test('P97 draws 36 physical-road-anchored 400/270/140m warnings for all 12 native moving B51-C machines without geometry mutation',()=>{
 const doc=generateVoidHazardCandidate(),before=JSON.stringify(doc);
 const plan=makeHazardRoadPlan(doc,sample);
 const markers=hazardRoadGateVertices(doc,sample,frame);
 assert.equal(plan.roads.length,7);assert.equal(plan.stations.length,12);
 assert.equal(markers.gates.length,36);assert.equal(markers.stations,12);
 assert(markers.gates.every(g=>g.section.startsWith('p93-')&&g.postHeight>=11));
 assert.deepEqual([...new Set(markers.gates.map(g=>g.machine))].sort(),doc.movingObstacles.map(x=>x.id).sort());
 assert.deepEqual([...new Set(markers.gates.map(g=>g.tier))],[0,1,2]);
 for(const s of plan.stations){
  const gates=markers.gates.filter(g=>g.machine===s.id);
  assert.deepEqual(gates.map(g=>Number((s.distance-g.distance).toFixed(2))),[400,270,140]);
 }
 assert(markers.vertices.length>1000&&markers.vertices.length<20000);
 assert(markers.solidVertices.length>=36*36&&markers.solidVertices.length<15000);
 assert.equal(markers.solidVertices.length%18,0);
 assert(markers.solidVertices.every(Number.isFinite));
 assert.equal(markers.vertices.length%12,0,'line vertices contain xyz and RGB pairs');
 assert(markers.vertices.every(Number.isFinite));
 assert.deepEqual(hazardRoadGateVertices(doc,sample,frame),markers,'readability geometry must be deterministic');
 assert.equal(JSON.stringify(doc),before,'new visual gates must never modify road, hazards or game physics');
 const untouched=generateVoidBreaker();
 assert.equal(makeHazardRoadPlan(untouched,sample),null);
 assert.deepEqual(hazardRoadGateVertices(untouched,sample,frame),{vertices:[],solidVertices:[],gates:[],stations:0});
});

test('P97 route-aware advance warning follows authored road not misleading 3D Euclidean crossover; predicted pose from true native B51-C',()=>{
 const doc=generateVoidHazardCandidate(),plan=makeHazardRoadPlan(doc,sample);
 const firstRoad=doc.surfaces[0],p=sample(firstRoad,.58,.5);
 const fakeRunner={surface:firstRoad.id,lastSurface:firstRoad.id,p,v:[110,0,0],time:2.2};
 const cue=nextRoadHazardCue(doc,fakeRunner,plan,movingObstaclePose);
 assert.equal(cue.id,'p95-hazard-01');
 assert.equal(cue.mode,'fail');assert.equal(cue.modeLabel,'衝突で失敗');
 assert(cue.meters>300&&cue.meters<400,'first road should warn across native surface seam');
 assert(cue.etaSeconds>2&&cue.etaSeconds<5);
 assert.equal(cue.urgency,'advance');
 assert.equal(cue.assurance,'APPROXIMATE_POSITION_ONLY_NOT_SAFE_LANE');
 assert.equal(cue.physicalSource,'P95_B48_B51_C_READ_ONLY');
 assert(['left','center','right'].includes(cue.predictedSide));
 const endRunner={...fakeRunner,p:sample(firstRoad,.985,.5)};
 const near=nextRoadHazardCue(doc,endRunner,plan,movingObstaclePose);
 assert(near&&near.id===cue.id);
 assert(near.meters<cue.meters);
 assert(['immediate','approaching'].includes(near.urgency));
 // Other stages and unknown sections are deliberately not advised to avoid
 // false hazard warnings from elevated, separate road layers.
 assert.equal(nextRoadHazardCue(generateVoidBreaker(),fakeRunner,plan,movingObstaclePose),null);
 assert.equal(nextRoadHazardCue(doc,{...fakeRunner,surface:'fake',lastSurface:'fake'},plan,movingObstaclePose),null);
 assert.throws(()=>nextRoadHazardCue(doc,fakeRunner,plan,null),/B51-C/);
});

test('P97 per-machine reaction-time audit reports honest warning budgets, not fake safety certification',()=>{
 const doc=generateVoidHazardCandidate(),plan=makeHazardRoadPlan(doc,sample);
 const rows=hazardSpacingAudit(plan,{speedMps:130});
 assert.equal(rows.length,12);assert.equal(rows[0].spacingMeters,null);
 assert(rows.slice(1).every(r=>r.spacingMeters>0&&r.secondsSincePrevious>0));
 assert(rows.every(r=>r.warningSeconds===3.08));
 assert.deepEqual(rows.map(r=>r.id),doc.movingObstacles.map(x=>x.id));
 assert.throws(()=>hazardSpacingAudit(plan,{speedMps:0}),/Invalid/);
 // Reality check: scripted full run remains a separate unchanged collision
 // test; visual road warnings do not imply human timing is adequate.
 assert.equal(doc.stageForge.humanPlaytest,'NOT_RUN');
 assert.equal(doc.stageForge.fullStartToFinish,'SCRIPTED_240HZ_12_ACTIVE_7_OF_7_PASS_P96');
});

test('P97 preserves P96 actual 12-collider continuous native finish at 240Hz',()=>{
 const proof=generateP96DodgeEvidence();
 assert.equal(proof.activeCollidingMachines,12);
 assert.equal(proof.best.status,'SCRIPTED_NATIVE_FULL_PASS');
 assert.equal(proof.best.visited.length,7);
 assert.equal(proof.best.machineContacts.length,0);
 assert.equal(proof.humanPlaytest,'NOT_RUN');
});

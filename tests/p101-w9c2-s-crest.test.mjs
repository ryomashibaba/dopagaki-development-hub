import test from 'node:test';
import assert from 'node:assert/strict';
import {generateP101W9C2SCrestCandidate,W9C2_STUDY,W9C2_VARIANTS,w9c2ShapeAt} from '../scripts/p101-w9c2-s-crest-build.mjs';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {generateP101W9C1AbyssCandidate} from '../scripts/p101-w9c1-abyss-narrow.mjs';
import {generateP101A13W9XCandidate} from '../scripts/p101-a13-w9b-road-candidate.mjs';
import {generateP101B5Speedway} from '../scripts/p101-b5-speedway-build.mjs';
import {sample,frame,tessellate} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT,RADIUS} from '../private/reference_only/director/physics.js';
import {p101Step} from '../web/p101-overdrive.mjs';

const length=(a,b)=>Math.hypot(...a.map((x,j)=>x-b[j]));
const width=(s,u)=>length(sample(s,u,0),sample(s,u,1));
test('W9-C2 G1 separate two actual 31x5 physical S-crest variants, preserving all baselines',()=>{
 const gold=generateP101A13W7Candidate();
 const frozen=JSON.stringify(gold);
 const originalC1=JSON.stringify(generateP101W9C1AbyssCandidate('ultra'));
 const originalX=JSON.stringify(generateP101A13W9XCandidate());
 const originalB5=JSON.stringify(generateP101B5Speedway({lowerReversalLength:1800}));
 for(const [kind,plan] of Object.entries(W9C2_VARIANTS)){
  const doc=generateP101W9C2SCrestCandidate(kind),s=doc.surfaces[W9C2_STUDY.section],
   old=gold.surfaces[W9C2_STUDY.section];
  assert.equal(doc.stageForge.recordStageId,plan.recordStageId);
  assert.equal(doc.stageForge.productionPromoted,false);
  assert.equal(doc.stageForge.humanPlaytest,'NOT_RUN');
  assert.equal(doc.stageForge.nativeScriptedProof,null);
  assert.equal(doc.stageForge.fullStartToFinish,'NOT_VERIFIED_W9_C2');
  assert.equal(doc.stageForge.slopeDNAStudy.trueJumpGapImplemented,false);
  assert.equal(doc.stageForge.slopeDNAStudy.slopeDnaContributionMeters,'NOT_APPROVED_FOR_COUNT');
  assert.equal(doc.surfaces.length,7);
  assert.equal(doc.movingObstacles.length,28);
  assert.deepEqual(doc.movingObstacles,gold.movingObstacles,'all original 28 B51-C bodies must be byte-identical');
  assert.deepEqual(doc.spawns,gold.spawns,'no artificial checkpoint or speed reset');
  assert.deepEqual(doc.routeSegments,gold.routeSegments);
  for(let section=0;section<7;section++)if(section!==W9C2_STUDY.section)
   assert.deepEqual(doc.surfaces[section],gold.surfaces[section],'wrong road changed: '+section);
  for(let row=0;row<31;row++){
   const u=row/30;
   if(u<=W9C2_STUDY.startU||u>=W9C2_STUDY.endU){
    for(let col=0;col<5;col++)
     assert.deepEqual(s.points[row*5+col],old.points[row*5+col],'authored 3D seam/outer window changed');
   }
  }
  for(let section=0;section<7;section++)for(let i=0;i<22;i++){
   const index=section*22+i;
   if(section!==W9C2_STUDY.section)assert.deepEqual(doc.route[index],gold.route[index],'airborne fallback route outside changed road');
  }
  assert.deepEqual(doc.route.at(-1),gold.route.at(-1));
  assert.equal(tessellate(s).degenerate,0);
  assert(doc.stageForge.slopeDNAStudy.modifiedControlPoints>=35,'not enough real physical 3D changes');
  assert(doc.stageForge.slopeDNAStudy.maxHorizontalDeltaMeters>10);
  assert(doc.stageForge.slopeDNAStudy.maxVerticalDeltaMeters>7);
  assert(width(s,(W9C2_STUDY.startU+W9C2_STUDY.endU)/2)<width(old,.455)-15);
  assert(width(s,.455)>12,'true playable width collapsed');
  assert(Math.abs(width(s,.455)-plan.coreWidthMeters)<3,
   'Catmull Rom true crest width not near target: '+kind);
  for(let i=0;i<=200;i++)assert(width(s,i/200)>10,'interpolated width collapsed: '+kind);
  for(let i=0;i<=30;i++){
   const f=frame(s,i/30,.5);
   assert(f.p.every(Number.isFinite)&&f.forward.every(Number.isFinite)&&f.normal.every(Number.isFinite));
  }
 }
 assert.equal(JSON.stringify(gold),frozen,'baseline generator mutated');
 assert.equal(JSON.stringify(generateP101W9C1AbyssCandidate('ultra')),originalC1);
 assert.equal(JSON.stringify(generateP101A13W9XCandidate()),originalX);
 assert.equal(JSON.stringify(generateP101B5Speedway({lowerReversalLength:1800})),originalB5);
});
test('W9-C2 G1 genuine opposing lateral S-curves on road VI, real crested height and banking',()=>{
 const doc=generateP101W9C2SCrestCandidate('edge'),old=generateP101A13W7Candidate();
 const s=doc.surfaces[W9C2_STUDY.section],base=old.surfaces[W9C2_STUDY.section];
 const sign=(u)=>{
  const a=sample(s,u,.5),b=sample(base,u,.5);
  const o=sample(base,u,1),side=[o[0]-b[0],o[1]-b[1],o[2]-b[2]];
  const diff=[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
  return diff.reduce((v,x,k)=>v+x*side[k],0);
 };
 assert(sign(.385)*sign(.525)<0,'lateral displacement must reverse, not a straight taper');
 const midpoint=(W9C2_STUDY.startU+W9C2_STUDY.endU)/2;
 assert(sample(s,midpoint,.5)[1]-sample(base,midpoint,.5)[1]>10,'crest is real geometry, not VFX');
 assert(w9c2ShapeAt(0,'edge').active===false);
 assert(w9c2ShapeAt(.39,'edge').active===true);
 assert(w9c2ShapeAt(1,'edge').active===false);
 assert.throws(()=>w9c2ShapeAt(.5,'missing'));
 assert.throws(()=>generateP101W9C2SCrestCandidate('unapproved'));
});
test('W9-C2 G1 untouched 240Hz physics supports actual initial launch, no collision cheats',()=>{
 const doc=generateP101W9C2SCrestCandidate('ribbon'),world=compile(doc);
 const runner=new Runner(doc,world,0,52);
 for(let i=0;i<480&&runner.status!=='failed'&&runner.status!=='finished';i++)
  p101Step(runner,0,'OVERDRIVE',{forwardScale:.12});
 assert.equal(1/DT,240);
 assert.equal(RADIUS,.65);
 assert(runner.time>1);
 assert(runner.p.every(Number.isFinite));
 assert(runner.v.every(Number.isFinite));
 assert(runner.events.every(e=>e.type!=='teleport'&&e.type!=='boost-by-course-fix'));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {W6_AWARE_PROFILES,a13W6AuditSteer} from '../scripts/p101-a13-28aware-audit.mjs';
import {generateP101A13RoadCandidate} from '../scripts/p101-a13-road-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner} from '../private/reference_only/director/physics.js';
import {sample} from '../private/reference_only/director/surface.js';
import {makeHazardRoadPlan} from '../web/p97-roadplay-gates.mjs';
import {makeP96RoutePlan} from '../web/p96-avoidance-steer.mjs';
test('A13 W6B all28 lookahead only returns legal human input; never edits physical native state',()=>{
 const doc=generateP101A13RoadCandidate(),r=new Runner(doc,compile(doc),0,52);
 const plan=makeHazardRoadPlan(doc,sample),legacy=makeP96RoutePlan(doc,r);
 const before=JSON.stringify({p:r.p,v:r.v,doc});
 assert.equal(plan.stations.length,28);
 for(const p of W6_AWARE_PROFILES){
  const x=a13W6AuditSteer(r,plan,legacy,p);
  assert(Number.isFinite(x.input)&&Math.abs(x.input)<=1);
  assert(['P96_FIRST12','A13_EXTRA16'].includes(x.source));
 }
 assert.equal(before,JSON.stringify({p:r.p,v:r.v,doc}));
});

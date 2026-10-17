import test from 'node:test';
import assert from 'node:assert/strict';
import {generateEchoRush} from '../scripts/p66-echo-rebuild.mjs';
import {sample,frame} from '../private/reference_only/director/surface.js';
import {approachBeaconVertices} from '../web/p91-approach-beacons.mjs';

test('P91: fork, machines and takeoff markers exist only on authored physical road skins',()=>{
 const doc=generateEchoRush(), snapshot=JSON.stringify(doc);
 const out=approachBeaconVertices(doc,sample,frame);
 assert.deepEqual(out.regions,['FORK','MACHINES','NATURAL_GAP']);
 assert.equal(out.markerCount,68);
 assert.equal(out.vertices.length,68*12);
 assert(out.vertices.every(Number.isFinite));
 assert.equal(JSON.stringify(doc),snapshot,'visual-only sampling must never mutate authored stages');
 assert(doc.surfaces.every(s=>!s.id.includes('P91')),'no new collidable or invisible bridges');
});
test('P91: original frozen stage and irrelevant stage have no new physical-road beacons',()=>{
 assert.deepEqual(approachBeaconVertices({stageForge:{id:'EP-001'}},null,null),{vertices:[],regions:[],markerCount:0});
 const doc={stageForge:{id:'EP-P66'},surfaces:[]};
 assert.deepEqual(approachBeaconVertices(doc,()=>[0,0,0],()=>({normal:[0,1,0]})),{vertices:[],regions:[],markerCount:0});
});
test('P91: sampled road points are finite, no fake-geometry fallback',()=>{
 assert.throws(()=>approachBeaconVertices({stageForge:{id:'EP-P66'},surfaces:[]}),/samplers/);
 const doc={stageForge:{id:'EP-P66'},surfaces:[{rideable:true,collidable:true,visible:true,id:'p66-GAP_TAKEOFF-01'}]};
 assert.throws(()=>approachBeaconVertices(doc,()=>[NaN,0,0],()=>({normal:[0,1,0]})),/Nonfinite/);
});

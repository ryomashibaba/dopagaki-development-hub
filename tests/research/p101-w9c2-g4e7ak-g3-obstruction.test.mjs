import test from 'node:test';
import assert from 'node:assert/strict';
import {ak3ExactOBBProbes,ak3Visibility,AK3_SAMPLE_TICKS,AK3_FOCUS_IDS} from
 '../../scripts/p101-w9c2-g4e7ak-g3-native-obstruction.mjs';
const view={eye:[0,0,0],front:[0,0,1],right:[1,0,0],up:[0,1,0]};
const p={id:'source',enabled:true,center:[0,0,30],yawRadians:0,halfSize:[2,1,1]};
test('AK3 real OBB geometry probe samples center, corners and side faces',()=>{
 const points=ak3ExactOBBProbes(p);
 assert.equal(points.length,13);
 assert(points.every(a=>a.length===3&&a.every(Number.isFinite)));
 assert.deepEqual(AK3_FOCUS_IDS,['a13-machine-01','a13-machine-02']);
 assert.equal(AK3_SAMPLE_TICKS,48);
});
test('AK3 geometry visibility distinguishes unblocked, real B48 mesh and B51 box',()=>{
 const clear=ak3Visibility(view,p,[p],[]);
 assert.equal(clear.pointCount,13);
 assert.equal(clear.pointsApproxClear,13);
 assert.equal(clear.pointsRoadOccluded,0);
 assert.equal(clear.pointsOtherB51Occluded,0);
 assert.equal(clear.geometryCue,true);
 const road=[
  [[-10,-10,15],[10,-10,15],[-10,10,15]],
  [[10,10,15],[-10,10,15],[10,-10,15]]
 ];
 const blocked=ak3Visibility(view,p,[p],road);
 assert.equal(blocked.pointsRoadOccluded,13);
 assert.equal(blocked.pointsApproxClear,0);
 assert.equal(blocked.geometryCue,false);
 const wall={id:'other',enabled:true,center:[0,0,15],yawRadians:0,halfSize:[5,5,1]};
 const other=ak3Visibility(view,p,[p,wall],[]);
 assert.equal(other.pointsOtherB51Occluded,13);
 assert.equal(other.pointsApproxClear,0);
});

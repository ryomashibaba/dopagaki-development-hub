import test from 'node:test';
import assert from 'node:assert/strict';
import {a13MachineBodyVertices} from '../web/p101-a13-machine-visual.mjs';
import {obstacleBodyVertices} from '../web/p73-machine-visual.mjs';
test('A13 high silhouette machines are fully physically bounded and distinct from protected P73 shapes',()=>{
 const hashes=new Set();
 for(const type of ['slider','rotator','piston'])
  for(const mode of ['fail','bounce','push']){
   const v=a13MachineBodyVertices(type,mode);
   assert(v.length>200&&v.length<18000&&v.length%18===0);
   for(let k=0;k<v.length;k+=6)for(let j=0;j<3;j++)assert(Math.abs(v[k+j])<=.504);
   assert(v.every(Number.isFinite));
   assert.notDeepEqual(v,obstacleBodyVertices(type,mode));
   hashes.add(JSON.stringify(v));
  }
 assert.equal(hashes.size,9);
});

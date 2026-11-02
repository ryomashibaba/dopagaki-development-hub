import test from 'node:test';
import assert from 'node:assert/strict';
import {sweep} from '../private/reference_only/director/collision.js';
const triangle=(rideable,part)=>{
 const a=[-10,0,-10],b=[10,0,-10],c=[0,0,10];
 return {a,b,c,normal:[0,1,0],min:[-10,0,-10],max:[10,0,10],
  rideable,part,surface:rideable?'REAL-TOP':'EDGE'};
};
const world=tris=>({bvh:{min:[-10,0,-10],max:[10,0,10],tris}});
test('B48 CCD equal-time seams prefer actual rideable top regardless of BVH order',()=>{
 const top=triangle(true,'top'),edge=triangle(false,'edge');
 for(const tris of [[edge,top],[top,edge]]){
  const hit=sweep(world(tris),[0,2,0],[0,-3,0],.65);
  assert.equal(hit?.triangle.part,'top');
 }
});
test('B48 CCD earlier lethal edge is not masked by later rideable contact',()=>{
 const edge=triangle(false,'edge'),top=triangle(true,'top');
 edge.a[1]=edge.b[1]=edge.c[1]=.5;
 edge.min[1]=edge.max[1]=.5;
 const hit=sweep({bvh:{min:[-10,0,-10],max:[10,.5,10],tris:[top,edge]}},
  [0,2,0],[0,-3,0],.65);
 assert.equal(hit?.triangle.part,'edge');
});

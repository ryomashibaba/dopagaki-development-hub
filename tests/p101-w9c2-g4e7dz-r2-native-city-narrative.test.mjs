import test from 'node:test';
import assert from 'node:assert/strict';
import {NARRATIVES,worldFromLocal,hitsViewport,projectGuide,nativePreview} from '../scripts/p101-w9c2-g4e7dz-r2-native-city-narrative.mjs';
test('Three independent narratives with four authentic sequential views',()=>{
 assert.equal(NARRATIVES.length,3);
 assert.equal(new Set(NARRATIVES.map(x=>x.anchor)).size,3);
 assert.equal(new Set(NARRATIVES.map(x=>JSON.stringify(x.void))).size,3);
 for(const n of NARRATIVES){assert.equal(n.frames.length,4);
  for(const k of ['void','transit','habitation'])assert.ok(n[k].length>=4);}
});
test('Native 3D coordinates are anchored in world, not fabricated in pixels',()=>{
 assert.deepEqual(worldFromLocal({pose:{position:[10,20,30],forward:[0,0,1]}},[[0,2,6]]),[[10,22,36]]);
 assert.throws(()=>worldFromLocal({pose:{position:[0,0,0],forward:[0,0,0]}},[[0,0,0]]),/Degenerate/);
});
test('Offscreen and behind-camera projection cannot be claimed visually present',()=>{
 const camera={eye:[0,0,0],front:[0,0,1]};
 assert.equal(projectGuide(camera,[[-10,0,100],[10,0,100]]).visible,true);
 assert.equal(projectGuide(camera,[[0,0,-10],[10,0,-10]]).visible,false);
 assert.equal(hitsViewport({x:-500,y:20},{x:-200,y:100}),false);
});
test('Exact frozen B48 B51 gap protection and four-stage ordering',()=>{
 const frames=Array.from({length:10},(_,i)=>({id:'t'+String(1400+i*50),timeSeconds:14+i*.5,
  pose:{position:[i*10,0,i*20],forward:[0,0,1]},eye:[0,0,0],front:[0,0,1]}));
 const s={actualB48:7,actualMovingB51:28,originalGapCell52:true,frames};
 assert.equal(nativePreview(s,NARRATIVES[0]).length,4);
 assert.throws(()=>nativePreview({...s,actualMovingB51:27},NARRATIVES[0]),/Protected/);
 assert.throws(()=>nativePreview({...s,originalGapCell52:false},NARRATIVES[0]),/Protected/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {g4e7bgNativeFrames} from '../scripts/p101-w9c2-g4e7bg-native-visual-frames.mjs';
import {g4e7djNativeStoryboard,BG_SHOTS} from '../scripts/p101-w9c2-g4e7dj-native-storyboard.mjs';

test('DJ 240Hz 20-frame storyboard reproduces every frozen BG camera byte-for-byte',()=>{
 const old=g4e7bgNativeFrames(),dj=g4e7djNativeStoryboard();
 assert.equal(dj.physicsHz,240);
 assert.equal(dj.certifiedSlope2Meters,0);
 assert.equal(dj.publication,'HOLD');
 assert.equal(BG_SHOTS.length,10);
 for(const road of ['true-pinch','pinch-switch']){
  assert.deepEqual(dj.stages[road].frames.slice(0,3),old.stages[road].frames);
  assert.equal(dj.stages[road].frames.length,10);
  assert.deepEqual(dj.stages[road].frames.map(f=>f.id).slice(0,3),['t1500','t1700','t1850']);
  assert.ok(dj.stages[road].frames.every(f=>f.source==='ACTUAL_240HZ_START00_P96_FIXED_SCRIPT_NOT_HUMAN'));
  assert.ok(dj.stages[road].frames.every(f=>f.speedMps>52));
  const chronological=[...dj.stages[road].frames].sort((a,b)=>a.timeSeconds-b.timeSeconds);
  assert.deepEqual(chronological.map(x=>x.id),BG_SHOTS.map(x=>x.id));
  assert.ok(chronological.every((f,i)=>i===0||f.tick>chronological[i-1].tick));
 }
});

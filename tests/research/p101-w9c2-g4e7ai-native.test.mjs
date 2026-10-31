import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7AH} from '../../scripts/p101-w9c2-g4e7ah-narrow-real-b48.mjs';
import {g4e7aiNativeFrames,AI_VARIANTS,AI_SHOTS} from '../../scripts/p101-w9c2-g4e7ai-native-frames.mjs';
test('AI original 240Hz nonhuman frames belong to three authentic R2/AH physical B48 stages',()=>{
 const result=g4e7aiNativeFrames();
 assert.equal(result.physicsHz,240);
 assert.equal(result.initialSpeedMps,52);
 assert.equal(result.certifiedSlope2Meters,0);
 assert.equal(result.publication,'HOLD');
 assert.equal(Object.keys(result.stages).length,3);
 assert.equal(AI_SHOTS.length,6);
 for(const id of AI_VARIANTS){
  const stage=generateG4E7AH(id),entry=result.stages[id];
  assert.equal(entry.stageId,stage.stageForge.recordStageId);
  assert.equal(entry.originalMovingMachines,28);
  assert.equal(entry.originalRoads,7);
  assert.equal(entry.frames.length,6);
  assert(entry.frames.every(f=>f.source==='ACTUAL_240HZ_START00_P96_NOT_HUMAN'&&
   f.speedMps>=52&&Number.isFinite(f.yaw)));
  assert.equal(entry.minimumRealWidthMeters,stage.stageForge.g4e7ahStudy.widthMinMeters);
 }
});

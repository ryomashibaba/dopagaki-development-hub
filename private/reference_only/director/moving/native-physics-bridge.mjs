/** Explicit opt-in bridge for an EXISTING native fixed-step ball solver.
 * It detects moving-box contacts from native XYX ball samples; it NEVER changes
 * native position, velocity, difficulty, gravity, game-over or original physics.
 * The host MUST process `hit` with its own native contact/knockback/death rules.
 */
import {normalizeMovingObstacles,sweepSphereAll,obstaclePosesAtTime} from './moving-obstacles.mjs';
export function createMovingObstaclePhysicsBridge(course,{onContact,onIndeterminate}={}){
 const definitions=normalizeMovingObstacles(course);
 function step({previousBallPosition,ballPosition,ballRadius,previousSimulationSeconds,simulationSeconds}){
  const state=sweepSphereAll({movingObstacles:definitions},previousBallPosition,ballPosition,ballRadius,previousSimulationSeconds,simulationSeconds);
  if(state.hit && onContact)onContact(state);
  if(state.status==='indeterminate' && onIndeterminate)onIndeterminate(state);
  return state;
 }
 return {definitions,step,poseAt:time=>obstaclePosesAtTime({movingObstacles:definitions},time)};
}

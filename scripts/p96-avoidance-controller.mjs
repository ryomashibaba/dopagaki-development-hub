/** P96 Node adapter: exact shared browser/native physical input policy. */
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {p96DodgeSteer as shared} from '../web/p96-avoidance-steer.mjs';
export {makeP96RoutePlan,P96_PROFILES} from '../web/p96-avoidance-steer.mjs';
export function p96DodgeSteer(r,plan,profile='early-soft'){
 return shared(r,plan,profile,movingObstaclePose);
}

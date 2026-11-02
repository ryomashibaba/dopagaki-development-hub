/**
 * G4E-4B: determine whether a physically distant receiver collider changes
 * original G4E-3 gap behavior before the ball can reach it.
 * This is a physics integrity investigation, not a gameplay candidate.
 */
import {g4e4NativeRun} from './p101-w9c2-g4e4-native-landing-matrix.mjs';
export function g4e4bColliderIsolation(){
 const cases=[
  {id:'NO_RECEIVER',elevation:null,options:{}},
  {id:'VISIBLE_NONCOLLIDABLE',elevation:123,options:{receiverCollidable:false}},
  {id:'FAR_COLLIDABLE',elevation:123,options:{receiverOffsetXZ:[550,-500]}},
  {id:'NEAR_COLLIDABLE',elevation:123,options:{}}
 ];
 const results=cases.map(x=>({id:x.id,
  ...g4e4NativeRun(x.elevation,{maxSeconds:43,...x.options})}));
 const summary=results.map(x=>({
  id:x.id,status:x.status,elapsed:x.elapsedSeconds,
  failedBeforeLanding:x.failure?.t<37,
  failure:x.failure,realTakeoff:x.realTakeoff,
  landed:x.realReceiverLanding,groundedTicks:x.receiverGroundedTicks,
  contacts:x.contacts}));
 return {schema:'dopagaki.w9c2.g4e4b-collider-isolation/1',
  results,summary,physicsUnchanged:true,human:'HOLD',production:'HOLD'};
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href)
 console.log('G4E4B_COLLIDER_ISOLATION '+JSON.stringify(g4e4bColliderIsolation()));

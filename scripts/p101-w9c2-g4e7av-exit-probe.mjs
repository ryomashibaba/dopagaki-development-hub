/** G4E-7AV: actual first-road exit trajectory versus authored 2nd-road entry.
 * Read-only, nonhuman P96 fixed replay, 240Hz physics; never a gameplay claim.
 */
import {generateG4E7AT} from './p101-w9c2-g4e7at-crown-chasm.mjs';
import {AJ_ROADS} from './p101-w9c2-g4e7aj-reanchor-moving.mjs';
import {Runner,DT,RADIUS} from '../private/reference_only/director/physics.js';
import {compile} from '../private/reference_only/director/collision.js';
import {sample} from '../private/reference_only/director/surface.js';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const diff=(a,b)=>a.map((v,i)=>v-b[i]),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const dist=(a,b)=>Math.hypot(...diff(a,b));
const round=(v,n=3)=>Number(v.toFixed(n)),points=a=>a.map(x=>round(x));
function closest(s,p){
 let best={distance:Infinity,u:0,v:0,xyz:null};
 for(let iu=0;iu<=80;iu++)for(let iv=0;iv<=12;iv++){
  const u=iu/80,v=iv/12,a=sample(s,u,v),d=dist(a,p);
  if(d<best.distance)best={distance:d,u,v,xyz:a};
 }
 return {meters:round(best.distance),u:round(best.u,4),v:round(best.v,4),xyz:points(best.xyz)};
}
function trace(road){
 const stage=generateG4E7AT(road),runner=new Runner(stage,compile(stage),0,52),
   plan=makeP96RoutePlan(stage,runner),surge=createA13SurgeState(),samples=[];
 let eventCursor=0;
 for(let k=0;k<Math.ceil(9/DT)&&['running','ready'].includes(runner.status);k++){
  const steer=p96DodgeSteer(runner,plan,'early-soft',movingObstaclePose).input/4.8;
  p101Step(runner,steer,'OVERDRIVE',{forwardScale:p101A13ForwardScale(runner,surge),collisionRecovery:false});
  const events=runner.events.slice(eventCursor);eventCursor=runner.events.length;
  if((runner.time>=5.2&&k%60===0)||events.some(x=>['air','contact','failure'].includes(x.type))){
   const first=closest(stage.surfaces[0],runner.p),second=closest(stage.surfaces[1],runner.p);
   samples.push({t:round(runner.time,4),position:points(runner.p),
    velocity:points(runner.v),speed:round(Math.hypot(...runner.v)),
    input:round(steer),grounded:runner.grounded,surface:runner.surface,
    first,second,events:events.filter(x=>['air','contact','failure','moving-contact'].includes(x.type)).map(x=>({type:x.type,surface:x.surface,reason:x.reason}))});
  }
 }
 const a=stage.surfaces[0],b=stage.surfaces[1];
 const cross=Array.from({length:7},(_,i)=>({road1u:round(.88+.02*i,3),
  center:points(sample(a,.88+.02*i,.5))}));
 return {road,end:{status:runner.status,time:round(runner.time,5),fail:runner.failure?.reason,
  surface:runner.surface},road1End:points(sample(a,1,.5)),
  road2Start:points(sample(b,0,.5)),
  interRoadEndpointGapMeters:round(dist(sample(a,1,.5),sample(b,0,.5))),
  actualVoid:a.voidLongitudinalCells,geometryEnd:cross,
  samples,nonHuman:true,publication:'HOLD'};
}
export function g4e7avExitProbe(){return {schema:'g4e7av-first-road-end-real-240hz/1',
  results:AJ_ROADS.map(trace),human:'HOLD',formalSlope2Meters:0};}
console.log('G4E7AV_EXIT_PROBE '+JSON.stringify(g4e7avExitProbe()));

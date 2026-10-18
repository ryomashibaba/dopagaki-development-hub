/**
 * W7 — focused native-physics candidate comparison, NOT a production change.
 * Each candidate preserves all 28 actual B51-C moving collision bodies,
 * the native B48 240Hz runner, and the seven road centerlines/seams.
 *
 * The previous W6A controlled test proved two independent failures:
 * narrowing alone loses lower reversal; two added machines bounce/push the
 * reference trajectory off the road. Test conservative high-speed shoulder
 * placements and narrower-but-recoverable physical road-width envelopes.
 */
import {generateP101A13RoadCandidate} from './p101-a13-road-build.mjs';
import {generateP101B5Speedway} from './p101-b5-speedway-build.mjs';
import {frame,sample} from '../private/reference_only/director/surface.js';
import {A13_HAZARD_SPECS} from '../web/p101-a13-hazard-layout.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const round=(x,n=3)=>Number(x.toFixed(n));
const hyp=a=>Math.hypot(...a);
const normalize=a=>a.map(v=>v/(hyp(a)||1));
export const W7_TRIALS=Object.freeze([
 Object.freeze({id:'current28',widths:[1,1,1,1,1,1,1],shift02:0,shift03:0}),
 Object.freeze({id:'turn4-wide28',widths:[1,1,1,0,1,1,1],shift02:0,shift03:0}),
 Object.freeze({id:'shoulder02',widths:[1,1,1,1,1,1,1],shift02:26,shift03:0}),
 Object.freeze({id:'shoulder02-03',widths:[1,1,1,1,1,1,1],shift02:26,shift03:27}),
 Object.freeze({id:'shoulders-turn4',widths:[1,1,1,0,1,1,1],shift02:26,shift03:27}),
 Object.freeze({id:'shoulders-3q',widths:[.75,.75,.75,.55,.75,.75,.75],shift02:26,shift03:27}),
 Object.freeze({id:'shoulders-half',widths:[.5,.5,.5,.5,.5,.5,.5],shift02:26,shift03:27}),
 Object.freeze({id:'shoulders-wide',widths:[0,0,0,0,0,0,0],shift02:26,shift03:27}),
 // W7B: one more sequential real moving collision was discovered at #05.
 Object.freeze({id:'w7b-rotor05-18',widths:[1,1,1,1,1,1,1],shift02:26,shift03:27,shift05:-18}),
 Object.freeze({id:'w7b-rotor05-26',widths:[1,1,1,1,1,1,1],shift02:26,shift03:27,shift05:-26}),
 Object.freeze({id:'w7b-rotor05-34',widths:[1,1,1,1,1,1,1],shift02:26,shift03:27,shift05:-34}),
 Object.freeze({id:'w7b-rotor05-42',widths:[1,1,1,1,1,1,1],shift02:26,shift03:27,shift05:-42}),
 Object.freeze({id:'w7b-rotor05-26-turn4',widths:[1,1,1,0,1,1,1],shift02:26,shift03:27,shift05:-26}),
 Object.freeze({id:'w7b-rotor05-34-half',widths:[.5,.5,.5,.5,.5,.5,.5],shift02:26,shift03:27,shift05:-34}),
 // W7C: margin of actual B48 road as an alternating native moving machine
 // shoulder placement. Never remove the real colliders or fake safe passages.
 Object.freeze({id:'w7c-edges-100',widths:[1,1,1,1,1,1,1],roadsideFactor:1}),
 Object.freeze({id:'w7c-edges-120',widths:[1,1,1,1,1,1,1],roadsideFactor:1.2}),
 Object.freeze({id:'w7c-edges-135',widths:[1,1,1,1,1,1,1],roadsideFactor:1.35}),
 Object.freeze({id:'w7c-edges-120-turn4',widths:[1,1,1,0,1,1,1],roadsideFactor:1.2}),
 Object.freeze({id:'w7c-edges-120-middle',widths:[.65,.65,.65,.15,.65,.65,.65],roadsideFactor:1.2}),
 Object.freeze({id:'w7c-target08-24',widths:[1,1,1,1,1,1,1],shift02:26,shift03:27,shift05:-26,shift08:24}),
 Object.freeze({id:'w7c-target08-40-turn4',widths:[1,1,1,0,1,1,1],shift02:26,shift03:27,shift05:-26,shift08:40}),
 // W7E: preserve narrower-but-landable W7C physical skin, but increase
 // real on-road footprints so the added 16 machines aren't decoration.
 Object.freeze({id:'w7e-balanced',widths:[.65,.65,.65,.15,.65,.65,.65],roadsideByType:[1,1.1,.9],verticalByType:[-.5,0,-1.3]}),
 Object.freeze({id:'w7e-active',widths:[.65,.65,.65,.15,.65,.65,.65],roadsideByType:[.85,.98,.8],verticalByType:[-.8,0,-2]}),
 Object.freeze({id:'w7e-middle',widths:[.65,.65,.65,.15,.65,.65,.65],roadsideByType:[.95,1.05,.85],verticalByType:[-.7,0,-1.5]}),
 Object.freeze({id:'w7e-ramp',widths:[.65,.65,.65,.15,.65,.65,.65],roadsideByType:[.90,1.08,.9],verticalByType:[-.6,0,-1.9]}),
 // W7F: W7E measured only 9/16 road-active hazards. Seek real on-surface
 // footprints without falsely declaring the centerline safe/unsafe.
 Object.freeze({id:'w7f-gentle',widths:[.65,.65,.65,.15,.65,.65,.65],roadsideByType:[.75,.8,.75],verticalByType:[-.8,-.5,-1.6]}),
 Object.freeze({id:'w7f-balance',widths:[.65,.65,.65,.15,.65,.65,.65],roadsideByType:[.65,.8,.65],verticalByType:[-.8,-.5,-1.6]}),
 Object.freeze({id:'w7f-rotor',widths:[.65,.65,.65,.15,.65,.65,.65],roadsideByType:[.7,.6,.7],verticalByType:[-.8,-.5,-1.8]}),
 Object.freeze({id:'w7f-dynamic',widths:[.65,.65,.65,.15,.65,.65,.65],roadsideByType:[.65,.65,.7],verticalByType:[-.8,-.5,-1.8]}),
 Object.freeze({id:'w7f-strong',widths:[.65,.65,.65,.15,.65,.65,.65],roadsideByType:[.55,.65,.6],verticalByType:[-.8,-.5,-1.8]}),
 Object.freeze({id:'w7f-lowrotor',widths:[.65,.65,.65,.15,.65,.65,.65],roadsideByType:[.75,.75,.75],verticalByType:[-.8,-1,-1.8]})
]);
export function makeW7TrialDoc(trial){
 if(!W7_TRIALS.includes(trial))throw Error('W7 uses declared native trial only');
 const doc=generateP101A13RoadCandidate(),b5=generateP101B5Speedway({lowerReversalLength:1800});
 for(let i=0;i<7;i++){
  const t=trial.widths[i];
  if(!(t>=0&&t<=1))throw Error('W7 width blend 0..1 only');
  const physical=doc.surfaces[i].points,wide=b5.surfaces[i].points;
  if(physical.length!==wide.length)throw Error('W7 lattice structural mismatch');
  for(let j=0;j<physical.length;j++){
   physical[j]=wide[j].map((x,k)=>x+(physical[j][k]-x)*t);
  }
 }
 // Global lane-edge occupancy study: targets real control-point halfwidth;
 // preserves the alternating lane-side pattern of the authored 16 stations.
 if(trial.roadsideFactor!==undefined||trial.roadsideByType!==undefined){
  if(trial.roadsideFactor!==undefined&&!(trial.roadsideFactor>=.8&&trial.roadsideFactor<=1.5))throw Error('W7C bounded shoulder factor required');
  if(trial.roadsideByType!==undefined&&(!Array.isArray(trial.roadsideByType)||trial.roadsideByType.length!==3||trial.roadsideByType.some(x=>x<.45||x>1.5)))throw Error('W7E bounded kind-specific road-edge factors');
  for(let k=0;k<A13_HAZARD_SPECS.length;k++){
   const [section,u,type,offset]=A13_HAZARD_SPECS[k],s=doc.surfaces[section];
   const row=Math.round(u*30),point=s.points[row*5+2],edge=s.points[row*5];
   const half=hyp(point.map((x,j)=>x-edge[j]));
   const factor=trial.roadsideByType?.[type]??trial.roadsideFactor;
   const target=Math.sign(offset)*half*factor;
   const delta=target-offset;
   const f=frame(s,u,.5),forward=normalize([f.forward[0],0,f.forward[2]]);
   const side=normalize([-forward[2],0,forward[0]]);
   const ob=doc.movingObstacles[12+k];
   ob.position=ob.position.map((x,j)=>x+delta*side[j]);
   if(trial.verticalByType){
    if(trial.verticalByType.length!==3||trial.verticalByType.some(x=>x>0||x< -3))throw Error('W7E no arbitrary collider elevation');
    ob.position[1]+=trial.verticalByType[type];
   }
  }
 }
 for(const [index,delta] of [[13,trial.shift02],[14,trial.shift03],[16,trial.shift05??0],[19,trial.shift08??0]]){
  if(!delta)continue;
  // Hazard indexes 13/14 are *new* #02/#03; untouched original 12 frozen.
  const section=index===13?0:index===14?1:index===16?2:3,u=index===13?.73:index===14?.40:index===16?.14:.10;
  const f=frame(doc.surfaces[section],u,.5);
  const forward=normalize([f.forward[0],0,f.forward[2]]);
  const side=normalize([-forward[2],0,forward[0]]);
  doc.movingObstacles[index].position=doc.movingObstacles[index].position.map((x,k)=>x+side[k]*delta);
 }
 doc.stageForge={...doc.stageForge,studyOnly:'W7_MATRIX_IN_MEMORY_NOT_BUILT',
  fullStartToFinish:'NOT_VERIFIED_A13',humanPlaytest:'NOT_RUN',
  genuineFastLaw:null,productionPromoted:false, fairness:'NOT_APPROVED'};
 if(doc.movingObstacles.length!==28||doc.surfaces.length!==7)throw Error('W7 28 solid / 7 road integrity');
 return doc;
}
export function runW7Trial(trial,{maxSeconds=68}={}){
 if(!W7_TRIALS.includes(trial)||!Number.isFinite(maxSeconds)||maxSeconds<40||maxSeconds>80)
  throw Error('W7 bounded physics trial only');
 const doc=makeW7TrialDoc(trial),runner=new Runner(doc,compile(doc),0,52);
 const plan=makeP96RoutePlan(doc,runner),surge=createA13SurgeState();
 const visited=new Set(),contacts=[],trace=[];let index=0,air=0,airLongest=0,peak=52;
 for(let tick=0;tick<Math.ceil(maxSeconds/DT)&&!['failed','finished'].includes(runner.status);tick++){
  const target=p96DodgeSteer(runner,plan,'early-soft',movingObstaclePose);
  p101Step(runner,target.input/4.8,'OVERDRIVE',{forwardScale:p101A13ForwardScale(runner,surge)});
  if(runner.surface){visited.add(runner.surface);air=0;}else{air+=DT;airLongest=Math.max(airLongest,air);}
  peak=Math.max(peak,hyp(runner.v));
  for(;index<runner.events.length;index++){
   const ev=runner.events[index];
   if(ev.type==='moving-contact')contacts.push({id:ev.id,mode:ev.mode,t:round(ev.t)});
  }
  if(tick%480===0)trace.push({t:round(runner.time),section:surge.section,
   road:runner.surface||'AIR',speed:round(hyp(runner.v),1),steer:round(target.input/4.8,2)});
 }
 return {id:trial.id,nativePhysicsHz:1/DT,nativeMachines:doc.movingObstacles.length,
  status:runner.status,sections:visited.size,finished:runner.status==='finished'&&visited.size===7&&!runner.failure,
  seconds:round(runner.time),peakMps:round(peak,1),longestAir:round(airLongest),
  contacts, failure:runner.failure?{reason:runner.failure.reason,t:round(runner.failure.t),
   position:runner.failure.position.map(x=>round(x,1))}:null,
  widths:trial.widths,shift02:trial.shift02,shift03:trial.shift03,shift05:trial.shift05??0,shift08:trial.shift08??0,roadsideFactor:trial.roadsideFactor??null,roadsideByType:trial.roadsideByType??null,verticalByType:trial.verticalByType??null,trace};
}
export function runW7Matrix(trials=W7_TRIALS){return trials.map(x=>runW7Trial(x));}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
 const records=runW7Matrix(process.argv.includes('--w7e-only')?W7_TRIALS.filter(t=>t.id.startsWith('w7e-')):process.argv.includes('--w7c-only')?W7_TRIALS.filter(t=>t.id.startsWith('w7c-')):process.argv.includes('--w7b-only')?W7_TRIALS.filter(t=>t.id.startsWith('w7b-')):W7_TRIALS);
 for(const r of records)console.log('A13_W7_TRIAL '+JSON.stringify({...r,trace:undefined}));
 console.log('A13_W7_TRACE '+JSON.stringify(Object.fromEntries(records.map(x=>[x.id,x.trace]))));
 if(records.some(r=>r.nativePhysicsHz!==240||r.nativeMachines!==28))
  throw Error('W7 native physics/28-body constraint violated');
}

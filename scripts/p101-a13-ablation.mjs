/**
 * A13 W6 — controlled 2 x 2 native 240Hz ablation, *not* gameplay tuning.
 * Compare road width (B5 wide vs A13 narrowed), and native moving collider
 * count (original 12 vs original+16 = 28), with the EXACT same scripted
 * 12-station corrective steering, 52m/s launch, and positive B5 power law.
 * Note that the original 12 were positioned in B5 and never reanchored.
 * The added 16 sit on unchanged road centerlines even in wide-skin trials.
 *
 * Variant sources are in-memory clones of A13, never published build assets.
 * No native B48/B51-C code edits, no engine safety bypass or teleport.
 */
import {generateP101A13RoadCandidate} from './p101-a13-road-build.mjs';
import {generateP101B5Speedway} from './p101-b5-speedway-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';

const round=(x,n=3)=>Number(x.toFixed(n));
export const W6_CASES=Object.freeze([
 Object.freeze({name:'wide12',road:'B5_WIDE_IN_MEMORY',additional16:false}),
 Object.freeze({name:'narrow12',road:'A13_NARROW',additional16:false}),
 Object.freeze({name:'wide28',road:'B5_WIDE_IN_MEMORY',additional16:true}),
 Object.freeze({name:'narrow28',road:'A13_NARROW',additional16:true})
]);
export function makeW6DiagnosticDoc(spec){
 if(!W6_CASES.includes(spec))throw Error('Only declared A13 ablation specs');
 const doc=generateP101A13RoadCandidate();
 if(spec.road==='B5_WIDE_IN_MEMORY'){
  const baseline=generateP101B5Speedway({lowerReversalLength:1800});
  doc.surfaces=baseline.surfaces;
  doc.route=baseline.route;
 }
 if(!spec.additional16)doc.movingObstacles=doc.movingObstacles.slice(0,12);
 if(doc.stageForge.variant!=='A13_GAMEPLAY_ISOLATED'||
    doc.stageForge.nominalLengthMeters!==7280||doc.surfaces.length!==7||
    doc.movingObstacles.length!==(spec.additional16?28:12))
  throw Error('W6 unrecognized native diagnostic geometry / machines');
 return doc;
}
export function runW6Case(spec,{seconds=63}={}){
 if(!Number.isFinite(seconds)||seconds<35||seconds>80)throw Error('W6 35-80 s max');
 const doc=makeW6DiagnosticDoc(spec),r=new Runner(doc,compile(doc),0,52);
 const plan=makeP96RoutePlan(doc,r),state=createA13SurgeState();
 const visited=new Set(),trace=[];
 let peak=52,lastAir=0,longestAir=0,firstAir=null,lastContactIndex=0;
 const impact=[];
 for(let i=0;i<Math.ceil(seconds/DT)&&r.status!=='failed'&&r.status!=='finished';i++){
  const result=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose);
  const steer=result.input/4.8;
  p101Step(r,steer,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,state)});
  if(r.surface){visited.add(r.surface);lastAir=0;}
  else{if(firstAir===null)firstAir=r.time;lastAir+=DT;longestAir=Math.max(longestAir,lastAir);}
  peak=Math.max(peak,Math.hypot(...r.v));
  for(;lastContactIndex<r.events.length;lastContactIndex++){
   const ev=r.events[lastContactIndex];
   if(ev.type==='moving-contact')impact.push({id:ev.id,mode:ev.mode,t:round(ev.t),section:state.section,
    position:ev.position.map(x=>round(x,1))});
  }
  if(i%480===0)trace.push({t:round(r.time),section:state.section,road:r.surface||'AIR',
   speed:round(Math.hypot(...r.v),1),steering:round(steer,2),
   targetOriginal12:result.station||null,
   xyz:r.p.map(x=>round(x,1))});
 }
 return {case:spec.name,road:spec.road,additional16:spec.additional16,engineHz:1/DT,
  input:'P96_EARLY_SOFT_FIRST_12_ONLY_DIV_4.8',
  startSpeedMps:52,actualMovingBodies:doc.movingObstacles.length,status:r.status,
  reachedSevenRoads:visited.size===7,roadsVisited:[...visited],finished:r.status==='finished'&&visited.size===7&&!r.failure,
  elapsed:round(r.time),peakSpeed:round(peak,1),firstAir:firstAir===null?null:round(firstAir),
  longestContinuousAir:round(longestAir),contacts:impact,
  failure:r.failure?{time:round(r.failure.t),reason:r.failure.reason,
   speed:round(r.failure.speed,1),xyz:r.failure.position.map(x=>round(x,1))}:null,trace};
}
export function runW6Ablation(){return W6_CASES.map(spec=>runW6Case(spec));}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
 const rows=runW6Ablation();
 for(const r of rows)console.log('A13_W6_ABLATION '+JSON.stringify({...r,trace:undefined}));
 console.log('A13_W6_TRACE '+JSON.stringify(Object.fromEntries(rows.map(r=>[r.case,r.trace]))));
 if(rows.length!==4||rows.some(r=>r.engineHz!==240||!['failed','finished','running'].includes(r.status)))
  throw Error('W6 ablation incomplete/integrity failure');
}

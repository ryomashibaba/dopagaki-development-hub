/**
 * G4E-7T scouting only: find a REAL B48 lip where the native Runner is still
 * grounded. Contrast intact G4E-7R-SWEEP vs the same B48 with missing cells.
 * Never accept a gap just because an unrelated slope already launched the ball.
 */
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {generateG4E7RPhysical} from './p101-w9c2-g4e7r-grade-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {sample,tessellate} from '../private/reference_only/director/surface.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const roadU=(points,p)=>{
 let best=Infinity,found=0;
 for(let k=0;k<points.length-1;k++){
  const a=points[k],v=a.map((x,i)=>points[k+1][i]-x);
  const dot=(a,b)=>a.reduce((x,y,i)=>x+y*b[i],0);
  const delta=p.map((x,i)=>x-a[i]),f=Math.max(0,Math.min(1,dot(delta,v)/(dot(v,v)||1)));
  const d=Math.hypot(...delta.map((x,i)=>x-f*v[i]));
  if(d<best){best=d;found=(k+f)/(points.length-1);}
 }
 return {u:found,d:best};
};
const fmt=(n,d=3)=>Number(n.toFixed(d));
const opts=Object.freeze([
 [45,1],[49,2],[54,1],[58,2],[62,1],[65,2],[68,1],[70,2],
 [72,1],[74,2],[76,1],[78,2]
]);
function simulate(doc,maxSeconds=10){
 const r=new Runner(doc,compile(doc),0,52),plan=makeP96RoutePlan(doc,r),
  surge=createA13SurgeState(),road=doc.surfaces[0],
  samples=Array.from({length:129},(_,i)=>sample(road,i/128,.5));
 const points=[],groundedByCell=new Map(),events=[];
 let prevGrounded=r.grounded;
 for(let i=1;i<maxSeconds/DT&&!['failed','finished'].includes(r.status);i++){
  const steer=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose).input/4.8;
  p101Step(r,steer,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,surge),collisionRecovery:false});
  const loc=roadU(samples,r.p),cell=Math.floor(loc.u*90);
  if(r.grounded!==prevGrounded&&loc.u>.3&&loc.u<.98&&loc.d<24)
   events.push({t:fmt(r.time,4),u:fmt(loc.u,5),grounded:r.grounded,speed:fmt(Math.hypot(...r.v))});
  prevGrounded=r.grounded;
  if(loc.u>.32&&loc.u<.98&&loc.d<24){
   const z=groundedByCell.get(cell)||{count:0,ground:0,air:0};
   z.count++;r.grounded?z.ground++:z.air++;groundedByCell.set(cell,z);
   if(i%8===0)points.push({t:fmt(r.time,4),u:fmt(loc.u,5),speed:fmt(Math.hypot(...r.v)),
    grounded:r.grounded,p:r.p.map(x=>fmt(x,2))});
  }
  if(loc.u>.97&&r.time>2)break;
 }
 return {status:r.status,timeSeconds:fmt(r.time),events,points,
  groundedByCell:Object.fromEntries([...groundedByCell].map(([k,v])=>[k,v]))};
}
export function g4e7tCausalScout(){
 const original=generateG4E7RPhysical('sweep'),baseline=simulate(original);
 const results=[];
 for(const [cell,count] of opts){
  const doc=generateG4E7RPhysical('sweep'),road=doc.surfaces[0];
  road.voidLongitudinalCells=Array.from({length:count},(_,i)=>cell+i);
  if(tessellate(road).degenerate!==0)throw Error('G4E-7T invalid real B48 cell');
  const candidate=simulate(doc);
  const b=baseline.points,c=candidate.points;
  const atLip=baseline.groundedByCell[cell]||{count:0,ground:0,air:0};
  const firstAir=candidate.events.find(e=>e.grounded===false&&e.u>=cell/90-.03);
  const lastLanding=candidate.events.find(e=>e.grounded===true&&e.u>(cell+count)/90);
  results.push({firstCell:cell,cells:count,lipU:fmt(cell/90,5),
   widthMeters:fmt(Math.hypot(...sample(road,cell/90,0).map((x,i)=>x-sample(road,cell/90,1)[i]))),
   lipBaselineGroundTicks:atLip.ground,lipBaselineAirTicks:atLip.air,
   initialAirEvent:firstAir||null,landingAfterGap:lastLanding||null,
   nativeStatus:candidate.status,nativeTimeSeconds:candidate.timeSeconds,
   traceCount:c.length,nonEmptyRealVoid:true});
 }
 return {schema:'dopagaki.g4e7t-grounded-lip-scout/1',
  base:'G4E7R_SWEEP_UNCHANGED',control:baseline,results,
  physicalHz:1/DT,scriptedOnly:true,certifiedSlope2Meters:0,
  officialApproval:'HOLD'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const d=g4e7tCausalScout();
 if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(d,null,2)+'\n');
 console.log('G4E7T_SCOUT '+JSON.stringify({baselineEvents:d.control.events,
  candidates:d.results.map(({traceCount,...c})=>c),approved:0}));
}

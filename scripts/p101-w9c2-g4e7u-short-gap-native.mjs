/**
 * G4E-7U legitimate canonical start00 240Hz one-cell gap scan and
 * matching-control causality. Never count failed/frozen Runner as extra air.
 */
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {generateG4E7UPhysical,G4E7U_CHOICES} from './p101-w9c2-g4e7u-single-cell-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {sample} from '../private/reference_only/director/surface.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const fmt=(x,n=4)=>Number(x.toFixed(n));
const sep=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
const dot=(a,b)=>a.reduce((sum,v,i)=>sum+v*b[i],0);
function project(line,p){
 let distance=Infinity,u=0;
 for(let i=0;i<line.length-1;i++){
  const a=line[i],v=a.map((x,k)=>line[i+1][k]-x),delta=p.map((x,k)=>x-a[k]),
   t=Math.max(0,Math.min(1,dot(delta,v)/(dot(v,v)||1))),
   d=Math.hypot(...delta.map((x,k)=>x-t*v[k]));
  if(d<distance){distance=d;u=(i+t)/(line.length-1);}
 }
 return {u,distance};
}
function initialize(choice){
 const doc=generateG4E7UPhysical(choice.id),runner=new Runner(doc,compile(doc),0,52);
 return {id:choice.id,doc,runner,plan:makeP96RoutePlan(doc,runner),
  surge:createA13SurgeState(),line:Array.from({length:193},(_,i)=>sample(doc.surfaces[0],i/192,.5)),
  seen:new Set(),ordered:[],maxSpeed:52,nearLipGround:0,
  firstAir:null,firstRejoin:null,nearestSamples:[],fatalContacts:[]};
}
export function g4e7uNativeMatrix(){
 const states=G4E7U_CHOICES.map(initialize);
 const comparisons=Object.fromEntries(G4E7U_CHOICES.slice(1).map(c=>[c.id,{
  extraGapAirTicks:0,maxSpatialDifference:0,firstDivergence:null,
  eligibleBothRunningTicks:0}]));
 for(let tick=1;tick<=70/DT;tick++){
  for(const s of states){
   const r=s.runner;
   if(r.status!=='ready'&&r.status!=='running')continue;
   const input=p96DodgeSteer(r,s.plan,'early-soft',movingObstaclePose).input/4.8;
   p101Step(r,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,s.surge),
    collisionRecovery:false});
   const v=Math.hypot(...r.v);s.maxSpeed=Math.max(v,s.maxSpeed);
   if(r.surface&&!s.seen.has(r.surface)){s.seen.add(r.surface);s.ordered.push(r.surface);}
   const g=s.doc.stageForge.g4e7uStudy.gap,where=project(s.line,r.p);
   if(g&&where.distance<25){
    if(r.grounded&&where.u>=g.uTakeoff-.025&&where.u<g.uTakeoff)s.nearLipGround++;
    if(!r.grounded&&where.u>=g.uTakeoff-.005&&where.u<=g.uLanding+.012&&!s.firstAir)
     s.firstAir={t:fmt(r.time,5),u:fmt(where.u,6),speedMps:fmt(v,3)};
    if(s.firstAir&&r.grounded&&r.surface===s.doc.surfaces[0].id&&
       where.u>g.uLanding&&!s.firstRejoin)
     s.firstRejoin={t:fmt(r.time,5),u:fmt(where.u,6),speedMps:fmt(v,3)};
   }
   if(g&&where.distance<30&&where.u>=g.uTakeoff-.04&&where.u<=g.uLanding+.08&&tick%4===0)
    s.nearestSamples.push({time:fmt(r.time,5),u:fmt(where.u,6),
      grounded:r.grounded,speedMps:fmt(v,2),
      xyz:r.p.map(x=>fmt(x,2)),surface:r.surface});
   for(const event of r.events.slice(-3))if(event.type==='static-fatal-contact'&&
       !s.fatalContacts.some(x=>x.t===event.t))
    s.fatalContacts.push({t:event.t,part:event.part,surface:event.surface,
      impactSpeed:event.impactSpeed??null});
  }
  const c=states[0];
  for(const s of states.slice(1)){
   const q=comparisons[s.id],a=c.runner,b=s.runner,g=s.doc.stageForge.g4e7uStudy.gap;
   if(a.status!=='running'||b.status!=='running')continue;
   const where=project(c.line,a.p);
   if(where.distance>25||where.u<g.uTakeoff-.025||where.u>g.uLanding+.075)continue;
   q.eligibleBothRunningTicks++;
   const delta=sep(a.p,b.p);
   q.maxSpatialDifference=Math.max(q.maxSpatialDifference,delta);
   if(a.grounded&&!b.grounded)q.extraGapAirTicks++;
   if(!q.firstDivergence&&(delta>.01||a.grounded!==b.grounded))
    q.firstDivergence={t:fmt(b.time,5),u:fmt(where.u,6),distanceMeters:fmt(delta,6),
     intactGrounded:a.grounded,gapGrounded:b.grounded};
  }
  if(states.every(s=>s.runner.status==='failed'||s.runner.status==='finished'))break;
 }
 const candidates=states.map(s=>{
  const r=s.runner,roads=s.doc.surfaces.map(x=>x.id);
  return {variant:s.id,runState:r.status,timeSeconds:fmt(r.time,4),
   finished:r.status==='finished'&&!r.failure,
   allSevenInOrder:roads.every((id,i)=>s.seen.has(id)&&(i===0||
     s.ordered.indexOf(roads[i-1])<s.ordered.indexOf(id))),
   visitedRoadCount:roads.filter(id=>s.seen.has(id)).length,
   maxSpeedMps:fmt(s.maxSpeed,2),gap:s.doc.stageForge.g4e7uStudy.gap,
   groundedBeforeLipTicks:s.nearLipGround,
   firstAir:s.firstAir,firstRejoin:s.firstRejoin,
   failure:r.failure??null,fatalContacts:s.fatalContacts,
   nearestSamples:s.nearestSamples,
   humanPlayability:'NOT_TESTED',certifiedSlope2Meters:0};
 });
 return {schema:'dopagaki.g4e7u-trueB48-short-gap-native/1',
  nativeHz:1/DT,start00:true,initialSpeed:52,
  input:'P96_early_soft_DIV4_8_RESEARCH_ONLY',movingMachines:28,realRoads:7,
  source:'G4E7T_SOLID_UNMODIFIED_CONTROL',candidates,comparisons,
  acceptance:'HOLD',humanPlaytest:'NOT_RUN',certifiedSlope2Meters:0};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const d=g4e7uNativeMatrix();
 if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(d,null,2)+'\n');
 console.log('G4E7U_NATIVE '+JSON.stringify({
  candidates:d.candidates.map(({nearestSamples,gap,...c})=>({...c,gapMeters:gap?.gapMeters??null})),
  comparisons:d.comparisons,acceptance:d.acceptance}));
}

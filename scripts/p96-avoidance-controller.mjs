/**
 * P96 read-only motion-aware steering QA, NEVER an in-game auto-assist.
 * Uses actual B48 route guide arc length and B51-C obstacle poses at predicted
 * arrival time. Returns standard [-1,1] user steering, without physics edits.
 *
 * This tests whether P95 is avoidable, not whether an unassisted human can win.
 */
import {p94NativeSteer} from '../web/p94-native-steer.mjs';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {P95_HAZARD_SPECS} from './p95-void-hazard-build.mjs';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const dot=(a,b)=>a.reduce((v,x,i)=>v+x*b[i],0);
const norm=a=>{const m=Math.hypot(...a)||1;return a.map(x=>x/m);};
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const length=a=>Math.hypot(...a);
export const P96_PROFILES=Object.freeze([
 {id:'near-soft',leadMeters:170,laneMeters:24,offsetGain:.046},
 {id:'early-soft',leadMeters:290,laneMeters:25,offsetGain:.046},
 {id:'early-strong',leadMeters:300,laneMeters:33,offsetGain:.062},
 {id:'fast-switch',leadMeters:240,laneMeters:34,offsetGain:.075}
]);
function closestProgress(points,p){
 let best={dist:Infinity,progress:0,lateral:0,point:null};
 let total=0;
 for(let i=0;i<points.length-1;i++){
  const a=points[i],b=points[i+1],segment=sub(b,a),segLen=length(segment);
  if(segLen<1e-6)continue;
  const t=clamp(dot(sub(p,a),segment)/(segLen*segLen),0,1);
  const pt=a.map((v,k)=>v+t*segment[k]),dist=length(sub(pt,p));
  if(dist<best.dist){
   const tangent=norm([segment[0],0,segment[2]]);
   const right=[-tangent[2],0,tangent[0]];
   best={dist,progress:total+t*segLen,lateral:dot(sub(p,pt),right),point:pt};
  }
  total+=segLen;
 }
 return {...best,total};
}
export function makeP96RoutePlan(doc,runner){
 if(doc?.stageForge?.id!=='VB-P95')throw Error('P96 audit applies to unmodified P95 candidate only');
 const guides=runner.guides;
 if(!Array.isArray(guides)||guides.length!==7)throw Error('Real seven authored physical guides required');
 let cumulative=0;
 const lengths=guides.map(g=>{
  const lengthMeters=g.points.slice(1).reduce((sum,p,i)=>sum+length(sub(p,g.points[i])),0);
  const result={surface:g.surface,points:g.points,start:cumulative,length:lengthMeters};
  cumulative+=lengthMeters;return result;
 });
 const stations=P95_HAZARD_SPECS.map(([idx,u,type],i)=>{
  const g=lengths[idx],local=closestProgress(g.points,g.points[Math.round(u*64)]);
  return {id:doc.movingObstacles[i].id,ob:doc.movingObstacles[i],
    section:idx,surface:g.surface,at:g.start+u*g.length,
    localU:u,type};
 });
 return {lengths,stations,totalDistance:cumulative};
}
export function p96DodgeSteer(r,plan,profile='early-soft'){
 const p=typeof profile==='string'?P96_PROFILES.find(x=>x.id===profile):profile;
 if(!p||p.leadMeters<80||p.leadMeters>400||p.laneMeters<10||p.laneMeters>40||p.offsetGain<.02||p.offsetGain>.09)throw Error('Invalid bounded avoidance profile');
 const baseline=p94NativeSteer(r,'corrective');
 const g=plan.lengths.find(s=>s.surface===(r.surface||r.lastSurface));
 if(!g)return {input:baseline,station:null,desiredOffset:0,leadDistance:null};
 const here=g.start+closestProgress(g.points,r.p).progress;
 const next=plan.stations.find(x=>x.at-here>=-18&&x.at-here<p.leadMeters);
 if(!next)return {input:baseline,station:null,desiredOffset:0,leadDistance:null};
 const ahead=Math.max(0,next.at-here);
 const speed=Math.max(35,Math.hypot(...r.v));
 const approachT=r.time+ahead/speed;
 const road=plan.lengths[next.section],index=Math.round(next.localU*64);
 const tangent=norm(sub(road.points[Math.min(64,index+1)],road.points[Math.max(0,index-1)]));
 const right=[-tangent[2],0,tangent[0]];
 const roadAt=road.points[index];
 const moving=movingObstaclePose(next.ob,approachT);
 const obstacleLat=dot(sub(moving.center,roadAt),right);
 // Every candidate target is bounded to the physical 92-127m-wide road.
 // Choose the opposite *physical* side, not a guaranteed empty safe lane.
 const laneSide=obstacleLat>0?-1:1;
 const desired=laneSide*p.laneMeters;
 const leadWeight=clamp((p.leadMeters-ahead)/Math.min(125,p.leadMeters),0,1);
 const correction=desired*p.offsetGain*leadWeight;
 return {input:clamp(baseline+correction,-1,1),station:next.id,
   desiredOffset:desired,leadDistance:Number(ahead.toFixed(2)),
   predictedObstacleSide:Number(obstacleLat.toFixed(2))};
}

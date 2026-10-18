/**
 * P100 TERRAIN PULSE — physical S-bends, rolling crests and changing camber.
 * Independently selectable from the P99 baseline. This is experimental,
 * not a completion proof, human play approval, or a physics-engine patch.
 */
import {generateP99VariableWidthCandidate} from './p99-variable-width-build.mjs';
import {sample,validate} from '../private/reference_only/director/surface.js';

export const P100_TERRAIN_PROFILES=Object.freeze([
 {name:'ABYSS / descending slalom',lateral:17,height:7,camber:1.4,cycles:1.5,phase:-.45},
 {name:'SKY CROWN / offset horizon',lateral:23,height:5,camber:2.0,cycles:1,phase:.35},
 {name:'SCISSOR / rising crossover',lateral:19,height:9,camber:2.2,cycles:1.5,phase:-.65},
 {name:'LOWER / rolling reversal',lateral:20,height:8,camber:1.8,cycles:1,phase:.5},
 {name:'SURGE / long dual S',lateral:24,height:6,camber:1.9,cycles:1.5,phase:.25},
 {name:'CREST / airborne skyline',lateral:17,height:11,camber:2.2,cycles:1,phase:-.3},
 {name:'FINISH / compression sweep',lateral:19,height:6,camber:1.6,cycles:1.5,phase:.15}
]);
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const length=v=>Math.hypot(...v)||1;
export function p100Displacement(profile,u){
 if(!profile||!Number.isFinite(u)||u<0||u>1)throw Error('P100 valid road parameter required');
 // Twice differentiable at both chapter seams; no displacement or slope jump.
 const envelope=Math.sin(Math.PI*u)**2;
 return {
  lateral:profile.lateral*envelope*Math.sin(2*Math.PI*profile.cycles*u+profile.phase),
  height:profile.height*envelope*Math.sin(2*Math.PI*u+profile.phase+.9),
  camber:profile.camber*envelope*Math.sin(2*Math.PI*u+profile.phase-.4)
 };
}
function deformRoad(road,profile){
 const target=structuredClone(road);
 if(target.rows!==31||target.cols!==5)throw Error('P100 requires unchanged P99 B48 lattice');
 const source=road.points;
 for(let i=1;i<30;i++){
  const u=i/30,d=p100Displacement(profile,u),index=i*5;
  const prev=source[(i-1)*5+2],next=source[(i+1)*5+2];
  const dx=next[0]-prev[0],dz=next[2]-prev[2],norm=length([dx,dz]);
  const left=[-dz/norm,0,dx/norm];
  for(let j=0;j<5;j++){
   const p=source[index+j],side=(j-2)/2;
   target.points[index+j]=[
    p[0]+left[0]*d.lateral,
    p[1]+d.height+side*d.camber,
    p[2]+left[2]*d.lateral
   ];
  }
 }
 return target;
}
export function generateP100TerrainPulseCandidate(){
 const baseline=generateP99VariableWidthCandidate();
 const doc=structuredClone(baseline);
 doc.surfaces=baseline.surfaces.map((s,i)=>deformRoad(s,P100_TERRAIN_PROFILES[i]));
 doc.route=doc.surfaces.flatMap(s=>Array.from({length:22},(_,i)=>sample(s,(i+.015)/22,.5)));
 doc.route.push(sample(doc.surfaces.at(-1),.999,.5));
 doc.name='VOID BREAKER / TERRAIN PULSE — P100 NATIVE VERIFIED HUMAN TRIAL';
 doc.stageForge={
  ...baseline.stageForge,
  id:'VB-P100',batch:'P100_TERRAIN_PULSE_INDEPENDENT_PHYSICAL_HOLD',
  name:'VOID BREAKER / TERRAIN PULSE',
  status:'EXPERIMENTAL_SCRIPTED_NATIVE_PASS_HUMAN_HOLD',
  design:'True variable-centerline physical S-curves, rolling heights and changing camber across all seven P99 rideable B48 skins',
  geometryProfiles:P100_TERRAIN_PROFILES.map(x=>({...x})),
  basedOnIndependentRoadStage:'VB-P99',
  priorP96CompletionApplicable:false,priorP99CompletionApplicable:false,
  fullStartToFinish:'P100_NATIVE_240HZ_12_ACTIVE_TWO_PROFILE_FINISH_VERIFIED',humanPlaytest:'NOT_RUN',
  finalVisualQuality:'NOT_APPROVED',physicsModified:false,
  autoSteerAssistanceAdded:false
 };
 return validate(doc);
}

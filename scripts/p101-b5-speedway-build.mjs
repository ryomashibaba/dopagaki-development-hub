/**
 * P101 B5 / HYPER ARC: INDEPENDENT authentic 3D high-speed track, not
 * reweighting the original P100 control points. 31x5 B48 Catmull-Rom
 * rideable + collidable lattice; native physics and all twelve native
 * moving B51-C hazard modes/periods/volumes unchanged.
 *
 * Physics aim: two full 180-degree 1400-1500 m reverse curves (radius
 * ~450 m rather than P100's tight 150-200 m segments), a scissor climb
 * and lower crossing, rolling dives, bank, gentle real S-bends.
 *
 * This is a SEPARATE proof candidate, NOT the default P101 road and
 * NOT approved for human play or staging; no autosteering in game.
 */
import {generateP100TerrainPulseCandidate} from './p100-terrain-pulse-build.mjs';
import {p101ReanchorMachines} from './p101-high-radius-build.mjs';
import {sample,validate} from '../private/reference_only/director/surface.js';
import {P101_DEFAULT,P101_TUNINGS} from '../web/p101-overdrive.mjs';

const PI=Math.PI;
const ease=t=>t*t*(3-2*t);
const sin=x=>Math.sin(x);
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const P101_B5_SECTIONS=Object.freeze([
 Object.freeze({id:'ABYSS_DIVE',length:600,turn:-.5,rise:-120,width:114,bank:-.035,wave:.045,cycles:1}),
 Object.freeze({id:'CROWN_REVERSAL',length:1500,turn:PI,rise:-40,width:128,bank:.17,wave:.035,cycles:1}),
 Object.freeze({id:'SCISSOR_RISE',length:950,turn:-1.55,rise:110,width:112,bank:-.10,wave:.045,cycles:1}),
 Object.freeze({id:'LOWER_REVERSAL',length:1450,turn:-PI,rise:-155,width:132,bank:-.16,wave:.035,cycles:1}),
 Object.freeze({id:'VOID_SURGE',length:1000,turn:2.1,rise:-10,width:112,bank:.11,wave:.055,cycles:1.5}),
 Object.freeze({id:'PRISM_CREST',length:750,turn:-.9,rise:95,width:106,bank:-.09,wave:.06,cycles:1}),
 Object.freeze({id:'FINISH_RIDGE',length:680,turn:.75,rise:-30,width:110,bank:.07,wave:.055,cycles:1})
]);
export const P101_B5_LENGTH=P101_B5_SECTIONS.reduce((a,b)=>a+b.length,0);
function widths(t,base,index){
 // Preserve actual wide/tight/wide playable road, not a fake HUD challenge.
 const pulse=sin(PI*t)**2;
 return base*(1-[.16,.22,.18,.23,.18,.15,.14][index]*pulse);
}
export function generateP101B5Speedway({lowerReversalLength=1450}={}){
 if(!Number.isFinite(lowerReversalLength)||lowerReversalLength<1450||lowerReversalLength>1950)throw Error('B5 section IV arc length must remain 1450–1950m');
 const origin=generateP100TerrainPulseCandidate();
 const doc=structuredClone(origin);
 let x=-1400,z=-800,y=245,yaw=.15;
 const roads=[],diagnostics=[];
 const sections=P101_B5_SECTIONS.map((section,i)=>i===3?{...section,length:lowerReversalLength}:section);
 for(let k=0;k<sections.length;k++){
  const conf=sections[k],baseYaw=yaw,baseY=y,steps=600;
  const heading=t=>baseYaw+conf.turn*ease(t)+conf.wave*(sin(2*PI*conf.cycles*t))*sin(PI*t)**2;
  const centers=[[x,baseY,z]];
  for(let i=1;i<=steps;i++){
   const headingMid=heading((i-.5)/steps);
   x+=conf.length/steps*Math.cos(headingMid);
   z+=conf.length/steps*Math.sin(headingMid);
   centers.push([x,baseY+conf.rise*ease(i/steps),z]);
  }
  const center=t=>{
   const f=clamp(t)*steps,i=Math.min(steps-1,Math.floor(f)),q=f-i;
   return centers[i].map((v,j)=>v+(centers[i+1][j]-v)*q);
  };
  const source=origin.surfaces[k],points=[];
  if(source.rows!==31||source.cols!==5)throw Error('P101 B5 requires true 31x5 road collidable lattice');
  for(let i=0;i<31;i++){
   const u=i/30,mid=center(u),angle=heading(u),left=[-sin(angle),0,Math.cos(angle)],
     bank=conf.bank*sin(PI*u);
   const width=widths(u,conf.width,k);
   for(let j=0;j<5;j++){
    const offset=(j/4-.5)*width;
    points.push([mid[0]+left[0]*offset*Math.cos(bank),
      mid[1]+offset*Math.sin(bank),mid[2]+left[2]*offset*Math.cos(bank)]);
   }
  }
  roads.push({...source,points});
  diagnostics.push({section:k,length:conf.length,turn:conf.turn,end:center(1)});
  yaw+=conf.turn;y+=conf.rise;
 }
 doc.surfaces=roads;
 doc.movingObstacles=p101ReanchorMachines(origin.movingObstacles,roads,{weights:Array(7).fill(1)});
 doc.route=roads.flatMap(s=>Array.from({length:22},(_,i)=>sample(s,(i+.015)/22,.5)));
 doc.route.push(sample(roads.at(-1),.999,.5));
 // All six B48 authored true-physics spawns now attach to the new roads by
 // unchanged surface id/u/v; no teleporting or speed forcing.
 doc.name='P101 HYPER ARC / '+((P101_B5_LENGTH-1450+lowerReversalLength)/1000).toFixed(2)+'km HIGH-SPEED 3D B48 PHYSICAL CANDIDATE';
 doc.stageForge={
  ...origin.stageForge,
  id:'VB-P101',variant:'B5_HYPER_ARC_ISOLATED',
  batch:'P101_B5_INDEPENDENT_GIANT_RADIUS_PHYSICAL_TRIAL',
  status:'EXPERIMENTAL_UNPROVEN_NATIVE_HUMAN_HOLD',
  name:'VOID BREAKER / HYPER ARC (B5 PROTOTYPE)',
  roadRedesign:'INDEPENDENT_LONG_ARC_180_TURNS_31X5_NATIVE',
  baseStage:'VB-P100',
  nominalLengthMeters:P101_B5_LENGTH-1450+lowerReversalLength,physicalChapters:7,
   lowerReversalLength,
  actualRoads:diagnostics,
  allTwelveNativeMachines:true,
  physicalSpeedRequirement:'GREATER_THAN_200MPS_7_OF_7_NATIVE_UNPROVEN',
  humanPlaytest:'NOT_RUN',fairness:'NOT_APPROVED',
  fullStartToFinish:lowerReversalLength===1800?
   'P101_B5_A9_NATIVE_240HZ_12_MOVING_ENABLED_52MPS_START_206_28MPS_7_OF_7_SCRIPTED_ONLY':
   'NOT_VERIFIED_P101_B5',
  genuineFastLaw:lowerReversalLength===1800?
   {nativeProfile:'OVERDRIVE',baseForwardScale:.12,afterSection:4,
    positiveLateAddition:.13,transitionU:.45,physicsHz:240,
    provenStartSpeedMps:52,provenPeakSpeedMps:206.28,provenNativeFinishSeconds:51.992,
    manualFairness:'NOT_RUN'}:null,
  spectatorFullRun:'DISABLED_UNTIL_HUMAN_VISUAL_AND_INPUT_REVIEW',
  defaultTuning:P101_DEFAULT,tunings:Object.values(P101_TUNINGS).map(x=>({...x})),
  physicsModified:false,externalPerStepForce:true,
  P100SurfacesModified:false,
  productionPromoted:false
 };
 return validate(doc);
}
export function measureP101B5Geometry(doc){
 if(doc?.stageForge?.variant!=='B5_HYPER_ARC_ISOLATED')throw Error('Only physical B5 can be audited');
 const coords=doc.surfaces.flatMap(s=>s.points);
 const bounds=[0,1,2].map(i=>({min:Math.min(...coords.map(p=>p[i])),max:Math.max(...coords.map(p=>p[i]))}));
 const seams=doc.surfaces.slice(0,-1).map((s,i)=>{
  const a=sample(s,1,.5),b=sample(doc.surfaces[i+1],0,.5);
  const f0=sample(s,.99,.5),f1=sample(doc.surfaces[i+1],.01,.5);
  const tangentA=a.map((v,j)=>v-f0[j]),tangentB=f1.map((v,j)=>v-b[j]);
  const norms=[Math.hypot(...tangentA),Math.hypot(...tangentB)];
  const cos=norms[0]*norms[1]?tangentA.reduce((sum,v,j)=>sum+v*tangentB[j],0)/(norms[0]*norms[1]):0;
  return {between:`${i}-${i+1}`,gap:Math.hypot(...a.map((v,j)=>v-b[j])),cosine:cos};
 });
 return {bounds,seams,nominalLength:doc.stageForge.nominalLengthMeters,roads:doc.surfaces.length,machines:doc.movingObstacles.length};
}

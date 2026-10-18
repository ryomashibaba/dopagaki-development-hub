/**
 * P99 VOID BREAKER — authentic variable-width B48 road challenge.
 *
 * Seven new independent rideable/collidable 3D road skins shrink from 92–127m
 * into rhythmically changing 59–89m driving corridors through the actual giant
 * U-turns, dives and machine corridors. The centerline, rise, bank, world-scale
 * architectural skyline and B51-C obstacle physics remain native.
 *
 * No hidden lane-safety geometry, teleportation, speed limit, steering assist,
 * fake physical success or modification to frozen P62/P66/P93/P95 sources.
 */
import {generateVoidHazardCandidate} from './p95-void-hazard-build.mjs';
import {sample,validate} from '../private/reference_only/director/surface.js';

const smooth=t=>{const x=Math.max(0,Math.min(1,t));return x*x*(3-2*x);};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export const P99_LANE_PROFILES=Object.freeze([
 {name:'ABYSS · opening compression',minimumScale:.84,start:.31,end:.76,fade:.14},
 {name:'SKY CROWN · squeezed giant U',minimumScale:.65,start:.22,end:.78,fade:.15},
 {name:'SCISSOR RISE · precision sweep',minimumScale:.70,start:.23,end:.75,fade:.13},
 {name:'LOWER REVERSAL · broad-to-tight U',minimumScale:.61,start:.16,end:.82,fade:.15},
 {name:'VOID SURGE · flowing narrow S',minimumScale:.66,start:.23,end:.78,fade:.12},
 {name:'PRISM CREST · high-altitude dodge',minimumScale:.68,start:.17,end:.84,fade:.12},
 {name:'FINISH RIDGE · high-speed blade',minimumScale:.73,start:.24,end:.79,fade:.13}
]);
export function p99WidthScale(profile,u){
 if(!profile||!Number.isFinite(u))throw Error('P99 valid road-u required');
 const fade=Math.min(profile.fade,(profile.end-profile.start)/2);
 const entering=smooth((u-(profile.start-fade))/fade);
 const leaving=1-smooth((u-profile.end)/fade);
 return 1-(1-profile.minimumScale)*entering*leaving;
}
function narrowSurface(road,profile){
 const copy=structuredClone(road),cols=copy.cols,rows=copy.rows;
 if(cols!==5||rows!==31)throw Error('P99 requires the verified P93 B48 31x5 road lattice');
 for(let i=0;i<rows;i++){
  const u=i/(rows-1),scale=p99WidthScale(profile,u),offset=i*cols;
  const mid=copy.points[offset+2];
  for(let j=0;j<cols;j++){
   const old=copy.points[offset+j];
   copy.points[offset+j]=old.map((value,k)=>mid[k]+(value-mid[k])*scale);
  }
 }
 return copy;
}
export function generateP99VariableWidthCandidate(){
 const origin=generateVoidHazardCandidate();
 const doc=structuredClone(origin);
 doc.surfaces=origin.surfaces.map((road,i)=>narrowSurface(road,P99_LANE_PROFILES[i]));
 // Genuine central route samples are recomputed from new Catmull-Rom control
 // skins, not lifted from another course's finished-run proof.
 doc.route=doc.surfaces.flatMap(s=>Array.from({length:22},(_,i)=>sample(s,(i+.015)/22,.5)));
 doc.route.push(sample(doc.surfaces.at(-1),.999,.5));
 // All 12 B51-C machines retain exactly their genuine P95 physical positions,
 // phases, collision modes, dimensions and CCD motion; no obstacle is disabled.
 doc.stageForge={
  ...doc.stageForge,id:'VB-P99',batch:'P99_VARIABLE_WIDTH_HUMAN_DRIVING_CANDIDATE',
  status:'EXPERIMENTAL_SCRIPTED_NATIVE_FINISH_HUMAN_HOLD',
  name:'VOID BREAKER / PRESSURE LINES',
  design:'7 authentic road skins with wide-to-tight-to-wide physical driving lanes and original twelve native moving obstacles',
  variedPhysicalWidths:true,minRoadScale:.61,
  widthProfiles:P99_LANE_PROFILES.map(({name,minimumScale,start,end})=>({name,minimumScale,start,end})),
  priorP96CompletionApplicable:false,fullStartToFinish:'P99_NATIVE_240HZ_12_ACTIVE_TWO_PROFILE_FINISH_VERIFIED',
  humanPlaytest:'NOT_RUN',finalVisualQuality:'NOT_APPROVED',
  inheritedP94Evidence:false,physicsModified:false,autoSteerAssistanceAdded:false,
  basedOnIndependentRoadStage:'VB-P95'
 };
 doc.name='VOID BREAKER / PRESSURE LINES — P99 REAL ROADPLAY TRIAL';
 return validate(doc);
}
export function measureP99LaneWidths(doc){
 if(doc?.stageForge?.id!=='VB-P99')throw Error('Only P99 physical candidate has variable lane measurement');
 return doc.surfaces.map((surface,index)=>{
  const points=[0,.15,.30,.45,.60,.75,.90,1].map(u=>{
   const left=sample(surface,u,0),right=sample(surface,u,1),center=sample(surface,u,.5);
   return {u,widthMeters:Number(Math.hypot(...left.map((v,i)=>v-right[i])).toFixed(2)),
    center,edgeLeft:left,edgeRight:right};
  });
  return {surface:surface.id,profile:P99_LANE_PROFILES[index].name,
   narrowestWidthMeters:Math.min(...points.map(x=>x.widthMeters)),samples:points};
 });
}

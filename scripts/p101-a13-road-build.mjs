/**
 * P101 A13 W1 — isolated, real collidable road-width redesign.
 * B5 canonical generator, physical engine, steering and all 12 machine
 * descriptors remain unchanged. This is NOT certified as finishable/fair.
 */
import {generateP101B5Speedway} from './p101-b5-speedway-build.mjs';
import {sample,validate} from '../private/reference_only/director/surface.js';

export const A13_MID_WIDTHS=Object.freeze([64,76,70,100,74,68,72]);
const dist=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
export function generateP101A13RoadCandidate(){
 const doc=generateP101B5Speedway({lowerReversalLength:1800});
 if(doc.stageForge.variant!=='B5_HYPER_ARC_ISOLATED'||doc.surfaces.length!==7||doc.movingObstacles.length!==12)
  throw Error('A13 W1 requires the authentic isolated B5 source');
 const widths=[];
 for(const [section,s] of doc.surfaces.entries()){
  if(s.rows!==31||s.cols!==5)throw Error('A13 W1 requires physical 31x5 B48 surfaces');
  const original=s.points.map(x=>[...x]);
  for(let row=0;row<31;row++){
   const u=row/30,c=original[row*5+2],w=dist(original[row*5],original[row*5+4]);
   const envelope=Math.sin(Math.PI*u)**2*(.60+.40*Math.sin(3*Math.PI*u)**2);
   const newWidth=w-(w-A13_MID_WIDTHS[section])*envelope;
   const ratio=newWidth/w;
   if(!(ratio>0&&ratio<=1))throw Error('Invalid A13 lateral scale');
   for(let lane=0;lane<5;lane++)
    s.points[row*5+lane]=c.map((x,k)=>x+(original[row*5+lane][k]-x)*ratio);
  }
  widths.push({section,id:s.id,baselineMid:Number(dist(original[75],original[79]).toFixed(2)),
   candidateMid:Number(dist(s.points[75],s.points[79]).toFixed(2))});
 }
 doc.name='P101 A13 W1 / REAL NARROW-WIDE ROAD GAMEPLAY CANDIDATE';
 doc.stageForge={...doc.stageForge,variant:'A13_GAMEPLAY_ISOLATED',
  batch:'P101_A13_W1_WIDTH_GAMEPLAY_TRIAL',baseStage:'VB-P101-B5',
  name:'VOID BREAKER / A13 ACTIVE LINE CHOICE (W1)',
  status:'EXPERIMENTAL_UNPROVEN_NATIVE_HUMAN_HOLD',
  widthStudy:widths,originalB5BaselinePreserved:true,
  fullStartToFinish:'NOT_VERIFIED_A13',genuineFastLaw:null,
  physicalSpeedRequirement:'A13_REAL_240HZ_FULL_RUN_UNVERIFIED',
  humanPlaytest:'NOT_RUN',fairness:'NOT_APPROVED',productionPromoted:false};
 return validate(doc);
}
export function measureA13MidWidths(doc){
 if(doc?.stageForge?.variant!=='A13_GAMEPLAY_ISOLATED')throw Error('Not A13');
 return doc.surfaces.map(s=>Number(dist(sample(s,.5,0),sample(s,.5,1)).toFixed(2)));
}

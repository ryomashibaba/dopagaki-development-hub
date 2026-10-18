/**
 * P101 A13 W1 — isolated, real collidable road-width redesign.
 * B5 canonical generator, physical engine, steering and all 12 machine
 * descriptors remain unchanged. This is NOT certified as finishable/fair.
 */
import {generateP101B5Speedway} from './p101-b5-speedway-build.mjs';
import {sample,frame,validate} from '../private/reference_only/director/surface.js';
import {normalizeMovingObstacles} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {A13_HAZARD_SPECS,a13MachineId} from '../web/p101-a13-hazard-layout.mjs';

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
 // Enlarge the mechanical silhouettes and add genuine moving collision bodies.
 // Existing 12 canonical machines are retained unchanged in the first slots.
 const unit=v=>v.map(x=>x/(Math.hypot(...v)||1));
 const staged=A13_HAZARD_SPECS.map(([section,u,kind,offset],i)=>{
  const road=doc.surfaces[section],f=frame(road,u,.5),direction=unit([f.forward[0],0,f.forward[2]]);
  const side=unit([-direction[2],0,direction[0]]),center=sample(road,u,.5);
  const at=height=>center.map((x,k)=>x+side[k]*offset+(k===1?height:0));
  const common={id:a13MachineId(i),name:['A13 / TITAN TRANSIT','A13 / REACTOR ROTOR','A13 / IRIS HAMMER'][kind]+' '+String(i+1).padStart(2,'0'),
   period:3.6+(i%5)*.31,phase:(.19+i*.133)%1,enabled:true,yawDegrees:0};
  const timing={easing:kind===1?'linear':'smoothstep',dwellSeconds:.20};
  if(kind===0)return {...common,type:'slider',position:at(5.8),size:[22,9,7],
   collision:{mode:'fail'},motion:{axis:side,amplitude:19+(i%3)*3,timing}};
  if(kind===1)return {...common,type:'rotator',position:at(3.1),size:[32,5.4,4.6],
   collision:{mode:'bounce',restitution:.65},
   motion:{direction:i%2?-1:1,baseAngleDegrees:12+i*29,timing}};
  return {...common,type:'piston',position:at(8.2),size:[22,6.3,8.5],
   collision:{mode:'push',pushStrength:1.12},motion:{stroke:13,timing}};
 });
 doc.movingObstacles=normalizeMovingObstacles({movingObstacles:[...doc.movingObstacles,...staged]});
 doc.name='P101 A13 W3 / REAL ROAD AND LARGE NATIVE MOVING MACHINE TRIAL';
 doc.stageForge={...doc.stageForge,variant:'A13_GAMEPLAY_ISOLATED',
  batch:'P101_A13_W1_WIDTH_GAMEPLAY_TRIAL',baseStage:'VB-P101-B5',
  name:'VOID BREAKER / A13 ACTIVE LINE + TITAN MACHINES (W3)',
  additionalMovingHazards:A13_HAZARD_SPECS.length,totalMovingHazards:doc.movingObstacles.length,
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

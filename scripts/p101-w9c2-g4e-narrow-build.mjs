/**
 * W9-C2 G4E-1: independent REAL B48 physical narrow-road feasibility.
 * Not yet a gap or a natural jump. Do not count as Slope2-DNA approved.
 * Preserve the validated W7F Gold centreline, every machine and physics.
 * OFFLINE ONLY: no game selector, no build asset, no publishing.
 */
import {generateP101A13W7Candidate} from './p101-a13-w7-gameplay-build.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';

export const G4E_POLICY=Object.freeze({
 section:3,sectionMeters:1800,physicalHz:240,
 windows:Object.freeze([[.10,.23],[.30,.43],[.54,.67],[.76,.89]]),
 variants:Object.freeze({
  shoulder:Object.freeze({id:'shoulder',widthFactor:.82,stageId:'VB-P101-A13-W9C2-G4E-SHOULDER'}),
  razor:Object.freeze({id:'razor',widthFactor:.68,stageId:'VB-P101-A13-W9C2-G4E-RAZOR'})
 }),
 noGapYet:true,noCrestYet:true,noForcedLanding:true,
 gameRegistered:false,humanApproved:false
});
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function envelope(u){
 let p=0;
 for(const [a,b] of G4E_POLICY.windows){
  if(u>a&&u<b){
   const t=(u-a)/(b-a);
   p=Math.max(p,Math.sin(Math.PI*t)**2);
  }
 }
 return p;
}
export function generateW9C2G4ENarrow(kind='shoulder'){
 const choice=G4E_POLICY.variants[kind];
 if(!choice)throw Error('G4E declared offline physical variant required');
 const doc=generateP101A13W7Candidate();
 if(doc.stageForge.recordStageId!=='VB-P101-A13-W7F'||
    doc.surfaces.length!==7||doc.movingObstacles.length!==28||
    doc.route.length!==155||doc.stageForge.nominalLengthMeters!==7280)
  throw Error('G4E requires exact frozen W7F 7-road / 28-machine Gold');
 const s=doc.surfaces[G4E_POLICY.section];
 if(s.rows!==31||s.cols!==5||!s.collidable||!s.rideable)
  throw Error('G4E requires true B48 31x5 rideable collider');
 const original=structuredClone(doc);
 const changedRows=[],minWidths=[],maxDeltaByRow=[];
 for(let row=0;row<s.rows;row++){
  const u=row/(s.rows-1),pulse=envelope(u);
  if(pulse<1e-9)continue;
  const factor=1-(1-choice.widthFactor)*pulse;
  const center=original.surfaces[3].points[row*5+2];
  let maxDelta=0;
  for(let col=0;col<5;col++){
   const src=original.surfaces[3].points[row*5+col];
   const target=src.map((x,k)=>center[k]+(x-center[k])*factor);
   s.points[row*5+col]=target;
   maxDelta=Math.max(maxDelta,Math.hypot(...src.map((x,k)=>target[k]-x)));
  }
  changedRows.push(row);
  maxDeltaByRow.push(maxDelta);
  const l=s.points[row*5],r=s.points[row*5+4];
  minWidths.push(Math.hypot(...l.map((x,k)=>x-r[k])));
 }
 if(changedRows.length<8||Math.max(...maxDeltaByRow)<3)
  throw Error('G4E physical narrow envelope was not built');
 if(tessellate(s).degenerate!==0)throw Error('G4E physical collider degeneracy');
 if(!eq(doc.movingObstacles,original.movingObstacles)||
    !eq(doc.route,original.route)||!eq(doc.spawns,original.spawns))
  throw Error('G4E changed machines/route/spawns');
 if(!doc.surfaces.every((road,i)=>i===3||eq(road,original.surfaces[i])))
  throw Error('G4E changed an unrelated physical road');
 for(let row=0;row<31;row++){
  if(!eq(s.points[row*5+2],original.surfaces[3].points[row*5+2]))
   throw Error('G4E cannot move Gold physical centerline');
 }
 doc.name='W9-C2 G4E-1 '+kind.toUpperCase()+' / TRUE NARROW PHYSICAL WINDOWS / OFFLINE HOLD';
 doc.stageForge={...doc.stageForge,
  revision:'W9C2-G4E-1-'+kind.toUpperCase(),recordStageId:choice.stageId,
  status:'G4E1_TRUE_B48_NARROW_WINDOWS_OFFLINE_NOT_VERIFIED',
  selectedTrial:'g4e1-'+kind,studyOnly:'OFFLINE_NOT_REGISTERED_IN_GAME',
  fullStartToFinish:'NOT_VERIFIED_G4E',nativeScriptedProof:null,
  humanPlaytest:'NOT_RUN',fairness:'NOT_APPROVED',productionPromoted:false,
  g4ePhysicalStudy:{source:'W7F_GOLD_IMMUTABLE',section:3,
   nominalSectionMeters:G4E_POLICY.sectionMeters,
   widthFactorAtPeaks:choice.widthFactor,windows:G4E_POLICY.windows,
   modifiedControlRows:changedRows,minimumModifiedRowWidthMeters:Math.min(...minWidths),
   maximumRealEdgeShiftMeters:Math.max(...maxDeltaByRow),
   realB48Collider:true,centerlineUnchanged:true,
   movingMachinesByteIdentical:true,all28BodiesPresent:true,
   trueOpenGapImplemented:false,naturalAirborneJumpVerified:false,
   landingImplemented:false,approvedSlopeDNAMeters:0,
   physicsLawUnchanged:true,gameRegistered:false,humanFairness:'HOLD'}};
 return validate(doc);
}

/**
 * P101 A13 W9-X-B1: physical alternating-bank candidate, NOT a W7F replacement.
 * Only the fourth B48 rideable road's interior lattice is touched.
 * Both cross-section seams and the centerline remain byte-identical.
 * Neither the 28 B51-C native machines nor engine/steering/law are modified.
 * First measured at 240Hz: W9-X amplitude 8 finishes scripted 7/7.
 * This is NOT evidence of human finishability, safety or enjoyment.
 */
import {generateP101A13W7Candidate} from './p101-a13-w7-gameplay-build.mjs';
import {validate} from '../private/reference_only/director/surface.js';

export const W9X_BANK=Object.freeze({
 section:3, startU:.12,endU:.89,amplitudeMeters:8,rows:31,cols:5,
 source:'P101_A13_W7F_GOLD',stageId:'VB-P101-A13-W9X-B1'
});
const round=(x,n=3)=>Number(x.toFixed(n));
export function generateP101A13W9XCandidate(){
 const doc=generateP101A13W7Candidate();
 const p=W9X_BANK;
 if(doc.stageForge.variant!=='A13_GAMEPLAY_ISOLATED'||
    doc.stageForge.revision!=='W7F'||doc.stageForge.selectedTrial!=='w7f-gentle'||
    doc.surfaces.length!==7||doc.movingObstacles.length!==28)
   throw Error('W9-X requires frozen A13 W7F source');
 const surface=doc.surfaces[p.section];
 if(!surface.collidable||!surface.rideable||surface.rows!==p.rows||surface.cols!==p.cols)
   throw Error('W9-X needs an actual 31x5 B48 rideable skin');
 let changed=0,maximumEdgeDelta=0;
 for(let row=0;row<p.rows;row++){
   const u=row/(p.rows-1),t=(u-p.startU)/(p.endU-p.startU);
   const shape=t<=0||t>=1?0:
     Math.sin(Math.PI*t)**2*Math.sin(2*Math.PI*t);
   for(let lane=0;lane<p.cols;lane++){
     // Alternating bank: centerline (lane 2) stays exactly unchanged.
     const change=p.amplitudeMeters*shape*(lane/2-1);
     const point=surface.points[row*p.cols+lane];
     point[1]+=change;
     if(change!==0)changed++;
     maximumEdgeDelta=Math.max(maximumEdgeDelta,Math.abs(change));
   }
 }
 if(!(changed>45&&maximumEdgeDelta>4&&maximumEdgeDelta<8))
   throw Error('W9-X bank candidate lacks bounded physical deformation');
 doc.name='P101 A13 W9-X-B1 / UNDERPASS DUAL-APEX REAL BANK TRIAL (HOLD)';
 doc.stageForge={...doc.stageForge,
   revision:'W9-X-B1',
   recordStageId:p.stageId,
   sourceBaseline:'W7F_7_OF_7_SCRIPTED_GOLD_UNCHANGED',
   bankTrial:{section:p.section,startU:p.startU,endU:p.endU,
     amplitudeMeters:p.amplitudeMeters,maxControlPointDeltaMeters:round(maximumEdgeDelta),
     nativeSkin:true,centerlineUnchanged:true,seamsUnchanged:true},
   status:'ISOLATED_REAL_ROAD_NATIVE_SCRIPTED_PASS_HUMAN_HOLD',
   fullStartToFinish:'W9_X_B1_SCRIPTED_PROBE_ONLY_NOT_HUMAN',
   nativeScriptedProof:null,
   humanPlaytest:'NOT_RUN',fairness:'NOT_APPROVED',
   genuineFastLaw:null,productionPromoted:false,
   studyOnly:'NOT_SELECTED_FOR_GAMEPLAY',
   gameAutoSteering:false};
 return validate(doc);
}

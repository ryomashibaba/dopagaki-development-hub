/**
 * W9-C1: two ISOLATED true B48 road-width studies for ABYSS DIVE.
 * Only the physical 31x5 lattice of road 0 is changed. Visual rendering
 * samples the same B48 lattice. Do NOT interpret scripted success as
 * proof of fairness, forward readability or human enjoyment.
 *
 * 200–440m: gradual control-lattice transitions. 310–360m: review core.
 * W7F Gold / W9-X / B5 / B48 / B51-C remain unchanged.
 */
import {generateP101A13W7Candidate} from './p101-a13-w7-gameplay-build.mjs';
import {validate} from '../private/reference_only/director/surface.js';

export const W9C1_ABYSS=Object.freeze({
 section:0,nominalLengthMeters:600,windowMeters:[280,400],
 coreMeters:[310,360],controlPointPlateauMeters:[300,360],
 influenceMeters:[200,440],nominalRoadMeters:7280,
 initialSpeedMps:52,physicalHz:240,movingBodies:28
});
export const W9C1_VARIANTS=Object.freeze({
 control:Object.freeze({widthMeters:28,revision:'W9-C1-CONTROL',recordStageId:'VB-P101-A13-W9C1-CONTROL'}),
 ultra:Object.freeze({widthMeters:14,revision:'W9-C1-ULTRA',recordStageId:'VB-P101-A13-W9C1-ULTRA'})
});
const distance=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
const smooth=t=>{const v=Math.max(0,Math.min(1,t));return v*v*(3-2*v);};
const blendAt=m=>m<=200||m>=440?0:m<300?smooth((m-200)/100):
 m<=360?1:1-smooth((m-360)/80);

export function generateP101W9C1AbyssCandidate(kind){
 const choice=W9C1_VARIANTS[kind];
 if(!choice)throw Error('W9-C1 requires a declared control or ultra variant');
 const doc=generateP101A13W7Candidate(),p=W9C1_ABYSS;
 if(doc.stageForge.revision!=='W7F'||
    doc.stageForge.recordStageId!=='VB-P101-A13-W7F'||
    doc.surfaces.length!==7||doc.movingObstacles.length!==28)
   throw Error('W9-C1 must fork untouched W7F Gold / native 28');
 const road=doc.surfaces[p.section];
 if(!road.collidable||!road.rideable||road.rows!==31||road.cols!==5)
   throw Error('W9-C1 requires the actual 31x5 B48 road skin');
 let changed=0,minimumControlWidth=Infinity;
 for(let row=0;row<road.rows;row++){
   const meters=row*p.nominalLengthMeters/(road.rows-1);
   const weight=blendAt(meters);
   const center=[...road.points[row*5+2]];
   const width=distance(road.points[row*5],road.points[row*5+4]);
   const targetWidth=width+(choice.widthMeters-width)*weight;
   const ratio=targetWidth/width;
   if(!Number.isFinite(ratio)||ratio<=0||ratio>1.000001)
     throw Error('W9-C1 physical width ratio invalid');
   for(let lane=0;lane<road.cols;lane++){
     if(lane===2||weight===0)continue; // centerline and both full seams stay exact
     const old=road.points[row*5+lane];
     road.points[row*5+lane]=center.map((c,k)=>c+(old[k]-c)*ratio);
     changed++;
   }
   minimumControlWidth=Math.min(minimumControlWidth,targetWidth);
 }
 if(changed<30||Math.abs(minimumControlWidth-choice.widthMeters)>1e-6)
   throw Error('W9-C1 is not a measurable true physical narrow-road change');
 // QA-only start locations; the canonical 6 spawns and original zero-start run remain intact.
 // These starts use 52m/s, not the speed reached by a full run at 200/320m.
 doc.spawns.push({name:'W9-C1 QA / 200m approach (52m/s local reset, NOT full-speed proof)',surface:road.id,u:1/3,v:.5});
 doc.spawns.push({name:'W9-C1 QA / 320m narrow core (52m/s local reset, NOT full-speed proof)',surface:road.id,u:8/15,v:.5});
 doc.name='P101 W9-C1 / ABYSS DIVE '+kind.toUpperCase()+' B48 ROAD STUDY / HOLD';
 doc.stageForge={...doc.stageForge,revision:choice.revision,
   recordStageId:choice.recordStageId,
   selectedTrial:'w9c1-abyss-'+kind,
   sourceBaseline:'W7F_GOLD_UNCHANGED',
   slopeDNAStudy:{...p,nominalCoreWidthMeters:choice.widthMeters,
     changedControlPoints:changed,minimumControlWidthMeters:minimumControlWidth,
     centerlineUnchanged:true,roadSeamsUnchanged:true,
     realB48Surface:true,renderAndCollisionSameSkin:true,
     firstWindowPlanOnly:true,
     forwardNoticeSeconds:'NOT_YET_MEASURED'},
   status:'ISOLATED_REAL_B48_NARROW_TRIAL_NATIVE_AND_HUMAN_HOLD',
   nativeScriptedProof:null,fullStartToFinish:'NOT_VERIFIED_W9_C1',
   studyOnly:'NOT_SELECTED_FOR_GAMEPLAY',humanPlaytest:'NOT_RUN',
   fairness:'NOT_APPROVED',productionPromoted:false,
   gameAutoSteering:false,genuineFastLaw:null};
 return validate(doc);
}

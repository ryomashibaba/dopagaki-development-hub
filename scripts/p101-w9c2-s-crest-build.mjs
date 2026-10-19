/**
 * W9-C2 / S-CREST: independent physical S-curve / cliff-edge study.
 * Real B48 31x5 collidable 3D ribbon with opposing lateral offsets,
 * an authored crest and alternating cross-bank. NOT a fake visual S-turn.
 *
 * W7F Gold, W9-C1 28m/14m, W9-X and B5 are immutable. Machine geometry
 * and all 28 B51-C descriptors are byte-identical. Because this window
 * lies strictly BETWEEN section-6 authored hazards (0.30 and 0.64), no
 * machine is reanchored. Long-course finish and human fairness are HOLD.
 */
import {generateP101A13W7Candidate} from './p101-a13-w7-gameplay-build.mjs';
import {sample,validate,tessellate} from '../private/reference_only/director/surface.js';

export const W9C2_STUDY=Object.freeze({
 section:5,startU:.32,endU:.59,sectionNominalMeters:750,
 physicalHz:240,movingBodies:28,ballRadiusMeters:.65,
 sourceBaseline:'W7F_GOLD_IMMUTABLE',
 humanApproval:'HOLD',publish:false
});
export const W9C2_VARIANTS=Object.freeze({
 ribbon:Object.freeze({id:'ribbon',revision:'W9-C2-S-CREST-RIBBON',
  recordStageId:'VB-P101-A13-W9C2-RIBBON',
  coreWidthMeters:34,lateralPeakScaleMeters:29,crestHeightMeters:14,bankEdgeMeters:3.5}),
 edge:Object.freeze({id:'edge',revision:'W9-C2-S-CREST-EDGE',
  recordStageId:'VB-P101-A13-W9C2-EDGE',
  coreWidthMeters:22,lateralPeakScaleMeters:42,crestHeightMeters:20,bankEdgeMeters:5})
});
const distance=(a,b)=>Math.hypot(...a.map((v,k)=>v-b[k]));
const sub=(a,b)=>a.map((v,k)=>v-b[k]);
const add=(a,b)=>a.map((v,k)=>v+b[k]);
const mul=(a,k)=>a.map(x=>x*k);
const norm=v=>mul(v,1/(Math.hypot(...v)||1));
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=t=>{const q=clamp(t);return q*q*(3-2*q);};
const field=t=>Math.sin(Math.PI*t)**2;
export function w9c2ShapeAt(u,kind='ribbon'){
 const plan=W9C2_VARIANTS[kind];if(!plan)throw Error('W9-C2 variant must be ribbon or edge');
 if(!Number.isFinite(u)||u<0||u>1)throw Error('W9-C2 normalized u required');
 const p=W9C2_STUDY;
 if(u<=p.startU||u>=p.endU)return {active:false,pulse:0,offsetMeters:0,riseMeters:0,bankEdgeMeters:0};
 const t=(u-p.startU)/(p.endU-p.startU),pulse=field(t);
 return {active:true,pulse,
  offsetMeters:plan.lateralPeakScaleMeters*Math.sin(2*Math.PI*t)*pulse,
  riseMeters:plan.crestHeightMeters*pulse,
  bankEdgeMeters:plan.bankEdgeMeters*Math.sin(2*Math.PI*t)*pulse};
}
export function generateP101W9C2SCrestCandidate(kind='ribbon'){
 const choice=W9C2_VARIANTS[kind];if(!choice)throw Error('W9-C2 exact declared variant required');
 const doc=generateP101A13W7Candidate(),p=W9C2_STUDY;
 if(doc.stageForge.revision!=='W7F'||doc.stageForge.recordStageId!=='VB-P101-A13-W7F'||
    doc.surfaces.length!==7||doc.movingObstacles.length!==28||doc.route.length!==155)
  throw Error('W9-C2 requires frozen 7-road / 28-machine W7F full physical route');
 const s=doc.surfaces[p.section];
 if(!s.rideable||!s.collidable||s.rows!==31||s.cols!==5)
  throw Error('W9-C2 only works on genuine B48 31x5 road');
 const frozen=s.points.map(v=>[...v]);
 let changed=0,maxHorizontal=0,maxVertical=0;
 for(let row=0;row<s.rows;row++){
  const u=row/(s.rows-1),shape=w9c2ShapeAt(u,kind);
  if(!shape.active)continue;
  const center=frozen[row*5+2];
  const prev=frozen[Math.max(0,row-1)*5+2];
  const next=frozen[Math.min(s.rows-1,row+1)*5+2];
  const tangent=norm([next[0]-prev[0],0,next[2]-prev[2]]);
  const lateral=norm([-tangent[2],0,tangent[0]]);
  const width=distance(frozen[row*5],frozen[row*5+4]);
  const narrowWidth=width+(choice.coreWidthMeters-width)*shape.pulse;
  const ratio=narrowWidth/width;
  if(!(ratio>0&&ratio<=1.00001))throw Error('W9-C2 physical width would expand/collapse');
  for(let j=0;j<s.cols;j++){
   const orig=frozen[row*5+j];
   const centered=add(center,mul(sub(orig,center),ratio));
   const deviation=add(mul(lateral,shape.offsetMeters),[0,
    shape.riseMeters+(j-2)/2*shape.bankEdgeMeters,0]);
   const candidate=add(centered,deviation);
   s.points[row*5+j]=candidate;
   changed++;
   maxHorizontal=Math.max(maxHorizontal,Math.hypot(candidate[0]-orig[0],candidate[2]-orig[2]));
   maxVertical=Math.max(maxVertical,Math.abs(candidate[1]-orig[1]));
  }
 }
 if(changed<30||maxHorizontal<10||maxVertical<7)
  throw Error('W9-C2 actual B48 S-crest was not measurably constructed');
 // Original route is constructed from 22 centerline samples per B5 road.
 // Re-sample the affected physical track's route entries only to keep
 // native ground guide/airborne fallback aligned with the new S-curve.
 const originalRoute=doc.route.map(v=>[...v]);
 for(let i=0;i<22;i++)doc.route[p.section*22+i]=sample(s,(i+.015)/22,.5);
 const tess=tessellate(s);
 if(tess.degenerate!==0)throw Error('W9-C2 physical S-crest degenerates collision triangles');
 if(!doc.route.every((v,j)=>j>=p.section*22&&j<(p.section+1)*22||
    v.every((x,k)=>x===originalRoute[j][k])))
  throw Error('W9-C2 unexpectedly changed unaffected route sections');
 doc.name='W9-C2 S-CREST '+kind.toUpperCase()+' / TRUE PHYSICAL FLOATING ROAD HOLD';
 doc.stageForge={...doc.stageForge,
  revision:choice.revision,recordStageId:choice.recordStageId,
  sourceBaseline:'W7F_GOLD_IMMUTABLE',
  selectedTrial:'w9c2-s-crest-'+kind,
  w9c2PhysicalStudy:{
   section:p.section,
   sectionNominalMeters:p.sectionNominalMeters,
   realB48Surface:true,physicalSurfaceAndViewSameSource:true,
   design:'OPPOSING_S_BENDS_WITH_REAL_CREST_AND_BANK',
   startU:p.startU,endU:p.endU,
   arcLengthAtControlGridMeters:(p.endU-p.startU)*p.sectionNominalMeters,
   targetWidthAtCrestMeters:choice.coreWidthMeters,
   lateralPeakScaleMeters:choice.lateralPeakScaleMeters,
   crestHeightMeters:choice.crestHeightMeters,
   bankEdgeMeters:choice.bankEdgeMeters,
   modifiedControlPoints:changed,maxHorizontalDeltaMeters:maxHorizontal,
   maxVerticalDeltaMeters:maxVertical,
   trueJumpGapImplemented:false,
   slopeDnaContributionMeters:'NOT_APPROVED_FOR_COUNT',
   adjacentHazardAnchorsChanged:false,
   realPhysicalCollision:true
  },
  status:'W9_C2_ISOLATED_REAL_S_CURVE_OFFLINE_QA_HOLD',
  nativeScriptedProof:null,fullStartToFinish:'NOT_VERIFIED_W9_C2',
  studyOnly:'NOT_SELECTED_FOR_GAMEPLAY',
  humanPlaytest:'NOT_RUN',fairness:'NOT_APPROVED',
  productionPromoted:false,gameAutoSteering:false,genuineFastLaw:null};
 return validate(doc);
}

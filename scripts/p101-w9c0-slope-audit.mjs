/**
 * W9-C0: read-only physical inventory for the accepted "Slope DNA 40%" brief.
 * Never changes the frozen W7F/ W9-X/B5 tracks or physical game state.
 * Measurements are based on actual B48 Catmull-Rom skin, not road art.
 * Planned windows are DESIGN TARGETS ONLY, never counted as implemented.
 */
import {generateP101A13W7Candidate} from './p101-a13-w7-gameplay-build.mjs';
import {generateP101A13W9XCandidate} from './p101-a13-w9b-road-candidate.mjs';
import {P101_B5_SECTIONS} from './p101-b5-speedway-build.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {A13_HAZARD_SPECS} from '../web/p101-a13-hazard-layout.mjs';

const RAD=180/Math.PI;
const sum=xs=>xs.reduce((a,b)=>a+b,0);
const dist=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
const round=(n,d=2)=>Number(n.toFixed(d));
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const q=(sorted,t)=>sorted.length?sorted[Math.min(sorted.length-1,Math.floor((sorted.length-1)*t))]:null;
const N=120;
const freezeRows=[
 [0,80,200,'slope-dive',['rolling-terrain','steep-dive']],
 [0,280,400,'skyline-thread',['narrow-skyway','twisting-terrain']],
 [1,160,340,'crown-banking',['sweeping-curve','banked-terrain']],
 [1,620,780,'serpentine-bridge',['narrow-skyway','s-curves']],
 [1,1020,1190,'rolling-descent',['curved-descent','rolling-terrain']],
 [2,110,280,'scissor-wave',['rolling-terrain','crest']],
 [2,390,520,'switchback',['s-curves','legible-blocks']],
 [2,650,780,'scissor-thread',['narrow-skyway','banked-terrain']],
 [3,140,350,'underpass-banking',['twisting-terrain','banked-terrain']],
 [3,650,860,'broken-apron',['real-gap-trial','natural-takeoff']],
 [3,1050,1280,'reversal-plunge',['curved-descent','rolling-terrain']],
 [4,150,350,'void-snakes',['s-curves','narrow-skyway']],
 [4,450,600,'precision-gates',['legible-blocks','narrow-skyway']],
 [4,700,820,'valley-curl',['rolling-terrain','banked-terrain']],
 [5,110,270,'crest-launch',['natural-takeoff','curved-descent']],
 [5,390,570,'prism-thread',['narrow-skyway','twisting-terrain']],
 [6,90,230,'late-hazard',['legible-blocks','s-curves']],
 [6,370,500,'last-thread',['narrow-skyway','crest']]
];
export const W9C0_WINDOWS=Object.freeze(freezeRows.map(([section,startM,endM,name,features])=>
 Object.freeze({section,startM,endM,name,features:Object.freeze(features)})));
export const W9C0_ULTRANARROW=Object.freeze([
 Object.freeze({section:0,startM:310,endM:360,targetWidthMeters:[12,16],note:'first low-speed straight approach candidate'}),
 Object.freeze({section:2,startM:695,endM:755,targetWidthMeters:[12,16],note:'requires bank/obstacle timing safety proof'}),
 Object.freeze({section:5,startM:445,endM:515,targetWidthMeters:[10,16],note:'only if late-speed human reaction margin is verified'})
]);
export const W9C0_POLICY=Object.freeze({
 targetSlopeShare:0.4,
 measuredBy:'nominal physical distance of confirmed distinctive gameplay; visual decoration NEVER qualifies',
 nominalTotalMeters:7280,
 targetMeters:2912,
 provisionalWindowsMeters:2910,
 unallocatedMeters:2,
 superNarrowMinMeters:10,
 superNarrowMaxMeters:16,
 superNarrowTrialTotalMeters:180,
 minimalReadableWarningSeconds:2,
 manualQuality:'HOLD',
 productionPromoted:false
});
function measureRoad(s){
 const rows=[];
 for(let k=0;k<=N;k++){
  const u=k/N;
  const l=sample(s,u,0),r=sample(s,u,1),c=sample(s,u,.5);
  const dx=r[0]-l[0],dz=r[2]-l[2],dy=r[1]-l[1];
  const hz=Math.hypot(dx,dz);
  rows.push({u,center:c,width3d:Math.hypot(hz,dy),widthHorizontal:hz,bankDeg:Math.atan2(dy,hz)*RAD});
 }
 let centerlineArc=0,turnSum=0,sharpness=0,maxSlope=0,verticalTravel=0,prevYaw=null,prevSlope=0;
 for(let i=1;i<rows.length;i++){
  const a=rows[i-1].center,b=rows[i].center;
  const dx=b[0]-a[0],dz=b[2]-a[2],dy=b[1]-a[1],horizontal=Math.hypot(dx,dz);
  centerlineArc+=dist(a,b);verticalTravel+=Math.abs(dy);
  const slope=Math.atan2(dy,horizontal)*RAD;
  maxSlope=Math.max(maxSlope,Math.abs(slope));
  const yaw=Math.atan2(dz,dx);
  if(prevYaw!==null){
   const diff=Math.atan2(Math.sin(yaw-prevYaw),Math.cos(yaw-prevYaw))*RAD;
   turnSum+=Math.abs(diff);sharpness=Math.max(sharpness,Math.abs(diff));
  }
  prevYaw=yaw;prevSlope=slope;
 }
 const widths=rows.map(x=>x.widthHorizontal).sort((a,b)=>a-b);
 const slopes=rows.map(x=>Math.abs(x.bankDeg)).sort((a,b)=>a-b);
 return {rows,
  width:{min:round(widths[0]),p10:round(q(widths,.1)),median:round(q(widths,.5)),
    max:round(widths.at(-1)),ends:[round(rows[0].widthHorizontal),round(rows.at(-1).widthHorizontal)]},
  bank:{maxAbsDeg:round(slopes.at(-1)),medianAbsDeg:round(q(slopes,.5))},
  centerlineApproxMeters:round(centerlineArc),
  cumulativeHorizontalTurnDegrees:round(turnSum),
  maxHeadingStepDegrees:round(sharpness),
  maxLongitudinalSlopeDegrees:round(maxSlope),
  absoluteVerticalTravelMeters:round(verticalTravel),
  centerElevationRangeMeters:round(Math.max(...rows.map(r=>r.center[1]))-Math.min(...rows.map(r=>r.center[1])))};
}
const summaryFor=rows=>{
 const a=rows.map(r=>r.widthHorizontal).sort((x,y)=>x-y);
 return {min:round(a[0]),median:round(q(a,.5)),max:round(a.at(-1))};
};
const winOverlap=(a,b)=>Math.max(0,Math.min(a.endM,b.endM)-Math.max(a.startM,b.startM));
function validatePlan(sections){
 if(sections.length!==7||sum(sections.map(s=>s.lengthMeters))!==W9C0_POLICY.nominalTotalMeters)
  throw Error('W9-C0 nominal seven-road length drift');
 for(const [i,w] of W9C0_WINDOWS.entries()){
  if(!Number.isInteger(w.section)||w.section<0||w.section>6||
    w.startM<0||w.endM>sections[w.section].lengthMeters||w.endM-w.startM<60)
   throw Error('W9-C0 illegal proposed playable window');
  if(W9C0_WINDOWS.some((x,j)=>j!==i&&x.section===w.section&&winOverlap(x,w)>0))
   throw Error('W9-C0 overlaps nominal physical windows');
 }
 const planned=sum(W9C0_WINDOWS.map(w=>w.endM-w.startM));
 if(planned!==W9C0_POLICY.provisionalWindowsMeters)throw Error('W9-C0 40% allocation drift');
 for(const n of W9C0_ULTRANARROW){
  if(n.endM-n.startM>75||n.endM-n.startM<25||
     n.targetWidthMeters[0]<10||n.targetWidthMeters[1]>16||
     !W9C0_WINDOWS.some(w=>w.section===n.section&&w.startM<=n.startM&&w.endM>=n.endM))
   throw Error('W9-C0 ultra-narrow trial must be bounded and inside a planned Slope zone');
 }
 if(sum(W9C0_ULTRANARROW.map(x=>x.endM-x.startM))!==180)throw Error('W9-C0 limited super-narrow allocation drift');
}
function sectionHazards(doc,profiles,section){
 // New 16 B51-C locations: exact authored section/u. Original 12 are estimated
 // by nearest 3D centerline anchor, NOT a real moving swept-volume evaluation.
 const authored=A13_HAZARD_SPECS.filter(x=>x[0]===section).map(x=>({u:x[1],kind:['slider','rotator','piston'][x[2]]}));
 let originalNear=0;
 for(const m of doc.movingObstacles.slice(0,12)){
  let min=Infinity,nearest=-1;
  for(const [i,profile] of profiles.entries()){
   for(const r of profile.rows){
    const d=dist(m.position,r.center);
    if(d<min){min=d;nearest=i;}
   }
  }
  if(nearest===section)originalNear++;
 }
 return {original12ApproxAnchorCount:originalNear,extra16ExactAnchorCount:authored.length,
  extra16LocalU:authored.map(x=>round(x.u,3)),extra16Modes:authored.map(x=>x.kind),
  motionEnvelopeMeasured:false};
}
export function auditW9C0({gold=generateP101A13W7Candidate(),bank=generateP101A13W9XCandidate()}={}){
 if(gold.stageForge.revision!=='W7F'||bank.stageForge.revision!=='W9-X-B1'||
    gold.surfaces.length!==7||gold.movingObstacles.length!==28||
    bank.movingObstacles.length!==28)throw Error('W9-C0 requires actual frozen W7F/W9-X 7 road / 28 collider assets');
 if(JSON.stringify(gold.movingObstacles)!==JSON.stringify(bank.movingObstacles))
  throw Error('W9-C0 cannot audit modified 28 B51-C colliders as frozen');
 const lengths=P101_B5_SECTIONS.map((x,i)=>i===3?1800:x.length);
 const sections=lengths.map((lengthMeters,index)=>({index,name:P101_B5_SECTIONS[index].id,lengthMeters}));
 validatePlan(sections);
 const profiles=gold.surfaces.map(measureRoad),bankProfiles=bank.surfaces.map(measureRoad);
 const outputSections=sections.map(({index,name,lengthMeters})=>{
  const profile=profiles[index],win=W9C0_WINDOWS.filter(x=>x.section===index);
  let below16=0,below35=0,below65=0;
  for(let i=0;i<N;i++){
   const w=(profile.rows[i].widthHorizontal+profile.rows[i+1].widthHorizontal)/2;
   if(w<=16)below16++;
   if(w<=35)below35++;
   if(w<=65)below65++;
  }
  const result={index,name,lengthMeters,physicalSkin:{rows:gold.surfaces[index].rows,
    cols:gold.surfaces[index].cols,resolution:gold.surfaces[index].resolution},
   widthMeters:profile.width,bankDegrees:profile.bank,
   centerlineApproxMeters:profile.centerlineApproxMeters,
   cumulativeHorizontalTurnDegrees:profile.cumulativeHorizontalTurnDegrees,
   maxHeadingStepDegrees:profile.maxHeadingStepDegrees,
   maxLongitudinalSlopeDegrees:profile.maxLongitudinalSlopeDegrees,
   absoluteVerticalTravelMeters:profile.absoluteVerticalTravelMeters,
   centerElevationRangeMeters:profile.centerElevationRangeMeters,
   widthBelow16ApproxMeters:round(lengthMeters*below16/N),
   widthBelow35ApproxMeters:round(lengthMeters*below35/N),
   widthBelow65ApproxMeters:round(lengthMeters*below65/N),
   movingAnchors:sectionHazards(gold,profiles,index),
   plannedWindows:win.map(w=>{
    const portion=profile.rows.filter(row=>row.u>=w.startM/lengthMeters&&row.u<=w.endM/lengthMeters);
    return {name:w.name,startM:w.startM,endM:w.endM,lengthM:w.endM-w.startM,
     features:[...w.features],presentBaselineWidthMeters:summaryFor(portion),
     implemented:false,manualApproved:false};
   }),
   plannedLengthMeters:sum(win.map(w=>w.endM-w.startM))};
  return result;
 });
 const seamGaps=gold.surfaces.slice(0,-1).map((s,i)=>({from:i,to:i+1,
  xyzGapMeters:round(dist(sample(s,1,.5),sample(gold.surfaces[i+1],0,.5)),3)}));
 const bankChange=gold.surfaces.map((s,index)=>{
  let changedControlPoints=0,centerChanged=0;
  for(let i=0;i<s.points.length;i++){
   if(s.points[i].some((v,k)=>v!==bank.surfaces[index].points[i][k])){
    changedControlPoints++;
    if(i%5===2)centerChanged++;
   }
  }
  return {section:index,changedControlPoints,centerChanged};
 });
 const planned= sum(outputSections.map(s=>s.plannedLengthMeters));
 const ultra=W9C0_ULTRANARROW.map(x=>({...x,lengthM:x.endM-x.startM,experimental:true,
  humanSafety:'NOT_ASSESSED',speedWindow:'MUST_BE_MEASURED_BEFORE_EDIT',
  warningLeadSecondsAtLeast:W9C0_POLICY.minimalReadableWarningSeconds}));
 return {schema:'dopagaki.w9c0.slope40-inventory/1',
  baseline:'VB-P101-A13-W7F',comparison:'VB-P101-A13-W9X-B1',
  source:'ACTUAL_B48_CAT_MULL_ROM_SKIN_AND_AUTHORED_B51C_ANCHORS',
  disclaimer:'READ_ONLY_PLAN_NOT_IMPLEMENTED_NOT_HUMAN_FAIRNESS_PROOF',
  policy:{...W9C0_POLICY},
  measured:{sections:7,nativeMachines:gold.movingObstacles.length,baselineLengthMeters:sum(lengths),
   trueGapsInsideCurrentSevenSolidRoadSkins:0,
   physicalSkinGridRows:31,physicalSkinGridCols:5,
   totalApproxBelow16Meters:round(sum(outputSections.map(s=>s.widthBelow16ApproxMeters))),
   totalApproxBelow35Meters:round(sum(outputSections.map(s=>s.widthBelow35ApproxMeters))),
   totalApproxBelow65Meters:round(sum(outputSections.map(s=>s.widthBelow65ApproxMeters))),
   seamGaps,bankTrialChanges:bankChange},
  target:{plannedMeters:planned,plannedPercent:round(100*planned/sum(lengths),3),
   deficitAgainstExact40PercentMeters:round(W9C0_POLICY.targetMeters-planned),
   windowCount:W9C0_WINDOWS.length,ultraNarrow:ultra,
   status:'DESIGN_ONLY_ZERO_IMPLEMENTED_SLOPE_ZONES'},
  sections:outputSections,
  nextGate:{id:'W9-C1',firstTrial:'ABYSS DIVE 280–400m / 120m target zone, trial only a shorter safely approached 10–16m segment',
   constraints:['NO_B5_W7F_W9X_MUTATION','NO_SPEED_RESET','NATIVE_240HZ',
     'MAINTAIN_28_REAL_MOVERS','REAL_COLLISION_SURFACE',
     '2_SECOND_LOOKAHEAD_AT_REAL_SPEED','NO_HUMAN_FAIRNESS_CLAIM']},
  safety:{canonicalSourceModified:false,physicsEngineModified:false,
    trackSelectionChanged:false,productionPromoted:false,
    userManualPlaytest:'NOT_RUN',fairness:'HOLD'}};
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href)
 process.stdout.write(JSON.stringify(auditW9C0(),null,2)+'\n');

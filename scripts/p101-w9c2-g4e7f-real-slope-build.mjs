/**
 * W9-C2 G4E-7F / TRUE PHYSICAL early skyline + crown-bank pair, OFFLINE.
 * Two independently authored B48 31x5 collidable lattice changes, not VFX.
 * No new gap, no teleport, no forced steering, no speed reset, no player aids.
 * Gold, earlier real-gap candidate, all 28 B51-C machines and G5-C1 untouched.
 */
import {generateP101A13W7Candidate} from './p101-a13-w7-gameplay-build.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
import {P101_B5_SECTIONS} from './p101-b5-speedway-build.mjs';

export const G4E7F_WINDOWS=Object.freeze([
 Object.freeze({id:'SKYLINE_THREAD',section:0,startMeters:280,endMeters:400,
  lengthNominalMeters:600,shape:'DESCENDING_OPPOSING_CURVE'}),
 Object.freeze({id:'CROWN_BANKING',section:1,startMeters:160,endMeters:340,
  lengthNominalMeters:1500,shape:'RISING_BANKED_S'})
]);
export const G4E7F_VARIANTS=Object.freeze({
 measured:Object.freeze({id:'measured',skyline:{lateral:13,depth:-11,bank:2.2,width:46},
  crown:{lateral:11,depth:9,bank:4.2,width:54}}),
 dramatic:Object.freeze({id:'dramatic',skyline:{lateral:22,depth:-20,bank:4.5,width:34},
  crown:{lateral:18,depth:16,bank:7.5,width:40}}),
 // G4E-7F-C: high-speed curvature-consistent studies after both original
 // candidates genuinely fell. Keep failed originals unchanged for evidence.
 glide:Object.freeze({id:'glide',skyline:{lateral:8,depth:-1.0,bank:2,width:66},
  crown:{lateral:8,depth:1.1,bank:2,width:66}}),
 flow:Object.freeze({id:'flow',skyline:{lateral:11,depth:-1.7,bank:3,width:60},
  crown:{lateral:9,depth:1.6,bank:3.4,width:60}})
});
const add=(a,b)=>a.map((x,i)=>x+b[i]),sub=(a,b)=>a.map((x,i)=>x-b[i]);
const scale=(v,a)=>v.map(x=>x*a),norm=v=>scale(v,1/(Math.hypot(...v)||1));
const distance=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
const pulse=(u,start,end)=>{
 if(u<=start||u>=end)return 0;
 const x=(u-start)/(end-start);
 return Math.sin(Math.PI*x)**2;
};
export function g4e7fFieldAt(id,u,variant='measured'){
 const w=G4E7F_WINDOWS.find(x=>x.id===id),plan=G4E7F_VARIANTS[variant];
 if(!w||!plan||!Number.isFinite(u)||u<0||u>1)throw Error('Declared G4E7F window, u, variant required');
 const p=pulse(u,w.startMeters/w.lengthNominalMeters,w.endMeters/w.lengthNominalMeters),
  x=(u-w.startMeters/w.lengthNominalMeters)/((w.endMeters-w.startMeters)/w.lengthNominalMeters),
  conf=w.section===0?plan.skyline:plan.crown;
 return {active:p>0,pulse:p,
  lateralMeters:conf.lateral*Math.sin(2*Math.PI*x)*p,
  verticalMeters:conf.depth*p,
  bankEdgeMeters:conf.bank*Math.sin(2*Math.PI*x)*p,
  targetWidthMeters:conf.width};
}
export function generateG4E7FEarlyPhysicalCandidate(variant='measured'){
 if(!Object.hasOwn(G4E7F_VARIANTS,variant))throw Error('G4E7F enumerated offline variant only');
 const original=generateP101A13W7Candidate(),doc=structuredClone(original);
 if(original.stageForge.revision!=='W7F'||original.surfaces.length!==7||
   original.movingObstacles.length!==28||original.route.length!==155)
  throw Error('Exact original W7F seven-road 28-machine baseline required');
 const deltas=[],alteredSections=new Set();
 for(const window of G4E7F_WINDOWS){
  if(P101_B5_SECTIONS[window.section].length!==window.lengthNominalMeters)
   throw Error('W9-C0 early-window nominal length drift');
  const s=doc.surfaces[window.section],o=original.surfaces[window.section];
  if(!s.rideable||!s.collidable||s.rows!==31||s.cols!==5||s.resolution!==o.resolution||
     s.voidLongitudinalCells?.length)throw Error('G4E7F original B48 road lattice required');
  const pts=o.points,n=s.points;
  let changed=0,deltaXZ=0,deltaY=0,minimumWidth=Infinity;
  for(let row=0;row<s.rows;row++){
   const u=row/(s.rows-1),f=g4e7fFieldAt(window.id,u,variant);
   if(!f.active)continue;
   const center=pts[row*5+2],
    prev=pts[Math.max(0,row-1)*5+2],next=pts[Math.min(s.rows-1,row+1)*5+2],
    tangent=norm([next[0]-prev[0],0,next[2]-prev[2]]),
    lateral=norm([-tangent[2],0,tangent[0]]),
    origWidth=distance(pts[row*5],pts[row*5+4]),
    target=Math.min(origWidth,f.targetWidthMeters),
    width=origWidth+(target-origWidth)*f.pulse,
    ratio=width/origWidth;
   if(!(ratio>0&&ratio<=1.000001))throw Error('G4E7F collapse/expand rejected');
   minimumWidth=Math.min(minimumWidth,width);
   for(let j=0;j<5;j++){
    const old=pts[row*5+j];
    const point=add(
     add(center,scale(sub(old,center),ratio)),
     add(scale(lateral,f.lateralMeters),[0,f.verticalMeters+(j-2)/2*f.bankEdgeMeters,0]));
    n[row*5+j]=point;changed++;
    deltaXZ=Math.max(deltaXZ,Math.hypot(point[0]-old[0],point[2]-old[2]));
    deltaY=Math.max(deltaY,Math.abs(point[1]-old[1]));
   }
  }
  if(changed<10||deltaXZ<3||deltaY<(['glide','flow'].includes(variant)?0.8:4)||minimumWidth<12)
   throw Error('G4E7F physical bend/slope/bank too weak or road collapsed');
  if(tessellate(s).degenerate!==0)throw Error('Real B48 collision triangles degenerate');
  for(let i=0;i<22;i++)doc.route[window.section*22+i]=sample(s,(i+.015)/22,.5);
  deltas.push({id:window.id,section:window.section,
   startMeters:window.startMeters,endMeters:window.endMeters,
   nominalAffectedMeters:window.endMeters-window.startMeters,changedControlPoints:changed,
   maxLateralXZDeltaMeters:Number(deltaXZ.toFixed(2)),
   maxVerticalDeltaMeters:Number(deltaY.toFixed(2)),
   nominalMinimumWidthMeters:Number(minimumWidth.toFixed(2)),
   genuinePhysicalB48:true,addedRideableBridges:0,
   humanPlayability:'HOLD'});
  alteredSections.add(window.section);
 }
 const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 if(!eq(doc.spawns,original.spawns)||!eq(doc.movingObstacles,original.movingObstacles)||
  !eq(doc.routeSegments,original.routeSegments)||!eq(doc.surfaces.map(s=>s.id),original.surfaces.map(s=>s.id))||
  doc.surfaces.some((s,i)=>!alteredSections.has(i)&&!eq(s,original.surfaces[i]))||
  doc.route.some((p,i)=>i>=154||!alteredSections.has(Math.floor(i/22))?
     !eq(p,original.route[i]):false))
  throw Error('G4E7F unapproved Gold, route, spawn or 28 moving machine drift');
 const nominal=deltas.reduce((sum,x)=>sum+x.nominalAffectedMeters,0);
 if(nominal!==300)throw Error('G4E7F isolated W9C0 300m study length drift');
 doc.name='W9-C2 G4E-7F '+variant.toUpperCase()+' TWO REAL EARLY B48 SLOPE WINDOWS / OFFLINE HOLD';
 doc.stageForge={...doc.stageForge,revision:'W9C2-G4E-7F-'+variant,
  recordStageId:'VB-P101-A13-W9C2-G4E7F-'+variant.toUpperCase(),
  productionPromoted:false,gameAutoSteering:false,studyOnly:'OFFLINE_NOT_SELECTABLE',
  humanPlaytest:'NOT_RUN',fairness:'NOT_APPROVED',nativeScriptedProof:null,
  fullStartToFinish:'NOT_VERIFIED_G4E7F',
  g4e7fPhysicalStudy:{variant,deltas,realB48ModifiedSections:[...alteredSections],
   nominalExperimentalMeters:nominal,physicallyModifiedCollision:true,
   originalGoldW7FUntouched:true,original28MachinesUnchanged:true,
   noNewGapOrCatchPlatform:true,claimedNewPlayableMeters:0,
   officiallyApprovedSlopeDnaMeters:0,humanFairness:'HOLD',publish:'HOLD'}};
 return validate(doc);
}

/** G4E-7AS BANKED SERPENT: independent 3D physical road trial.
 * True B48 lateral S, crest/dip and crossfall in TWO spans of the first
 * narrow road, plus anchored REAL B51-C #02 rotor. Not publishable.
 */
import {generateG4E7AP} from './p101-w9c2-g4e7ap-temporal-slalom.mjs';
import {AJ_ROADS} from './p101-w9c2-g4e7aj-reanchor-moving.mjs';
import {sample,validate,tessellate} from '../private/reference_only/director/surface.js';
import {compile,contacts} from '../private/reference_only/director/collision.js';
import {validateMovingObstacle} from '../private/reference_only/director/moving/moving-obstacles.mjs';

const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const dist=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
const wave=(u,start,end)=>u>start&&u<end?Math.sin(Math.PI*(u-start)/(end-start))**2:0;
const unit=x=>x.map(v=>v/(Math.hypot(...x)||1));
export const AS_SPANS=Object.freeze([
 Object.freeze({id:'ascending-air-serpent',from:.24,to:.435,lateral:9.5,elevation:8.5,bank:-2.7}),
 Object.freeze({id:'descending-skew-cut',from:.745,to:.895,lateral:-10.5,elevation:-10,bank:3.5})
]);
function side(points,r){
 const a=points[Math.max(0,r-1)*5+2],b=points[Math.min(30,r+1)*5+2],
  d=[b[0]-a[0],0,b[2]-a[2]];
 if(Math.hypot(...d)<1)throw Error('AS degenerate true road tangent');
 return unit([-d[2],0,d[0]]);
}
export function generateG4E7AS(road='true-pinch'){
 if(!AJ_ROADS.includes(road))throw Error('AS unknown true B48 candidate');
 const ap=generateG4E7AP(road),frozen=JSON.stringify(ap),
  doc=structuredClone(ap),old=ap.surfaces[0],skin=doc.surfaces[0];
 const originalGap=ap.stageForge.g4e7acR2Study.gap,
  lip0=sample(old,originalGap.uTakeoff,.5),
  landing0=sample(old,originalGap.uLanding,.5);
 const changed=[],measure=Object.fromEntries(AS_SPANS.map(s=>[s.id,{rows:0,maxSide:0,maxHeight:0,maxBank:0}]));
 for(let r=0;r<31;r++){
  const u=r/30,active=AS_SPANS.map(s=>({...s,weight:wave(u,s.from,s.to)})).filter(s=>s.weight>1e-9);
  if(!active.length)continue;
  changed.push(r);
  const x=active.reduce((a,s)=>a+s.lateral*s.weight,0),
   y=active.reduce((a,s)=>a+s.elevation*s.weight,0),
   roll=active.reduce((a,s)=>a+s.bank*s.weight,0),
   lateral=side(old.points,r);
  for(const s of active){
   const e=measure[s.id];e.rows++;
   e.maxSide=Math.max(e.maxSide,Math.abs(s.lateral*s.weight));
   e.maxHeight=Math.max(e.maxHeight,Math.abs(s.elevation*s.weight));
   e.maxBank=Math.max(e.maxBank,Math.abs(s.bank*s.weight));
  }
  for(let c=0;c<5;c++){
   const p=old.points[r*5+c],cross=(c/4-.5)*2;
   skin.points[r*5+c]=[p[0]+lateral[0]*x,p[1]+y+roll*cross,p[2]+lateral[2]*x];
  }
 }
 for(let i=0;i<22;i++)doc.route[i]=sample(skin,(i+.015)/22,.5);
 // The REAL crossing slider and flank rotor must follow their own altered
 // B48 centerline. No fake B51 poses: translate actual physical pivot/box.
 const anchors=[['a13-machine-01',.32,'AS real crossing slider / ascending bank'],
  ['a13-machine-02',.80,'AS active flank rotor / descending skew cut']];
 const deltas={};
 for(const [id,u,name] of anchors){
  const index=doc.movingObstacles.findIndex(o=>o.id===id);
  if(index<0)throw Error('AS original B51 missing: '+id);
  const originalAnchor=sample(old,u,.5),newAnchor=sample(skin,u,.5),
   delta=newAnchor.map((v,i)=>v-originalAnchor[i]);
  if(dist(originalAnchor,newAnchor)<2)throw Error('AS real B51 change not anchored');
  deltas[id]=delta;
  doc.movingObstacles[index]=validateMovingObstacle({...doc.movingObstacles[index],
   name,position:doc.movingObstacles[index].position.map((v,i)=>v+delta[i])});
 }
 const mesh=tessellate(skin),mid=sample(skin,(originalGap.uTakeoff+originalGap.uLanding)/2,.5),
  widths=[.305,.325,.345,.785,.8,.815].map(u=>dist(sample(skin,u,0),sample(skin,u,1)));
 const invariants={
  degenerate:mesh.degenerate===0,
  lipExact:eq(sample(skin,originalGap.uTakeoff,.5),lip0),
  landingExact:eq(sample(skin,originalGap.uLanding,.5),landing0),
  genuineVoidCell52:eq(skin.voidLongitudinalCells,[52]),
  downstreamSurfaces:eq(doc.surfaces.slice(1),ap.surfaces.slice(1)),
  downstreamRoute:eq(doc.route.slice(22),ap.route.slice(22)),
  routeSegments:eq(doc.routeSegments,ap.routeSegments),
  spawn:eq(doc.spawns,ap.spawns),
  other26Hazards:eq(doc.movingObstacles.filter(o=>!['a13-machine-01','a13-machine-02'].includes(o.id)),
   ap.movingObstacles.filter(o=>!['a13-machine-01','a13-machine-02'].includes(o.id))),
  enteringTurn:measure[AS_SPANS[0].id].maxSide>=7,
  exitingTurn:measure[AS_SPANS[1].id].maxSide>=7,
  enteringCrest:measure[AS_SPANS[0].id].maxHeight>=6,
  exitingDive:measure[AS_SPANS[1].id].maxHeight>=6,
  enteringBank:measure[AS_SPANS[0].id].maxBank>=2,
  exitingBank:measure[AS_SPANS[1].id].maxBank>=2,
  physicalWidth:widths.every(w=>w>=10&&w<=17),
  realB51Reanchored:['a13-machine-01','a13-machine-02'].every(id=>Math.hypot(...deltas[id])>=2),
  originalSevenRoads:doc.surfaces.length===7,
  original28Machines:doc.movingObstacles.length===28,
  apNotMutated:JSON.stringify(ap)===frozen
 };
 const failed=Object.entries(invariants).filter(([,ok])=>!ok).map(([id])=>id);
 if(failed.length)throw Error('AS protected road / gap / B51 mismatch: '+failed.join(', ')+
  ' | bounds '+JSON.stringify({widths,lipU:originalGap.uTakeoff,
   landingU:originalGap.uLanding,deltas,measure}));
 if(contacts(compile(doc),[mid[0],mid[1]+.65,mid[2]],.65)
   .some(x=>x.triangle.rideable))throw Error('AS phantom road under original B48 void');
 doc.name='G4E-7AS BANKED SERPENT / '+road+' / actual S crest + descending bank / HOLD';
 doc.stageForge={...doc.stageForge,
  revision:'W9C2-G4E7AS-'+road.toUpperCase(),
  recordStageId:'VB-P101-A13-W9C2-G4E7AS-'+road.toUpperCase()+'-BANKED-SERPENT',
  productionPromoted:false,g4e7asStudy:{
   id:'banked-serpent',road,source:'AP_REAL_B48_B51_FROZEN_GAP',
   physicallySculptedSpans:AS_SPANS.map(s=>({...s,...measure[s.id]})),
   trueB48ChangedRows:changed,original7Roads:7,actualB51:28,
   originalUnchangedB51FromAP:26,movedB51:['a13-machine-01','a13-machine-02'],
   realAnchorDeltasMeters:Object.fromEntries(Object.entries(deltas).map(([id,v])=>
    [id,v.map(x=>+x.toFixed(3))])),
   widthsMeters:widths.map(x=>+x.toFixed(3)),
   actualPhysicalGapCell52:true,lipLandingUnchanged:true,
   native240Hz:'UNTESTED',fairReachability:'UNTESTED',
   formalSlope2Meters:0,humanFairness:'HOLD',art:'HOLD',publish:'HOLD'
  }};
 return validate(doc);
}

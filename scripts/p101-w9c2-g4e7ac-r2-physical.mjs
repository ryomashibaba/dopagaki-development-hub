/** G4E-7AC R2: retain proven AA jump / rejoin, test broad turns outside causal cell. */
import {generateG4E7AA} from './p101-w9c2-g4e7aa-physical.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
import {compile,contacts} from '../private/reference_only/director/collision.js';
export const AC_R2_FORMS=Object.freeze([
 Object.freeze({id:'frozen-aa',start:0,end:0,side:0,vertical:0}),
 Object.freeze({id:'approach-arc',start:.10,end:.51,side:30,vertical:12}),
 Object.freeze({id:'landing-crescent',start:.69,end:.93,side:37,vertical:-22})
]);
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const length=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
function normal(points,row){
 const a=points[Math.max(0,row-1)*5+2],b=points[Math.min(30,row+1)*5+2],
  x=b[0]-a[0],z=b[2]-a[2],m=Math.hypot(x,z);
 if(m<1e-3)throw Error('invalid R2 horizontal tangent');
 return [-z/m,x/m];
}
export function generateG4E7ACR2(id='frozen-aa'){
 const cfg=AC_R2_FORMS.find(x=>x.id===id);
 if(!cfg)throw Error('unknown AC R2 geometry');
 const baseline=generateG4E7AA(.7,'landing-soft'),doc=structuredClone(baseline),
  road=doc.surfaces[0],orig=baseline.surfaces[0];
 let maxSide=0,maxY=0;const rows=[];
 for(let r=0;r<31;r++){
  const u=r/30;
  if(u<=cfg.start||u>=cfg.end)continue;
  const weight=Math.sin(Math.PI*(u-cfg.start)/(cfg.end-cfg.start))**2,
   shift=cfg.side*weight,dy=cfg.vertical*weight,n=normal(orig.points,r);
  for(let j=0;j<5;j++){
   const p=orig.points[r*5+j];
   road.points[r*5+j]=[p[0]+shift*n[0],p[1]+dy,p[2]+shift*n[1]];
  }
  rows.push(r);maxSide=Math.max(maxSide,Math.abs(shift));maxY=Math.max(maxY,Math.abs(dy));
 }
 for(let i=0;i<22;i++)doc.route[i]=sample(road,(i+.015)/22,.5);
 const gap=baseline.stageForge.g4e7aaStudy.actualGap,lip=sample(road,gap.uTakeoff,.5),
  landing=sample(road,gap.uLanding,.5),
  mid=sample(road,(gap.uTakeoff+gap.uLanding)/2,.5);
 const width=length(sample(road,gap.uTakeoff,0),sample(road,gap.uTakeoff,1));
 const gapSize=length(lip,landing);
 if(!eq(lip,sample(orig,gap.uTakeoff,.5))||
    !eq(landing,sample(orig,gap.uLanding,.5))||
    !eq(road.points.slice(16*5,21*5),orig.points.slice(16*5,21*5))||
    road.voidLongitudinalCells?.join(',')!=='52'||
    !eq(doc.surfaces.slice(1),baseline.surfaces.slice(1))||
    !eq(doc.movingObstacles,baseline.movingObstacles)||
    !eq(doc.spawns,baseline.spawns)||
    !eq(doc.routeSegments,baseline.routeSegments)||
    !eq(doc.route.slice(22),baseline.route.slice(22))||
    doc.surfaces.length!==7||doc.movingObstacles.length!==28||
    tessellate(road).degenerate!==0||width<10||width>16||
    gapSize<2.5||gapSize>17)
   throw Error('AC R2 frozen real lip/rejoin or B48/28-hazard invariant');
 if(contacts(compile(doc),[mid[0],mid[1]+.65,mid[2]],.65)
    .some(x=>x.triangle.rideable))throw Error('R2 ghost cut bridge');
 if(id!=='frozen-aa'&&(maxSide<24||maxY<9||rows.length<5))
   throw Error('R2 not an actual macro road');
 doc.name='G4E-7AC R2 '+id+' genuine macro road / HOLD';
 doc.stageForge={...doc.stageForge,
  revision:'W9C2-G4E7AC-R2-'+id.toUpperCase(),
  recordStageId:'VB-P101-A13-W9C2-G4E7AC-R2-'+id.toUpperCase(),
  productionPromoted:false,
  g4e7acR2Study:{id,source:'AA_LANDING_SOFT_ALPHA070_UNCHANGED_CUT',
   changedRows:rows,maxHorizontalMeters:Number(maxSide.toFixed(2)),
   maxVerticalMeters:Number(maxY.toFixed(2)),
   originalLipLandingExact:true,gap,
   pilot240Hz:'UNTESTED',all7Roads:'UNTESTED',
   certifiedSlope2Meters:0,visualFairness:'HOLD',
   humanFairness:'HOLD',publish:'HOLD'}
 };
 return validate(doc);
}

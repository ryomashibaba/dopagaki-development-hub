/** G4E-7AC: actual macro B48 geometry, NOT a public-stage change. */
import {generateG4E7AA} from './p101-w9c2-g4e7aa-physical.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
import {compile,contacts} from '../private/reference_only/director/collision.js';
export const AC_FORMS=Object.freeze([
 Object.freeze({id:'frozen-aa',sideA:0,sideB:0,rise:0,fall:0}),
 Object.freeze({id:'canyon-arc',sideA:47,sideB:0,rise:10,fall:16}),
 Object.freeze({id:'rift-switchback',sideA:65,sideB:-45,rise:15,fall:26})
]);
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const dist=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
const bump=(u,a,b)=>u<=a||u>=b?0:Math.sin(Math.PI*(u-a)/(b-a))**2;
function right(points,row){
 const a=points[Math.max(0,row-1)*5+2],b=points[Math.min(30,row+1)*5+2],
  dx=b[0]-a[0],dz=b[2]-a[2],m=Math.hypot(dx,dz);
 if(m<1e-3)throw Error('AC tangent collapse');
 return [-dz/m,dx/m];
}
function length(road,start,end){
 let total=0,last=sample(road,start,.5);
 for(let i=1;i<=96;i++){
  const p=sample(road,start+(end-start)*i/96,.5);
  total+=dist(last,p);last=p;
 }return total;
}
export function generateG4E7AC(id='frozen-aa'){
 const cfg=AC_FORMS.find(x=>x.id===id);
 if(!cfg)throw Error('AC unknown variant');
 const source=generateG4E7AA(.7,'landing-soft'),doc=structuredClone(source),
  road=doc.surfaces[0],old=source.surfaces[0];
 let maxHorizontal=0,maxVertical=0;
 const alteredRows=[];
 for(let r=0;r<31;r++){
  const u=r/30,
   sideways=cfg.sideA*bump(u,.17,.76)+cfg.sideB*bump(u,.40,.91),
   vertical=cfg.rise*bump(u,.22,.62)-cfg.fall*bump(u,.44,.91);
  if(Math.abs(sideways)+Math.abs(vertical)<1e-9)continue;
  const lateral=right(old.points,r);
  for(let j=0;j<5;j++){
   const p=old.points[r*5+j];
   road.points[r*5+j]=[p[0]+sideways*lateral[0],p[1]+vertical,p[2]+sideways*lateral[1]];
  }
  alteredRows.push(r);
  maxHorizontal=Math.max(maxHorizontal,Math.abs(sideways));
  maxVertical=Math.max(maxVertical,Math.abs(vertical));
 }
 for(let i=0;i<22;i++)doc.route[i]=sample(road,(i+.015)/22,.5);
 const original=source.stageForge.g4e7aaStudy.actualGap,
  start=original.uTakeoff,end=original.uLanding,
  takeoff=sample(road,start,.5),landing=sample(road,end,.5),
  middle=sample(road,(start+end)/2,.5),
  width=dist(sample(road,start,0),sample(road,start,1)),
  distance=dist(takeoff,landing),mesh=tessellate(road);
 if(road.rows!==31||road.cols!==5||road.resolution!==3||
   road.voidLongitudinalCells?.join(',')!=='52'||
   doc.surfaces.length!==7||doc.movingObstacles.length!==28||
   mesh.degenerate!==0||width<10||width>16||distance<=2.5||distance>=17||
   !same(doc.surfaces.slice(1),source.surfaces.slice(1))||
   !same(doc.movingObstacles,source.movingObstacles)||
   !same(doc.spawns,source.spawns)||
   !same(doc.routeSegments,source.routeSegments)||
   !same(doc.route.slice(22),source.route.slice(22))||
   !same(road.points.slice(0,30),old.points.slice(0,30))||
   !same(road.points.slice(140),old.points.slice(140)))
  throw Error('AC real B48/28 active machines/7 roads/seam integrity failed');
 if(contacts(compile(doc),[middle[0],middle[1]+.65,middle[2]],.65)
  .some(x=>x.triangle.rideable))throw Error('AC ghost collision bridge');
 if(id!=='frozen-aa'&&(maxHorizontal<24||maxVertical<9||alteredRows.length<12))
  throw Error('AC not macro enough');
 const gap={...original,gapMeters:Number(distance.toFixed(4)),
  lipWidthMeters:Number(width.toFixed(3)),
  verticalLandingDifferenceMeters:Number((takeoff[1]-landing[1]).toFixed(3))};
 doc.name='G4E-7AC '+id+' real macro B48 / HOLD';
 doc.stageForge={...doc.stageForge,
  revision:'W9C2-G4E7AC-'+id.toUpperCase(),
  recordStageId:'VB-P101-A13-W9C2-G4E7AC-'+id.toUpperCase(),
  productionPromoted:false,
  g4e7uStudy:{...doc.stageForge.g4e7uStudy,gap},
  g4e7wStudy:{...doc.stageForge.g4e7wStudy,gap},
  g4e7aaStudy:{...doc.stageForge.g4e7aaStudy,actualGap:gap},
  g4e7acStudy:{id,source:'AA_LANDING_SOFT_ALPHA_070',
   physical:true,alteredRows,maxHorizontalMeters:Number(maxHorizontal.toFixed(2)),
   maxVerticalMeters:Number(maxVertical.toFixed(2)),
   originalArcMeters:Number(length(old,.17,.91).toFixed(2)),
   modifiedArcMeters:Number(length(road,.17,.91).toFixed(2)),
   takeoffWorld:takeoff.map(x=>Number(x.toFixed(2))),
   landingWorld:landing.map(x=>Number(x.toFixed(2))),
   gap,missingPhysicalCell:52,
   trueGapCausality:'UNTESTED',full7Roads:'UNTESTED',webgl:'UNTESTED',
   humanFairness:'HOLD',certifiedSlope2Meters:0,publish:'HOLD'}
 };
 return validate(doc);
}

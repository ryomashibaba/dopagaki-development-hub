/**
 * G4E-7AB — sub-meter REAL first-B48 lead-in contour, after physically
 * proven AA alpha=.70 landing-soft. No decoration, HUD, steering or camera
 * intervention. Each profile has the identical 1-cell gap #52.
 */
import {generateG4E7AA} from './p101-w9c2-g4e7aa-physical.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
import {compile,contacts} from '../private/reference_only/director/collision.js';
const frozen=o=>Object.freeze(o);
export const AB_CONTOURS=frozen([
 frozen({id:'reference',rowY:frozen({})}),
 frozen({id:'crest-ease-025',rowY:frozen({16:-.15,17:-.30,18:-.15})}),
 frozen({id:'crest-ease-050',rowY:frozen({16:-.30,17:-.60,18:-.30})}),
 frozen({id:'crest-lift-025',rowY:frozen({16:.15,17:.30,18:.15})}),
 frozen({id:'crest-lift-050',rowY:frozen({16:.30,17:.60,18:.30})})
]);
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b),
 norm=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
export function generateG4E7AB(id='reference'){
 const cfg=AB_CONTOURS.find(x=>x.id===id);
 if(!cfg)throw Error('G4E-7AB must enumerate independent physical B48 changes');
 const source=generateG4E7AA(.7,'landing-soft'),doc=structuredClone(source),
  road=doc.surfaces[0],gap=doc.stageForge.g4e7aaStudy.actualGap,
  unchangedOtherSurfaces=JSON.stringify(source.surfaces.slice(1));
 for(const [str,delta] of Object.entries(cfg.rowY)){
  const row=Number(str);
  if(row<16||row>18||Math.abs(delta)>.6)throw Error('AB outside small contour search');
  for(let j=0;j<5;j++)road.points[row*5+j][1]+=delta;
 }
 for(let i=0;i<22;i++)doc.route[i]=sample(road,(i+.015)/22,.5);
 const lip=sample(road,gap.uTakeoff,.5),landing=sample(road,gap.uLanding,.5),
  voidCenter=sample(road,(gap.uTakeoff+gap.uLanding)/2,.5),
  width=norm(sample(road,gap.uTakeoff,0),sample(road,gap.uTakeoff,1)),
  distance=norm(lip,landing),
  mesh=tessellate(road);
 if(doc.surfaces.length!==7||doc.movingObstacles.length!==28||
  road.voidLongitudinalCells?.join(',')!=='52'||mesh.degenerate!==0||
  !(width>11&&width<16&&distance>2.5&&distance<13)||
  !eq(doc.surfaces.slice(1),source.surfaces.slice(1))||
  !eq(doc.movingObstacles,source.movingObstacles)||
  !eq(doc.spawns,source.spawns)||
  !eq(doc.routeSegments,source.routeSegments)||
  !eq(doc.route.slice(22),source.route.slice(22))||
  !eq(road.points.slice(19*5),source.surfaces[0].points.slice(19*5))||
  !eq(road.points.slice(0,16*5),source.surfaces[0].points.slice(0,16*5))||
  JSON.stringify(doc.surfaces.slice(1))!==unchangedOtherSurfaces)
  throw Error('AB original 7 physical roads/28 machines/15m missing strip damaged');
 if(contacts(compile(doc),[voidCenter[0],voidCenter[1]+.65,voidCenter[2]],.65)
    .some(c=>c.triangle.rideable))throw Error('AB phantom bridge found');
 const realGap={...gap,lipWidthMeters:Number(width.toFixed(3)),
  gapMeters:Number(distance.toFixed(4)),
  verticalLandingDifferenceMeters:Number((lip[1]-landing[1]).toFixed(3))};
 doc.stageForge={...doc.stageForge,
  revision:'W9C2-G4E7AB-'+id.toUpperCase(),
  recordStageId:'VB-P101-A13-W9C2-G4E7AB-'+id.toUpperCase(),
  productionPromoted:false,
  g4e7uStudy:{...doc.stageForge.g4e7uStudy,gap:realGap},
  g4e7wStudy:{...doc.stageForge.g4e7wStudy,gap:realGap},
  g4e7aaStudy:{...doc.stageForge.g4e7aaStudy,actualGap:realGap},
  g4e7abStudy:{source:'AA_LANDING_SOFT_ALPHA_070_NATIVE_FINISHED',
   profile:id,deltaRowY:cfg.rowY,gap:realGap,physical:true,
   roads:7,movingB51C:28,nativeHz:240,
   humanFairness:'HOLD',visualFairness:'UNTESTED',
   fullSevenRoads:'UNTESTED',certifiedSlope2Meters:0,
   publication:'HOLD'}};
 doc.name='G4E-7AB '+id+' true narrow gap / HOLD';
 return validate(doc);
}

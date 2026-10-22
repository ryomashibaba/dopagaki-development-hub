/**
 * G4E-7W R2: physically authored takeoff-transition interpolation from EXIT6
 * toward SLOPE6 while retaining actual 15.76m B48 one-cell cut at cell 52.
 * Fully local nonpublic; no imaginary landing, helper forces or dynamic assists.
 */
import {generateG4E7WPhysical} from './p101-w9c2-g4e7w-grounded-cut-build.mjs';
import {generateG4E7VExit} from './p101-w9c2-g4e7v-exit-build.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
import {compile,contacts} from '../private/reference_only/director/collision.js';
export const W_BLEND_LEVELS=Object.freeze([0,.2,.4,.6,.65,.7,.75,.8,1]);
const len=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function generateG4E7WBlend(alpha=0){
 if(!W_BLEND_LEVELS.includes(alpha))throw Error('W independent graded blend must be enumerated');
 const source=generateG4E7WPhysical('exit6',52),doc=structuredClone(source),
  road=doc.surfaces[0],gap=doc.stageForge.g4e7wStudy.gap;
 // Original EXIT6 rows 19=-6, 20=-3. Only row18 & row19 evolve.
 // At alpha=1 the physical lattice equals SLOPE6, but the gap moves to cell52.
 for(let j=0;j<5;j++){
  road.points[18*5+j][1]-=2*alpha;
  road.points[19*5+j][1]-=alpha;
 }
 for(let i=0;i<22;i++)doc.route[i]=sample(road,(i+.015)/22,.5);
 const a=sample(road,gap.uTakeoff,.5),b=sample(road,gap.uLanding,.5),
  m=sample(road,(gap.uTakeoff+gap.uLanding)/2,.5);
 const width=len(sample(road,gap.uTakeoff,0),sample(road,gap.uTakeoff,1));
 if(!(width>11&&width<16)||tessellate(road).degenerate!==0||
    !same(doc.movingObstacles,source.movingObstacles)||!same(doc.spawns,source.spawns)||
    !same(doc.surfaces.slice(1),source.surfaces.slice(1))||
    !same(doc.route.slice(22),source.route.slice(22)))
  throw Error('W2 protected B48 collision skin or machines changed');
 if(contacts(compile(doc),[m[0],m[1]+.65,m[2]],.65).some(c=>c.triangle.rideable))
  throw Error('W2 hidden support across genuine 15m gap');
 const realGap={...gap,
  gapMeters:Number(len(a,b).toFixed(4)),lipWidthMeters:Number(width.toFixed(3)),
  verticalLandingDifferenceMeters:Number((a[1]-b[1]).toFixed(3))};
 const stage=doc.stageForge;
 doc.stageForge={...stage,
  revision:'W9C2-G4E7W-TAKEOFF-BLEND-'+String(alpha).replace('.','_'),
  recordStageId:'VB-P101-A13-W9C2-G4E7W-BLEND-'+String(alpha).replace('.','_'),
  productionPromoted:false,
  g4e7uStudy:{...stage.g4e7uStudy,gap:realGap},
  g4e7wStudy:{...stage.g4e7wStudy,gap:realGap,
   physicalTakeoffTransition:alpha,priorSource:'EXIT6_CELL52_7ROAD_FAIL',
   alteredB48RowHeights:{18:-2*alpha,19:-alpha},
   laneWidthMeters:Number(width.toFixed(3)),approved:false,
   officialSlope2Meters:0,publish:'HOLD'}};
 doc.name='G4E-7W R2 alpha='+alpha+' true 15m grounded cell52 gap / HOLD';
 return validate(doc);
}

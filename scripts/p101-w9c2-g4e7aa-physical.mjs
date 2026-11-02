/**
 * G4E-7AA: independent actual B48 road-profile variants. No more VFX band-aids.
 * Source: proven full 240Hz G4E-7W α0.65/.70, physical one-strip cut 52.
 * Three single-idea contour experiments. Nothing promoted to normal gameplay.
 */
import {generateG4E7WBlend} from './p101-w9c2-g4e7w-takeoff-blend-build.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
import {compile,contacts} from '../private/reference_only/director/collision.js';
export const AA_VARIANTS=Object.freeze([
 Object.freeze({id:'crest-low',rowY:Object.freeze({16:-1,17:-2,18:-1})}),
 Object.freeze({id:'approach-high',rowY:Object.freeze({16:1,17:2,18:1})}),
 Object.freeze({id:'landing-soft',rowY:Object.freeze({20:-1,21:-.75})})
]);
export const AA_ALPHAS=Object.freeze([.65,.7]);
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const distance=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
export function generateG4E7AA(alpha,variant){
 const cfg=AA_VARIANTS.find(x=>x.id===variant);
 if(!AA_ALPHAS.includes(alpha)||!cfg)throw Error('G4E-7AA enumerated actual B48 experiments only');
 const source=generateG4E7WBlend(alpha),doc=structuredClone(source),road=doc.surfaces[0];
 for(const [key,val] of Object.entries(cfg.rowY)){
  const row=Number(key);
  if(row<16||row>21||Math.abs(val)>2)throw Error('G4E-7AA inadmissible B48 shape edit');
  for(let col=0;col<5;col++)road.points[row*5+col][1]+=val;
 }
 // Updated real guide points follow the actual changed B48 31x5, not a
 // ghost original route that would mislead even scripted P96 steering.
 for(let i=0;i<22;i++)doc.route[i]=sample(road,(i+.015)/22,.5);
 const mesh=tessellate(road),gap=doc.stageForge.g4e7wStudy.gap;
 const start=sample(road,gap.uTakeoff,.5),end=sample(road,gap.uLanding,.5),
  middle=sample(road,(gap.uTakeoff+gap.uLanding)/2,.5),
  width=distance(sample(road,gap.uTakeoff,0),sample(road,gap.uTakeoff,1)),
  length=distance(start,end);
 if(mesh.degenerate!==0||road.voidLongitudinalCells?.join(',')!=='52'||
  width<11||width>16||length<2.5||length>13||
  !equal(doc.surfaces.slice(1),source.surfaces.slice(1))||
  !equal(doc.movingObstacles,source.movingObstacles)||
  !equal(doc.spawns,source.spawns)||!equal(doc.route.slice(22),source.route.slice(22))||
  !equal(doc.routeSegments,source.routeSegments)||doc.movingObstacles.length!==28||
  doc.surfaces.length!==7)
  throw Error('G4E-7AA 7-road/28-machine/authentic 15m B48 geometry invariant failed');
 if(contacts(compile(doc),[middle[0],middle[1]+.65,middle[2]],.65).some(c=>c.triangle.rideable))
  throw Error('G4E-7AA phantom landing floor');
 const actualGap={...gap,gapMeters:Number(length.toFixed(4)),
  lipWidthMeters:Number(width.toFixed(3)),
  verticalLandingDifferenceMeters:Number((start[1]-end[1]).toFixed(3))};
 doc.name='G4E-7AA independent B48 '+variant+' '+alpha+' HOLD';
 doc.stageForge={...doc.stageForge,
  revision:'W9C2-G4E7AA-'+variant+'-'+String(alpha).replace('.','-'),
  recordStageId:'VB-P101-A13-W9C2-G4E7AA-'+variant.toUpperCase()+'-'+String(alpha).replace('.','-'),
  productionPromoted:false,
  g4e7uStudy:{...doc.stageForge.g4e7uStudy,gap:actualGap},
  g4e7wStudy:{...doc.stageForge.g4e7wStudy,gap:actualGap},
  g4e7aaStudy:{variant,alpha,source:'G4E7W_FROZEN_NATIVE_FINISHED',
   editedRows:cfg.rowY,trueB48CollisionSkin:true,actualGap,
   originalMovingMachines:28,realRoads:7,physicsHz:240,
   noInvisibleBridge:true,realEarlySightlines:'UNTESTED',
   humanFairness:'HOLD',officialSlope2Meters:0,publish:'HOLD'}};
 return validate(doc);
}

/**
 * G4E-7AJ: first-road genuine B51-C pressure research only.
 * Existing 28 movers stay collidable, unmodified 26 byte-equivalent;
 * only reanchor A13-01 slider / A13-02 rotor to the ACTUAL 11m B48 skins.
 * No auto-steering, speed reset, invisible road or new collider primitives.
 */
import {generateG4E7AH} from './p101-w9c2-g4e7ah-narrow-real-b48.mjs';
import {sample,validate} from '../private/reference_only/director/surface.js';
import {validateMovingObstacle} from '../private/reference_only/director/moving/moving-obstacles.mjs';
export const AJ_LAYOUTS=Object.freeze(['original','reanchor','offset-phase']);
export const AJ_ROADS=Object.freeze(['true-pinch','pinch-switch']);
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const norm=v=>v.map(x=>x/(Math.hypot(...v)||1));
function sideAt(road,u){
 const a=sample(road,u-.003,.5),b=sample(road,u+.003,.5);
 return norm([-(b[2]-a[2]),0,b[0]-a[0]]);
}
function anchored(road,o,u,offset,height,phaseShift=0){
 const r=sideAt(road,u),p=sample(road,u,.5);
 const position=[p[0]+r[0]*offset,p[1]+height,p[2]+r[2]*offset];
 const changed={...o,position,phase:(o.phase+phaseShift)%1};
 if(o.type==='slider'){
  changed.motion={...o.motion,axis:r};
  changed.yawDegrees=Math.atan2(-r[2],r[0])*180/Math.PI;
 }
 return validateMovingObstacle(changed);
}
export function generateG4E7AJ(road='true-pinch',layout='original'){
 if(!AJ_ROADS.includes(road)||!AJ_LAYOUTS.includes(layout))
  throw Error('G4E-7AJ unknown isolated physical road/layout');
 const source=generateG4E7AH(road),doc=structuredClone(source),
  skin=doc.surfaces[0],before=JSON.stringify(source),
  obj=source.movingObstacles,
  ids=['a13-machine-01','a13-machine-02'],
  indices=ids.map(id=>obj.findIndex(o=>o.id===id));
 if(indices.some(x=>x<0)||indices[0]===indices[1]||
    obj[indices[0]].type!=='slider'||obj[indices[1]].type!=='rotator'||
    source.surfaces.length!==7||obj.length!==28)
  throw Error('G4E-7AJ actual moving B51-C provenance mismatch');
 if(layout!=='original'){
  const shift=layout==='offset-phase';
  doc.movingObstacles[indices[0]]=anchored(skin,obj[indices[0]],.32,-13.5,5.8,shift?.27:0);
  doc.movingObstacles[indices[1]]=anchored(skin,obj[indices[1]],.80,13,3.1,shift?.39:0);
 }
 if(!same(doc.surfaces,source.surfaces)||!same(doc.route,source.route)||
    !same(doc.spawns,source.spawns)||!same(doc.routeSegments,source.routeSegments)||
    !same(doc.movingObstacles.filter((x,i)=>!indices.includes(i)),
          obj.filter((x,i)=>!indices.includes(i)))||
    (layout==='original'&&!same(obj,doc.movingObstacles))||
    (layout!=='original'&&same(obj,doc.movingObstacles))||
    skin.voidLongitudinalCells?.join(',')!=='52')
  throw Error('G4E-7AJ change outside two first-road B51-C physical obstacles');
 const trueRoadWidth=source.stageForge.g4e7ahStudy.widthMinMeters;
 if(!(trueRoadWidth>=10&&trueRoadWidth<=13.5))
  throw Error('G4E-7AJ requires actual 11m B48 narrow road');
 const moved=layout==='original'?0:2;
 doc.name='G4E-7AJ '+road+' / '+layout+' two B51-C real moving hazard trial (HOLD)';
 doc.stageForge={...doc.stageForge,
  recordStageId:'VB-P101-A13-W9C2-G4E7AJ-'+road.toUpperCase()+'-'+layout.toUpperCase(),
  revision:'W9C2-G4E7AJ-'+road.toUpperCase()+'-'+layout.toUpperCase(),
  productionPromoted:false,
  g4e7ajStudy:{
   id:layout,road,source:'G4E7AH_PHYSICAL_11M_B48_TRUE_GAP_7OF7',
   originalMovingObjects:28,unchangedMovingObjects:28-moved,
   reanchoredOriginalIds:moved?ids:[],
   originalRealRoads:7,originalVoidCell52:true,
   changedGeometry:false,changedPhysicsRules:false,changedSteering:false,
   widthMinMeters:trueRoadWidth,collisionModesUnchanged:true,
   native240Hz:'UNTESTED',visualQuality:'HOLD',
   humanFairness:'HOLD',certifiedSlope2Meters:0,publish:'HOLD'
  }};
 const v=validate(doc);
 if(!same(source.surfaces,v.surfaces)||v.movingObstacles.length!==28||
    v.stageForge.productionPromoted!==false||v.stageForge.g4e7ajStudy.publish!=='HOLD'||
    JSON.stringify(source)!==before)
  throw Error('G4E-7AJ post-validation protected source changed');
 return v;
}

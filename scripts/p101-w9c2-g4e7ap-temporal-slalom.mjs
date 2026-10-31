/** G4E-7AP: isolated true 11m B48 / B51-C temporal slalom; NOT approved.
 * Slider crosses the entire road and rotor sweeps in from the right shoulder.
 * AJ source, 26 other movers and physical-road collision surfaces stay intact.
 */
import {generateG4E7AJ,AJ_ROADS} from './p101-w9c2-g4e7aj-reanchor-moving.mjs';
import {sample,validate} from '../private/reference_only/director/surface.js';
import {validateMovingObstacle} from '../private/reference_only/director/moving/moving-obstacles.mjs';
const IDS=['a13-machine-01','a13-machine-02'];
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const offset=(p,v,k)=>p.map((x,i)=>x+v[i]*k);
function section(road,u){
 const c=sample(road,u,.5),a=sample(road,u,0),b=sample(road,u,1);
 const delta=[b[0]-a[0],0,b[2]-a[2]],width=Math.hypot(...delta);
 if(width<9)throw Error('AP requires actual narrow B48');
 return {center:c,width,axis:delta.map(x=>x/width)};
}
export function generateG4E7AP(road='true-pinch'){
 if(!AJ_ROADS.includes(road))throw Error('AP unknown narrow B48');
 const original=generateG4E7AJ(road,'reanchor'),frozen=JSON.stringify(original),
  doc=structuredClone(original),skin=doc.surfaces[0],a=section(skin,.32),b=section(skin,.80);
 const i=doc.movingObstacles.findIndex(o=>o.id===IDS[0]),
  j=doc.movingObstacles.findIndex(o=>o.id===IDS[1]);
 if(i<0||j<0||doc.movingObstacles[i].type!=='slider'||doc.movingObstacles[j].type!=='rotator'||
   doc.surfaces.length!==7||doc.movingObstacles.length!==28||
   skin.voidLongitudinalCells?.join(',')!=='52')throw Error('AP genuine 7AJ B48/B51 mismatch');
 doc.movingObstacles[i]=validateMovingObstacle({...doc.movingObstacles[i],
  name:'AP real crossing slider / choose left or right',
  position:offset(a.center,[0,1,0],1.95),size:[2.65,2.8,2.3],
  yawDegrees:Math.atan2(-a.axis[2],a.axis[0])*180/Math.PI,
  period:3.6,phase:.08,
  motion:{axis:a.axis,amplitude:Math.min(4.1,a.width*.36),
   timing:{easing:'smoothstep',dwellSeconds:.2}},
  collision:{mode:'fail'}});
 doc.movingObstacles[j]=validateMovingObstacle({...doc.movingObstacles[j],
  name:'AP actual flank blade / low-rebound push trial',
  position:offset(offset(b.center,b.axis,b.width*.5-.75),[0,1,0],1.55),
  size:[5.8,2.6,1.45],period:4.8,phase:.43,
  motion:{direction:1,baseAngleDegrees:0,
   timing:{easing:'smoothstep',dwellSeconds:.18}},
  collision:{mode:'push',pushStrength:1}});
 const changed=doc.movingObstacles.filter((o,k)=>!eq(o,original.movingObstacles[k])).map(o=>o.id);
 if(!eq(changed,IDS)||!eq(doc.surfaces,original.surfaces)||
    !eq(doc.route,original.route)||!eq(doc.routeSegments,original.routeSegments)||
    !eq(doc.spawns,original.spawns)||
    !eq(doc.movingObstacles.filter(o=>!IDS.includes(o.id)),
        original.movingObstacles.filter(o=>!IDS.includes(o.id)))||
    JSON.stringify(original)!==frozen)throw Error('AP protected provenance mutation');
 doc.name='G4E-7AP '+road+' real B51 temporal slalom / HOLD';
 doc.stageForge={...doc.stageForge,
  revision:'W9C2-G4E7AP-'+road.toUpperCase(),
  recordStageId:'VB-P101-A13-W9C2-G4E7AP-'+road.toUpperCase()+'-DUEL',
  productionPromoted:false,
  g4e7apStudy:{id:'temporal-slalom',road,
   source:'G4E7AJ_REANCHOR_TRUE_11M_B48',
   changedMovingIds:IDS,unchangedMovingObjects:26,realMovingObjects:28,realB48Roads:7,
   realMissingCell52:true,physicsEngineChanged:false,steeringChanged:false,cameraChanged:false,
   sliderAmplitudeMeters:doc.movingObstacles[i].motion.amplitude,
   rotorCollision:'push',native240Hz:'UNTESTED',humanFairness:'HOLD',
   certifiedSlope2Meters:0,visualArt:'HOLD',publish:'HOLD'}};
 const validated=validate(doc);
 if(!eq(validated.surfaces,original.surfaces)||
    validated.movingObstacles.length!==28||
    validated.stageForge.productionPromoted!==false||
    validated.stageForge.g4e7apStudy.certifiedSlope2Meters!==0||
    JSON.stringify(original)!==frozen)throw Error('AP genuine stage validation drift');
 return validated;
}

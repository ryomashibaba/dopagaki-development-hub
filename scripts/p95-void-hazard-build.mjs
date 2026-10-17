/**
 * P95 / VOID BREAKER — MOVING HAZARD PLAYTEST COURSE.
 * Real physical B51-C moving-box obstacles (not decorative meshes) on the
 * P93 road source, deliberately staged as independent VB-P95 candidate.
 *
 * No P93 or P94 baseline mutation; no physics, steering or score changes.
 * Native full-course/human feasibility is NOT assumed.
 */
import {generateVoidBreaker} from './p93-void-breaker-build.mjs';
import {sample,frame,validate} from '../private/reference_only/director/surface.js';
import {normalizeMovingObstacles} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {P95_HAZARD_SPECS} from '../web/p95-hazard-layout.mjs';
export {P95_HAZARD_SPECS};

const additions=(a,b,k=1)=>a.map((v,i)=>v+b[i]*k);
const norm=a=>{const d=Math.hypot(...a)||1;return a.map(v=>v/d)};

export const P95_HAZARD_COUNT=P95_HAZARD_SPECS.length;
export function generateVoidHazardCandidate(){
 const baseline=generateVoidBreaker();
 const doc=structuredClone(baseline),hazards=[];
 for(let i=0;i<P95_HAZARD_SPECS.length;i++){
  const [surfaceIndex,u,type,offset]=P95_HAZARD_SPECS[i],road=doc.surfaces[surfaceIndex],
   c=sample(road,u,.5),f=frame(road,u,.5);
  const tangent=norm([f.forward[0],0,f.forward[2]]),
   side=norm([-tangent[2],0,tangent[0]]);
  const at=(d,y=0)=>additions(additions(c,side,d),[0,1,0],y);
  const timing={easing:['smoothstep','cosine','quintic'][type],dwellSeconds:.24};
  const period=4.1+(i%4)*.35,phase=(.13+i*.137)%1;
  const common={id:'p95-hazard-'+String(i+1).padStart(2,'0'),name:'VOID BREAKER '+String(i+1).padStart(2,'0'),
    period,phase,enabled:true,yawDegrees:0};
  if(type===0){
   hazards.push({...common,type:'slider',name:common.name+' / SIDEWINDER',
    position:at(offset,3.0),size:[7,4.5,8.5],collision:{mode:'fail'},
    motion:{axis:side,amplitude:13+(i%3)*3,timing}});
  }else if(type===1){
   hazards.push({...common,type:'rotator',name:common.name+' / SWEEP ARM',
    position:at(offset,2.3),size:[12,3.6,3.0],collision:{mode:'bounce',restitution:.65},
    motion:{direction:i%2?-1:1,baseAngleDegrees:10+i*13,timing}});
  }else{
   hazards.push({...common,type:'piston',name:common.name+' / VERTICAL PRESS',
    position:at(offset,6.4),size:[8,3.0,7.5],collision:{mode:'push',pushStrength:1.12},
    motion:{stroke:8,timing}});
  }
 }
 doc.movingObstacles=normalizeMovingObstacles({movingObstacles:hazards});
 // The P94 full-run proof belongs to VB-P93 only, not this new hazard build.
 const {fullRouteControl,neutralRun,...baseMetadata}=doc.stageForge;
 doc.stageForge={
  ...baseMetadata,id:'VB-P95',batch:'P95_MOVING_HAZARD_PLAYTEST_CANDIDATE',
  status:'EXPERIMENTAL_NATIVE_FULL_RUN_UNPROVEN',
  design:'VOID BREAKER original physical road plus native 12-machine hazard challenge',
  hazards:{source:'B51-C_NATIVELY_COLLIDING',count:hazards.length,types:['slider','rotator','piston'],
   modes:['fail','bounce','push'],humanFairness:'UNTESTED'},
  fullStartToFinish:'NOT_YET_PROVEN_WITH_HAZARDS',
  humanPlaytest:'NOT_RUN',finalVisualQuality:'NOT_APPROVED',
  basedOnIndependentRoadStage:'VB-P93',
  inheritedP94Evidence:false
 };
 doc.name='VOID BREAKER / MOVING HAZARD TRIAL — P95';
 return validate(doc);
}

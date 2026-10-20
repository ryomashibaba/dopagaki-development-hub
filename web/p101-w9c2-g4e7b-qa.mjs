/** G4E-7B: explicit loopback-only private P96 scripted WebGL QA. NOT human play. */
import {makeP96RoutePlan,p96DodgeSteer} from './p96-avoidance-steer.mjs';
import {p101RoadProgress} from './p101-overdrive.mjs';
export function createGapQa(doc,r,enabled){
 if(!enabled)return null;
 const g=doc?.stageForge?.g4e6EarlyGap;
 if(!g||!['C0-55-1','B0-65-1'].includes(g.id)||
 doc.stageForge.recordStageId!=='VB-P101-A13-W9C2-G4E6-'+g.id)return null;
 if(r.spawnIndex!==0||r.startSpeed!==52||doc.surfaces.length!==7||
 doc.movingObstacles.length!==28||doc.surfaces[g.section]?.id!==g.surfaceId||
 !g.actualOpenB48Collision||!g.noMidpointRideableSupport||
 doc.stageForge.productionPromoted!==false)throw Error('G4E7B original real B48 private start00 required');
 return {g,route:makeP96RoutePlan(doc,r),armed:false,air:false,landed:false,ticks:0,u:0};
}
export function qaSteer(q,r,poseAt){
 if(typeof poseAt!=='function')throw Error('G4E7B requires real B51-C native pose sampler');
 return p96DodgeSteer(r,q.route,'early-soft',poseAt).input/4.8;
}
export function qaStep(q,r){
 if(!q)return;
 const {section,u}=p101RoadProgress(r),g=q.g;
 if(section!==g.section||(r.surface||r.lastSurface)!==g.surfaceId)return;
 q.u=u;
 if(!q.armed&&r.grounded&&u>=g.uTakeoff-.035&&u<=g.uTakeoff+.003)q.armed=true;
 if(q.armed&&!q.air&&!r.grounded&&u>=g.uTakeoff-.003&&u<=g.uLanding+.022)q.air=true;
 if(q.air&&r.grounded&&r.surface===g.surfaceId&&u>=g.uLanding+.006){
  q.ticks++;if(q.ticks>=18)q.landed=true;
 }else if(!q.landed)q.ticks=0;
}
export function qaObservation(q,r){
 return {t:r.time,u:q.u,airSeen:q.air,landingSeen:q.landed,grounded:r.grounded,
  speed:Math.hypot(...r.v),position:r.p,physicsStatus:r.status};
}

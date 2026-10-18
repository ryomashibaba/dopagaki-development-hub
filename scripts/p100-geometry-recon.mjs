/**
 * P100 private PR-only study: reduce launch-inducing altitude curvature
 * while keeping all 12 original B51-C machine anchors physically usable.
 * Never substitutes sweep evidence for the chosen canonical P100 full run.
 */
import {generateP100TerrainPulseCandidate} from './p100-terrain-pulse-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {probeP96} from './p96-native-dodge-probe.mjs';
import {P95_HAZARD_SPECS} from '../web/p95-hazard-layout.mjs';
import {sample} from '../private/reference_only/director/surface.js';

const CONFIGS=Object.freeze([
 {heightBlendRadius:.13,heightScale:.25},
 {heightBlendRadius:.13,heightScale:.50},
 {heightBlendRadius:.20,heightScale:.50},
 {heightBlendRadius:.30,heightScale:.65},
 {heightBlendRadius:.35,heightScale:1},
 {heightBlendRadius:.50,heightScale:1},
 {heightBlendRadius:.50,heightScale:.70},
 {heightBlendRadius:.30,heightScale:.25}
]);
export function runP100GeometryRecon(){
 return CONFIGS.map(config=>{
  const doc=generateP100TerrainPulseCandidate(config),world=compile(doc);
  const profiles=['near-soft','early-soft'].map(profile=>{
   const r=probeP96(profile,{doc,world,limitSeconds:95});
   return {profile,status:r.status,elapsed:r.elapsed,visited:r.visited.length,
    failure:r.failure&&{t:r.failure.t,reason:r.failure.reason,surface:r.failure.surface},
    movingContacts:r.machineContacts.length,peakSpeed:r.peakSpeed};
  });
  const heights=P95_HAZARD_SPECS.map(([section,u],i)=>{
   const ob=doc.movingObstacles[i],road=doc.surfaces[section],center=sample(road,u,.5);
   return {i,clearance:+(ob.position[1]-center[1]).toFixed(2),type:ob.type};
  });
  return {config,profiles,heights,
   finishCount:profiles.filter(p=>p.status==='SCRIPTED_NATIVE_FULL_PASS').length};
 });
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
 for(const result of runP100GeometryRecon())console.log('P100_GEOMETRY_RECON '+JSON.stringify(result));
}

/** R15S3D0 genuine source geometry and saved true-240Hz trajectory analytical audit.
 * No stage edits, no simulation re-run, no gameplay/art certification. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {buildR15S3B} from './p101-r15s3b-isolated-source-trail-aware-scissor-macro-candidates.mjs';
import {sample} from '../private/reference_only/director/surface.js';
const SH='af076d67492a677d2235e4730aef8cdf4808e106';
const args=process.argv.slice(2),get=k=>{const i=args.indexOf(k);assert.ok(i>=0&&args[i+1],k);return args[i+1];};
const ref=JSON.parse(fs.readFileSync(get('--source'),'utf8'));
assert.equal(ref.sourceGameBlob,SH);
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const sub=(a,b)=>a.map((x,i)=>x-b[i]),norm=a=>Math.hypot(...a);
const fmt=(x,n=5)=>Number(x.toFixed(n)),vec=p=>p.map(x=>fmt(x,3));
const out={schema:'dopagaki.r15s3d0-original-sample-e-road-signed-route-motion-audit/1',sourceBlob:SH,originalGameEdited:false,sourcePhysics240HzEvidenceRef:40866341059,realRunRerun:false,originalB48AndB51Unmodified:true,sourceActualWebGL:false,officialArt:0,officialSlope2Meters:0,ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',perWorld:{}};
for(const world of ['true-pinch','pinch-switch']){
 const doc=buildR15S3B(world,'E_BANKED_LANDING'),s=doc.surfaces[2],next=doc.surfaces[3];
 const path=Array.from({length:31},(_,i)=>({row:i,u:fmt(i/30),centreXYZ:vec(sample(s,i/30,.5)),leftXYZ:vec(sample(s,i/30,0)),rightXYZ:vec(sample(s,i/30,1))}));
 const nextPath=Array.from({length:11},(_,i)=>({row:i,u:fmt(i/30),centreXYZ:vec(sample(next,i/30,.5))}));
 const checkpoints=ref.actualCases[world].E_BANKED_LANDING.P94_FULL_AFTER_21P5.checkpointAndQuarterSecondSourceTrajectory;
 const chosen=checkpoints.filter(p=>p.t>=21&&p.t<=34&&Math.abs(p.t-Math.round(p.t))<1e-4);
 const measures=[];
 for(const p of chosen){
  const q=path.reduce((best,pt)=>{const d=norm(sub([p.xyz[0],p.xyz[2]],[pt.centreXYZ[0],pt.centreXYZ[2]]));return !best||d<best.planDistanceM?{row:pt.row,planDistanceM:d}:best},null);
  const i=q.row,prev=path[Math.max(0,i-1)].centreXYZ,nextC=path[Math.min(30,i+1)].centreXYZ;
  const tangent=[nextC[0]-prev[0],0,nextC[2]-prev[2]],mag=norm(tangent),unit=tangent.map(x=>x/mag);
  const past=checkpoints.find(v=>v.tick===p.tick-60),future=checkpoints.find(v=>v.tick===p.tick+60);
  const disp=past&&future?sub(future.xyz,past.xyz):null;
  const approxSignedSpeed=disp?dot(disp,unit)/.5:null;
  const projectedWidth=norm(sub(path[i].rightXYZ,path[i].leftXYZ));
  measures.push({t:p.t,actualSourceGrounded:p.grounded,originalSourceRoad:p.physicalRoad,
    playerXYZ:p.xyz,actualSpeedMagnitudeMps:p.speedMps,
    nearestCentreControlRow:i,nearestPlanDistanceM:fmt(q.planDistanceM),
    approximateSignedRoadTangentSpeedFromHalfSecondDisplacementMps:approxSignedSpeed===null?null:fmt(approxSignedSpeed),
    nearRoadCenterXYZ:path[i].centreXYZ});
 }
 out.perWorld[world]={originalSurfaceIds:doc.surfaces.map(x=>x.id),sourceB51Count:doc.movingObstacles.length,
  scissorControlCenterline:path,nextRoadEntryCenterline:nextPath,
  realOriginal240HzStoredSamplesMeasured:measures,
  noNativeCCDContactOrActualForwardSpeedCertifiedByThisProxy:true};
 console.log('R15S3D0_ORIGINAL_SCISSOR_AND_NEXT_ROAD_GEOMETRY',world,JSON.stringify({scissor:path.map(p=>[p.row,p.centreXYZ]),following:nextPath.map(p=>[p.row,p.centreXYZ]),samples:measures}).slice(0,24000));
}
fs.mkdirSync(get('--out'),{recursive:true});
fs.writeFileSync(get('--out')+'/R15S3D0_ORIGINAL_E_TRACK_GEOMETRY_AND_SIGNED_DISPLACEMENT_PROXY.json',JSON.stringify(out,null,2)+'\n');

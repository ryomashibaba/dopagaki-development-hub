/** R15S3D6R1: change the REAL existing LOWER_REVERSAL B48 control grid
 * at the two-world shared support-loss area (u ~= .19, x ~= -1540).
 * This is not a hidden catch platform, speed reset, or player/CCD edit.
 */
import assert from 'node:assert/strict';
import {buildR15S3D6} from './p101-r15s3d6-two-real-b48-flight-support-designs.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
const smooth=x=>{const t=Math.max(0,Math.min(1,x));return t*t*(3-2*t);};
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function buildR15S3D6R1(world){
 assert.ok(['true-pinch','pinch-switch'].includes(world));
 const original=buildR15S3D6(world,'B_LOW_ANGLE_RECONTACT');
 const snapshot=JSON.stringify(original);
 const doc=structuredClone(original),lower=doc.surfaces[3],before=original.surfaces[3];
 assert.equal(lower.rows,31);assert.equal(lower.cols,5);
 const originalStart=before.points.slice(0,10).map(p=>[...p]);
 let maxYChange=0,minY=Infinity;
 for(let row=2;row<20;row++)for(let j=0;j<5;j++){
  const p0=before.points[j],p1=before.points[5+j],p=before.points[row*5+j];
  const tangent=p1.map((v,k)=>v-p0[k]);
  // Same real road centreline/width, with a genuinely supported,
  // less steep exit instead of extending a -7m/row descent through kill-Y.
  const runout=[p0[0]+row*tangent[0],
   p1[1]+tangent[1]*1.8*(1-Math.exp(-(row-1)/1.8)),
   p0[2]+row*tangent[2]];
  const weight=row<=9?1:1-smooth((row-9)/11);
  const q=p.map((v,k)=>v*(1-weight)+runout[k]*weight);
  lower.points[row*5+j]=q;
  maxYChange=Math.max(maxYChange,Math.abs(q[1]-p[1]));
  minY=Math.min(minY,q[1]);
 }
 assert.ok(maxYChange>8,'actual physical runout regrading required');
 assert.ok(eq(original.surfaces.slice(0,3),doc.surfaces.slice(0,3)));
 assert.ok(eq(original.surfaces.slice(4),doc.surfaces.slice(4)));
 assert.ok(eq(original.surfaces[3].points.slice(0,10),lower.points.slice(0,10)));
 assert.ok(eq(original.surfaces[3].points.slice(20*5),lower.points.slice(20*5)));
 assert.ok(eq(original.movingObstacles,doc.movingObstacles));
 assert.ok(eq(original.route,doc.route)&&eq(original.routeSegments,doc.routeSegments));
 assert.ok(eq(original.spawns,doc.spawns));
 assert.equal(JSON.stringify(original),snapshot);
 const seamA=sample(doc.surfaces[2],1,.5),seamB=sample(lower,0,.5);
 assert.ok(Math.hypot(...seamA.map((x,k)=>x-seamB[k]))<1e-5);
 assert.equal(tessellate(lower).degenerate,0);
 doc.name=original.name+' R15S3D6R1 real B48 lower grade RUNOUT HOLD';
 doc.stageForge={...doc.stageForge,productionPromoted:false,r15s3d6r1:{
  sourceOriginalBlob:SHA,world,originalB48:7,originalMovingB51:28,
  originalRunnerGuideSteerCameraChanged:false,originalCrownAndSCISSORUnchanged:true,
  modifiedB48Section:3,modifiedControlGridRows:[2,19],
  firstTwoAndLastElevenRowsFrozen:true,
  localTarget:'Both original worlds lose actual LOWER_REVERSAL at u≈.19, x≈-1540, Y≈-22; genuine B48 grading and course support hypothesis',
  maxActualLowerControlYDisplacementM:+maxYChange.toFixed(6),
  minModifiedControlY:minY,
  noAddedGhostCollider:true,sourceWebGL:false,humanQA:false,
  officialArt:0,officialSlope2Meters:0,GAMEPLAY:'HOLD',ART:'HOLD'}};
 const valid=validate(doc);
 assert.equal(valid.surfaces.length,7);
 assert.equal(valid.movingObstacles.length,28);
 return valid;
}

/**
 * R15S3B: a counterexample to rejected R15S3 CROWN edits.
 * Keep proven B16 CROWN entirely identical; design ONLY genuine
 * SCISSOR B48 source surface towards measured ball flight region.
 * Anchors are explicit design hypotheses in world Z/Y, NOT autopilot,
 * snapping, hidden lane, or a generated player-following collider.
 */
import assert from 'node:assert/strict';
import {buildR15OIsolatedB48} from './p101-r15o-isolated-original-crown-physical-shape-variants.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
const za=[[0,0],[1,30],[2,65],[3,95],[4,115],[5,135],[7,150],[9,160],[11,145],[13,110],[15,65],[18,18],[20,0],[30,0]];
const zb=[[0,0],[1,40],[2,85],[3,112],[4,135],[5,155],[7,170],[9,175],[11,162],[13,125],[15,70],[18,20],[20,0],[30,0]];
const zc=[[0,0],[1,35],[2,70],[3,100],[4,120],[5,140],[7,155],[9,165],[11,150],[13,110],[15,65],[18,15],[20,0],[30,0]];
const da=[[0,0],[1,0],[2,-4],[3,-12],[4,-22],[5,-30],[7,-40],[9,-48],[11,-45],[13,-30],[15,-15],[18,0],[30,0]];
const db=[[0,0],[1,0],[2,-7],[3,-18],[4,-32],[5,-44],[7,-55],[9,-56],[11,-52],[13,-35],[15,-16],[18,0],[30,0]];
const dc=[[0,0],[1,0],[2,-3],[3,-10],[4,-20],[5,-29],[7,-38],[9,-40],[11,-35],[13,-25],[15,-12],[18,0],[30,0]];
export const R15S3B=Object.freeze({
 D_TRACE_APPROACH:Object.freeze({id:'D_TRACE_APPROACH',z:za,dive:da,bank:0,lateNarrow:false,
  designPurpose:'genuinely visible road follows original open-air line with broad long-span centerline'}),
 E_BANKED_LANDING:Object.freeze({id:'E_BANKED_LANDING',z:zb,dive:db,bank:8,lateNarrow:false,
  designPurpose:'larger open landing descent and physical camber, not artificial airborne support'}),
 F_LATE_CANYON:Object.freeze({id:'F_LATE_CANYON',z:zc,dive:dc,bank:2.5,lateNarrow:true,
  designPurpose:'real early re-entry and delayed 16m corridor with long physical transition'})
});
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const round=n=>Number(n.toFixed(5));
function interp(anchors,r){
 if(r<=anchors[0][0])return anchors[0][1];
 for(let i=1;i<anchors.length;i++){
  const [hi,y1]=anchors[i],[lo,y0]=anchors[i-1];
  if(r<=hi)return y0+(y1-y0)*smooth((r-lo)/(hi-lo));
 }
 return anchors.at(-1)[1];
}
const width=(s,u)=>{const a=sample(s,u,0),b=sample(s,u,1);return Math.hypot(a[0]-b[0],a[2]-b[2]);};
const crossSection=(s)=>Array.from({length:301},(_,i)=>{const u=i/300;return {u:round(u),xzWidthM:round(width(s,u))};});
export function buildR15S3B(world,mode){
 assert.ok(['true-pinch','pinch-switch'].includes(world)&&Object.hasOwn(R15S3B,mode));
 const spec=R15S3B[mode];
 const original=buildR15OIsolatedB48(world,'B_BANKED_OUTER_SHOULDER_16M');
 const frozen=JSON.stringify(original);
 const study=structuredClone(original),a=study.surfaces[2],before=original.surfaces[2];
 assert.equal(a.id,'p93-SCISSOR_RISE-01');
 let peak=0,changedRows=0;
 for(let row=1;row<30;row++){
  const dz=interp(spec.z,row),down=interp(spec.dive,row);
  const bank=spec.bank*smooth((row-1)/5)*(1-smooth((row-15)/5));
  const nar=spec.lateNarrow?
    smooth((row-12)/5)*(1-smooth((row-23)/5)):0;
  const w=width(before,row/30);
  const shrink=nar*Math.max(0,1-16/w);
  if(Math.max(Math.abs(dz),Math.abs(down),Math.abs(bank),Math.abs(shrink))<1e-7)continue;
  for(let col=0;col<5;col++){
   const p=before.points[row*5+col],c=before.points[row*5+2];
   const across=(col-2)/2;
   // A visible, truly physical surface. The highway width remains the source
   // B48 width in D/E; F narrows only later and must pass a real full replay.
   const q=[p[0]-(p[0]-c[0])*shrink,p[1]+down-bank*across,p[2]+dz-(p[2]-c[2])*shrink];
   assert.ok(q.every(Number.isFinite));
   a.points[row*5+col]=q;
   peak=Math.max(peak,Math.hypot(...q.map((v,i)=>v-p[i])));
  }
  changedRows++;
 }
 assert.ok(changedRows>=18,'macro—not tiny local patch');
 assert.ok(peak>60,'materially new long-span road shape');
 assert.equal(tessellate(a).degenerate,0);
 assert.ok(eq(study.surfaces[1],original.surfaces[1]),'successful physical B16 CROWN must be frozen');
 assert.ok(eq(study.surfaces[0],original.surfaces[0]));
 assert.ok(eq(study.surfaces.slice(3),original.surfaces.slice(3)));
 assert.ok(eq(study.movingObstacles,original.movingObstacles));
 assert.ok(eq(study.route,original.route));
 assert.ok(eq(study.spawns,original.spawns));
 assert.ok(eq(a.points.slice(0,5),before.points.slice(0,5)));
 assert.ok(eq(a.points.slice(150),before.points.slice(150)));
 assert.equal(JSON.stringify(original),frozen);
 assert.equal(study.surfaces.length,7);assert.equal(study.movingObstacles.length,28);
 const xzWidthSamples=crossSection(a),n=xzWidthSamples.reduce((x,y)=>x.xzWidthM<y.xzWidthM?x:y);
 study.name=original.name+' R15S3B '+mode+' ISOLATED NEW ROAD ONLY';
 study.stageForge={...study.stageForge,productionPromoted:false,
  r15s3bStudy:{sourceBlob:SHA,world,mode,designPurpose:spec.designPurpose,
   originalB16EntireCrownUnchanged:true,realSCISSORChangedControlRows:changedRows,
   realSCISSORPeakControlPointChangeM:round(peak),originalB48Roads:7,originalB51Count:28,
   unchangedOtherSixRealRoads:true,allOriginalB51Unmodified:true,
   noNewRoadOrCollider:true,noInvisibleSafetyLane:true,
   originalRouteKeptForControllerComparison:true,
   sourceScarceSeamDerivativeOrHumanSupportNotClaimed:true,
   sourceRoadWidthXZMinM:n.xzWidthM,sourceRoadWidthXZMinU:n.u,
   sourceRoadWidthHasBeenFullyAuditedByTrueCCD:false,
   sourceBrowserWebGLRendered:false,officialArt:0,officialSlope2Meters:0,
   ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',RELEASE:'HOLD'}};
 return validate(study);
}

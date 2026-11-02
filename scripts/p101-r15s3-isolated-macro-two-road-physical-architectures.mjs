/**
 * R15S3: MACRO geometry hypotheses, not local road-width patches.
 * Source-real CROWN last half + SCISSOR full-length B48 physical lattice.
 * No new surfaces, invisible floor, physics/input/camera edits or publishing.
 * The genuine run, not a control-point check, determines feasibility.
 */
import assert from 'node:assert/strict';
import {buildR15OIsolatedB48} from './p101-r15o-isolated-original-crown-physical-shape-variants.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
export const MACRO=Object.freeze({
 A_LONG_SWEEP:Object.freeze({name:'interlocking-curvature-long-sweep',crownShift:24,scissorShift:64,crownBank:1.5,scissorBank:2.5,sag:0,narrowTarget:null}),
 B_BANKED_DESCENT:Object.freeze({name:'banked-vertical-fjord-approach',crownShift:14,scissorShift:44,crownBank:5.5,scissorBank:9,sag:-15,narrowTarget:null}),
 C_LATE_NARROW:Object.freeze({name:'delayed-narrow-canyon-beyond-entry',crownShift:29,scissorShift:54,crownBank:3.5,scissorBank:4.5,sag:-5,narrowTarget:16})
});
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const smooth=t=>{t=Math.min(1,Math.max(0,t));return t*t*(3-2*t);};
const envelope=(row,start,crestIn,crestOut,end)=>smooth((row-start)/(crestIn-start))*(1-smooth((row-crestOut)/(end-crestOut)));
const dist=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
const unit=v=>{const n=Math.hypot(...v);assert.ok(n>1e-8);return v.map(x=>x/n);};
const round=x=>Number(x.toFixed(5));
const widthXZ=(s,u)=>{const a=sample(s,u,0),b=sample(s,u,1);return Math.hypot(a[0]-b[0],a[2]-b[2]);};
const widthStudy=(s)=>{const vals=[];for(let i=0;i<=300;i++)vals.push({u:i/300,width:widthXZ(s,i/300)});
 const at=vals.reduce((a,b)=>a.width<b.width?a:b);
 return {minWidthXZ:round(at.width),atU:round(at.u),minWidthU45To80:round(Math.min(...vals.filter(x=>x.u>=.45&&x.u<=.8).map(x=>x.width)))};
};
export function buildR15S3(road,mode){
 assert.ok(['true-pinch','pinch-switch'].includes(road));
 assert.ok(Object.hasOwn(MACRO,mode));
 const spec=MACRO[mode];
 const source=buildR15OIsolatedB48(road,'B_BANKED_OUTER_SHOULDER_16M');
 const original=JSON.stringify(source),doc=structuredClone(source);
 assert.equal(source.surfaces.length,7);assert.equal(source.movingObstacles.length,28);
 const audits=[];
 for(const section of [1,2]){
  const before=source.surfaces[section],after=doc.surfaces[section];
  assert.equal(before.rows,31);assert.equal(before.cols,5);
  const start=section===1?13:0;
  const crestIn=section===1?18:7;
  const crestOut=section===1?23:18;
  const end=section===1?30:30;
  const shift=section===1?spec.crownShift:spec.scissorShift;
  const bank=section===1?spec.crownBank:spec.scissorBank;
  let changed=0,maxDisplacementM=0;
  for(let row=1;row<30;row++){
   const gain=envelope(row,start,crestIn,crestOut,end);
   if(gain<1e-12)continue;
   const center=before.points[row*5+2],outer=before.points[row*5];
   const direction=unit([outer[0]-center[0],0,outer[2]-center[2]]);
   const sag=section===2?spec.sag*gain:0;
   const u=row/30;
   const existingWidth=widthXZ(before,u);
   const narrow=section===2&&spec.narrowTarget!==null?
    envelope(row,11,15,23,28)*Math.max(0,1-spec.narrowTarget/existingWidth):0;
   for(let col=0;col<5;col++){
    const orig=before.points[row*5+col];
    const across=(col-2)/2;
    const contraction=section===2?narrow:0;
    const post=[
      orig[0]+direction[0]*shift*gain, 
      orig[1]+sag+bank*gain*(-across),
      orig[2]+direction[2]*shift*gain
    ];
    if(contraction>0){
      post[0]-=(orig[0]-center[0])*contraction;
      post[2]-=(orig[2]-center[2])*contraction;
    }
    assert.ok(post.every(Number.isFinite));
    after.points[row*5+col]=post;
    maxDisplacementM=Math.max(maxDisplacementM,dist(orig,post));
   }
   changed++;
  }
  assert.ok(changed>=14,'genuine macro must change many physical lattice rows');
  assert.ok(maxDisplacementM>7);
  assert.ok(eq(before.points.slice(0,5),after.points.slice(0,5)),'start seam protected');
  assert.ok(eq(before.points.slice(30*5),after.points.slice(30*5)),'end seam protected');
  const tri=tessellate(after);
  assert.equal(tri.degenerate,0);
  audits.push({section,physicalSurfaceId:after.id,sourceChangedControlRows:changed,
   maximumSourceControlDisplacementM:round(maxDisplacementM),
   sourceRideableTriangleCount:tri.topIndexCount/3,
   originalWidth:widthStudy(before),revisedWidth:widthStudy(after)});
 }
 assert.ok(eq(source.surfaces[0],doc.surfaces[0]));
 assert.ok(eq(source.surfaces.slice(3),doc.surfaces.slice(3)));
 assert.ok(eq(source.movingObstacles,doc.movingObstacles));
 assert.ok(eq(source.spawns,doc.spawns));
 assert.ok(eq(source.route,doc.route),'keep original route targets as fixed controller comparison');
 assert.equal(source.surfaces[0].voidLongitudinalCells.join(','),'52');
 assert.equal(JSON.stringify(source),original,'original source mutated');
 assert.equal(source.stageForge.productionPromoted,false);
 // These are spline-mesh hypotheses only; changing an inner lattice control
 // row can change seam derivatives without changing endpoint coordinates.
 doc.name=source.name+' R15S3 '+spec.name+' PHYSICAL RESEARCH ONLY';
 doc.stageForge={...doc.stageForge,productionPromoted:false,
  r15s3MacroStudy:{sourceBlob:SHA,world:road,mode,spec,
   changedActualPhysicalRoadSections:[1,2],actualPhysicalGridAudits:audits,
   genuineB48Roads:7,originalMovingB51Definitions:28,
   unchangedFirstGapCell52:true,unchangedFirstAndLastRoadSeamCoordinates:true,
   fullTangentOrSupportContinuityUnverified:true,
   noNewGameColliders:true,noHiddenSafetyLane:true,noTeleport:true,
   existingRouteGuideKeptForControlledStudy:true,
   sourceRealHumanAndArtCertification:false,officialSlope2Meters:0,
   ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',RELEASE:'HOLD'}};
 const verified=validate(doc);
 assert.equal(verified.surfaces.length,7);assert.equal(verified.movingObstacles.length,28);
 return verified;
}

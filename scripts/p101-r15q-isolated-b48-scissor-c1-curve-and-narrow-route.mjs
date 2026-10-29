/**
 * R15Q isolated geometrically continuous steering-route trial, source B48
 * SCISSOR_RISE only. No width addition or phantom floor. B16 CROWN preserved.
 * Edited centerline rows 1..13, row0 + rows14..30 and all road interfaces frozen.
 *
 * A: 24m outward arc, B: 40m outward arc. Both translate entire cross-section
 * preserving genuine original width (unlike R15P huge widenings).
 * C: 30m outward arc, bounded narrow passage taper at middle of SCISSOR, to
 * test Slope2 direction without pretending it is playable.
 */
import assert from 'node:assert/strict';
import {buildR15OIsolatedB48} from './p101-r15o-isolated-original-crown-physical-shape-variants.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';

export const R15Q_MODES=Object.freeze({
 B16_ONLY_REFERENCE:Object.freeze({shift:0,narrowTarget:null}),
 A_C1_SHIFT_24M_SOURCE_WIDTH:Object.freeze({shift:24,narrowTarget:null}),
 B_C1_SHIFT_40M_SOURCE_WIDTH:Object.freeze({shift:40,narrowTarget:null}),
 C_CURVE_SHIFT_30M_NARROW_16M:Object.freeze({shift:30,narrowTarget:16})
});
const close=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const round=x=>Number(x.toFixed(5));
const smooth=t=>{const s=Math.max(0,Math.min(1,t));return s*s*(3-2*s);};
const arc=row=>row>0&&row<14?Math.sin(Math.PI*row/14):0;
const width=(s,u)=>{const l=sample(s,u,0),r=sample(s,u,1);return Math.hypot(l[0]-r[0],l[2]-r[2]);};
function curvature(s){
 const out=[];
 for(let row=0;row<=18;row++){
  const u=row/30,p=sample(s,u,.5);
  const prev=sample(s,Math.max(0,u-1/300),.5);
  const next=sample(s,Math.min(1,u+1/300),.5);
  const xy=([x,y,z])=>[x,z];
  const b=xy(p).map((v,i)=>v-xy(prev)[i]),c=xy(next).map((v,i)=>v-xy(p)[i]);
  const lengthB=Math.hypot(...b),lengthC=Math.hypot(...c);
  const cosine=(b[0]*c[0]+b[1]*c[1])/((lengthB*lengthC)||1);
  const turnAngle=Math.acos(Math.max(-1,Math.min(1,cosine)));
  const ds=(lengthB+lengthC)/2;
  out.push({row,u:round(u),realWidthXZ:round(width(s,u)),
   centreXYZ:p.map(round),curvatureRadPerM:round(turnAngle/Math.max(ds,.0001)),
   nominalRadiusM:round(turnAngle>1e-7?ds/turnAngle:1000000)});
 }
 return out;
}
export function buildR15Q(road,mode){
 assert.ok(Object.hasOwn(R15Q_MODES,mode));
 const old=buildR15OIsolatedB48(road,'B_BANKED_OUTER_SHOULDER_16M');
 const frozen=JSON.stringify(old),doc=structuredClone(old);
 const before=old.surfaces[2],s=doc.surfaces[2],spec=R15Q_MODES[mode];
 assert.equal(s.id,'p93-SCISSOR_RISE-01');
 assert.equal(s.rows,31);assert.equal(s.cols,5);
 assert.equal(doc.surfaces.length,7);assert.equal(doc.movingObstacles.length,28);
 const changed=[],deltaByRow=[],maxShift=0;
 if(spec.shift>0){
  for(let row=1;row<14;row++){
   const weight=arc(row),sampleU=row/30,centre=before.points[row*5+2],
    originalOutside=before.points[row*5];
   // Shift away from the actual v0 exit side by moving the WHOLE
   // cross-section with a smooth C1 seam at row0 and row14.
   const outward=[originalOutside[0]-centre[0],0,originalOutside[2]-centre[2]];
   const len=Math.hypot(...outward);
   assert.ok(len>10);
   const direction=outward.map(v=>v/len);
   const shift=spec.shift*weight;
   const narrow=spec.narrowTarget===null?0:
    smooth((row-2)/3)*(1-smooth((row-10)/3));
   for(let j=0;j<5;j++){
    const orig=before.points[row*5+j];
    const across=(j-2)/2;
    // Reduce total width at peak of the corridor only, never widen it;
    // centre stays shifted; surface has continuous topology all across.
    const flatten=spec.narrowTarget===null?0:
      narrow*Math.max(0,1-spec.narrowTarget/width(before,sampleU));
    const constrict=direction.map(v=>v*across*len*flatten);
    const post=orig.map((v,i)=>v+direction[i]*shift+constrict[i]);
    s.points[row*5+j]=post;
    maxShift=Math.max(maxShift,Math.hypot(...post.map((v,k)=>v-orig[k])));
   }
   changed.push(row);deltaByRow.push({row,sourceArcShiftMetres:round(shift),
    narrowedFactor:round(narrow),realWidthXZ:round(width(s,row/30))});
  }
 }
 assert.equal(JSON.stringify(old),frozen);
 assert.ok(close(doc.surfaces[0],old.surfaces[0]));
 assert.ok(close(doc.surfaces[1],old.surfaces[1]));
 assert.ok(close(doc.surfaces.slice(3),old.surfaces.slice(3)));
 assert.ok(close(doc.movingObstacles,old.movingObstacles));
 assert.ok(close(doc.spawns,old.spawns));
 assert.ok(close(doc.surfaces[2].points.slice(0,5),before.points.slice(0,5)));
 assert.ok(close(doc.surfaces[2].points.slice(14*5),before.points.slice(14*5)));
 assert.ok(close(doc.surfaces[2].points.slice(0,5),before.points.slice(0,5)));
 assert.equal(tessellate(s).degenerate,0);
 assert.ok(spec.shift===0?changed.length===0:changed.length===13);
 // Smooth original physical B48 path, update original source route segment
 // control samples for guided P96, no change to vehicle physics/algorithm.
 // IMPORTANT: steering plan may use doc.route, so changes here must be
 // explicit and compared with unchanged-route trial before adoption.
 // This first experiment keeps the old guided route frozen to isolate
 // the *true physics* of moving the real road, not a hidden steering fix.
 assert.ok(close(doc.route,old.route));
 const pre=curvature(before),post=curvature(s);
 for(const i of [0,14,15,16,17,18]){
  assert.ok(Math.abs(pre[i].realWidthXZ-post[i].realWidthXZ)<.00001);
  assert.ok(close(pre[i].centreXYZ,post[i].centreXYZ));
 }
 if(spec.narrowTarget===null){
  for(const item of post)assert.ok(Math.abs(item.realWidthXZ-pre[item.row].realWidthXZ)<.06);
 }else{
  assert.ok(post.some((x,i)=>i>=5&&i<=11&&x.realWidthXZ<pre[i].realWidthXZ-1));
 }
 doc.name=old.name+' R15Q '+mode+' REAL SCISSOR CURVE not official';
 doc.stageForge={...old.stageForge,productionPromoted:false,
   r15qPhysicalSourceCurve:{
    sourceBlob:'af076d67492a677d2235e4730aef8cdf4808e106',
    road,mode,
    changedOnlyRealScissorRows1To13:changed,
    shifts:deltaByRow,
    studiedPhysicalCurveSpec:{...spec},
    maximumWorldLatticeShiftM:round(maxShift),
    unmodifiedOriginalB16Crown:true,
    unmodifiedSCISSORRow0AndFromRow14:true,
    unchangedOtherFiveRoads:true,
    unchangedOriginal28B51:true,
    originalRouteGuideUnchanged:true,
    noInvisibleOrExtraColliders:true,
    originalCrossSectionWidthPre:pre,
    isolatedTrueCrossSectionWidthPost:post,
    studyOnlyHumanFairnessNotTested:true,
    ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',RELEASE:'HOLD'}};
 const v=validate(doc);
 assert.equal(v.surfaces.length,7);assert.equal(v.movingObstacles.length,28);
 return v;
}

/**
 * R15P isolated original SCISSOR_RISE entry v0 edge re-alignment, following
 * physically verified R15O B16 crown bank repair. ONLY 3rd source B48 road
 * rows1..8 modified; original SCISSOR 0 seam and all rows>=9 preserved;
 * original CROWN B16 road exact; other 5 roads & 28 B51 exact; no game edits.
 */
import assert from 'node:assert/strict';
import {buildR15OIsolatedB48} from './p101-r15o-isolated-original-crown-physical-shape-variants.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
const variants=Object.freeze({
 ORIGINAL_B16_CROWN_NO_SCISSOR_PATCH:0,
 SCISSOR_OUTER_EDGE_RAMP_8M:8,
 SCISSOR_OUTER_EDGE_RAMP_16M:16,
 SCISSOR_OUTER_EDGE_RAMP_24M:24
});
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const gain=u=>smooth(u/.03)*(1-smooth((u-.10)/.19));
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const round=x=>+x.toFixed(6);
const widths=(s)=>[0,1,2,3,4,5,6,7,8,9,12,20,30].map(i=>{
 const l=sample(s,i/30,0),r=sample(s,i/30,1);
 return {row:i,u:round(i/30),widthXZ:round(Math.hypot(l[0]-r[0],l[2]-r[2])),
  trueOutsideEdge:l.map(round),centre:sample(s,i/30,.5).map(round)};
});
export function buildR15P(road,variant){
 assert.ok(Object.hasOwn(variants,variant));
 const baseline=buildR15OIsolatedB48(road,'B_BANKED_OUTER_SHOULDER_16M');
 const original=JSON.stringify(baseline),doc=structuredClone(baseline);
 const src=baseline.surfaces[2],s=doc.surfaces[2];
 assert.equal(s.id,'p93-SCISSOR_RISE-01');
 assert.equal(s.rows,31);assert.equal(s.cols,5);
 let changedRows=[],maxDelta=0;
 const amount=variants[variant];
 for(let row=1;row<=8;row++){
  const u=row/30,weight=gain(u);
  if(weight<1e-7)continue;
  const mid=src.points[row*5+2],edge=src.points[row*5];
  const v=[edge[0]-mid[0],0,edge[2]-mid[2]],len=Math.hypot(...v);
  assert.ok(len>15);
  const outward=v.map(x=>x/len);
  const lateral=[1,.5,0,0,0];
  for(let c=0;c<5;c++){
   const p=src.points[row*5+c],add=amount*weight*lateral[c];
   const q=[p[0]+add*outward[0],p[1]+.035*add*lateral[c],p[2]+add*outward[2]];
   s.points[row*5+c]=q;
   maxDelta=Math.max(maxDelta,Math.hypot(...q.map((v,i)=>v-p[i])));
  }
  if(amount>0)changedRows.push(row);
 }
 assert.equal(JSON.stringify(baseline),original);
 assert.ok(equal(doc.surfaces[1],baseline.surfaces[1]));
 assert.ok(equal(doc.surfaces[0],baseline.surfaces[0]));
 assert.ok(equal(doc.surfaces.slice(3),baseline.surfaces.slice(3)));
 assert.ok(equal(doc.movingObstacles,baseline.movingObstacles));
 assert.ok(equal(doc.route,baseline.route));
 assert.ok(equal(doc.spawns,baseline.spawns));
 assert.ok(equal(s.points.slice(0,5),src.points.slice(0,5)),
   'native connected SCISSOR entry seam u0 frozen');
 assert.ok(equal(s.points.slice(9*5),src.points.slice(9*5)),
   'native downstream full SCISSOR rows9+ frozen');
 assert.ok(tessellate(s).degenerate===0);
 assert.ok(amount===0||maxDelta>5);
 assert.ok(amount===0||changedRows.length>=5);
 doc.name=baseline.name+' R15P '+variant+' SCISSOR physical connection PRIVATE HOLD';
 doc.stageForge={...doc.stageForge,productionPromoted:false,
  r15pSecondRealSourceRoadIsolated:{
   sourceGameBlob:'af076d67492a677d2235e4730aef8cdf4808e106',
   mode:variant,studiedOriginalNativeRoad:'p93-SCISSOR_RISE-01', 
   originalB16CrownPreservedExactly:true,
   originalSCISSORRoadEntryRow0Preserved:true,
   originalSCISSORAfterRow9Preserved:true,
   original28B51FrozenPositionsAndShapes:true,
   sourceRealB48ModifiedRows:changedRows,
   physicalChangedSourceMaximumMetres:round(maxDelta),
   beforeOriginalScissorWidths:widths(src),afterStudyScissorWidths:widths(s),
   trulyRideableGeometryOnly:true,newInvisibleSupports:0,
   realGameProductionPatch:false,actualHumanOrArtPass:false}};
 const valid=validate(doc);
 assert.equal(valid.surfaces.length,7);
 assert.equal(valid.movingObstacles.length,28);
 return valid;
}
export const R15P_VARIANTS=variants;

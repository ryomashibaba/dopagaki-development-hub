/** R15S3D: three actual candidate SCISSOR-late-road release shapes.
 * Preserve FULL real CROWN B16 + SCISSOR early physical lattice rows 0..16;
 * edit source B48 only, no invisible floor, teleport, physics or assist edit.
 * This is geometry research, never official game/art adoption.
 */
import assert from 'node:assert/strict';
import {buildR15S3B} from './p101-r15s3b-isolated-source-trail-aware-scissor-macro-candidates.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
export const R15S3D_MODES=Object.freeze({
 G_SOFT_GRADIENT:Object.freeze({id:'G_SOFT_GRADIENT',forwardShift:0,gradeM:-26,bankM:0,narrow:false,
  hypothesis:'release exaggerated late uphill without changing earlier source touchdown'}),
 H_TANGENT_RELEASE:Object.freeze({id:'H_TANGENT_RELEASE',forwardShift:80,gradeM:-11,bankM:0,narrow:false,
  hypothesis:'move actual late SCISSOR road down existing tangent to reduce turnaround'}),
 I_TANGENT_CANYON:Object.freeze({id:'I_TANGENT_CANYON',forwardShift:115,gradeM:-18,bankM:2.5,narrow:true,
  hypothesis:'tangent elongation and genuine late narrow road, only if real forward speed survives'})
});
const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const len=a=>Math.hypot(...a),sub=(a,b)=>a.map((x,i)=>x-b[i]),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const nrm=a=>a.map(x=>x/(len(a)||1)),round=x=>Number(x.toFixed(5));
function frameTangent(s,at){const a=sample(s,at-1/300,.5),b=sample(s,at+1/300,.5);return nrm([b[0]-a[0],0,b[2]-a[2]]);}
function angleBetween(a,b){return Math.acos(Math.max(-1,Math.min(1,dot(nrm(a),nrm(b)))))*180/Math.PI;}
function boundaryData(scissor,next){
 const a=sample(scissor,1,.5),b=sample(next,0,.5);
 const sdir=sub(sample(scissor,1,.5),sample(scissor,1-1/300,.5));
 const ndir=sub(sample(next,1/300,.5),sample(next,0,.5));
 return {sourceSCISSORExitCenterXYZ:a.map(round),sourceNextRoadEntryCenterXYZ:b.map(round),
  sourceTrueCenterLineGap3DM:round(len(sub(a,b))),
  sourceJoinTangentAngle3D:round(angleBetween(sdir,ndir)),
  trueColliderContactAcrossJunctionVerified:false};
}
export function buildR15S3D(world,mode){
 assert.ok(['true-pinch','pinch-switch'].includes(world));
 assert.ok(Object.hasOwn(R15S3D_MODES,mode));
 const old=buildR15S3B(world,'E_BANKED_LANDING'),doc=structuredClone(old),orig=JSON.stringify(old);
 const spec=R15S3D_MODES[mode],scissor=doc.surfaces[2],before=old.surfaces[2];
 assert.equal(scissor.rows,31);assert.equal(scissor.cols,5);
 const tangent=frameTangent(before,16/30);
 assert.ok(tangent.every(Number.isFinite)&&len(tangent)>.99);
 let rowsChanged=0,maxDisplacement=0;
 for(let row=17;row<=28;row++){
  const t=(row-16)/(29-16),s=Math.sin(Math.PI*t)**2;
  const narrowWeight=spec.narrow?
    Math.max(0,Math.sin(Math.PI*(row-19)/10))**2:0;
  const ctr=before.points[row*5+2],a=before.points[row*5],b=before.points[row*5+4];
  const originalWidth=len([a[0]-b[0],a[2]-b[2]]);
  const ratio=narrowWeight*Math.max(0,1-16/originalWidth);
  if(s<=1e-10)continue;
  rowsChanged++;
  for(let col=0;col<5;col++){
   const p=before.points[row*5+col],across=(col-2)/2;
   const q=[p[0]+tangent[0]*spec.forwardShift*s-(p[0]-ctr[0])*ratio,
    p[1]+spec.gradeM*s+spec.bankM*s*across,
    p[2]+tangent[2]*spec.forwardShift*s-(p[2]-ctr[2])*ratio];
   assert.ok(q.every(Number.isFinite));
   scissor.points[row*5+col]=q;
   maxDisplacement=Math.max(maxDisplacement,len(sub(q,p)));
  }
 }
 assert.equal(rowsChanged,12);
 assert.ok(maxDisplacement>10);
 assert.ok(eq(scissor.points.slice(0,17*5),before.points.slice(0,17*5)));
 assert.ok(eq(scissor.points.slice(29*5),before.points.slice(29*5)));
 assert.ok(eq(doc.surfaces[1],old.surfaces[1]),'CROWN B16 MUST NOT CHANGE');
 assert.ok(eq(doc.surfaces[0],old.surfaces[0]));
 assert.ok(eq(doc.surfaces.slice(3),old.surfaces.slice(3)));
 assert.ok(eq(doc.movingObstacles,old.movingObstacles));
 assert.ok(eq(doc.route,old.route));
 assert.ok(eq(doc.spawns,old.spawns));
 const mesh=tessellate(scissor);assert.equal(mesh.degenerate,0);
 const join=boundaryData(scissor,doc.surfaces[3]);
 assert.equal(JSON.stringify(old),orig);
 assert.equal(doc.surfaces.length,7);assert.equal(doc.movingObstacles.length,28);
 doc.name=old.name+' R15S3D '+mode+' authentic later physical road only';
 doc.stageForge={...doc.stageForge,productionPromoted:false,
  r15s3dPhysicalStudy:{sourceBlob:SHA,world,mode,spec,
   sourcePhysicalChangedB48RoadIds:[scissor.id],sourceChangedSCISSORRows17To28:rowsChanged,
   measuredPeakActualPhysicalLatticeDisplacementM:round(maxDisplacement),
   frozenSCISSOREarlyRows0To16:true,
   frozenCROWNAllRows:true,sourceUnchangedOtherSixRoads:true,
   original28MovingB51Preserved:true,
   originalSourceRouteGuideUnchanged:true,
   originalPhysicsCameraControlsUntouched:true,noAddedColliders:true,
   lateRoadNarrowingAttempted:spec.narrow,
   downstreamRoadBoundarySourceAudit:join,
   supportOrHumanGameCertified:false,webGLRendered:false,officialArt:0,officialSlope2Meters:0,
   ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',RELEASE:'HOLD'}};
 return validate(doc);
}

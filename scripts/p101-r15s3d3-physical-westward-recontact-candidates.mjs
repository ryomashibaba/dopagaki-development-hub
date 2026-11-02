/** R15S3D3: two falsifiable *real* B48 flight/road-recontact candidates.
 * No ghost floors, no changes to original physics, camera, steering or obstacles.
 * The geometry is exploratory. Human viability / aesthetic quality are NOT claimed.
 */
import assert from 'node:assert/strict';
import {buildR15S3B} from './p101-r15s3b-isolated-source-trail-aware-scissor-macro-candidates.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
export const FLIGHT_DESIGNS=Object.freeze({
 L_WESTWARD_SUPPORT: Object.freeze({id:'L_WESTWARD_SUPPORT',bankM:1.0,widthLateM:34,
   anchors:[[11,-861.256,66.521,166.141],[12,-882.56,79.5,171],[14,-923,88,177],[16,-968,96,176],[20,-1094,96,166],[24,-1215,70,151],[28,-1334,38,138],[30,-1394,22,132]],
   hypothesis:'long-radius genuine westward 3D road follows observed >97m/s original free-flight vector, with descending recontact'} ),
 M_LOWER_RECONTACT: Object.freeze({id:'M_LOWER_RECONTACT',bankM:2.0,widthLateM:24,
   anchors:[[11,-861.256,66.521,166.141],[12,-882.56,79,171],[14,-923,85,177],[16,-970,91,175],[20,-1101,87,164],[24,-1222,57,150],[28,-1342,25,136],[30,-1402,12,130]],
   hypothesis:'earlier lower true road support with late narrowed corridor, not any invisible safety collider'} )
});
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const norm=(x,z)=>{const q=Math.hypot(x,z)||1;return [x/q,z/q];};
function centre(anchors,row) {
 for(let i=1;i<anchors.length;i++){
  const a=anchors[i-1],b=anchors[i];
  if(row<=b[0]){const t=(row-a[0])/(b[0]-a[0]);return [a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t,a[3]+(b[3]-a[3])*t];}
 }
 return anchors.at(-1).slice(1);
}
export function buildR15S3D3(world,mode){
 assert.ok(['true-pinch','pinch-switch'].includes(world)&&Object.hasOwn(FLIGHT_DESIGNS,mode));
 const config=FLIGHT_DESIGNS[mode],old=buildR15S3B(world,'E_BANKED_LANDING'),frozen=JSON.stringify(old);
 const doc=structuredClone(old),s=doc.surfaces[2],n=doc.surfaces[3],sc0=old.surfaces[2],n0=old.surfaces[3];
 assert.equal(s.rows,31);assert.equal(s.cols,5);assert.equal(n.rows,31);assert.equal(n.cols,5);
 let largest=0;
 for(let row=12;row<=30;row++){
  const c=centre(config.anchors,row),prev=centre(config.anchors,Math.max(11,row-1)),next=centre(config.anchors,Math.min(30,row+1));
  let [perpX,perpZ]=norm(-(next[2]-prev[2]),next[0]-prev[0]);
  const left=sc0.points[row*5],right=sc0.points[row*5+4];
  const oldWidth=Math.hypot(right[0]-left[0],right[2]-left[2]);
  const [oldPerpX,oldPerpZ]=norm(right[0]-left[0],right[2]-left[2]);
  if(perpX*oldPerpX+perpZ*oldPerpZ<0){perpX=-perpX;perpZ=-perpZ;}
  const blend=smooth((row-12)/4);
  const [nx,nz]=norm(oldPerpX*(1-blend)+perpX*blend,oldPerpZ*(1-blend)+perpZ*blend);
  const pinch=smooth((row-20)/10);
  const width=oldWidth*(1-pinch)+config.widthLateM*pinch;
  for(let col=0;col<5;col++){
   const across=(col-2)/2;
   const q=[c[0]+nx*width*.5*across,c[1]+config.bankM*Math.sin(Math.PI*(row-12)/18)**2*across,c[2]+nz*width*.5*across];
   largest=Math.max(largest,Math.hypot(...q.map((v,i)=>v-sc0.points[row*5+col][i])));
   s.points[row*5+col]=q;
  }
 }
 // The next road's *real* first edge is identical to this true SCISSOR final edge.
 // Shift the existing following B48 control rows back to their original positions
 // by row20. The seam remains explicitly experimental until true CCD passes.
 const shift=[0,1,2].map(i=>s.points[30*5+2][i]-n0.points[2][i]);
 for(let row=0;row<20;row++){
  const fade=1-smooth(row/20);
  for(let col=0;col<5;col++){
   n.points[row*5+col]=row===0?[...s.points[30*5+col]]:
    n0.points[row*5+col].map((v,i)=>v+fade*shift[i]);
  }
 }
 assert.ok(eq(s.points.slice(0,12*5),sc0.points.slice(0,12*5)),'freeze early SCISSOR control rows');
 assert.ok(eq(n.points.slice(20*5),n0.points.slice(20*5)),'freeze downstream next-road rows');
 assert.ok(eq(doc.surfaces[1],old.surfaces[1]),'frozen original B16 CROWN');
 assert.ok(eq(doc.surfaces[0],old.surfaces[0])&&eq(doc.surfaces.slice(4),old.surfaces.slice(4)));
 assert.ok(eq(doc.movingObstacles,old.movingObstacles)&&eq(doc.route,old.route)&&eq(doc.spawns,old.spawns));
 assert.equal(JSON.stringify(old),frozen);
 assert.ok(largest>100,'real macro control-vertex change');
 assert.equal(tessellate(s).degenerate,0);assert.equal(tessellate(n).degenerate,0);
 const a=sample(s,1,.5),b=sample(n,0,.5);
 const seam=Math.hypot(...a.map((v,i)=>v-b[i]));
 assert.ok(seam<1e-4,'real seam centre mismatch');
 doc.name=old.name+' R15S3D3 '+mode+' PRIVATE REAL B48 RECONTACT STUDY';
 doc.stageForge={...doc.stageForge,productionPromoted:false,r15s3d3PhysicalStudy:{
  sourceBlob:SHA,world,mode,studyOnly:true,hypothesis:config.hypothesis,
  changedTruePhysicalB48Sections:[2,3],freezeProvenCROWNEntireSurface:true,
  freezeEarlySCISSORRows0To11:true,originalDynamicB51DefinitionsUnmodified:28,
  originalPhysicsCCDSteeringRouteAndCameraUnmodified:true,actualNativeB48RoadCount:7,
  newHiddenColliders:0,noTeleportOrForceAcceleration:true,actualMaxVertexDisplacementM:Number(largest.toFixed(5)),
  sourceTrueSurfaceNormalAndHumanCollisionContinuityNotVerified:true,
  roadSeamCentrePositionGapM:Number(seam.toFixed(7)),
  originalRouteGuidanceMayNotMatchNewRoad:true,sourceActualWebGL:false,
  officialArt:0,officialSlope2Meters:0,GAMEPLAY:'HOLD',ART:'HOLD',HUMAN:'HOLD',RELEASE:'HOLD'}};
 const valid=validate(doc);assert.equal(valid.surfaces.length,7);assert.equal(valid.movingObstacles.length,28);
 return valid;
}

/** R15S3D6 two distinct, falsifiable REAL B48 physical surface hypotheses.
 * All changes are confined to PRIVATE candidate documents, never source/gameplay.
 * Geometry cannot be certified by a mere intact centre seam.
 */
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {buildR15S3D3} from './p101-r15s3d3-physical-westward-recontact-candidates.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
export const MODES=Object.freeze({
 A_EARLY_DESCENT_SUPPORT: Object.freeze({
  hypothesis:'Actual SCISSOR B48 descends from a high curved crest to meet original descending ball trajectory earlier than R15S3D3 hard landing',
  widthLateM:24, bankM:0.8,
  anchors:[[11,-861.256,66.521,166.141],[12,-883,79,171],[14,-927,93,182],[16,-980,116,196],[18,-1037,133,212],[20,-1094,138,227],[22,-1152,131,239],[24,-1211,104,252],[26,-1268,66,266],[28,-1325,30,280],[30,-1381,16,294]]
 }),
 B_LOW_ANGLE_RECONTACT: Object.freeze({
  hypothesis:'Actual SCISSOR B48 leaves natural flight but follows genuine descent trajectory and lowers first-contact incidence rather than merely extending old landing floor',
  widthLateM:20, bankM:0.45,
  anchors:[[11,-861.256,66.521,166.141],[12,-883,79,171],[14,-927,88,180],[16,-975,102,194],[18,-1033,115,210],[20,-1093,124,226],[22,-1155,119,241],[24,-1217,97,253],[26,-1276,61,267],[28,-1333,29,281],[30,-1390,15,296]]
 })
});
const smooth=x=>{const t=Math.max(0,Math.min(1,x));return t*t*(3-2*t);};
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const norm=(x,z)=>{const d=Math.hypot(x,z)||1;return [x/d,z/d];};
function center(anchors,row){
 for(let i=1;i<anchors.length;i++){
  const a=anchors[i-1],b=anchors[i];
  if(row<=b[0]){
   const k=(row-a[0])/(b[0]-a[0]);
   return [a[1]+k*(b[1]-a[1]),a[2]+k*(b[2]-a[2]),a[3]+k*(b[3]-a[3])];
  }
 }
 return anchors.at(-1).slice(1);
}
export function buildR15S3D6(world,mode){
 assert.ok(['true-pinch','pinch-switch'].includes(world));
 assert.ok(Object.hasOwn(MODES,mode));
 const original=buildR15S3D3(world,'L_WESTWARD_SUPPORT');
 const sourceUnchanged=JSON.stringify(original);
 const doc=structuredClone(original),s=doc.surfaces[2],n=doc.surfaces[3];
 const oldS=original.surfaces[2],oldN=original.surfaces[3],cfg=MODES[mode];
 assert.equal(s.rows,31);assert.equal(s.cols,5);
 assert.equal(n.rows,31);assert.equal(n.cols,5);
 let maxChange=0;
 for(let row=12;row<=30;row++){
  const c=center(cfg.anchors,row);
  const a=center(cfg.anchors,Math.max(11,row-1));
  const b=center(cfg.anchors,Math.min(30,row+1));
  let [px,pz]=norm(-(b[2]-a[2]),b[0]-a[0]);
  const left=oldS.points[row*5],right=oldS.points[row*5+4];
  const [opx,opz]=norm(right[0]-left[0],right[2]-left[2]);
  if(px*opx+pz*opz<0){px=-px;pz=-pz;}
  const blend=smooth((row-12)/4);
  const [nx,nz]=norm((1-blend)*opx+blend*px,(1-blend)*opz+blend*pz);
  const oldWidth=Math.hypot(right[0]-left[0],right[2]-left[2]);
  const pinch=smooth((row-20)/10);
  const width=(1-pinch)*oldWidth+pinch*cfg.widthLateM;
  for(let j=0;j<5;j++){
   const across=(j-2)/2;
   const p=[c[0]+across*width*.5*nx,
    c[1]+across*cfg.bankM*Math.sin(Math.PI*(row-12)/18)**2,
    c[2]+across*width*.5*nz];
   maxChange=Math.max(maxChange,Math.hypot(...p.map((x,k)=>x-oldS.points[row*5+j][k])));
   s.points[row*5+j]=p;
  }
 }
 // A real continuation of the final SCISSOR B48 ribbon, followed by a smooth
 // transition back to the untouched original LOWER_REVERSAL rows 20..30.
 // Do not only match the centre point: align the entire seam and early tangent.
 for(let row=0;row<20;row++)for(let j=0;j<5;j++){
  if(row===0){n.points[j]=[...s.points[30*5+j]];continue;}
  const end=s.points[30*5+j],prev=s.points[29*5+j];
  const extension=end.map((v,k)=>v+row*(v-prev[k]));
  const fade=row<=4?1:1-smooth((row-4)/16);
  const previous=oldN.points[row*5+j];
  n.points[row*5+j]=previous.map((v,k)=>v*(1-fade)+extension[k]*fade);
 }
 assert.ok(eq(s.points.slice(0,12*5),oldS.points.slice(0,12*5)),'SCISSOR pre-contact origin changed');
 assert.ok(eq(n.points.slice(20*5),oldN.points.slice(20*5)),'downstream non-target B48 changed');
 assert.ok(eq(doc.surfaces[1],original.surfaces[1]),'known CROWN B16 changed');
 assert.ok(eq(doc.surfaces[0],original.surfaces[0])&&eq(doc.surfaces.slice(4),original.surfaces.slice(4)),'other B48 changed');
 assert.ok(eq(doc.movingObstacles,original.movingObstacles),'original moving B51 changed');
 assert.ok(eq(doc.route,original.route)&&eq(doc.routeSegments,original.routeSegments),'real guide modified');
 assert.ok(eq(doc.spawns,original.spawns),'original spawns changed');
 assert.equal(JSON.stringify(original),sourceUnchanged,'builder mutated input');
 assert.ok(maxChange>10,'candidate is not actual new physical geometry');
 const first=sample(s,1,.5),second=sample(n,0,.5);
 const seam=Math.hypot(...first.map((x,i)=>x-second[i]));
 assert.ok(seam<.00001,'REAL end-to-start physical B48 seam disconnected');
 for(let j=0;j<5;j++)for(let k=0;k<3;k++)assert.ok(Math.abs(s.points[30*5+j][k]-n.points[j][k])<1e-8);
 const topS=tessellate(s),topN=tessellate(n);
 assert.equal(topS.degenerate,0,'SCISSOR generated degenerate physical triangles');
 assert.equal(topN.degenerate,0,'LOWER generated degenerate physical triangles');
 const hashes=doc.surfaces.slice(2,4).map(x=>crypto.createHash('sha256').update(JSON.stringify(x.points)).digest('hex'));
 doc.name=original.name+' R15S3D6 '+mode+' REAL B48 HOLD';
 doc.stageForge={...doc.stageForge,productionPromoted:false,r15s3d6:{
  schema:'R15S3D6-real-B48-candidate/1',mode,world,studyOnly:true,
  hypothesis:cfg.hypothesis,actualPhysicalEditedSections:[2,3],sourceBlob:SHA,
  originalCrownB16AndEarlySCISSORPreserved:true,originalB51Count:28,
  physicsSteeringGuideCameraChanged:false,hiddenPhysicalColliders:0,
  seamXYZM:seam,firstFourNextRowsHaveContinuedTangent:true,
  maxOriginalSCISSORVertexDisplacementM:+maxChange.toFixed(6),
  actualChangedB48ControlPointHashes:hashes,
  actualWebGLPassed:false,humanFairnessCertified:false,officialArt:0,officialSlope2Meters:0,
  GAMEPLAY:'HOLD',ART:'HOLD',HUMAN:'HOLD',RELEASE:'HOLD'}};
 const valid=validate(doc);
 assert.equal(valid.surfaces.length,7);
 assert.equal(valid.movingObstacles.length,28);
 return valid;
}

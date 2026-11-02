/**
 * G4E-7BO — NATIVE CAMERA FRAMED BREAKWATER CITADEL
 *
 * Architectural geometry is exactly BN's, recomposed in REAL world space:
 * compare actual BN GLB vertices (not its parent BM's unrelated hollow tube).
 * Search fixed translations projected into all three BG 240Hz native snapshots.
 * No fake perspective, lens/camera/speed/collision changes. PRIVATE ONLY.
 *
 * Deliberately ART HOLD even if normalized framing metrics pass.
 */
import {generateBNModel} from './p101-w9c2-g4e7bn-breakwater-citadel-author.mjs';
import {glbFromTriangles,BK_MATERIALS} from './p101-w9c2-g4e7bk-glb-author.mjs';
import {parseBKGLB} from '../web/p101-w9c2-g4e7bk-lit-glb.mjs';
import {sample} from '../private/reference_only/director/surface.js';

const ASPECT=928/540,FOCAL=1.35;
const add=(a,b)=>a.map((x,i)=>x+b[i]),sub=(a,b)=>a.map((x,i)=>x-b[i]),
 mul=(a,n)=>a.map(x=>x*n),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),
 cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],
 unit=a=>mul(a,1/(Math.hypot(...a)||1)),rnd=n=>Number(n.toFixed(4));
function view(f){
 const front=unit(f.front),right=unit(cross(front,[0,1,0])),up=unit(cross(right,front));
 return {eye:f.eye,front,right,up,id:f.id,speedMps:f.speedMps};
}
function project(p,c){
 const d=sub(p,c.eye),z=dot(d,c.front);
 if(z<3)return null;
 return {x:FOCAL*dot(d,c.right)/(ASPECT*z),
  y:FOCAL*dot(d,c.up)/z,z};
}
function visualStats(verts,c,translation){
 const pts=[];let roadRegion=0,close=0;
 for(const pos of verts){
  const p=project(add(pos,translation),c);
  if(!p||Math.abs(p.x)>1||Math.abs(p.y)>1)continue;
  pts.push(p);
  if(p.x>-.24&&p.x<.57&&p.y>-.82&&p.y<.10)roadRegion++;
  if(p.z<130)close++;
 }
 if(!pts.length)return {fraction:0,box:null,width:0,height:0,roadRegionFraction:1,nearFraction:1};
 const xs=pts.map(p=>p.x).sort((a,b)=>a-b),ys=pts.map(p=>p.y).sort((a,b)=>a-b);
 const q=(a,f)=>a[Math.floor((a.length-1)*f)];
 const b=[q(xs,.07),q(ys,.07),q(xs,.93),q(ys,.93)];
 return {fraction:rnd(pts.length/verts.length),box:b.map(rnd),
  width:rnd(b[2]-b[0]),height:rnd(b[3]-b[1]),
  roadRegionFraction:rnd(roadRegion/pts.length),nearFraction:rnd(close/pts.length)};
}
function nearestRoad(verts,translation,roads){
 let min=Infinity;
 for(let j=0;j<verts.length;j+=6){
  const p=add(verts[j],translation);
  for(const q of roads){
   const d=Math.hypot(p[0]-q[0],p[2]-q[2]);
   if(d<min)min=d;
  }
 }
 return min;
}
function cityScore(verts,views,shift,roads){
 const stats=views.map(v=>visualStats(verts,v,shift));
 const roadClearance=nearestRoad(verts,shift,roads);
 let score=0;
 for(const s of stats){
  if(!s.box){score-=3;continue;}
  const legible=Math.min(1,s.width/.72)*Math.min(1,s.height/.72);
  score+=3.5*s.fraction+2.0*legible-1.6*s.roadRegionFraction-
   .7*s.nearFraction-.30*Math.max(0,s.width-1.25);
 }
 if(roadClearance<65)score-=4+(65-roadClearance)*.13;
 const low=stats.filter(x=>x.fraction<.1).length;
 score-=low*2;
 return {score,stats,roadClearance};
}
function place(c,z,x,y){
 return add(add(add(c.eye,mul(c.front,z)),mul(c.right,x*ASPECT*z/FOCAL)),
  mul(c.up,y*z/FOCAL));
}
export function generateBOModel(doc,native){
 const bc=doc?.stageForge?.g4e7bcStudy;
 const f=native?.stages?.[bc?.road]?.frames;
 if(bc?.id!=='bank-grade-contour'||bc.variant!=='rollDeck'||
  !['true-pinch','pinch-switch'].includes(bc.road)||
  doc.stageForge.productionPromoted!==false||bc.publish!=='HOLD'||
  bc.formalSlope2Meters!==0||doc.surfaces?.length!==7||
  doc.movingObstacles?.length!==28||
  doc.surfaces[0].voidLongitudinalCells?.join(',')!=='52'||
  native.physicsHz!==240||!Array.isArray(f)||f.length!==3||
  f.some(x=>x.source!=='ACTUAL_240HZ_START00_P96_FIXED_SCRIPT_NOT_HUMAN'||
   x.speedMps<85))
  throw Error('BO requires three real 240Hz frames and canonical BC');
 const frozen=JSON.stringify(doc);
 const old=generateBNModel(doc,native);
 const buf=old.glb.buffer.slice(old.glb.byteOffset,old.glb.byteOffset+old.glb.byteLength);
 const parsed=parseBKGLB(buf,{expectedRoad:bc.road});
 if(parsed.meta.visualCandidate!=='G4E-7BN-BREAKWATER-CITADEL'||
   parsed.meta.inhabitedTowers!==5||parsed.meta.asymmetricCanopyWings!==2)
  throw Error('BO only recomposes BN authored inhabited citadel, never BM tube');
 const vertexCount=parsed.primitives.reduce((n,p)=>n+p.vertices,0),verts=[];
 const stride=Math.max(1,Math.floor(vertexCount/1100));
 let index=0;
 for(const prim of parsed.primitives)for(let i=0;i<prim.vertices;i++,index++)
  if(index%stride===0)verts.push(Array.from(prim.data.subarray(i*6,i*6+3)));
 if(verts.length<500)throw Error('BO insufficient original urban vertices');
 const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
 for(const p of verts)for(let k=0;k<3;k++){
  min[k]=Math.min(min[k],p[k]);max[k]=Math.max(max[k],p[k]);
 }
 const center=min.map((x,k)=>(x+max[k])/2);
 const views=f.map(view),anchor=views[2];
 const roads=Array.from({length:31},(_,i)=>sample(doc.surfaces[1],i/30,.5));
 const before=cityScore(verts,views,[0,0,0],roads);
 let chosen={shift:[0,0,0],...before,aim:null,depthMeters:null};
 // Native actual camera, NOT a bespoke cinematic viewpoint. Sample roughly
 // upper-left camera field, where the existing 100m/s physical road remains
 // fully playable and right-center obstacle readability takes precedence.
 for(const z of [420,580,760,950,1180]){
  for(const x of [-.80,-.64,-.47,-.30,-.12,.08]){
   for(const y of [-.06,.09,.23,.38]){
    const shift=sub(place(anchor,z,x,y),center);
    const result=cityScore(verts,views,shift,roads);
    if(result.roadClearance<55||
       result.stats.filter(s=>s.fraction>.08).length<2)continue;
    if(result.score>chosen.score)
     chosen={shift,...result,aim:[x,y],depthMeters:z};
   }
  }
 }
 if(!Number.isFinite(chosen.score)||chosen.score<before.score-1e-7)
  throw Error('BO registration never worsens same-camera geometry visibility');
 const t=BK_MATERIALS.map(()=>[]);
 for(const p of parsed.primitives){
  for(let i=0;i<p.vertices;i++){
   const base=i*6,vertex=Array.from(p.data.subarray(base,base+3)),
    normal=Array.from(p.data.subarray(base+3,base+6));
   t[p.material].push(...add(vertex,chosen.shift),...normal);
  }
 }
 if(JSON.stringify(doc)!==frozen)
  throw Error('BO mutated B48/B51 source');
 const meta={...parsed.meta,visualCandidate:'G4E-7BO-FRAMED-BREAKWATER-CITADEL',
  framingSource:'BN_GLTF_VERTEX_PROJECTION_NOT_BM_TUBE',
  cameraTarget:'GENUINE_BG_240HZ_P96_NOT_HUMAN',
  authoring:'SCRIPTED_REAL_3D_NOT_BLENDER',
  sameGeometryTriangles:parsed.triangles,
  modelWorldOffset:chosen.shift.map(rnd),
  beforeProjection:before.stats,
  afterProjection:chosen.stats,
  beforeScore:rnd(before.score),afterScore:rnd(chosen.score),
  roadClearanceMeters:rnd(chosen.roadClearance),
  nativeAim:chosen.aim,nativeDepthMeters:chosen.depthMeters,
  formalVisualApproval:false,artApproval:'HOLD',publication:'HOLD'};
 return glbFromTriangles(t,meta);
}

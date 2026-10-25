/**
 * G4E-7CB | ART-FIRST QUICK NATIVE FRUSTUM PREFLIGHT.
 * Reuses EXISTING 7BG authentic START00/240Hz scripted camera evidence;
 * never resets player position, creates visual game scenes, or certifies art.
 *
 * Input: independently built/owned GLB, NOT necessarily our rejected CA.
 * Geometry must be referenced through glTF scene nodes and world transforms.
 * Output: camera visibility / rough screen placement warnings, not beauty scores.
 * EXACT same renderer appearance, occlusion, road clearance, human play:
 * NOT VERIFIED. The actual WebGL/screenshots remain the required next gate.
 */
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import {g4e7bgNativeFrames} from './p101-w9c2-g4e7bg-native-visual-frames.mjs';

const clean=n=>Number(n.toFixed(4));
const sane=a=>Array.isArray(a)&&a.every(Number.isFinite);
const ident=()=>[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
function mul(A,B){
 const C=new Array(16).fill(0);
 for(let col=0;col<4;col++)for(let row=0;row<4;row++)
  for(let k=0;k<4;k++)C[col*4+row]+=A[k*4+row]*B[col*4+k];
 return C;
}
function move(v,M){
 const w=M[3]*v[0]+M[7]*v[1]+M[11]*v[2]+M[15];
 if(!Number.isFinite(w)||Math.abs(w)<1e-8)throw Error('CB invalid homogeneous transform');
 return [(M[0]*v[0]+M[4]*v[1]+M[8]*v[2]+M[12])/w,
         (M[1]*v[0]+M[5]*v[1]+M[9]*v[2]+M[13])/w,
         (M[2]*v[0]+M[6]*v[1]+M[10]*v[2]+M[14])/w];
}
export function nodeMatrix(n){
 if(n.matrix){
  if(n.translation||n.rotation||n.scale||n.matrix.length!==16||!sane(n.matrix))
   throw Error('CB illegal glTF matrix/TRS combination');
  return n.matrix;
 }
 const [tx,ty,tz]=n.translation??[0,0,0],
       [sx,sy,sz]=n.scale??[1,1,1],
       [x,y,z,w]=n.rotation??[0,0,0,1];
 if(!sane([tx,ty,tz,sx,sy,sz,x,y,z,w]))throw Error('CB nonfinite glTF transform');
 const q=x*x+y*y+z*z+w*w;
 if(q<1e-12)throw Error('CB glTF zero quaternion');
 const k=2/q,xx=x*x*k,yy=y*y*k,zz=z*z*k,xy=x*y*k,xz=x*z*k,yz=y*z*k,
       wx=w*x*k,wy=w*y*k,wz=w*z*k;
 return [(1-yy-zz)*sx,(xy+wz)*sx,(xz-wy)*sx,0,
         (xy-wz)*sy,(1-xx-zz)*sy,(yz+wx)*sy,0,
         (xz+wy)*sz,(yz-wx)*sz,(1-xx-yy)*sz,0,
         tx,ty,tz,1];
}
export function sceneCorners(bytes){
 const b=Buffer.isBuffer(bytes)?bytes:Buffer.from(bytes);
 if(b.length<32||b.length>150*1024*1024||b.toString('ascii',0,4)!=='glTF'||
    b.readUInt32LE(4)!==2||b.readUInt32LE(8)!==b.length)
    throw Error('CB actual binary glTF2 GLB required');
 if(b.readUInt32LE(16)!==0x4e4f534a)throw Error('CB GLB JSON chunk missing');
 const size=b.readUInt32LE(12),g=JSON.parse(b.subarray(20,20+size).toString('utf8').trim());
 if(g.asset?.version!=='2.0'||!Array.isArray(g.meshes)||!Array.isArray(g.nodes)||
    !Array.isArray(g.accessors)||g.meshes.length<1)
   throw Error('CB glTF scene/mesh/accessor missing');
 const nodes=g.nodes,scene=g.scenes?.[g.scene??0];
 if(!scene||!Array.isArray(scene.nodes))throw Error('CB explicit glTF scene roots required');
 const corners=[],visited=new Set(),stack=new Set(),MAX_CORNERS=120000;
 let meshes=0,components=0;
 const bound=accessor=>{
  const min=accessor?.min,max=accessor?.max;
  if(!sane(min)||!sane(max)||min.length!==3||max.length!==3||
     max.some((x,i)=>x<min[i]))throw Error('CB POSITION accessor bounds required from actual glTF');
  return [min,max];
 };
 function traverse(id,parent,depth){
  if(depth>100||stack.has(id)||!Number.isInteger(id)||!nodes[id])
   throw Error('CB invalid glTF scene graph');
  stack.add(id);const node=nodes[id],world=mul(parent,nodeMatrix(node));
  if(Number.isInteger(node.mesh)){
   const mesh=g.meshes[node.mesh];
   if(!mesh?.primitives?.length)throw Error('CB scene mesh primitive missing');
   meshes++;
   for(const p of mesh.primitives){
    const index=p.attributes?.POSITION;
    if(!Number.isInteger(index))throw Error('CB POSITION missing');
    const [lo,hi]=bound(g.accessors[index]);components++;
    for(let i=0;i<8;i++){
     const pt=move([i&1?hi[0]:lo[0],i&2?hi[1]:lo[1],i&4?hi[2]:lo[2]],world);
     if(!sane(pt))throw Error('CB nonfinite geometry');
     corners.push(pt);
     if(corners.length>MAX_CORNERS)throw Error('CB too many bounding corners for quick gate');
    }
   }
  }
  for(const child of node.children??[])traverse(child,world,depth+1);
  stack.delete(id);visited.add(id);
 }
 for(const id of scene.nodes)traverse(id,ident(),0);
 if(!corners.length)throw Error('CB GLB scene contains no visible mesh');
 const min=[0,1,2].map(i=>Math.min(...corners.map(p=>p[i]))),
       max=[0,1,2].map(i=>Math.max(...corners.map(p=>p[i]))),
       center=min.map((x,i)=>(x+max[i])/2);
 return {points:corners,model:{worldAABB:{min:min.map(clean),max:max.map(clean),
  span:max.map((v,i)=>clean(v-min[i]))},center:center.map(clean),meshInstances:meshes,
  geometricPrimitives:components,corners:corners.length}};
}
const plus=(a,b)=>a.map((v,i)=>v+b[i]),sub=(a,b)=>a.map((v,i)=>v-b[i]),
      dot=(a,b)=>a.reduce((t,v,i)=>t+v*b[i],0),
      cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],
      norm=a=>{const n=Math.hypot(...a);return n?a.map(v=>v/n):[0,0,0];};
const FOCAL=1.35,ASPECT=928/540,NEAR=3.0;
export function cameraGeometry(points,frame,translation=[0,0,0]){
 if(!sane(frame.eye)||!sane(frame.front)||frame.eye.length!==3||
    frame.front.length!==3||!sane(translation)||translation.length!==3)
  throw Error('CB genuine camera geometry missing');
 const forward=norm(frame.front),right=norm(cross(forward,[0,1,0])),
       up=norm(cross(right,forward));
 if(Math.hypot(...right)<.5)throw Error('CB vertical camera not calibrated');
 let inview=0,inRoad=0,near=0,behind=0;
 const visibleX=[],visibleY=[],depths=[];
 for(const v of points){
  const d=sub(plus(v,translation),frame.eye),z=dot(d,forward);
  if(z<NEAR){behind++;continue}
  const x=FOCAL*dot(d,right)/(ASPECT*z),y=FOCAL*dot(d,up)/z;
  if(Math.abs(x)>1||Math.abs(y)>1)continue;
  inview++;visibleX.push(x);visibleY.push(y);depths.push(z);
  if(x>-.25&&x<.57&&y>-.82&&y<.12)inRoad++;
  if(z<130)near++;
 }
 let bounds=null;
 if(inview){
  bounds=[Math.min(...visibleX),Math.min(...visibleY),Math.max(...visibleX),Math.max(...visibleY)].map(clean);
 }
 return {frame:frame.id,timeSeconds:frame.timeSeconds,speedMps:frame.speedMps,
  visibleCorners:inview,totalCorners:points.length,
  visibleFraction:clean(inview/points.length),
  onScreenBounds:bounds,
  roadWindowCornerFraction:inview?clean(inRoad/inview):0,
  dangerouslyNearCameraCornerFraction:inview?clean(near/inview):0,
  invisibleOrNearCorners:behind};
}
export function nativeAssetPreflight(bytes,native,{anchorDepth=660,xField=-.55,yField=.2}={}){
 if(native?.physicsHz!==240||native?.camera!=='UNCHANGED_ORIGINAL_BALL_RELATIVE_NATIVE'||
  !native?.stages?.['true-pinch']||!native?.stages?.['pinch-switch'])
  throw Error('CB authentic BG 240Hz source required, not fake studio pose');
 const {points,model}=sceneCorners(bytes);
 if(![anchorDepth,xField,yField].every(Number.isFinite)||anchorDepth<100)
  throw Error('CB invalid candidate placement');
 const anchor=native.stages['true-pinch'].frames[2],v=norm(anchor.front),
       right=norm(cross(v,[0,1,0])),up=norm(cross(right,v));
 const desired=plus(plus(plus(anchor.eye,v.map(x=>x*anchorDepth),
          right.map(x=>x*(xField*ASPECT*anchorDepth/FOCAL))),
          up.map(x=>x*yField*anchorDepth/FOCAL)),[0,0,0]);
 const offset=sub(desired,model.center);
 const frames=[];
 for(const road of ['true-pinch','pinch-switch']){
  const s=native.stages[road];
  if(s.actualB48!==7||s.actualMovingB51!==28||!s.originalGapCell52||
      s.frames.length!==3||s.frames.some(f=>f.source!=='ACTUAL_240HZ_START00_P96_FIXED_SCRIPT_NOT_HUMAN'||f.speedMps<85))
      throw Error('CB original protected BC start00 camera mismatch');
  for(const frame of s.frames)frames.push({road,...cameraGeometry(points,frame,offset)});
 }
 const shown=frames.filter(f=>f.visibleFraction>.04).length;
 const flags=[];
 if(shown<2)flags.push('NEAR_INVISIBLE_IN_GENUINE_HIGH_SPEED_CAMERA');
 if(frames.some(f=>f.roadWindowCornerFraction>.55))
  flags.push('POSSIBLE_ROAD_CENTER_OBSTRUCTION_NEEDS_TRUE_WEBGL');
 if(frames.some(f=>f.dangerouslyNearCameraCornerFraction>.25))
  flags.push('POSSIBLE_FOREGROUND_CLIP_NEEDS_TRUE_WEBGL');
 if(model.worldAABB.span.some(s=>s>2000))
  flags.push('MODEL_WORLD_DIMENSION_ABOVE_2KM_CHECK_ORIGINAL_SCALE');
 if(frames.some(f=>!f.onScreenBounds))
  flags.push('AT_LEAST_ONE_REAL_CAMERA_WITHOUT_VISIBLE_ASSET');
 return {schema:'dopagaki.g4e7cb-preflight/1',
   method:'glTF2 WORLD_NODE_AABB_CORNERS_PROJECTED_ON_EXISTING_BG_NATIVE_P96_240HZ',
   target:'G4E7CA EXISTING REJECTED ART AS NEGATIVE CONTROL' ,
   source:'EXISTING_BG_SCRIPTED_240HZ_START00_NOT_HUMAN',
   authoring:'READ_ONLY_NO_GEOMETRY_CHANGES',model,
   proposalOnly:{translation:offset.map(clean),anchorDepth,xField,yField},
   views:frames,flags,
   limitations:['AABB corners are not rendered pixels or silhouette area',
      'transparency, occlusion, material readability and depth not verified',
      'not an actual WebGL renderer / requires real Playwright comparison',
      'not collision detection, road clearance or human driving'],
   actualWebGL:'NOT_TESTED',human:'HOLD',art:'REJECTED_CONTROL_NOT_ART_PASS',
   publicRelease:'FORBIDDEN',officialSlope2Meters:0,merge:'HOLD'};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const file=process.argv[2],out=process.argv[3];
 if(!file)throw Error('Usage: node scripts/p101-w9c2-g4e7cb-native-asset-preflight.mjs candidate.glb [report.json]');
 const result=nativeAssetPreflight(fs.readFileSync(file),g4e7bgNativeFrames());
 const payload=JSON.stringify(result,null,2)+'\n';
 if(out)fs.writeFileSync(out,payload);else process.stdout.write(payload);
}

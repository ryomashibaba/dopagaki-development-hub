/**
 * R19 A6 P3 — READ-ONLY genuine source camera / B51 OBB-projection probe.
 * Called inside the copied PRIVATE original WebGL2 renderer immediately
 * after viewForPose. Uses the same eye, right, up, front and 1.35 GLSL
 * perspective coefficient as the original. NEVER changes camera/physics.
 * OBB projection is geometry-only; not actual visible B51 pixel coverage.
 */
const dot=(a,b)=>a.reduce((s,v,k)=>s+v*b[k],0);
const sub=(a,b)=>a.map((v,k)=>v-b[k]);
const norm=a=>Math.hypot(...a);
const round=n=>Math.round(n*1e6)/1e6;
const vround=v=>v.map(round);
const GL_FOCAL=1.35;
export function sourceP3Projection(view,point,width,height){
 const w=sub(point,view.eye),depth=dot(w,view.front),aspect=width/height;
 if(depth<=0.66)return null; // source near clip around .65 m
 const x=GL_FOCAL*dot(w,view.right)/aspect/depth;
 const y=GL_FOCAL*dot(w,view.up)/depth;
 return {x,y,depth};
}
function sourceOBBCorners(p){
 const out=[],c=Math.cos(p.yawRadians),s=Math.sin(p.yawRadians);
 for(const xx of [-1,1])for(const yy of [-1,1])for(const zz of [-1,1]){
  const x=xx*p.halfSize[0],y=yy*p.halfSize[1],z=zz*p.halfSize[2];
  out.push([p.center[0]+c*x+s*z,p.center[1]+y,p.center[2]-s*x+c*z]);
 }
 return out;
}
export function sourceP3ReadOnlyActualFrame(doc,runner,displayPose,view,width,height,poseAt){
 if(!doc||!runner||!displayPose||!view||doc.surfaces.length!==7||doc.movingObstacles.length!==28)
  throw Error('P3 must use original B48 x7 and B51 x28');
 if(!Number.isInteger(width)||!Number.isInteger(height)||width<300||height<200)
  throw Error('P3 actual viewport absent');
 for(const key of ['eye','front','right','up']){
  if(!Array.isArray(view[key])||view[key].length!==3||
      view[key].some(n=>!Number.isFinite(n)))throw Error('P3 original camera basis incomplete '+key);
 }
 for(const key of ['front','right','up'])if(Math.abs(norm(view[key])-1)>.007)
  throw Error('P3 basis normalization invalid');
 if(Math.abs(dot(view.front,view.up))>.01||Math.abs(dot(view.front,view.right))>.01||
    Math.abs(dot(view.right,view.up))>.01)throw Error('P3 basis orthogonality invalid');
 const t=displayPose.time, hazards=[];
 for(const obj of doc.movingObstacles){
  const pose=poseAt(obj,t);
  if(!pose.enabled){hazards.push({id:obj.id,enabled:false});continue;}
  const corners=sourceOBBCorners(pose);
  const proj=corners.map(p=>sourceP3Projection(view,p,width,height));
  const finite=proj.filter(Boolean);
  const center=sourceP3Projection(view,pose.center,width,height);
  const fullyInFront=finite.length===8;
  let bbox=null;
  if(fullyInFront){
   bbox={xMin:Math.min(...finite.map(p=>p.x)),xMax:Math.max(...finite.map(p=>p.x)),
    yMin:Math.min(...finite.map(p=>p.y)),yMax:Math.max(...finite.map(p=>p.y))};
  }
  const intersectsFrame=!!bbox&&bbox.xMax>=-1&&bbox.xMin<=1&&bbox.yMax>=-1&&bbox.yMin<=1;
  hazards.push({id:obj.id,enabled:true,sourceType:obj.type,centerWorld:vround(pose.center),
   yawRadians:round(pose.yawRadians),worldHalfSize:vround(pose.halfSize),
   fullyBeforeNearPlane:finite.length===0,partlyClippedByNearPlane:!fullyInFront,
   centerNDC:center?{x:round(center.x),y:round(center.y),depthM:round(center.depth)}:null,
   conservativeOBBProjectionBBoxNDC:bbox?Object.fromEntries(Object.entries(bbox).map(([k,v])=>[k,round(v)])):null,
   fullOBBBoundsIntersectScreen:intersectsFrame,
   actuallyUnoccludedPixels:'NOT_MEASURED'});
 }
 return {schema:'dopagaki.r19a6p3-actual-renderer-camera-obb/1',origin:'viewForPose ORIGINAL WebGL2 during scripted 240Hz',
  sourceBlob:'af076d67492a677d2235e4730aef8cdf4808e106',
  viewport:{width,height,aspect:round(width/height),glslFocal:GL_FOCAL,
   verticalFovDeg:round(2*Math.atan(1/GL_FOCAL)*180/Math.PI),
   horizontalFovDeg:round(2*Math.atan(width/height/GL_FOCAL)*180/Math.PI)},
  eye:vround(view.eye),front:vround(view.front),right:vround(view.right),up:vround(view.up),
  nativeTick:Number(document.querySelector('#view')?.dataset?.r19a1NativeTicks||-1),
  sourceRenderPoseTimeS:round(t),
  hazards,
  sourceB48:7,sourceB51:28,addedColliders:0,
  B51RasterVisibility:'UNTESTED',ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD'};
}

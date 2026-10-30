/** R15S3D10 PRIVATE view-only B51 cue that measures actual original OBB.
 * It NEVER rewrites original moving hazard geometry, physics, phase, route,
 * camera or controls. "On screen" is projected FoV candidate, NOT occlusion.
 */
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const hypot=a=>Math.hypot(...a);
const n=x=>Math.round(x);
export function originalB51TrueSpatialCue(doc,runner,view,poseAt,separate,ballRadius=.65){
 if(!doc||!runner||!view||doc.movingObstacles?.length!==28)throw Error('R15S3D10 requires exactly 28 original moving B51');
 if(!Number.isFinite(runner.time)||!Array.isArray(runner.p)||!Array.isArray(view.front))throw Error('R15S3D10 wrong original pose');
 let closest=null,inFrame=0,allWithin120=0;
 for(const ob of doc.movingObstacles){
  const pose=poseAt(ob,runner.time);
  if(!pose.enabled)continue;
  const separation=separate(runner.p,ballRadius,pose).separation;
  if(!Number.isFinite(separation))continue;
  const relEye=sub(pose.center,view.eye),depth=dot(relEye,view.front);
  const x=depth>0?1.35*dot(relEye,view.right)/(1.55*depth):Infinity;
  const y=depth>0?1.35*dot(relEye,view.up)/depth:Infinity;
  const centreForward=dot(sub(pose.center,runner.p),runner.forward);
  const roughlyVisible=depth>0&&Math.abs(x)<1&&Math.abs(y)<1;
  if(roughlyVisible)inFrame++;
  if(centreForward>0&&separation<120)allWithin120++;
  // Screen FOV checks are projections of physical OBB centres, do not
  // assert actual pixel visibility, hide nothing, and never invent an ETA.
  if(!roughlyVisible||centreForward<0||separation>120)continue;
  const candidate={id:ob.id,mode:ob.collision?.mode??'fail',
   actualBoxSurfaceSeparationM:separation,worldForwardCentreM:centreForward,
   cameraNormalizedX:x,cameraNormalizedY:y,worldCentreDistanceM:hypot(sub(pose.center,runner.p))};
  if(!closest||candidate.actualBoxSurfaceSeparationM<closest.actualBoxSurfaceSeparationM)closest=candidate;
 }
 const result={physicallyAuthoredB51:28,estimatedFovBodyCenters:inFrame,
   futureCurrentPositionOnly:true,occlusionUntested:true,originalSourceObjectsUnchanged:true,
   next:closest};
 const body=!closest?'進行方向の近接動体なし · 物理28基そのまま（遮蔽は未判定）':
  '実B51 '+closest.id+' · 球表面から '+n(Math.max(0,closest.actualBoxSurfaceSeparationM))+
   'm · '+(closest.cameraNormalizedX<-.15?'画面左':closest.cameraNormalizedX>.15?'画面右':'画面中央')+
   ' · 投影推定（衝突/視認の保証なし）';
 return {...result,message:body};
}

/** PRIVATE R15S3D11 SOURCE physical B48 path-distance warning, not camera
 * visibility, impact prediction, automated steering or B51 modification.
 * Geometric progress measures REAL current B48 centreline even when the
 * unmodified authored route/guide has diverged from the edited B48.
 */
const cache=new WeakMap();
const dot=(a,b)=>a.reduce((sum,x,i)=>sum+x*b[i],0);
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const mag=x=>Math.hypot(...x);
function linear(track,point){
 let best={distance:Infinity,metres:0,u:0};
 for(let i=1;i<track.samples.length;i++){
  const a=track.samples[i-1],b=track.samples[i],d=sub(b,a);
  const t=Math.max(0,Math.min(1,dot(sub(point,a),d)/(dot(d,d)||1)));
  const pos=a.map((x,j)=>x+t*d[j]),distance=mag(sub(pos,point));
  if(distance<best.distance)best={distance,metres:track.lengths[i-1]+
   t*(track.lengths[i]-track.lengths[i-1]),u:(i-1+t)/(track.samples.length-1)};
 }
 return best;
}
function roadTrack(doc,index,sample){
 let saved=cache.get(doc);
 if(!saved){saved={};cache.set(doc,saved);}
 if(!saved[index]){
  const samples=Array.from({length:151},(_,i)=>sample(doc.surfaces[index],i/150,.5));
  const lengths=[0];for(let i=1;i<samples.length;i++)lengths.push(lengths.at(-1)+mag(sub(samples[i],samples[i-1])));
  saved[index]={samples,lengths,totalMetres:lengths.at(-1)};
 }
 return saved[index];
}
export function actualOriginalRoadAheadB51Cue(doc,runner,sample,poseAt,separation,maxRoadMetres=650){
 if(!doc||!runner||!Array.isArray(doc.surfaces)||!Array.isArray(doc.movingObstacles)||typeof sample!=='function')
  throw Error('R15S3D11 requires real stage and original surface sampling');
 const study=doc.stageForge?.r15s3d11;
 if(study?.changedMachines?.length!==6)return null;
 const roadIndex=doc.surfaces.findIndex(s=>s.id===(runner.surface||runner.lastSurface));
 if(roadIndex<4||roadIndex>6)return null; // only native lower-to-finish sector
 const track=roadTrack(doc,roadIndex,sample),where=linear(track,runner.p);
 if(where.distance>70)return null; // do not issue authoritative physical route claims from a remote airborne ball
 let nearest=null;
 for(const a of study.changedMachines){
  if(a.roadIndex<roadIndex||a.roadIndex>6)continue;
  let along=-where.metres;
  for(let i=roadIndex;i<=a.roadIndex;i++){
   const lane=roadTrack(doc,i,sample);
   along+=i===a.roadIndex?lane.totalMetres*a.u:lane.totalMetres;
  }
  if(along<0||along>maxRoadMetres)continue;
  const ob=doc.movingObstacles.find(x=>x.id===a.id);
  if(!ob||!ob.enabled)continue;
  const pose=poseAt(ob,runner.time),physicalSeparation=separation(runner.p,.65,pose).separation;
  if(!Number.isFinite(physicalSeparation))continue;
  const variant=a.laneV<.3?'左側路肩':a.laneV>.7?'右側路肩':
   a.laneV<.5?'左寄り車線':'右寄り車線';
  const result={id:ob.id,alongActualB48RoadMetres:along,
   originalB51AtCurrentTimeSeparationM:physicalSeparation,authoredLaneV:a.laneV,
   variant,sourceRoadIndex:a.roadIndex,currentRoadIndex:roadIndex,
   ballOffRealRoadCenterM:where.distance,
   notPredictedCollision:true,notPixelVisibilityOrOcclusion:true,
   noGuaranteedETA:true,noControlOrPhysicsChange:true};
  if(!nearest||result.alongActualB48RoadMetres<nearest.alongActualB48RoadMetres)nearest=result;
 }
 if(!nearest)return null;
 return {...nearest,message:'前方B48 '+Math.round(nearest.alongActualB48RoadMetres)+
  'm · 実動体 '+nearest.id+' · '+nearest.variant+
  '（元コース曲線で計測／遮蔽・接触予測・回避可否は未判定）'};
}

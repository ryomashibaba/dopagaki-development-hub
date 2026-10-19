/**
 * W9-C1 G3: actual B48 road-relative early notice, OBSERVATION ONLY.
 * No physics, camera, steering, scoring, hidden floors or fake collision.
 * ETA uses instantaneous speed (NOT predictive human reaction-time proof).
 */
export const W9C1_CUE=Object.freeze({
 noticeNominalM:90,coreBeginNominalM:310,coreEndNominalM:360,
 releaseNominalM:440,sectionNominalM:600,arcSamples:120,
 markerMeters:Object.freeze([90,145,200,250,280])
});
const distance=(a,b)=>Math.hypot(...a.map((v,k)=>v-b[k]));
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export function makeW9C1CueProfile(doc,sample){
 if(!doc?.stageForge?.slopeDNAStudy?.realB48Surface)return null;
 if(typeof sample!=='function'||doc.surfaces?.length!==7||doc.movingObstacles?.length!==28)
  throw Error('W9-C1 cue requires actual seven B48 roads and 28 native moving bodies');
 const id=doc.stageForge.recordStageId;
 if(!['VB-P101-A13-W9C1-ULTRA','VB-P101-A13-W9C1-CONTROL'].includes(id))
  throw Error('W9-C1 cue cannot run on an undeclared trial');
 const road=doc.surfaces[0],n=W9C1_CUE.arcSamples;
 if(!road.rideable||!road.collidable||road.rows!==31||road.cols!==5)
  throw Error('W9-C1 cue requires the genuine physical 31x5 ABYSS surface');
 const cumulative=[0];let last=sample(road,0,.5);
 for(let i=1;i<=n;i++){
  const next=sample(road,i/n,.5);
  cumulative.push(cumulative[i-1]+distance(last,next));last=next;
 }
 if(!Number.isFinite(cumulative[n])||cumulative[n]<450||cumulative[n]>900)
  throw Error('W9-C1 actual road arc length outside bounded scale');
 return {roadId:road.id,recordStageId:id,
  widthMeters:doc.stageForge.slopeDNAStudy.nominalCoreWidthMeters,
  actualLengthMeters:cumulative[n],cumulative};
}
export function w9c1ArcAt(profile,u){
 if(!profile||!Number.isFinite(u))return null;
 const n=W9C1_CUE.arcSamples,x=clamp(u,0,1)*n;
 const i=Math.min(n-1,Math.floor(x)),f=x-i;
 return profile.cumulative[i]*(1-f)+profile.cumulative[i+1]*f;
}
export function readW9C1Cue(profile,{surfaceId,u,grounded,speedMps}={}){
 if(!profile||surfaceId!==profile.roadId||grounded!==true||
    !Number.isFinite(u)||!Number.isFinite(speedMps)||speedMps<0)return null;
 const p=W9C1_CUE,nominal=u*p.sectionNominalM;
 if(nominal<p.noticeNominalM||nominal>p.releaseNominalM)return null;
 const remaining=Math.max(0,w9c1ArcAt(profile,p.coreBeginNominalM/p.sectionNominalM)-w9c1ArcAt(profile,u));
 return {phase:nominal<p.coreBeginNominalM?'approach':nominal<=p.coreEndNominalM?'core':'exit',
  stageId:profile.recordStageId,widthMeters:profile.widthMeters,
  nominalPositionMeters:nominal,physicalDistanceToCoreMeters:remaining,
  speedMps,instantaneousEtaSeconds:remaining/Math.max(1,speedMps),
  noticeIsRendered:true,etaIsPrediction:false,
  humanVisibilityConfirmed:false};
}
export function w9c1ApproachMarks(doc,sample,frame){
 const profile=makeW9C1CueProfile(doc,sample);
 if(!profile)return {vertices:[],stations:0,nonCollision:true};
 if(typeof frame!=='function')throw Error('W9-C1 physical frame sampler required');
 const road=doc.surfaces[0],vertices=[];
 const push=(u,v,color)=>{
  const p=sample(road,u,v),normal=frame(road,u,v).normal;
  const sign=normal[1]<0?-1:1;
  const q=p.map((x,k)=>x+sign*normal[k]*.34);
  vertices.push(...q,...color);
 };
 const tri=(a,b,c,color)=>{push(a[0],a[1],color);push(b[0],b[1],color);push(c[0],c[1],color);};
 const quad=(a,b,v0,v1,color)=>{
  tri([a,v0],[b,v0],[b,v1],color);
  tri([a,v0],[b,v1],[a,v1],color);
 };
 for(const m of W9C1_CUE.markerMeters){
  const u=m/W9C1_CUE.sectionNominalM,v=(m+2.4)/W9C1_CUE.sectionNominalM;
  // Muted white/cyan - never red/yellow/purple hazard signaling.
  const col=m===90?[.85,1,.94]:[.22,.8,.88];
  quad(u,v,.08,.92,col);
  if(m>=200){
   quad(u,v,.02,.06,[.58,1,.92]);
   quad(u,v,.94,.98,[.58,1,.92]);
  }
 }
 if(!vertices.length||vertices.length%18!==0||!vertices.every(Number.isFinite))
  throw Error('W9-C1 geometry nonfinite');
 return {vertices,stations:W9C1_CUE.markerMeters.length,nonCollision:true};
}

/**
 * G4E-7I, PRIVATE only: focus-HUD legibility and genuine B48 GLIDE
 * shoulder contour paint. Pure GPU triangles; no floor, collider, lane aid,
 * physics, route, machine, score, camera, or steering modifications.
 */
const COLORS=Object.freeze({left:[.20,.98,.96],right:[1,.62,.30]});
export const G4E7I_MARK_RANGE=Object.freeze({section:0,startU:.49,endU:.652});
const CSS=`
.viewport[data-g4e7h-mode="focus"][data-g4e7i-mode="legible"] .machineCue{
 top:54px;right:8px;bottom:auto;max-width:min(322px,43%);
 padding:8px 10px;font-size:12.5px;line-height:1.42;
 overflow-wrap:anywhere;box-shadow:0 2px 12px #0007
}
.viewport[data-g4e7h-mode="focus"][data-g4e7i-mode="legible"] .edgeRadar{
 top:83px;left:8px;bottom:auto;width:min(243px,40%);padding:8px 10px;
 font-size:12px;line-height:1.35
}
.viewport[data-g4e7h-mode="focus"][data-g4e7i-mode="legible"] .edgeRadar strong{
 font-size:12px;margin-bottom:5px
}
.viewport[data-g4e7h-mode="focus"][data-g4e7i-mode="legible"] .edgeRadar small{
 font-size:11px;margin-top:5px
}
.viewport[data-g4e7h-mode="focus"][data-g4e7i-mode="legible"] .chapter{
 font-size:12px;max-width:45%
}
@media(max-width:640px){
 .viewport[data-g4e7h-mode="focus"][data-g4e7i-mode="legible"] .machineCue{
  top:72px;font-size:12px;max-width:48%
 }
 .viewport[data-g4e7h-mode="focus"][data-g4e7i-mode="legible"] .edgeRadar{
  top:114px;font-size:12px;width:44%
 }
 .viewport[data-g4e7h-mode="focus"][data-g4e7i-mode="legible"] .chapter{font-size:11px}
}
`;
const zero=()=>({active:false,vertices:[],triangles:0,segments:0,
 marks:[],nonCollision:true,indicatesSafeLane:false,newRideableArea:0,
 originalPhysicalRoadsUntouched:true,certifiedSlopeMeters:0});
export function g4e7iSkylineContours(doc,sample,frame,{enabled=false}={}){
 if(!enabled)return zero();
 if(doc?.stageForge?.g4e7gVisualTrial?.kind!=='glide'||
  doc.stageForge?.g4e7fPhysicalStudy?.variant!=='glide')return zero();
 if(doc.surfaces?.length!==7||doc.movingObstacles?.length!==28||
   doc.stageForge.productionPromoted!==false||
   doc.stageForge.recordStageId!=='VB-P101-A13-W9C2-G4E7G-GLIDE'||
   typeof sample!=='function'||typeof frame!=='function')
  throw Error('G4E7I requires exact private GLIDE 7-road 28-machine B48 stage');
 const road=doc.surfaces[G4E7I_MARK_RANGE.section];
 if(!road.collidable||!road.rideable||road.rows!==31||road.cols!==5||
  road.voidLongitudinalCells?.length)
  throw Error('G4E7I cannot draw over missing or invalid physical road');
 const vertices=[],marks=[];
 function elevated(u,v){
  const p=sample(road,u,v),n=frame(road,u,v).normal;
  const orientation=n[1]>=0?1:-1;
  return p.map((x,i)=>x+n[i]*orientation*.31);
 }
 function quad(u0,u1,v0,v1,color){
  if(!(u0>=G4E7I_MARK_RANGE.startU&&u1<=G4E7I_MARK_RANGE.endU&&
    u1>u0&&v0>=0&&v1<=1&&v1>v0))throw Error('G4E7I road paint out of bounds');
  const a=elevated(u0,v0),b=elevated(u1,v0),
   c=elevated(u1,v1),d=elevated(u0,v1);
  for(const p of [a,b,c,a,c,d])vertices.push(...p,...color);
 }
 // Short interruptions reveal curvature and road edge without pretending to
 // prescribe a safe trajectory; entirely on existing left/right shoulders.
 const N=13,from=G4E7I_MARK_RANGE.startU,to=G4E7I_MARK_RANGE.endU;
 for(let k=0;k<N;k++){
  const start=from+(to-from)*k/N,end=start+(to-from)*.68/N;
  quad(start,end,.012,.045,COLORS.left);
  quad(start,end,.955,.988,COLORS.right);
  marks.push({startU:start,endU:end,left:[.012,.045],right:[.955,.988],
   segment:k,noBridgeOrRoadReplacement:true});
 }
 if(vertices.length!==N*2*36||!vertices.every(Number.isFinite))
  throw Error('G4E7I GPU budget or nonfinite road contours');
 return {active:true,vertices,triangles:vertices.length/18,segments:N*2,
  marks,nonCollision:true,indicatesSafeLane:false,newRideableArea:0,
  originalPhysicalRoadsUntouched:true,certifiedSlopeMeters:0,
  reference:'REAL_SKYLINE_SHOULDERS_G4E7F_GLIDE_ONLY'};
}
export function createG4E7IControls({canvas,parent}){
 if(!canvas||!parent)throw Error('Missing G4E7I controls');
 const viewport=canvas.closest('.viewport');
 if(!viewport)throw Error('Missing physical camera viewport');
 const style=document.createElement('style');style.id='g4e7i-legibility-css';
 style.textContent=CSS;document.head.append(style);
 const button=document.createElement('button');
 button.id='g4e7iLegibilityToggle';button.type='button';
 button.setAttribute('aria-label','G4E-7I 大きい危険警告と非衝突路肩輪郭線の比較');
 let allowed=false,active=false;
 const focus=()=>viewport.dataset.g4e7hMode==='focus';
 const publish=()=>{
  if(!focus())active=false;
  const ready=allowed&&focus();
  button.hidden=!allowed;button.disabled=!ready;
  button.textContent=active?'G4E-7I 読みやすさ＋路肩輪郭：ON（研究限定）':
   'G4E-7I 読みやすさ＋路肩輪郭：OFF（先にG4E-7H FOCUS）';
  button.setAttribute('aria-pressed',String(active));
  const mode=!allowed?'off':active?'legible':'baseline';
  viewport.dataset.g4e7iMode=mode;canvas.dataset.g4e7iMode=mode;
 };
 const setStage=stageAllowed=>{allowed=Boolean(stageAllowed);active=false;publish();};
 const refreshFocus=()=>publish();
 button.addEventListener('click',()=>{if(!allowed||!focus())return;active=!active;publish();});
 parent.append(button);publish();
 return {button,setStage,refreshFocus,get active(){return allowed&&active&&focus();}};
}

/**
 * W9-C2 G4E-7H: viewport-only HUD readability trial.
 * Activates ONLY by explicit localhost G4E7G/G4E7H opt-in and actual private
 * visual comparison stage. No collision, route, camera, input, score or UI
 * behavior is altered: CSS merely relocates/resizes existing DOM elements.
 * Warning text, hazard urgency and steering buttons remain visible.
 */
export const G4E7H_ROI=Object.freeze({left:.06,top:.25,right:.94,bottom:.92});
export const G4E7H_SELECTORS=Object.freeze([
 '.hud','.righttag','#chapterHud','#machineCue','#edgeRadar','#left','#right'
]);
const CSS=`
.viewport[data-g4e7h-mode="focus"] .righttag{display:none!important}
.viewport[data-g4e7h-mode="focus"] .chapter{
 top:6px;left:50%;padding:5px 9px;max-width:42%;font-size:11px;
 letter-spacing:.015em;line-height:1.2;box-shadow:none;overflow:hidden;text-overflow:ellipsis
}
.viewport[data-g4e7h-mode="focus"] .chapter small{display:none}
.viewport[data-g4e7h-mode="focus"] .hud{
 top:6px;left:8px;padding:5px 9px;border-radius:7px;font-size:10px
}
.viewport[data-g4e7h-mode="focus"] .hud strong{font-size:21px}
.viewport[data-g4e7h-mode="focus"] .machineCue{
 top:60px;right:8px;bottom:auto;max-width:min(248px,39%);padding:6px 8px;
 border-radius:8px;font-size:10px;line-height:1.32;box-shadow:none
}
.viewport[data-g4e7h-mode="focus"] .edgeRadar{
 top:76px;left:8px;bottom:auto;width:min(210px,36%);padding:6px 8px;
 font-size:10px;border-radius:8px;box-shadow:none
}
.viewport[data-g4e7h-mode="focus"] .edgeRadar strong{margin-bottom:4px;font-size:10px}
.viewport[data-g4e7h-mode="focus"] .edgeTrack{height:7px}
.viewport[data-g4e7h-mode="focus"] .edgeMarker{height:15px;top:-5px}
.viewport[data-g4e7h-mode="focus"] .edgeRadar small{margin-top:4px;font-size:9px}
.viewport[data-g4e7h-mode="focus"] .drivekeys{bottom:8px;gap:7px}
.viewport[data-g4e7h-mode="focus"] .drivekeys button{
 min-height:46px;min-width:70px;padding:6px 10px;font-size:18px
}
@media(max-width:640px){
 .viewport[data-g4e7h-mode="focus"] .machineCue{top:77px;max-width:43%;font-size:10px}
 .viewport[data-g4e7h-mode="focus"] .edgeRadar{top:110px;width:42%}
 .viewport[data-g4e7h-mode="focus"] .chapter{max-width:46%;font-size:10px}
}
`;
export function unionRectArea(rects){
 if(!Array.isArray(rects))throw Error('G4E7H rectangles must be an array');
 const cleaned=rects.map(r=>{
  const x1=Number(r.left),x2=Number(r.right),y1=Number(r.top),y2=Number(r.bottom);
  if(![x1,x2,y1,y2].every(Number.isFinite)||x2<x1||y2<y1)
   throw Error('G4E7H invalid rectangle');
  return {left:x1,right:x2,top:y1,bottom:y2};
 }).filter(r=>r.right>r.left&&r.bottom>r.top);
 if(!cleaned.length)return 0;
 const xs=[...new Set(cleaned.flatMap(r=>[r.left,r.right]))].sort((a,b)=>a-b);
 let area=0;
 for(let i=0;i+1<xs.length;i++){
  const xMid=(xs[i]+xs[i+1])/2;
  const intervals=cleaned.filter(r=>r.left<xMid&&r.right>xMid)
   .map(r=>[r.top,r.bottom]).sort((a,b)=>a[0]-b[0]);
  let active=null,coveredY=0;
  for(const pair of intervals){
   if(!active)active=pair.slice();
   else if(pair[0]<=active[1])active[1]=Math.max(active[1],pair[1]);
   else {coveredY+=active[1]-active[0];active=pair.slice();}
  }
  if(active)coveredY+=active[1]-active[0];
  area+=(xs[i+1]-xs[i])*coveredY;
 }
 return area;
}
export function calculateG4E7HOcclusion(viewportBox,items,roi=G4E7H_ROI){
 const v=viewportBox;
 if(![v.left,v.top,v.right,v.bottom].every(Number.isFinite)||
  v.right<=v.left||v.bottom<=v.top)throw Error('Invalid viewport');
 const width=v.right-v.left,height=v.bottom-v.top;
 if(![roi.left,roi.right,roi.top,roi.bottom].every(Number.isFinite)||
  roi.left<0||roi.top<0||roi.right>1||roi.bottom>1||
  roi.right<=roi.left||roi.bottom<=roi.top)throw Error('Invalid ROI');
 const box={left:v.left+roi.left*width,right:v.left+roi.right*width,
  top:v.top+roi.top*height,bottom:v.top+roi.bottom*height};
 const clipped=items.filter(r=>r.visible!==false).map(r=>({
  left:Math.max(r.left,box.left),right:Math.min(r.right,box.right),
  top:Math.max(r.top,box.top),bottom:Math.min(r.bottom,box.bottom)
 })).filter(r=>r.right>r.left&&r.bottom>r.top);
 const pixels=unionRectArea(clipped),total=(box.right-box.left)*(box.bottom-box.top);
 return {region:roi,coveredSquareCssPixels:Number(pixels.toFixed(2)),
  regionSquareCssPixels:Number(total.toFixed(2)),
  percent:Number((100*pixels/total).toFixed(2)),
  countedRectangles:clipped.length};
}
export function measureG4E7HViewport(viewport){
 const rect=viewport.getBoundingClientRect();
 const items=G4E7H_SELECTORS.flatMap(selector=>{
  const element=viewport.querySelector(selector);
  if(!element||element.hidden)return [];
  const style=getComputedStyle(element);
  if(style.display==='none'||style.visibility==='hidden'||style.opacity==='0')return [];
  const r=element.getBoundingClientRect();
  return [{selector,left:r.left,right:r.right,top:r.top,bottom:r.bottom,visible:true}];
 });
 return {...calculateG4E7HOcclusion(rect,items),visibleItems:items.map(x=>x.selector)};
}
export function createG4E7HFocusHud({canvas,parent}){
 if(!canvas||!parent)throw Error('G4E7H DOM anchors missing');
 const viewport=canvas.closest('.viewport');
 if(!viewport)throw Error('G4E7H original race viewport not found');
 const style=document.createElement('style');style.id='g4e7h-focus-css';
 style.textContent=CSS;document.head.append(style);
 const button=document.createElement('button');button.id='g4e7hFocusToggle';
 button.type='button';button.setAttribute('aria-label','G4E-7H 比較用のHUD占有率を切替');
 const state={allowed:false,active:false};
 const publish=()=>{
  viewport.dataset.g4e7hMode=!state.allowed?'off':state.active?'focus':'baseline';
  canvas.dataset.g4e7hMode=viewport.dataset.g4e7hMode;
  button.hidden=!state.allowed;button.disabled=!state.allowed;
  button.textContent='G4E-7H HUD '+(state.active?'FOCUS':'BASELINE')+'（非公開・見た目だけ）';
  button.setAttribute('aria-pressed',String(state.active));
 };
 const setStage=allowed=>{
  state.allowed=Boolean(allowed);state.active=false;publish();
 };
 button.addEventListener('click',()=>{
  if(!state.allowed)return;
  state.active=!state.active;publish();
 });
 parent.append(button);publish();
 return {button,setStage,measure:()=>measureG4E7HViewport(viewport),
  get active(){return state.active;}};
}

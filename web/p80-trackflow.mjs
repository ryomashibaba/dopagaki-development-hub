/**
 * P80 TRACK FLOW — decorative illuminated driving-direction marks.
 * Derived exclusively from the existing exact sampled road skin.
 * Never passed to physical compile(), never alters road controls or assists.
 */
export const FLOW_CHAPTERS=Object.freeze([
 {id:'pipe',label:'PIPE',starts:['PIPE_DIVE_A']},
 {id:'return',label:'HALO',starts:['PIPE_RETURN']},
 {id:'spiral',label:'SPIRAL',starts:['SPIRAL_CATHEDRAL']},
 {id:'fork',label:'FORK',starts:['FORK_APPROACH','FORK_L','FORK_R']},
 {id:'rejoin',label:'REJOIN',starts:['FORK_REJOIN']},
 {id:'machines',label:'MACHINES',starts:['MACHINE_CHAMBER']},
 {id:'jump',label:'LAUNCH',starts:['GAP_TAKEOFF']},
 {id:'landing',label:'LAND',starts:['GAP_LANDING']}
]);
const BASE_COLORS={
 pipe:[.12,.86,1],
 return:[.26,1,.65],
 spiral:[.72,.43,1],
 fork:[.24,.68,1],
 rejoin:[.35,1,.83],
 machines:[1,.63,.18],
 jump:[1,.95,.40],
 landing:[.31,1,.82],
 other:[.31,.8,1]
};
const length=v=>Math.hypot(...v);
const dist=(a,b)=>length(a.map((v,i)=>v-b[i]));
export function chapterFromSurface(surfaceId){
 if(typeof surfaceId!=='string')return null;
 for(let index=0;index<FLOW_CHAPTERS.length;index++)
  if(FLOW_CHAPTERS[index].starts.some(prefix=>surfaceId.includes('-'+prefix+'-')))
   return {index,id:FLOW_CHAPTERS[index].id,label:FLOW_CHAPTERS[index].label};
 return null;
}
function roadLength(s,sample){
 let total=0,previous=sample(s,0,.5);
 for(let i=1;i<=32;i++){const p=sample(s,i/32,.5);total+=dist(p,previous);previous=p;}
 return total;
}
function placeOnRoad(s,u,v,sample,frame){
 const p=sample(s,u,v);
 const raw=frame(s,u,v).normal;
 const n=raw[1]<0?raw.map(x=>-x):raw;
 const norm=length(n)||1;
 return p.map((x,i)=>x+(n[i]/norm)*.28);
}
const vertex=(arr,p,c)=>arr.push(...p,...c);
const line=(arr,a,b,c)=>{vertex(arr,a,c);vertex(arr,b,c);};
/** Produces static WebGL2 LINES vertices (xyz rgb), two chevrons per road marker. */
export function flowLineVertices(doc,sample,frame,{spacing=56,maxMarkersPerRoad=28}={}){
 if(!(spacing>10&&spacing<=200)||!Number.isInteger(maxMarkersPerRoad)||maxMarkersPerRoad<1||maxMarkersPerRoad>80)
  throw Error('Invalid visual density');
 if(typeof sample!=='function'||typeof frame!=='function')throw Error('Canonical B48 road samplers required');
 const verts=[];
 let markers=0,roads=0;
 for(const s of doc.surfaces||[]){
  if(!s.rideable||s.visible===false)continue;
  roads++;
  const category=chapterFromSurface(s.id)?.id||'other';
  const color=BASE_COLORS[category];
  const measured=roadLength(s,sample);
  if(measured<10)continue;
  const count=Math.max(1,Math.min(maxMarkersPerRoad,Math.floor(measured/spacing)));
  const half=Math.min(.08,Math.max(.012,4.5/measured));
  // Symmetric left/right markers communicate travel direction, not a "safe lane".
  for(let k=0;k<count;k++){
   const u=(k+.5)/count;
   if(u-half<=.01||u+half>=.99)continue;
   for(const v of [.28,.72]){
    const tip=placeOnRoad(s,u+half,v,sample,frame);
    const tailL=placeOnRoad(s,u-half,Math.max(.03,v-.09),sample,frame);
    const tailR=placeOnRoad(s,u-half,Math.min(.97,v+.09),sample,frame);
    line(verts,tailL,tip,color);line(verts,tailR,tip,color);
    markers++;
   }
  }
 }
 return {vertices:verts,markers,roads};
}
/** Read-only section state for the HUD. Does not promise that a branch is traversable. */
export function flowProgressState(stage,surface,previousSurface,status){
 if(stage?.stageForge?.id!=='EP-P66')return {visible:false,index:-1,label:'OTHER'};
 const chapter=chapterFromSurface(surface)||chapterFromSurface(previousSurface);
 const index=status==='finished'?FLOW_CHAPTERS.length-1:chapter?.index??-1;
 return {visible:true,index,label:chapter?.label||'START',
  stages:FLOW_CHAPTERS.map((c,i)=>({label:c.label,state:i===index?'current':i<index?'passed':'future'}))};
}

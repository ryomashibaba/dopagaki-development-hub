/**
 * G4E-7AO — TRUE SWEEP PREWARNING / localhost-only research.
 * Measured road-arc advance notice for the TWO genuine AJ reanchored B51-C
 * movers. Roadside V fins are GPU triangles; do not form new road, collision,
 * a target lane, future hazard position or steering instruction.
 */
const IDS=Object.freeze(['a13-machine-01','a13-machine-02']);
const STATIONS=Object.freeze([150,95,45]);
const COLORS=Object.freeze([[.13,.97,1],[1,.63,.16],[1,.20,.30]]);
const plus=(a,b)=>a.map((v,i)=>v+b[i]);
const minus=(a,b)=>a.map((v,i)=>v-b[i]);
const mul=(a,k)=>a.map(x=>x*k);
const len=v=>Math.hypot(...v);
const dist=(a,b)=>len(minus(a,b));
const unit=v=>mul(v,1/(len(v)||1));
const vert=(out,p,color)=>out.push(...p,...color);
const tri=(out,a,b,c,color)=>{vert(out,a,color);vert(out,b,color);vert(out,c,color);};
const doubleQuad=(out,a,b,c,d,color)=>{
 tri(out,a,b,c,color);tri(out,a,c,d,color);
 const low=color.map(x=>x*.55);
 tri(out,d,c,b,low);tri(out,d,b,a,low);
};
const EMPTY=()=>({active:false,vertices:[],stations:[],hazards:0,
  warningGeometryOnly:true,additionalRoads:0,additionalB51:0,
  physicalCollisionChanges:false,certifiedSlope2Meters:0,publish:'HOLD'});
const frame=(road,sample,u,side)=>{
 const c=sample(road,u,.5),e=sample(road,u,side<0?0:1),
  o=unit([e[0]-c[0],0,e[2]-c[2]]);
 if(len(o)<.9)throw Error('AO invalid actual B48 shoulder frame');
 return {center:c,edge:e,out:o};
};
function arcLookback(road,sample,anchorU,targetMeters){
 // The path is measured from actual B48 center samples, NOT an assumed 1km
 // stage length or an arbitrary fraction of the u parameter.
 const n=320,samples=Array.from({length:n+1},(_,i)=>
  sample(road,anchorU*i/n,.5));
 let travelled=0;
 for(let i=n;i>=1;i--){
  const length=dist(samples[i],samples[i-1]);
  if(!Number.isFinite(length))throw Error('AO nonfinite B48 arc length');
  if(travelled+length>=targetMeters){
   const part=(targetMeters-travelled)/(length||1);
   return {u:anchorU*(i-part)/n,measuredMeters:targetMeters};
  }
  travelled+=length;
 }
 // No marker for a physically non-existent earlier station.
 return null;
}
function fin(out,f,stationIndex){
 const base=plus(f.edge,mul(f.out,13.5)),c=COLORS[stationIndex],
  outer=f.out,bright=c.map(x=>Math.min(1,x*1.2));
 const point=(offset,height)=>plus(plus(base,mul(outer,offset)),[0,height,0]);
 // V-sign faces the actual oncoming direction from either road orientation.
 // It is deliberately hollow, narrow, and entirely off the genuine shoulder.
 const ribbon=(a,b,width,color)=>{
  const spread=mul(outer,width*.5);
  doubleQuad(out,plus(a,spread),plus(b,spread),minus(b,spread),minus(a,spread),color);
 };
 const layers=3-stationIndex;
 for(let i=0;i<layers;i++){
  const y=i*2.65;
  ribbon(point(2,1+y),point(-.8,3.0+y),.88,c);
  ribbon(point(-.8,3.0+y),point(2,5+y),.88,bright);
 }
 // A little vertical mast, not an artificial B48 edge or invisible bridge.
 ribbon(point(3,0),point(3,9.8),.46,c.map(v=>v*.5));
}
export function g4e7aoActualB51Warning(doc,sample,{enabled=false}={}){
 if(!enabled)return EMPTY();
 const aj=doc?.stageForge?.g4e7ajStudy,ah=doc?.stageForge?.g4e7ahStudy;
 if(aj?.id!=='reanchor'||!['true-pinch','pinch-switch'].includes(aj.road)||
   aj.reanchoredOriginalIds?.join(',')!==IDS.join(',')||
   aj.originalMovingObjects!==28||aj.unchangedMovingObjects!==26||
   aj.certifiedSlope2Meters!==0||aj.publish!=='HOLD'||
   doc.stageForge.productionPromoted!==false||
   !ah?.realMissingLongitudinalCell52||ah.widthMinMeters<10||ah.widthMinMeters>13.5||
   doc.surfaces?.length!==7||doc.movingObstacles?.length!==28||
   doc.surfaces[0].voidLongitudinalCells?.join(',')!=='52')
  throw Error('AO requires genuine private AJ B48 with exactly 2 moving reanchors');
 if(typeof sample!=='function')throw Error('AO needs actual B48 sample');
 const frozen=JSON.stringify(doc),road=doc.surfaces[0],vertices=[],stations=[];
 const hazards=[{id:IDS[0],u:.32},{id:IDS[1],u:.80}];
 for(const h of hazards){
  const obstacle=doc.movingObstacles.find(o=>o.id===h.id);
  if(!obstacle||obstacle.enabled===false)throw Error('AO missing native B51 mover');
  const p=obstacle.position,at=sample(road,h.u,.5),
   edgeZero=sample(road,h.u,0),edgeOne=sample(road,h.u,1),
   flatDistance=(a,b)=>Math.hypot(a[0]-b[0],a[2]-b[2]),
   side=flatDistance(p,edgeZero)<flatDistance(p,edgeOne)?-1:1;
  if(flatDistance(p,at)<6||flatDistance(edgeZero,edgeOne)<9)
   throw Error('AO mover or real B48 edge not physically separated');
  for(const [i,lead] of STATIONS.entries()){
   const lookback=arcLookback(road,sample,h.u,lead);
   if(!lookback)continue;
   const f=frame(road,sample,lookback.u,side);
   fin(vertices,f,i);
   stations.push({hazardId:h.id,side,stationIndex:i,
    u:Number(lookback.u.toFixed(6)),measuredLeadMeters:lead,
    minimumOffShoulderMeters:10,worldAnchor:f.edge.map(x=>Number(x.toFixed(4)))});
  }
 }
 if(vertices.length%18||!vertices.every(Number.isFinite)||
    stations.length<4||stations.length>6||
    stations.some(s=>s.u<0||s.u>1||s.minimumOffShoulderMeters<8)||
    JSON.stringify(doc)!==frozen)
  throw Error('AO genuine B48 advance-notice integrity invalid');
 return {active:true,vertices,stations,hazards:2,
  warningGeometryOnly:true,additionalRoads:0,additionalB51:0,
  physicalCollisionChanges:false,certifiedSlope2Meters:0,publish:'HOLD'};
}

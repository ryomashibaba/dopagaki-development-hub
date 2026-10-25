/**
 * G4E-7BL / OPEN CROWN ARCOLOGY. Genuine authored polygonal GLB2 candidate.
 * Real BC second B48 world coordinates, strictly non-colliding, PRIVATE only.
 * This is script-sculpted 3D geometry; NOT a handcrafted Blender asset.
 */
import {sample} from '../private/reference_only/director/surface.js';
import {BK_MATERIALS,glbFromTriangles} from './p101-w9c2-g4e7bk-glb-author.mjs';
const add=(a,b)=>a.map((x,i)=>x+b[i]),sub=(a,b)=>a.map((x,i)=>x-b[i]);
const mul=(a,v)=>a.map(x=>x*v),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const unit=a=>mul(a,1/(Math.hypot(...a)||1));
function tri(t,m,a,b,c){
 const n=unit(cross(sub(b,a),sub(c,a)));
 if(![...a,...b,...c,...n].every(Number.isFinite)||Math.hypot(...n)<.99)throw Error('BL invalid triangle');
 for(const p of [a,b,c])t[m].push(...p,...n);
}
function quad(t,m,a,b,c,d){tri(t,m,a,b,c);tri(t,m,a,c,d);}
function frame(s,u){
 const edge=sample(s,u,1),center=sample(s,u,.5);
 const a=sample(s,u-.001,.5),b=sample(s,u+.001,.5);
 const forward=unit([b[0]-a[0],0,b[2]-a[2]]);
 const delta=sub(edge,center);
 const outward=unit(sub([delta[0],0,delta[2]],mul(forward,dot(delta,forward))));
 if(dot(outward,delta)<1)throw Error('BL genuine shoulder missing');
 return {edge,forward,outward};
}
const pos=(f,along,out,y)=>add(add(add(f.edge,mul(f.forward,along)),mul(f.outward,out)),[0,y,0]);
function solid(t,m,top,height){
 const below=top.map(p=>add(p,[0,-height,0]));
 quad(t,m,...top);quad(t,5,...below.slice().reverse());
 for(let i=0;i<4;i++)quad(t,i%2===0?1:5,top[i],top[(i+1)%4],below[(i+1)%4],below[i]);
}
function beam(t,m,a,b,width){
 const forward=unit(sub(b,a)),right=unit(cross(forward,Math.abs(forward[1])>.85?[0,0,1]:[0,1,0]));
 const up=unit(cross(right,forward)),r=mul(right,width*.5),h=mul(up,width*.36);
 const ring=p=>[add(add(p,r),h),add(sub(p,r),h),sub(sub(p,r),h),add(sub(p,h),r)];
 const x=ring(a),y=ring(b);
 for(let i=0;i<4;i++)quad(t,m,x[i],x[(i+1)%4],y[(i+1)%4],y[i]);
}
export function generateBLModel(doc){
 const b=doc?.stageForge?.g4e7bcStudy;
 if(b?.id!=='bank-grade-contour'||b.variant!=='rollDeck'||
  !['true-pinch','pinch-switch'].includes(b.road)||!b.real7B48||!b.real28B51||
  !b.hasRealVoid52||b.publish!=='HOLD'||b.formalSlope2Meters!==0||
  doc.stageForge.productionPromoted!==false||doc.surfaces?.length!==7||
  doc.movingObstacles?.length!==28||
  doc.surfaces[0].voidLongitudinalCells?.join(',')!=='52')
   throw Error('BL requires untouched genuine PRIVATE BC stage');
 const frozen=JSON.stringify(doc),t=BK_MATERIALS.map(()=>[]),s=doc.surfaces[1];
 const N=60,M=24,PI=Math.PI,frameAt=v=>frame(s,.625+v*.225);
 const shell=(v,a,inner)=>{
  const f=frameAt(v),theta=-1.39+2.78*a,wave=Math.sin(PI*v);
  const x=246+12*Math.sin(2*PI*v)+9*Math.sin(5*PI*v);
  const radius=(inner?72:102)+27*wave+5*Math.sin(4*PI*v);
  const yRadius=(inner?83:116)+15*wave;
  return pos(f,0,x+radius*Math.cos(theta),-45+yRadius*Math.sin(theta)+10*wave*Math.cos(2*theta));
 };
 const cut=(v,a)=>((v-.27)/.115)**2+((a-.69)/.21)**2<1||
  ((v-.64)/.09)**2+((a-.31)/.21)**2<1;
 const hole=(i,j)=>cut((i+.5)/N,(j+.5)/M);
 for(let i=0;i<N;i++)for(let j=0;j<M;j++){
  if(hole(i,j))continue;
  const a=shell(i/N,j/M,false),c=shell((i+1)/N,(j+1)/M,false);
  const d=shell(i/N,(j+1)/M,false),p=shell((i+1)/N,j/M,false);
  const A=shell(i/N,j/M,true),C=shell((i+1)/N,(j+1)/M,true);
  const D=shell(i/N,(j+1)/M,true),P=shell((i+1)/N,j/M,true);
  quad(t,j<5?1:j>18?0:i>36&&i<48?2:0,a,p,c,d);
  quad(t,5,D,C,P,A);
  if(j===0||hole(i,j-1))quad(t,1,a,A,P,p);
  if(j===M-1||hole(i,j+1))quad(t,1,d,c,C,D);
  if(i===0||hole(i-1,j))quad(t,1,a,d,D,A);
  if(i===N-1||hole(i+1,j))quad(t,1,p,P,C,c);
 }
 // Five different inhabited terraces in the hollow volume (not flat facade props).
 const decks=[[.09,.24,-32,325],[.30,.45,-73,341],[.48,.60,-18,316],[.66,.79,-67,348],[.81,.94,-91,334]];
 for(let k=0;k<decks.length;k++){
  const [a,b,h,outer]=decks[k],f=frameAt(a),g=frameAt(b);
  solid(t,k%3===0?0:1,[pos(f,-4,223,h),pos(g,8,231,h+8),
   pos(g,9,outer,h+14),pos(f,-11,outer-6,h+3)],16+3*(k%2));
  for(let j=0;j<7;j++){
   const p=frameAt(a+(b-a)*j/7),q=frameAt(a+(b-a)*(j+.7)/7),o=226+3*Math.sin(j);
   quad(t,j%3===1?3:2,pos(p,0,o,h-23),pos(q,0,o,h-19),
    pos(q,0,o,h-43),pos(p,0,o,h-42));
  }
 }
 // Integrated spire beyond the outer shell. Faceted / tapered / twisted.
 const base=frameAt(.73),S=30,K=12,spire=(i,j)=>{
  const v=i/S,theta=2*PI*j/K+.26*Math.sin(PI*v);
  const r=45*(1-.48*v)+9*Math.sin(2*PI*v)+4*Math.sin(3*theta+v*PI);
  return pos(base,r*Math.sin(theta)*.45,414+r*Math.cos(theta),-103+270*v);
 };
 for(let i=0;i<S;i++)for(let j=0;j<K;j++)
  quad(t,i>11&&i<19?(j%4===0?3:2):j%3===0?0:1,
   spire(i,j),spire(i,j+1),spire(i+1,j+1),spire(i+1,j));
 quad(t,0,spire(S,0),spire(S,3),spire(S,6),spire(S,9));
 for(const v of [.65,.80])
  beam(t,1,pos(frameAt(v),0,330,-84),pos(base,0,396,-72),12);
 // A few continuous readable accent seams, no endless repeated gateway props.
 for(const j of [6,18])for(let i=2;i<N-2;i+=2){
  if(hole(i,j)||hole(i+1,j))continue;
  beam(t,4,shell(i/N,j/M,false),shell((i+1)/N,j/M,false),1.4);
 }
 const meta={schema:'dopagaki.g4e7bk-private-material-city/1',
  visualCandidate:'G4E-7BL-OPEN-CROWN',authoring:'SCRIPTED_REAL_3D_NOT_BLENDER',
  road:b.road,sourceStageId:doc.stageForge.recordStageId,realB48:7,realB51:28,
  genuineCell52:true,officialSlope2Meters:0,districtCount:1,openSkyCourts:2,
  inhabitedTerraces:5,spireRiseMeters:270,
  humanQA:'HOLD',artApproval:'HOLD',publication:'HOLD'};
 if(JSON.stringify(doc)!==frozen)throw Error('BL mutated physics');
 return glbFromTriangles(t,meta);
}

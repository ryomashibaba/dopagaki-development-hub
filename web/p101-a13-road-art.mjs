/**
 * A13 W8: high-speed road armour / asymmetrical wing chevrons.
 * GPU only; all pieces are projected to genuine seven B48 rideable skins.
 * No fabricated floors, fixed barriers, auto steering or safe-lane marking.
 */
const palette=[
 [[.2,1,.96],[.29,.5,1],[1,.36,.48]],
 [[1,.67,.27],[.22,.9,1],[1,.37,.5]],
 [[.28,1,.8],[.62,.45,1],[1,.7,.3]],
 [[1,.7,.36],[.98,.28,.7],[.3,.86,1]],
 [[.37,.72,1],[.8,.38,1],[1,.48,.38]],
 [[1,.49,.87],[.39,.94,1],[1,.84,.44]],
 [[.27,.95,1],[.72,.5,1],[1,.47,.39]]
];
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function arc(road,sample){
 const p=Array.from({length:129},(_,i)=>sample(road,i/128,.5)),c=[0];
 for(let i=1;i<129;i++)c.push(c.at(-1)+Math.hypot(...p[i].map((x,k)=>x-p[i-1][k])));
 return {total:c.at(-1),u(d){
  const x=clamp(d,0,c.at(-1));let lo=0,hi=128;
  while(hi-lo>1){let m=(hi+lo)>>1;if(c[m]<x)lo=m;else hi=m;}
  return (lo+clamp((x-c[lo])/(c[hi]-c[lo]||1),0,1))/128;
 }};
}
function place(road,u,v,sample,frame){
 const p=sample(road,u,v),n=frame(road,u,v).normal,up=n[1]<0?-.29:.29;
 return p.map((x,k)=>x+n[k]*up);
}
function triangle(out,road,pts,col,sample,frame){
 for(const [u,v] of pts)out.push(...place(road,u,v,sample,frame),...col);
}
function quad(out,road,a,b,v0,v1,col,sample,frame){
 triangle(out,road,[[a,v0],[b,v0],[b,v1]],col,sample,frame);
 triangle(out,road,[[a,v0],[b,v1],[a,v1]],col,sample,frame);
}
export function a13RacingRoadArt(doc,sample,frame){
 if(doc?.stageForge?.variant!=='A13_GAMEPLAY_ISOLATED')
  return {vertices:[],segments:0,sections:0,nonCollision:true};
 if(doc.surfaces?.length!==7||typeof sample!=='function'||typeof frame!=='function'||
    doc.surfaces.some(s=>!s.collidable||!s.rideable||s.rows!==31||s.cols!==5))
  throw Error('W8 must use seven actual collidable B48 skin surfaces');
 const vertices=[];let segments=0;
 for(const [section,s] of doc.surfaces.entries()){
  const profile=arc(s,sample),[glow,glow2,accent]=palette[section];
  for(let d=7;d+25<profile.total;d+=34){
   const a=profile.u(d),b=profile.u(d+19),c=profile.u(d+25);
   for(const [v0,v1] of [[.02,.11],[.89,.98]])quad(vertices,s,a,c,v0,v1,[.03,.085,.13],sample,frame);
   for(const [v0,v1] of [[.12,.22],[.78,.88]])quad(vertices,s,a,b,v0,v1,[.065,.14,.21],sample,frame);
   quad(vertices,s,b,c,.04,.09,glow,sample,frame);
   quad(vertices,s,b,c,.91,.96,accent,sample,frame);
   triangle(vertices,s,[[a,.24],[b,.24],[c,.33]],glow2,sample,frame);
   triangle(vertices,s,[[a,.76],[b,.76],[c,.67]],accent,sample,frame);
   const phase=Math.floor(d/34)%3;
   if(phase===0){
    quad(vertices,s,a,b,.37,.41,glow2,sample,frame);
    quad(vertices,s,a,b,.59,.63,glow,sample,frame);
   }else if(phase===1){
    triangle(vertices,s,[[a,.36],[c,.36],[b,.46]],glow,sample,frame);
   }else triangle(vertices,s,[[a,.64],[c,.64],[b,.54]],glow2,sample,frame);
   segments++;
  }
 }
 if(segments<140||segments>400||vertices.length>180000||vertices.length%18!==0||!vertices.every(Number.isFinite))
  throw Error('W8 road art invalid or over GPU budget');
 return {vertices,segments,sections:7,nonCollision:true};
}

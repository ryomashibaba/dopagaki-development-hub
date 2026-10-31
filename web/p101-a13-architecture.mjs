/**
 * P101 A13 W4 — GPU ONLY machine-megastructure frames, physically registered
 * on the actual B48 road skin and its B51-C machine stations.
 * These overhead/shoulder frames are non-collidable scenery, never safe walls,
 * and never substitute for the 28 real native moving B51-C solid bodies.
 */
import {A13_HAZARD_SPECS,a13MachineId} from './p101-a13-hazard-layout.mjs';
const add=(a,b)=>a.map((x,i)=>x+b[i]);
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const mul=(a,t)=>a.map(x=>x*t);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const unit=a=>mul(a,1/(Math.hypot(...a)||1));
const quad=(out,a,b,c,d,col)=>{
 for(const p of [a,b,c,a,c,d])out.push(...p,...col);
};
/** Visible structural box beam oriented along the endpoints, not a collision primitive. */
function beam(out,a,b,radius,col){
 const f=unit(sub(b,a)),test=Math.abs(f[1])>.9?[1,0,0]:[0,1,0];
 const right=unit(cross(f,test)),up=unit(cross(right,f));
 const corner=(p,x,y)=>add(add(p,mul(right,radius*x)),mul(up,radius*y));
 const x=[corner(a,-1,-1),corner(a,1,-1),corner(a,1,1),corner(a,-1,1)];
 const y=[corner(b,-1,-1),corner(b,1,-1),corner(b,1,1),corner(b,-1,1)];
 for(let k=0;k<4;k++)quad(out,x[k],x[(k+1)%4],y[(k+1)%4],y[k],col);
 quad(out,x[3],x[2],x[1],x[0],col.map(v=>v*.65));
 quad(out,y[0],y[1],y[2],y[3],col.map(v=>v*.80));
}
export function a13MachineMegastructures(doc,sample,{quietGapSection0=false}={}){
 if(doc?.stageForge?.variant!=='A13_GAMEPLAY_ISOLATED')
  return {vertices:[],structures:0,nativeMachineCount:0,collidable:false};
 if(typeof sample!=='function'||doc.surfaces?.length!==7||
    doc.movingObstacles?.length!==12+A13_HAZARD_SPECS.length)
  throw Error('A13 architectural anchors need the actual 7 skin / 28 native collision source');
 const vertices=[],silver=[.17,.29,.40],dark=[.07,.16,.25],
   lights=[[1,.26,.32],[1,.80,.27],[.74,.40,1]];
 let structures=0,removed=0;
 for(let i=0;i<A13_HAZARD_SPECS.length;i++){
  const [section,u,kind]=A13_HAZARD_SPECS[i],road=doc.surfaces[section],ob=doc.movingObstacles[12+i];
  if(ob.id!==a13MachineId(i)||!road.collidable)throw Error('A13 machinery is not tied to native collider');
  // Discard scenery support FRAME, not B51-C native moving hazard.
  if(quietGapSection0&&section===0&&u>=.28&&u<=.84){removed++;continue;}
  // Keep the structure outside both actual running road edges, not virtual centerline strips.
  const left=sample(road,u,0),right=sample(road,u,1);
  const outward=unit([right[0]-left[0],0,right[2]-left[2]]);
  const l=add(left,mul(outward,-6)),r=add(right,mul(outward,6));
  const rise=kind===1?40:kind===2?34:31;
  const upper=p=>add(p,[0,rise,0]),mid=p=>add(p,[0,rise*.62,0]);
  beam(vertices,l,upper(l),kind===1?2.6:2.1,silver);
  beam(vertices,r,upper(r),kind===1?2.6:2.1,silver);
  beam(vertices,upper(l),upper(r),kind===1?2.8:2.2,dark);
  // Hazard-coloured lighted structural crown, distinct from the native solid.
  beam(vertices,add(upper(l),[0,-4,0]),add(upper(r),[0,-4,0]),.65,lights[kind]);
  if(kind===1){
   const crown=add(mul(add(l,r),.5),[0,rise+8,0]);
   beam(vertices,upper(l),crown,1.1,silver);beam(vertices,crown,upper(r),1.1,silver);
  }else if(kind===0){
   beam(vertices,mid(l),add(upper(l),mul(outward,8)),.9,lights[kind]);
   beam(vertices,mid(r),add(upper(r),mul(outward,-8)),.9,lights[kind]);
  }else{
   const center=add(mul(add(upper(l),upper(r)),.5),[0,-7,0]);
   beam(vertices,upper(l),center,1.25,silver);
   beam(vertices,center,upper(r),1.25,silver);
  }
  structures++;
 }
 if(vertices.length>95000||!vertices.every(Number.isFinite))
  throw Error('A13 GPU architecture geometry outside finite performance budget');
 return {vertices,structures,removed,nativeMachineCount:doc.movingObstacles.length,collidable:false};
}

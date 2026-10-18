/**
 * P82: monumental resonance world architecture. GPU mesh ONLY.
 * Built from the existing P76 HALO / P69 cathedral / dual fork layout.
 * NEVER supply these triangles to native Runner, compile(), CCD or geometry JSON.
 * All prisms are architectural silhouettes rather than usable rideable roads.
 */
import {voidBreakerGeometry} from './p93-void-breaker-visual.mjs';
const PI=Math.PI,TAU=2*PI;
const plus=(a,b)=>a.map((v,i)=>v+b[i]);
const scale=(a,k)=>a.map(v=>v*k);
const minus=(a,b)=>a.map((v,i)=>v-b[i]);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const unit=a=>scale(a,1/(Math.hypot(...a)||1));
const put=(v,p,c)=>v.push(p[0],p[1],p[2],...c);
const tri=(v,a,b,c,color)=>{put(v,a,color);put(v,b,color);put(v,c,color);};
const quad=(v,a,b,c,d,color)=>{tri(v,a,b,c,color);tri(v,a,c,d,color);};
const PALETTE={
 halo:[.12,.57,.78],haloLight:[.43,1,.92],haloDark:[.09,.16,.33],
 reactor:[.34,.30,.78],reactorLight:[.74,.71,1],
 spiral:[.17,.33,.62],spiralLight:[.36,.86,.99],
 fork:[.42,.19,.62],forkLight:[.95,.43,1],
 city:[.075,.20,.37],cityLight:[.22,.56,.73]
};
function beam(out,start,end,width,height,color,accent=null){
 const delta=minus(end,start),dir=unit(delta);
 if(Math.hypot(...delta)<.0001)return;
 const right=unit(cross(dir,Math.abs(dir[1])>.92?[1,0,0]:[0,1,0]));
 const up=unit(cross(right,dir));
 const o=(p,a,b)=>plus(plus(p,scale(right,a*width/2)),scale(up,b*height/2));
 const a=[o(start,-1,-1),o(start,1,-1),o(start,1,1),o(start,-1,1)];
 const b=[o(end,-1,-1),o(end,1,-1),o(end,1,1),o(end,-1,1)];
 for(let i=0;i<4;i++){
  const j=(i+1)%4;
  quad(out,a[i],a[j],b[j],b[i],accent&&i===2?accent:i===0?color.map(x=>x*.55):color);
 }
 quad(out,a[3],a[2],a[1],a[0],color.map(x=>x*.64));
 quad(out,b[0],b[1],b[2],b[3],color);
}
function loop(out,center,radius,y,width,color,count=64){
 for(let i=0;i<count;i++){
  const p=t=>[center[0]+radius*Math.cos(t),y,center[2]+radius*Math.sin(t)];
  beam(out,p(TAU*i/count),p(TAU*(i+1)/count),width,width*.8,color,
   i%8===0?PALETTE.reactorLight:null);
 }
}
function haloPoint(t,radius=260,y=150){
 return [-860-radius*Math.cos(PI*t),y,-10+radius*Math.sin(PI*t)];
}
function haloLateral(t,r){
 return [r*Math.cos(PI*t),0,-r*Math.sin(PI*t)];
}
function haloPortal(out,t){
 const center=haloPoint(t),right=unit(haloLateral(t,1));
 const side=(distance,y)=>plus([center[0],y,center[2]],scale(right,distance));
 // Heavy stepped buttresses are outside the collision road's ~80m half-width.
 for(const sign of [-1,1]){
  const p0=side(sign*113,88),p1=side(sign*110,188);
  beam(out,p0,p1,13,13,PALETTE.haloDark,PALETTE.halo);
  beam(out,p1,side(sign*72,235),8,9,PALETTE.halo,PALETTE.haloLight);
  beam(out,side(sign*112,191),side(sign*166,220),5,7,PALETTE.haloDark);
 }
 beam(out,side(-72,235),side(0,258),9,8,PALETTE.halo,PALETTE.haloLight);
 beam(out,side(0,258),side(72,235),9,8,PALETTE.halo,PALETTE.haloLight);
 beam(out,side(-110,186),side(110,186),3,3,PALETTE.haloLight);
 beam(out,side(0,258),side(0,279),4,4,PALETTE.haloLight);
}
function haloMegaStructure(v){
 // One unbroken 520m half-circle route framed by architectural portals.
 for(let i=0;i<=15;i++)haloPortal(v,(i+.4)/16);
 for(const radius of [166,367]){
  for(let i=0;i<40;i++){
   const a=PI*i/40,b=PI*(i+1)/40;
   const from=haloPoint(a,radius,97),to=haloPoint(b,radius,97);
   beam(v,from,to,7,6,PALETTE.haloDark);
   if(i%4===0){
    beam(v,from,haloPoint(a,radius,227),10,10,PALETTE.halo);
    beam(v,haloPoint(a,radius,227),haloPoint(b,radius,227),7,7,PALETTE.haloLight);
   }
  }
 }
 // The core inside the hairpin is a deep void reactor, not a fake driveable road.
 const c=[-860,0,-10];
 for(const [radius,y] of [[84,10],[103,57],[115,124],[92,187],[66,262]])loop(v,c,radius,y,5,PALETTE.reactorLight,48);
 for(let i=0;i<20;i++){
  const a=TAU*i/20,p=(radius,y)=>[c[0]+radius*Math.cos(a),y,c[2]+radius*Math.sin(a)];
  beam(v,p(104,0),p(104,245),8,9,PALETTE.haloDark,i%4===0?PALETTE.haloLight:null);
  if(i%2===0)beam(v,p(106,128),p(65,262),5,6,PALETTE.reactor);
 }
 for(let i=0;i<14;i++){
  const a=TAU*i/14,r=115;
  beam(v,[c[0]+r*Math.cos(a),58,c[2]+r*Math.sin(a)],
   [c[0]+r*Math.cos(a),-155,c[2]+r*Math.sin(a)],11,12,PALETTE.haloDark);
 }
}
function spiralMegaStructure(v){
 const c=[-170,0,-10];
 // Perimeter towers beyond the entire 430m center-radius spiral skin.
 for(let i=0;i<16;i++){
  const a=TAU*i/16,x=c[0]+517*Math.cos(a),z=c[2]+517*Math.sin(a);
  beam(v,[x,-114,z],[x,302+(i%4)*21,z],13,16,PALETTE.spiral,i%3===0?PALETTE.spiralLight:null);
  const inward=[c[0]+479*Math.cos(a),242,c[2]+479*Math.sin(a)];
  beam(v,[x,275,z],inward,9,8,PALETTE.spiralLight);
 }
 for(const [radius,y,width] of [[503,-65,8],[499,128,9],[502,290,12],[480,339,7]]){
  loop(v,c,radius,y,width,y>280?PALETTE.spiralLight:PALETTE.spiral,72);
 }
 // Enormous suspended crown bridges criss-cross the roof above the spiral.
 for(let i=0;i<8;i++){
  const a=PI*i/8;
  beam(v,
   [c[0]+500*Math.cos(a),349,c[2]+500*Math.sin(a)],
   [c[0]-500*Math.cos(a),349,c[2]-500*Math.sin(a)],
   8,9,PALETTE.spiral,PALETTE.spiralLight);
 }
 for(let i=0;i<20;i++){
  const t=i/20,a=PI+2.5*PI*t,p=[c[0]+440*Math.cos(a),150-58*t,c[2]+440*Math.sin(a)];
  beam(v,[p[0],p[1]+84,p[2]],[p[0],342,p[2]],3.5,4.5,PALETTE.spiralLight);
 }
}
function forkMegaStructure(v){
 // Four 350m wide, 140m tall, genuinely three-dimensional overhead bridges.
 // Their underside remains high above the roads; NO physics surfaces added.
 for(let i=0;i<9;i++){
  const x=190+i*77,y=229+(i%3)*12;
  for(const z of [-210,-668]){
   beam(v,[x,18,z],[x,y,z],13,15,PALETTE.fork,i%2?PALETTE.forkLight:null);
   beam(v,[x-10,y+10,z],[x+10,y+10,z],12,10,PALETTE.forkLight);
  }
  beam(v,[x,y,-210],[x,y,-668],10,12,PALETTE.fork,PALETTE.forkLight);
  if(i%2===0)beam(v,[x,y+42,-210],[x,y,-439],4,4,PALETTE.forkLight);
  if(i%2===0)beam(v,[x,y+42,-668],[x,y,-439],4,4,PALETTE.forkLight);
 }
 // Three-dimensional branching crowns, rather than another line of road props.
 for(let i=0;i<8;i++){
  const x=200+i*92,z=i%2?-303:-567;
  const y=115+(i%3)*14;
  beam(v,[x,y,z],[x,y+205,z],10,10,PALETTE.fork);
  for(const dz of [-43,43]){
   beam(v,[x,y+157,z],[x+28,y+185,z+dz],6,7,PALETTE.forkLight);
  }
 }
}
function layeredSkyline(v){
 // A sparse stepped backdrop makes the 3D track read as a city-scale artifact.
 // Objects are distant silhouettes, not obstacles or solid extra roads.
 for(let i=0;i<26;i++){
  const x=-1430+(i%13)*225,z=i<13?-880:340;
  if(x>-300&&x<450&&z===340)continue; // preserve the spiral's outer void view
  const height=145+(i*37)%250,width=18+(i%5)*7;
  beam(v,[x,-210,z],[x,height-210,z],width,width,PALETTE.city,
    i%5===0?PALETTE.cityLight:null);
  beam(v,[x,height-210,z],[x,height-190,z],8,8,PALETTE.cityLight);
  for(const offset of [-1,1]){
   if(i%3===0)beam(v,[x,height-235,z],[x+offset*(width+18),height-274,z],4,5,PALETTE.cityLight);
  }
 }
}
export function megastructureGeometry(stage,sample){
 if(['VB-P93','VB-P95','VB-P99'].includes(stage?.stageForge?.id))return voidBreakerGeometry(stage,sample);
 if(stage?.stageForge?.id!=='EP-P66')return {vertices:[],beams:0,sections:[]};
 if(!stage.visualBlueprint||stage.visualBlueprint.schema!=='dopagaki.stageforge.visual/1')
  throw Error('P82 requires the original P66 visual blueprint');
 const vertices=[],sections=[];
 for(const [name,build] of [
  ['HALO_CROWN',haloMegaStructure],
  ['SPIRAL_SKY_VAULT',spiralMegaStructure],
  ['FORK_SKY_BRIDGES',forkMegaStructure],
  ['DISTANT_CITY_SILHOUETTES',layeredSkyline]
 ]){
  const before=vertices.length;build(vertices);
  sections.push({name,triangles:(vertices.length-before)/18});
 }
 if(vertices.length>900000)throw Error('P82 GPU vertex budget overflow');
 return {vertices,beams:Math.round(vertices.length/216),sections};
}

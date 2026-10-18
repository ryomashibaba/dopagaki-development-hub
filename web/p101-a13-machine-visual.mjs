/**
 * P101 A13 W5 — large, native-volume-faithful moving machinery appearance.
 * This is GPU geometry only, not new physics or a substitute for B51-C
 * boxes. The dark fully opaque armored envelope warns of true collision
 * throughout the physical OBB; color identifies physical response type.
 */
const colors=Object.freeze({
 fail:{glow:[1,.25,.31],steel:[.14,.19,.25],edge:[.52,.22,.26]},
 bounce:{glow:[1,.77,.27],steel:[.18,.19,.22],edge:[.58,.48,.25]},
 push:{glow:[.71,.38,1],steel:[.18,.16,.26],edge:[.43,.26,.64]}
});
const supported=new Set(['slider','rotator','piston']);
const tri=(out,a,b,c,color)=>{for(const p of [a,b,c])out.push(...p,...color);};
const quad=(out,a,b,c,d,col)=>{tri(out,a,b,c,col);tri(out,a,c,d,col);};
function cuboid(out,a,b,col){
 const v=[
 [a[0],a[1],a[2]],[b[0],a[1],a[2]],[b[0],b[1],a[2]],[a[0],b[1],a[2]],
 [a[0],a[1],b[2]],[b[0],a[1],b[2]],[b[0],b[1],b[2]],[a[0],b[1],b[2]]
 ];
 for(const [i,j,k,l] of [[0,1,2,3],[4,7,6,5],[0,4,5,1],[3,2,6,7],[0,3,7,4],[1,5,6,2]])quad(out,v[i],v[j],v[k],v[l],col);
}
const bright=([r,g,b],scale)=>[r*scale,g*scale,b*scale];
export function a13MachineBodyVertices(type,mode){
 if(!supported.has(type)||!colors[mode])throw Error('A13 unknown native type or collision mode');
 const {glow,steel,edge}=colors[mode],out=[];
 // Visibly solid armored entire collision hull: NEVER depict hollow safe openings.
 cuboid(out,[-.499,-.499,-.499],[.499,.499,.499],steel);
 for(const sign of [-1,1]){
  const z=sign*.5002;
  // Wide beveled hazard wedges on each exposed face, with a directional
  // taper; their motion comes exclusively from native movingObstaclePose.
  for(let j=0;j<5;j++){
   const x=-.46+j*.19;
   const color=j%2?bright(glow,.36):bright(glow,.78);
   const offset=type==='rotator'?(j%2?-.1:.1):type==='slider'?(j%2?.08:-.08):0;
   quad(out,[x,-.40,z],[x+.085,-.40,z],[x+.15+offset,.38,z],[x+.06+offset,.38,z],color);
  }
  // Up/down status ticks read clearly even at distance.
  for(let j=0;j<4;j++){
   const y=-.4+j*.26;
   cuboid(out,[-.485,y,z-.001],[ -.43,y+.10,z+.001],glow);
  }
 }
 for(const y of [-.455,.455]){
  cuboid(out,[-.50,y-.044,-.50],[.50,y+.044,.50],edge);
 }
 if(type==='slider'){
  // MOVING TRANSIT: long lateral sled chassis, open rail impression only
  // INSIDE its opaque physical body (no fictitious passable gap).
  cuboid(out,[-.48,-.20,-.502],[.48,-.08,-.50],glow);
  cuboid(out,[-.48,.10,.50],[.48,.20,.502],glow);
  for(let i=0;i<7;i++){
   const x=-.43+i*.14;
   cuboid(out,[x,-.44,-.502],[x+.055,.43,-.50],i%2?edge:bright(glow,.57));
  }
 }else if(type==='rotator'){
  // REACTOR ROTOR: a rotating imprinted hub + radial turbine teeth,
  // all contained by the actual long sweep-arm's collision box.
  const z=.502,center=[-.16,0,z],radius=.28;
  for(let i=0;i<12;i++){
   const a=i*Math.PI/6,b=(i+1)*Math.PI/6;
   const p=(t,r)=>[center[0]+Math.cos(t)*r,Math.sin(t)*r,z];
   tri(out,p(a,.12),p(a,.27),p(b,.19),i%2?glow:edge);
  }
  cuboid(out,[-.11,-.085,.501],[.46,.085,.502],glow);
  for(let i=0;i<6;i++){
   const x=-.32+i*.14;
   cuboid(out,[x,-.45,-.502],[x+.045,.45,-.50],i%2?glow:edge);
  }
 }else{
  // IRIS PRESS: stacked guillotine plates, thick hydraulic end pistons.
  cuboid(out,[-.30,-.48,-.502],[.30,.48,-.50],edge);
  for(let i=0;i<5;i++){
   const y=-.38+i*.19;
   const shade=i%2?glow:bright(glow,.57);
   quad(out,[-.36,y,-.503],[.36,y,-.503],[.22,y+.105,-.503],[-.22,y+.105,-.503],shade);
  }
  for(const x of [-.435,.435]){
   cuboid(out,[x-.035,-.48,-.503],[x+.035,.48,-.501],glow);
  }
 }
 if(out.length%18!==0||!out.every(Number.isFinite))
  throw Error('Invalid A13 native machine GPU triangle buffer');
 // No visible feature can protrude materially beyond its actual B51-C OBB.
 for(let k=0;k<out.length;k+=6)
  for(let j=0;j<3;j++)if(Math.abs(out[k+j])>.504)throw Error('A13 visual outside physical OBB');
 return out;
}

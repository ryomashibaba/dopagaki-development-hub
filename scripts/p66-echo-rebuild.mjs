/**
 * P66 ECHO PIPE / RESONANCE CATHEDRAL - EXPERIMENTAL HIGH-IMPACT PLAYABLE STAGE.
 * New stage, not an edit of any SHA-frozen P62 original or B45/B51-C physics file.
 * Constructed as true B48 Catmull-Rom physical road skins. Monument metadata is visual only.
 */
import {validate,sample} from '../private/reference_only/director/surface.js';

const PI=Math.PI,TAU=PI*2;
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const ease=t=>t*t*(3-2*t);
const vec=(x,y,z)=>[x,y,z];
const normalized=a=>{const n=Math.hypot(...a)||1;return a.map(x=>x/n);};
const portions=[
  {id:'PIPE_DIVE_A',name:'01 / PIPE BREACH — suspended intake',fn:t=>vec(-1080+480*t,245-95*ease(t),-10+52*Math.sin(PI*t)**2),pieces:2,width:34,bank:t=>.055*Math.sin(PI*t)},
  {id:'SPIRAL_CATHEDRAL',name:'02 / CATHEDRAL SPIRAL — 450° downward',fn:t=>vec(-450+150*Math.cos(PI+2.5*PI*t),150-58*ease(t),-10+150*Math.sin(PI+2.5*PI*t)),pieces:6,width:33,bank:t=>.22},
  {id:'FORK_APPROACH',name:'03 / GIANT BELLS — fork entry',fn:t=>vec(-450+320*t,92-8*ease(t),140+30*Math.sin(PI*t)**2),pieces:2,width:40,bank:t=>.04*Math.sin(TAU*t)},
  {id:'FORK_L',name:'04 L / BELL VAULT — outer bank',fn:t=>vec(-130+430*t,84-4*ease(t)-8*Math.sin(PI*t)**2,140+105*Math.sin(PI*t)**2),pieces:2,width:25,bank:t=>.12*Math.sin(PI*t)},
  {id:'FORK_R',name:'04 R / ORGAN SKYBRIDGE — upper fork',fn:t=>vec(-130+430*t,84-4*ease(t)+19*Math.sin(PI*t)**2,140-112*Math.sin(PI*t)**2),pieces:2,width:25,bank:t=>-.14*Math.sin(PI*t)},
  {id:'FORK_REJOIN',name:'05 / TWO-LAYER REJOIN',fn:t=>vec(300+260*t,80-7*ease(t),140+28*Math.sin(PI*t)**2),pieces:1,width:36,bank:t=>.07*Math.sin(PI*t)},
  {id:'MACHINE_CHAMBER',name:'06 / MACHINE GAUNTLET — rotating masses',fn:t=>vec(560+460*t,73-3*ease(t),140-62*Math.sin(.5*PI*t)**2),pieces:3,width:36,bank:t=>-.1*Math.sin(PI*t)},
  {id:'GAP_TAKEOFF',name:'07 / SKY CRACK — unassisted ramp',fn:t=>vec(1020+180*t,70+18*t*t,78-17*Math.sin(PI*t)**2),pieces:1,width:30,bank:t=>.04*Math.sin(PI*t)},
  // 25 metres of genuine missing physical road. No hidden bridge or jump pad.
  {id:'GAP_LANDING',name:'08 / FALLING SKY — descending touchdown',fn:t=>vec(1225+275*t,83-38*ease(t),78+60*Math.sin(PI*t)**2),pieces:2,width:39,bank:t=>-.08*Math.sin(PI*t)}
];
const roadSurface=(id,title,fn,a,b,width,bank)=>{
 const rows=25,cols=5,points=[];
 for(let i=0;i<rows;i++){
  const u=i/(rows-1),t=a+(b-a)*u,p=fn(t),before=fn(clamp(t-.0002)),after=fn(clamp(t+.0002));
  const dx=after[0]-before[0],dz=after[2]-before[2];
  const right=normalized([-dz,0,dx]);
  const theta=bank(t);
  const widthAt=width*(.95+.05*Math.cos(TAU*u));
  for(let j=0;j<cols;j++){
   const side=(j/(cols-1)-.5)*widthAt;
   points.push(vec(p[0]+right[0]*side*Math.cos(theta),p[1]+side*Math.sin(theta),p[2]+right[2]*side*Math.cos(theta)));
  }
 }
 return {id,name:title,rows,cols,points,resolution:2,rideable:true,collidable:true,material:'road',thickness:1.3};
};
const roads=[],chunks={};
for(const part of portions){
 chunks[part.id]=[];
 for(let i=0;i<part.pieces;i++){
  const id='p66-'+part.id+'-'+String(i+1).padStart(2,'0');
  const s=roadSurface(id,part.name,part.fn,i/part.pieces,(i+1)/part.pieces,part.width,part.bank);
  roads.push(s);chunks[part.id].push(s);
 }
}
const entryOrder=['PIPE_DIVE_A','SPIRAL_CATHEDRAL','FORK_APPROACH','FORK_L','FORK_REJOIN','MACHINE_CHAMBER','GAP_TAKEOFF','GAP_LANDING'];
const route=entryOrder.flatMap(k=>chunks[k].flatMap(s=>Array.from({length:15},(_,i)=>sample(s,(i+.01)/15,.5))));
route.push(sample(chunks.GAP_LANDING.at(-1),.999,.5));
const routeSegments=roads.map(s=>({surface:s.id,u0:0,u1:1,v:.5}));
const spawnAt=(name,k,piece,u=.06)=>({name,surface:chunks[k][piece].id,u,v:.5});
const spawns=[
 spawnAt('00 / 全編・巨大管へ突入','PIPE_DIVE_A',0),
 spawnAt('01 / 大空洞450°急旋回','SPIRAL_CATHEDRAL',0),
 spawnAt('02 / 立体分岐（左・大聖堂）','FORK_L',0),
 spawnAt('03 / 立体分岐（右・空中橋）','FORK_R',0),
 spawnAt('04 / 巨大機械回避','MACHINE_CHAMBER',0),
 spawnAt('05 / 自然ジャンプへ接近','GAP_TAKEOFF',0,.74)
];
// B51-C: three distinct native moving obstacle mechanisms. Center lane is not permanently safe.
const lateral=(p,delta)=>[p[0],p[1],p[2]+delta];
const movingObstacles=[];
const machine=portions.find(p=>p.id==='MACHINE_CHAMBER').fn;
for(let i=0;i<6;i++){
 const t=.15+i*.13,p=machine(t),id='p66-machine-'+(i+1),side=(i%2===0?-1:1);
 if(i%3===0){
  movingObstacles.push({id,name:'P66 / TRANSVERSE SLIDER '+(i+1),type:'slider',position:lateral(p,side*7),size:[5.8,4.5,6],period:4.3+i*.18,phase:.17*i,yawDegrees:0,collision:{mode:'fail'},motion:{axis:[0,0,1],amplitude:8,timing:{easing:'smoothstep',dwellSeconds:.24}}});
 }else if(i%3===1){
  movingObstacles.push({id,name:'P66 / SWEEPING ARM '+(i+1),type:'rotator',position:lateral(p,side*11),size:[10,2.7,2],period:5+i*.17,phase:.08*i,yawDegrees:0,collision:{mode:'bounce',restitution:.72},motion:{direction:side,baseAngleDegrees:30,timing:{easing:'cosine',dwellSeconds:.24}}});
 }else{
  movingObstacles.push({id,name:'P66 / OVERHEAD PISTON '+(i+1),type:'piston',position:[p[0],p[1]+7,p[2]+side*6],size:[6,3.5,6],period:5+i*.13,phase:.1*i,yawDegrees:0,collision:{mode:'push',pushStrength:1.15},motion:{stroke:7,timing:{easing:'quintic',dwellSeconds:.25}}});
 }
}
const fixtures=[];
const mark=(kind,id,p,size,yaw=0)=>fixtures.push({id,kind,position:p,size,yaw,enabled:true});
for(let i=0;i<5;i++){
 const t=.14+i*.17,p=portions.find(q=>q.id==='PIPE_DIVE_A').fn(t);
 mark('tunnel','p66-pipe-arch-'+i,[p[0],p[1]-1,p[2]],[73,55,3],90);
}
for(let i=0;i<6;i++){
 const t=.08+i*.16,p=machine(t);
 mark('marker','p66-warning-'+i,[p[0]-15,p[1],p[2]+(i%2?14:-14)],[1.5,5,1],0);
}
for(let i=0;i<4;i++){
 const p=portions.find(q=>q.id==='GAP_LANDING').fn((i+1)/5);
 mark('coinGold','p66-air-reward-'+i,[p[0],p[1]+1,p[2]],[1.7,1.7,1.7]);
}
// Scenery only. Large-scale architecture is rendered by the separate P66 WebGL mesh adapter;
// it does not participate in B48 collision and does not consume the 32-surface physics cap.
const visualBlueprint={schema:'dopagaki.stageforge.visual/1',theme:'RESONANCE_CATHEDRAL',
 pipeRings:Array.from({length:6},(_,i)=>({center:[-1060+i*86,190-i*13,-10],axis:'x',radius:75+i*3,width:6})),
 spiralRings:Array.from({length:6},(_,i)=>({center:[-450,70+i*30,-10],axis:'y',radius:158,width:7})),
 organPipes:Array.from({length:18},(_,i)=>{
  const side=i%2?1:-1,q=Math.floor(i/2);
  return {center:[-1070+q*74,122,side*(110+q%3*18)],radius:13+q%3*6,height:175+q%4*31};
 }),
 branchHoops:Array.from({length:9},(_,i)=>({center:[-115+i*81,99,140+(i%2?82:-82)],axis:'x',radius:65,width:4})),
 machinery:Array.from({length:10},(_,i)=>({center:[590+i*43,95,79],axis:'x',radius:58+(i%3)*8,width:7})),
 abyssPylons:Array.from({length:8},(_,i)=>({center:[1080+i*57,-9,i%2?160:-12],radius:11,height:175+(i%3)*35}))
};
const doc={
 schema:'dopagaki.track-director/1',
 name:'ECHO PIPE — RESONANCE CATHEDRAL RUSH / P66 EXPERIMENTAL',
 surfaces:roads,route,routeSegments,spawns,autoRoute:true,generatedRoute:true,fixtures,movingObstacles,
 visualBlueprint,
 stageForge:{id:'EP-P66',batch:'P66_RESONANCE_CATHEDRAL',status:'EXPERIMENTAL_HUMAN_UNTESTED',
  design:'REAL 3D RUSH COURSE; NOT P62 RESKIN',physicalChapters:8,
  features:['95m pipe descent','450-degree 3D cathedral spiral','two physical route branches','six moving machine encounters','25m real road gap with natural ramp launch','multilevel architectural fly-through'],
  oldP62FilesModified:false,B45PhysicsModified:false,jumpBoosterPlaced:false,dynamicMidForkChoice:'NOT_YET_VERIFIED',
  humanPlaytest:'NOT_RUN',finalVisualQuality:'NOT_APPROVED'}
};
export function generateEchoRush(){return validate(doc);}
export const P66_GEOMETRY=Object.freeze({roadSurfaces:roads.length,gapMeters:25,spiralAngleDegrees:450,physicalBranches:2,moving:6});

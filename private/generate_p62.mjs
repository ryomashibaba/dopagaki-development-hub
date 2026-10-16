/** P62: architectural kinetic galleries, built on P61 without duplicating Moving Lab physics. */
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
import {parse,sample} from './reference_only/director/surface.js';
import {normalizeMovingObstacles,validateMovingObstacle} from './reference_only/director/moving/moving-obstacles.mjs';
import {FIXTURE_IMPULSES} from './reference_only/director/physics.js';
import {fixtureTouches} from './reference_only/director/game-fixtures.js';
const root=path.dirname(new URL(import.meta.url).pathname);const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const mods={
 'EP-001':{label:'RESONANCE CATHEDRAL / LIVE PIPE INTERIOR',style:'pipe',left:['piston','bounce'],right:['slider','fail'],period:[4.6,5.5],phase:[.13,.62]},
 'HS-001':{label:'CELESTIAL CHAMBER / GRAVITY HALO ARRAY',style:'orbital',left:['rotator','bounce'],right:['piston','push'],period:[5.2,5.1],phase:[.25,.6]},
 'WV-001':{label:'MONSOON CANNON / SHOCKWAVE STABILIZER',style:'wave',left:['slider','fail'],right:['rotator','bounce'],period:[4.8,6.1],phase:[.08,.4]},
 'HG-001':{label:'ROOT SANCTUM / FLOATING ARBORETUM',style:'garden',left:['piston','push'],right:['slider','fail'],period:[5.8,4.6],phase:[.2,.73]},
};
const add=(a,b)=>a.map((x,i)=>x+b[i]),mul=(a,t)=>a.map(x=>x*t),sub=(a,b)=>a.map((x,i)=>x-b[i]);
const norm=a=>mul(a,1/Math.hypot(...a));const pos=(s,u,v)=>sample(s,Math.max(0,Math.min(1,u)),Math.max(0,Math.min(1,v)));
const frame=(s,u)=>{const q=pos(s,u,.5),d=sub(pos(s,u+.002,.5),pos(s,u-.002,.5)),forward=norm([d[0],0,d[2]]),right=[-forward[2],0,forward[0]];return {q,right,forward};};
const rnd=n=>Math.round(n*100000)/100000;
function newCanopy(s,side,style){
 const points=[],rows=21,cols=13;
 for(let i=0;i<rows;i++){
  const t=i/(rows-1),u=.1+.8*t,fr=frame(s,u),phase=2*Math.PI*t;
  for(let j=0;j<cols;j++){
   const v=j/(cols-1),theta=Math.PI*(.085+.83*v),c=Math.cos(theta),rise=Math.sin(theta);
   let radial,height,longitudinal,shift;
   if(style==='pipe'){radial=40+7*Math.sin(phase*8)+9*Math.sin(phase*2+(side==='L'?0:1));height=35+14*Math.sin(phase*6)**2;shift=6*Math.sin(phase*3);longitudinal=2*Math.sin(theta*3+phase*7);}
   else if(style==='orbital'){radial=67+17*Math.sin(phase*2+theta*.4);height=65+18*Math.cos(phase*2);shift=13*Math.sin(phase*2+theta);longitudinal=14*Math.sin(theta*1.5+phase*3);}
   else if(style==='wave'){radial=52+19*Math.sin(phase*3+theta);height=45+24*Math.sin(phase*4+theta*.65)**2;shift=18*Math.sin(phase*3);longitudinal=16*Math.sin(phase*3+theta*2);}
   else {radial=74+24*Math.cos(phase*2+theta*2);height=64+16*Math.sin(phase*3+theta)**2;shift=22*Math.cos(phase+theta);longitudinal=13*Math.cos(phase*2+theta*3);}
   const sign=side==='L'?-1:1;
   const p=add(add(fr.q,mul(fr.right,radial*c+sign*shift)),mul(fr.forward,longitudinal));
   p[1]+=12+height*rise+(style==='garden'?7*Math.sin(phase*3+theta*5)**2:0);
   points.push(p.map(rnd));
  }
 }
 return {rows,cols,resolution:3,points,rideable:false,collidable:false,material:'shell',thickness:.85};
}
function fixture(id,kind,position,size,yaw){return{id,kind,position:position.map(rnd),size,yaw:rnd(yaw),enabled:true};}
function flankSupport(s,u,side){const p=pos(s,u,side==='L'?0:1),c=pos(s,u,.5),delta=norm([p[0]-c[0],0,p[2]-c[2]]);return add(p,mul(delta,8));}
function newMachine(s,stage,side,type,mode,period,phase){
 const u=side==='L'?.36:.69,v=side==='L'?.14:(type==='piston'?.055:.16),origin=pos(s,u,v),fr=frame(s,u);
 const id=`p62-${stage}-${side}-${type}`;
 const collision=mode==='fail'?{mode}:mode==='bounce'?{mode,restitution:.7}:{mode,pushStrength:1};
 const ob={id,name:`P62 ${stage} ${side} ${type} ${mode}`,type,position:[origin[0],origin[1]+3.8,origin[2]].map(rnd),period,phase,enabled:true,
  yawDegrees:rnd(Math.atan2(-fr.right[2],fr.right[0])*180/Math.PI),collision,
  size:type==='rotator'?[7.2,2.2,1.6]:type==='slider'?[5.1,2.7,1.9]:[5.8,2.8,2.4],
  motion:type==='slider'?{axis:fr.right.map(rnd),amplitude:2.7,timing:{easing:'smoothstep',dwellSeconds:.28}}:type==='piston'?{stroke:4.2,timing:{easing:'quintic',dwellSeconds:.25}}:{direction:side==='L'?1:-1,baseAngleDegrees:0,timing:{easing:'cosine',dwellSeconds:.32}}};
 // Horizontal slider axis must have exactly Y = 0; normalization is from the canonical library.
 return validateMovingObstacle(ob);
}
if(JSON.stringify(FIXTURE_IMPULSES)!==JSON.stringify({shove:{side:10,lift:8,forward:3},boosterCube:{horizontal:10,minUpward:30}}))throw Error('B45 fixed physical constants changed');
let summary=[];fs.mkdirSync(root+'/generated',{recursive:true});fs.mkdirSync(root+'/reports',{recursive:true});
for(const source of fs.readdirSync(root+'/source_p61').filter(x=>x.endsWith('.json')).sort()){
 const parentBytes=fs.readFileSync(root+'/source_p61/'+source),doc=parse(parentBytes.toString()),sid=doc.stageForge.id,config=mods[sid];
 if(!config)throw Error('Unexpected stage '+sid);
 const original=structuredClone(doc);const upgraded=[];
 for(const side of ['L','R']){
  const branch=doc.surfaces.find(x=>x.id===sid+'-P55-'+side),target=doc.surfaces.find(x=>x.id===sid+'-P56-'+side+'-MONUMENT');
  if(!branch||!target||target.rideable||target.collidable)throw Error('Missing scenic target');
  Object.assign(target,newCanopy(branch,side,config.style));target.name=`P62 ${config.label} / ${side} KINETIC VAULT`;
  upgraded.push(target.id);
  const [type,mode]=config[side==='L'?'left':'right'];const ob=newMachine(branch,sid,side,type,mode,config.period[side==='L'?0:1],config.phase[side==='L'?0:1]);doc.movingObstacles.push(ob);
  // Six massive external supports plus three spanning beams per stage side. They are actual fixed colliders.
  for(let k=0;k<3;k++){
   let u=[.2,.51,.81][k],fr=frame(branch,u),p=pos(branch,u,.5),left=flankSupport(branch,u,'L'),right=flankSupport(branch,u,'R');
   let total=Math.hypot(right[0]-left[0],right[2]-left[2]);const yaw=Math.atan2(-fr.right[2],fr.right[0])*180/Math.PI;
   for(const [slot,edge] of [['A',left],['B',right]])doc.fixtures.push(fixture(`p62-${sid}-${side}-TOWER-${k+1}${slot}`,'pylon',[edge[0],edge[1]-9,edge[2]],[2.5,45,2.5],yaw));
   doc.fixtures.push(fixture(`p62-${sid}-${side}-SPAN-${k+1}`,'wall',[p[0],p[1]+35,p[2]],[Math.min(120,total+3),2.7,2.8],yaw));
  }
  // Pair of visible course-side prompts; marker behavior does not affect native physics.
  for(const t of [.23,.76]){const p=pos(branch,t,.10);doc.fixtures.push(fixture(`p62-${sid}-${side}-SIGN-${Math.round(t*100)}`,'marker',[p[0],p[1]+4,p[2]],[2.3,4,1.6],0));}
 }
 // Move support pillars away from *all* playable surfaces, including the neighboring branch.
 // Keep transverse beams above the roadway; do not sacrifice safety for a visual frame.
 const roadProbes=[];
 for(const rs of doc.surfaces.filter(x=>x.rideable&&x.collidable))for(let i=0;i<=220;i++)for(const v of [.05,.08,.18,.22,.31,.36,.5,.64,.69,.78,.82,.92,.95]){
  const p=pos(rs,i/220,v);roadProbes.push([p[0],p[1]+.65,p[2]]);
 }
 const relocations=[];
 for(const tower of doc.fixtures.filter(x=>x.id.startsWith(`p62-${sid}-`)&&x.id.includes('-TOWER-'))){
  const match=tower.id.match(/-(L|R)-TOWER-(\d+)(A|B)$/),branch=doc.surfaces.find(s=>s.id===`${sid}-P55-${match[1]}`),u=[.2,.51,.81][Number(match[2])-1],fr=frame(branch,u);
  const source=[...tower.position],center=fr.q,rad=norm([source[0]-center[0],0,source[2]-center[2]]);
  const crossable=pos=>!roadProbes.some(p=>Math.abs(p[1]-(pos[1]+tower.size[1]/2))<tower.size[1]/2+1.2&&Math.hypot(p[0]-pos[0],p[2]-pos[2])<2.9&&fixtureTouches({...tower,position:pos},p,.65));
  let safe=null;
  outer:for(const ext of [0,6,12,20,28,38,50,65])for(const shift of [0,8,-8,16,-16,28,-28,40,-40]){
   const candidate=[source[0]+rad[0]*ext+fr.forward[0]*shift,source[1],source[2]+rad[2]*ext+fr.forward[2]*shift].map(rnd);
   if(crossable(candidate)){safe=candidate;break outer;}
  }
  if(!safe)throw Error(`No clear P62 tower position ${tower.id}`);
  if(JSON.stringify(safe)!==JSON.stringify(source)){tower.position=safe;relocations.push({id:tower.id,from:source,to:safe});}
 }
 // The sole changes are two noncollidable scenic surfaces, two native moving descriptors and 22 fixed objects.
 const priorSurface=new Map(original.surfaces.map(x=>[x.id,x]));
 for(const s of doc.surfaces)if(!upgraded.includes(s.id)&&JSON.stringify(s)!==JSON.stringify(priorSurface.get(s.id)))throw Error('Unexpected road or shell change');
 if(doc.movingObstacles.length!==original.movingObstacles.length+2||doc.fixtures.length!==original.fixtures.length+22)throw Error('Unexpected counts');
 doc.stageForge.P62={status:'EXPERIMENTAL_UNAPPROVED',title:config.label,sourceP61File:source,parentP61SHA256:sha(parentBytes),changedVisualShells:upgraded,addedMovingObjects:doc.movingObstacles.slice(-2).map(o=>o.id),addedStaticFixtures:22,relocatedTowers:relocations,roadsAltered:false,priorMovingAltered:false,physicsAltered:false,b45Frozen:true,humanAcceptance:'NOT_VERIFIED'};
 const json=JSON.stringify(parse(JSON.stringify(doc)),null,2)+'\n',destination=source.replace('_P61_GRAZING_CONTACT_BALANCE','_P62_KINETIC_ARCHITECTURE');
 fs.writeFileSync(root+'/generated/'+destination,json);
 summary.push({stage:sid,label:config.label,parentSHA256:sha(parentBytes),output:destination,sha256:sha(json),surfaceCount:doc.surfaces.length,fixtureCount:doc.fixtures.length,movingCount:doc.movingObstacles.length,changedVisualShells:upgraded,addedMoving:doc.movingObstacles.slice(-2).map(o=>({id:o.id,type:o.type,mode:o.collision.mode,position:o.position,period:o.period})),roadSame:original.surfaces.filter(s=>s.rideable).every(s=>JSON.stringify(s)===JSON.stringify(doc.surfaces.find(t=>t.id===s.id)))});
}
fs.writeFileSync(root+'/reports/P62_GENERATION.json',JSON.stringify(summary,null,2)+'\n');
console.log('P62 generated',summary.map(x=>({stage:x.stage,fixtureCount:x.fixtureCount,movingCount:x.movingCount,sha:x.sha256.slice(0,10)})));

/**
 * P84 / HIGH-SPEED ROAD CLARITY
 * Read-only shoulder reflectors derived from the exact B48 sampled road skin.
 * They are GPU LINES only: no colliders, steering assistance, auto lane choice,
 * road alteration, scoring or extra physical surfaces.
 */
import {chapterFromSurface} from './p80-trackflow.mjs';

export const FOG_START_METERS=520;
export const FOG_SPAN_METERS=1900;
export const FOG_MAX=.72;
export const LIGHT_MAX_VERTICES=32000;

const COLORS=Object.freeze({
 pipe:[.2,.87,1],return:[.2,1,.72],spiral:[.83,.48,1],
 fork:[.46,.82,1],rejoin:[.29,1,.86],machines:[1,.57,.19],
 jump:[1,.93,.28],landing:[.25,1,.75],other:[.64,.9,1]
});
const plus=(a,b)=>a.map((x,i)=>x+b[i]);
const scale=(a,k)=>a.map(x=>x*k);
const dist=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
const add=(v,p,c)=>v.push(p[0],p[1],p[2],...c);
const line=(v,a,b,c)=>{add(v,a,c);add(v,b,c);};
function alongNormal(p,raw,length){
 const n=Math.hypot(...raw)||1,side=raw[1]<0?-1:1;
 return plus(p,scale(raw,side*length/n));
}
export function fogFraction(distance,enabled=true){
 if(!Number.isFinite(distance)||distance<0)throw Error('Invalid fog distance');
 return enabled?FOG_MAX*Math.min(1,Math.max(0,(distance-FOG_START_METERS)/FOG_SPAN_METERS)):0;
}
export function roadShoulderLights(doc,sample,frame,{spacing=38,maxPerSurface=70}={}){
 if(typeof sample!=='function'||typeof frame!=='function')throw Error('Canonical B48 road samplers required');
 if(!(spacing>=18&&spacing<=150)||!Number.isInteger(maxPerSurface)||maxPerSurface<1||maxPerSurface>100)
  throw Error('Invalid road visibility density');
 const v=[];let beacons=0,roads=0;
 // P98 actual Chromium frames showed VOID BREAKER's huge cyan road had almost
 // no visible edges at 100–140m/s. Reuse ORIGINAL B48 road-edge reflectors
 // without adding collision walls, lane assistance or modifying physics.
 // P62 immutable originals remain excluded; P66 original geometry unchanged.
 const isVoid=['VB-P93','VB-P95','VB-P99','VB-P100'].includes(doc?.stageForge?.id);
 if(doc?.stageForge?.id!=='EP-P66'&&!isVoid)return {vertices:v,beacons,roads,physical:false};
 for(const [roadIndex,s] of (doc.surfaces||[]).entries()){
  if(!s.rideable||s.visible===false)continue;
  roads++;
  let length=0,previous=sample(s,0,.5);
  for(let i=1;i<=42;i++){
   const next=sample(s,i/42,.5);length+=dist(next,previous);previous=next;
  }
  const count=Math.min(maxPerSurface,Math.floor(length/spacing));
  if(count<=0)continue;
  const category=chapterFromSurface(s.id)?.id||'other';
  const color=isVoid?(roadIndex%2?[.93,.65,1]:[.54,1,.85]):COLORS[category],lower=color.map(x=>x*.42);
  for(let i=0;i<count;i++){
   const u=(i+.5)/count;
   if(u<=.012||u>=.988)continue;
   // Paired markers follow actual bank orientation rather than world Y.
   for(const side of [.018,.982]){
    const position=sample(s,u,side),normal=frame(s,u,side).normal;
    const base=alongNormal(position,normal,.35);
    const tip=alongNormal(position,normal,2.6);
    const crossV=side<.5?Math.min(.07,side+.025):Math.max(.93,side-.025);
    const crossPoint=sample(s,u,crossV),cap=alongNormal(crossPoint,frame(s,u,crossV).normal,2.6);
    line(v,base,tip,color);
    line(v,tip,cap,lower);
    beacons++;
    if(v.length>LIGHT_MAX_VERTICES*6)throw Error('Road visibility vertex budget exceeded');
   }
  }
 }
 return {vertices:v,beacons,roads,physical:false};
}

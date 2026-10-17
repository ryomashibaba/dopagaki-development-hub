/**
 * P93 VOID BREAKER / SCISSOR ABYSS — original independently authored 3D world.
 *
 * Seven distinct real B48 rideable/collidable Catmull-Rom skins spanning ~4 km:
 * two gigantic opposed 180-degree hairpins, a two-level scissors crossover,
 * 120m dive, 155m dive and a sky crest. No booster, hidden road, teleport or
 * reuse/mutation of the immutable EP-P66/P62 stages and native physics.
 * Candidate: scripted full-course proof and human handling NOT preapproved.
 */
import {validate,sample} from '../private/reference_only/director/surface.js';

const PI=Math.PI, clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const ease=t=>t*t*(3-2*t);
const SECTIONS=Object.freeze([
 {id:'ABYSS_DIVE',name:'I / 120m VOID DIVE',length:430,turn:-.5,rise:-120,width:104,bank:-.035},
 {id:'CROWN_REVERSAL',name:'II / 270m RADIUS SKY CROWN · 180°',length:850,turn:PI,rise:-40,width:125,bank:.18},
 {id:'SCISSOR_RISE',name:'III / SCISSOR BRIDGE ASCENT +110m',length:530,turn:-1.55,rise:110,width:101,bank:-.10},
 {id:'LOWER_REVERSAL',name:'IV / UNDERPASS CROWN · 180° / -155m',length:740,turn:-PI,rise:-155,width:127,bank:-.16},
 {id:'VOID_SURGE',name:'V / LOW LEVEL 120° SURGE',length:620,turn:2.1,rise:-10,width:100,bank:.12},
 {id:'PRISM_CREST',name:'VI / PRISM SKY CREST +95m',length:430,turn:-.9,rise:95,width:92,bank:-.09},
 {id:'FINISH_RIDGE',name:'VII / BLADE RIDGE FINAL S-WEEP',length:390,turn:.75,rise:-30,width:100,bank:.07}
]);
function trackSections(){
 const tracks=[];
 let x=-950,y=245,z=-680,yaw=.15;
 for(const section of SECTIONS){
  const atStart=[x,y,z],baseYaw=yaw,steps=512;
  const centers=[atStart],angle=t=>baseYaw+section.turn*ease(t);
  for(let i=1;i<=steps;i++){
   const t=(i-.5)/steps,theta=angle(t);
   x+=section.length/steps*Math.cos(theta);
   z+=section.length/steps*Math.sin(theta);
   centers.push([x,y+section.rise*ease(i/steps),z]);
  }
  const center=t=>{
   const f=clamp(t)*steps,k=Math.min(steps-1,Math.floor(f)),q=f-k;
   return centers[k].map((v,i)=>v+(centers[k+1][i]-v)*q);
  };
  tracks.push({section,center,angle});
  y+=section.rise;yaw+=section.turn;
 }
 return tracks;
}
function road({section,center,angle},index){
 const rows=31,cols=5,points=[];
 for(let i=0;i<rows;i++){
  const u=i/(rows-1),c=center(u),theta=angle(u);
  const left=[-Math.sin(theta),0,Math.cos(theta)];
  const bank=section.bank*Math.sin(PI*u);
  for(let j=0;j<cols;j++){
   const side=(j/(cols-1)-.5)*section.width;
   points.push([c[0]+left[0]*side*Math.cos(bank),c[1]+side*Math.sin(bank),c[2]+left[2]*side*Math.cos(bank)]);
  }
 }
 return {id:'p93-'+section.id+'-01',name:section.name,rows,cols,points,
  resolution:3,rideable:true,collidable:true,material:'road',thickness:2};
}
export const P93_GEOMETRY=Object.freeze({
 stageId:'VB-P93',roadSurfaces:7,totalLengthMeters:SECTIONS.reduce((s,x)=>s+x.length,0),
 maxDropMeters:155,largestHairpinDegrees:180,source:'INDEPENDENT_ORIGINAL_PHYSICAL_WORLD'
});
export function generateVoidBreaker(){
 const tracks=trackSections(),surfaces=tracks.map(road);
 const route=surfaces.flatMap(s=>Array.from({length:22},(_,i)=>sample(s,(i+.015)/22,.5)));
 route.push(sample(surfaces.at(-1),.999,.5));
 const routeSegments=surfaces.map(s=>({surface:s.id,u0:0,u1:1,v:.5}));
 const spawn=(index,u=.055)=>({name:String(index).padStart(2,'0')+' / '+surfaces[index].name,
  surface:surfaces[index].id,u,v:.5});
 const spawns=[spawn(0),spawn(1,.08),spawn(2,.05),spawn(3,.05),spawn(4,.05),spawn(5,.05)];
 return validate({
  schema:'dopagaki.track-director/1',name:'VOID BREAKER / SCISSOR ABYSS — P93 PHYSICAL CANDIDATE',
  surfaces,route,routeSegments,spawns,autoRoute:true,generatedRoute:true,
  fixtures:[],movingObstacles:[],
  stageForge:{id:'VB-P93',batch:'P93_INDEPENDENT_PHYSICAL_CANDIDATE',
   status:'EXPERIMENTAL_HUMAN_UNTESTED',
   design:'ORIGINAL 3D TWO-TIER SCISSOR WORLD WITH 7 REAL ROAD SKINS',
   features:['120m real downhill','850m sky crown','110m physical ascent',
    '740m opposing hairpin and 155m underpass drop','two-level crossing',
    'prism crest and high-speed finishing ridge'],
   preExistingCourseModified:false,physicsModified:false,autoSteerAssistanceAdded:false,
   humanPlaytest:'NOT_RUN',fullStartToFinish:'NOT_YET_PROVEN',finalVisualQuality:'NOT_APPROVED'}
 });
}

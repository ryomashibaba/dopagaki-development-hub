/**
 * G4E-7DY R1: shift the R0 360m real B48 vertical-slice window toward the
 * actual 15.5s player APPROACH, not 180m behind the 16s camera.
 * Nothing here adds a road, collider, renderer component, or approved artwork.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {generateG4E7BC} from './p101-w9c2-g4e7bc-bank-contour.mjs';
import {g4e7djNativeStoryboard} from './p101-w9c2-g4e7dj-native-storyboard.mjs';
import {buildDoReference} from './p101-w9c2-g4e7do-master-export.mjs';
import {sample} from '../private/reference_only/director/surface.js';
export const DY1_METRES=360;
export const DY1_GATES=Object.freeze([
 'DISCOVER_CIVIC_THRESHOLD','APPROACH_TERRACED_FORUM',
 'THROUGH_PUBLIC_SKY_VOID','TRANSIT_GALLERY_PASS',
 'EXIT_INTO_METROPOLIS'
]);
const round=(x,n=5)=>Number(x.toFixed(n));
const dist=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const add=(a,b)=>a.map((x,i)=>x+b[i]);
const mul=(v,s)=>v.map(x=>x*s);
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
function sourceArc(s){
 const all=[];
 for(let i=0;i<=600;i++){
  const u=i/600,center=sample(s,u,.5);
  all.push({u,center,arc:i?all[i-1].arc+dist(center,all[i-1].center):0});
 }
 return all;
}
function closest(line,point){
 return line.reduce((a,b)=>dist(b.center,point)<dist(a.center,point)?b:a,line[0]);
}
function posAt(s,line,m){
 const n=Math.max(0,Math.min(m,line.at(-1).arc));
 let lo=0,hi=line.length-1;
 while(lo+1<hi){const x=(lo+hi)>>1;if(line[x].arc<n)lo=x;else hi=x;}
 const a=line[lo],b=line[hi],t=(n-a.arc)/(b.arc-a.arc||1);
 const u=a.u+(b.u-a.u)*t;
 const center=sample(s,u,.5),left=sample(s,u,0),right=sample(s,u,1);
 const out=(p)=>{
  const w=sub(p,center),mag=Math.hypot(w[0],w[2]);
  assert.ok(mag>1,'Source B48 edge collapsed');
  return mul([w[0],0,w[2]],1/mag);
 };
 return {u:round(u,8),center,left,right,outerLeft:add(left,mul(out(left),20)),
  outerRight:add(right,mul(out(right),20)),realWidthMeters:round(dist(left,right),3),
  distanceFromWindowStartMeters:round(m,3)};
}
function project(p,c){
 const d=sub(p,c.eye),depth=dot(d,c.front);
 if(depth<=1)return {depth:round(depth),onScreen:false,px:null};
 const x=.5+.5*1.35*dot(d,c.right)/(depth*(1008/645)),y=.5-.5*1.35*dot(d,c.up)/depth;
 return {depth:round(depth),onScreen:x>.12&&x<.88&&y>.14&&y<.79,
  px:[round(x*1008,2),round(y*645,2)],
  occlusionNotTested:true};
}
export function buildDy1ApproachPlan(native=g4e7djNativeStoryboard()){
 assert.equal(native.physicsHz,240);
 const report={schema:'dopagaki.g4e7dy-r1-native-road-approach-city/1',
  exactSource:'UNCHANGED_G4E7BC_ROLLDECK_240HZ_P96_NOT_HUMAN',
  sourceCXBlob:'af076d67492a677d2235e4730aef8cdf4808e106',
  preferredWindow:'15_5_SECOND_FORWARD_B48_SECTION_NOT_CAMERA_BEHIND',
  lengthMetres:DY1_METRES,roads:{},originalB48:7,originalB51:28,
  gap52:true,unchangedPhysics:true,newRoads:0,newColliders:0,
  nativeWebGL:'NOT_RENDERED',human:'NOT_TESTED',art:'HOLD',
  safety:'NOT_CERTIFIED',formalSlope2Meters:0,formalArtAdoption:0,
  merge:'HOLD',publish:'HOLD'};
 for(const road of ['true-pinch','pinch-switch']){
  const s=generateG4E7BC(road,'rollDeck'),frozen=JSON.stringify(s);
  assert.equal(s.surfaces.length,7);assert.equal(s.movingObstacles.length,28);
  assert.deepEqual(s.surfaces[0].voidLongitudinalCells,[52]);
  const p=native.stages[road].frames.find(x=>x.id==='t1550').pose.position;
  const q=native.stages[road].frames.find(x=>x.id==='t1600').pose.position;
  const samples=s.surfaces.map(sourceArc);
  let best=null;
  for(let section=0;section<s.surfaces.length;section++){
   const closestSample=closest(samples[section],p);
   const d=dist(p,closestSample.center);
   if(!best||d<best.distance)best={section,start:closestSample,distance:d};
  }
  assert.equal(best.section,1,'R1 study must stay inside original CROWN REVERSAL');
  const line=samples[best.section],track=s.surfaces[best.section];
  const start=best.start.arc+28;
  assert.ok(start+DY1_METRES<line.at(-1).arc,'360m must fit original road');
  const points=Array.from({length:21},(_,i)=>posAt(track,line,start+i*18));
  const cams=buildDoReference(road,native).cameras;
  const gates=DY1_GATES.map((name,i)=>{
   const point=points[i*5];
   return {name,index:i*5,progressMetres:i*90,
    world:point.center,roadWidthMetres:point.realWidthMeters,
    camera: ['t1550','t1600','t1650','t1700'].map(t=>{
     const c=cams.find(x=>x.id===t);assert.ok(c);
     return {id:t,...project(point.center,c)};
    })};
  });
  const visibility={};
  for(const id of ['t1550','t1600','t1650','t1700'])
   visibility[id]=gates.filter(x=>x.camera.find(c=>c.id===id).onScreen).length;
  // A camera cannot establish visual architecture quality or full occlusion.
  assert.ok(visibility.t1550>=2 && visibility.t1600>=2,
   'No meaningful ahead-of-player window in original native 15.5/16.0 views');
  assert.equal(JSON.stringify(s),frozen,'Original game physics mutated');
  report.roads[road]={sourceSurface:track.id,section:best.section,
   distancePlayer1550ToSample:round(best.distance,3),
   distancePlayer1600ToWindowStart:round(dist(q,points[0].center),3),
   sourceWindowStartArcMetres:round(start,3),
   sourceWindowEndArcMetres:round(start+DY1_METRES,3),
   stations:points,gates,visibility,originalMovers:28,
   maxRealWidthMetres:Math.max(...points.map(x=>x.realWidthMeters)),
   minRealWidthMetres:Math.min(...points.map(x=>x.realWidthMeters))};
 }
 return report;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const dir='test-results/g4e7dy-r1-city';fs.mkdirSync(dir,{recursive:true});
 const report=buildDy1ApproachPlan();
 fs.writeFileSync(path.join(dir,'G4E7DY_R1_NATIVE_APPROACH_SPATIAL_DATA.json'),
  JSON.stringify(report,null,2)+'\n');
 console.log('DY1_REAL_B48_REFOCUSED_NATIVE_CAMERA_APPROACH',
  JSON.stringify(Object.fromEntries(Object.entries(report.roads).map(([k,v])=>[k,
   {surface:v.sourceSurface,visibility:v.visibility,range:[v.minRealWidthMetres,v.maxRealWidthMetres]}]))));
}

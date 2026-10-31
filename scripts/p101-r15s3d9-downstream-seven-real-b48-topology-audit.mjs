/** R15S3D9 read-only physical topology audit of all original 7 B48 sections,
 * two real worlds, and physical evidence basis R15S3D8R1.
 * No gameplay source changes and no claims about collision impulses.
 */
import fs from 'node:fs';import assert from 'node:assert/strict';
import {buildR15S3D8R1} from './p101-r15s3d8r1-original-road4-continuous-physical-winding.mjs';
import {sample,frame,tessellate} from '../private/reference_only/director/surface.js';
const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
const arg=k=>{const i=process.argv.indexOf(k);assert.ok(i>=0&&process.argv[i+1]);return process.argv[i+1];};
const mag=v=>Math.hypot(...v),sub=(a,b)=>a.map((x,i)=>x-b[i]),dot=(a,b)=>a.reduce((v,x,i)=>v+x*b[i],0);
const round=x=>Number(x.toFixed(5)),vec=v=>v.map(round);
function angle(a,b){return Math.acos(Math.max(-1,Math.min(1,dot(a,b)/(mag(a)*mag(b)||1))))*180/Math.PI;}
const out={schema:'dopagaki.r15s3d9-native-7-B48-topology-origin-audit/1',
 sourceGameBlob:SHA,originalB48:7,originalB51:28,sourceOnly:true,
 physicalRunnerNotExecuted:true,actualSourceWebGL:false,
 GAMEPLAY:'HOLD',ART:'HOLD',HUMAN:'HOLD',RELEASE:'HOLD',worlds:{}};
for(const world of ['true-pinch','pinch-switch']){
 const doc=buildR15S3D8R1(world);
 assert.equal(doc.surfaces.length,7);assert.equal(doc.movingObstacles.length,28);
 const data=doc.surfaces.map((s,i)=>{
  const at=(u,v)=>sample(s,u,v),f=u=>frame(s,u,.5);
  const scans=Array.from({length:301},(_,j)=>{const u=j/300,ff=f(u),l=at(u,0),r=at(u,1);
   return {u,center:at(u,.5),forward:ff.forward,normal:ff.normal,widthXZ:Math.hypot(l[0]-r[0],l[2]-r[2]),
    lateralXZ:[r[0]-l[0],r[2]-l[2]]};});
  const maxAngle=(field)=>Math.max(...scans.slice(1).map((p,j)=>angle(scans[j][field],p[field])));
  const w=scans.map(x=>x.widthXZ);
  return {id:s.id,index:i,rows:s.rows,cols:s.cols,resolution:s.resolution,rideable:s.rideable,collidable:s.collidable,
   firstControlCenterXYZ:vec(s.points[2]),secondControlCenterXYZ:vec(s.points[7]),
   finalControlCenterXYZ:vec(s.points[(s.rows-1)*5+2]),previousControlCenterXYZ:vec(s.points[(s.rows-2)*5+2]),
   sampleStartCenter:vec(at(0,.5)),sampleEndCenter:vec(at(1,.5)),
   widthStartXZ:round(w[0]),widthEndXZ:round(w.at(-1)),widthMinXZ:round(Math.min(...w)),widthMaxXZ:round(Math.max(...w)),
   tangentStartXYZ:vec(f(0).forward),tangentEndXYZ:vec(f(1).forward),
   lateralStartXZ:vec(scans[0].lateralXZ),lateralEndXZ:vec(scans.at(-1).lateralXZ),
   frameNormalAtStart:vec(f(0).normal),frameNormalAtEnd:vec(f(1).normal),
   minFrameNormalY:round(Math.min(...scans.map(x=>x.normal[1]))),
   maxAdjacent0p00333UFrameNormalDegrees:round(maxAngle('normal')),
   maxAdjacent0p00333UForwardDegrees:round(maxAngle('forward')),
   actualTessellationDegenerateCount:tessellate(s).degenerate,
   voidLongitudinalCells:s.voidLongitudinalCells??[],
   physicalCenterRows:[0,5,10,15,20,25,30].filter(j=>j<s.rows).map(j=>({row:j,XYZ:vec(s.points[j*5+2]),
     widthXZ:round(Math.hypot(s.points[j*5+4][0]-s.points[j*5][0],s.points[j*5+4][2]-s.points[j*5][2]))}))};
 });
 const seams=[];
 for(let i=0;i<data.length-1;i++){
  const a=doc.surfaces[i],b=doc.surfaces[i+1];
  const across=Array.from({length:5},(_,j)=>mag(sub(a.points[(a.rows-1)*5+j],b.points[j])));
  const xzLeftEnd=a.points[(a.rows-1)*5],xzRightEnd=a.points[(a.rows-1)*5+4],xzLeftStart=b.points[0],xzRightStart=b.points[4];
  const lateralA=sub(xzRightEnd,xzLeftEnd),lateralB=sub(xzRightStart,xzLeftStart);
  seams.push({between:[data[i].id,data[i+1].id],
   xyzCenterDistanceM:round(mag(sub(sample(a,1,.5),sample(b,0,.5)))),
   fullWidthFiveVertexDistancesM:across.map(round),
   headingAngleDegrees:round(angle(frame(a,1,.5).forward,frame(b,0,.5).forward)),
   leftToRightCrossSectionAngleDegrees:round(angle(lateralA,lateralB)),
   widthEndToNextStartRatio:round(data[i].widthEndXZ/(data[i+1].widthStartXZ||1))});
 }
 const routeSegments=(doc.routeSegments??[]).map(g=>({...g}));
 const roughB51=doc.movingObstacles.map((m,i)=>({i,id:m.id,type:m.type,
  position:m.position??m.center??null,surface:m.surface??null,
  from:m.from??null,to:m.to??null}));
 out.worlds[world]={slices:data,seams,originalRouteCount:doc.route.length,originalRouteSegments:routeSegments,
  genuineMovingB51PlacementMetadata:roughB51};
 for(const s of data)console.log('R15S3D9_SOURCE_B48',JSON.stringify({world,id:s.id,i:s.index,
  start:s.sampleStartCenter,end:s.sampleEndCenter,width:[s.widthStartXZ,s.widthEndXZ,s.widthMinXZ,s.widthMaxXZ],
  minNormalY:s.minFrameNormalY,normalAdjacentMax:s.maxAdjacent0p00333UFrameNormalDegrees,
  sourceB48Degenerate:s.actualTessellationDegenerateCount}));
 for(let i=0;i<seams.length;i++)console.log('R15S3D9_PHYSICAL_ADJACENCY',JSON.stringify({world,section:i,...seams[i]}));
}
fs.mkdirSync(arg('--out'),{recursive:true});
fs.writeFileSync(arg('--out')+'/R15S3D9_SEVEN_ORIGINAL_B48_DOWNSTREAM_NATIVE_GEOMETRY_AUDIT.json',JSON.stringify(out,null,2)+'\n');

/**
 * G4E-5B strict offline screen for a *single smooth cubic* rejoin to road V.
 * This is a limited candidate-family search, NOT a proof no route can exist.
 * Do not generate a road if lateral acceleration would be unplayable.
 */
import {generateG4E5Continuation,G4E5_POLICY} from './p101-w9c2-g4e5-physical-continuation.mjs';
import {sample} from '../private/reference_only/director/surface.js';
const round=(x,n=2)=>Number(x.toFixed(n));
const norm=(v)=>{const m=Math.hypot(...v)||1;return v.map(x=>x/m);};
const tangent=(s,u)=>norm([0,2].map(k=>sample(s,Math.min(1,u+.002),.5)[k]-sample(s,Math.max(0,u-.002),.5)[k]));
const p2=p=>[p[0],p[2]];
const bez=(p0,p1,p2,p3,t)=>{
 const s=1-t;
 const p=[0,1].map(k=>s*s*s*p0[k]+3*s*s*t*p1[k]+3*s*t*t*p2[k]+t*t*t*p3[k]);
 const v=[0,1].map(k=>3*s*s*(p1[k]-p0[k])+6*s*t*(p2[k]-p1[k])+3*t*t*(p3[k]-p2[k]));
 const a=[0,1].map(k=>6*s*(p2[k]-2*p1[k]+p0[k])+6*t*(p3[k]-2*p2[k]+p1[k]));
 return {p,v,a};
};
function metric(start,startHeading,target,targetHeading,h1,h2){
 const p1=start.map((x,k)=>x+h1*startHeading[k]),
  p2=target.map((x,k)=>x-h2*targetHeading[k]);
 let minRadius=Infinity,minSpeed=Infinity,length=0,maxAbs=0,prev=null;
 for(let i=0;i<=120;i++){
  const q=bez(start,p1,p2,target,i/120);
  const speed=Math.hypot(...q.v),cross=Math.abs(q.v[0]*q.a[1]-q.v[1]*q.a[0]);
  minRadius=Math.min(minRadius,cross<1e-10?Infinity:speed**3/cross);
  minSpeed=Math.min(minSpeed,speed);
  maxAbs=Math.max(maxAbs,Math.abs(q.p[0]),Math.abs(q.p[1]));
  if(prev)length+=Math.hypot(q.p[0]-prev[0],q.p[1]-prev[1]);
  prev=q.p;
 }
 return {minRadius,curveMeters:length,maxAbs,minDerivative:minSpeed};
}
export function g4e5bCurvatureScreen(){
 const lengths=G4E5_POLICY.runwayLengths,us=[0,.1,.25,.4,.55,.7,.85,1],
  handles=[200,400,600,800,1000,1200,1500,1800,2100,2400,2800,3200,4000];
 const perLength=lengths.map(lengthMeters=>{
  const doc=generateG4E5Continuation({lengthMeters}),
   road=doc.surfaces[8],V=doc.surfaces[4],
   start=sample(road,1,.5),startXZ=p2(start),startHeading=tangent(road,1);
  const ranked=[];
  for(const u of us){
   const target=sample(V,u,.5),targetXZ=p2(target),targetHeading=tangent(V,u);
   for(const h1 of handles)for(const h2 of handles){
    const m=metric(startXZ,startHeading,targetXZ,targetHeading,h1,h2);
    if(m.maxAbs>1950||m.minDerivative<1)continue;
    ranked.push({targetU:u,h1,h2,
     minRadiusMeters:round(m.minRadius,1),lengthMeters:round(m.curveMeters,1),
     maxAbsCoordinate:round(m.maxAbs,1),
     targetVerticalDelta:round(target[1]-start[1]),
     lateralAccelerationAt170:round(170**2/m.minRadius,1),
     lateralAccelerationAt205:round(205**2/m.minRadius,1)});
   }
  }
  ranked.sort((a,b)=>b.minRadiusMeters-a.minRadiusMeters);
  const best=ranked[0]??null;
  return {runwayMeters:lengthMeters,sourceEnd:start.map(v=>round(v)),
   evaluatedCurves:us.length*handles.length**2,withinBounds:ranked.length,
   bestSingleCubic:best,
   feasibleAt170Under25mps2:ranked.filter(x=>x.lateralAccelerationAt170<=25).slice(0,3),
   feasibleAt170Under18mps2:ranked.filter(x=>x.lateralAccelerationAt170<=18).slice(0,3),
   topCandidates:ranked.slice(0,6)};
 });
 return {schema:'dopagaki.w9c2.g4e5b-curvature-screen/1',
  candidateFamily:'single cubic Bezier, real road-V u=0..1, endpoint tangent matched',
  worldAbsCoordinateLimit:1950,velocityMetersPerSecond:[170,205],
  strictTestOnly:true,notGlobalImpossibilityProof:true,
  noPhysicalRoadAdded:true,results:perLength,
  verdict:perLength.some(x=>x.feasibleAt170Under25mps2.length)?
   'AT_LEAST_ONE_LOW_ACCELERATION_CUBIC_NEEDS_NATIVE_TEST':
   'REJECT_SINGLE_CUBIC_FAMILY_AT_170MPS',
  production:'HOLD',human:'HOLD'};
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href)
 console.log('G4E5B_CURVATURE '+JSON.stringify(g4e5bCurvatureScreen()));

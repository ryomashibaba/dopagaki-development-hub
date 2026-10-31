/** G4E-7AD: outboard 3D SCULPTURAL CANYON, GPU-only.
 * No new B48 roads, collision helpers, fake spans, controls or camera changes.
 */
const add=(a,b)=>a.map((x,i)=>x+b[i]);
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const mul=(a,k)=>a.map(x=>x*k);
const norm=a=>mul(a,1/(Math.hypot(...a)||1));
const tri=(out,a,b,c,color)=>{
 for(const p of [a,b,c])out.push(...p,...color);
};
const quad=(out,a,b,c,d,color)=>{
 tri(out,a,b,c,color);tri(out,a,c,d,color);
 tri(out,c,b,a,color.map(x=>x*.6));
 tri(out,d,c,a,color.map(x=>x*.6));
};
const empty=()=>({active:false,vertices:[],triangles:0,
 spires:0,windows:0,minClearanceMeters:0,
 nonCollision:true,actualB48Unchanged:true,formalSlope2Meters:0});
export function g4e7adCity(doc,sample,{enabled=false}={}){
 if(!enabled)return empty();
 const study=doc?.stageForge?.g4e7acR2Study;
 if(!['approach-arc','landing-crescent'].includes(study?.id)||
    study.source!=='AA_LANDING_SOFT_ALPHA070_UNCHANGED_CUT'||!study.originalLipLandingExact||
    study.certifiedSlope2Meters!==0||doc.stageForge.productionPromoted!==false||
    doc.surfaces.length!==7||doc.movingObstacles.length!==28||
    doc.surfaces[0].voidLongitudinalCells?.join(',')!=='52'||
    typeof sample!=='function')
  throw Error('AD city only on private authentic R2 actual B48');
 const baseline=JSON.stringify(doc);
 const road=doc.surfaces[0],vertices=[],towers=[],glass=[.21,.70,.82],
   dark=[.045,.13,.22],metal=[.10,.25,.35],light=[.4,.92,1];
 // Distant asymmetric stratified canyon; no portals suspended above the jump.
 const stations=[
  {u:.17,h:160,offset:80,lean:45},
  {u:.30,h:275,offset:105,lean:75},
  {u:.43,h:330,offset:94,lean:68},
  {u:.68,h:215,offset:80,lean:51},
  {u:.77,h:355,offset:123,lean:99},
  {u:.87,h:280,offset:111,lean:62}
 ];
 let windows=0,minClearance=Infinity;
 for(const side of [-1,1]){
  for(let idx=0;idx<stations.length;idx++){
   const s=stations[idx],edge=sample(road,s.u,side<0?0:1),
    center=sample(road,s.u,.5),
    prev=sample(road,Math.max(.01,s.u-.008),.5),
    next=sample(road,Math.min(.99,s.u+.008),.5),
    tangent=norm([next[0]-prev[0],0,next[2]-prev[2]]);
   // Perpendicular to the tangent; 60m+ clearance beyond the *actual* edge.
   let away=sub(edge,center),ax=away[0]-tangent[0]*(away[0]*tangent[0]+away[2]*tangent[2]),
    az=away[2]-tangent[2]*(away[0]*tangent[0]+away[2]*tangent[2]);
   away=norm([ax,0,az]);
   const clearance=s.offset+(idx%2)*15;
   minClearance=Math.min(minClearance,clearance);
   const base=add(edge,mul(away,clearance));
   const layers=[];
   for(let k=0;k<=8;k++){
    const t=k/8,rad=1-t,twist=Math.sin(t*Math.PI*1.4)*19,
     centerPoint=add(add(add(base,mul(away,s.lean*t*t)),mul(tangent,(side*12+idx*4)*t+twist)),[0,s.h*t-38,0]),
     width=13+34*rad,depth=6+16*rad,
     longitudinal=mul(tangent,width),outboard=mul(away,depth);
    layers.push([
     add(add(centerPoint,longitudinal),outboard),
     add(sub(centerPoint,longitudinal),outboard),
     sub(sub(centerPoint,longitudinal),outboard),
     sub(add(centerPoint,longitudinal),outboard)
    ]);
   }
   for(let k=0;k<8;k++){
    if(k===3||k===4){windows++;continue;}
    const a=layers[k],b=layers[k+1],shade=k%3===0?metal:dark;
    quad(vertices,a[0],a[1],b[1],b[0],shade);
    quad(vertices,a[2],a[3],b[3],b[2],metal);
    quad(vertices,a[1],a[2],b[2],b[1],shade);
    quad(vertices,a[3],a[0],b[0],b[3],dark);
    // Thin folded luminous elevation spine, not a flat rectangular billboard.
    if(k%2===0){
     const ridge=add(mul(add(a[0],b[0]),.5),mul(away,3.4));
     tri(vertices,a[0],b[0],ridge,k%4===0?light:glass);
     tri(vertices,ridge,b[0],a[0],glass.map(x=>x*.5));
    }
   }
   // Cap the crown and selected independent terrace ledges, never join across road.
   for(const k of [2,6,8]){
    const v=layers[k];
    quad(vertices,v[0],v[1],v[2],v[3],k===8?light:metal);
   }
   towers.push({side,u:s.u,heightMeters:s.h,edgeClearanceMeters:clearance});
  }
 }
 if(!vertices.length||vertices.length%18!==0||
    vertices.length>160000||vertices.some(x=>!Number.isFinite(x))||
    towers.length!==12||windows!==24||minClearance<60)
   throw Error('AD GPU canyon massing violates structure/visibility budget');
 if(JSON.stringify(doc)!==baseline)throw Error('AD skyline mutated native stage');
 return {active:true,vertices,triangles:vertices.length/18,spires:towers.length,
  windows,minClearanceMeters:minClearance,stations:towers,
  nonCollision:true,actualB48Unchanged:true,physicalGapBridged:false,
  addedRoads:0,addedMachines:0,formalSlope2Meters:0};
}

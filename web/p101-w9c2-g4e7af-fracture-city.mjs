/** G4E-7AF — FRACTURE CITADEL, an independent open-layer city architecture.
 * 8 staggered city masses with real voids, inclined crests, stepped interiors,
 * bright exposed shear lines. Art mesh only: never a collision or hidden road.
 */
const plus=(a,b)=>a.map((x,i)=>x+b[i]);
const minus=(a,b)=>a.map((x,i)=>x-b[i]);
const times=(a,s)=>a.map(x=>x*s);
const norm=a=>times(a,1/(Math.hypot(...a)||1));
const tri=(v,a,b,c,color)=>{for(const p of [a,b,c])v.push(...p,...color);};
const quad=(v,a,b,c,d,color)=>{tri(v,a,b,c,color);tri(v,a,c,d,color);};
const palettes={dark:[.035,.09,.17],stone:[.08,.18,.28],edge:[.31,.85,.95],
 amber:[.95,.53,.22],violet:[.42,.29,.70],interior:[.14,.33,.44]};
const segments=[
 [[.065,.245,1.1],[.30,.52,1.35],[.575,.75,1.12],[.82,.955,1.5]],
 [[.08,.27,1.28],[.335,.56,1.08],[.61,.805,1.52],[.845,.965,1.32]]
];
export function g4e7afFractureCity(doc,sample,{enabled=false}={}){
 const empty={enabled:false,vertices:[],triangles:0,districts:0,
  atriumHoles:0,litShearFolds:0,physicalChanges:false,
  addedCollision:0,addedRoads:0,certifiedSlope2Meters:0,publish:'HOLD'};
 if(!enabled)return empty;
 const st=doc?.stageForge?.g4e7acR2Study;
 if(st?.id!=='approach-arc'||st.source!=='AA_LANDING_SOFT_ALPHA070_UNCHANGED_CUT'||
  !st.originalLipLandingExact||st.certifiedSlope2Meters!==0||st.publish!=='HOLD'||
  doc.stageForge.productionPromoted!==false||
  doc.surfaces.length!==7||doc.movingObstacles.length!==28||
  doc.surfaces[0].voidLongitudinalCells?.join(',')!=='52')
   throw Error('AF requires private true R2 approach-arc');
 const original=JSON.stringify(doc),road=doc.surfaces[0],vertices=[];
 let districts=0,atriumHoles=0,litShearFolds=0;
 for(const sign of [-1,1]){
  const spans=segments[sign<0?0:1];
  for(const [start,end,amplitude] of spans){
   const n=16,levels=7,outer=[],rear=[],zone=districts++;
   for(let i=0;i<=n;i++){
    const u=start+(end-start)*i/n,
      p=sample(road,u,.5),edge=sample(road,u,sign<0?0:1),
      forward=minus(sample(road,Math.min(1,u+.007),.5),
       sample(road,Math.max(0,u-.007),.5)),
      tangent=norm([forward[0],0,forward[2]]),
      v=minus(edge,p),
      outward=norm(minus([v[0],0,v[2]],
        times(tangent,v[0]*tangent[0]+v[2]*tangent[2])));
    const row=[],back=[];
    for(let k=0;k<=levels;k++){
     const t=i/n,h=k/levels;
     const displacement=70+(22+100*h*h)*amplitude+
       18*Math.sin(t*Math.PI*1.7+sign*2)*h;
     const drift=(zone%2?1:-1)*54*h*h+Math.sin(t*7+k)*12;
     const height=amplitude*(-42+385*h+16*Math.sin(t*11+k*1.2));
     const q=plus(plus(plus(edge,times(outward,displacement)),
      times(tangent,drift)),[0,height,0]);
     row.push(q);back.push(plus(q,times(outward,32)));
    }
    outer.push(row);rear.push(back);
   }
   for(let i=0;i<n;i++)for(let k=0;k<levels;k++){
    const gap=(k>=2&&k<=5)&&(
      ((zone%2===0)&&(i>=4&&i<=10))||
      ((zone%2===1)&&(i>=7&&i<=13)));
    if(gap){atriumHoles++;continue;}
    const a=outer[i][k],b=outer[i+1][k],
      c=outer[i+1][k+1],d=outer[i][k+1],
      A=rear[i][k],B=rear[i+1][k],
      C=rear[i+1][k+1],D=rear[i][k+1],
      base=k<2?palettes.dark:k<4?palettes.stone:
           sign<0?palettes.violet:palettes.interior;
    quad(vertices,a,b,c,d,base);
    quad(vertices,D,C,B,A,palettes.dark);
    if(i===0||i===n-1||k===levels-1)
     quad(vertices,a,A,D,d,palettes.interior);
    if((k===1||k===5)&&i%3===0){
     const tip=plus(times(plus(a,c),.5),[0,5,0]);
     tri(vertices,a,b,tip,zone%2?palettes.edge:palettes.amber);
     tri(vertices,tip,b,a,palettes.interior);
     litShearFolds++;
    }
   }
   for(let i=1;i<n;i+=3){
    const a=outer[i-1][levels-1],b=outer[i+1][levels-1],
      tip=plus(outer[i][levels],[0,12+(zone%3)*12,0]);
    tri(vertices,a,b,tip,zone%2?palettes.amber:palettes.edge);
    tri(vertices,tip,b,a,palettes.violet);
    litShearFolds++;
   }
  }
 }
 if(districts!==8||atriumHoles<65||litShearFolds<45||
  !vertices.length||vertices.length%18!==0||vertices.length/18>15000||
  vertices.some(x=>!Number.isFinite(x))||JSON.stringify(doc)!==original)
   throw Error('AF sculpture mesh/physics isolation failed');
 return {enabled:true,vertices,triangles:vertices.length/18,districts,
  atriumHoles,litShearFolds,minimumOutboardMeters:70,
  physicalChanges:false,addedCollision:0,addedRoads:0,
  certifiedSlope2Meters:0,publish:'HOLD'};
}

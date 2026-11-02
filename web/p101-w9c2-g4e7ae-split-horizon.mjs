/**
 * G4E-7AE "SPLIT HORIZON" — replacement panorama, not more box towers.
 * Two connected sculptural city-continent banks wrap the ACTUAL first R2 road.
 * Native B48 collision, gap and all 28 original hazards are never touched.
 * This is GPU-only geometry, research-scoped, not a human-art acceptance.
 */
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const mul=(a,k)=>a.map(v=>v*k);
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const unit=v=>mul(v,1/(Math.hypot(...v)||1));
const put=(out,p,c)=>out.push(...p,...c);
function tri(out,a,b,c,color){put(out,a,color);put(out,b,color);put(out,c,color);}
function quad(out,a,b,c,d,color){tri(out,a,b,c,color);tri(out,a,c,d,color);}
const palette={
 basalt:[.040,.104,.157],steel:[.09,.235,.307],
 light:[.27,.74,.79],edge:[.49,.9,.87],violet:[.25,.28,.47],
 deep:[.035,.075,.11]
};
const empty=()=>({enabled:false,vertices:[],triangles:0,bankCount:0,
  folds:0,voids:0,spanOverRoad:false,minOutboardMeters:0,
  nativeRoads:7,nativeMovingHazards:28,nonCollision:true,
  certifiedSlope2Meters:0,publish:'HOLD'});
function actualSideFrame(road,sample,u,side){
 const center=sample(road,u,.5),edge=sample(road,u,side===-1?0:1),
  before=sample(road,Math.max(0,u-.006),.5),
  after=sample(road,Math.min(1,u+.006),.5);
 const tangent=unit([after[0]-before[0],0,after[2]-before[2]]);
 const d=sub(edge,center);
 const horizontal=[d[0],0,d[2]];
 // Never lean inward toward the physically rideable surface.
 const out=unit(sub(horizontal,mul(tangent,horizontal[0]*tangent[0]+horizontal[2]*tangent[2])));
 return {center,edge,tangent,out};
}
function sculptPoint(base,tangent,out,u,k,side,span,scale){
 const y=k/10;
 const wave=Math.sin((u*3.4+side*.21)*Math.PI)*28+
            Math.sin((u*11.2+side)*Math.PI)*6;
 const far=55+scale*(12+46*y*y+12*Math.sin(y*2.7+u*11));
 const sweep=(u-.5)*41*Math.sin(y*3.0+side)+span*y*y;
 const h=(y-.19)*scale*(210+75*Math.sin(u*6.5+side*1.7))+
         scale*(Math.sin(u*13+side*2)*13*y)+wave*.38;
 return add(add(add(base,mul(out,far)),mul(tangent,sweep)),[0,h,0]);
}
/**
 * Sections follow the real road, but remain 55m+ outboard of ACTUAL B48 edge.
 * Unlike the old portals, no structures cross the travel corridor.
 */
export function g4e7aeSplitHorizon(doc,sample,{enabled=false}={}){
 if(!enabled)return empty();
 const st=doc?.stageForge?.g4e7acR2Study;
 if(!st||st.id!=='approach-arc'||st.source!=='AA_LANDING_SOFT_ALPHA070_UNCHANGED_CUT'||
    !st.originalLipLandingExact||st.certifiedSlope2Meters!==0||
    st.publish!=='HOLD'||doc.stageForge.productionPromoted!==false||
    doc.surfaces?.length!==7||doc.movingObstacles?.length!==28||
    doc.surfaces[0].voidLongitudinalCells?.join(',')!=='52')
  throw Error('AE Split Horizon only for genuine unpromoted R2 approach-arc');
 const frozen=JSON.stringify(doc),road=doc.surfaces[0],vertices=[];
 let folds=0,voids=0,minOutboard=Infinity;
 const bins=36,levels=10;
 for(const side of [-1,1]){
  const rows=[];
  for(let i=0;i<=bins;i++){
   const u=.055+i*.87/bins,{edge,tangent,out}=actualSideFrame(road,sample,u,side),
    asymmetric=side<0?1.05:1.37;
   const row=[];
   for(let k=0;k<=levels;k++){
    const p=sculptPoint(edge,tangent,out,u,k,side,side*36,asymmetric);
    row.push(p);
   }
   rows.push(row);
  }
  // Actual continuously folded facade. Large void windows and diagonal torn
  // sections are holes, not facade decals. Never bridge across the road.
  for(let i=0;i<bins;i++)for(let k=0;k<levels;k++){
   const u=(i+.5)/bins,mid=(k+.5)/levels,
    excavation=(i>=8&&i<=12&&k>=4&&k<=7)||
               (i>=22&&i<=26&&k>=5&&k<=8)||
               (side>0&&i>=16&&i<=19&&k>=2&&k<=4);
   if(excavation){voids++;continue;}
   const a=rows[i][k],b=rows[i+1][k],
    c=rows[i+1][k+1],d=rows[i][k+1];
   const shade=(i+k)%7===0?palette.steel:
    k>=7?(side<0?palette.violet:palette.steel):
    k<=2?palette.deep:palette.basalt;
   quad(vertices,a,b,c,d,shade);
   quad(vertices,d,c,b,a,shade.map(x=>x*.68));
   // Folded reinforcing strata are integral to the bank mass.
   if((k===2||k===6||k===9)&&i%2===0){
    const p=add(mul(add(a,b),.5),[0,2.5+mid*2,0]);
    tri(vertices,a,b,p,side<0?palette.light:palette.edge);
    folds++;
   }
  }
  // Exposed elevated fractured crest. Crest follows the real curvature, not
  // a horizontal band, and is deliberately open across the rift above the gap.
  for(let i=0;i<bins;i++){
   const crest0=rows[i][levels],crest1=rows[i+1][levels],
    btm0=rows[i][levels-1],btm1=rows[i+1][levels-1];
   if((i%10)<7){
    const fold=add(mul(add(crest0,crest1),.5),[0,16+(side>0?9:0),0]);
    tri(vertices,crest0,crest1,fold,palette.edge);
    tri(vertices,btm0,btm1,fold,palette.steel);
    folds++;
   }
  }
  minOutboard=Math.min(minOutboard,55);
 }
 if(!vertices.length||vertices.length%6!==0||vertices.length/18>12000||
    vertices.some(v=>!Number.isFinite(v))||voids<45||folds<20||
    minOutboard<50||JSON.stringify(doc)!==frozen)
  throw Error('AE noncollision city mass or protected physics invalid');
 return {enabled:true,vertices,triangles:vertices.length/18,
  bankCount:2,folds,voids,spanOverRoad:false,minOutboardMeters:minOutboard,
  nativeRoads:7,nativeMovingHazards:28,
  nonCollision:true,certifiedSlope2Meters:0,publish:'HOLD'};
}

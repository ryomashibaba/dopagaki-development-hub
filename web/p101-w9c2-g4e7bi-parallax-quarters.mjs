/**
 * G4E-7BI PARALLAX QUARTERS — distinct roadside-visible city layers.
 * Replaces BH's offscreen skyline; no physical roads, collision or magnets.
 * All geometry is authored in BC rollDeck WORLD coordinates.
 */
export const BI_SITES=Object.freeze([
 Object.freeze({name:'LOWER-DELTA',section:1,u:.62,side:-1,setback:155,span:105,top:122,branch:-25}),
 Object.freeze({name:'LUMINOUS-SPLIT',section:1,u:.69,side:1,setback:165,span:145,top:250,branch:35}),
 Object.freeze({name:'SKYWARD-DISTRICT',section:1,u:.76,side:-1,setback:185,span:190,top:365,branch:-65}),
 // BC physical road2 ends around u=.867. Never sample outside native B48.
 Object.freeze({name:'DISTANT-FREE-EDGE',section:1,u:.83,side:1,setback:220,span:205,top:470,branch:60})
]);
const COLORS=Object.freeze({
 crown:[.91,.97,1],beam:[.47,.84,.95],glass:[.31,.69,.83],
 gold:[1,.72,.28],pearl:[.68,.95,.96],violet:[.72,.51,.94],
 underside:[.13,.28,.38],edge:[.12,.98,1]
});
const plus=(a,b)=>a.map((x,i)=>x+b[i]),minus=(a,b)=>a.map((x,i)=>x-b[i]),
 scale=(a,k)=>a.map(x=>x*k),len=v=>Math.hypot(...v),norm=v=>scale(v,1/(len(v)||1)),
 lerp=(a,b,k)=>plus(scale(a,1-k),scale(b,k)),
 dot=(a,b)=>a.reduce((z,v,i)=>z+v*b[i],0),
 cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2]];
const triangle=(v,a,b,c,color)=>{for(const p of [a,b,c])v.push(...p,...color);};
const quad=(v,a,b,c,d,color)=>{triangle(v,a,b,c,color);triangle(v,a,c,d,color);};
const double=(v,a,b,c,d,color,back=COLORS.underside)=>{quad(v,a,b,c,d,color);quad(v,d,c,b,a,back);};
function beam(v,a,b,width,color){
 const axis=norm(minus(b,a)),ref=Math.abs(dot(axis,[0,1,0]))>.9?[0,0,1]:[0,1,0],
  right=norm(cross(axis,ref)),up=norm(cross(axis,right)),
  w=scale(right,width/2),h=scale(up,width*.44);
 const ring=p=>[plus(plus(p,w),h),plus(minus(p,w),h),minus(minus(p,w),h),plus(minus(p,h),w)];
 const x=ring(a),y=ring(b),all=[...x,...y];
 for(const [i,j,k,l] of [[0,1,2,3],[4,7,6,5],[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0]])
  quad(v,all[i],all[j],all[k],all[l],color);
}
function realOutboard(s,sample,u,side){
 const center=sample(s,u,.5),edge=sample(s,u,side<0?0:1),
  before=sample(s,Math.max(0,u-.004),.5),after=sample(s,Math.min(1,u+.004),.5),
  ahead=norm([after[0]-before[0],0,after[2]-before[2]]),
  d=minus(edge,center),flat=[d[0],0,d[2]],
  outward=norm(minus(flat,scale(ahead,dot(flat,ahead))));
 if(dot(outward,flat)<2||len(ahead)<.9)throw Error('BI invalid true BC road outward axis');
 return {edge,ahead,outward};
}
function place(f,longitudinal,outboard,rise){
 return plus(plus(plus(f.edge,scale(f.ahead,longitudinal)),scale(f.outward,outboard)),[0,rise,0]);
}
const vacant=()=>({active:false,vertices:[],triangles:0,sites:0,quarters:0,
 layeredCarriers:0,openAirBays:0,brightSilhouetteStruts:0,maxRiseM:0,
 minimumOutboardM:null,physicalRoadsAdded:0,physicalHazardsAdded:0,
 geometryDocumentUnchanged:true,certifiedSlope2Meters:0,art:'HOLD',human:'HOLD',publish:'HOLD'});
export function g4e7biParallaxQuarters(doc,sample,{enabled=false}={}){
 if(!enabled)return vacant();
 const b=doc?.stageForge?.g4e7bcStudy,aj=doc?.stageForge?.g4e7ajStudy;
 if(b?.id!=='bank-grade-contour'||b.variant!=='rollDeck'||
  b.road!==aj?.road||!['true-pinch','pinch-switch'].includes(b.road)||
  b.real7B48!==true||b.real28B51!==true||!b.hasRealVoid52||
  b.formalSlope2Meters!==0||b.publish!=='HOLD'||doc.stageForge.productionPromoted!==false||
  doc.stageForge.recordStageId!=='VB-P101-A13-W9C2-G4E7BC-'+b.road.toUpperCase()+'-ROLLDECK'||
  doc.surfaces?.length!==7||doc.movingObstacles?.length!==28||
  doc.surfaces[0].voidLongitudinalCells?.join(',')!=='52')
  throw Error('BI only permits genuine protected BC rollDeck B48/B51');
 if(typeof sample!=='function')throw Error('BI requires native physical road sampler');
 const frozen=JSON.stringify(doc),vertices=[];
 let quarters=0,layers=0,openBays=0,struts=0,maxRise=0;
 for(const [n,site] of BI_SITES.entries()){
  const f=realOutboard(doc.surfaces[site.section],sample,site.u,site.side),
   P=(lng,depth,h)=>place(f,lng,site.setback+depth,h);
  // Tangled double free-edge skyline, but below the offscreen >600m BF/BH crown.
  // 3 truly missing bays per tier, independent cantilevered city shells.
  for(let level=0;level<4;level++){
   const height=site.top*(.18+level*.19),
    slices=13,front=[],rear=[];
   for(let j=0;j<=slices;j++){
    const t=j/slices,x=(t-.5)*site.span*.96,
     wave=17*Math.sin(2*Math.PI*t+level*.65)+(t-.5)*site.branch*.23,
     depth=24+level*25+16*Math.sin(Math.PI*t);
    front.push(P(x+wave,depth,height+9*Math.sin(3*t+level)));
    rear.push(P(x+wave*.48+8,depth+52+level*6,height-7));
   }
   for(let j=0;j<slices;j++){
    if(j===3||j===4||j===9){openBays++;continue;}
    const skin=(n+level+j)%6===0?COLORS.gold:level%2?COLORS.pearl:COLORS.glass;
    double(vertices,front[j],front[j+1],rear[j+1],rear[j],skin);
    if(j%3===0){
     const roof=plus(lerp(rear[j],rear[j+1],.55),[0,11+level*1.3,0]);
     triangle(vertices,front[j],front[j+1],roof,COLORS.crown);
    }
   }
   if(level>0){
    for(const q of [2,10]){
     const a=P((q/13-.5)*site.span*.9,25+(level-1)*25,site.top*(.18+(level-1)*.19));
     const c=P((q/13-.5)*site.span*.9+site.branch*.14,25+level*25,height-9);
     beam(vertices,a,c,4,COLORS.crown);struts++;
    }
   }
   quarters++;layers++;
  }
  // Off-axis asymmetric sail-branch. Intentionally open to sky, broken
  // at multiple points and visible from the fast curved CHASM road.
  const branches=7;
  for(const sign of [-1,1]){
   let last=null;
   for(let j=0;j<=branches;j++){
    const t=j/branches,
     p=P(sign*(site.span*.48+site.branch*t*.40),80+76*Math.sin(Math.PI*t)+32*t,
       12+site.top*Math.pow(t,.85));
    if(last&&j!==4){
     beam(vertices,last,p,6,n%2?COLORS.edge:COLORS.crown);struts++;
    }
    last=p;maxRise=Math.max(maxRise,12+site.top*Math.pow(t,.85));
   }
  }
  // Three actual recessed suspended vox-free energy-gardens per site,
  // volumes separated by empty air (not dense rectangular towers).
  for(const [k,t] of [.2,.5,.8].entries()){
   const c=P((t-.5)*site.span*.82+site.branch*.12,95+k*31,site.top*(.35+.14*k)),
     A=plus(c,scale(f.ahead,-12-5*k)),B=plus(c,scale(f.ahead,14+6*k)),
     R=scale(f.outward,26+7*k),h=[0,12+3*k,0];
   const l=plus(A,R),r=plus(B,R);
   double(vertices,A,B,r,l,k===1?COLORS.violet:COLORS.beam);
   triangle(vertices,plus(A,h),plus(B,h),plus(lerp(l,r,.5),[0,17,0]),COLORS.crown);
   beam(vertices,c,plus(c,h),4,COLORS.gold);
   struts++;quarters++;
  }
 }
 const triangles=vertices.length/18;
 if(triangles<900||triangles>18000||vertices.some(x=>!Number.isFinite(x))||
    vertices.length%18!==0||quarters!==28||layers!==16||openBays!==48||
    struts<50||maxRise<470||
    JSON.stringify(doc)!==frozen)
  throw Error('BI noncollision or layered geometry budget invariant: '+JSON.stringify({triangles,rawLength:vertices.length,nonFinite:vertices.filter(x=>!Number.isFinite(x)).length,quarters,layers,openBays,struts,maxRise,mutated:JSON.stringify(doc)!==frozen}));
 return {active:true,vertices,triangles,sites:BI_SITES.length,quarters,
  layeredCarriers:layers,openAirBays:openBays,brightSilhouetteStruts:struts,
  maxRiseM:Math.round(maxRise),minimumOutboardM:Math.min(...BI_SITES.map(x=>x.setback)),
  physicalRoadsAdded:0,physicalHazardsAdded:0,geometryDocumentUnchanged:true,
  certifiedSlope2Meters:0,art:'HOLD',human:'HOLD',publish:'HOLD'};
}

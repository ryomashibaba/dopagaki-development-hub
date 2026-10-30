/**
 * R19 A3 — RIFT CIVIC BASILICA, ONE integrated architectural proposal.
 * Spatially continuous, NONCOLLIDING contemporary mega-civic place.
 * Set against original physical W9-C1 14m narrow road.
 * Not a new road, no invisible floor, no colliders, no physics alterations.
 *
 * The 3D language is one asymmetrical hollow urban cliff/atrium, descending
 * public grounds and one secondary anchored transit terrace. Not five copies
 * of huge boxes; not a wall tunnel nor a row of portals.
 *
 * The source road 0/7 x 28 moving B51 is read-only.
 */
const O={ivory:[.74,.82,.85],pale:[.54,.75,.81],
 metal:[.15,.29,.38],glass:[.18,.56,.63],inner:[.09,.18,.25],
 teal:[.20,.65,.66],gold:[.93,.68,.39],earth:[.25,.40,.44],
 soft:[.43,.61,.65]};
const plus=(a,b)=>a.map((x,i)=>x+b[i]);
const minus=(a,b)=>a.map((x,i)=>x-b[i]);
const mul=(v,s)=>v.map(x=>x*s);
const magnitude=v=>Math.hypot(...v);
const normal=v=>mul(v,1/(magnitude(v)||1));
const cp=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
function tri(v,a,b,c,color){for(const p of [a,b,c])v.push(...p,...color);}
function quad(v,a,b,c,d,color){tri(v,a,b,c,color);tri(v,a,c,d,color);tri(v,d,c,b,color.map(x=>x*.77));tri(v,d,b,a,color.map(x=>x*.77));}
function failIf(cond,msg){if(cond)throw Error('R19 A3 '+msg);}
function realFrame(s,u,side,sample){
 const p=sample(s,u,.5),edge=sample(s,u,side>0?1:0);
 const back=sample(s,Math.max(0,u-.002),.5),
  front=sample(s,Math.min(1,u+.002),.5),f=normal([front[0]-back[0],0,front[2]-back[2]]);
 let out=minus(edge,p);out[1]=0;out=minus(out,mul(f,f[0]*out[0]+f[2]*out[2]));out=normal(out);
 failIf(magnitude(minus(front,back))<.1||out.some(x=>!Number.isFinite(x)),'real road frame invalid');
 return {p,edge,u,side,forward:f,out};
}
function xyz(f,sideDistance,along,height=0){return plus(plus(plus(f.p,mul(f.out,sideDistance)),mul(f.forward,along)),[0,height,0]);}
function prism(v,c,along,side,height,color){
 const P=(a,b,h)=>plus(plus(c,mul(along,a)),plus(mul(side,b),[0,h,0]));
 const p=[P(-1,-1,-height/2),P(1,-1,-height/2),P(1,1,-height/2),P(-1,1,-height/2)],
  q=[P(-1,-1,height/2),P(1,-1,height/2),P(1,1,height/2),P(-1,1,height/2)];
 for(let i=0;i<4;i++){let j=(i+1)%4;quad(v,p[i],p[j],q[j],q[i],i===0?color:O.metal);}
 quad(v,q[0],q[1],q[2],q[3],color);
 quad(v,p[3],p[2],p[1],p[0],O.earth);
}
function slab(v,f,sideDistance,alongDistance,sideWidth,length,y,thick,color){
 failIf(sideDistance-sideWidth/2<38,'art slab near 14m physical road corridor');
 const c=xyz(f,sideDistance,alongDistance,y);
 prism(v,c,mul(f.forward,length/2),mul(f.out,sideWidth/2),thick,color);
}
function shell(v,f,stat){
 // One building facing a huge urban atrium: thick curved boundary with
 // TRUE open central garden (no bridge over original road).
 // Set center +164m beyond road center; outer cliff radius <=103m,
 // leaving >60m clearance to any facade (14m actual road half width 7m).
 const center=164,outer=101,inner=63,
  n=48,levels=6,lo=-11,highest=191;
 const rings=[];
 for(let j=0;j<=levels;j++){
  const t=j/levels,scale=1-.08*t,y=lo+(highest-lo)*t,
   rOut=outer*scale,rIn=inner*(1+.085*t),points=[];
  for(let i=0;i<=n;i++){
   const s=i/n,angle=-2.34+4.28*s;
   const backBend=11*t*Math.sin(s*Math.PI);
   const point=(r)=>xyz(f,center+r*Math.cos(angle)+backBend,
     8+r*.81*Math.sin(angle),y+Math.sin(Math.PI*s)*6*t);
   points.push({outer:point(rOut),inner:point(rIn)});
  }
  rings.push(points);
 }
 for(let j=0;j<levels;j++)for(let i=0;i<n;i++){
  const a=rings[j][i],b=rings[j][i+1],d=rings[j+1][i],e=rings[j+1][i+1],
   idx=i/n,t=j/levels;
  // Avoid an endless solid wall: large cut-out bays are actual absences,
  // not painted-on window rectangles.
  const airBay=j>0&&j<levels-1&&(i%12>=3&&i%12<=6)&&j%3===1;
  if(!airBay){
   quad(v,a.outer,b.outer,e.outer,d.outer,
    j===0?O.earth:j===levels-1?O.ivory:j%2?O.pale:O.metal);
   quad(v,d.inner,e.inner,b.inner,a.inner,j%2?O.glass:O.inner);
  }else stat.trueEmptyBays++;
  if(j===0||j===levels-1||j===3){
   quad(v,a.outer,a.inner,b.inner,b.outer,j===3?O.gold:O.ivory);
   stat.structuralTerraces++;
  }
  if(i%6===0&&j!==1){
   quad(v,a.outer,a.inner,d.inner,d.outer,O.metal);
  }
 }
 for(const i of [0,n]){
  for(let j=0;j<levels;j++){
   const a=rings[j][i],b=rings[j+1][i];
   quad(v,a.outer,a.inner,b.inner,b.outer,O.ivory);
  }
 }
 stat.heroBuildingCount++;
 stat.singleOpenAtrium++;
 stat.sourceFocalStation=.53;
 stat.heroRoadEdgeClearanceLowerBoundM=center-outer-9;
}
function inhabitedQuarters(v,sample,stage,stat){
 // A few distinct MASSIVE but open public terraces. They are architecturally
 // linked by long spatial rhythm, not replicated over five camera spots.
 const sequences=[
  {u:.16,side:-1,dist:116,along:-15,width:114,length:95,y:1,depth:12,color:O.earth,kind:'landscape gateway'},
  {u:.35,side:-1,dist:104,along:26,width:92,length:118,y:11,depth:13,color:O.pale,kind:'public transport atrium'},
  {u:.67,side:-1,dist:121,along:-49,width:101,length:123,y:3,depth:12,color:O.metal,kind:'makers gallery'},
  {u:.77,side:+1,dist:118,along:-25,width:89,length:118,y:8,depth:12,color:O.ivory,kind:'residential terraces'}
 ];
 for(const [index,c] of sequences.entries()){
  const f=realFrame(stage.surfaces[0],c.u,c.side,sample);
  // Terraces are outboard NON-COLLIDING roof/plaza void architecture, never
  // flat invisible support for the ball.
  slab(v,f,c.dist,c.along,c.width,c.length,c.y,c.depth,c.color);
  const base=xyz(f,c.dist,c.along,c.y-14);
  const h=26+12*(index%3);
  for(const k of [-1,1]){
   const p=plus(base,mul(f.forward,c.length*k*.32));
   prism(v,plus(p,[0,h*.5,0]),mul(f.forward,12),mul(f.out,c.width*.44),
    h,index%2?O.pale:O.earth);
  }
  // Two large glazed courtyard openings remain empty between the legs.
  const courtSide=c.dist+c.width*.21;
  const out=xyz(f,courtSide,c.along,-1);
  prism(v,plus(out,[0,5,0]),mul(f.forward,c.length*.34),
   mul(f.out,3.1),10,O.glass);
  stat.supportingProgrammes.push(c.kind);stat.publicCourtyards++;
 }
}
function visibleFocalGround(v,f,stat){
 // The hero plaza is a ring of DISCONNECTED peripheral floors, with
 // unmistakable central void and a clear approach sightline.
 const R=68,r=41,n=30;
 for(let i=0;i<n;i++){
  const a0=(-2.25+i*4.12/n),a1=(-2.25+(i+1)*4.12/n);
  const A=r=>xyz(f,164+r*Math.cos(a0),7+r*.83*Math.sin(a0),-7);
  const B=r=>xyz(f,164+r*Math.cos(a1),7+r*.83*Math.sin(a1),-7);
  quad(v,A(R),B(R),B(r),A(r),i%4===0?O.teal:O.earth);
 }
 stat.centralCourtOpen=true;
}
export function buildR19A3IntegratedCivicCity(stage,sample,{enabled=false}={}){
 const identity=stage?.stageForge?.recordStageId;
 const allowed=['VB-P101-A13-W9C1-ULTRA','VB-P101-A13-W9C1-CONTROL'];
 const empty={active:false,vertices:[],triangles:0,colliders:0,ART:'HOLD'};
 if(!enabled||!allowed.includes(identity))return empty;
 failIf(stage?.surfaces?.length!==7||stage?.movingObstacles?.length!==28||
  stage.surfaces.some(s=>!s.collidable||!s.rideable||s.rows!==31||s.cols!==5),
  'genuine 7 original B48 / 28 B51 source missing');
 const old=JSON.stringify(stage),vertices=[],stat={
  heroBuildingCount:0,singleOpenAtrium:0,trueEmptyBays:0,
  structuralTerraces:0,publicCourtyards:0,supportingProgrammes:[],
  heroRoadEdgeClearanceLowerBoundM:null,sourceFocalStation:null,
  centralCourtOpen:false,ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',
  PERFORMANCE:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'};
 const f=realFrame(stage.surfaces[0],.53,1,sample);
 shell(vertices,f,stat);visibleFocalGround(vertices,f,stat);
 inhabitedQuarters(vertices,sample,stage,stat);
 failIf(JSON.stringify(stage)!==old,'physical stage or B51 mutated');
 failIf(stat.heroBuildingCount!==1||stat.singleOpenAtrium!==1||
  stat.publicCourtyards!==4||stat.trueEmptyBays<6||stat.heroRoadEdgeClearanceLowerBoundM<45,
  'urban composition gate failed');
 failIf(vertices.length%18!==0||vertices.length/18<2000||
  vertices.length/18>25000||vertices.some(x=>!Number.isFinite(x)),
  'source 3D vertices invalid');
 return {active:true,vertices,triangles:vertices.length/18,colliders:0,
  noDriveableArt:true,originalB48:7,originalB51:28,mode:'ONE_CIVIC_BASILICA',
  ...stat};
}

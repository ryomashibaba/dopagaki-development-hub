/** R77: isolated road-aligned open fjord excavation + one portal underpass study.
 * Rendering ONLY; physical road, B51, camera and 240 Hz runner stay R75-original.
 * Replaces rejected R76 environment; never stacked with scenery or collider data.
 */
const K={
 night:[.046,.095,.141], deep:[.065,.165,.202], water:[.083,.245,.286],
 shadow:[.091,.164,.188], basalt:[.154,.260,.287], slate:[.215,.348,.359],
 lightRock:[.335,.443,.427], sunlit:[.493,.531,.451], gold:[.87,.541,.234],
 copper:[.43,.317,.228], ceramic:[.55,.64,.57], glass:[.118,.45,.485],
 asphalt:[.075,.145,.194], roadMid:[.101,.204,.249], stripe:[.31,.775,.79],
 lip:[.95,.679,.347], rim:[.21,.34,.37]
};
const len=(a)=>Math.hypot(...a),sub=(a,b)=>a.map((x,i)=>x-b[i]),normal=a=>a.map(x=>x/(len(a)||1));
const mix=(a,b,t)=>a.map((v,i)=>v*(1-t)+b[i]*t);
const tri=(a,p,q,r,c)=>a.push(...p,...c,...q,...c,...r,...c);
const quad=(a,p,q,r,s,c)=>{tri(a,p,q,r,c);tri(a,p,r,s,c);};
function colorNormal(a,b,c,base,brightness=1){
 const u=sub(b,a),v=sub(c,a),n=normal([u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]]);
 const sun=Math.abs(n[0]*.56+n[1]*.72+n[2]*-.41);
 return base.map(x=>Math.max(0,Math.min(1,x*brightness*(.70+.30*sun))));
}
const sculpt=(x,t,z)=>.36*Math.sin(24*t+z*2.2)+.25*Math.sin(59*t-z*1.9)+.16*Math.cos(x*.08+11*t);
export function buildR77FjordGateway(stage,sample){
 if(stage.surfaces.length!==7||stage.movingObstacles.length!==28||!stage.stageForge?.r75Pilot)throw Error('R77 requires frozen R75 research stage');
 const s=stage.surfaces[0];if(s.voidLongitudinalCells?.join(',')!=='52,53,54')throw Error('No fake physical chasm');
 const env=[],road=[],metadata={};
 const anchor=u=>{
  const mid=sample(s,u,.5),l=sample(s,u,0),r=sample(s,u,1);
  const lateral=normal([r[0]-l[0],0,r[2]-l[2]]);
  const half=len([r[0]-l[0],0,r[2]-l[2]])/2;
  return {mid,half,lateral};
 };
 const p=(u,sign,offset,height)=>{
  const {mid,half,lateral}=anchor(u),dist=sign*(half+offset);
  return [mid[0]+lateral[0]*dist,mid[1]+height,mid[2]+lateral[2]*dist];
 };
 // Asymmetrical vast bay: on LEFT the mountain rises far behind the edge,
 // on RIGHT the continuous terrain falls toward a deep drowned basin.
 const banks=[
  {sign:-1,sections:[[30,-24],[65,-46],[107,-27],[155,36],[222,120],[306,150],[430,108]],colors:[K.shadow,K.basalt,K.slate,K.lightRock,K.sunlit,K.slate]},
  {sign:1,sections:[[19,-27],[51,-79],[99,-154],[166,-212],[245,-227],[345,-185],[470,-150]],colors:[K.deep,K.basalt,K.slate,K.shadow,K.deep,K.lightRock]}
 ];
 const steps=100;
 for(let sideIndex=0;sideIndex<banks.length;sideIndex++){
  const bank=banks[sideIndex];
  const point=(u,i)=>{
   const [off,alt]=bank.sections[i];
   const bulge=(i>1?sculpt(off,u,i)*Math.min(i*2.5,11):0);
   const feature=i>2&&bank.sign===-1?15*Math.sin(Math.PI*u)**2*Math.sin(2.7*Math.PI*u+i*.33):0;
   return p(u,bank.sign,off,alt+bulge+feature);
  };
  for(let i=0;i<steps;i++){
   const u=i/steps,v=(i+1)/steps;
   for(let j=0;j<bank.sections.length-1;j++){
    const a=point(u,j),b=point(u,j+1),c=point(v,j+1),d=point(v,j);
    const shade=(j===0?K.shadow:bank.colors[(j+Math.floor(i/17))%bank.colors.length]);
    const tint=Math.sin(6.283*(u+.08*j))*.035;
    quad(env,a,b,c,d,colorNormal(a,b,c,shade,1+tint));
   }
  }
 }
 // Strong geological ribbons: embedded into bedrock, not isolated beams.
 // Each runs continuously with the valley; widths and heights follow terrain.
 for(const band of [[-1,70,-25],[-1,108,32],[-1,165,112],[1,101,-151],[1,167,-211]]){
  const [side,off,h]=band;
  for(let i=0;i<80;i++){
   const u=i/80,v=(i+1)/80,irreg=2.2*Math.sin(13*u+off);
   const a=p(u,side,off,h+irreg),b=p(v,side,off,h+2.2*Math.sin(13*v+off));
   const c=p(v,side,off+3,h+3+2.2*Math.sin(13*v+off));
   const d=p(u,side,off+3,h+3+irreg);
   quad(env,a,b,c,d,side<0?K.copper:K.slate);
  }
 }
 // Continuous lower reservoir/industrial estuary: beneath the road and open
 // around the real three-cell gap (does not bridge or collide with that gap).
 for(let i=0;i<85;i++){
  const u=i/85,v=(i+1)/85;
  const a=p(u,1,105,-237),b=p(u,1,505,-237),c=p(v,1,505,-237),d=p(v,1,105,-237);
  quad(env,a,b,c,d,i%13<2?K.water:K.deep);
 }
 // B1 ART HOLD: the temporary facade was removed because the old geometric
 // repetition read as vertical fins rather than inhabitable civic rooms.
 // ONE actual overhead passage at u=.30..36: structural elliptical cutout.
 // Side footings sink into the continuous earthworks instead of floating.
 const portal={from:.432,to:.470,rx:62,ry:53,thickX:10,thickY:11};
 const arc=(u,t,outer)=>{
  const {mid,lateral}=anchor(u),rx=portal.rx+(outer?portal.thickX:0),ry=portal.ry+(outer?portal.thickY:0);
  const dx=rx*Math.cos(t),height=8+ry*Math.sin(t);
  return [mid[0]+dx*lateral[0],mid[1]+height,mid[2]+dx*lateral[2]];
 };
 for(let i=0;i<12;i++)for(let j=0;j<32;j++){
  const u=portal.from+(portal.to-portal.from)*i/12,v=portal.from+(portal.to-portal.from)*(i+1)/12;
  const a=Math.PI*j/32,b=Math.PI*(j+1)/32;
  const inner0=arc(u,a,false),inner1=arc(u,b,false),next1=arc(v,b,false),next0=arc(v,a,false);
  const out0=arc(u,a,true),out1=arc(u,b,true),nOut1=arc(v,b,true),nOut0=arc(v,a,true);
  quad(env,inner0,inner1,next1,next0,j%8===0?K.copper:K.basalt);
  quad(env,out1,out0,nOut0,nOut1,j%8===0?K.sunlit:K.slate);
  if(i===0)quad(env,out0,out1,inner1,inner0,j%8===0?K.gold:K.ceramic);
  if(i===11)quad(env,inner0,inner1,out1,out0,K.shadow);
 }
 // Arch shoulders extend into source-registered outboard terrain; no collider.
 for(const sign of [-1,1])for(let i=0;i<12;i++){
  const u=portal.from+(portal.to-portal.from)*i/12,v=portal.from+(portal.to-portal.from)*(i+1)/12;
  const side=sign<0?Math.PI:0;
  const inner=arc(u,side,false),outer=arc(u,side,true),inNext=arc(v,side,false),outNext=arc(v,side,true);
  const bankPoint=p(u,sign,170,-100),bankNext=p(v,sign,170,-100);
  quad(env,outer,outNext,bankNext,bankPoint,sign===-1?K.basalt:K.slate);
  quad(env,inner,outer,outNext,inNext,K.copper);
 }
 // Cinematic ramp edge: actual rideable B48 skin; missing cells remain empty.
 // We do NOT cover the real hole or add physics fixtures.
 const nu=90,nv=48;
 for(let roadIndex=0;roadIndex<2;roadIndex++){
  const surf=stage.surfaces[roadIndex],end=roadIndex===0?nu:15;
  for(let i=0;i<end;i++){
   if(surf.voidLongitudinalCells?.includes(i))continue;
   for(let j=0;j<nv;j++){
    const a=sample(surf,i/nu,j/nv),b=sample(surf,(i+1)/nu,j/nv),
      c=sample(surf,(i+1)/nu,(j+1)/nv),d=sample(surf,i/nu,(j+1)/nv);
    const up=p=>[p[0],p[1]+.09,p[2]];
    let col=(i%14===0?K.roadMid:K.asphalt);
    if(j<=1||j>=nv-2)col=K.lip;
    else if(j===2||j===nv-3)col=K.rim;
    else if((j===23||j===24)&&i%12<6)col=K.stripe;
    else if((j===18||j===29)&&i%9<5)col=K.roadMid;
    quad(road,up(a),up(b),up(c),up(d),col);
   }
  }
 }
 // Road edge structural side face, consistent with actual B48; no collision.
 for(let i=0;i<90;i++){
  if(s.voidLongitudinalCells?.includes(i))continue;
  const u=i/90,v=(i+1)/90;
  for(const side of [0,1]){
   const a=sample(s,u,side),b=sample(s,v,side),below=q=>[q[0],q[1]-3,q[2]];
   quad(env,a,b,below(b),below(a),K.copper);
  }
 }
 metadata.schema='r77-road-integrated-fjord-and-civic-portal/1';metadata.collisionGeometryAdded=0;
 metadata.originalRoads=7;metadata.originalMovingB51=28;metadata.overheadPass={...portal,clearanceRoadCenterMeters:61};
 metadata.road0TrueVoid=s.voidLongitudinalCells.slice();metadata.environmentTriangles=env.length/18;
 metadata.roadOverlayTriangles=road.length/18;metadata.artPass='HOLD_TRUE_WEBGL_AND_HUMAN';
 if([...env,...road].some(x=>!Number.isFinite(x)))throw Error('Nonfinite R77 geometry');
 if(env.length===0||road.length===0)throw Error('Empty R77 mesh');
 return {environmentVertices:env,roadVertices:road,metadata};
}

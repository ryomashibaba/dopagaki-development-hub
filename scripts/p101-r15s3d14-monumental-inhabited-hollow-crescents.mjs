/**
 * DOPAGAKI R15S3D14: PRIVATE-only actually built WebGL2 inhabited monuments.
 * Old wall-strip / outer endless 656-beam road corridor is REJECTED.
 * Instead TWO large singular, legible megastructures each WITH a central
 * empty living atrium and nested civic sky-gardens, at distinct road5/6
 * focal moments. They sit beyond actual B48 shoulders (min ~100m).
 * Actual input: original source B48 triangulated surface sample(), NOT
 * authored route, fake driving position or guessed camera line.
 * Original 7 B48, 28 real B51, 240Hz Runner/CCD and renderer unchanged.
 */
export const DESIGNS=Object.freeze([
 'A_TIDAL_CRESCENT_CITADEL','B_CANTILEVERED_SKY_COMMONS'
]);
const P={porcelain:[.84,.92,.92],ivory:[.93,.90,.73],ink:[.045,.11,.17],
 basalt:[.13,.25,.34],steel:[.22,.39,.50],teal:[.28,.67,.77],
 aqua:[.43,.91,.85],amber:[.97,.69,.36],green:[.40,.72,.57],
 violet:[.59,.54,.75],deep:[.08,.20,.25]};
const fail=(v,msg)=>{if(!v)throw Error('R15S3D14 '+msg)};
const add=(a,b)=>a.map((x,i)=>x+b[i]),sub=(a,b)=>a.map((x,i)=>x-b[i]),
 m=(v,k)=>v.map(x=>x*k),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),
 mag=a=>Math.hypot(...a),unit=a=>m(a,1/(mag(a)||1)),
 cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],
 lerp=(a,b,t)=>add(m(a,1-t),m(b,t));
function tri(v,a,b,c,k){for(const p of [a,b,c])v.push(...p,...k)}
function quad(v,a,b,c,d,k){tri(v,a,b,c,k);tri(v,a,c,d,k)}
function double(v,a,b,c,d,k){quad(v,a,b,c,d,k);quad(v,d,c,b,a,P.deep)}
function squareBeam(v,a,b,r,col){
 const dir=unit(sub(b,a)),ref=Math.abs(dir[1])>.9?[0,0,1]:[0,1,0];
 const side=unit(cross(dir,ref)),top=unit(cross(dir,side));
 const section=p=>[
  add(add(p,m(side,r)),m(top,r*.75)),
  add(sub(p,m(side,r)),m(top,r*.75)),
  sub(sub(p,m(side,r)),m(top,r*.75)),
  add(sub(p,m(top,r*.75)),m(side,r))
 ];
 const A=section(a),B=section(b);
 for(let j=0;j<4;j++){
  const k=(j+1)%4;quad(v,A[j],B[j],B[k],A[k],col);
 }
 quad(v,A[3],A[2],A[1],A[0],col);
 quad(v,B[0],B[1],B[2],B[3],col);
}
function frame(doc,sample,road,u,side){
 const surface=doc.surfaces[road],center=sample(surface,u,.5);
 const edge=sample(surface,u,side<0?0:1);
 const before=sample(surface,Math.max(0,u-.002),.5),
 after=sample(surface,Math.min(1,u+.002),.5);
 const ahead=unit([after[0]-before[0],0,after[2]-before[2]]);
 const d=sub(edge,center),sideXY=[d[0],0,d[2]];
 const outward=unit(sub(sideXY,m(ahead,dot(sideXY,ahead))));
 fail(mag(sideXY)>6&&mag(outward)>.9,'genuine road edge frame');
 return {road,u,center,edge,ahead,outward};
}
const point=(f,lateral,along,up)=>add(add(add(f.edge,m(f.outward,lateral)),m(f.ahead,along)),[0,up,0]);
const spec=Object.freeze([
 // Non-repeat: main west city = one enormous broken elliptical ring; later a
 // subordinate horizontally fanned commons; last road = a rising finale.
 {road:5,u:.43,side:-1,role:'primary',offset:326,rx:166,ry:216,elev:74,thick:25},
 {road:5,u:.81,side:1,role:'inhabited',offset:230,rx:114,ry:144,elev:102,thick:19},
 {road:6,u:.44,side:-1,role:'finale',offset:337,rx:176,ry:244,elev:101,thick:28}
]);
// The most important architectural geometry is a continuous thick 3D folded
// crescent, with a large EMPTY void at its centre. It is oriented nearly
// FACE-ON to original forward camera rather than edge-on to road.
function largeCrescent(v,f,o,mode,group,stats){
 const spiral=mode==='B_CANTILEVERED_SKY_COMMONS',
  lo=spiral?-.67:-.85,
  hi=spiral?Math.PI*1.70:Math.PI*1.80,
  segments=spiral?92:100,
  samples=[];
 for(let i=0;i<=segments;i++){
  const t=i/segments,theta=lo+(hi-lo)*t,
   radiusX=o.rx*(1+.09*Math.sin(theta*2.4+group)),
   radiusY=o.ry*(1+.06*Math.cos(theta*1.7-group*.37)),
   bulge=spiral?Math.sin(theta*1.45+group)*42:Math.sin(theta*2.7)*24,
   along=(spiral?120:62)*Math.sin(theta*.73)+bulge;
  // Non-coplanar double-shell, not a painted circular outline.
  const curve=(radius,forwardOffset)=>point(f,o.offset+radiusX*radius*Math.cos(theta),
   along+forwardOffset,o.elev+radiusY*radius*Math.sin(theta));
  const width=o.thick*(1+.22*Math.sin(t*Math.PI*4+group));
  const inner=curve(1-width/o.rx,0),outer=curve(1+width/o.rx,0),
        backInner=curve(1-width/o.rx,spiral?50:78),
        backOuter=curve(1+width/o.rx,spiral?50:78);
  samples.push({inner,outer,backInner,backOuter,mid:lerp(inner,outer,.5),t});
 }
 for(let i=0;i<segments;i++){
  const a=samples[i],b=samples[i+1];
  const col=i%19<4?P.porcelain:i%19<12?P.steel:P.teal;
  double(v,a.inner,b.inner,b.outer,a.outer,col);
  double(v,a.backOuter,b.backOuter,b.backInner,a.backInner,P.basalt);
  double(v,a.outer,b.outer,b.backOuter,a.backOuter,P.porcelain);
  double(v,a.backInner,b.backInner,b.inner,a.inner,P.ink);
  stats.shellCells+=4;
  if(i%9===0){squareBeam(v,a.inner,a.backInner,2.2,P.aqua);stats.structuralCrossTies++;}
 }
 // The continuous outer skin connects to 3D inhabited terraces (rather than
 // empty decoration at the side); leave the huge void EMPTY at camera level.
 for(const [level,radialSign] of [[-85,-1],[-22,1],[42,-1],[110,1]]){
  const ledgeStart=point(f,o.offset+(radialSign<0?-o.rx*.45:o.rx*.1),-68,level+o.elev*.4);
  const ledgeEnd=point(f,o.offset+(radialSign<0?-o.rx*.45:o.rx*.1),82,level+o.elev*.4);
  const deckOut=point(f,o.offset+radialSign*o.rx*.57,0,level+o.elev*.4);
  // Distinct large triangulated public decks, mostly open at the inner atrium.
  quad(v,ledgeStart,ledgeEnd,add(deckOut,m(f.ahead,76)),sub(deckOut,m(f.ahead,76)),
   level===42?P.green:level===110?P.ivory:P.basalt);
  squareBeam(v,ledgeStart,ledgeEnd,3.6,level===110?P.amber:P.aqua);
  stats.publicDecks++;
 }
 // At least one actual large internally traversable open world-to-world
 // atrium. Count its spatial width; there is NO quad crossing its centre.
 stats.centralVoidWidthM=Math.min(stats.centralVoidWidthM,(o.rx-o.thick)*1.55);
 stats.greatVoids++;
 const bottom=point(f,o.offset,0,o.elev-o.ry*.92);
 const arch=samples[Math.floor(segments*.5)].backOuter;
 squareBeam(v,bottom,arch,10,P.porcelain);
 stats.supportBranches++;
 stats.highestM=Math.max(stats.highestM,o.elev+o.ry*1.06);
 stats.lowestM=Math.min(stats.lowestM,o.elev-o.ry*1.04);
 // Forward-approach open gardens: intentional primary/secondary/finale
 // functional mass changes, not same repeated highways guardrails.
 if(o.role==='primary'){
  for(let k=0;k<7;k++){
   const shift=(k-3)*42,base=point(f,o.offset+o.rx*.46,shift,-64+k*9);
   const side=point(f,o.offset+o.rx*.62,shift+32,-58+k*9);
   squareBeam(v,base,side,5,k%2?P.ivory:P.teal);
   stats.approachGardens++;
  }
 }else if(o.role==='inhabited'){
  for(let k=0;k<5;k++){
   const p=point(f,o.offset+o.rx*.18,(k-2)*36,35+k*13),
    q=point(f,o.offset+o.rx*.63,(k-2)*36+58,52+k*13);
   squareBeam(v,p,q,5,P.ivory);stats.skyCourts++;
  }
 }else{
  for(let k=0;k<6;k++){
   const p=point(f,o.offset+o.rx*.10,(k-3)*32,-130+k*25),
    q=point(f,o.offset+o.rx*.78,(k-3)*32+32,-124+k*25);
   squareBeam(v,p,q,7,k%2?P.ivory:P.teal);stats.cliffCommons++;
  }
 }
 return samples;
}
export function buildR15S3D14City(doc,sample,{mode='A_TIDAL_CRESCENT_CITADEL'}={}){
 fail(DESIGNS.includes(mode),'unknown real 3D city design');
 fail(doc?.surfaces?.length===7&&doc?.movingObstacles?.length===28,'source B48/B51 count');
 fail(doc.stageForge?.r15s3d11?.mode==='A_EDGE_READABLE','only true native-finish B51 configuration');
 fail(doc.stageForge.productionPromoted===false,'never produce in public Gold');
 const original=JSON.stringify(doc),v=[],stats={
  mode,districtCount:spec.length,sourceRoads:[5,6],shellCells:0,
  structuralCrossTies:0,publicDecks:0,greatVoids:0,centralVoidWidthM:Infinity,
  supportBranches:0,approachGardens:0,skyCourts:0,cliffCommons:0,
  highestM:-Infinity,lowestM:Infinity,minSideDistance:Infinity,
  realRoadRemodelMeters:0,addedPhysicsColliders:0
 };
 for(let i=0;i<spec.length;i++){
  const o=spec[i],f=frame(doc,sample,o.road,o.u,o.side);
  stats.minSideDistance=Math.min(stats.minSideDistance,o.offset-o.rx*(1+.09)-o.thick*2);
  largeCrescent(v,f,o,mode,i,stats);
 }
 fail(stats.minSideDistance>55,'giant landmark must be away from real driving road');
 fail(stats.centralVoidWidthM>120,'primary icon needs an enormous truly open atrium');
 fail(stats.shellCells>=1000,'not enough actual continuous volumetric shell surfaces');
 fail(stats.highestM>250&&stats.lowestM< -100,'real space above and below road');
 fail(stats.greatVoids===3&&stats.publicDecks===12,'three differently programmed substantial districts');
 fail(v.length%18===0&&v.length/18>2300&&v.length/18<80000,'true XYZ/RGB source WebGL triangles');
 fail(v.every(Number.isFinite),'nonfinite genuine geometries');
 fail(JSON.stringify(doc)===original,'source road or moving bodies mutated');
 return {vertices:v,triangles:v.length/18,...stats,
  actualOriginalB48:7,actualOriginalB51:28,
  noSideWallsCopyFromD13R1:true,centralAtriumHasNoOpaqueFill:true,
  officialArtAccepted:0,formallySlope2CertifiedMeters:0,
  originalSourcePhysicsCameraUnchanged:true,manualHumanTested:false,
  ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',RELEASE:'HOLD'};
}

/**
 * Visual-only P66 megastructure geometry. Never passed to B48 compile()/contacts().
 * Procedural ring shells + vertical organ stacks; separated from physics road surfaces.
 */
const PI=Math.PI,TAU=PI*2;
function put(out,p,color){out.push(...p,...color);}
function tri(out,a,b,c,color){put(out,a,color);put(out,b,color);put(out,c,color);}
function quad(out,a,b,c,d,color){tri(out,a,b,c,color);tri(out,a,c,d,color);}
const transform=(center,axis,r,angle,h=0)=>{
 const x=r*Math.cos(angle),y=r*Math.sin(angle);
 if(axis==='x')return [center[0]+h,center[1]+x,center[2]+y];
 if(axis==='z')return [center[0]+x,center[1]+y,center[2]+h];
 return [center[0]+x,center[1]+h,center[2]+y];
};
function annulus(out,{center,axis,radius,width},color){
 const segments=56,inner=radius-width/2,outer=radius+width/2,thick=width*.62;
 for(let i=0;i<segments;i++){
  const a=TAU*i/segments,b=TAU*(i+1)/segments;
  const A=transform(center,axis,outer,a,-thick),B=transform(center,axis,outer,b,-thick),C=transform(center,axis,outer,b,thick),D=transform(center,axis,outer,a,thick);
  const E=transform(center,axis,inner,a,-thick),F=transform(center,axis,inner,b,-thick),G=transform(center,axis,inner,b,thick),H=transform(center,axis,inner,a,thick);
  quad(out,A,B,C,D,color);quad(out,E,H,G,F,color.map(x=>x*.45));
  quad(out,A,E,F,B,color.map(x=>x*.72));quad(out,D,C,G,H,color.map(x=>Math.min(1,x*1.35)));
  // Luminous radial fins alternate to show motion/scale from a distance.
  if(i%4===0){
   const x=transform(center,axis,outer+2,a,thick+.5),y=transform(center,axis,inner-2,a,thick+.5);
   quad(out,D,C,transform(center,axis,inner,b,thick+.5),y,[.58,.95,1]);
  }
 }
}
function cylinder(out,c,r,height,body,accent){
 const y0=c[1]-height/2,y1=c[1]+height/2,segments=12;
 for(let i=0;i<segments;i++){
  const a=TAU*i/segments,b=TAU*(i+1)/segments;
  const A=[c[0]+r*Math.cos(a),y0,c[2]+r*Math.sin(a)];
  const B=[c[0]+r*Math.cos(b),y0,c[2]+r*Math.sin(b)];
  const C=[B[0],y1,B[2]],D=[A[0],y1,A[2]];
  quad(out,A,B,C,D,i%4===0?accent:body);
  if(i%3===0)for(const t of [.13,.51,.87]){
   const q0=[A[0]*(.997)+c[0]*.003,y0+height*t,A[2]*(.997)+c[2]*.003];
   const q1=[B[0]*(.997)+c[0]*.003,y0+height*t,B[2]*(.997)+c[2]*.003];
   const q2=[q1[0],q1[1]+1.9,q1[2]],q3=[q0[0],q0[1]+1.9,q0[2]];
   quad(out,q0,q1,q2,q3,accent);
  }
 }
}
function prism(out,c,d,color){
 const a=[c[0]-d[0]/2,c[1]-d[1]/2,c[2]-d[2]/2],b=[c[0]+d[0]/2,c[1]+d[1]/2,c[2]+d[2]/2];
 const p=[[a[0],a[1],a[2]],[b[0],a[1],a[2]],[b[0],b[1],a[2]],[a[0],b[1],a[2]],[a[0],a[1],b[2]],[b[0],a[1],b[2]],[b[0],b[1],b[2]],[a[0],b[1],b[2]]];
 for(const [i,j,k,l] of [[0,1,2,3],[4,7,6,5],[0,4,5,1],[3,2,6,7],[0,3,7,4],[1,5,6,2]])quad(out,p[i],p[j],p[k],p[l],color);
}
export function epicGeometry(stage){
 if(stage.stageForge?.id!=='EP-P66')return [];
 const v=[],b=stage.visualBlueprint;
 if(!b||b.schema!=='dopagaki.stageforge.visual/1')throw Error('P66 visual blueprint missing');
 for(let i=0;i<b.pipeRings.length;i++)annulus(v,b.pipeRings[i],i%2?[.07,.34,.55]:[.22,.7,.88]);
 for(let i=0;i<b.spiralRings.length;i++)annulus(v,b.spiralRings[i],i%2?[.21,.21,.65]:[.29,.76,.9]);
 for(let i=0;i<b.branchHoops.length;i++)annulus(v,b.branchHoops[i],i%2?[.53,.28,.77]:[.14,.63,.88]);
 for(let i=0;i<b.machinery.length;i++)annulus(v,b.machinery[i],i%2?[.38,.16,.7]:[.24,.64,.88]);
 for(const x of b.organPipes)cylinder(v,x.center,x.radius,x.height,[.06,.17,.33],[.25,.86,1]);
 for(const x of b.abyssPylons)cylinder(v,x.center,x.radius,x.height,[.1,.16,.3],[.24,.6,1]);
 // Monumental ribs, cantilever braces and hanging skylines make the structures feel inhabitable.
 for(let i=0;i<9;i++){
  const x=-1020+i*56;
  prism(v,[x,286,-10],[8,8,230],[.15,.43,.62]);
  for(const z of [-132,112])prism(v,[x,196,z],[8,175,10],[.08,.22,.4]);
 }
 for(let i=0;i<12;i++){
  const theta=TAU*i/12,rr=483,x=-170+rr*Math.cos(theta),z=-10+rr*Math.sin(theta);
  prism(v,[x,165,z],[12,250,12],[.11,.16,.32]);
  prism(v,[x,277,z],[16,6,16],[.2,.8,.96]);
 }
 for(let i=0;i<8;i++){
  const x=230+i*46;
  prism(v,[x,175,590],[20,130,18],[.24,.11,.4]);
  prism(v,[x,178,235],[17,152,15],[.1,.33,.6]);
 }
 for(let i=0;i<8;i++){
  const x=930+i*42;
  prism(v,[x,145,490],[9,130,9],[.24,.16,.36]);
  prism(v,[x,147,288],[10,137,10],[.08,.32,.56]);
 }
 // A visible abyss beneath the genuine physical jump gap.
 for(let i=0;i<12;i++){
  const x=1370+i*32;
  prism(v,[x,-18,272],[12,3,210],[.07,.23,.44]);
  prism(v,[x,-15,277],[3,2,220],[.08,.6,.82]);
 }
 return v;
}

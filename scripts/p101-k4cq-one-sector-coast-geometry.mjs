/** K4CQ: one authored, non-colliding coastal apex scene along the genuine
 * R15S3D9 A 16m physical Road5. SAME triangles are used by original WebGL2
 * and native Blender OBJ; no fake road or camera, no production inclusion.
 */
export const K4CQ_SCENE_ID='K4CQ_ONE_ROAD5_TO6_COASTAL_LANDING_R2_PRIVATE';
export const K4CQ_COLORS=Object.freeze({
  basalt:[.135,.19,.23], slate:[.25,.33,.35],chalk:[.56,.56,.49],
  tidal:[.075,.37,.46], deep:[.025,.17,.25],foam:[.42,.71,.73],
  copper:[.66,.46,.25],warning:[.96,.69,.22],shadow:[.08,.12,.16],ochre:[.35,.30,.26],moss:[.17,.29,.28],navigation:[.37,.78,.69]
});
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const scale=(a,f)=>a.map(v=>v*f);
const unit=a=>scale(a,1/(Math.hypot(...a)||1));
const mix=(a,b,t)=>a.map((v,i)=>v*(1-t)+b[i]*t);
const sq=x=>x*x;
function ensure(condition,msg){if(!condition)throw Error('K4CQ '+msg);}
export function makeK4CQScene(doc,sample){
  ensure(doc?.surfaces?.length===7&&doc.movingObstacles?.length===28,'requires real 7 B48, 28 B51');
  ensure(doc.stageForge?.r15s3d9?.mode==='A_CONTINUOUS_NARROW_MACRO','requires known physically running R15S3D9 A candidate');
  ensure(doc.stageForge?.productionPromoted===false,'production prohibited');
  const before=JSON.stringify(doc),road5=doc.surfaces[5],road6=doc.surfaces[6],tris=[];
  ensure([road5,road6].every(s=>s.rows===31&&s.cols===5),'real Road5/6 control nets required');
  const N5=92,N6=38,N=N5+N6,stations=[];
  for(let i=0;i<=N;i++){
    const t=i/N,which=i<=N5?5:6,u=i<=N5?.12+.88*i/N5:(i-N5)*.36/N6;
    const road=doc.surfaces[which],p=sample(road,u,.5),l=sample(road,u,0),r=sample(road,u,1);
    const L=unit([l[0]-p[0],0,l[2]-p[2]]),R=unit([r[0]-p[0],0,r[2]-p[2]]);
    ensure([p,l,r,L,R].every(a=>a.every(Number.isFinite)),'non-finite sampled original geometry');
    ensure(Math.hypot(l[0]-r[0],l[2]-r[2])>10,'road lateral span too narrow for separated scenery');
    stations.push({t,u,which,p,l,r,L,R});
  }
  // The sea datum must be below EVERY road sample in this entire 1-sector pilot.
  const datum=Math.min(...stations.map(s=>s.p[1]))-16;
  ensure(Math.hypot(...stations[N5].p.map((x,k)=>x-stations[N5+1].p[k]))<80,'source Road5-6 physical seam discontinuity');
  const place=(s,side,outboard,elevation)=>{
    const edge=side==='L'?s.l:s.r,n=side==='L'?s.L:s.R;
    return add(add(edge,scale(n,outboard)),[0,elevation,0]);
  };
  const face=(a,b,c,mat)=>{ensure(K4CQ_COLORS[mat]!==undefined,'unknown material');tris.push({a,b,c,mat});};
  const quad=(a,b,c,d,m)=>{face(a,b,c,m);face(a,c,d,m);face(c,b,a,m);face(d,c,a,m);};
  // Terrain is a continuous, intentionally cut 3D coast, not free-standing boxes.
  // A tall opening at 49%-61% gives advance information about the actual apex.
  for(let i=0;i<N;i++){
    const a=stations[i],b=stations[i+1],t=(a.t+b.t)/2;
    // R1 failed visually: one huge monochrome slate wall at 58/64s.
    // R2: six lower terraced formations, real voids in the distant plateau,
    // with a legible road5->road6 continuation (not a painted image).
    const land=s=>{
      const v=s.t,swell=Math.sin(Math.PI*v)**2;
      return [
        place(s,'L',29,-17+2*Math.sin(v*8)),
        place(s,'L',46,-8+2*Math.sin(v*13)),
        place(s,'L',67,4+3*Math.sin(v*16)),
        place(s,'L',96,13+5*Math.sin(v*12)+5*swell),
        place(s,'L',138,27+6*Math.sin(v*11)+8*swell),
        place(s,'L',189,29+6*Math.sin(v*11+.7)),
        place(s,'L',235,22+5*Math.sin(v*7+.3))
      ];
    };
    const A=land(a),B=land(b);
    for(let j=0;j<6;j++){
      if(j>=3&&((t>.27&&t<.40)||(t>.58&&t<.72)))continue;
      const mats=['shadow','basalt','slate','ochre','chalk','moss'];
      quad(A[j],B[j],B[j+1],A[j+1],mats[j]);
    }
    // Outboard terraced footprint and a low continuous shoreline on the right.
    const shore=s=>32+9*Math.sin(s.t*3.4*Math.PI)**2;
    const A0=place(a,'R',32,-14),B0=place(b,'R',32,-14);
    const A1=place(a,'R',shore(a)+18,datum+13-a.r[1]);
    const B1=place(b,'R',shore(b)+18,datum+13-b.r[1]);
    quad(A0,B0,B1,A1,'basalt');
    const A2=place(a,'R',shore(a)+65,datum-a.r[1]);
    const B2=place(b,'R',shore(b)+65,datum-b.r[1]);
    quad(A1,B1,B2,A2,'chalk');
    // One mathematically level, physically non-interacting water basin.
    const aNear=place(a,'R',shore(a)+65,datum-a.r[1]);
    const bNear=place(b,'R',shore(b)+65,datum-b.r[1]);
    const aFar=place(a,'R',275,datum-a.r[1]);
    const bFar=place(b,'R',275,datum-b.r[1]);
    quad(aNear,bNear,bFar,aFar,i%19===0?'foam':'tidal');
    // Not collidable. Readable anticipation on the OUTSIDE of true 16m road.
    // Amber appears before apex; copper guides the tangent through its exit.
    if(t>.31&&t<.78){
      const side='L',off=25;
      const x0=place(a,side,off,1.4),x1=place(b,side,off,1.4);
      const y0=place(a,side,off+1.4,3.1),y1=place(b,side,off+1.4,3.1);
      quad(x0,x1,y1,y0,t<.53?'warning':'navigation');
    }
  }
  // Exactly ONE place-integrated pier silhouette: anchored from shoreline,
  // with true height, paired deck / substructure, no crossing over physical road.
  for(let i=54;i<67;i++){
    const a=stations[i],b=stations[i+1];
    const y=datum+17;
    const ring=s=>[place(s,'R',109,y-s.r[1]),place(s,'R',158,y-s.r[1]),
       place(s,'R',158,y-6-s.r[1]),place(s,'R',109,y-6-s.r[1])];
    const A=ring(a),B=ring(b);
    quad(A[0],B[0],B[1],A[1],'copper');
    quad(A[2],B[2],B[3],A[3],'basalt');
    if(i===54||i===66)quad(A[0],A[1],A[2],A[3],'slate');
    if(i%4===0){
       const p=place(a,'R',143,datum-a.r[1]);
       const q=place(a,'R',143,y-6-a.r[1]);
       const w=place(a,'R',146,datum-a.r[1]);
       const z=place(a,'R',146,y-6-a.r[1]);
       quad(p,w,z,q,'slate');
    }
  }
  ensure(tris.length>1000&&tris.length<30000,'scene author geometry envelope invalid');
  const verts=[];
  for(const f of tris)for(const v of [f.a,f.b,f.c])verts.push(...v,...K4CQ_COLORS[f.mat]);
  ensure(verts.every(Number.isFinite),'nonfinite authored mesh');
  ensure(JSON.stringify(doc)===before,'native B48/B51 document mutated');
  return {id:K4CQ_SCENE_ID,triangles:tris.length,tris,vertices:verts,
    oceanDatumY:datum,sourceRoadIndex:5,sourceRoadU:[.12,1],sourceRoadSections:[5,6],sourceRoad6U:[0,.36],
    sourceGameCollidersAdded:0,terrainArtFormalAdoption:0,slope2FormalMeters:0,
    originalGamePhysicsAndCameraUntouched:true};
}

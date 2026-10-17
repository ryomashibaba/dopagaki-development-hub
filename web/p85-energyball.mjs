/**
 * P85: premium high-speed energy ball — purely visual GPU mesh source.
 * Original B48/B51-C physical radius RADIUS=.65, player position, movement,
 * collider and camera are untouched. No particle physics, timers or randomness.
 * All animation uses native simulation time (pause/seek safe).
 */
export const CORE_RADIUS=.642;
export const FILAMENT_RADIUS=.652;
export const ORBIT_RADIUS=.83;
export const MAX_TRAIL_METERS=10;
export const ENERGY_VERTEX_BUDGET=13500;

const PI=Math.PI,TAU=2*PI;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const put=(v,p,c)=>v.push(p[0],p[1],p[2],c[0],c[1],c[2]);
const line=(v,a,b,c,d=c)=>{put(v,a,c);put(v,b,d);};
const tri=(v,a,b,c,color)=>{put(v,a,color);put(v,b,color);put(v,c,color);};
const spherePoint=(r,t,a)=>[r*Math.sin(t)*Math.cos(a),r*Math.cos(t),r*Math.sin(t)*Math.sin(a)];
const rgb=(a,b,t)=>a.map((x,i)=>x+(b[i]-x)*t);
const TEAL=[.08,.96,.87],CYAN=[.12,.72,1],BLUE=[.12,.28,.65],FUCHSIA=[.88,.25,.93];
const g=(n)=>Number(n.toFixed(7));

export function makeEnergyBallVisual(){
 const shell=[],filaments=[],orbits=[],trails=[];
 const bands=18,segments=36;
 for(let i=0;i<bands;i++){
  const t0=PI*i/bands,t1=PI*(i+1)/bands;
  for(let j=0;j<segments;j++){
   const a0=TAU*j/segments,a1=TAU*(j+1)/segments;
   const pulse=.5+.5*Math.sin((i*13+j*7)*1.49);
   const color=rgb(BLUE,TEAL,.27+.60*pulse);
   if((i+j)%7===0)for(let n=0;n<3;n++)color[n]=Math.min(1,color[n]+.12);
   const p00=spherePoint(CORE_RADIUS,t0,a0),p10=spherePoint(CORE_RADIUS,t1,a0);
   const p11=spherePoint(CORE_RADIUS,t1,a1),p01=spherePoint(CORE_RADIUS,t0,a1);
   tri(shell,p00,p10,p11,color);tri(shell,p00,p11,p01,color);
  }
 }
 // Meridians and broken latitude circuits are drawn OUTSIDE the opaque shell
 // but still within 1cm of the canonical .65m physical ball radius.
 for(let k=0;k<12;k++){
  for(let i=1;i<27;i++){
   const t0=PI*i/28,t1=PI*(i+1)/28;
   const wiggle=t=>TAU*k/12 + .064*Math.sin(7*t+3*k);
   line(filaments,spherePoint(FILAMENT_RADIUS,t0,wiggle(t0)),spherePoint(FILAMENT_RADIUS,t1,wiggle(t1)),
    k%3===0?FUCHSIA:CYAN);
  }
 }
 for(let tIdx=2;tIdx<10;tIdx++){
  const polar=PI*tIdx/11;
  for(let k=0;k<36;k++){
   if((k+tIdx)%5===0)continue;
   const a=TAU*k/36,b=TAU*(k+1)/36;
   line(filaments,spherePoint(FILAMENT_RADIUS,polar,a),spherePoint(FILAMENT_RADIUS,polar,b),
    (k+tIdx)%9===0?TEAL:BLUE);
  }
 }
 // Two sparse mag-lev orbit rings: static GPU only; rotation is from simulation
 // time in the host's existing draw() transform, never from wall-clock time.
 for(let ring=0;ring<2;ring++){
  for(let i=0;i<64;i++){
   if((i+ring*2)%14===0)continue;
   const a=TAU*i/64,b=TAU*(i+1)/64,r=ORBIT_RADIUS;
   // Both tilted ring planes use orthogonal unit basis vectors so their
   // swept radius never exceeds the declared GPU-only visual envelope.
   const point=t=>ring===0?
    [r*Math.cos(t)*Math.cos(.23),r*Math.cos(t)*Math.sin(.23),r*Math.sin(t)]:
    [r*.77*Math.cos(t),r*Math.sin(t),r*Math.sqrt(1-.77*.77)*Math.cos(t)];
   line(orbits,point(a),point(b),ring?FUCHSIA:TEAL);
  }
 }
 // 20 static streak rays behind forward motion. Each segment fades by vertex
 // RGB and never exceeds MAX_TRAIL_METERS after run-speed scaling. No loops
 // allocating new buffers inside the 3D render path.
 for(let i=0;i<20;i++){
  const a=TAU*i/20,rx=.25+.22*Math.cos(a),ry=.22*Math.sin(a);
  const back=2.8+(i%5)*.30;
  for(let j=0;j<4;j++){
   const q=j/4,q2=(j+1)/4;
   const point=u=>[rx+u*.18*Math.cos(a+PI/5),ry+u*.24*Math.sin(a),-.55-back*u];
   const from=j===0?TEAL:rgb(CYAN,[.018,.055,.16],q);
   const to=rgb(CYAN,[.018,.055,.16],q2);
   line(trails,point(q),point(q2),from,to);
  }
 }
 const arrays={shell,filaments,orbits,trails};
 for(const [kind,vertices] of Object.entries(arrays)){
  if(vertices.length%6)throw Error('Energy mesh has malformed '+kind+' RGB vertices');
  if(!vertices.every(Number.isFinite))throw Error('Energy mesh has nonfinite '+kind+' coordinates');
 }
 const totalVertices=Object.values(arrays).reduce((s,v)=>s+v.length/6,0);
 if(totalVertices>ENERGY_VERTEX_BUDGET)throw Error('Energy GPU budget exceeded');
 return {shell,filaments,orbits,trails,totalVertices};
}
export function energyBallFrame(physicsTime,velocity,forward,renderScale=1){
 if(!Number.isFinite(physicsTime)||physicsTime<0||!Array.isArray(velocity)||!Array.isArray(forward)||
    !velocity.every(Number.isFinite)||!forward.every(Number.isFinite))throw Error('Invalid energy frame');
 const speed=Math.hypot(...velocity),horizontal=Math.hypot(velocity[0],velocity[2]);
 const direction=horizontal>2?velocity:forward;
 const yaw=Math.atan2(direction[0],direction[2]);
 const intense=clamp((speed-28)/110,0,1);
 return {
  spin:((physicsTime*.65+speed*.0015)%TAU),
  orbitAngle:(physicsTime*.9)%TAU,
  directionYaw:yaw,
  speed,
  trailActive:speed>=31&&renderScale>.65,
  trailScale:clamp(1+.85*intense,1,2.0),
  orbitActive:renderScale>.65,
  qualityScale:renderScale,
  // Conservative worst-case bound of the geometry's -4.45m baseline span.
  trailMaxMeters:g(Math.min(MAX_TRAIL_METERS,(.55+4.0)*clamp(1+.85*intense,1,2)))
 };
}

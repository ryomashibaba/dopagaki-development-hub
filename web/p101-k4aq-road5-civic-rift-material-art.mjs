/**
 * K4AQ / ROAD5 CIVIC RIFT — ONE isolated visual-art candidate.
 * 3D geometry is anchored to the genuine existing Road5 B48 surface,
 * but no road, physics, moving obstacle, camera or collider is changed.
 *
 * This is NOT an approved ART release and is not an authored Blender scene.
 * The separate material shader is purpose-built for this research variant.
 */
export const K4AQ_CONTRACT=Object.freeze({
  schema:'dopagaki.k4aq-road5-visual-only/1',
  sourceBlob:'af076d67492a677d2235e4730aef8cdf4808e106',
  road:'p93-PRISM_CREST-01',
  original240Hz:true,roads:7,movers:28,sourceCameraUnchanged:true,
  officialARTAccepted:0,slope2DNAMetres:0,
  ART:'NOT_TESTED_HOLD',HUMAN:'HOLD',SAT:'HOLD',CCD:'HOLD',
  FPS:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'
});
const PAL=[
  {name:'carbon-ceramic',color:[.115,.178,.207],metal:.45,rough:.76,emit:0},
  {name:'porcelain-limestone',color:[.71,.75,.71],metal:.08,rough:.84,emit:0},
  {name:'oxidised-titanium',color:[.275,.403,.424],metal:.78,rough:.47,emit:0},
  {name:'smoked-blue-glass',color:[.13,.31,.37],metal:.32,rough:.22,emit:.05},
  {name:'aged-bronze',color:[.74,.48,.25],metal:.77,rough:.39,emit:0},
  {name:'warm-interior-light',color:[.92,.63,.34],metal:.03,rough:.52,emit:.58},
  {name:'cool-wayfinding-light',color:[.34,.75,.75],metal:.18,rough:.35,emit:.33},
  {name:'deep-recess',color:[.045,.082,.111],metal:.2,rough:.9,emit:0},
];
export const K4AQ_MATERIALS=Object.freeze(PAL.map(x=>Object.freeze({...x,color:Object.freeze([...x.color])})));
const add=(a,b)=>a.map((x,i)=>x+b[i]);
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const mul=(a,t)=>a.map(x=>x*t);
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=v=>mul(v,1/(Math.hypot(...v)||1));
function pushTriangle(out,a,b,c,m){
 const n=norm(cross(sub(b,a),sub(c,a)));
 for(const p of [a,b,c])out.push(...p,...n,m);
}
function face(out,a,b,c,d,m){
 pushTriangle(out,a,b,c,m);pushTriangle(out,a,c,d,m);
}
function prism(out,P,x0,x1,d0,d1,y0,y1,material=2,cap=1){
 if(!(x1>x0&&d1>d0&&y1>y0))throw Error('K4AQ invalid occupied solid');
 const t=Math.min(3.2,(x1-x0)*.16,(d1-d0)*.16);
 const ring=(h)=>[
  [x0+t,d0,h],[x1-t,d0,h],[x1,d0+t,h],[x1,d1-t,h],
  [x1-t,d1,h],[x0+t,d1,h],[x0,d1-t,h],[x0,d0+t,h]
 ].map(x=>P(...x));
 const a=ring(y0),b=ring(y1);
 for(let i=0;i<8;i++)face(out,a[i],a[(i+1)%8],b[(i+1)%8],b[i],
   i===0?material:i===2?0:i===4?material:i===6?2:material);
 for(let i=1;i<7;i++){pushTriangle(out,b[0],b[i],b[i+1],cap);
  pushTriangle(out,a[0],a[i+1],a[i],7);}
}
function floor(out,P,x0,x1,d0,d1,h,mat=2){
 prism(out,P,x0,x1,d0,d1,h,h+2.5,mat,mat);
}
function lineSolid(out,P,x0,x1,d0,d1,y0,y1,mat){
 prism(out,P,x0,x1,d0,d1,y0,y1,mat,mat);
}
function roadFrame(surface,sample,u,side){
 const a=sample(surface,u-.003,.5),b=sample(surface,u+.003,.5);
 const mid=sample(surface,u,.5),edge=sample(surface,u,side<0?0:1);
 const along=norm([b[0]-a[0],0,b[2]-a[2]]);
 const edgeVec=sub([edge[0]-mid[0],0,edge[2]-mid[2]],mul(along,dot(sub(edge,mid),along)));
 if(!edge.every(Number.isFinite)||Math.hypot(...edgeVec)<2)
  throw Error('K4AQ Road5 physical edge frame missing');
 return {edge,along,outward:norm(edgeVec)};
}
function point(f,x,d,h){
 return add(add(add(f.edge,mul(f.along,x)),mul(f.outward,d)),[0,h,0]);
}
function inhabitedWing(out,P,x0,x1,d0,d1,height,seed){
 // Heavy, gently stepped volume with two truly empty courtyards.
 const levels=seed%2===0?4:5;
 for(let level=0;level<levels;level++){
  const yh=level*height/levels+4,yy=(level+1)*height/levels+4;
  const inset=level*1.8;
  const left=x0+inset+(level%2===0?0:2.5),right=x1-inset;
  const rear=d1+level*2.3;
  floor(out,P,left,right,d0+level*1.4,rear,yh,level%2?2:0);
  floor(out,P,left,right,d0+level*1.4,rear,yy-2.5,level%2?1:2);
  const gaps=6;
  for(let i=0;i<gaps;i++){
   const xa=left+(right-left)*i/gaps,xb=left+(right-left)*(i+1)/gaps;
   // Real open air frontage: paired pier and lintel / recessed glazing.
   if(i===1||i===3||i===4){
    lineSolid(out,P,xa+.5,xa+2,d0+level*1.4,d0+level*1.4+3,yh+2,yy-2,1);
    lineSolid(out,P,xb-2,xb-.5,d0+level*1.4,d0+level*1.4+3,yh+2,yy-2,1);
    lineSolid(out,P,xa+2,xb-2,d0+level*1.4+8,d0+level*1.4+8.9,yh+3,yy-5,3);
    lineSolid(out,P,xa+2,xb-2,d0+level*1.4+7.6,d0+level*1.4+8.4,yh+3,yy-4,seed%3===0?5:7);
   }else{
    lineSolid(out,P,xa+.3,xb-.3,d0+level*1.4,d0+level*1.4+3,yh+1,yy-1,seed%3?0:2);
   }
  }
  // Offset public balcony reveals habitation without canopy spam.
  if(level===1||level===3){
   floor(out,P,left+6,right-5,d0-5+level*1.4,d0+4+level*1.4,yy-2.5,1);
   lineSolid(out,P,left+7,right-6,d0-5,d0-3.4,yy,yy+1.3,4);
  }
  // Narrow deep shadow at the end, not a gigantic solid side facade.
  lineSolid(out,P,right-2,right,d0+8,rear-2,yh,yy-1.3,7);
  lineSolid(out,P,left,left+2,d0+8,rear-2,yh,yy-1.3,2);
 }
 // Massive external service cores give the building an occupied silhouette.
 prism(out,P,x0-10,x0+3,d0+12,d0+30,3,height*.68+5,0,2);
 prism(out,P,x1-3,x1+8,d0+21,d0+41,3,height*.86+5,2,1);
}
function makeDistrict(out,frame,kind){
 const P=(x,d,h)=>point(frame,x,d,h);
 const hero=kind===1;
 // The central air remains open; two inward-facing inhabited banks.
 inhabitedWing(out,P,hero?-145:-119,hero?-42:-33,hero?75:67,hero?156:139,hero?119:90,kind+4);
 inhabitedWing(out,P,hero?47:35,hero?135:119,hero?110:96,hero?187:165,hero?98:77,kind+7);
 // Two lower arrival courts: enclosed ground is real visual geometry,
 // but physical access / support are NOT approved.
 floor(out,P,-27,27,70,121,4,2);
 floor(out,P,-24,24,112,158,7,0);
 floor(out,P,-16,16,149,189,10,1);
 // Perforated small pavilion with actual side mass and atmospheric atrium.
 for(const x of [-23,19])prism(out,P,x,x+4,77,110,6,29,1,1);
 for(const x of [-23,19])prism(out,P,x,x+4,151,184,10,25,2,2);
 floor(out,P,-24,23,75,111,27,4);
 // Courtyard light columns and bronze insets, never a full-screen neon band.
 for(let j=0;j<4;j++){
  const d=91+j*22;
  prism(out,P,-12,-10,d,d+1.8,7,9.7,4,5);
  prism(out,P,10,12,d,d+1.8,7,9.7,4,5);
 }
 // Inhabited floating-eye gallery is an elevated, deep volume, not a thin roof.
 prism(out,P,-12,13,160,190,48,67,0,1);
 lineSolid(out,P,-10,11,158,160,55,60,3);
 lineSolid(out,P,-8,9,157,158.5,56,59,5);
 // An intentionally legible open sky interval occupies the center above 67m.
 return {name:hero?'CIVIC_RIFT_HERO':'PUBLIC_CONCOURSE',openSkyAbove:67,
  buildings:2,terraces:3,notAnActualPlayableFloor:true};
}
function distantCity(out,frame){
 const P=(x,d,h)=>point(frame,x,d,h);
 const count=11;
 for(let i=0;i<count;i++){
  const x=(i-5)*56+(i%3)*11,depth=245+(i%4)*43;
  const h=42+(i*31)%126;
  const width=21+(i%3)*8;
  prism(out,P,x,x+width,depth,depth+23,0,h,0,2);
  prism(out,P,x+3,x+width-3,depth+3,depth+20,h,h+4,1,2);
  for(let j=1;j<Math.floor(h/15);j++){
   lineSolid(out,P,x+4,x+width-4,depth-1,depth-.2,j*15,j*15+1.4,i%4===1?5:3);
  }
 }
 return count;
}
export function buildK4AQRoad5Art(doc,sample,{enabled=false}={}){
 if(!enabled)return {active:false,vertices:[],ART:'HOLD',newColliders:0};
 if(typeof sample!=='function'||doc?.surfaces?.length!==7||
  doc?.movingObstacles?.length!==28||
  doc?.stageForge?.productionPromoted!==false||
  doc.surfaces[5]?.id!=='p93-PRISM_CREST-01')
  throw Error('K4AQ FROZEN ROAD5/B48/B51 SOURCE GUARD');
 const frozen=JSON.stringify(doc),road=doc.surfaces[5],v=[],districts=[];
 for(const [i,u] of [.36,.57,.78,.92].entries()){
  const side=i%2===0?-1:1,frame=roadFrame(road,sample,u,side);
  const begin=v.length/7;
  districts.push({station:u,side,...makeDistrict(v,frame,i===2?1:0),
   triangles:(v.length/7-begin)/3});
 }
 const farFrame=roadFrame(road,sample,.90,1);
 const skylineCount=distantCity(v,farFrame);
 const count=v.length/7/3;
 if(!Number.isInteger(count)||count<1000||count>40000||
   v.some(x=>!Number.isFinite(x))||JSON.stringify(doc)!==frozen)
  throw Error('K4AQ INVALID TRIANGULATION OR PHYSICS MUTATION');
 return {active:true,vertices:v,triangles:count,districts,skylineCount,
  sourceRoad:road.id,palette:PAL.map(p=>p.name),
  signedPhysicalClearance:'NOT_TESTED',cameraAB:'NOT_CAPTURED',
  originalSourceBlob:K4AQ_CONTRACT.sourceBlob,ART:'NOT_TESTED_HOLD',
  newRoads:0,newColliders:0,newMovingHazards:0,changedPhysics:false,
  officialARTAccepted:0,slope2DNAMetres:0};
}

const VERT=[
 '#version 300 es','precision highp float;',
 'layout(location=4) in vec3 p; layout(location=5) in vec3 n; layout(location=6) in float material;',
 'uniform vec3 eye,camRight,camUp,camFront;',
 'uniform float aspect;',
 'out vec3 normal; out vec3 rel; flat out int materialId;',
 'void main(){vec3 w=p-eye;float z=dot(w,camFront);',
 'gl_Position=vec4(1.35*dot(w,camRight)/aspect,1.35*dot(w,camUp),1.00022*z-1.30014,z);',
 'normal=n;rel=w;materialId=int(material+0.5);}'
].join('\n');
const FRAG=[
 '#version 300 es','precision highp float;',
 'in vec3 normal; in vec3 rel; flat in int materialId;',
 'uniform vec3 albedo[8];uniform vec3 surface[8];uniform float fogStrength;',
 'out vec4 outColor;',
 'void main(){int i=clamp(materialId,0,7);',
 'vec3 n=normalize(normal);if(!gl_FrontFacing)n=-n;',
 'vec3 L=normalize(vec3(-0.47,0.83,0.30));vec3 B=normalize(vec3(0.55,0.2,-0.64));',
 'vec3 V=normalize(-rel),H=normalize(L+V);',
 'float light=0.27+0.63*max(dot(n,L),0.0)+0.20*max(dot(n,B),0.0)+0.22*max(n.y,0.0);',
 'float metal=surface[i].x,rough=surface[i].y,emit=surface[i].z;',
 'float spec=pow(max(dot(n,H),0.0),mix(85.0,7.0,rough));',
 'vec3 col=albedo[i]*light+(mix(vec3(0.07),albedo[i],metal))*spec*(.3+metal)+albedo[i]*emit*1.25;',
 'float distant=clamp((length(rel)-540.0)/1650.0,0.0,.68)*fogStrength;',
 'col=mix(col,vec3(.027,.056,.073),distant);',
 'col=col/(col+vec3(.18));col=pow(col,vec3(0.95));',
 'outColor=vec4(clamp(col,0.0,1.0),1.0);}'
].join('\n');

/** Research-only atmospheric sky replaces original black void, never geometry. */
const SKYVERT=[
 '#version 300 es','precision highp float;',
 'out vec2 uv;',
 'void main(){',
 'vec2 p=vec2(float((gl_VertexID << 1)&2),float(gl_VertexID&2));',
 'uv=p;gl_Position=vec4(p*2.0-1.0,1.0,1.0);}'
].join('\n');
const SKYFRAG=[
 '#version 300 es','precision highp float;',
 'in vec2 uv;out vec4 outColor;',
 'void main(){',
 'vec2 p=uv;',
 'vec3 upper=vec3(.016,.044,.079);',
 'vec3 horizon=vec3(.097,.168,.192);',
 'float height=smoothstep(.12,1.05,p.y);',
 'vec3 c=mix(horizon,upper,height);',
 'float haze=exp(-pow((p.y-.31)*9.0,2.0));',
 'c+=vec3(.028,.043,.048)*haze;',
 'float faintGlow=exp(-length((p-vec2(.73,.36))*vec2(2.6,4.4))*4.2);',
 'c+=vec3(.092,.055,.034)*faintGlow;',
 'outColor=vec4(c,1.0);}'
].join('\n');

function compile(gl,type,text){
 const x=gl.createShader(type);gl.shaderSource(x,text);gl.compileShader(x);
 if(!gl.getShaderParameter(x,gl.COMPILE_STATUS)){const e=gl.getShaderInfoLog(x);gl.deleteShader(x);throw Error('K4AQ shader: '+e);}
 return x;
}
export function createK4AQScene(gl,art){
 if(!art?.active)return null;
 const vs=compile(gl,gl.VERTEX_SHADER,VERT),fs=compile(gl,gl.FRAGMENT_SHADER,FRAG);
 const program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);
 gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('K4AQ link: '+gl.getProgramInfoLog(program));
 const sv=compile(gl,gl.VERTEX_SHADER,SKYVERT),sf=compile(gl,gl.FRAGMENT_SHADER,SKYFRAG);
 const skyProgram=gl.createProgram();gl.attachShader(skyProgram,sv);gl.attachShader(skyProgram,sf);
 gl.linkProgram(skyProgram);gl.deleteShader(sv);gl.deleteShader(sf);
 if(!gl.getProgramParameter(skyProgram,gl.LINK_STATUS))throw Error('K4AQ sky link: '+gl.getProgramInfoLog(skyProgram));
 const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
 gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(art.vertices),gl.STATIC_DRAW);
 const uni={};
 for(const n of ['eye','camRight','camUp','camFront','aspect','albedo[0]','surface[0]','fogStrength'])
  uni[n]=gl.getUniformLocation(program,n);
 return {...art,buffer,count:art.vertices.length/7,program,skyProgram,uni};
}
export function renderK4AQScene(gl,scene,view,aspect,{fogStrength=1}={}){
 if(!scene)return;
 const prev=gl.getParameter(gl.CURRENT_PROGRAM);
 // Atmospheric sky only in opted-in K4AQ; painted before original live B51.
 const depth=gl.isEnabled(gl.DEPTH_TEST),mask=gl.getParameter(gl.DEPTH_WRITEMASK);
 gl.depthMask(false);gl.disable(gl.DEPTH_TEST);gl.useProgram(scene.skyProgram);
 gl.drawArrays(gl.TRIANGLES,0,3);
 gl.depthMask(mask);if(depth)gl.enable(gl.DEPTH_TEST);
 gl.useProgram(scene.program);
 const u=scene.uni;
 for(const [n,val] of [['eye',view.eye],['camRight',view.right],['camUp',view.up],['camFront',view.front]])
  gl.uniform3fv(u[n],val);
 gl.uniform1f(u.aspect,aspect);gl.uniform1f(u.fogStrength,fogStrength);
 gl.uniform3fv(u['albedo[0]'],new Float32Array(PAL.flatMap(x=>x.color)));
 gl.uniform3fv(u['surface[0]'],new Float32Array(PAL.flatMap(x=>[x.metal,x.rough,x.emit])));
 gl.bindBuffer(gl.ARRAY_BUFFER,scene.buffer);
 for(const i of [4,5,6])gl.enableVertexAttribArray(i);
 gl.vertexAttribPointer(4,3,gl.FLOAT,false,28,0);
 gl.vertexAttribPointer(5,3,gl.FLOAT,false,28,12);
 gl.vertexAttribPointer(6,1,gl.FLOAT,false,28,24);
 gl.drawArrays(gl.TRIANGLES,0,scene.count);
 for(const i of [4,5,6])gl.disableVertexAttribArray(i);
 gl.useProgram(prev);
}
export function releaseK4AQScene(gl,scene){
 if(scene?.buffer)gl.deleteBuffer(scene.buffer);
 if(scene?.program)gl.deleteProgram(scene.program);
 if(scene?.skyProgram)gl.deleteProgram(scene.skyProgram);
}

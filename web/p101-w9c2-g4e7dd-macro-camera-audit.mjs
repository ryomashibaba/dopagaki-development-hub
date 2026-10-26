/**
 * G4E-7DD: read-only, low resolution CPU triangle depth raster for the
 * ORIGINAL BG240Hz 15/17-second scripted camera (NOT a GPU picking buffer).
 * No physics, render buffers, meshes, scoring or player controls are altered.
 */
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const unit=a=>{const n=Math.hypot(...a);if(n<1e-9)throw Error('DD degenerate camera');return a.map(x=>x/n);};
const rd=x=>Number(x.toFixed(5));

export function g4e7ddAuditMacroView(art,shot,{width=48,height=30}={}){
 if(!art?.active||!Array.isArray(art.vertices)||!Array.isArray(art.sources)||
    art.vertices.length%18||!Number.isInteger(width)||!Number.isInteger(height)||
    width<20||height<16||width>128||height>80)
  throw Error('DD needs existing authored scenery and finite grid');
 if(!['t1500','t1700'].includes(shot?.id)||
   shot.source!=='ACTUAL_240HZ_START00_P96_FIXED_SCRIPT_NOT_HUMAN'||
   [shot.eye,shot.front].some(x=>!Array.isArray(x)||x.length!==3||x.some(v=>!Number.isFinite(v))))
  throw Error('DD needs genuine unchanged scripted BG240Hz camera');
 const front=unit(shot.front),right=unit(cross(front,[0,1,0])),
  up=unit(cross(right,front)),length=width*height;
 const depth=new Float64Array(length);depth.fill(Infinity);
 const owners=new Int32Array(length);owners.fill(-1);
 const triangles=new Int32Array(length);triangles.fill(-1);
 const sources=art.sources,sourceByTriangle=[];
 let next=0;
 for(let i=0;i<sources.length;i++){
  const s=sources[i];
  if(s.firstTriangle!==next||!Number.isInteger(s.triangleCount)||s.triangleCount<=0)
   throw Error('DD provenance discontinuity');
  for(let k=0;k<s.triangleCount;k++)sourceByTriangle.push(i);
  next+=s.triangleCount;
 }
 if(next!==art.vertices.length/18)throw Error('DD invalid mesh ownership');
 let unknownNear=0,clippedAtScreen=0,candidateTriangles=0;
 let fullyBehind=0,nearCrossing=0,nearTouching=0;
 const project=p=>{
  const delta=sub(p,shot.eye),z=dot(delta,front);
  if(z<=1.4)return null;
  return {x:1.35*dot(delta,right)/(z*(1360/860)),
   y:1.35*dot(delta,up)/z,z};
 };
 const v=art.vertices;
 for(let ti=0;ti<next;ti++){
  const depths=[];
  for(let vi=0;vi<3;vi++){
   const k=ti*18+vi*6;
   depths.push(dot(sub(v.slice(k,k+3),shot.eye),front));
  }
  if(depths.every(z=>z<=0)){fullyBehind++;unknownNear++;continue;}
  if(depths.some(z=>z<=1.4)){
   if(depths.some(z=>z>1.4))nearCrossing++;else nearTouching++;
   unknownNear++;continue;
  }
  const p=[];
  for(let i=0;i<3;i++){
   const k=ti*18+i*6,a=project(v.slice(k,k+3));
   if(!a){p.length=0;break;}p.push(a);
  }
  if(p.length<3){unknownNear++;continue;}
  const xmin=Math.min(...p.map(q=>q.x)),xmax=Math.max(...p.map(q=>q.x)),
   ymin=Math.min(...p.map(q=>q.y)),ymax=Math.max(...p.map(q=>q.y));
  if(xmax< -1||xmin>1||ymax< -1||ymin>1)continue;
  candidateTriangles++;
  if(xmin< -1||xmax>1||ymin< -1||ymax>1)clippedAtScreen++;
  const x0=Math.max(0,Math.floor((xmin+1)*width/2)),
   x1=Math.min(width-1,Math.ceil((xmax+1)*width/2)),
   y0=Math.max(0,Math.floor((1-ymax)*height/2)),
   y1=Math.min(height-1,Math.ceil((1-ymin)*height/2));
  if(x0>x1||y0>y1)continue;
  const [a,b,c]=p;
  const area=(b.y-c.y)*(a.x-c.x)+(c.x-b.x)*(a.y-c.y);
  if(Math.abs(area)<1e-12)continue;
  for(let y=y0;y<=y1;y++){
   const yy=1-2*(y+.5)/height;
   for(let x=x0;x<=x1;x++){
    const xx=2*(x+.5)/width;
    const nx=xx-1;
    const A=((b.y-c.y)*(nx-c.x)+(c.x-b.x)*(yy-c.y))/area,
     B=((c.y-a.y)*(nx-c.x)+(a.x-c.x)*(yy-c.y))/area,C=1-A-B;
    if(Math.min(A,B,C)<-1e-8)continue;
    const z=1/(A/a.z+B/b.z+C/c.z),index=y*width+x;
    if(z<depth[index]){
     depth[index]=z;owners[index]=sourceByTriangle[ti];triangles[index]=ti;
    }
   }
  }
 }
 let occupied=0,near=0,mid=0,far=0,central=0,centerTotal=0,sky=0,skyTotal=0;
 const summaries=new Map(),bands=[];
 for(let y=0;y<height;y++){
  for(let x=0;x<width;x++){
   const i=y*width+x,sid=owners[i],fx=(x+.5)/width,fy=(y+.5)/height;
   if(fx>.38&&fx<.66&&fy>.44&&fy<.89){centerTotal++;if(sid>=0)central++;}
   if(fy<.42){skyTotal++;if(sid>=0)sky++;}
   if(sid<0)continue;
   occupied++;if(depth[i]<125)near++;else if(depth[i]<400)mid++;else far++;
   const k=summaries.get(sid)||{id:sid,kind:sources[sid].kind,pixels:0,
     minX:x,maxX:x,minY:y,maxY:y};
   k.pixels++;k.minX=Math.min(k.minX,x);k.maxX=Math.max(k.maxX,x);
   k.minY=Math.min(k.minY,y);k.maxY=Math.max(k.maxY,y);
   summaries.set(sid,k);
  }
  // Separate a single giant planar triangle from several connected facades.
  for(const mode of ['triangle','source','kind','any']){
   let x=0;
   while(x<width){
    const i=y*width+x;
    const k=mode==='triangle'?triangles[i]:mode==='source'?owners[i]:
      mode==='kind'?(owners[i]<0?-1:sources[owners[i]].kind):
      owners[i]<0?-1:0;
    if(k<0){x++;continue;}
    let stop=x+1;
    while(stop<width&&(mode==='triangle'?triangles[y*width+stop]:
     mode==='source'?owners[y*width+stop]:
     mode==='kind'?(owners[y*width+stop]<0?-1:sources[owners[y*width+stop]].kind):
     owners[y*width+stop]<0?-1:0)===k)stop++;
    if((stop-x)/width>=.30){
     const sourceId=owners[i];
     bands.push({mode,source:mode==='kind'?k:sources[sourceId].kind,row:y,
       spanFraction:rd((stop-x)/width),fromX:x,toX:stop-1,
       depthM:rd(depth[i])});
    }
    x=stop;
   }
  }
 }
 bands.sort((a,b)=>b.spanFraction-a.spanFraction);
 const tops=[...summaries.values()].sort((a,b)=>b.pixels-a.pixels).slice(0,8)
  .map(x=>({...x,shareOfScreen:rd(x.pixels/length)}));
 // A hero site stays a hero when its authored morphology changes.
 // Kind-name matching mislabelled DA and DB as invisible.
 const heroCount=[...summaries.values()].filter(x=>
   Number.isInteger(sources[x.id].slot)).length;
 return {schema:'G4E7DD_CPU_AUTHORED_SCREEN_COMPOSITION_NOT_GPU_OR_ART',
   shot:shot.id,native240Hz:true,grid:[width,height],totalTriangles:next,
   candidateTriangles,unknownNearTriangles:unknownNear,
   nearPlaneClassification:{fullyBehind,nearCrossing,nearTouching},
   edgeCrossingTriangles:clippedAtScreen,
   occupiedCells:occupied,occupancy:rd(occupied/length),depthCells:{near,mid,far},
   center:{occupied:central,total:centerTotal},
   upperSky:{occupied:sky,total:skyTotal},
   heroSourcesVisible:heroCount,
   heroDefinition:'IMMUTABLE_SITE_SLOT_NOT_KIND_NAME',topSources:tops,
   sourceScreenBoxes:[...summaries.values()].map(s=>({
     kind:s.kind,sourceId:s.id,screenPixels:s.pixels,
     screenFraction:rd(s.pixels/length),
     widthFraction:rd((s.maxX-s.minX+1)/width),
     heightFraction:rd((s.maxY-s.minY+1)/height),
     leftEdge:s.minX===0,rightEdge:s.maxX===width-1,topEdge:s.minY===0,bottomEdge:s.maxY===height-1
   })).sort((a,b)=>b.screenPixels-a.screenPixels),
   horizontalBands:bands.slice(0,12),
   warningSignals:{wideTriangle:bands.some(x=>x.mode==='triangle'&&x.spanFraction>=.45),
     wideSource:bands.some(x=>x.mode==='source'&&x.spanFraction>=.50),
     wideKind:bands.some(x=>x.mode==='kind'&&x.spanFraction>=.50),
     wideComposite:bands.some(x=>x.mode==='any'&&x.spanFraction>=.65),
     clippedWideMass:[...summaries.values()].some(s=>
       (s.minX===0||s.maxX===width-1||s.minY===0)&&
       (s.maxX-s.minX+1)/width>=.4),
     heroNotVisible:heroCount===0,nearClipUnmeasured:nearCrossing>0,
     fullyBehindDiscarded:fullyBehind>0},
   art:'HOLD',human:'HOLD',officialSlope2Meters:0};
}

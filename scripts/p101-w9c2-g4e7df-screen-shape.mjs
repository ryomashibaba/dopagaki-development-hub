/**
 * G4E-7DF: descriptive silhouette measurements, not a numerical ART judge.
 * Input is the optional DD depth-rastered source ownership, not WebGL pixels.
 * Never alters authored vertices, physics, renderer or original camera.
 */
const round=n=>Number(n.toFixed(5));
const valid=(x,n)=>Number.isInteger(x)&&x>=0&&x<n;
export function dfDescribeHeroMasks(audit){
 const ownership=audit?.privateOwnership;
 if(!ownership)throw Error('DF requires explicit private ownership opt-in');
 const [width,height]=ownership.grid,ids=ownership.sourceIndexByCell;
 const sources=ownership.sourceMetadata;
 if(!valid(width,129)||width<4||!valid(height,81)||height<4||
    ids.length!==width*height||!Array.isArray(sources)||
    ids.some(i=>!Number.isInteger(i)||i< -1||i>=sources.length))
  throw Error('DF invalid ownership grid');
 const slots=[...new Set(sources.map(s=>s.slot).filter(Number.isInteger))].sort((a,b)=>a-b);
 const masks=[];
 for(const slot of slots){
  const mask=Uint8Array.from(ids,(id)=>Number(id>=0&&sources[id].slot===slot));
  const occupied=mask.reduce((n,v)=>n+v,0);
  if(!occupied)continue;
  let x0=width,y0=height,x1=-1,y1=-1,perimeter=0,rowsWithMultipleRuns=0;
  for(let y=0;y<height;y++){
   let rowRuns=0,on=false;
   for(let x=0;x<width;x++){
    const i=y*width+x;
    if(mask[i]){
     x0=Math.min(x0,x);x1=Math.max(x1,x);
     y0=Math.min(y0,y);y1=Math.max(y1,y);
     if(!on)rowRuns++;
     on=true;
     if(x===0||!mask[i-1])perimeter++;
     if(x===width-1||!mask[i+1])perimeter++;
     if(y===0||!mask[i-width])perimeter++;
     if(y===height-1||!mask[i+width])perimeter++;
    }else on=false;
   }
   if(rowRuns>1)rowsWithMultipleRuns++;
  }
  const neighbours=i=>{
   const x=i%width,y=Math.floor(i/width),out=[];
   if(x>0)out.push(i-1);if(x<width-1)out.push(i+1);
   if(y>0)out.push(i-width);if(y<height-1)out.push(i+width);
   return out;
  };
  const seen=new Uint8Array(ids.length),sizes=[];
  for(let i=0;i<mask.length;i++){
   if(!mask[i]||seen[i])continue;
   let size=0,queue=[i];seen[i]=1;
   for(let h=0;h<queue.length;h++){
    const at=queue[h];size++;
    for(const j of neighbours(at))if(mask[j]&&!seen[j]){seen[j]=1;queue.push(j);}
   }
   sizes.push(size);
  }
  // Count only fully enclosed raster voids. Open atria touching the box
  // boundary are NOT closed holes, and low-res occlusion can be misleading.
  const emptySeen=new Uint8Array(ids.length),q=[];
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
   if(x!==x0&&x!==x1&&y!==y0&&y!==y1)continue;
   const i=y*width+x;
   if(!mask[i]&&!emptySeen[i]){emptySeen[i]=1;q.push(i);}
  }
  for(let h=0;h<q.length;h++)for(const j of neighbours(q[h])){
   const x=j%width,y=Math.floor(j/width);
   if(x>=x0&&x<=x1&&y>=y0&&y<=y1&&!mask[j]&&!emptySeen[j]){
    emptySeen[j]=1;q.push(j);
   }
  }
  let enclosedVoid=0,spanGap=0;
  for(let y=y0;y<=y1;y++){
   let first=-1,last=-1;
   for(let x=x0;x<=x1;x++){
    const i=y*width+x;
    if(!mask[i]&&!emptySeen[i])enclosedVoid++;
    if(mask[i]){if(first<0)first=x;last=x;}
   }
   if(first>=0)for(let x=first;x<=last;x++)if(!mask[y*width+x])spanGap++;
  }
  const bw=x1-x0+1,bh=y1-y0+1,boxArea=bw*bh;
  masks.push({slot,occupiedCells:occupied,screenFraction:round(occupied/ids.length),
   bounds:[x0,y0,x1,y1],boxWidthFraction:round(bw/width),
   boxHeightFraction:round(bh/height),boxFillFraction:round(occupied/boxArea),
   aspectRatio:round(bw/bh),perimeterToArea:round(perimeter/occupied),
   componentCount:sizes.length,largestComponentFraction:round(Math.max(...sizes)/occupied),
   multipleRunRows:rowsWithMultipleRuns,spanGapCells:spanGap,
   enclosedVoidCells:enclosedVoid,
   touchesViewport:[x0===0,y0===0,x1===width-1,y1===height-1],
   interpretation:'CPU raster only: open space, occlusion and GPU final pixels unverified'});
 }
 return {schema:'G4E7DF_CPU_SITE_SHAPE_DESCRIPTORS_NOT_ART_GATE',
  shot:audit.shot,grid:[width,height],masks,
  unknownNearTriangles:audit.unknownNearTriangles,
  nearCrossing:audit.nearPlaneClassification.nearCrossing,
  intrinsicLimitations:['single low resolution camera','GPU occlusion differs',
   'camera motion changes apparent size','holes touching outer contour are not enclosed']};
}
export function dfCompareCameraMoments(earlier,later){
 const all=[...new Set([...earlier.masks,...later.masks].map(x=>x.slot))].sort((a,b)=>a-b);
 return {from:earlier.shot,to:later.shot,perSlot:all.map(slot=>{
  const a=earlier.masks.find(x=>x.slot===slot),b=later.masks.find(x=>x.slot===slot);
  if(!a||!b)return {slot,visibility:a?'EXITED_CPU_VIEW':'ENTERED_CPU_VIEW',
   cannotConcludeArtQuality:true};
  return {slot,visibility:'PRESENT_BOTH',
   screenFractionDelta:round(b.screenFraction-a.screenFraction),
   fillFractionDelta:round(b.boxFillFraction-a.boxFillFraction),
   aspectRatioDelta:round(b.aspectRatio-a.aspectRatio),
   multipleRunRowsDelta:b.multipleRunRows-a.multipleRunRows,
   enclosedVoidCellsDelta:b.enclosedVoidCells-a.enclosedVoidCells,
   componentCountDelta:b.componentCount-a.componentCount,
   bounds15:a.bounds,bounds17:b.bounds,cannotConcludeArtQuality:true};
 })};
}
export function dfOwnershipSvg(audit,description){
 const {grid:[w,h],sourceIndexByCell:owners,sourceMetadata:sources}=audit.privateOwnership;
 const scale=12,sw=w*scale,sh=h*scale,palette=['#e4a94d','#35b6c9','#ba8af1','#97d1a2','#ee8196'];
 let out='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+sw+' '+(sh+35)+'" width="'+sw+'" height="'+(sh+35)+'">';
 out+='<rect width="100%" height="100%" fill="#0b1422"/>';
 for(let i=0;i<owners.length;i++){
  const sid=owners[i],slot=sid<0?null:sources[sid].slot;
  if(!Number.isInteger(slot))continue;
  const x=i%w,y=Math.floor(i/w);
  out+='<rect x="'+x*scale+'" y="'+y*scale+'" width="'+scale+
   '" height="'+scale+'" fill="'+palette[Math.abs(slot)%palette.length]+'"/>';
 }
 for(const m of description.masks){
  const [x0,y0,x1,y1]=m.bounds;
  out+='<rect x="'+x0*scale+'" y="'+y0*scale+'" width="'+(x1-x0+1)*scale+
   '" height="'+(y1-y0+1)*scale+'" fill="none" stroke="#fff" stroke-width="1"/>';
 }
 out+='<text x="8" y="'+(sh+23)+'" font-size="13" font-family="sans-serif" fill="#fff">CPU authored hero silhouette • '+description.shot+' • NOT WebGL / NOT ART</text></svg>';
 return out;
}

/** Strict 8-bit Chromium RGB/RGBA PNG reader for genuine frame A/B,
 * no third-party dependencies; tested against actual R11 raw screenshots.
 * Pixel delta is leave-one-out VISUAL INFLUENCE, not pixel ownership.
 */
import assert from 'node:assert/strict';
import zlib from 'node:zlib';
export function decodeChromePng(bytes){
 const b=Buffer.from(bytes),sig=Buffer.from([137,80,78,71,13,10,26,10]);
 assert.ok(b.subarray(0,8).equals(sig),'Chromium PNG signature');
 let pos=8,w,h,depth,color,interlace,idat=[];
 while(pos+12<=b.length){
  const len=b.readUInt32BE(pos),type=b.toString('ascii',pos+4,pos+8);pos+=8;
  assert.ok(len>=0&&pos+len+4<=b.length,'PNG truncated chunk');
  const data=b.subarray(pos,pos+len);pos+=len+4;
  if(type==='IHDR'){
   assert.equal(len,13);
   w=data.readUInt32BE(0);h=data.readUInt32BE(4);depth=data[8];color=data[9];
   assert.equal(data[10],0);assert.equal(data[11],0);interlace=data[12];
  }else if(type==='IDAT')idat.push(data);
  else if(type==='IEND')break;
 }
 assert.ok(w>0&&h>0&&w<=8192&&h<=8192,'PNG dimensions');
 assert.equal(depth,8);assert.ok(color===2||color===6,'PNG must be 8-bit RGB/RGBA');
 assert.equal(interlace,0,'PNG interlace not supported');
 const ch=color===2?3:4,stride=w*ch;
 const raw=zlib.inflateSync(Buffer.concat(idat));
 assert.equal(raw.length,(stride+1)*h,'PNG decompressed scanlines');
 const pixels=Buffer.alloc(w*h*3);let prior=Buffer.alloc(stride),cursor=0;
 for(let y=0;y<h;y++){
  const filter=raw[cursor++],line=Buffer.allocUnsafe(stride);
  for(let x=0;x<stride;x++){
   const value=raw[cursor++],a=x>=ch?line[x-ch]:0,up=prior[x],c=x>=ch?prior[x-ch]:0;
   let predictor=0;
   if(filter===1)predictor=a;
   else if(filter===2)predictor=up;
   else if(filter===3)predictor=(a+up)>>1;
   else if(filter===4){
    const p=a+up-c,pa=Math.abs(p-a),pb=Math.abs(p-up),pc=Math.abs(p-c);
    predictor=pa<=pb&&pa<=pc?a:pb<=pc?up:c;
   }else if(filter!==0)throw Error('Unsupported PNG filter '+filter);
   line[x]=(value+predictor)&255;
  }
  for(let x=0;x<w;x++){
   const i=(y*w+x)*3,j=x*ch;
   pixels[i]=line[j];pixels[i+1]=line[j+1];pixels[i+2]=line[j+2];
  }
  prior=line;
 }
 return {width:w,height:h,pixels};
}
export function pixelImpact(before,after,rect={x0:0,y0:80,x1:1005,y1:705}){
 assert.equal(before.width,after.width);assert.equal(before.height,after.height);
 const x0=Math.max(0,rect.x0),x1=Math.min(before.width,rect.x1);
 const y0=Math.max(0,rect.y0),y1=Math.min(before.height,rect.y1);
 assert.ok(x1>x0&&y1>y0);
 let gt1=0,gt10=0,gt25=0,total=0,abs=0;
 const p=before.pixels,q=after.pixels,w=before.width;
 let minX=x1,maxX=-1,minY=y1,maxY=-1;
 for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){
  const i=(y*w+x)*3,delta=Math.max(
   Math.abs(p[i]-q[i]),Math.abs(p[i+1]-q[i+1]),Math.abs(p[i+2]-q[i+2]));
  total++;abs+=delta;
  if(delta>1)gt1++;
  if(delta>10)gt10++;
  if(delta>25){gt25++;if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;}
 }
 return {roi:{x0,y0,x1,y1},totalPixels:total,
  changedRGBgt1:gt1,changedRGBgt10:gt10,changedRGBgt25:gt25,
  changedPctRGBgt1:100*gt1/total,changedPctRGBgt10:100*gt10/total,
  changedPctRGBgt25:100*gt25/total,
  meanMaxChannelAbsDelta:abs/total,
  delta25BoundingBox:gt25?{x0:minX,y0:minY,x1:maxX+1,y1:maxY+1}:null};
}

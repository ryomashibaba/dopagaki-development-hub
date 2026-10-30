/** R19 A2 actual PNG pixel attribution of original source scenic layer removals.
 * Quantifies per-layer observed IMAGE changes, not architectural quality,
 * actual obstruction/occlusion, human visibility, certified hazard fairness.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const dir=path.resolve('r19-evidence/r19a2');
const doc=JSON.parse(fs.readFileSync(path.join(dir,'R19_A2_ORIGINAL_CAMERA_LAYER_ATTRIBUTION.json')));
assert.equal(doc.sessions.length,9);
const base=new Map(doc.sessions.filter(s=>s.layer==='all').map(s=>[s.kind,s]));
const cases=[];
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage();
 for(const s of doc.sessions){
  if(s.layer==='all')continue;
  const ref=base.get(s.kind);assert.ok(ref);
  for(const target of s.screens){
   const original=ref.screens.find(x=>x.tick===target.tick);assert.ok(original);
   const pngA=fs.readFileSync(path.join(dir,original.file)).toString('base64');
   const pngB=fs.readFileSync(path.join(dir,target.file)).toString('base64');
   const result=await page.evaluate(async (a,b)=>{
    async function rgba(str){
     const blob=await(await fetch('data:image/png;base64,'+str)).blob();
     const bitmap=await createImageBitmap(blob);
     const canvas=document.createElement('canvas');
     canvas.width=bitmap.width;canvas.height=bitmap.height;
     const ctx=canvas.getContext('2d',{willReadFrequently:true});
     ctx.drawImage(bitmap,0,0);
     return {width:canvas.width,height:canvas.height,
      pixels:ctx.getImageData(0,0,canvas.width,canvas.height).data};
    }
    const x=await rgba(a),y=await rgba(b);
    if(x.width!==y.width||x.height!==y.height)throw Error('unmatched original source frame geometry');
    const W=x.width,H=x.height;
    const left=Math.floor(W*.18),right=Math.ceil(W*.82),
     top=Math.floor(H*.12),bottom=Math.ceil(H*.70);
    const area=(right-left)*(bottom-top);
    const cells=Array.from({length:9},()=>({changed:0,total:0}));
    let altered=0,global=0;
    for(let yy=0;yy<H;yy++)for(let xx=0;xx<W;xx++){
     const i=(yy*W+xx)*4;
     const diff=Math.max(Math.abs(x.pixels[i]-y.pixels[i]),
      Math.abs(x.pixels[i+1]-y.pixels[i+1]),
      Math.abs(x.pixels[i+2]-y.pixels[i+2]))>20;
     if(diff)global++;
     if(xx<left||xx>=right||yy<top||yy>=bottom)continue;
     const column=Math.min(2,Math.floor((xx-left)/(right-left)*3));
     const row=Math.min(2,Math.floor((yy-top)/(bottom-top)*3));
     const cell=cells[row*3+column];
     cell.total++;
     if(diff){altered++;cell.changed++;}
    }
    return {canvas:[W,H],roi:[left,top,right,bottom],
     pixelDifferenceThreshold:20,roiAlteredPixels:altered,roiTotalPixels:area,
     changedROIpercent:Number((altered/area*100).toFixed(3)),
     changedWholeCanvasPercent:Number((global/(W*H)*100).toFixed(3)),
     grid3x3Percent:cells.map(c=>Number((100*c.changed/c.total).toFixed(3)))};
   },pngA,pngB);
   cases.push({mode:s.kind,removedLayer:s.layer,tick:target.tick,
    trueNativeSec:target.nativeTime,originalSourceRoad:target.sourceNativeB48Road,
    baselineSHA256:original.pngSHA256,layerlessSHA256:target.pngSHA256,
    ...result,certifiesHumanVision:false,certifiesArchitecturalQuality:false});
  }
 }
}finally{await browser.close();}
assert.equal(cases.length,28);
const output={schema:'dopagaki.r19a2-native-pixel-source-contribution/1',
 source:doc.originalSourceSHA,originalWebGL2Frames:36,measurements:cases,
 physicalB48Changed:false,originalMovingB51Changed:false,
 warningVisibilityUnverified:true,ART:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD'};
fs.writeFileSync(path.join(dir,'R19_A2_REAL_PIXEL_SOURCE_ATTRIBUTION.json'),JSON.stringify(output,null,2)+'\n');
const lines=[
 '# R19 A2 — 本物の元Canvas画像から描画層の寄与を数値化',
 '',
 '**元ゲーム14m実B48同tick Native / 28 B51、同一カメラ。RGB差>20の画素割合、x=18〜82%、y=12〜70%のROI。美術点・遮蔽検出・人間可視性ではない。**',
 '',
 '| 物理道路 | 元描画層から削除 | 3.004秒 | 4.404秒 | 5.204秒 | 8.004秒 |',
 '|---|---|---:|---:|---:|---:|'
];
for(const s of doc.sessions){
 if(s.layer==='all')continue;
 const arr=cases.filter(v=>v.mode===s.kind&&v.removedLayer===s.layer);
 lines.push('| '+s.kind+' | '+s.layer+' | '+arr.map(v=>v.changedROIpercent.toFixed(3)+'%').join(' | ')+' |');
}
lines.push('','**注意：数字は本当の遮蔽割合ではなく、他レイヤーが手前にあって差が隠れた場合を含む画素差。複数の層が重なっても加算できない。**');
fs.writeFileSync(path.join(dir,'R19_A2_ACTUAL_SCENERY_PIXEL_DELTA_JA.md'),lines.join('\n')+'\n');
console.log('R19A2_TRUE_ORIGINAL_LAYER_PIXEL_DELTA',JSON.stringify({
 comparisons:cases.length,sourceMasks:[...new Set(cases.map(v=>v.removedLayer))],
 mostAffected:[...cases].sort((a,b)=>b.changedROIpercent-a.changedROIpercent).slice(0,8).map(x=>({
 mode:x.mode,layer:x.removedLayer,tick:x.tick,roiPct:x.changedROIpercent})),
 HUMAN:'HOLD',ART:'HOLD'}));

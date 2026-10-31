import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7BC} from '../scripts/p101-w9c2-g4e7bc-bank-contour.mjs';
import {g4e7bjAbyssalStrata} from '../web/p101-w9c2-g4e7bj-abyssal-strata.mjs';
import {g4e7bgNativeFrames} from '../scripts/p101-w9c2-g4e7bg-native-visual-frames.mjs';
import {sample} from '../private/reference_only/director/surface.js';
// Same unmodified chase camera as WebGL (shader x=1.35*right/aspect,
// shader y=1.35*up) with frame orientation truly obtained at 240 Hz.
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const unit=v=>v.map(x=>x/(Math.hypot(...v)||1));
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
function coverage(vertices,shot){
 const right=unit(cross(shot.front,[0,1,0])),up=unit(cross(right,shot.front));
 let visible=0,mid=0,under=0,mask=new Set();
 for(let i=0;i<vertices.length;i+=18){
  const centroid=[0,1,2].map(axis=>(vertices[i+axis]+vertices[i+6+axis]+vertices[i+12+axis])/3),
   w=centroid.map((c,j)=>c-shot.eye[j]),z=dot(w,shot.front);
  if(z<=5)continue;
  const x=1.35*dot(w,right)/(1.55*z),y=1.35*dot(w,up)/z;
  if(Math.abs(x)>1||Math.abs(y)>1)continue;
  visible++;
  if(Math.abs(x)<.82&&Math.abs(y)<.52){mid++;mask.add(Math.floor((x+1)*9)+'/'+Math.floor((y+1)*6));}
  if(y<.1&&y>-.92&&Math.abs(x)<.90)under++;
 }
 return {visible,mid,under,occupiedGrid:mask.size};
}
test('BJ actual 240Hz natural 112-126mps camera MUST see positive city, not offscreen shells',()=>{
 const proof=g4e7bgNativeFrames();
 for(const road of ['true-pinch','pinch-switch']){
  const scene=g4e7bjAbyssalStrata(generateG4E7BC(road,'rollDeck'),sample,{enabled:true});
  for(const shot of proof.stages[road].frames.filter(x=>x.id==='t1700'||x.id==='t1850')){
   const c=coverage(scene.vertices,shot);
   console.log('BJ_REAL_CAMERA_VISIBLE '+JSON.stringify({road,frame:shot.id,speed:shot.speedMps,...c}));
   assert(c.visible>=20,'BJ city remains offscreen '+JSON.stringify({road,frame:shot.id,...c}));
   assert(c.mid>=10,'BJ city lacks interior-to-frame architectural mass '+JSON.stringify({road,frame:shot.id,...c}));
   assert(c.under>=10,'BJ undercity is not on screen '+JSON.stringify({road,frame:shot.id,...c}));
  }
 }
});

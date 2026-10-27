import test from 'node:test';
import assert from 'node:assert/strict';
import {buildDoReference} from '../scripts/p101-w9c2-g4e7do-master-export.mjs';
import {g4e7djNativeStoryboard} from '../scripts/p101-w9c2-g4e7dj-native-storyboard.mjs';
const dot=(a,b)=>a.reduce((n,x,i)=>n+x*b[i],0);
test('DP one world corridor forms continuity in genuine 15–17s views of both roads',()=>{
 const real=g4e7djNativeStoryboard(),results=[];
 for(const road of ['true-pinch','pinch-switch']){
  const data=buildDoReference(road,real),tracks=data.lineGuides[1].tracks;
  const edge=tracks[0].points,mid=tracks[1].points;
  const stations=[31.5,33.5,36,38.5,41];
  for(const k of stations){
   const i=Math.floor(k),u=k-i,p=edge[i].map((v,j)=>v*(1-u)+edge[i+1][j]*u);
   const m=mid[i].map((v,j)=>v*(1-u)+mid[i+1][j]*u);
   const outward=[p[0]-m[0],0,p[2]-m[2]];
   const mag=Math.hypot(...outward);
   assert.ok(mag>4);
   const point=p.map((x,j)=>x+outward[j]/mag*175+(j===1?100:0));
   let total=0;
   for(const camera of data.cameras){
    const v=point.map((x,j)=>x-camera.eye[j]),z=dot(v,camera.front);
    if(z<=10)continue;
    const x=.5+.5*1.35*dot(v,camera.right)/(z*(1008/645));
    const y=.5-.5*1.35*dot(v,camera.up)/z;
    if(x>=.08&&x<=.96&&y>=.02&&y<=.85)total++;
   }
   results.push({road,station:k,visible:total});
  }
 }
 assert.equal(results.length,10);
 // Camera storyboard verification is a location feasibility check, not
 // proof of final geometry visibility (which requires real Blender renders).
 assert.ok(results.every(x=>x.visible>=3),JSON.stringify(results));
});

import {add,sub,mul,cross,norm,len,clamp} from './math.js';
import {normalizeMovingObstacles} from './moving/moving-obstacles.mjs';
import {validateFixtures} from './game-fixtures.js';
export const SCHEMA='dopagaki.track-director/1';
const cr=(a,b,c,d,t)=>a.map((_,i)=>.5*((2*b[i])+(-a[i]+c[i])*t+(2*a[i]-5*b[i]+4*c[i]-d[i])*t*t+(-a[i]+3*b[i]-3*c[i]+d[i])*t*t*t));
function row(s,r,v){r=clamp(r,0,s.rows-1);const f=clamp(v,0,1)*(s.cols-1),j=Math.min(s.cols-2,Math.floor(f)),t=f-j;
 const get=c=>s.points[r*s.cols+clamp(c,0,s.cols-1)];return cr(get(j-1),get(j),get(j+1),get(j+2),t);}
// Tensor-product Catmull-Rom: all three coordinates are interpolated. No z or y monotonicity assumption.
export function sample(s,u,v){const f=clamp(u,0,1)*(s.rows-1),i=Math.min(s.rows-2,Math.floor(f)),t=f-i;return cr(row(s,i-1,v),row(s,i,v),row(s,i+1,v),row(s,i+2,v),t);}
export function frame(s,u,v){const p=sample(s,u,v),du=sub(sample(s,Math.min(1,u+.001),v),sample(s,Math.max(0,u-.001),v)),dv=sub(sample(s,u,Math.min(1,v+.001)),sample(s,u,Math.max(0,v-.001)));return {p,forward:norm(du),normal:norm(cross(du,dv))};}
// Each editor control lattice describes the playable outer skin. The underside is
// generated from it, so thickness remains consistent after arbitrary 3D edits.
// Missing thickness is intentional for old JSON courses: legacy data renders solid.
export const defaultThickness=s=>s.material==='roof'?1.8:s.material==='shell'?0.85:1.25;
export const surfaceThickness=s=>s.thickness??defaultThickness(s);
export function tessellate(s){
 const nu=(s.rows-1)*s.resolution,nv=(s.cols-1)*s.resolution;
 const positions=[],uv=[],tp=[],indices=[],degenerate={count:0};
 const thickness=surfaceThickness(s),total=(nu+1)*(nv+1);
 // G4E-3: opt-in *missing physical tessellation cells*, not an invisible bridge.
 // A longitudinal cell is one complete cross-road strip, including underside
 // and both outer edge skirts. All original control points and route stay intact.
 const voidCells=new Set(s.voidLongitudinalCells??[]);
 const coords=(i,j)=>i*(nv+1)+j;
 const top=[],bottom=[];
 for(let i=0;i<=nu;i++)for(let j=0;j<=nv;j++){
  const u=i/nu,v=j/nv,p=sample(s,u,v),f=frame(s,u,v);
  // Preserve the physical mirrored solid, not merely the visible control skin.
  // A coordinate reflection reverses cross-product handedness. Recover the
  // original normal, orient it using the pre-mirror frame, then re-apply the
  // accumulated mirror signs. This also handles vertical dome walls.
  const signs=s.thicknessMirror??[1,1,1],parity=signs[0]*signs[1]*signs[2];
  let n=f.normal.map((v,k)=>v*signs[k]*parity);
  if(Math.abs(n[1])>0.001&&n[1]<0)n=mul(n,-1);
  if(len(n)<.1)n=[0,1,0];
  n=n.map((v,k)=>v*signs[k]);
  top.push(p);bottom.push(sub(p,mul(n,thickness)));
  positions.push(...p);uv.push(v,u);tp.push(s.material==='roof'?1:0);
 }
 for(let i=0;i<total;i++){
  positions.push(...bottom[i]);uv.push(uv[i*2],uv[i*2+1]);tp.push(2);
 }
 function triangle(a,b,c){const p=[a,b,c].map(k=>positions.slice(k*3,k*3+3));
  if(len(cross(sub(p[1],p[0]),sub(p[2],p[0])))<1e-8){degenerate.count++;return;}
  indices.push(a,b,c);
 }
 // Maintain consistently outward normals even for ribbons whose grid winds down.
 const a0=coords(0,0),b0=coords(1,0),c0=coords(0,1);
 const initialNormal=cross(sub(top[b0],top[a0]),sub(top[c0],top[a0]));
 const extrudeDirection=sub(top[a0],bottom[a0]);
 const flipped=initialNormal.reduce((sum,x,k)=>sum+x*extrudeDirection[k],0)<0;
 const face=(a,b,c)=>flipped?triangle(a,c,b):triangle(a,b,c);
 // First group is the original top. Only this group can be driveable.
 for(let i=0;i<nu;i++)for(let j=0;j<nv;j++){
  if(voidCells.has(i))continue;
  const a=coords(i,j),b=coords(i+1,j);
  face(a,b,a+1);face(a+1,b,b+1);
 }
 const topIndexCount=indices.length;
 for(let i=0;i<nu;i++)for(let j=0;j<nv;j++){
  if(voidCells.has(i))continue;
  const a=coords(i,j),b=coords(i+1,j);
  face(a+1+total,b+total,a+total);face(b+1+total,b+total,a+1+total);
 }
 const bottomIndexCount=indices.length-topIndexCount;
 // Seal all four edges with a continuous, shared-topology outer skirt.
 const boundary=[];
 for(let j=0;j<=nv;j++)boundary.push(coords(0,j));
 for(let i=1;i<=nu;i++)boundary.push(coords(i,nv));
 for(let j=nv-1;j>=0;j--)boundary.push(coords(nu,j));
 for(let i=nu-1;i>=1;i--)boundary.push(coords(i,0));
 for(let k=0;k<boundary.length;k++){
  const a=boundary[k],b=boundary[(k+1)%boundary.length];
  // Skip the two side walls spanning the open longitudinal strip.
  const ia=Math.floor(a/(nv+1)),ib=Math.floor(b/(nv+1));
  if(Math.abs(ia-ib)===1&&voidCells.has(Math.min(ia,ib)))continue;
  face(a,b,a+total);face(b,b+total,a+total);
 }
 // Solid end caps at each actual takeoff/landing edge. Do not fill the void.
 for(let i=1;i<nu;i++)if(voidCells.has(i)!==voidCells.has(i-1)){
  const leavingRoad=voidCells.has(i);
  for(let j=0;j<nv;j++){
   const a=coords(i,j),b=coords(i,j+1);
   if(leavingRoad){face(a,b,a+total);face(b,b+total,a+total);}
   else {face(a,a+total,b);face(b,a+total,b+total);}
  }
 }
 return {positions,uv,tp,indices,topIndexCount,bottomIndexCount,sideIndexCount:indices.length-topIndexCount-bottomIndexCount,degenerate:degenerate.count,thickness};
}

export function validate(doc){
 if(!doc||doc.schema!==SCHEMA||!Array.isArray(doc.surfaces)||doc.surfaces.length>32)throw Error('コース形式が不正です');
 const ids=new Set();let triangles=0;
 for(const s of doc.surfaces){if(typeof s.id!=='string'||ids.has(s.id))throw Error('面IDが重複しています');ids.add(s.id);
 if(!Number.isInteger(s.rows)||!Number.isInteger(s.cols)||s.rows<2||s.cols<2||s.rows>32||s.cols>32||!Number.isInteger(s.resolution)||s.resolution<2||s.resolution>16||!Array.isArray(s.points)||s.points.length!==s.rows*s.cols)throw Error('制御点格子が不正です');
 if(s.points.some(p=>!Array.isArray(p)||p.length!==3||p.some(x=>!Number.isFinite(x)||Math.abs(x)>2000)))throw Error('座標は±2000m以内の有限値にしてください');
 if(typeof s.rideable!=='boolean'||typeof s.collidable!=='boolean'||!['road','roof','shell'].includes(s.material)||typeof s.name!=='string')throw Error('面属性が不正です');
 if(s.thickness!==undefined&&(!Number.isFinite(s.thickness)||s.thickness<0.15||s.thickness>20))throw Error('厚さは0.15〜20mで指定してください');
 if(s.thicknessMirror!==undefined&&(!Array.isArray(s.thicknessMirror)||s.thicknessMirror.length!==3||s.thicknessMirror.some(v=>v!==1&&v!==-1)))throw Error('厚みの鏡映方向が不正です');
 const nu=(s.rows-1)*s.resolution,nv=(s.cols-1)*s.resolution;
 if(s.voidLongitudinalCells!==undefined){
  const cells=s.voidLongitudinalCells;
  if(!s.collidable||!s.rideable||s.material!=='road'||!Array.isArray(cells)||
     !cells.length||cells.length>Math.floor(nu/5)||
     cells.some((i,k)=>!Number.isInteger(i)||i<3||i>nu-4||
      (k>0&&i<=cells[k-1])))
   throw Error('実物理ギャップの縦セル指定が不正です');
 }
 triangles+=4*nu*nv+4*(nu+nv);
 }
 if(triangles>200000)throw Error('曲面が重すぎます（立体20万三角形上限）');
 if(!Array.isArray(doc.spawns)||(doc.surfaces.some(s=>s.rideable&&s.collidable)&&doc.spawns.length<1)||doc.spawns.length>32)throw Error('開始点がありません');
 for(const p of doc.spawns)if(!ids.has(p.surface)||typeof p.name!=='string'||(p.reverse!==undefined&&typeof p.reverse!=='boolean')||!Number.isFinite(p.u)||!Number.isFinite(p.v)||p.u<0||p.u>1||p.v<0||p.v>1)throw Error('開始点が不正です');
 if(!Array.isArray(doc.route)||(doc.spawns.length&&doc.route.length<2)||doc.route.length>4096||doc.route.some(p=>!Array.isArray(p)||p.length!==3||p.some(x=>!Number.isFinite(x)||Math.abs(x)>2000)))throw Error('方向ガイドが不正です');
 if(doc.objects){const objects=new Set();for(const o of doc.objects){if(typeof o.id!=='string'||objects.has(o.id)||typeof o.name!=='string')throw Error('構造IDが不正です');objects.add(o.id);}for(const o of doc.objects)if(o.parentId&&!objects.has(o.parentId))throw Error('親構造がありません');for(const o of doc.objects){const seen=new Set([o.id]);let p=o.parentId;while(p){if(seen.has(p))throw Error('親子関係が循環しています');seen.add(p);p=doc.objects.find(x=>x.id===p)?.parentId;}}for(const s of doc.surfaces)if(s.objectId&&!objects.has(s.objectId))throw Error('所属構造がありません');}
 for(const s of doc.surfaces)for(const field of ['visible','locked'])if(s[field]!==undefined&&typeof s[field]!=='boolean')throw Error('表示・ロック属性が不正です');
 validateFixtures(doc.fixtures);
 normalizeMovingObstacles(doc);
 if(doc.routeSegments)for(const g of doc.routeSegments)if(!ids.has(g.surface)||![g.u0,g.u1,g.v].every(x=>Number.isFinite(x)&&x>=0&&x<=1)||g.u0===g.u1)throw Error('ルートの曲面参照が不正です（入口と出口は異なるuにしてください）');
 return structuredClone(doc);
}
export const serialize=doc=>JSON.stringify(validate(doc),null,2);
export const parse=text=>validate(JSON.parse(text));
const surface=(id,name,rows,cols,points,material='road',rideable=true)=>({id,name,rows,cols,points,resolution:6,rideable,collidable:true,material,thickness:material==='roof'?1.8:material==='shell'?.85:1.25});
export function ribbon(id,name,path,width=14){const points=[];path.forEach((p,i)=>{const tangent=norm(sub(path[Math.min(path.length-1,i+1)],path[Math.max(0,i-1)])),right=norm(cross(tangent,[0,1,0]));for(let j=0;j<5;j++)points.push(add(p,mul(right,(j/4-.5)*width)));});return surface(id,name,path.length,5,points);}
export function dome({width=64,length=96,height=28,rampX=0}={}){
 const roof=[];for(let i=0;i<5;i++)for(let j=0;j<5;j++){const x=(j/4-.5)*width,z=(i/4-.5)*length,y=10+(height-10)*(1-(x/(width*.54))**2)*(1-(z/(length*.54))**2);roof.push([x,y,z]);}
 const cap=surface('roof','外側の自由曲面屋根',5,5,roof,'roof'),entry=sample(cap,.999,.5+rampX/width);
 const edge=length/2,innerX=-width/3,arc=Array.from({length:6},(_,i)=>{const a=Math.PI-(i+1)*Math.PI/6;return [innerX+35+35*Math.cos(a),0,edge+140+35*Math.sin(a)];});
 const path=[[innerX,0,-edge-25],[innerX,0,edge+25],[innerX,0,edge+140],...arc,[innerX+55,0,edge+105],[innerX+25,0,edge+85],[rampX,0,edge+80],[rampX,0,edge+65],[rampX,2,edge+45],[rampX,entry[1]*.5,edge+22],[rampX,entry[1]-3,edge+6],[rampX,entry[1],edge]];
 const road=ribbon('ramp','内部道路 → 屋根ランプ',path,24);
 // Independent collision-only curtain: underside never becomes an auto-selected road.
 const skirt=[],skirt2=[];for(let i=0;i<5;i++){for(const [v,arr] of [[0,skirt],[1,skirt2]]){const p=sample(cap,i/4,v);arr.push([p[0],0,p[2]],p);}}const wall=surface('shell','ドーム左側壁（衝突専用）',5,2,skirt,'shell',false),wall2=surface('shell-right','ドーム右側壁（衝突専用）',5,2,skirt2,'shell',false);
 const route=[...Array.from({length:161},(_,i)=>sample(road,i/160,.5)),...Array.from({length:49},(_,i)=>sample(cap,1-i/48,.5+rampX/width))];
 return validate({schema:SCHEMA,name:'DOME / FREE SURFACE LAB',preset:{width,length,height,rampX},surfaces:[road,cap,wall,wall2],route,spawns:[{name:'内部から連続試走',surface:'ramp',u:.02,v:.5},{name:'ランプ登坂',surface:'ramp',u:.8,v:.5},{name:'屋根を試走',surface:'roof',u:.9,v:.5,reverse:true}]});
}
export function asymmetric(){const pts=[];for(let i=0;i<7;i++)for(let j=0;j<5;j++){const u=i/6,v=j/4,x=(v-.5)*26+Math.sin(u*4)*9,y=3+Math.sin(u*5)*5+(v-.5)*Math.sin(u*6)*8+v*v*4,z=u*145-45+(v-.5)*Math.sin(u*4)*12;pts.push([x,y,z]);}
 const s=surface('asymmetric','非対称・ねじれ自由曲面',7,5,pts,'roof');return validate({schema:SCHEMA,name:'ASYMMETRIC / TWISTED CONTROL NET',surfaces:[s],route:Array.from({length:49},(_,i)=>sample(s,i/48,.5)),spawns:[{name:'非対称面の入口',surface:s.id,u:.025,v:.5},{name:'ねじれ区間',surface:s.id,u:.45,v:.5}]});}

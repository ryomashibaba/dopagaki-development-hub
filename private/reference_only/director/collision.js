import {add,sub,mul,len,norm,dot,cross,closest} from './math.js';
import {tessellate} from './surface.js';
import {fixtureTriangles} from './game-fixtures.js';
const bounds=tris=>({min:[0,1,2].map(i=>Math.min(...tris.map(t=>t.min[i]))),max:[0,1,2].map(i=>Math.max(...tris.map(t=>t.max[i])))});
function build(tris){const box=bounds(tris);if(tris.length<=10)return {...box,tris};const axis=box.max.map((v,i)=>v-box.min[i]).indexOf(Math.max(...box.max.map((v,i)=>v-box.min[i])));tris.sort((a,b)=>a.min[axis]+a.max[axis]-b.min[axis]-b.max[axis]);const mid=tris.length>>1;return {...box,left:build(tris.slice(0,mid)),right:build(tris.slice(mid))};}
const overlaps=(a,b)=>a.min.every((v,i)=>v<=b.max[i]&&a.max[i]>=b.min[i]);
function query(node,box,out){if(!node||!overlaps(node,box))return;if(node.tris){for(const t of node.tris)if(overlaps(t,box))out.push(t);}else{query(node.left,box,out);query(node.right,box,out);}}
export function compile(doc){const triangles=[],meshes=[];let invalid=0;
 for(const s of doc.surfaces){const mesh=tessellate(s);meshes.push({surface:s,mesh});invalid+=mesh.degenerate;if(!s.collidable)continue;
 for(let k=0;k<mesh.indices.length;k+=3){const p=mesh.indices.slice(k,k+3).map(i=>mesh.positions.slice(i*3,i*3+3));triangles.push({a:p[0],b:p[1],c:p[2],normal:norm(cross(sub(p[1],p[0]),sub(p[2],p[0]))),min:[0,1,2].map(i=>Math.min(...p.map(v=>v[i]))),max:[0,1,2].map(i=>Math.max(...p.map(v=>v[i]))),surface:s.id,rideable:s.rideable&&k<mesh.topIndexCount,part:k<mesh.topIndexCount?'top':k<mesh.topIndexCount+mesh.bottomIndexCount?'underside':'edge'});}}
 for(const f of doc.fixtures??[])for(const [a,b,c] of fixtureTriangles(f)){triangles.push({a,b,c,normal:norm(cross(sub(b,a),sub(c,a))),min:[0,1,2].map(i=>Math.min(a[i],b[i],c[i])),max:[0,1,2].map(i=>Math.max(a[i],b[i],c[i])),surface:'fixture:'+f.id,rideable:false,part:'fixture'});}
 return {meshes,invalid,count:triangles.length,bvh:triangles.length?build(triangles):null};
}
export function candidates(world,a,b,r){const box={min:a.map((v,i)=>Math.min(v,b[i])-r),max:a.map((v,i)=>Math.max(v,b[i])+r)},out=[];query(world.bvh,box,out);return out;}
export function contacts(world,p,r){return candidates(world,p,p,r+.04).map(t=>{const q=closest(p,t.a,t.b,t.c),d=sub(p,q),distance=len(d);return {triangle:t,point:q,distance,normal:distance>1e-8?mul(d,1/distance):t.normal};}).filter(c=>c.distance<=r+.04).sort((a,b)=>a.distance-b.distance);}
// Exact swept sphere versus the Minkowski-expanded triangle: two offset faces,
// three finite edge cylinders and three vertex spheres. No endpoint-only test.
const roots=(a,b,c)=>{if(a<1e-16)return [];const d=b*b-4*a*c;if(d<0)return [];const q=Math.sqrt(d);return [(-b-q)/(2*a),(-b+q)/(2*a)];};
export function sweepTriangle(p,delta,r,t){if(len(delta)<1e-10)return null;let best=null;
 const accept=(time,normal,point)=>{if(time<-1e-7||time>1||dot(delta,normal)>=-1e-10)return;if(!best||time<best.time)best={time:Math.max(0,time),normal,point,triangle:t};};
 const initial=closest(p,t.a,t.b,t.c),diff=sub(p,initial),dist=len(diff);if(dist<r+1e-7)accept(0,dist>1e-8?mul(diff,1/dist):t.normal,initial);
 const signed=dot(sub(p,t.a),t.normal),rate=dot(delta,t.normal);
 if(Math.abs(rate)>1e-12)for(const side of [-1,1]){const time=(side*r-signed)/rate;if(time<0||time>1)continue;const normal=mul(t.normal,side),point=sub(add(p,mul(delta,time)),mul(normal,r));if(len(sub(point,closest(point,t.a,t.b,t.c)))<1e-5)accept(time,normal,point);}
 for(const [a,b] of [[t.a,t.b],[t.b,t.c],[t.c,t.a]]){const edge=sub(b,a),e2=dot(edge,edge),offset=sub(p,a),pe=sub(offset,mul(edge,dot(offset,edge)/e2)),de=sub(delta,mul(edge,dot(delta,edge)/e2));
 for(const time of roots(dot(de,de),2*dot(pe,de),dot(pe,pe)-r*r)){if(time<0||time>1)continue;const center=add(p,mul(delta,time)),u=dot(sub(center,a),edge)/e2;if(u>=0&&u<=1){const point=add(a,mul(edge,u));accept(time,norm(sub(center,point)),point);}}
 }
 for(const point of [t.a,t.b,t.c]){const d=sub(p,point);for(const time of roots(dot(delta,delta),2*dot(d,delta),dot(d,d)-r*r))if(time>=0&&time<=1)accept(time,norm(sub(add(p,mul(delta,time)),point)),point);}
 return best;
}
// Equal-time contact seams can be returned in different BVH traversal order
// after adding a separate, distant-at-contact road. Prefer the authored
// rideable top over a nonrideable edge ONLY for effectively identical TOI.
// Distinct earlier edge hits still win and remain lethal.
export function sweep(world,p,delta,r){
 let best=null;
 for(const t of candidates(world,p,add(p,delta),r+.001)){
  const hit=sweepTriangle(p,delta,r,t);
  if(hit&&(!best||hit.time<best.time-1e-9||
    (Math.abs(hit.time-best.time)<=1e-9&&
      hit.triangle.rideable&&!best.triangle.rideable)))best=hit;
 }
 return best;
}

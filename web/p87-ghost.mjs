/**
 * P87 client-side ghost: visual-only interpolation of build-time 240 Hz samples.
 * Does not import or invoke Runner and cannot adjust the player's physics.
 */
export const GHOST_SCHEMA='dopagaki.native-reference-ghost/1';
export function validateGhost(data){
 if(data?.schema!==GHOST_SCHEMA||data.stageId!=='EP-P66'||data.spawn!==0||
    data.finished!==true||!(data.finishSeconds>82&&data.finishSeconds<85)||
    !Array.isArray(data.samples)||data.samples.length<1200||data.samples.length>1450)
  throw Error('Invalid native reference ghost metadata');
 let last=-Infinity;
 for(const row of data.samples){
  if(!Array.isArray(row)||row.length!==4||row.some(n=>typeof n!=='number'||!Number.isFinite(n))||
     row[0]<=last)throw Error('Invalid native reference ghost samples');
  last=row[0];
 }
 if(Math.abs(last-data.finishSeconds)>.002)throw Error('Missing native FINISH snapshot');
 return data;
}
export function referenceGhostAt(data,time){
 if(!data||!Number.isFinite(time)||time<0||time>data.finishSeconds)return null;
 const samples=data.samples;
 if(time<=samples[0][0])return [...samples[0].slice(1)];
 let lo=0,hi=samples.length-1;
 while(lo+1<hi){
  const mid=(lo+hi)>>>1;
  if(samples[mid][0]<=time)lo=mid;else hi=mid;
 }
 const a=samples[lo],b=samples[hi],span=b[0]-a[0];
 const t=Math.max(0,Math.min(1,span>0?(time-a[0])/span:0));
 return [1,2,3].map(i=>a[i]+(b[i]-a[i])*t);
}
export function ghostEligible(doc,spawn,mode){
 return doc?.stageForge?.id==='EP-P66'&&spawn===0&&mode==='manual';
}
export function ghostLatticeVertices(){
 const v=[],r=.65,seg=20,rings=10,color=[.6,.42,.97];
 const put=p=>v.push(...p,...color);
 const line=(p,q)=>{put(p);put(q)};
 for(let ring=1;ring<rings;ring++){
  const theta=Math.PI*ring/rings,y=r*Math.cos(theta),rr=r*Math.sin(theta);
  for(let j=0;j<seg;j++){
   const a=2*Math.PI*j/seg,b=2*Math.PI*(j+1)/seg;
   line([rr*Math.cos(a),y,rr*Math.sin(a)],[rr*Math.cos(b),y,rr*Math.sin(b)]);
  }
 }
 for(let j=0;j<seg;j++){
  const phi=2*Math.PI*j/seg;
  for(let i=0;i<rings;i++){
   const a=Math.PI*i/rings,b=Math.PI*(i+1)/rings;
   const xyz=t=>[r*Math.sin(t)*Math.cos(phi),r*Math.cos(t),r*Math.sin(t)*Math.sin(phi)];
   line(xyz(a),xyz(b));
  }
 }
 return v;
}

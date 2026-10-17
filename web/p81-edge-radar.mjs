/**
 * P81 / NATIVE EDGE RADAR (display only)
 *
 * Estimates lateral position on the real current B48 surface skin. Uses
 * canonical sample/frame and the runner's actual rideable contact ID.
 * This NEVER writes to Runner, never adds collision surfaces or route
 * guidance, and does not imply the road is safe at a particular speed.
 */
const dot=(a,b)=>a.reduce((n,x,i)=>n+x*b[i],0);
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const normSq=x=>dot(x,x);
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
export function locateRoadLateral(stage,surfaceId,position,sample,frame,{grounded=true,ballRadius=.65}={}){
 if(!grounded||!stage||typeof surfaceId!=='string'||!Array.isArray(position)||position.some(x=>!Number.isFinite(x)))return null;
 if(typeof sample!=='function'||typeof frame!=='function')throw Error('Native road samplers required');
 const road=stage.surfaces?.find(s=>s.id===surfaceId&&s.rideable&&s.collidable);
 if(!road)return null;
 // First locate the nearest local longitudinal position on this *exact* road,
 // not on arbitrary nearby fork/spiral surfaces or a fabricated centerline.
 let bestU=0,bestD=Infinity;
 for(let i=0;i<=32;i++){
  const u=i/32,p=sample(road,u,.5),d=normSq(sub(position,p));
  if(d<bestD){bestD=d;bestU=u;}
 }
 let low=Math.max(0,bestU-1/32),high=Math.min(1,bestU+1/32);
 for(let i=0;i<7;i++){
  const a=low+(high-low)/3,b=high-(high-low)/3;
  const da=normSq(sub(position,sample(road,a,.5)));
  const db=normSq(sub(position,sample(road,b,.5)));
  if(da<db)high=b;else low=a;
 }
 const u=(low+high)/2;
 const left=sample(road,u,0),right=sample(road,u,1);
 const crossRoad=sub(right,left),width=Math.hypot(...crossRoad);
 if(!(width>1e-5))return null;
 // Projection is a local, approximate lane indicator, not an exact swept
 // ball-vs-edge collision prediction. Do not issue steering commands.
 const v=dot(sub(position,left),crossRoad)/normSq(crossRoad);
 const leftMargin=v*width-ballRadius;
 const rightMargin=(1-v)*width-ballRadius;
 const raw=frame(road,u,clamp(v,0,1)).normal;
 const normalLength=Math.hypot(...raw)||1;
 const tilt=Math.acos(clamp(Math.abs(raw[1]/normalLength),0,1))*180/Math.PI;
 const margin=Math.min(leftMargin,rightMargin);
 const dangerAt=Math.min(10,Math.max(3,width*.12));
 const cautionAt=Math.min(24,Math.max(8,width*.24));
 const severity=margin<=dangerAt?'danger':margin<=cautionAt?'caution':'clear';
 const edge=leftMargin<rightMargin?'LEFT':'RIGHT';
 return {surface:road.id,u,v,width,leftMargin,rightMargin,margin,
  tiltDegrees:tilt,severity,edge,offRoad:margin<0,
  approximate:true};
}
export function edgeRadarLabel(r){
 if(!r)return '接地中のみ道路端を表示';
 const margin=Math.max(0,r.margin);
 const place=r.edge==='LEFT'?'左端':'右端';
 if(r.offRoad)return place+' / 道路外の可能性';
 if(r.severity==='danger')return place+' 接近 '+margin.toFixed(1)+'m';
 if(r.severity==='caution')return place+' 注意 '+margin.toFixed(1)+'m';
 return '路面内 '+margin.toFixed(1)+'m / 面傾斜 '+r.tiltDegrees.toFixed(0)+'°';
}

/**
 * P101 A13 W9-A: massive road-registered architectural volumes.
 * GPU scenery only. Real B48 rideable skins and B51-C native moving solids
 * are intentionally untouched; the open roof slot is NOT a gameplay gap.
 * No full-cover fake tunnel, roadway collider or auto-steer is created.
 */
export const W9_HERO_DISTRICTS=Object.freeze([
 Object.freeze({section:0,start:.045,end:.46,slices:24,shoulder:19,height:68,name:'LAUNCH FOUNDRY'}),
 Object.freeze({section:3,start:.055,end:.45,slices:28,shoulder:23,height:82,name:'UNDERPASS CROWN'})
]);
const add=(p,q)=>p.map((x,i)=>x+q[i]);
const mul=(p,t)=>p.map(x=>x*t);
const lerp=(p,q,t)=>add(mul(p,1-t),mul(q,t));
const up=(p,h)=>add(p,[0,h,0]);
const normHorizontal=p=>{const h=Math.hypot(p[0],p[2]);if(h<.001)throw Error('W9 cannot resolve actual road width');return [p[0]/h,0,p[2]/h];};
const sub=(p,q)=>p.map((x,i)=>x-q[i]);
function triangle(out,a,b,c,rgb){for(const p of [a,b,c])out.push(...p,...rgb);}
function quad(out,a,b,c,d,rgb){triangle(out,a,b,c,rgb);triangle(out,a,c,d,rgb);}
function panel(out,a,b,c,d,rgb){quad(out,a,b,c,d,rgb);quad(out,d,c,b,a,rgb.map(x=>x*.72));}
const STEEL=[.19,.32,.40],FACET=[.13,.25,.33],DARK=[.075,.15,.21];
const EDGE=[.30,.66,.72],SKYLIGHT=[.55,.79,.82];
function sectionProfile(road,u,shoulder,height,sample){
 const a=sample(road,u,0),b=sample(road,u,1),c=sample(road,u,.5);
 const outward=normHorizontal(sub(b,a)),centerY=c[1];
 const left=add(a,mul(outward,-shoulder)),right=add(b,mul(outward,shoulder));
 const wallL=up(left,-4),wallR=up(right,-4);
 const roofL=[left[0],centerY+height-16,left[2]];
 const roofR=[right[0],centerY+height-16,right[2]];
 const openL=up(lerp(left,right,.37),height);
 const openR=up(lerp(left,right,.63),height);
 return {wallL,wallR,roofL,roofR,openL,openR,
  sillL:up(left,13),sillR:up(right,13),
  rimL:up(openL,1.3),rimR:up(openR,1.3)};
}
/**
 * Every station is sampled from the existing collision road, not a camera path.
 * The roof center aperture is decorative, never a road opening.
 */
export function a13W9HeroArchitecture(doc,sample){
 const empty={vertices:[],facilities:0,sections:[],wallPlates:0,roofPlates:0,
  skylights:0,nonCollision:true,minShoulderMeters:0};
 if(doc?.stageForge?.variant!=='A13_GAMEPLAY_ISOLATED')return empty;
 if(typeof sample!=='function'||doc.surfaces?.length!==7||doc.movingObstacles?.length!==28||
    doc.surfaces.some(s=>s.rows!==31||s.cols!==5||!s.rideable||!s.collidable))
  throw Error('W9 requires seven authentic B48 rideable skins and 28 real B51-C machines');
 const vertices=[];let wallPlates=0,roofPlates=0;
 for(const zone of W9_HERO_DISTRICTS){
  const road=doc.surfaces[zone.section],profiles=[];
  for(let i=0;i<=zone.slices;i++){
   const u=zone.start+(zone.end-zone.start)*i/zone.slices;
   profiles.push(sectionProfile(road,u,zone.shoulder,zone.height,sample));
  }
  for(let i=0;i<zone.slices;i++){
   const a=profiles[i],b=profiles[i+1];
   const wallTone=i%4===0?STEEL:i%4===1?FACET:DARK;
   panel(vertices,a.wallL,b.wallL,b.sillL,a.sillL,wallTone);
   panel(vertices,a.sillL,b.sillL,b.roofL,a.roofL,i%4===0?FACET:STEEL);
   panel(vertices,a.wallR,a.sillR,b.sillR,b.wallR,wallTone);
   panel(vertices,a.sillR,a.roofR,b.roofR,b.sillR,i%4===0?FACET:STEEL);
   wallPlates+=4;
   // Inward-sloping paired roof wings leave a wide open central skylight.
   panel(vertices,a.roofL,b.roofL,b.openL,a.openL,i%3===0?STEEL:FACET);
   panel(vertices,a.openR,b.openR,b.roofR,a.roofR,i%3===0?FACET:STEEL);
   roofPlates+=2;
   // Danger mode colors red/yellow/purple are reserved for actual machines.
   panel(vertices,a.openL,b.openL,b.rimL,a.rimL,SKYLIGHT);
   panel(vertices,a.rimR,b.rimR,b.openR,a.openR,SKYLIGHT);
   if(i%4===0){
    const p=profiles[i+1];
    panel(vertices,a.wallL,p.wallL,p.roofL,a.roofL,EDGE);
    panel(vertices,a.wallR,a.roofR,p.roofR,p.wallR,EDGE);
    panel(vertices,a.roofL,p.roofL,p.openL,a.openL,DARK);
    panel(vertices,a.openR,p.openR,p.roofR,a.roofR,DARK);
   }
   if(i%2===0){
    panel(vertices,up(a.wallL,9),up(b.wallL,9),up(b.wallL,10.2),up(a.wallL,10.2),EDGE);
    panel(vertices,up(a.wallR,9),up(a.wallR,10.2),up(b.wallR,10.2),up(b.wallR,9),EDGE);
   }
  }
  // Entry/exit roof crowns stay overhead and leave the road entirely open.
  for(const index of [0,zone.slices]){
   const p=profiles[index];
   panel(vertices,p.roofL,p.openL,up(p.openL,4),up(p.roofL,4),DARK);
   panel(vertices,p.openR,p.roofR,up(p.roofR,4),up(p.openR,4),DARK);
  }
 }
 if(vertices.length===0||vertices.length>260000||vertices.length%18!==0||!vertices.every(Number.isFinite))
  throw Error('W9 GPU architecture exceeds geometry budget or is nonfinite');
 return {vertices,facilities:W9_HERO_DISTRICTS.length,
  sections:W9_HERO_DISTRICTS.map(z=>z.section),wallPlates,roofPlates,
  skylights:W9_HERO_DISTRICTS.length,nonCollision:true,
  minShoulderMeters:Math.min(...W9_HERO_DISTRICTS.map(z=>z.shoulder))};
}

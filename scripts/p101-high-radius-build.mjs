/**
 * P101 B4 — real 3D high-radius road reshaping. Original P100 remains frozen.
 *
 * B48 Catmull–Rom 31x5 rideable/collidable road lattice itself is changed,
 * not camera or HUD; 12 existing B51-C machine configurations are kept
 * and re-anchored onto the new physical skins at their original station u
 * and same lateral authored offsets. All seven chapter joins are preserved.
 *
 * A lobe to the OUTSIDE of the direction of turn makes the largest real
 * 180° hairpin bowls and late S sweeps less tightly curved. Smooth pulse
 * has zero displacement and first derivative at both section boundaries.
 */
import {sample,frame} from '../private/reference_only/director/surface.js';
import {P95_HAZARD_SPECS} from '../web/p95-hazard-layout.mjs';

export const P101_B4_PROFILES=Object.freeze([
 Object.freeze({name:'ABYSS DIVE / original giant drop',turn:0,bulge:0,bank:0}),
 Object.freeze({name:'CROWN REVERSAL / expanded exterior hairpin',turn:1,bulge:115,bank:8}),
 Object.freeze({name:'SCISSOR RISE / gradual multi-level climb',turn:-1,bulge:35,bank:4}),
 Object.freeze({name:'LOWER REVERSAL / expanded underpass hairpin',turn:-1,bulge:125,bank:9}),
 Object.freeze({name:'VOID SURGE / sweeping late turn',turn:1,bulge:80,bank:7}),
 Object.freeze({name:'PRISM CREST / broadened skyline transition',turn:-1,bulge:48,bank:5}),
 Object.freeze({name:'FINISH RIDGE / open final arc',turn:1,bulge:38,bank:4})
]);
const norm=v=>Math.hypot(...v)||1;
export function p101HighRadiusPulse(u){
 if(!Number.isFinite(u)||u<0||u>1)throw Error('P101 road-pulse u outside physical road');
 if(u===0||u===1)return 0; // exact chapter seam invariance
 const wave=Math.sin(Math.PI*u);
 return wave**4; // C2-smooth entry/exit, prevents abrupt early hairpin curvature
}
export function p101ReshapeRoad(original,index,{scale=1}={}){
 if(!Number.isInteger(index)||index<0||index>=P101_B4_PROFILES.length||!Number.isFinite(scale)||scale<0||scale>1.6)
  throw Error('P101 invalid high-radius profile');
 const profile=P101_B4_PROFILES[index],s=structuredClone(original);
 if(scale===0)return s; // exact P100 geometry for isolated real physical control
 if(s.rows!==31||s.cols!==5||!s.rideable||!s.collidable)throw Error('P101 requires unchanged B48 physical surface topology');
 const old=original.points;
 // The first TWO and last TWO physical control rows never change. Catmull-Rom
 // endpoint positions AND boundary tangents therefore remain exact P100
 // at every 3D chapter join — no hidden seam launch or continuity compromise.
 for(let i=2;i<29;i++){
  const u=i/30,pulse=p101HighRadiusPulse(u),a=old[(i-1)*5+2],b=old[(i+1)*5+2];
  const dx=b[0]-a[0],dz=b[2]-a[2],dist=norm([dx,dz]);
  const lateral=[-dz/dist,0,dx/dist];
  // Positive original yaw goes CCW in XZ; OUTSIDE is -left in that turn.
  const lateralShift=-profile.turn*profile.bulge*scale*pulse;
  for(let j=0;j<5;j++){
   const p=old[i*5+j],side=(j-2)/2;
   s.points[i*5+j]=[
    p[0]+lateral[0]*lateralShift,
    p[1]+side*profile.bank*scale*pulse,
    p[2]+lateral[2]*lateralShift
   ];
  }
 }
 return s;
}
const add=(a,b,k=1)=>a.map((v,i)=>v+b[i]*k);
const unit=v=>v.map(x=>x/norm(v));
/** Native authored machine parameters protected; only P101 physical anchors move. */
export function p101ReanchorMachines(sourceMachines,surfaces,{weights=Array(7).fill(1)}={}){
 if(sourceMachines.length!==P95_HAZARD_SPECS.length||surfaces.length!==7)throw Error('P101 requires exact 12 original B51-C machines');
 return sourceMachines.map((ob,i)=>{
  const [section,u,typeIndex,offset]=P95_HAZARD_SPECS[i];
  if(weights[section]===0)return structuredClone(ob); // preserve exact original station/axis when its road is unchanged
  const road=surfaces[section],f=frame(road,u,.5);
  const tangent=unit([f.forward[0],0,f.forward[2]]);
  const side=unit([-tangent[2],0,tangent[0]]);
  const position=add(add(sample(road,u,.5),side,offset),[0,1,0],[3,2.3,6.4][typeIndex]);
  const next=structuredClone(ob);
  next.position=position;
  if(next.type==='slider')next.motion.axis=side;
  return next;
 });
}
function radiusAt(road,u){
 const dt=.004,p0=sample(road,Math.max(0,u-dt),.5),p1=sample(road,u,.5),p2=sample(road,Math.min(1,u+dt),.5);
 const a=[p1[0]-p0[0],p1[2]-p0[2]],b=[p2[0]-p1[0],p2[2]-p1[2]];
 const l0=norm(a),l1=norm(b),d=Math.hypot(p2[0]-p0[0],p2[2]-p0[2]);
 const cross=Math.abs(a[0]*b[1]-a[1]*b[0]);
 return cross<.0000001?100000:l0*l1*d/(2*cross);
}
/** Real horizontal turning-radius observations, not a victory criterion. */
export function p101CurvatureReport(stage){
 return stage.surfaces.map((road,i)=>{
  // Include the shoulders of each hairpin: ignoring the first/last 10% let
  // the previous B4 candidate falsely appear better while falling in II.
  const samples=Array.from({length:97},(_,j)=>({u:.02+j*.96/96,r:radiusAt(road,.02+j*.96/96)}));
  const sorted=samples.map(x=>x.r).sort((a,b)=>a-b);
  const entry=samples.filter(x=>x.u<=.15).map(x=>x.r);
  const exit=samples.filter(x=>x.u>=.85).map(x=>x.r);
  return {section:i,name:P101_B4_PROFILES[i].name,
   entryMinRadiusMeters:+Math.min(...entry).toFixed(2),
   exitMinRadiusMeters:+Math.min(...exit).toFixed(2),
   minRadiusMeters:+sorted[0].toFixed(2),
   p10RadiusMeters:+sorted[Math.floor(sorted.length*.10)].toFixed(2),
   medianRadiusMeters:+sorted[Math.floor(sorted.length*.5)].toFixed(2)};
 });
}

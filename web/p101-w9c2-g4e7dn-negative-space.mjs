/**
 * G4E-7DN PRIVATE NEGATIVE-SPACE: subtractive evidence, not an ART proposal.
 * DO NOT add buildings until genuine native views demonstrate connectivity.
 * UNROOF removes distant folded rooflines. REVEAL also removes the single
 * previously highlighted station-2 left public promenade for occlusion QA.
 * No geometry created, no altered camera, physics, road or production.
 */
import {g4e7ciIntegratedStreetscape} from './p101-w9c2-g4e7ci-integrated-streetscape.mjs';
const DEFAULT_DN_MODE = 'UNROOF';
export function g4e7dgCanyonCandidate(doc,sample,{enabled=false,shots=null,mode=DEFAULT_DN_MODE}={}){
 if(!enabled)return {active:false,vertices:[],sources:[],triangles:0,
  art:'HOLD',newRoads:0,newColliders:0,newMovingHazards:0};
 if(!['UNROOF','REVEAL'].includes(mode))throw Error('DN invalid PRIVATE ablation');
 if(!Array.isArray(shots)||shots[0]?.id!=='t1500'||shots[1]?.id!=='t1700'||
  !['t1550','t1600','t1650'].every(id=>shots.some(s=>s.id===id))||
  shots.slice(0,2).some(s=>s.source!=='ACTUAL_240HZ_START00_P96_FIXED_SCRIPT_NOT_HUMAN'))
  throw Error('DN requires true native 240Hz continuous camera');
 const before=JSON.stringify(doc),cx=g4e7ciIntegratedStreetscape(doc,sample,{enabled:true,shots});
 if(!cx.active||cx.landmarks!==2||cx.sources?.length<10)throw Error('DN requires unchanged CX');
 const vertices=[],sources=[],omitted=[];
 for(const s of cx.sources){
  const omit=s.kind==='distant-folded-roofline'||
   (mode==='REVEAL'&&s.kind==='roadbank-promenade'&&
    s.station===2&&s.u===.62&&s.side===-1);
  if(omit){omitted.push({kind:s.kind,side:s.side??null,station:s.station??null,
    triangles:s.triangleCount});continue;}
  const firstTriangle=vertices.length/18;
  vertices.push(...cx.vertices.slice(s.firstTriangle*18,(s.firstTriangle+s.triangleCount)*18));
  sources.push({...s,firstTriangle});
 }
 const triangles=vertices.length/18;
 if(JSON.stringify(doc)!==before||triangles<1000||triangles>=cx.triangles||
    vertices.some(x=>!Number.isFinite(x))||
    sources.reduce((n,s)=>n+s.triangleCount,0)!==triangles||
    sources.some((s,i)=>s.firstTriangle!==(i?sources[i-1].firstTriangle+sources[i-1].triangleCount:0))||
    !omitted.some(x=>x.kind==='distant-folded-roofline')||
    (mode==='REVEAL'&&omitted.filter(x=>x.kind==='roadbank-promenade').length!==1)||
    sources.filter(s=>s.kind==='anchored-civic-crescent').length!==2)
  throw Error('DN refused: geometry/physics/coverage changed unexpectedly');
 return {...cx,vertices,sources,triangles,
  dg:{id:'G4E7DN_PRIVATE_NON_ADOPTABLE_GEOMETRY_ABLATION',
   design:'DN_TEMPORAL_NEGATIVE_SPACE_'+mode,removed:omitted,
   removedTriangleCount:cx.triangles-triangles,addedTriangles:0,
   untouchedHeroCount:2,original7Roads:doc.surfaces.length,
   original28Movers:doc.movingObstacles.length,addedPhysicalGeometry:false},
  art:'HOLD',human:'HOLD',ready:'HOLD',publish:'HOLD',merge:'HOLD',
  newRoads:0,newColliders:0,newMovingHazards:0,physicalChanged:false,
  officialSlope2Meters:0};
}

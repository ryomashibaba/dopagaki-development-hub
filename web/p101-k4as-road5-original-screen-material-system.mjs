/**
 * K4AS / isolated visual-only art direction for the actual Road5 game camera.
 * The original B48 surface positions, B51 collision OBBs, machine poses,
 * chase camera and 240Hz source Runner are NEVER written or transformed.
 *
 * Previous K4AQ changed the sky and added isolated geometry, but untouched
 * original Road5 still has saturated all-screen painted panels. This layer
 * addresses that mismatch, not a claim of full PBR or ART acceptance.
 *
 * Buffers are 6 floats per vertex [x,y,z,r,g,b]. The ONLY allowed mutation
 * is bytes at color indices 3,4,5 in a cloned PRIVATE WebGL buffer.
 */
export const K4AS_CONTRACT=Object.freeze({
 schema:'dopagaki.K4AS.private-original-road5-screen-material-palette/1',
 originalSourceBlob:'af076d67492a677d2235e4730aef8cdf4808e106',
 nativeHz:240,realB48:7,realB51:28,
 road5:'p93-PRISM_CREST-01',
 cameraModified:false,sourceGeometryModified:false,colliderModified:false,
 formalArtAccepted:0,slope2DNAMetres:0,
 ART:'NOT_TESTED_HOLD',HUMAN:'HOLD',SAT:'HOLD',CCD:'HOLD',
 FPS:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'
});
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const rgbClose=(a,b,e=1e-5)=>a.every((x,i)=>Math.abs(x-b[i])<e);
const outOfRange=(a)=>a.some(x=>!Number.isFinite(x));
const originalRGB=Object.freeze({
 road49:[.35*.49,.85*.49,1*.49],
 road62:[.35*.62,.85*.62,1*.62],
 unrideable:[.35*.3,.85*.3,1*.3],
 edge:[.22,.95,1],route:[.11,.72,.64]
});
const NEW=Object.freeze({
 matteRoad:[.205,.278,.311],secondaryRoad:[.24,.325,.349],
 darkUnderside:[.105,.160,.183],
 edge:[.52,.81,.79],route:[.32,.61,.65],
 subSurface:[.135,.19,.227],
 coolStone:[.69,.74,.70],brass:[.78,.585,.33],
 blueMetal:[.42,.62,.66],warmPearl:[.75,.705,.62]
});
function recolor(v, fn){
 if(!Array.isArray(v)||v.length%18||v.length<18||outOfRange(v))
  throw Error('K4AS INVALID ORIGINAL TRIANGLE VERTEX BUFFER');
 const result=v.slice(),used={};
 for(let k=0;k<v.length;k+=6){
  const xyz=v.slice(k,k+3),src=v.slice(k+3,k+6);
  const next=fn(src,xyz);
  if(!Array.isArray(next)||next.length!==3||outOfRange(next)||
   next.some(x=>x<0||x>1))throw Error('K4AS INVALID PALETTE COLOR');
  if(!rgbClose(src,next,1e-9)){
   result.splice(k+3,3,...next);
   const label=next.map(x=>Math.round(x*100)).join('-');
   used[label]=(used[label]||0)+1;
  }
 }
 for(let i=0;i<v.length;i+=6)
  for(let j=0;j<3;j++)
   if(result[i+j]!==v[i+j])throw Error('K4AS PROTECTED ORIGINAL XYZ MODIFIED');
 return {vertices:result,changedVertices:Object.values(used).reduce((a,b)=>a+b,0),
  exactXYZ:true,originalVertexCount:v.length/6,
  recoloredPaletteBins:used,newColliders:0,sourceModified:false,
  visualOnly:true,ART:'NOT_TESTED_HOLD'};
}
export function k4asMatteRoadSurface(original){
 return recolor(original,color=>{
  if(rgbClose(color,originalRGB.road49))return NEW.matteRoad;
  if(rgbClose(color,originalRGB.road62))return NEW.secondaryRoad;
  if(rgbClose(color,originalRGB.unrideable))return NEW.darkUnderside;
  // Original danger/reward fixtures and other semantic source colors:
  // unchanged. They are not decor and may not be recolored as architecture.
  return color;
 });
}
export function k4asQuietRoadArmour(original){
 return recolor(original,c=>{
  const [red,green,blue]=c,hi=Math.max(...c),low=Math.min(...c);
  if(hi<.23)return NEW.subSurface;
  if(hi<.43)return NEW.darkUnderside;
  // Literal red/yellow hazard status signaling is rendered by SEPARATE
  // B51 and hazard-gate buffers, never passed into this function.
  if((red>.76&&green>.5&&blue<.6)||(red>.78&&green>.58))
   return NEW.brass;
  if(red>.75&&blue>.45)return NEW.warmPearl;
  if(blue>.6&&green>.55)return NEW.blueMetal;
  if(green>.65&&red<.65)return NEW.coolStone;
  return NEW.warmPearl;
 });
}
export function k4asEdgeWayfinding(original){
 return recolor(original,c=>{
  if(rgbClose(c,originalRGB.edge))return NEW.edge;
  if(rgbClose(c,originalRGB.route))return NEW.route;
  return c;
 });
}
const sem=Object.freeze({
 fail:{name:'red-impact',steel:[.12,.17,.19],edge:[.38,.24,.26],
  glow:[.92,.23,.26]},
 bounce:{name:'amber-rebound',steel:[.13,.17,.19],edge:[.45,.37,.22],
  glow:[.95,.70,.24]},
 push:{name:'violet-displacement',steel:[.14,.16,.2],edge:[.36,.30,.47],
  glow:[.66,.48,.86]}
});
const originalSem=Object.freeze({
 fail:{steel:[.14,.19,.25],edge:[.52,.22,.26],glow:[1,.25,.31]},
 bounce:{steel:[.18,.19,.22],edge:[.58,.48,.25],glow:[1,.77,.27]},
 push:{steel:[.18,.16,.26],edge:[.43,.26,.64],glow:[.71,.38,1]}
});
export function k4asMachineryMaterial(original,mode){
 if(!(mode in sem))throw Error('K4AS INVALID REAL B51 COLLISION MODE');
 const v=sem[mode],old=originalSem[mode];
 return {...recolor(original,c=>{
  if(rgbClose(c,old.steel,.0001))return v.steel;
  if(rgbClose(c,old.edge,.0001))return v.edge;
  // Keep distinct actual fail/red, bounce/amber, push/violet encoding.
  // This only remaps display paint, never the actual moving OBB or collider.
  const cmax=Math.max(...old.glow);
  const factor=(c.reduce((a,x)=>a+x,0))/
               (old.glow.reduce((a,x)=>a+x,0)||1);
  if(factor>=.25&&factor<=1.02&&
     c.every((x,i)=>Math.abs(x-old.glow[i]*factor)<.005))
   return v.glow.map(x=>clamp(x*factor));
  return c;
 }),collisionSemantic:v.name,preservedOriginalCollision:true};
}
export function k4asScreenMaterialEligibility(doc){
 return Boolean(doc?.surfaces?.length===7&&doc?.movingObstacles?.length===28&&
  doc?.stageForge?.productionPromoted===false&&
  doc?.surfaces?.[5]?.id===K4AS_CONTRACT.road5);
}
export function k4asIsActualRoad5Visible(runner){
 return runner?.surface===K4AS_CONTRACT.road5||
        (!runner?.surface&&runner?.lastSurface===K4AS_CONTRACT.road5);
}

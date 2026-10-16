// Authored placeables from the locally bundled DOPAGAKI/NEON reference.
// A fixture's position is its *ground anchor*; units are metres and Y is up.
export const FIXTURE_TYPES=Object.freeze({
 danger:{label:'赤い危険ブロック',description:'接触したら失敗（現行ゲーム）',size:[1.6,1.65,1.4],color:0xff493f,behavior:'solid'},
 shove:{label:'押し出しブロック',description:'ぶつかると横に押し出される（現行ゲーム）',size:[2.15,1.7,1.8],color:0x36eed9,behavior:'shove'},
 boosterCube:{label:'ジャンプ加速キューブ',description:'接触すると前方加速と跳ね上がり（現行ゲーム）',size:[1.45,1.25,1.4],color:0x66eaff,behavior:'boosterCube'},
 cube:{label:'光キューブ',description:'獲得すると得点（現行ゲーム）',size:[.55,.55,.55],color:0x6affb5,behavior:'pickup',value:3},
 magnet:{label:'磁石キューブ',description:'一定時間、光キューブの回収距離が広がる（現行ゲーム）',size:[.6,.6,.6],color:0xb899ff,behavior:'pickup',value:0},
 block:{label:'赤い障害物',description:'接触すると試走失敗',size:[3,2,3],color:0xff5247,behavior:'solid'},
 wall:{label:'横長の障害壁',description:'幅広い衝突障害物',size:[12,3,1.7],color:0xff513f,behavior:'solid'},
 gate:{label:'通過ゲート（柱2本）',description:'柱に当たると衝突・中央を通れる',size:[12,6,1],color:0x8e80f6,behavior:'gate'},
 coin:{label:'通常アイテム',description:'取ると得点',size:[1,1,1],color:0xe55be8,behavior:'pickup',value:1},
 coinPink:{label:'ピンクアイテム',description:'色違いの取得アイテム',size:[1.6,1.6,1.6],color:0xff3faf,behavior:'pickup',value:5},
 coinGold:{label:'ゴールドアイテム',description:'特別な得点アイテム',size:[1.6,1.6,1.6],color:0xffd347,behavior:'pickup',value:10},
 coinRainbow:{label:'レインボーアイテム',description:'高得点の取得アイテム',size:[1.6,1.6,1.6],color:0x7eecff,behavior:'pickup',value:20},
 boost:{label:'加速床',description:'通過時にボールを加速',size:[6,.14,5],color:0x44ffbc,behavior:'boost'},
 pylon:{label:'支柱・柱',description:'衝突可能な構造物',size:[1.2,12,1.2],color:0x698da5,behavior:'solid'},
 tunnel:{label:'トンネル枠',description:'中央を通れる装飾フレーム',size:[13,10,1.4],color:0x4e9edf,behavior:'arch'},
 marker:{label:'警告マーカー',description:'危険な区間の目印（装飾）',size:[2,3,.5],color:0xffac45,behavior:'decoration'},
 beam:{label:'ネオン梁・照明',description:'景観用の発光した横梁',size:[12,.5,.7],color:0x6affea,behavior:'decoration'},
});
export const fixtureType=kind=>FIXTURE_TYPES[kind]??null;
export function newFixture(kind,position,id){const spec=fixtureType(kind);if(!spec)throw Error('配置物の種類が不正です');return {id,kind,position:[...position],size:[...spec.size],yaw:0,enabled:true};}
export function validateFixtures(fixtures){
 if(fixtures===undefined)return; if(!Array.isArray(fixtures)||fixtures.length>256)throw Error('配置物は最大256個までです');
 const ids=new Set();for(const f of fixtures){
  if(!f||typeof f.id!=='string'||!f.id||ids.has(f.id)||!fixtureType(f.kind))throw Error('配置物のIDまたは種類が不正です');ids.add(f.id);
  if(!Array.isArray(f.position)||f.position.length!==3||f.position.some(x=>!Number.isFinite(x)||Math.abs(x)>2000))throw Error('配置物の座標が不正です');
  if(!Array.isArray(f.size)||f.size.length!==3||f.size.some(x=>!Number.isFinite(x)||x<.1||x>120))throw Error('配置物の大きさが不正です');
  if(!Number.isFinite(f.yaw)||Math.abs(f.yaw)>36000||(f.enabled!==undefined&&typeof f.enabled!=='boolean'))throw Error('配置物の向き・状態が不正です');
 }
}
export function fixtureBoxes(f){
 const {behavior}=fixtureType(f.kind),[w,h,d]=f.size;
 if(['solid','shove','boosterCube'].includes(behavior))return [{offset:[0,h/2,0],size:[w,h,d]}];
 if(behavior==='gate'||behavior==='arch'){
  const side=Math.min(1.2,w*.13),top=Math.min(1.1,h*.2);
  return [{offset:[-w/2+side/2,h/2,0],size:[side,h,d]},{offset:[w/2-side/2,h/2,0],size:[side,h,d]},...(behavior==='arch'?[{offset:[0,h-top/2,0],size:[w,top,d]}]:[])];
 }
 return [];
}
export function fixtureTriangles(f){
 if(f.enabled===false||['shove','boosterCube'].includes(fixtureType(f.kind)?.behavior))return [];const angle=f.yaw*Math.PI/180,co=Math.cos(angle),si=Math.sin(angle),tris=[];
 const rot=([x,y,z])=>[f.position[0]+x*co+z*si,f.position[1]+y,f.position[2]-x*si+z*co];
 for(const {offset,size} of fixtureBoxes(f)){
  const [w,h,d]=size,verts=[];for(const y of [-h/2,h/2])for(const z of [-d/2,d/2])for(const x of [-w/2,w/2])verts.push(rot([x+offset[0],y+offset[1],z+offset[2]]));
  // Axis aligned in local fixture space, then rotated around Y.
  for(const [a,b,c,d] of [[0,1,3,2],[4,6,7,5],[0,4,5,1],[2,3,7,6],[0,2,6,4],[1,5,7,3]]){
   tris.push([verts[a],verts[b],verts[c]],[verts[a],verts[c],verts[d]]);
  }
 }
 return tris;
}
export function fixtureCenter(f){return [f.position[0],f.position[1]+f.size[1]/2+(fixtureType(f.kind)?.behavior==='pickup'?1:0),f.position[2]];}
export function fixtureTouches(f,p,radius=.65){
 if(f.enabled===false)return false;
 const [cx,cy,cz]=fixtureCenter(f),[dx,dy,dz]=[p[0]-cx,p[1]-cy,p[2]-cz],angle=f.yaw*Math.PI/180,c=Math.cos(angle),s=Math.sin(angle);
 const x=c*dx-s*dz,z=s*dx+c*dz,[w,h,d]=f.size;
 return Math.abs(x)<=w/2+radius&&Math.abs(dy)<=h/2+radius&&Math.abs(z)<=d/2+radius;
}
export function nextFixtureId(fixtures){const ids=new Set(fixtures.map(f=>f.id));let i=1;while(ids.has('prop-'+i))i++;return 'prop-'+i;}

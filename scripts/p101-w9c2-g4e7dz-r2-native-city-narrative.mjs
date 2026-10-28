/** G4E-7DZ R2 PRIVATE: THREE urban narratives / unchanged native DJ WebGL.
 * All lines are projection GUIDES; no meshes, depth occlusion, colliders, art approval.
 */
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {g4e7djNativeStoryboard} from './p101-w9c2-g4e7dj-native-storyboard.mjs';
import {project,verifyBaseline} from './p101-w9c2-g4e7dz-r1-native-aperture-contactsheet.mjs';
export const W=1008,H=645;
export const NARRATIVES=Object.freeze([
 {id:'CIVIC_CLEFT',anchor:'t1650',frames:['t1450','t1500','t1550','t1600'],
  void:[[-64,-12,-30],[-73,25,-25],[-54,75,20],[48,64,53],[61,10,55],[45,-6,28]],
  transit:[[-100,8,10],[-70,19,25],[-31,24,48],[20,23,66],[84,15,80]],
  habitation:[[-85,35,45],[-74,52,45],[-68,73,60],[-40,82,78]]},
 {id:'TRANSPORT_CONFLUENCE',anchor:'t1700',frames:['t1500','t1550','t1600','t1650'],
  void:[[-75,-10,0],[-66,45,22],[-42,90,66],[57,80,78],[68,15,46],[46,-5,10]],
  transit:[[-110,47,-45],[-64,40,0],[-9,32,39],[55,38,62],[109,55,94]],
  habitation:[[55,52,30],[63,69,40],[91,87,73],[115,91,106]]},
 {id:'LIVING_CANYON_SEQUENCE',anchor:'t1750',frames:['t1550','t1600','t1650','t1700'],
  void:[[-53,-8,-43],[-66,33,-5],[-59,69,65],[37,86,93],[62,30,43],[48,-10,-8]],
  transit:[[-105,8,-35],[-72,18,5],[-36,21,45],[15,31,80],[86,39,110]],
  habitation:[[-94,16,-15],[-86,38,3],[-102,61,43],[-77,88,80]]}
]);
const unit=a=>{const n=Math.hypot(...a);if(n<1e-8)throw Error('Degenerate native heading');return a.map(v=>v/n);};
export function worldFromLocal(anchor,coords){
 const pos=anchor.pose.position,heading=unit([anchor.pose.forward[0],0,anchor.pose.forward[2]]);
 if(!Array.isArray(pos)||pos.length!==3||![...pos,...anchor.pose.forward].every(Number.isFinite))throw Error('Invalid native pose');
 const side=[-heading[2],0,heading[0]];
 return coords.map(([x,y,z])=>[pos[0]+side[0]*x+heading[0]*z,pos[1]+y,pos[2]+side[2]*x+heading[2]*z]);
}
export function hitsViewport(a,b){
 return !!a&&!!b&&Math.max(Math.min(a.x,b.x),0)<=Math.min(Math.max(a.x,b.x),W)&&
  Math.max(Math.min(a.y,b.y),0)<=Math.min(Math.max(a.y,b.y),H);
}
export function projectGuide(frame,points){
 const proj=points.map(p=>project(frame,p)),segments=[];
 for(let i=1;i<proj.length;i++)if(hitsViewport(proj[i-1],proj[i]))segments.push([proj[i-1],proj[i]]);
 return {segments,visible:segments.length>0};
}
export function nativePreview(stage,h){
 if(stage.actualB48!==7||stage.actualMovingB51!==28||stage.originalGapCell52!==true)throw Error('Protected road drift');
 const by=Object.fromEntries(stage.frames.map(f=>[f.id,f])),anchor=by[h.anchor];
 if(!anchor||h.frames.some(id=>!by[id]||by[id].timeSeconds>=anchor.timeSeconds))throw Error('Native four-stage ordering invalid');
 const world={void:worldFromLocal(anchor,h.void),transit:worldFromLocal(anchor,h.transit),
  habitation:worldFromLocal(anchor,h.habitation),
  routeCue:['t1600','t1650','t1700','t1750','t1800'].map(id=>by[id].pose.position)};
 return h.frames.map(id=>{
  const f=by[id];return {id,seconds:f.timeSeconds,
   guides:Object.fromEntries(Object.entries(world).map(([k,v])=>[k,projectGuide(f,v)]))};
 });
}
const colors={void:'#f2d079',transit:'#69defa',habitation:'#f79dc3',routeCue:'#ffffff'};
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
export function makeSvg(png,road,h,f){
 const lines=[];
 for(const [kind,g] of Object.entries(f.guides))for(const [a,b] of g.segments){
  lines.push('<path d="M '+a.x.toFixed(2)+' '+a.y.toFixed(2)+' L '+b.x.toFixed(2)+' '+b.y.toFixed(2)+
   '" stroke="'+colors[kind]+'" stroke-width="3" stroke-dasharray="7 6" fill="none"/>');
 }
 const texts=['ORIGINAL DJ WEBGL + HYPOTHETICAL R2 NARRATIVE LINES (NOT NEW GAME CITY)',
  road+' / '+h.id+' / '+f.id+' / '+f.seconds+' s',
  'YELLOW void | CYAN transit | PINK habitation | WHITE scripted ball route',
  'ART HOLD / NO MESH / OCCLUSION NOT CHECKED / NOT HUMAN QA'];
 return '<svg xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'">'+
  '<defs><clipPath id="v"><rect width="'+W+'" height="'+H+'"/></clipPath></defs>'+
  '<image href="data:image/png;base64,'+png.toString('base64')+'" width="'+W+'" height="'+H+'"/>'+
  '<g clip-path="url(#v)">'+lines.join('')+'</g><rect width="'+W+'" height="104" fill="#071421" opacity=".87"/>'+
  texts.map((t,i)=>'<text x="14" y="'+(23+i*25)+'" font-family="sans-serif" font-size="15" fill="white">'+esc(t)+'</text>').join('')+'</svg>';
}
export async function run(input,output){
 const native=g4e7djNativeStoryboard();
 if(native.physicsHz!==240||native.camera!=='UNCHANGED_ORIGINAL_BALL_RELATIVE_NATIVE'||native.certifiedSlope2Meters!==0)throw Error('Native physics/camera drift');
 const manifest=JSON.parse(fs.readFileSync(path.join(input,'G4E7DJ_TRUE_WEBGL_STORYBOARD_HOLD.json'),'utf8'));
 verifyBaseline(manifest,f=>fs.readFileSync(path.join(input,f)));
 fs.mkdirSync(output,{recursive:true});
 const audit={schema:'dopagaki.g4e7dz-r2-narrative-guides/1',
  genuineDJWebGLSHA256Verified:true,physicsHz:240,actualB48:7,originalB51:28,gap52:true,
  newCityMeshes:0,newColliders:0,gameFilesModified:false,
  imageNature:'ORIGINAL_WEBGL_WITH_PROJECTED_NOT_RENDERED_CITY_LINES',
  occlusion:'NOT_TESTED',art:'HOLD',human:'HOLD',gameplay:'NOT_RUN',performance:'NOT_RUN',
  release:'HOLD',formalSlope2Meters:0,records:[]};
 const html=['<!doctype html><meta charset="utf-8"><title>DZ R2 PRIVATE</title>',
 '<style>body{background:#101927;color:#eee;font:16px system-ui;margin:22px}section{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}img{width:100%}</style>',
 '<h1>R2 genuine game screens with proposed multi-layer city narratives</h1><p>Hypothetical projections ONLY. NO actual new 3D art, occlusion, gameplay validation or human play. Screen coverage is not an art score.</p>'];
 for(const road of ['true-pinch','pinch-switch']){
  for(const h of NARRATIVES){
   const sequence=nativePreview(native.stages[road],h);
   html.push('<h2>'+road+' / '+h.id+'</h2><section>');
   for(const f of sequence){
    const ref=manifest.frames.find(x=>x.road===road&&x.id===f.id);
    if(!ref||Math.abs(ref.actualTime-f.seconds)>1e-6)throw Error('Original WebGL and native 240Hz time mismatch');
    const file=road+'-'+h.id+'-'+f.id+'-R2-GUIDE.svg';
    fs.writeFileSync(path.join(output,file),makeSvg(fs.readFileSync(path.join(input,ref.file)),road,h,f));
    const components=Object.fromEntries(Object.entries(f.guides).map(([k,g])=>[k,g.visible]));
    audit.records.push({road,narrative:h.id,frame:f.id,timeSeconds:f.seconds,genuineWebGL:ref.file,
      genuineSHA256:ref.sha256,guide:file,visibleGuideKinds:components,
      allFourGuidesProjected:Object.values(components).every(Boolean)});
    html.push('<img alt="actual original WebGL with hypothetical guide lines" src="'+file+'">');
   }
   html.push('</section>');
  }
 }
 if(audit.records.length!==24)throw Error('Expected exactly 3 narratives x 2 roads x 4 frames');
 fs.writeFileSync(path.join(output,'REVIEW_R2_NATIVE_NARRATIVES.html'),html.join('\n'));
 fs.writeFileSync(path.join(output,'R2_NATIVE_NARRATIVE_AUDIT.json'),JSON.stringify(audit,null,2)+'\n');
 console.log('DZ_R2_NATIVE_GUIDES',JSON.stringify({frames:audit.records.length,
   bothRoads:true,shaVerified:true,allFourProjected:audit.records.filter(r=>r.allFourGuidesProjected).length,art:'HOLD'}));
 return audit;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)
 run(process.argv[2],process.argv[3]).catch(e=>{console.error(e);process.exitCode=1});
import {sample} from '../reference_only/director/surface.js';
import {compile} from '../reference_only/director/collision.js';
import {Runner,DT} from '../reference_only/director/physics.js';
import {movingObstaclePose} from '../reference_only/director/moving/moving-obstacles.mjs';
import {fixtureTriangles} from '../reference_only/director/game-fixtures.js';
import {epicGeometry} from './p66-visual.mjs';
import {capturePose,resolveDisplayPose,createCameraState,advanceCamera,viewForPose,cameraYawErrorRadians} from './drive3d-camera.mjs';

const $=id=>document.getElementById(id);
const assets={'EP-P66':'P66_ECHO_RUSH.json','EP-001':'EP-001_P62_KINETIC_ARCHITECTURE.json','HG-001':'HG-001_P62_KINETIC_ARCHITECTURE.json','HS-001':'HS-001_P62_KINETIC_ARCHITECTURE.json','WV-001':'WV-001_P62_KINETIC_ARCHITECTURE.json'};
const canvas=$('view'),status=$('appStatus'),keys=new Set();
let gl,program,locations={},roads,lines,ball,scenery,obstacles={};
let doc,world,runner,loading=0,paused=false,accum=0,last=0,fps=0,frames=0,fpsAt=0,left=false,right=false;
let previousPose=null,currentPose=null,cameraState=null,comparisonMode='stable',frameSkips=0,headingError=0;
const add=(a,b)=>a.map((x,i)=>x+b[i]),sub=(a,b)=>a.map((x,i)=>x-b[i]),mul=(a,k)=>a.map(x=>x*k),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],norm=a=>mul(a,1/(Math.hypot(...a)||1));
const push=(v,p,c)=>v.push(p[0],p[1],p[2],c[0],c[1],c[2]);
function tri(v,a,b,c,col){push(v,a,col);push(v,b,col);push(v,c,col);}
function box(color){
 const v=[],p=[[-.5,-.5,-.5],[-.5,-.5,.5],[-.5,.5,-.5],[-.5,.5,.5],[.5,-.5,-.5],[.5,-.5,.5],[.5,.5,-.5],[.5,.5,.5]];
 for(const [a,b,c,d] of [[0,4,6,2],[1,3,7,5],[0,1,5,4],[2,6,7,3],[0,2,3,1],[4,5,7,6]]){tri(v,p[a],p[b],p[c],color);tri(v,p[a],p[c],p[d],color);}
 return v;
}
function orb(){
 const v=[],rings=10,seg=14,c=[.18,1,.95],p=(a,b)=>[.65*Math.sin(a)*Math.cos(b),.65*Math.cos(a),.65*Math.sin(a)*Math.sin(b)];
 for(let i=0;i<rings;i++)for(let j=0;j<seg;j++){const a=Math.PI*i/rings,a2=Math.PI*(i+1)/rings,b=2*Math.PI*j/seg,b2=2*Math.PI*(j+1)/seg;const q=[p(a,b),p(a2,b),p(a2,b2),p(a,b2)];tri(v,q[0],q[1],q[2],c);tri(v,q[0],q[2],q[3],c);}
 return v;
}
function shader(type,source){
 const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);
 if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;
}
function mesh(v){
 const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(v),gl.STATIC_DRAW);
 return {buffer,count:v.length/6};
}
function discard(m){if(m?.buffer)gl.deleteBuffer(m.buffer);}
function init(){
 gl=canvas.getContext('webgl2',{antialias:true,alpha:false});
 if(!gl)throw Error('WebGL2が無効です。GPUまたはブラウザの設定をご確認ください。');
 const vertex=[
 '#version 300 es','precision highp float;',
 'layout(location=0) in vec3 p;layout(location=1) in vec3 color;',
 'uniform vec3 eye,camRight,camUp,camFront,translation,scale;uniform float yaw,aspect;',
 'out vec3 shade;',
 'void main(){vec3 d=p*scale;float c=cos(yaw),s=sin(yaw);',
 'vec3 w=vec3(c*d.x+s*d.z,d.y,-s*d.x+c*d.z)+translation-eye;',
 'float x=dot(w,camRight),y=dot(w,camUp),z=dot(w,camFront);',
 'gl_Position=vec4(1.35*x/aspect,1.35*y,1.00022*z-1.30014,z);shade=color;}'
 ].join('\n');
 const fragment=[
 '#version 300 es','precision highp float;in vec3 shade;out vec4 outColor;',
 'void main(){outColor=vec4(shade,1.0);}'
 ].join('\n');
 program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
 gl.useProgram(program);
 for(const name of ['eye','camRight','camUp','camFront','translation','scale','yaw','aspect'])locations[name]=gl.getUniformLocation(program,name);
 gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.CULL_FACE);gl.clearColor(.019,.041,.083,1);
 ball=mesh(orb());
 obstacles={
  fail:mesh(box([1,.16,.23])),bounce:mesh(box([1,.78,.18])),push:mesh(box([.74,.28,1]))
 };
}
function buildVisual(stage){
 const vertex=[],wire=[];
 const base={'EP-001':[.3,.85,1],'HS-001':[.64,.53,1],'WV-001':[.33,.67,1],'HG-001':[.25,.98,.64]}[stage.stageForge.id]||[.35,.85,1];
 for(const s of stage.surfaces){
  if(s.visible===false)continue;
  const nu=Math.min(48,Math.max(7,(s.rows-1)*3)),nv=Math.min(12,Math.max(4,(s.cols-1)*2));
  const points=Array.from({length:nu+1},(_,i)=>Array.from({length:nv+1},(_,j)=>sample(s,i/nu,j/nv)));
  const color=mul(base,s.rideable?(s.material==='road'?.49:.62):.3);
  for(let i=0;i<nu;i++)for(let j=0;j<nv;j++){const a=points[i][j],b=points[i+1][j],c=points[i+1][j+1],d=points[i][j+1];tri(vertex,a,b,c,color);tri(vertex,a,c,d,color);}
  if(s.rideable)for(const j of [0,nv])for(let i=0;i<nu;i++){push(wire,points[i][j],[.22,.95,1]);push(wire,points[i+1][j],[.22,.95,1]);}
 }
 for(const f of stage.fixtures??[]){
  const color=f.kind==='danger'?[1,.19,.27]:f.kind==='reward'?[1,.86,.28]:[.4,.52,.67];
  for(const t of fixtureTriangles(f))tri(vertex,t[0],t[1],t[2],color);
 }
 for(let i=0;i<stage.route.length-1;i+=2){push(wire,add(stage.route[i],[0,.3,0]),[.11,.72,.64]);push(wire,add(stage.route[i+1],[0,.3,0]),[.11,.72,.64]);}
 discard(roads);discard(lines);discard(scenery);roads=mesh(vertex);lines=mesh(wire);const epic=epicGeometry(stage);scenery=epic.length?mesh(epic):null;
}
function draw(m,center=[0,0,0],size=[1,1,1],angle=0,primitive=gl.TRIANGLES){
 if(!m||!m.count)return;
 gl.uniform3fv(locations.translation,center);gl.uniform3fv(locations.scale,size);gl.uniform1f(locations.yaw,angle);
 gl.bindBuffer(gl.ARRAY_BUFFER,m.buffer);gl.enableVertexAttribArray(0);gl.enableVertexAttribArray(1);
 gl.vertexAttribPointer(0,3,gl.FLOAT,false,24,0);gl.vertexAttribPointer(1,3,gl.FLOAT,false,24,12);
 gl.drawArrays(primitive,0,m.count);
}
function render(frameSeconds){
 if(!gl)return;
 const pixelRatio=Math.min(2,window.devicePixelRatio||1),w=Math.floor(canvas.clientWidth*pixelRatio),h=Math.floor(canvas.clientHeight*pixelRatio);
 if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}if(!w||!h)return;
 gl.viewport(0,0,w,h);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
 if(!runner)return;
 // Render-time interpolation leaves native B48 physics untouched.
 const active=!paused&&runner.status==='running';
 const pose=resolveDisplayPose(previousPose,currentPose,accum,DT,active);
 cameraState=comparisonMode==='stable'
  ?advanceCamera(cameraState,pose.forward,active?frameSeconds:0)
  :createCameraState(pose.forward);
 headingError=cameraYawErrorRadians(cameraState,pose.forward);
 const view=viewForPose(pose,cameraState);
 gl.uniform3fv(locations.eye,view.eye);gl.uniform3fv(locations.camFront,view.front);gl.uniform3fv(locations.camRight,view.right);gl.uniform3fv(locations.camUp,view.up);
 canvas.dataset.cameraMode=comparisonMode==='stable'?'ball-lock-interpolated':'ball-lock-unfiltered-heading';
 canvas.dataset.cameraHeadingLagDegrees=(headingError*180/Math.PI).toFixed(2);
 gl.uniform1f(locations.aspect,w/h);
 draw(scenery);draw(roads);draw(lines,[0,0,0],[1,1,1],0,gl.LINES);
 for(const o of doc.movingObstacles){
  if(!o.enabled)continue;
  const obstaclePose=movingObstaclePose(o,pose.time);
  draw(obstacles[o.collision?.mode||'fail'],obstaclePose.center,obstaclePose.halfSize.map(x=>2*x),obstaclePose.yawRadians);
 }
 draw(ball,pose.position);
}
function restart(){
 if(!doc||!world)return;
 const spawn=Math.min(doc.spawns.length-1,Math.max(0,Number($('spawn').value)||0));
 runner=new Runner(doc,world,spawn,44);runner.assist=true;accum=0;paused=false;
 previousPose=currentPose=capturePose(runner);cameraState=createCameraState(currentPose.forward);frameSkips=0;headingError=0;
 $('pause').textContent='一時停止 (Space)';
 delete status.dataset.failed;
 status.className='status';status.textContent=doc.stageForge?.id==='EP-P66'?'P71 CAMERA EXPERIMENTAL — camera A/B and low-FPS telemetry enabled; course/physics are P69, native physical improvements await separate physics review.':'3D ready · B48 240Hz / B51-C moving collision · 実走行での楽しさは未認定';
}
async function load(){
 const seq=++loading,id=$('stage').value;
 runner=null;previousPose=null;currentPose=null;cameraState=null;doc=null;world=null;status.className='status';status.textContent='JSON取得・衝突BVH構築中...';
 try{
  const response=await fetch('../generated/'+assets[id],{cache:'no-store'});
  if(!response.ok)throw Error('Stage JSON HTTP '+response.status);
  const value=await response.json();
  if(seq!==loading)return;
  if(value.schema!=='dopagaki.track-director/1'||!Array.isArray(value.spawns))throw Error('Stage schema mismatch');
  await new Promise(resolve=>requestAnimationFrame(resolve));
  const compiled=compile(value);
  if(seq!==loading)return;
  buildVisual(value);doc=value;world=compiled;
  $('spawn').replaceChildren();
  value.spawns.forEach((s,i)=>{const option=document.createElement('option');option.value=String(i);option.textContent=s.name||'開始地点 '+(i+1);$('spawn').append(option);});
  restart();
 }catch(e){
  if(seq!==loading)return;
  status.className='status alert';status.textContent='3D load error: '+e.message;console.error(e);
 }
}
function updateChapterHUD(){
 const el=$('chapterHud');if(!el)return;
 if(doc?.stageForge?.id!=='EP-P66'){el.textContent='P62 / ORIGINAL STAGE';return;}
 const id=runner.surface||runner.lastSurface||'';
 const x=runner.p[0];
 let name='RESONANCE CATHEDRAL',hint='巨大共鳴管・高速3D走行';
 if(id.includes('SPIRAL_CATHEDRAL')){name='450° SPIRAL DESCENT';hint=id.endsWith('-06')?'螺旋出口！前方の広い接続路で左へ強く操舵':'大空洞を旋回 / バンクの傾斜を利用';}
 else if(id.includes('FORK_APPROACH')){name='CHOOSE YOUR SKYLINE';hint='左へしっかり寄せながら立体分岐へ / 道幅が変化';}
 else if(id.includes('FORK_L')){name='BELL VAULT';hint='外周の低層分岐';}
 else if(id.includes('FORK_R')){name='ORGAN SKYBRIDGE';hint='高層の空中分岐';}
 else if(id.includes('MACHINE_CHAMBER')){name='MACHINE GAUNTLET';hint='動体を回避 / 中央固定は危険';}
 else if(id.includes('GAP_TAKEOFF')){name='NATURAL LAUNCH';hint='坂で飛び出す / ジャンプボタンは不要';}
 else if(id.includes('GAP_LANDING')){name='TOUCHDOWN';hint='着地後のラインを整える';}
 else if(id.includes('FORK_REJOIN')){name='LEVEL CROSSING';hint='左右ルートが再合流';}
 else if(x>=1200&&!runner.grounded){name='AIRBORNE';hint='空中移動中 / 着地点を確認';}
 else if(id.includes('PIPE_DIVE')){name='PIPE BREACH';hint='巨大共鳴管へ突入';}
 const small=document.createElement('small');small.textContent=hint;
 el.replaceChildren(document.createTextNode(name),small);
}
function hud(){
 if(!runner)return;
 $('speed').textContent=Math.hypot(...runner.v).toFixed(1);
 $('simTime').textContent=runner.time.toFixed(2)+' s';$('contacts').textContent=String(runner.collisions);
 $('ground').textContent=runner.grounded?'接地':'空中';$('fps').textContent=String(Math.round(fps));
 updateChapterHUD();
 if(runner.status==='failed'&&!status.dataset.failed){
  status.className='status alert';status.textContent='試走終了: '+(runner.failure?.reason||'衝突')+'。Rで再スタート';
  status.dataset.failed='1';
 }
}
function tick(now){
 requestAnimationFrame(tick);
 if(!last)last=now;const elapsed=Math.min(.05,Math.max(0,(now-last)/1000));last=now;
 if(runner&&!paused&&runner.status!=='failed'&&runner.status!=='finished'){
  accum+=elapsed;let n=0;
  const steer=Number(right||keys.has('KeyD')||keys.has('ArrowRight'))-Number(left||keys.has('KeyA')||keys.has('ArrowLeft'));
  while(accum>=DT&&n<12){
   previousPose=currentPose;
   runner.step(steer);currentPose=capturePose(runner);
   accum-=DT;n++;if(runner.status==='failed'||runner.status==='finished')break;
  }
  if(n===12&&accum>=DT){frameSkips++;accum=Math.min(Math.max(0,accum),DT);}
 }
 frames++;
 if(now-fpsAt>=500){fps=frames*1000/Math.max(now-fpsAt,1);frames=0;fpsAt=now;hud();
  const lag=$('cameraInfo');if(lag)lag.textContent=comparisonMode==='stable'
   ?'方向補間：有効 / 角度差 '+(headingError*180/Math.PI).toFixed(1)+'°'+(frameSkips?' / 低FPS警告 '+frameSkips+'回':'')
   :'方向補間：OFF（比較用） / 物理は変更なし';
 }
 render(elapsed);
}
function bindHold(id,set){
 const b=$(id);b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);set(true);});
 for(const name of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(name,()=>set(false));
}
bindHold('left',v=>left=v);bindHold('right',v=>right=v);
$('cameraCompare').addEventListener('click',()=>{
 comparisonMode=comparisonMode==='stable'?'raw':'stable';
 $('cameraCompare').textContent=comparisonMode==='stable'?'カメラ比較：安定':'カメラ比較：生の方向';
 $('cameraCompare').setAttribute('aria-pressed',String(comparisonMode==='raw'));
 // Switching between visualizations is deliberately instantaneous and does not modify Runner.
 if(currentPose)cameraState=createCameraState(currentPose.forward);
});
function toggle(){paused=!paused;$('pause').textContent=paused?'再開 (Space)':'一時停止 (Space)';}
window.addEventListener('keydown',e=>{
 if(['KeyA','KeyD','ArrowLeft','ArrowRight','KeyR','Space'].includes(e.code)&&!['SELECT','INPUT'].includes(document.activeElement?.tagName)){
  e.preventDefault();keys.add(e.code);
  if(!e.repeat&&e.code==='KeyR')restart();
  if(!e.repeat&&e.code==='Space')toggle();
 }
});
window.addEventListener('keyup',e=>keys.delete(e.code));
window.addEventListener('blur',()=>{keys.clear();left=false;right=false;});
$('stage').addEventListener('change',load);$('spawn').addEventListener('change',restart);
$('restart').addEventListener('click',restart);$('pause').addEventListener('click',toggle);
try{init();requestAnimationFrame(tick);load();}
catch(e){status.className='status alert';status.textContent='WebGL2 unsupported: '+e.message;console.error(e);}

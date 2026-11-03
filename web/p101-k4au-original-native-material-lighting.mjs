/**
 * K4AU / SOURCE MATERIAL LIGHT, research-only ART HOLD.
 * Original physical B48 mesh (xyz/rgb) and actual animated B51 pose are
 * used unchanged. Only a new opt-in GPU program shades their true surfaces.
 * No fabricated geometry, physics, collision, time or camera modification.
 */
export const K4AU_CONTRACT=Object.freeze({
 sourceBlob:'af076d67492a677d2235e4730aef8cdf4808e106',
 nativeHz:240,sourceB48:7,sourceB51:28,originalCamera:true,
 geometryChanged:false,collidersAdded:0,hazardStatusColorPreserved:true,
 rendering:'PROCEDURAL_FRAGMENT_LIGHT_NOT_TRUE_RAYTRACING_PBR',
 formalArtAccepted:0,slope2DNAMetres:0,
 ART:'NOT_TESTED_HOLD',HUMAN:'HOLD',SAT:'HOLD',CCD:'HOLD',
 FPS:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'
});
const VS=[
 "#version 300 es",
 "precision highp float;",
 "layout(location=7) in vec3 p;layout(location=8) in vec3 color;",
 "uniform vec3 cameraEye,camRight,camUp,camFront,translation,modelScale;",
 "uniform float yaw,aspect,fogStart,fogSpan,fogStrength;",
 "out vec3 vRGB,vWorld,vLocal;out float vHaze;",
 "void main(){",
 "vec3 d=p*modelScale;float c=cos(yaw),s=sin(yaw);",
 "vec3 world=vec3(c*d.x+s*d.z,d.y,-s*d.x+c*d.z)+translation;",
 "vec3 delta=world-cameraEye;",
 "float x=dot(delta,camRight),y=dot(delta,camUp),z=dot(delta,camFront);",
 "gl_Position=vec4(1.35*x/aspect,1.35*y,1.00022*z-1.30014,z);",
 "vRGB=color;vWorld=world;vLocal=p;",
 "vHaze=clamp((length(delta)-fogStart)/max(5.0,fogSpan),0.0,.84)*fogStrength;",
 "}"
].join('\n');
const FS=[
 "#version 300 es",
 "precision highp float;",
 "in vec3 vRGB,vWorld,vLocal;in float vHaze;",
 "uniform vec3 cameraEye;uniform int objectType,hazardMode;",
 "out vec4 frag;",
 "float hash21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}",
 "vec3 faceNormal(){vec3 n=normalize(cross(dFdx(vWorld),dFdy(vWorld)));",
 "if(n.y<0.0&&objectType==0)n=-n;",
 "if(length(n)<.15)n=vec3(0.0,1.0,0.0);return n;}",
 "void main(){",
 "vec3 n=faceNormal();",
 "vec3 sun=normalize(vec3(-.43,.89,.31));vec3 fill=normalize(vec3(.55,.32,-.68));",
 "vec3 eye=normalize(cameraEye-vWorld);",
 "float direct=max(dot(n,sun),0.0),bounce=max(dot(n,fill),0.0);",
 "float light=.33+.52*direct+.16*bounce;",
 "float shine=pow(max(dot(n,normalize(sun+eye)),0.0),30.0);",
 "vec3 rgb;",
 "if(objectType==0){",
 "bool danger=(vRGB.r>.88&&vRGB.g<.34&&vRGB.b<.55);",
 "bool reward=(vRGB.r>.87&&vRGB.g>.68&&vRGB.b<.4);",
 "bool signal=(vRGB.r>.8&&vRGB.g>.65&&vRGB.b>.45);",
 "float grit=(hash21(floor(vWorld.xz*1.71))-.5)*.09",
 " +(hash21(floor(vWorld.xz*6.83)+24.6)-.5)*.035;",
 "float seam=min(abs(fract(vWorld.x*.076)-.5),abs(fract(vWorld.z*.052)-.5));",
 "float joint=1.0-.06*smoothstep(.485,.499,.5-seam);",
 "vec3 asphalt=vec3(.30,.37,.395)*clamp(light+grit,.23,.98)*joint;",
 "rgb=mix(asphalt,vRGB*light,.29);",
 "if(danger||reward||signal)rgb=vRGB*(.74+.22*direct);",
 "else rgb+=vec3(.27,.35,.36)*shine*.18;",
 "}else{",
 "float brushed=(hash21(floor(vLocal.xz*72.0)+17.0)-.5)*.045;",
 "float flank=(hash21(floor(vLocal.xy*29.0)-13.0)-.5)*.022;",
 "float l=clamp(light+brushed+flank,.28,1.05);",
 "vec3 steel=vec3(.20,.245,.272)*l;",
 "rgb=mix(steel,vRGB*l,.73)+vec3(.33,.38,.40)*shine*.28;",
 "float lines=abs(fract((vLocal.x+vLocal.y*.13)*8.0)-.5);",
 "rgb*=1.0-.10*smoothstep(.481,.498,lines);",
 "vec3 warning=hazardMode==0?vec3(.94,.18,.24):",
 "hazardMode==1?vec3(.95,.69,.19):vec3(.66,.46,.93);",
 "float cue=hazardMode==0?max(vRGB.r-max(vRGB.g,vRGB.b)*.7,0.0):",
 "hazardMode==1?max(vRGB.r-.44,0.0):max(vRGB.b-.37,0.0);",
 "rgb+=warning*clamp(cue*.17,0.0,.14);",
 "}",
 "rgb=mix(rgb,vec3(.080,.119,.148),vHaze*.78);",
 "rgb=rgb/(rgb+vec3(.27));",
 "frag=vec4(clamp(rgb,0.0,1.0),1.0);",
 "}"
].join('\n');
function compile(gl,type,source){
 const sh=gl.createShader(type);
 gl.shaderSource(sh,source);gl.compileShader(sh);
 if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))
  throw Error('K4AU REAL GPU GLSL '+gl.getShaderInfoLog(sh));
 return sh;
}
export function createK4AULight(gl){
 if(!gl||typeof gl.createProgram!=='function')throw Error('K4AU WEBGL2 REQUIRED');
 const vs=compile(gl,gl.VERTEX_SHADER,VS),fs=compile(gl,gl.FRAGMENT_SHADER,FS);
 const program=gl.createProgram();
 gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
 gl.deleteShader(vs);gl.deleteShader(fs);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS))
  throw Error('K4AU PROGRAM '+gl.getProgramInfoLog(program));
 const uni={};
 for(const name of ['cameraEye','camRight','camUp','camFront','translation',
   'modelScale','yaw','aspect','fogStart','fogSpan','fogStrength','objectType','hazardMode']){
  uni[name]=gl.getUniformLocation(program,name);
  if(uni[name]===null)throw Error('K4AU MISSING TRUE GPU UNIFORM '+name);
 }
 return {program,uni,shaderKind:'ORIGINAL_SOURCE_PROCEDURAL_SHADED',ART:'NOT_TESTED_HOLD'};
}
function shade(gl,scene,mesh,view,aspect,type,pose,mode,fog){
 if(!scene?.program||!mesh?.buffer||mesh.count<=0||!view||
  !Number.isFinite(aspect)||aspect<=0)throw Error('K4AU MISSING REAL NATIVE SOURCE');
 if(![view.eye,view.right,view.up,view.front].every(v=>
     Array.isArray(v)&&v.length===3&&v.every(Number.isFinite)))
   throw Error('K4AU INVALID ORIGINAL CAMERA');
 if(type===1&&(!pose?.center?.every(Number.isFinite)||
   !pose?.halfSize?.every(v=>Number.isFinite(v)&&v>0)||
   !Number.isFinite(pose.yawRadians)))
  throw Error('K4AU REQUIRES TRUE ORIGINAL B51 POSE');
 const prev=gl.getParameter(gl.CURRENT_PROGRAM),oldBuf=gl.getParameter(gl.ARRAY_BUFFER_BINDING);
 gl.useProgram(scene.program);const u=scene.uni;
 for(const [n,v] of [['cameraEye',view.eye],['camRight',view.right],
   ['camUp',view.up],['camFront',view.front]])gl.uniform3fv(u[n],v);
 gl.uniform1f(u.aspect,aspect);
 gl.uniform1f(u.fogStart,fog?.start??120);
 gl.uniform1f(u.fogSpan,fog?.span??880);
 gl.uniform1f(u.fogStrength,fog?.enabled?1:0);
 gl.uniform1i(u.objectType,type);gl.uniform1i(u.hazardMode,mode);
 gl.uniform3fv(u.translation,type?pose.center:[0,0,0]);
 gl.uniform3fv(u.modelScale,type?pose.halfSize.map(x=>2*x):[1,1,1]);
 gl.uniform1f(u.yaw,type?pose.yawRadians:0);
 gl.bindBuffer(gl.ARRAY_BUFFER,mesh.buffer);
 for(const a of [7,8])gl.enableVertexAttribArray(a);
 gl.vertexAttribPointer(7,3,gl.FLOAT,false,24,0);
 gl.vertexAttribPointer(8,3,gl.FLOAT,false,24,12);
 gl.drawArrays(gl.TRIANGLES,0,mesh.count);
 for(const a of [7,8])gl.disableVertexAttribArray(a);
 gl.bindBuffer(gl.ARRAY_BUFFER,oldBuf);gl.useProgram(prev);
}
export function renderK4AULitRoad(gl,scene,mesh,view,aspect,fog={}){
 shade(gl,scene,mesh,view,aspect,0,null,0,fog);
}
const modes=Object.freeze({fail:0,bounce:1,push:2});
export function renderK4AULitB51(gl,scene,mesh,view,aspect,pose,mode,fog={}){
 if(!Object.hasOwn(modes,mode))throw Error('K4AU BAD ORIGINAL B51 TYPE');
 shade(gl,scene,mesh,view,aspect,1,pose,modes[mode],fog);
}
export function releaseK4AULight(gl,scene){
 if(scene?.program)gl.deleteProgram(scene.program);
}

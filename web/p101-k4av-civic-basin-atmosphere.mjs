/**
 * K4AV visual-only coherent atmosphere behind the real 240Hz game.
 * Fullscreen shader on source WebGL2 context. Does not read/modify physics.
 * Daylight city-basin art direction (cloud, aerial perspective, warm horizon).
 * This is an illustration of atmosphere, not a physical sky simulation.
 */
export const K4AV_SKY=Object.freeze({
 schema:'dopagaki.K4AV.source-camera-aerial-civic-basin-sky/1',
 originalSourceChanged:false,sourceCameraChanged:false,
 ART:'NOT_TESTED_HOLD',RELEASE:'HOLD'
});
const VS=[
 "#version 300 es",
 "precision highp float;",
 "out vec2 uv;",
 "void main(){",
 "vec2 p=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2));",
 "uv=p;gl_Position=vec4(p*2.0-1.0,0.9999,1.0);",
 "}"
].join('\n');
const FS=[
 "#version 300 es",
 "precision highp float;",
 "in vec2 uv;out vec4 color;",
 "uniform float aspect,cameraPitch;",
 "float hash(vec2 a){return fract(sin(dot(a,vec2(127.1,311.7)))*43758.5453);}",
 "float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);",
 "return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),",
 "mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x),f.y);}",
 "float fbm(vec2 p){float f=0.0,a=.5;for(int j=0;j<5;j++){",
 "f+=a*noise(p);p=p*2.03+vec2(17.4,3.8);a*=.51;}return f;}",
 "void main(){",
 "vec2 st=uv;",
 "float horizon=clamp(.43-cameraPitch*.30,.32,.64);",
 "float altitude=clamp((st.y-horizon)/max(.25,1.0-horizon),0.0,1.0);",
 // light sky gradient: navy/steel/peach skyline, not synthetic fluorescent strips.
 "vec3 low=vec3(.79,.65,.52);",
 "vec3 middle=vec3(.32,.46,.55);",
 "vec3 high=vec3(.057,.123,.195);",
 "vec3 sky=mix(low,middle,smoothstep(0.0,.53,altitude));",
 "sky=mix(sky,high,smoothstep(.38,1.0,altitude));",
 // global light direction just above horizon, stable across frames.
 "float sx=st.x*2.0-1.0;",
 "float sun=exp(-pow((sx-.26)*2.75,2.0)-pow((st.y-horizon-.24)*5.0,2.0));",
 "sky+=vec3(.16,.115,.052)*sun;",
 "float cloudBand=smoothstep(.10,.30,altitude)*(1.0-smoothstep(.73,.99,altitude));",
 "vec2 wind=vec2(st.x*5.8*aspect,altitude*5.2);",
 "float clouds=fbm(wind+vec2(3.7,18.4));",
 "float cloud=pow(smoothstep(.44,.78,clouds),1.7)*cloudBand;",
 "sky=mix(sky,vec3(.70,.69,.64),cloud*.42);",
 // Far city-basin haze: a horizon LAYER, not giant black void.
 "float haze=1.0-smoothstep(.0,.22,abs(st.y-horizon));",
 "sky=mix(sky,vec3(.78,.67,.58),haze*.17);",
 "sky=max(sky,vec3(.028,.055,.085));",
 "color=vec4(sky,1.0);",
 "}"
].join('\n');
function compile(gl,type,src){
 const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);
 if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))
  throw Error('K4AV_ATMOSPHERE_REAL_WEBGL2 '+gl.getShaderInfoLog(s));
 return s;
}
export function createK4AVAtmosphere(gl){
 if(!gl||!gl.createProgram)throw Error('K4AV REAL WEBGL2 REQUIRED');
 const v=compile(gl,gl.VERTEX_SHADER,VS),f=compile(gl,gl.FRAGMENT_SHADER,FS);
 const program=gl.createProgram();
 gl.attachShader(program,v);gl.attachShader(program,f);gl.linkProgram(program);
 gl.deleteShader(v);gl.deleteShader(f);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS))
  throw Error('K4AV SKY LINK '+gl.getProgramInfoLog(program));
 const aspect=gl.getUniformLocation(program,'aspect');
 const cameraPitch=gl.getUniformLocation(program,'cameraPitch');
 if(aspect===null||cameraPitch===null)throw Error('K4AV ATMOSPHERE UNIFORM MISSING');
 return {program,aspect,cameraPitch,ART:'NOT_TESTED_HOLD'};
}
export function renderK4AVAtmosphere(gl,scene,view,aspect){
 if(!scene?.program||!view?.front?.every(Number.isFinite)||
    !Number.isFinite(aspect)||aspect<=0)
  throw Error('K4AV SOURCE CAMERA ATMOSPHERE INVALID');
 const previous=gl.getParameter(gl.CURRENT_PROGRAM);
 const depth=gl.isEnabled(gl.DEPTH_TEST);
 const mask=gl.getParameter(gl.DEPTH_WRITEMASK);
 gl.depthMask(false);gl.disable(gl.DEPTH_TEST);
 gl.useProgram(scene.program);
 gl.uniform1f(scene.aspect,aspect);
 gl.uniform1f(scene.cameraPitch,view.front[1]);
 gl.drawArrays(gl.TRIANGLES,0,3);
 gl.depthMask(mask);
 if(depth)gl.enable(gl.DEPTH_TEST);
 gl.useProgram(previous);
}
export function releaseK4AVAtmosphere(gl,scene){
 if(scene?.program)gl.deleteProgram(scene.program);
}

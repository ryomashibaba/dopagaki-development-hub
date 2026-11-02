/** K4AC GPU-free safety regression for the *actual* private WebGL2 depth probe.
 * These are mock GL calls, never original source frames nor native GPU evidence.
 * Runtime WebGL2 and K4Z PNG gates remain mandatory and separate.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';

const path='scripts/p101-r19a6p4r2f5k4ac-native-depth-probe.mjs';
const source=fs.readFileSync(path,'utf8');
const first='return page.evaluate(()=>{',last='\n });\n}';
const start=source.indexOf(first),end=source.indexOf(last,start);
assert.ok(start>=0&&end>start,'original depth probe extraction must remain valid');
assert.equal(source.indexOf(first,start+first.length),-1,'single depth probe only');
const body=source.slice(start+first.length,end);
const fn=new Function('document','WebGL2RenderingContext',
 'return (()=>{'+body+'})();');

class WebGL2RenderingContext{}
class FakeGL extends WebGL2RenderingContext{
 constructor(mode,activeZero=false){
  super();this.mode=mode;
  const names='DEPTH_BITS STENCIL_BITS ACTIVE_TEXTURE TEXTURE_BINDING_2D READ_FRAMEBUFFER_BINDING DRAW_FRAMEBUFFER_BINDING PACK_ALIGNMENT TEXTURE0 TEXTURE_2D TEXTURE_MIN_FILTER TEXTURE_MAG_FILTER TEXTURE_WRAP_S TEXTURE_WRAP_T NEAREST CLAMP_TO_EDGE DEPTH_COMPONENT24 DEPTH_COMPONENT16 DEPTH24_STENCIL8 DEPTH_COMPONENT DEPTH_STENCIL UNSIGNED_INT UNSIGNED_SHORT UNSIGNED_INT_24_8 FRAMEBUFFER READ_FRAMEBUFFER DRAW_FRAMEBUFFER DEPTH_ATTACHMENT DEPTH_STENCIL_ATTACHMENT NONE FRAMEBUFFER_COMPLETE DEPTH_BUFFER_BIT'.split(' ');
  names.forEach((n,i)=>this[n]=i+1);this.NO_ERROR=0;
  this.drawingBufferWidth=128;this.drawingBufferHeight=128;
  this.unit=this.TEXTURE0+(activeZero?0:1);
  this.tex=new Map([[this.TEXTURE0,{id:'existing0'}],[this.TEXTURE0+1,{id:'existing1'}]]);
  this.read={id:'originalRead'};this.draw={id:'originalDraw'};
  this.pack=8;this.err=0;this.invalidDefaultReadBufferCalls=0;
 }
 getParameter(p){
  const values=new Map([[this.DEPTH_BITS,this.mode==='no_depth'?0:24],
   [this.STENCIL_BITS,8],[this.ACTIVE_TEXTURE,this.unit],
   [this.TEXTURE_BINDING_2D,this.tex.get(this.unit)],
   [this.READ_FRAMEBUFFER_BINDING,this.read],
   [this.DRAW_FRAMEBUFFER_BINDING,this.draw],
   [this.PACK_ALIGNMENT,this.pack]]);
  return values.get(p);
 }
 activeTexture(v){this.unit=v}
 bindTexture(t,v){this.tex.set(this.unit,v)}
 createTexture(){return {id:'temporaryTexture'}}
 createFramebuffer(){return {id:'temporaryFramebuffer'}}
 texParameteri(){}texImage2D(){}framebufferTexture2D(){}drawBuffers(){}
 bindFramebuffer(t,v){
  if(t===this.FRAMEBUFFER){this.read=v;this.draw=v}
  else if(t===this.READ_FRAMEBUFFER)this.read=v;
  else if(t===this.DRAW_FRAMEBUFFER)this.draw=v;
 }
 readBuffer(){
  if(this.read===null)this.invalidDefaultReadBufferCalls++;
 }
 checkFramebufferStatus(){
  return this.mode==='incomplete'?0:this.FRAMEBUFFER_COMPLETE;
 }
 getError(){const e=this.err;this.err=0;return e}
 blitFramebuffer(){if(this.mode==='blit_error')this.err=0x502}
 readPixels(x,y,w,h,format,type,buffer){
  if(this.mode==='read_error'){this.err=0x502;return}
  for(let i=0;i<buffer.length;i++)buffer[i]=(i%3)?20000:10000;
 }
 pixelStorei(t,v){if(t===this.PACK_ALIGNMENT)this.pack=v}
 deleteFramebuffer(){}deleteTexture(){}
}
const results=[];
for(const [mode,activeZero] of [
 ['good',false],['good',true],['blit_error',false],
 ['read_error',false],['incomplete',false],['no_depth',false]
]){
 const gl=new FakeGL(mode,activeZero);
 const prior={read:gl.read,draw:gl.draw,unit:gl.unit,
  tex0:gl.tex.get(gl.TEXTURE0),tex1:gl.tex.get(gl.TEXTURE0+1),pack:gl.pack};
 const got=fn({querySelector:()=>({getContext:()=>gl})},WebGL2RenderingContext);
 assert.equal(got.available,mode==='good',mode);
 assert.equal(gl.read,prior.read,mode+' READ framebuffer leaked');
 assert.equal(gl.draw,prior.draw,mode+' DRAW framebuffer leaked');
 assert.equal(gl.unit,prior.unit,mode+' active texture leaked');
 assert.equal(gl.tex.get(gl.TEXTURE0),prior.tex0,mode+' TEXTURE0 binding leaked');
 assert.equal(gl.tex.get(gl.TEXTURE0+1),prior.tex1,mode+' second-unit binding leaked');
 assert.equal(gl.pack,prior.pack,mode+' pack alignment leaked');
 assert.equal(gl.invalidDefaultReadBufferCalls,0,mode+' altered default framebuffer');
 if(mode==='good')assert.equal(got.samples.length,256);
 else assert.ok(got.reason,'HOLD condition needs a diagnostic reason');
 results.push({mode,activeZero,available:got.available,
  reason:got.reason??null,originalWebGLStatePreserved:true});
}
assert.equal(results.length,6);
console.log('K4AC_FAKE_GL_READBACK_SAFETY_6_OF_6_PASS');
console.log(JSON.stringify(results));
console.log('REAL_NATIVE_GPU_DEPTH_NOT_TESTED__ART_HOLD');

import test from 'node:test';
import assert from 'node:assert/strict';
import {createRenderQuality,sampleRenderQuality,framebufferDimensions,renderScaleLabel} from '../web/p83-render-quality.mjs';
import {generateEchoRush} from '../scripts/p66-echo-rebuild.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner} from '../private/reference_only/director/physics.js';

test('P83 fixed presets adjust only framebuffer raster pixels, never CSS dimensions',()=>{
 const expectations={quality:1,balanced:.8,performance:.6};
 for(const [mode,scale] of Object.entries(expectations)){
  const state=createRenderQuality(mode),dim=framebufferDimensions(1000,500,2,state);
  assert.equal(state.scale,scale);
  assert.equal(dim.width,Math.floor(2000*scale));
  assert.equal(dim.height,Math.floor(1000*scale));
  assert.equal(sampleRenderQuality(state,10).scale,scale,'fixed mode cannot self-change');
  assert(dim.width>0&&dim.height>0);
 }
 assert.equal(framebufferDimensions(0,0,0,createRenderQuality('auto')).width,1);
 assert.throws(()=>createRenderQuality('turbo'),/Unknown/);
});
test('P83 AUTO slowly lowers raster work at sustained low fps, quickly never flaps at threshold',()=>{
 let state=createRenderQuality('auto');
 for(let i=0;i<3;i++)state=sampleRenderQuality(state,25);
 assert.equal(state.scale,1);
 state=sampleRenderQuality(state,25);
 assert.equal(state.scale,.85);
 for(let i=0;i<12;i++)state=sampleRenderQuality(state,22);
 assert.equal(state.scale,.55);
 const minimum=state.scale;
 for(let i=0;i<7;i++)state=sampleRenderQuality(state,56);
 assert.equal(state.scale,minimum);
 for(let i=0;i<15;i++)state=sampleRenderQuality(state,60);
 assert.equal(state.scale,minimum);
 state=sampleRenderQuality(state,60);
 assert.equal(state.scale,.7,'recovery requires 16 high-fps half-second samples');
 assert(state.changes>=4);
 assert(renderScaleLabel(state).includes('70%'));
});
test('P83 FPS sampling is ignored for invalid reports, hidden tabs and non-auto presets',()=>{
 let auto=createRenderQuality('auto');
 for(let i=0;i<5;i++)auto=sampleRenderQuality(auto,12,{active:false});
 assert.equal(auto.scale,1);
 for(const fps of [0,-5,Infinity,NaN,300])auto=sampleRenderQuality(auto,fps);
 assert.equal(auto.scale,1);
 const fixed=createRenderQuality('performance');
 for(let i=0;i<100;i++)assert.equal(sampleRenderQuality(fixed,17).scale,.6);
});
test('P83 adaptive visual settings do not affect real original B48 Runner state or trajectory',()=>{
 const doc=generateEchoRush(),world=compile(doc);
 const a=new Runner(doc,world,0,44),b=new Runner(doc,world,0,44);
 let quality=createRenderQuality('auto');
 for(let i=0;i<720;i++){
  a.step(0);b.step(0);
  if(i%30===0)quality=sampleRenderQuality(quality,i<360?24:60);
  const d=framebufferDimensions(1200,700,2,quality);
  assert(d.width<=2400&&d.height<=1400);
 }
 assert.deepEqual(b.p,a.p);
 assert.deepEqual(b.v,a.v);
 assert.deepEqual(b.events,a.events);
 assert.equal(b.status,a.status);
 assert.equal(b.time,a.time);
});

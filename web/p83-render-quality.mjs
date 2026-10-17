/**
 * P83 — GPU raster resolution governor, completely independent of Runner.
 * FPS is an observation, not proof of a GPU bottleneck. Players can override.
 * Samples arrive once per 0.5s after live frames have actually rendered.
 */
export const RENDER_MODES=Object.freeze(['auto','quality','balanced','performance']);
export const SCALE_BY_MODE=Object.freeze({quality:1,balanced:.8,performance:.6});
export const MIN_AUTO_SCALE=.55;
export const LOW_FPS_THRESHOLD=42;
export const HIGH_FPS_THRESHOLD=57;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const roundScale=n=>Math.round(n*100)/100;
export function createRenderQuality(mode='auto'){
 if(!RENDER_MODES.includes(mode))throw Error('Unknown render quality mode');
 return {mode,scale:mode==='auto'?1:SCALE_BY_MODE[mode],slow:0,fast:0,changes:0};
}
export function sampleRenderQuality(state,fps,{active=true}={}){
 if(!state||!RENDER_MODES.includes(state.mode))throw Error('Invalid render quality state');
 if(state.mode!=='auto'||!active||!(fps>=1&&fps<=180))return {...state,slow:0,fast:0};
 let slow=fps<LOW_FPS_THRESHOLD?state.slow+1:0;
 let fast=fps>=HIGH_FPS_THRESHOLD?state.fast+1:0;
 let scale=state.scale,changes=state.changes;
 if(slow>=4){scale=roundScale(clamp(scale-.15,MIN_AUTO_SCALE,1));slow=0;fast=0;if(scale!==state.scale)changes++;}
 if(fast>=16){scale=roundScale(clamp(scale+.15,MIN_AUTO_SCALE,1));slow=0;fast=0;if(scale!==state.scale)changes++;}
 return {...state,scale,slow,fast,changes};
}
export function framebufferDimensions(clientWidth,clientHeight,dpr,quality){
 if(!quality||!(quality.scale>0))throw Error('Invalid render scale');
 const ratio=clamp(Number.isFinite(dpr)?dpr:1,1,2)*quality.scale;
 const width=Math.max(1,Math.floor(Math.max(1,clientWidth)*ratio));
 const height=Math.max(1,Math.floor(Math.max(1,clientHeight)*ratio));
 return {width,height,ratio};
}
export function renderScaleLabel(quality){
 return (quality.mode==='auto'?'自動':'固定')+' · '+Math.round(quality.scale*100)+'% 解像度'+
  (quality.mode==='auto'&&quality.changes?' / 自動調整 '+quality.changes+'回':'');
}

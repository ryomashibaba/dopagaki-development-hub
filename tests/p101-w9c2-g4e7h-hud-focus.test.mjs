import test from 'node:test';
import assert from 'node:assert/strict';
import {unionRectArea,calculateG4E7HOcclusion,G4E7H_ROI,G4E7H_SELECTORS}
 from '../web/p101-w9c2-g4e7h-hud-focus.mjs';
test('G4E7H exact rectangle union does not double count overlapping alerts',()=>{
 assert.equal(unionRectArea([]),0);
 assert.equal(unionRectArea([{left:0,top:0,right:10,bottom:10}]),100);
 assert.equal(unionRectArea([{left:0,top:0,right:10,bottom:10},
  {left:5,top:5,right:15,bottom:15}]),175);
 assert.equal(unionRectArea([{left:0,top:0,right:10,bottom:10},
  {left:0,top:0,right:10,bottom:10}]),100);
 assert.throws(()=>unionRectArea([{left:3,right:1,top:0,bottom:5}]),/invalid rectangle/);
});
test('G4E7H viewport ROI computes visible occlusion but omits hidden elements',()=>{
 const view={left:0,top:0,right:1000,bottom:500};
 const wide=calculateG4E7HOcclusion(view,[
  {left:60,top:125,right:350,bottom:460,visible:true},
  {left:60,top:125,right:350,bottom:460,visible:false}],G4E7H_ROI);
 const clear=calculateG4E7HOcclusion(view,[],G4E7H_ROI);
 assert.equal(clear.percent,0);
 assert(wide.percent>0&&wide.percent<100);
 assert.equal(G4E7H_SELECTORS.length,6);
 assert.throws(()=>calculateG4E7HOcclusion(view,[],{left:0,top:0,right:1.5,bottom:1}),/Invalid ROI/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {projectCenterline,analyzeRoadFrame} from '../scripts/p101-w9c2-g4e7bb-vector-math.mjs';
const close=(a,b,epsilon=.00001)=>assert(Math.abs(a-b)<epsilon,a+' not approximately '+b);
test('BB true 3D projection identifies interpolated u and shortest distance',()=>{
 const line=[[0,0,0],[0,0,10],[0,0,20]];
 const p=projectCenterline(line,[3,4,15]);
 close(p.u,.75);close(p.distance3D,5);
});
test('BB height separation does not masquerade as physical support',()=>{
 const line=[[0,0,0],[0,0,10]];
 close(projectCenterline(line,[0,10,5]).distance3D,10);
});
test('BB actual width, heading, normal velocity and margin on straight 4x4 ribbon',()=>{
 const points=[];
 for(let i=0;i<4;i++)for(let j=0;j<4;j++)points.push([(j/3-.5)*14,0,i*10]);
 const surface={rows:4,cols:4,points};
 const s=analyzeRoadFrame(surface,.50,[0,.65,15],[0,0,100]);
 close(s.widthM,14,.01);close(s.lane,.5,.001);
 close(s.edgeMarginM,6.35,.01);close(s.signedHeadingErrorDeg,0,.01);
 close(s.lateralVelocityMps,0,.01);close(s.roadPitchDeg,0,.01);
 close(s.kinematicCurveAccelMps2,0,.01);
});
test('BB reports off-edge and lateral velocity without hiding unsigned sign',()=>{
 const points=[];for(let i=0;i<4;i++)for(let j=0;j<4;j++)points.push([(j/3-.5)*14,0,i*10]);
 const s=analyzeRoadFrame({rows:4,cols:4,points},.5,[-10,.65,15],[-4,0,100]);
 assert(s.lane<0);assert(s.edgeMarginM<0);assert(s.lateralVelocityMps<0);
});

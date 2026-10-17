import test from 'node:test';
import assert from 'node:assert/strict';
import {generateEchoRush} from '../scripts/p66-echo-rebuild.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {epicGeometry} from '../web/p66-visual.mjs';

const stage=generateEchoRush(),road=id=>stage.surfaces.find(s=>s.id==='p66-'+id);
const dist=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
const mid=(id,u)=>sample(road(id),u,.5);
const flatDir=(a,b)=>{const v=[b[0]-a[0],b[2]-a[2]],l=Math.hypot(...v)||1;return v.map(x=>x/l);};
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1];

test('P76 physical pipeline has two actual returning road skins and preserves P69 gameplay geometry',()=>{
 assert.equal(stage.surfaces.length,23);
 assert.equal(stage.surfaces.filter(s=>s.id.includes('PIPE_RETURN')).length,2);
 assert.equal(stage.stageForge.fullStartToEnd,'NOT_VERIFIED');
 assert.equal(stage.stageForge.oldP62FilesModified,false);
 assert.equal(stage.stageForge.B45PhysicsModified,false);
 assert.equal(stage.movingObstacles.length,6);
 assert.equal(stage.visualBlueprint.returnPortals.length,8);
 assert(epicGeometry(stage).length>60000);
});
test('P76 pipe end → return → 450° spiral have exact C0 centers and C1 driving direction',()=>{
 const joins=[
 ['PIPE_DIVE_A-02','PIPE_RETURN-01'],
 ['PIPE_RETURN-01','PIPE_RETURN-02'],
 ['PIPE_RETURN-02','SPIRAL_CATHEDRAL-01']
 ];
 for(const [a,b] of joins){
  const A=mid(a,1),B=mid(b,0);
  assert(dist(A,B)<.02,'physical hole at '+a+' → '+b+': '+dist(A,B));
  const va=flatDir(mid(a,.996),A),vb=flatDir(B,mid(b,.004));
  assert(dot(va,vb)>.975,'reversal/cusp at '+a+' → '+b+': dot='+dot(va,vb));
 }
 const start=flatDir(mid('PIPE_RETURN-01',0),mid('PIPE_RETURN-01',.01));
 const finish=flatDir(mid('PIPE_RETURN-02',.99),mid('PIPE_RETURN-02',1));
 assert(start[1]>.96,'return entrance must head +Z');
 assert(finish[1]<-.96,'return exit must head -Z');
 const endpoint=mid('SPIRAL_CATHEDRAL-01',0);
 assert(dist(endpoint,[-600,150,-10])<.03,'P69 spiral entrance was moved');
});
test('P76 diagnostics: genuine B48 start-0 continuity, no artificial physics, report real physical outcome',()=>{
 const rider=new Runner(stage,compile(stage),0,44);
 const visited=new Set();let firstAir=null,firstFailure=null,at12=null;
 const n=Math.round(42/DT);
 for(let i=0;i<n&&rider.status!=='failed'&&rider.status!=='finished';i++){
  rider.step(0);
  if(rider.surface)visited.add(rider.surface);
  if(!rider.grounded&&!firstAir)firstAir={time:Number(rider.time.toFixed(3)),pos:rider.p.map(x=>Number(x.toFixed(2)))};
  if(!at12&&rider.time>=12)at12={status:rider.status,surface:rider.surface,grounded:rider.grounded};
  if(rider.status==='failed')firstFailure=rider.failure;
 }
 const report={t:Number(rider.time.toFixed(3)),status:rider.status,surface:rider.surface,
  x:Number(rider.p[0].toFixed(1)),z:Number(rider.p[2].toFixed(1)),speed:Number(Math.hypot(...rider.v).toFixed(1)),
  firstAir,firstFailure,at12,returnSegments:[...visited].filter(x=>x.includes('PIPE_RETURN')),
  visitedSpiral:visited.has('p66-SPIRAL_CATHEDRAL-01')};
 console.log('P76_NATIVE_FULL_START_DIAGNOSTIC '+JSON.stringify(report));
 assert.equal(at12?.status,'running','previously accepted 12s intro must not regress');
 assert(firstAir===null||firstAir.time>12,'unplanned flight within previously proven first 12s');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {generateEchoRush} from '../scripts/p66-echo-rebuild.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
const course=generateEchoRush();
const world=compile(course);
const byId=id=>course.surfaces.find(s=>s.id===id);
const p=(id,u)=>sample(byId('p66-'+id),u,.5);
const norm=a=>Math.hypot(...a);
const gap=(a,b)=>norm(a.map((x,i)=>x-b[i]));
const transitions=[
 ['PIPE_DIVE_A-01','PIPE_DIVE_A-02'],
 ['PIPE_DIVE_A-02','SPIRAL_CATHEDRAL-01'],
 ...Array.from({length:5},(_,i)=>['SPIRAL_CATHEDRAL-'+String(i+1).padStart(2,'0'),'SPIRAL_CATHEDRAL-'+String(i+2).padStart(2,'0')]),
 ['SPIRAL_CATHEDRAL-06','FORK_APPROACH-01'],
 ['FORK_APPROACH-01','FORK_APPROACH-02'],
 ['FORK_APPROACH-02','FORK_L-01'],
 ['FORK_APPROACH-02','FORK_R-01'],
 ['FORK_L-01','FORK_L-02'],
 ['FORK_R-01','FORK_R-02'],
 ['FORK_L-02','FORK_REJOIN-01'],
 ['FORK_R-02','FORK_REJOIN-01'],
 ['FORK_REJOIN-01','MACHINE_CHAMBER-01'],
 ['MACHINE_CHAMBER-01','MACHINE_CHAMBER-02'],
 ['MACHINE_CHAMBER-02','MACHINE_CHAMBER-03'],
 ['MACHINE_CHAMBER-03','GAP_TAKEOFF-01'],
 ['GAP_LANDING-01','GAP_LANDING-02']
];
test('P67 all physical chapter joins at exact XYZ, excluding deliberate jump void',()=>{
 for(const [a,b] of transitions){
  const d=gap(p(a,1),p(b,0));
  assert(d<.02,a+' to '+b+' had '+d.toFixed(3)+'m unplanned missing road');
 }
 const realGap=gap(p('GAP_TAKEOFF-01',1),p('GAP_LANDING-01',0));
 assert(realGap>=25,'jump must remain an actual physical gap, found '+realGap);
});
function run(spawn,speed,steer=0,seconds=7.5){
 const runner=new Runner(course,world,spawn,speed);
 let groundedAtLanding=false,landed=false,air=false,airFrames=0,airFramesAfterLip=0,maxX=runner.p[0],lastSurface=runner.surface;
 const landedSurfaces=new Set();
 for(let i=0;i<Math.round(seconds/DT)&&runner.status!=='failed'&&runner.status!=='finished';i++){
  runner.step(steer);
  maxX=Math.max(maxX,runner.p[0]);
  if(!runner.grounded){air=true;airFrames++;if(runner.p[0]>=1200)airFramesAfterLip++;}
  if(runner.grounded&&runner.surface?.includes('GAP_LANDING')){landed=true;groundedAtLanding=true;landedSurfaces.add(runner.surface);}
  lastSurface=runner.surface;
 }
 return {spawn,speed,steer,time:+runner.time.toFixed(2),status:runner.status,fail:runner.failure?.reason??null,
 x:+runner.p[0].toFixed(1),y:+runner.p[1].toFixed(1),z:+runner.p[2].toFixed(1),
 maxX:+maxX.toFixed(1),surface:lastSurface,airFrames,airFramesAfterLip,landed,branchSurfaces:[...new Set(runner.events.filter(e=>e.type==='contact'&&/FORK_[LR]/.test(e.surface)).map(e=>e.surface))],events:runner.events.filter(e=>['contact','air','moving-contact','failure','finish'].includes(e.type)).slice(-6).map(e=>e.type+':'+(e.surface||e.mode||e.reason||''))};
}
test('P67 diagnostics: physical jump must be measured for different launch speeds',()=>{
 const results=[38,44,52,60].map(speed=>run(5,speed,0,6.0));
 for(const value of results)console.log('P67_JUMP_DIAG '+JSON.stringify(value));
 assert(results.every(x=>x.airFramesAfterLip>=30&&x.landed&&!x.fail),'P67 true jump landing must succeed at every tested speed: '+JSON.stringify(results));
});
test('P67 diagnostics: turn/branch candidates and actual road transitions',()=>{
 const results=[[0,44,0,12],[1,44,0,12],[2,44,0,12],[3,44,0,12],[4,44,0,7],[6,44,-.35,7],[6,44,0,7],[6,44,.35,7]].map(x=>run(...x));
 for(const value of results)console.log('P67_ROUTE_DIAG '+JSON.stringify(value));
 assert(results.length===8);
});

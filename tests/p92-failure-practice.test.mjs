import test from 'node:test';
import assert from 'node:assert/strict';
import {failurePracticeChapter} from '../web/p92-failure-practice.mjs';
import {PRACTICE_CHAPTERS} from '../web/p79-practice.mjs';

const ask=(surface,overrides={})=>failurePracticeChapter({
 stageId:'EP-P66',mode:'manual',status:'failed',surface,...overrides
});
test('P92 maps known authentic EP-P66 physical roads to an earlier P79 practice entry',()=>{
 const cases={
  'p66-PIPE_DIVE_A-02':null,
  'p66-PIPE_RETURN-01':'return',
  'p66-PIPE_RETURN-02':'return',
  'p66-SPIRAL_CATHEDRAL-01':'return',
  'p66-SPIRAL_CATHEDRAL-05':'return',
  'p66-SPIRAL_CATHEDRAL-06':'spiral-exit',
  'p66-FORK_APPROACH-01':'fork',
  'p66-FORK_APPROACH-02':'fork',
  'p66-FORK_L-01':'fork',
  'p66-FORK_R-02':'fork',
  'p66-FORK_REJOIN-01':'rejoin',
  'p66-MACHINE_CHAMBER-01':'machines',
  'p66-MACHINE_CHAMBER-03':'machines',
  'p66-GAP_TAKEOFF-01':'jump',
  'p66-GAP_LANDING-01':'jump',
  'p66-GAP_LANDING-02':'jump'
 };
 for(const [surface,chapter] of Object.entries(cases)){
  assert.equal(ask(surface),chapter,surface);
  if(chapter)assert(PRACTICE_CHAPTERS.some(x=>x.id===chapter),'P79 physical chapter missing: '+chapter);
 }
});
test('P92 never offers retry-practice for frozen P62, spectator, existing practice or completed runs',()=>{
 for(const stageId of ['EP-001','HS-001','HG-001','WV-001']){
  assert.equal(ask('p66-MACHINE_CHAMBER-01',{stageId}),null);
 }
 for(const mode of ['spectator-demo','practice']){
  assert.equal(ask('p66-MACHINE_CHAMBER-01',{mode}),null);
 }
 for(const status of ['ready','running','finished']){
  assert.equal(ask('p66-MACHINE_CHAMBER-01',{status}),null);
 }
 assert.equal(ask('p66-MACHINE_CHAMBER-01',{stageId:null}),null);
 assert.equal(ask('p66-MACHINE_CHAMBER-01',{surface:'p66-UNKNOWN_SECTION-01'}),null);
});
test('P92 an airborne failure uses the last real rideable ground contact, no coordinate teleport',()=>{
 const records=[
  {t:0,grounded:true,surface:'p66-PIPE_RETURN-01'},
  {t:75,grounded:true,surface:'p66-GAP_TAKEOFF-01'},
  {t:80,grounded:false,surface:null},
  {t:82,grounded:false,surface:null}
 ];
 const serialized=JSON.stringify(records);
 assert.equal(ask(null,{lastSurface:null,records}),'jump');
 assert.equal(ask(null,{lastSurface:'p66-FORK_L-01',records}),'fork');
 assert.equal(ask(null,{lastSurface:null,records:[]}),null);
 assert.equal(ask(null,{lastSurface:null,records:null}),null);
 assert.equal(JSON.stringify(records),serialized);
});

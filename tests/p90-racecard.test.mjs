import test from 'node:test';import assert from 'node:assert/strict';
import {generateEchoRush} from '../scripts/p66-echo-rebuild.mjs';
import {generateReferenceGhost} from '../scripts/p87-ghost-generate.mjs';
import {buildRacecard,racecardTotals,racecardDeltaText} from '../web/p90-racecard.mjs';
test('P90 eight exact native sectors only show real player events',()=>{
 const reference=generateReferenceGhost(generateEchoRush());
 const empty=buildRacecard([],reference);assert.equal(empty.length,8);
 assert(empty.every(x=>x.status==='pending'&&x.delta===null));
 const actual=reference.sectors.slice(0,3).map((x,index)=>({...x,index,time:x.time+(index+1)*.32}));
 const rows=buildRacecard(actual,reference),stats=racecardTotals(rows);
 assert.equal(stats.completed,3);assert.equal(stats.finished,false);
 assert.equal(stats.currentDelta,.96);assert.equal(rows[0].delta,.32);
 assert.equal(rows[3].status,'pending');assert.equal(rows[7].player,null);
 assert.equal(racecardDeltaText(-2.125),'−2.13s');assert.equal(racecardDeltaText(null),'—');
 assert.throws(()=>buildRacecard([{id:'wrong',index:0,time:20,duration:10}],reference));
});

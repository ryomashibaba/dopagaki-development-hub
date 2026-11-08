/** R54: Isolated K4CT research cue text only.
 * True Chromium/WebGL2 and human reaction/fairness remain UNTESTED here.
 */
import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
const path=fileURLToPath(new URL('../scripts/p101-k4ct-dual-real-b51-decision.mjs',import.meta.url));
const source=fs.readFileSync(path,'utf8');
// The real module imports the packaged K4CS source only for geometry. Strip
// that single import to exercise its actual formatter in isolation, not a copy.
const stripped=source.replace(/^import \{readK4CSRealRoadWarning\} from '\.\/k4cs-true-b48-ahead-b51-readable-cues\.mjs';\r?\n/m,'');
const {formatK4CTNativeDualCue:format}=await import('data:text/javascript;base64,'+Buffer.from(stripped).toString('base64'));
const rows=()=>({rows:[
 {id:'a13-machine-14',metres:137.7,etaSeconds:.76,predictedObstacleSide:'LEFT',geometricCorridorHypothesis:'RIGHT'},
 {id:'a13-machine-15',metres:350,etaSeconds:1.9,predictedObstacleSide:'RIGHT',geometricCorridorHypothesis:'LEFT'}
]});
test('original hazard data and order are retained without modifying telemetry',()=>{
 const d=rows(),before=JSON.stringify(d);
 assert.equal(format(d),'NEXT B51-14  138m / 0.8s  MOVING LEFT\nTHEN B51-15  350m / 1.9s  MOVING RIGHT\nA/D STEER  |  PREDICTION ONLY - NO GUARANTEED SAFE LANE');
 assert.equal(JSON.stringify(d),before);
});
test('do not turn geometric corridor hypothesis into a safe lane instruction',()=>{
 const cue=format(rows());
 assert.match(cue,/NO GUARANTEED SAFE LANE/);
 assert.doesNotMatch(cue,/OPEN\?|SAFE RIGHT|SAFE LEFT|\bGO RIGHT\b|\bGO LEFT\b/);
});
test('zero, one and malformed input remain display-safe',()=>{
 assert.equal(format(null),'B51 - NO UPCOMING HAZARD');
 assert.equal(format({rows:[]}), 'B51 - NO UPCOMING HAZARD');
 assert.equal(format({rows:[{id:'odd',metres:-3,etaSeconds:-1,predictedObstacleSide:'L'}]}),
  'NEXT B51-?  0m / 0.0s  MOVING UNKNOWN\nA/D STEER  |  PREDICTION ONLY - NO GUARANTEED SAFE LANE');
});
test('only first two actual hazards appear',()=>{
 const d=rows(),old=format(d);
 d.rows.push({id:'a13-machine-16',metres:800,etaSeconds:4});
 assert.equal(format(d),old);
});

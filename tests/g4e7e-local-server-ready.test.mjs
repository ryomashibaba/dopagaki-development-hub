import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {once} from 'node:events';
import {isLocalPortFree,waitForLocalQa} from '../scripts/g4e7e-local-server-ready.mjs';
const assets=new Set([
 '/drive3d/','/drive3d/p101-w9c2-g4e7d-human-qa.mjs',
 '/drive3d/p101-w9c2-g4e7d-manual-panel.mjs',
 '/generated/P101_A13_W9C2_G4E6_C0-55-1_LOCAL_TRIAL.json',
 '/generated/P101_A13_W9C2_G4E6_B0-65-1_LOCAL_TRIAL.json'
]);
test('G4E7E local port check and complete real gap preview readiness',async()=>{
 const seen=[];
 const srv=http.createServer((req,res)=>{
  seen.push(req.url);res.writeHead(assets.has(req.url)?200:404);res.end();
 });
 srv.listen(0,'127.0.0.1');await once(srv,'listening');
 try{
  const port=srv.address().port;
  assert.equal(await isLocalPortFree(port),false);
  assert.deepEqual((await waitForLocalQa(port,{attempts:2,intervalMs:0})).ready,true);
  assert.equal(seen.length,5);
 }finally{await new Promise(done=>srv.close(done));}
});
test('G4E7E rejects stale localhost app missing private gap assets',async()=>{
 const srv=http.createServer((req,res)=>{
  res.writeHead(req.url.startsWith('/generated/')?404:200);res.end();
 });
 srv.listen(0,'127.0.0.1');await once(srv,'listening');
 try{
  await assert.rejects(waitForLocalQa(srv.address().port,{attempts:2,intervalMs:0}),/BOTH B48/);
 }finally{await new Promise(done=>srv.close(done));}
});

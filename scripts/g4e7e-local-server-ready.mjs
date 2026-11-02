/** Loopback-only preflight for G4E-7D. No external network, data upload or game modifications. */
import net from 'node:net';
import {setTimeout as sleep} from 'node:timers/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const host='127.0.0.1';
const required=[
 '/drive3d/',
 '/drive3d/p101-w9c2-g4e7d-human-qa.mjs',
 '/drive3d/p101-w9c2-g4e7d-manual-panel.mjs',
 '/generated/P101_A13_W9C2_G4E6_C0-55-1_LOCAL_TRIAL.json',
 '/generated/P101_A13_W9C2_G4E6_B0-65-1_LOCAL_TRIAL.json'
];
function checkPort(port){
 if(!Number.isInteger(port)||port<1024||port>65535)throw Error('Port must be 1024..65535');
}
export function isLocalPortFree(port){
 checkPort(port);
 return new Promise(resolve=>{
  const server=net.createServer();
  server.once('error',()=>resolve(false));
  server.listen(port,host,()=>server.close(()=>resolve(true)));
 });
}
export async function waitForLocalQa(port,{attempts=30,intervalMs=500}={}){
 checkPort(port);
 if(!Number.isInteger(attempts)||attempts<1||attempts>120||!Number.isInteger(intervalMs)||intervalMs<0)
  throw Error('Invalid retry settings');
 const origin='http://'+host+':'+port;
 for(let i=0;i<attempts;i++){
  try{
   let allPresent=true;
   for(const asset of required){
    const response=await fetch(origin+asset,{method:'HEAD',redirect:'error',
     signal:AbortSignal.timeout(1200),cache:'no-store'});
    if(!response.ok){allPresent=false;break;}
   }
   if(allPresent)return {ready:true,attempt:i+1,origin};
  }catch{/* localhost server may not have started yet */}
  if(i+1<attempts)await sleep(intervalMs);
 }
 throw Error('Local QA did not serve expected app and BOTH B48 gap assets: '+origin);
}
async function main(){
 const [op,textPort]=process.argv.slice(2),port=Number(textPort);
 if(op==='check'){
  if(!await isLocalPortFree(port))throw Error('Port '+port+' busy; close previous G4E7D LOCAL SERVER');
  console.log('QA port free: '+port);return;
 }
 if(op==='wait'){
  const ready=await waitForLocalQa(port);console.log('LOCAL QA ready:',ready.origin);
  return;
 }
 throw Error('Use: node scripts/g4e7e-local-server-ready.mjs check|wait 4374');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))
 main().catch(e=>{console.error('[G4E-7E] '+e.message);process.exitCode=1;});

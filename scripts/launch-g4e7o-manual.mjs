/**
 * Private-only G4E-7O one-action Windows launcher.
 * Starts the existing protected local build and loopback-only web server.
 * Never pushes commits, modifies Gold, or publishes any stage.
 */
import {spawn,spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const url='http://127.0.0.1:4373/drive3d/?g4e7m=on&g4e7o=manual&stage=VB-P101-A13-W9C2-G4E7M-THREAD';
process.chdir(root);
const env={...process.env,DOPAGAKI_G4E7M_VISUAL:'1',DOPAGAKI_BUILD_DIR:'dist-private'};
console.log('[G4E-7O] Private-only B48 build / original Gold unchanged');
const built=spawnSync(process.execPath,['scripts/build.mjs','private'],
 {cwd:root,env,stdio:'inherit'});
if(built.error||built.status!==0){
 console.error('[G4E-7O] Private build failed:',built.error?.message||built.status);
 process.exit(1);
}
console.log('[G4E-7O] Localhost server starting; close this window to stop.');
const server=spawn(process.execPath,['scripts/serve.mjs','dist-private','4373'],
 {cwd:root,env,stdio:['inherit','pipe','inherit']});
let opened=false;
server.stdout.setEncoding('utf8');
server.stdout.on('data',chunk=>{
 process.stdout.write(chunk);
 if(opened||!chunk.includes('DOPAGAKI STAGE HUB'))return;
 opened=true;
 if(process.platform==='win32'){
  const opener=spawn('rundll32.exe',['url.dll,FileProtocolHandler',url],
   {cwd:root,windowsHide:true,stdio:'ignore'});
  opener.on('error',e=>console.error('Browser auto-open unavailable: '+e.message));
  opener.unref();
 }else console.log('Open this browser URL: '+url);
});
server.on('error',e=>{console.error('Local server error:',e.message);process.exitCode=1;});
server.on('exit',code=>{
 if(!opened||code)console.error('Local server stopped. Exit status:',code);
 process.exitCode=code||0;
});
process.on('SIGINT',()=>{if(server.exitCode===null)server.kill();});

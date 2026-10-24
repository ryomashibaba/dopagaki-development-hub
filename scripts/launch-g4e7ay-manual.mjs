/**
 * G4E-7AY isolated localhost, one-step private real B48/B51 manual QA.
 * No automated steering, remote upload, production deployment, or git push.
 */
import {spawn,spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const url='http://127.0.0.1:4373/drive3d/?g4e7al=manual&g4e7ay=banked-bridge';
process.chdir(root);
const env={...process.env,DOPAGAKI_G4E7AK_VISUAL:'1',DOPAGAKI_BUILD_DIR:'dist-private'};
console.log('[G4E-7AY] Private-only native 240Hz/manual B48 + B51-C; source/Gold untouched');
const built=spawnSync(process.execPath,['scripts/build.mjs','private'],{cwd:root,env,stdio:'inherit'});
if(built.error||built.status!==0){console.error('Private build failed',built.error?.message||built.status);process.exit(1)}
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
  opener.on('error',err=>console.error('Browser launch unavailable:',err.message));
  opener.unref();
 }else console.log('Open '+url);
});
server.on('error',err=>{console.error('Local server error',err.message);process.exitCode=1});
server.on('exit',code=>{if(!opened||code)console.error('Local server exited',code);process.exitCode=code||0});
process.on('SIGINT',()=>{if(server.exitCode===null)server.kill()});

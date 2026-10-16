import {spawn} from 'node:child_process';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const port=43731;
const child=spawn(process.execPath,['scripts/serve.mjs','dist-private',String(port)],{cwd:root,stdio:'pipe'});
const host=`http://127.0.0.1:${port}`;
async function untilReady(){for(let i=0;i<50;i++){try{const r=await fetch(host+'/');if(r.ok)return;}catch{}await new Promise(r=>setTimeout(r,100));}throw Error('Local HTTP server did not start: '+(await new Promise(resolve=>{let s='';child.stderr.on('data',b=>s+=b.toString());setTimeout(()=>resolve(s),100)})));}
try{
 await untilReady();
 const files=fs.readdirSync(path.join(root,'private/stages'));
 const urls=['/','/web/','/build-info.json','/reports/P62_FULL_RUN_MATRIX.json','/reference_only/director/moving/moving-obstacles.mjs','/reference_only/director/surface.js',...files.map(x=>'/generated/'+x)];
 for(const pathname of urls){const r=await fetch(host+pathname);assert.equal(r.status,200,`HTTP ${r.status} ${pathname}`);const type=r.headers.get('content-type')||'';assert(!type.includes('text/html')||pathname==='/'||pathname==='/web/','JSON/JS must not be HTML');if(pathname.endsWith('.json'))JSON.parse(await r.text());else await r.arrayBuffer();}
 const missing=await fetch(host+'/generated/EP-001_P62_GRAZING_CONTACT_BALANCE.json');assert.equal(missing.status,404,'Old erroneous filename should not exist');
 const page=await (await fetch(host+'/web/')).text();
 for(const file of files)assert(page.includes(file),`Inspector missing ${file}`);
 console.log('HTTP PASS',urls.length,'valid assets; old 404 path rejected; stage imports verified');
}catch(e){console.error(e);process.exitCode=1;}finally{child.kill('SIGTERM');}

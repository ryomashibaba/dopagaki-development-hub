import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dir=path.resolve(root,process.argv[2]||'dist-private');
const port=Number(process.argv[3]||4373);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.txt':'text/plain; charset=utf-8'};
if(!fs.existsSync(dir))throw Error('Build first: '+dir);
export const server=http.createServer((req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  let abs=path.resolve(dir,'.'+pathname);
  if(abs!==dir&&!abs.startsWith(dir+path.sep)){res.writeHead(403);res.end('Forbidden');return;}
  if(fs.existsSync(abs)&&fs.statSync(abs).isDirectory())abs=path.join(abs,'index.html');
  if(!fs.existsSync(abs)||!fs.statSync(abs).isFile()){res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');return;}
  res.writeHead(200,{'Content-Type':types[path.extname(abs)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
  if(req.method==='HEAD'){res.end();return;}
  fs.createReadStream(abs).pipe(res);
 }catch(e){res.writeHead(400);res.end('Bad request');}
});
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1]))server.listen(port,'127.0.0.1',()=>console.log(`DOPAGAKI STAGE HUB http://127.0.0.1:${port}/`));

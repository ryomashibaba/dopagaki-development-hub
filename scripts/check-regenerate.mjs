import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const generated=path.join(root,'private/generated');
for(const file of fs.readdirSync(path.join(root,'private/stages')).filter(x=>x.endsWith('.json'))){
 const a=fs.readFileSync(path.join(generated,file));
 const b=fs.readFileSync(path.join(root,'private/stages',file));
 if(!a.equals(b))throw Error(`Regeneration mismatch: ${file}`);
}
console.log('REGEN PASS: 4 stage files byte-identical to P62 fixed original');

#!/usr/bin/env python3
"""K4AO: portable, source-only ART-first RGB comparison from pinned real K4AJ ZIP.
No network requests, new models, per-object attribution, ART or HUMAN claims.
"""
import argparse, base64, csv, hashlib, io, json, struct, zipfile
from pathlib import Path

PIN='60aab331d8881b5f8f456539c00566837a2b061a96ab0725ce7c17ea91ed8efb'
SOURCE='af076d67492a677d2235e4730aef8cdf4808e106'
SHOTS={'ultra':(11280,11320,11341,11369),'control':(11259,11278,11280,11307)}
REQUIRED={'ultra':(11320,11326,11338,11341,11349,11351,11363,11369),
          'control':(11259,11265,11277,11280,11284,11301,11307)}

def check(ok,why):
    if not ok: raise ValueError('K4AO_EVIDENCE_REJECT_'+why)

def digest(b): return hashlib.sha256(b).hexdigest()

def real_png(z,meta):
    name=meta['file']
    check(Path(name).name==name and name.endswith('.png'),'PATH')
    b=z.read(name)
    check(len(b)==meta['bytes'] and digest(b)==meta['sha256'],'PNG_SHA')
    check(b[:8]==b'\x89PNG\r\n\x1a\n' and b[12:16]==b'IHDR'
          and struct.unpack('>II',b[16:24])==(1013,698),'PNG_OR_DIMENSIONS')
    return b

def extract(z):
    check(len(z.infolist())==28 and z.testzip() is None,'ZIP_CRC')
    raw=json.loads(z.read('K4AJ_GENUINE_NATIVE_IN_RENDER_DEPTH_REPORT.json'))
    audit=json.loads(z.read('K4AJ_INDEPENDENT_99_CONTIGUOUS_SOURCE_GPU_MASK_AUDIT.json'))
    rows=list(csv.DictReader(io.StringIO(z.read('K4AJ_100_REAL_SOURCE_GPU_DEPTH_MASKS.csv').decode())))
    check(raw['originalSourceBlob']==audit['originalSourceBlob']==SOURCE,'SOURCE')
    check(raw['errors']==[] and raw['ART']=='NOT_TESTED_HOLD'
          and audit['officialARTAccepted']==audit['slope2DNAMetres']==0,'ART_HOLD')
    check(audit['decision']=='GENUINE_CONTIGUOUS_SOURCE_GPU_B51_DEPTH_99_TICKS_TECH_CANDIDATE_ART_HOLD'
          and len(rows)==100,'GPU_AUDIT')
    check(audit['trueOriginalGPUFrames']==audit['genuineSourceB51Masks']==
          audit['originalDepthRestorations']==100,'GPU_CASES')
    lookup={(r['mode'],int(r['tick'])):r for r in rows}
    out=[]
    for mode,ticks in SHOTS.items():
        sessions=[s for s in raw['sessions'] if s['mode']==mode]
        check(len(sessions)==1,'SESSION')
        session=sessions[0]
        for tick in ticks:
            f=next(x for x in session['frames'] if x['tick']==tick)
            m=next(x for x in session['masks'] if x['tick']==tick)
            rec=next(x for x in session['restored'] if x['tick']==tick)
            original=real_png(z,f['originalPNG'])
            masked=real_png(z,m['screenshot'])
            restored=real_png(z,rec['screenshot'])
            check(original==restored,'SOURCE_RGB_RESTORE')
            a=f['synchronousRenderDepth']['samples']
            b=m['synchronousDepth']['samples']
            c=rec['depth']['samples']
            check(len(a)==len(b)==len(c)==11176 and a==c,'GPU_RESTORE')
            check(all(y>=x for x,y in zip(a,b)),'GPU_MASK_CREATED_NEARER_DEPTH')
            changed=sum(y>x for x,y in zip(a,b))
            check(changed==int(lookup[(mode,tick)]['maskedFartherDepthSamples'])
                  and m['mask']=='without-B51-bodies','GPU_CSV')
            out.append(dict(mode=mode,tick=tick,changed=changed,pct=round(changed/11176*100,3),
               nativeSeconds=round(tick/240,6),
               originalSHA=f['originalPNG']['sha256'],maskedSHA=m['screenshot']['sha256'],
               orig='data:image/png;base64,'+base64.b64encode(original).decode(),
               masked='data:image/png;base64,'+base64.b64encode(masked).decode()))
    return out

STYLE='''*{box-sizing:border-box}body{margin:0;background:#081323;color:#edfcff;font:15px system-ui}
header{padding:22px 3vw;border-bottom:1px solid #37516c;background:#11243c}
small{color:#a4c0d2}h1{margin:5px 0;font-size:clamp(21px,3vw,30px)}
.layout{display:grid;grid-template-columns:245px 1fr;gap:18px;margin:18px auto;max-width:1450px;padding:0 15px}
aside,main{padding:17px;border:1px solid #35516d;border-radius:12px;background:#12233a}
button{cursor:pointer;background:#21415d;border:1px solid #4d7894;color:white;border-radius:8px;padding:11px}
button:disabled{opacity:.4;cursor:not-allowed}.active{background:#147390}
#ticks{display:grid;gap:6px;margin:18px 0}#ticks button{text-align:left}
#scene{--pos:50%;position:relative;width:100%;aspect-ratio:1013/698;overflow:hidden}
#scene img{position:absolute;inset:0;width:100%;height:100%}#masked{clip-path:inset(0 0 0 var(--pos))}
.line{position:absolute;left:var(--pos);top:0;height:100%;width:2px;background:white}
input{width:55%;accent-color:#65e4f4}p{line-height:1.7;color:#b8d3e1;font-size:13px}
b{color:#6de8f6}@media(max-width:860px){.layout{grid-template-columns:1fr}}'''

HTML='''<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DOPAGAKI K4AO genuine RGB ART review</title><style>__STYLE__</style></head><body>
<header><small>DOPAGAKI SLOPE / PINNED ORIGINAL WEBGL2 SOURCE / K4AO</small><h1>TRUE SOURCE RGB · ART-FIRST REVIEW</h1><small>SOURCE GPU TECH候補 ／ ART・HUMAN・RELEASE HOLD</small></header>
<div class="layout"><aside><h3>WIDTH / NATIVE TICKS</h3><button id="ultra" onclick="switchMode('ultra')">14m ultra</button><button id="control" onclick="switchMode('control')">28m control</button><div id="ticks"></div><p>元RGBの取得済み8時点（うちK4AK審査要求との一致6）を比較。未撮影9時点は灰色です。</p></aside>
<main><h2 id="label"></h2><div id="scene"><img id="original" alt="本物の元source"><img id="masked" alt="B51群のみ研究用非表示"><div class="line"></div></div>
<p>左：本物の元ゲーム画像／右：同じtickでB51群全28体の描画を研究用に除外した画像</p>
<button onclick="cut(100)">元画像のみ</button> <input type="range" min="0" max="100" value="50" id="range" oninput="cut(this.value)"> <button onclick="cut(0)">群除去のみ</button>
<h3 id="stats"></h3><p>値は11,176 GPU深度サンプルの変化率。人間の遮蔽率や継続秒数ではありません。新ARTモデル0、正式採用0、Slope2 DNA認定0m、物理・Camera・B51・main・本番無変更。</p><small id="hash"></small></main></div>
<script>const source=__DATA__;let mode='ultra';
function cut(n){document.getElementById('scene').style.setProperty('--pos',n+'%');document.getElementById('range').value=n}
function switchMode(m){mode=m;for(const k of ['ultra','control'])document.getElementById(k).classList.toggle('active',k===m);show(source.frames.filter(f=>f.mode===m).sort((a,b)=>b.pct-a.pct)[0].tick)}
function show(t){let f=source.frames.find(x=>x.mode===mode&&x.tick===t);if(!f)return;
document.getElementById('original').src=f.orig;document.getElementById('masked').src=f.masked;
document.getElementById('label').textContent=mode+' / tick '+f.tick;
document.getElementById('stats').textContent='native '+f.nativeSeconds+'s · '+f.changed+'/11176 depth points · '+f.pct.toFixed(3)+'%';
document.getElementById('hash').textContent='ORIGINAL SHA256 '+f.originalSHA+' / B51 GROUP MASK SHA256 '+f.maskedSHA;
let ticks=[...new Set([...source.requests[mode],...source.frames.filter(x=>x.mode===mode).map(x=>x.tick)])].sort((a,b)=>a-b);
document.getElementById('ticks').replaceChildren();
for(const tick of ticks){let v=source.frames.find(x=>x.mode===mode&&x.tick===tick);let b=document.createElement('button');b.disabled=!v;b.className=tick===t?'active':'';b.textContent=tick+(v?' / '+v.pct.toFixed(2)+'%':' / 未撮影');b.onclick=()=>show(tick);document.getElementById('ticks').appendChild(b)}}
switchMode('ultra');</script></body></html>'''

def main():
    p=argparse.ArgumentParser()
    p.add_argument('--zip',type=Path)
    p.add_argument('--out',type=Path)
    p.add_argument('--self-test',action='store_true')
    a=p.parse_args()
    pset={(k,t) for k,ts in SHOTS.items() for t in ts}
    rset={(k,t) for k,ts in REQUIRED.items() for t in ts}
    check((len(pset),len(rset),len(pset&rset),len(rset-pset))==(8,15,6,9),'COVERAGE')
    if a.self_test:
        print('K4AO_SOURCE_8_ART_REQUEST_15_OVERLAP_6_MISSING_9_STATIC_PASS_NO_GPU_CLAIM')
        return
    check(a.zip is not None and a.out is not None,'ARGS')
    check(digest(a.zip.read_bytes())==PIN,'ZIP_SHA256')
    with zipfile.ZipFile(a.zip) as z: frames=extract(z)
    payload=json.dumps({'frames':frames,'requests':REQUIRED},separators=(',',':'))
    page=HTML.replace('__STYLE__',STYLE).replace('__DATA__',payload)
    a.out.parent.mkdir(parents=True,exist_ok=True)
    a.out.write_text(page,encoding='utf8')
    print('K4AO_GENUINE_ORIGINAL_8_RGB_MASK_PAIRS_VERIFIED_ART_HOLD')
    print('K4AO_VIEWER_SHA256',digest(a.out.read_bytes()))

if __name__=='__main__': main()

"""K4BY verify precisely three CC0 PBR maps of the true official race-track asphalt.

Never trust filenames, previews, mirrors or downloads without official
declared byte counts+MD5 and independent SHA256. No API billing.
"""
import hashlib,json,sys,time,urllib.parse,urllib.request
from pathlib import Path
args=sys.argv[1:]
OUT=Path(args[args.index('--out')+1]).resolve();OUT.mkdir(parents=True,exist_ok=True)
ASSET='asphalt_track';BASE='https://api.polyhaven.com'
ALLOW={'api.polyhaven.com','dl.polyhaven.org','cdn.polyhaven.com','cdn.polyhaven.org'}
def fetch(url,limit):
 q=urllib.parse.urlsplit(url)
 assert q.scheme=='https' and q.hostname in ALLOW and not q.username and not q.password,("unsafe source",url)
 req=urllib.request.Request(url,headers={'User-Agent':'DOPAGAKI-K4BY-CC0-SourceProtected/1.0','Accept':'*/*'})
 with urllib.request.urlopen(req,timeout=80) as response:
  final=urllib.parse.urlsplit(response.geturl())
  assert final.scheme=='https' and final.hostname in ALLOW,("redirected off vendor",response.geturl())
  size=response.headers.get('Content-Length')
  if size:assert int(size)<=limit,("oversized source",url,size)
  b=response.read(limit+1)
  assert len(b)<=limit,("download too large",url,len(b))
  return b
files=json.loads(fetch(BASE+'/files/'+ASSET,4*1024*1024))
info=json.loads(fetch(BASE+'/info/'+ASSET,4*1024*1024))
assert info.get('type')==1,("unexpected asset type",info.get('type'))
def find_map(kind):
 aliases={'diff':{'diff','diffuse','albedo','basecolor','base_color'},
          'rough':{'rough','roughness'},
          'nor_gl':{'nor_gl','normal_gl','normalgl','normal'}}[kind]
 matches=[(key,obj) for key,obj in files.items() if key.lower() in aliases and isinstance(obj,dict)]
 assert len(matches)==1,("ambiguous/nonexistent vendor map",kind,[k for k,_ in matches],list(files))
 key,node=matches[0]
 assert '2k' in node,("vendor map has no 2K",key,list(node))
 fmts=node['2k']
 fmt='jpg' if 'jpg' in fmts else 'png'
 assert fmt in fmts,("no bounded image format",kind,list(fmts))
 meta=fmts[fmt]
 assert all(x in meta for x in ('url','size','md5')),("no vendor digest",key,fmt)
 return key,fmt,meta
refs={k:find_map(k) for k in ('diff','rough','nor_gl')}
total=sum(int(x[2]['size']) for x in refs.values())
assert 0<total<32*1024*1024,("vendor declared files too big",total)
result={'schema':'dopagaki.k4by.official-polyhaven-racetrack-pbr-three-verified/1',
 'assetId':ASSET,'assetUrl':'https://polyhaven.com/a/'+ASSET,
 'licenseUrl':'https://polyhaven.com/license','license':'CC0',
 'officialFilesApi':BASE+'/files/'+ASSET,'officialInfoApi':BASE+'/info/'+ASSET,
 'author':info.get('authors'),'vendorDimensionsMm':info.get('dimensions'),
 'resolution':'2k','maps':{},'totalDeclaredBytes':total,'costJPY':0,
 'originalGameEdited':False,'originalNativeParentEdited':False,
 'checkedUTC':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())}
for kind,(vendor_key,fmt,meta) in refs.items():
 raw=fetch(meta['url'],14*1024*1024)
 assert len(raw)==int(meta['size']),("vendor bytes disagree",kind)
 assert hashlib.md5(raw).hexdigest().lower()==meta['md5'].lower(),("vendor MD5 mismatch",kind)
 sha=hashlib.sha256(raw).hexdigest()
 name=ASSET+'_'+kind+'_2k.'+fmt
 p=OUT/name;p.write_bytes(raw)
 result['maps'][kind]={'localName':name,'vendorKey':vendor_key,'format':fmt,
  'vendorUrl':meta['url'],'bytes':len(raw),'vendorMd5':meta['md5'],
  'sha256':sha,'vendorMD5Pass':True}
 print("K4BY_TRUE_VENDOR_PBR_MAP_SHA_PASS",kind,len(raw),sha,flush=True)
assert len(result['maps'])==3
assert sum(x['bytes'] for x in result['maps'].values())==total
(OUT/'K4BY_ASPHALT_TRACK_OFFICIAL_PBR_VERIFIED.json').write_text(
 json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print('K4BY_TRUE_CC0_ROAD_PBR_RECORDED',total,flush=True)

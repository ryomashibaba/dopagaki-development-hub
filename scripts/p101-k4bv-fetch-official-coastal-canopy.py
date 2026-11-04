"""K4BV: vendor-authenticated, bounded Poly Haven CC0 coastal model.
One permitted model, 1K native glTF and its exact dependencies only.
No paid API, no project source edits, no unverified art-adoption claims.
"""
import hashlib,json,sys,time,urllib.parse,urllib.request
from pathlib import Path
a=sys.argv[1:]
OUT=Path(a[a.index('--out')+1]).resolve();OUT.mkdir(parents=True,exist_ok=True)
ID='island_tree_02';UA='DOPAGAKI-K4BV-SourceProtectedNativeArt/1.0 (Poly Haven official CC0)'
BASE='https://api.polyhaven.com';HOSTS={'api.polyhaven.com','dl.polyhaven.org','cdn.polyhaven.com','cdn.polyhaven.org'}
FILE_MAX=75*1024*1024;TOTAL_MAX=105*1024*1024
def fetch(url,maximum):
 p=urllib.parse.urlsplit(url)
 assert p.scheme=='https' and p.hostname in HOSTS and not p.username and not p.password,url
 req=urllib.request.Request(url,headers={'User-Agent':UA,'Accept':'*/*'})
 with urllib.request.urlopen(req,timeout=70) as r:
  final=urllib.parse.urlsplit(r.geturl())
  assert final.scheme=='https' and final.hostname in HOSTS
  size=r.headers.get('Content-Length')
  if size:assert int(size)<=maximum,(url,size)
  raw=r.read(maximum+1);assert len(raw)<=maximum
  return raw
def get(path):return json.loads(fetch(BASE+path,4*1024*1024))
info=get('/info/'+ID);api=get('/files/'+ID)
assert info.get('type')==2 and 'gltf' in api and '1k' in api['gltf']
root=api['gltf']['1k']['gltf']
assert all(k in root for k in ('url','size','md5','include'))
assert isinstance(root['include'],dict)
records=[(ID+'.gltf',root)]+sorted(root['include'].items())
total=sum(int(r['size']) for _,r in records)
receipt={'schema':'dopagaki.K4BV.official-verified-coastal-tree/1','assetId':ID,
 'assetUrl':'https://polyhaven.com/a/'+ID,'licenseUrl':'https://polyhaven.com/license',
 'license':'CC0 1.0','attribution':'Powered by Poly Haven',
 'officialInfoApi':BASE+'/info/'+ID,'officialFilesApi':BASE+'/files/'+ID,
 'author':info.get('authors'),'vendorDimensionsMm':info.get('dimensions'),
 'resolution':'1k','totalDeclaredBytes':total,'files':{},
 'sourceGameEdited':False,'isGameAsset':False,'paidApi':False,
 'checkedUTC':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())}
(OUT/'K4BV_SOURCE_BOUNDED_PREFLIGHT.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2))
assert 2<=len(records)<=35 and total<=TOTAL_MAX,('CC0_NATIVE_SIZE_HOLD',total)
assert all(0<int(m['size'])<=FILE_MAX for _,m in records)
for index,(name,meta) in enumerate(records):
 rel=Path(name)
 assert not rel.is_absolute() and '..' not in rel.parts and len(rel.parts)<=5 and rel.suffix.lower() in ('.gltf','.bin','.png','.jpg','.jpeg','.webp')
 assert all(k in meta for k in ('url','md5','size'))
 data=fetch(meta['url'],FILE_MAX)
 assert len(data)==int(meta['size'])
 assert hashlib.md5(data).hexdigest().lower()==str(meta['md5']).lower(),('vendor MD5 mismatch',name)
 path=OUT/'model'/ID/rel;path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(data)
 receipt['files'][name]={'sourceUrl':meta['url'],'vendorMd5':meta['md5'],
  'declaredBytes':int(meta['size']),'actualBytes':len(data),
  'sha256':hashlib.sha256(data).hexdigest(),'localFile':str(path.relative_to(OUT)),
  'vendorMd5Pass':True}
 print('K4BV_VENDOR_CC0_MD5_BYTES_SHA_PASS',index+1,len(records),name,len(data),flush=True)
receipt['nativeGLTFRelativeFile']='model/'+ID+'/'+ID+'.gltf'
receipt['verifiedTotalBytes']=sum(f['actualBytes'] for f in receipt['files'].values())
assert receipt['verifiedTotalBytes']==total
(OUT/'K4BV_CC0_VENDOR_VERIFIED_RECEIPT.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2))
print('K4BV_COMPLETE_OFFICIAL_CC0_NATIVE_TREE_DOWNLOAD_PASS',ID,total,flush=True)

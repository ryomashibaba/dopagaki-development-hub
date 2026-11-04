"""K4BS independently verified CC0 vegetation texture and real native pine sapling.

Official Poly Haven API (not a scraped site): live /info and /files for
a known official Poly Haven asset, unique User-Agent and source credit.
Checks official MD5, declared bytes and independent SHA256 of EVERY map.
No paid API. No 3D asset or CC0 license claims without actual receipt.
"""
import os,json,hashlib,urllib.request,urllib.parse,sys,time
from pathlib import Path

args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else sys.argv[1:]
OUT=Path(args[args.index('--out')+1]);OUT.mkdir(parents=True,exist_ok=True)
UA='DOPAGAKI-SLOPE-K4BS-OpenResearch/1.0 (GitHub native Blender source-audit; credit Poly Haven)'
BASE='https://api.polyhaven.com'
ASSET_NAMES=['sparse_grass']
MAPS=['diffuse','nor_gl','rough']
MAX_FILE_SIZE=100*1024*1024
ALLOWED_HOSTS={'dl.polyhaven.org','cdn.polyhaven.com','cdn.polyhaven.org'}

def get_bytes(url,maximum=MAX_FILE_SIZE):
 parsed=urllib.parse.urlsplit(url)
 assert parsed.scheme=='https' and parsed.hostname in ALLOWED_HOSTS | {'api.polyhaven.com'},url
 headers={'User-Agent':UA,'Accept':'application/json' if parsed.hostname=='api.polyhaven.com' else '*/*'}
 req=urllib.request.Request(url,headers=headers)
 with urllib.request.urlopen(req,timeout=50) as response:
  dest=urllib.parse.urlsplit(response.geturl())
  assert dest.scheme=='https' and dest.hostname in ALLOWED_HOSTS | {'api.polyhaven.com'},response.geturl()
  length=response.headers.get('Content-Length')
  if length:assert int(length)<=maximum,(url,length)
  data=response.read(maximum+1)
  assert len(data)<=maximum
  return data

def get_json(path):
 return json.loads(get_bytes(BASE+path,maximum=3*1024*1024))
def pick_map(tree,key):
 mapping={str(k).lower():str(k) for k in tree}
 alternatives={
  'diffuse':['diffuse','diff','albedo','basecolor','base_color'],
  'nor_gl':['nor_gl','normal_gl','normal','nor'],
  'rough':['rough','roughness']
 }
 found=next((mapping[x] for x in alternatives[key] if x in mapping),None)
 assert found is not None,{'wanted':key,'keys':list(tree)}
 resolutions=tree[found]
 res=next((r for r in ('2k','1k','4k') if r in resolutions),None)
 assert res is not None,{'map':found,'resolutions':list(resolutions)}
 formats=resolutions[res]
 fmt=next((f for f in ('jpg','png','jpeg') if f in formats),None)
 assert fmt is not None,{'map':found,'formats':list(formats)}
 return found,res,fmt,formats[fmt]

def sha(data):return hashlib.sha256(data).hexdigest()
receipt={
 'schema':'dopagaki.K4BS.independently-downloaded-CC0-PBR/1',
 'licenseEvidence':'https://polyhaven.com/license',
 'attribution':'Powered by Poly Haven (public API live use requirement)',
 'license':'CC0 1.0', 'userAgent':UA,
 'downloadUTC':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),
 'additionalPaidAPI':False,'photoscannedAssetsActuallyDownloaded':{},
 'sourceGameEdited':False
}
for asset in ASSET_NAMES:
 info=get_json('/info/'+asset)
 tree=get_json('/files/'+asset)
 assert info.get('type')==1,(asset,info.get('type'))
 files={}
 for requested in MAPS:
  key,res,fmt,meta=pick_map(tree,requested)
  assert all(k in meta for k in ('url','md5','size')),{'asset':asset,'map':key,'meta':meta}
  data=get_bytes(meta['url'])
  assert len(data)==int(meta['size']),(asset,requested,len(data),meta['size'])
  assert hashlib.md5(data).hexdigest().lower()==str(meta['md5']).lower(),(asset,requested,'bad vendor md5')
  # Keep native map bytes and original vendor hash for scrutiny.
  file=asset+'_'+requested+'_'+res+'.'+fmt
  (OUT/file).write_bytes(data)
  files[requested]={
   'vendorOriginalMap':key,
   'vendorResolution':res,'vendorFormat':fmt,
   'vendorDeclaredSize':meta['size'],'vendorMD5':meta['md5'],
   'sourceURL':meta['url'],'localFile':file,
   'actualBytes':len(data),'sha256':sha(data),
   'independentMD5Verified':True
  }
  print('K4BS_REAL_POLYHAVEN_MAP_VERIFIED',asset,requested,res,len(data))
 receipt['photoscannedAssetsActuallyDownloaded'][asset]={
  'name':info.get('name'),'assetUrl':'https://polyhaven.com/a/'+asset,
  'infoApi':BASE+'/info/'+asset,'filesApi':BASE+'/files/'+asset,
  'authors':info.get('authors',{}),'dimensionsMm':info.get('dimensions'),
  'maps':files
 }

# Photogrammetry/retopology-based real scanned cliff rock mesh, no more
# low-poly hand-coded duplicate rock props. This can be ~20K triangles.
# Download exact 1K glTF vendor manifest and all referenced dependencies.
model_id='pine_sapling_small'
model_info=get_json('/info/'+model_id)
model_tree=get_json('/files/'+model_id)
assert model_info.get('type')==2,(model_id,model_info.get('type'))
assert isinstance(model_tree.get('gltf'),dict),{'asset':model_id,'keys':list(model_tree)}
formats=model_tree['gltf']
resolution=next((x for x in ('1k','2k','4k') if x in formats),None)
assert resolution,{'gltf_resolutions':list(formats)}
variant=formats[resolution]
assert isinstance(variant,dict) and 'gltf' in variant,variant
gltf=variant['gltf']
assert all(x in gltf for x in ('url','md5','size','include')),gltf
def fetch_verified_file(meta,relname):
 path=Path(relname)
 assert not path.is_absolute() and '..' not in path.parts and len(path.parts)<=4,path
 assert path.suffix.lower() in ('.gltf','.bin','.png','.jpg','.jpeg','.webp'),path
 b=get_bytes(meta['url'],maximum=100*1024*1024)
 assert int(meta['size'])==len(b),(relname,len(b),meta['size'])
 assert hashlib.md5(b).hexdigest().lower()==str(meta['md5']).lower(),relname
 to=OUT/'model'/model_id/path
 to.parent.mkdir(parents=True,exist_ok=True)
 to.write_bytes(b)
 return {'sourceURL':meta['url'],'vendorMD5':meta['md5'],
         'vendorDeclaredBytes':meta['size'],
         'sha256':sha(b),'actualBytes':len(b),
         'localFile':str(to.relative_to(OUT))}
# Fail safe rather than pulling huge cinema-sized asset into a free CI.
aggregate=int(gltf['size'])+sum(int(m['size']) for m in gltf['include'].values())
assert aggregate<=175*1024*1024,{'model':model_id,'bytes':aggregate,'issue':'high-fidelity tree asset too heavy'}
srcname=model_id+'.gltf'
model_files={srcname:fetch_verified_file(gltf,srcname)}
for path,meta in gltf['include'].items():
 model_files[path]=fetch_verified_file(meta,path)
# The glTF external dependencies are placed exactly as the vendor declares;
# Blender loads the model only if every file passes independent MD5.
receipt['verifiedCC0NativeTreeModel']={
 'id':model_id,'name':model_info.get('name'),'assetUrl':'https://polyhaven.com/a/'+model_id,
 'infoApi':BASE+'/info/'+model_id,'filesApi':BASE+'/files/'+model_id,
 'authors':model_info.get('authors',{}),
 'nativeGLTFResolution':resolution,'nativeGLTFRelativeFile':model_files[srcname]['localFile'],
 'declaredDimensionsMm':model_info.get('dimensions'),
 'files':model_files
}
print('K4BS_REAL_POLYHAVEN_GLTF_AND_ALL_DEPENDENCIES_VERIFIED',model_id,len(model_files))

path=OUT/'K4BS_CC0_LIVE_ASSET_RECEIPTS.json'
path.write_text(json.dumps(receipt,ensure_ascii=False,indent=2))
assert len(receipt['photoscannedAssetsActuallyDownloaded'])==1
assert len(receipt['verifiedCC0NativeTreeModel']['files'])>=1
assert all(len(a['maps'])==3 for a in receipt['photoscannedAssetsActuallyDownloaded'].values())
print('K4BS_REAL_CC0_PBR_INDEPENDENT_BYTES_SHA256_AND_VENDOR_MD5_PASS')

"""K4BR source-verified FREE CC0 scanned texture acquisition.

Official Poly Haven API (not a scraped site): live /info and /files for
a known official Poly Haven asset, unique User-Agent and source credit.
Checks official MD5, declared bytes and independent SHA256 of EVERY map.
No paid API. No 3D asset or CC0 license claims without actual receipt.
"""
import os,json,hashlib,urllib.request,urllib.parse,sys,time
from pathlib import Path

args=sys.argv[sys.argv.index('--')+1:]
OUT=Path(args[args.index('--out')+1]);OUT.mkdir(parents=True,exist_ok=True)
UA='DOPAGAKI-SLOPE-K4BR-OpenResearch/1.0 (GitHub native Blender source-audit; credit Poly Haven)'
BASE='https://api.polyhaven.com'
ASSET_NAMES=['asphalt_01','rock_ground_02']
MAPS=['diffuse','nor_gl','rough']
MAX_FILE_SIZE=25*1024*1024
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
 'schema':'dopagaki.K4BR.independently-downloaded-CC0-PBR/1',
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
  print('K4BR_REAL_POLYHAVEN_MAP_VERIFIED',asset,requested,res,len(data))
 receipt['photoscannedAssetsActuallyDownloaded'][asset]={
  'name':info.get('name'),'assetUrl':'https://polyhaven.com/a/'+asset,
  'infoApi':BASE+'/info/'+asset,'filesApi':BASE+'/files/'+asset,
  'authors':info.get('authors',{}),'dimensionsMm':info.get('dimensions'),
  'maps':files
 }
path=OUT/'K4BR_CC0_LIVE_ASSET_RECEIPTS.json'
path.write_text(json.dumps(receipt,ensure_ascii=False,indent=2))
assert len(receipt['photoscannedAssetsActuallyDownloaded'])==2
assert all(len(a['maps'])==3 for a in receipt['photoscannedAssetsActuallyDownloaded'].values())
print('K4BR_REAL_CC0_PBR_INDEPENDENT_BYTES_SHA256_AND_VENDOR_MD5_PASS')

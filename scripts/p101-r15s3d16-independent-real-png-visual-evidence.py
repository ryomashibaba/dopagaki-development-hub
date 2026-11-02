#!/usr/bin/env python3
"""R15S3D16 independent REAL PNG inspector. Validates byte hashes and pixel
deltas at same source native 240Hz ticks. No brightness/delta amount is an
ART pass or a human playability proxy. Requires Pillow installed in QA.
"""
import json,hashlib,sys
from pathlib import Path
from PIL import Image,ImageChops
WORLDS=('true-pinch','pinch-switch')
NEW=('A_CASCADE_HARBOR','B_CROWNED_ACROPOLIS')
TIMES=(54,58,61,64,67)
def inspect(root):
 root=Path(root)
 doc=json.loads((root/'R15S3D16_REAL_WEBGL2_FIXED_NATIVE_TICK_CITY_VERSIONS.json').read_text())
 assert doc['schema']=='dopagaki.r15s3d16-real-original-drive3d-webgl2-macro-city-same-native-tick/1'
 assert doc['cases']==6 and not doc['errors'] and doc['formalARTApproved'] is False
 assert doc['genuineHandOperatedQA'] is False and doc['RELEASE']=='HOLD'
 assert len(doc['sessions'])==6
 sessions={(s['world'],s['mode']):s for s in doc['sessions']}
 assert set(sessions)=={(w,m) for w in WORLDS for m in ('D15R1_REFERENCE_SKYDELTA',*NEW)}
 snaps={}
 for (world,mode),s in sessions.items():
  assert s['realGPU']['webGL2'] is True
  assert len(s['realScreenshots'])==6
  for rec in s['realScreenshots']:
   name=rec['canvasPath']
   assert Path(name).name==name and name.endswith('CANVAS.png')
   file=root/name
   raw=file.read_bytes()
   assert hashlib.sha256(raw).hexdigest()==rec['canvasPngSHA256']
   assert len(raw)==rec['actualCanvasPngBytes']
   assert raw[:8]==b'\x89PNG\r\n\x1a\n'
   with Image.open(file) as im:
    assert im.format=='PNG'
    assert im.width>=800 and im.height>=550
    decoded=im.convert('RGB')
    assert decoded.getbbox() is not None
    snaps[(world,mode,rec['originalNativeTargetSeconds'])]=decoded
 changed=[]
 for world in WORLDS:
  for mode in NEW:
   significant=0
   for t in TIMES:
    base=snaps[(world,'D15R1_REFERENCE_SKYDELTA',t)]
    current=snaps[(world,mode,t)]
    assert current.size==base.size
    width,height=current.size
    # The road and original HUD remain source-stable and should not be
    # accidentally treated as art. Inspect only the center-upper viewport.
    crop=(int(width*.18),int(height*.12),int(width*.82),int(height*.72))
    a=base.crop(crop);b=current.crop(crop)
    delta=ImageChops.difference(a,b).convert('RGB')
    pixels=list(delta.getdata())
    changed_pixels=sum(max(p)>28 for p in pixels)
    fraction=round(changed_pixels/len(pixels),6)
    significant+=fraction>.018
    changed.append({'world':world,'mode':mode,'nativeTick':t*240,
     'originalCameraSameViewport':True,'roi':'x18%-82%,y12%-72%',
     'actuallyDifferentPixelFractionFromD15R1':fraction,
     'realPNGHashVerified':True,'artisticMeritCannotBeInferred':True})
   assert significant>=2,'No material center-view source WebGL city change at real native times'
 return {'schema':'dopagaki.r15s3d16-independent-real-PNG-hash-actual-central-pixel-change/1',
  'sourceRenderer':'original genuine WebGL2 240Hz', 'realPNGVerified':36,
  'matchedWorlds':list(WORLDS),'newModes':list(NEW),
  'centerScreenDeltaOnlyNotVisualQualityOrOcclusion':True,'samples':changed,
  'officialARTAccepted':0,'HUMAN':'HOLD','GAMEPLAY':'HOLD','PERFORMANCE':'HOLD','RELEASE':'HOLD'}
def main():
 root=Path(sys.argv[1]);r=inspect(root)
 out=Path(sys.argv[2]);out.mkdir(parents=True,exist_ok=True)
 (out/'R15S3D16_INDEPENDENT_SOURCE_PNG_PIXEL_EVIDENCE.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
 print('R15S3D16_SOURCE_PNG_PIXELS',json.dumps({'verifiedActualPNG':r['realPNGVerified'],
  'pairwiseNativeTicks':len(r['samples']),
  'mostVisibleChanges':sorted(r['samples'],key=lambda x:x['actuallyDifferentPixelFractionFromD15R1'],reverse=True)[:7],
  'notARTorHUMAN':True}))
if __name__=='__main__':main()

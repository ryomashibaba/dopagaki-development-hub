"""R2F5-H: compare 42 REAL source PNGs, no semantic or collision PASS."""
import json,hashlib
from pathlib import Path
from PIL import Image,ImageChops,ImageDraw
root=Path('r19-evidence/r19a6p4r2f5h')
src=json.loads((root/'R2F5H_REAL_TEMPORAL_42FRAMES.json').read_text())
assert src['actualWebGL2'] and src['errors']==[] and len(src['sessions'])==6
ticks=[1681,1801,1861,1921,1981,2041,2161]
assert src['ticks']==ticks
S={(x['mode'],x['variant']):x for x in src['sessions']}
def difference(a,b,rect):
    pix=list(ImageChops.difference(a.crop(rect),b.crop(rect)).getdata())
    return round(100*sum(max(p)>36 for p in pix)/len(pix),5)
report={'schema':'dopagaki.r2f5h-true-source-temporal-pixel-window/1',
        'sourceHz':240,'sourceTicks':ticks,'RGBThreshold':36,
        'semanticReadability':'NOT_TESTED','ART':'HOLD','B51Raster':'NOT_VERIFIED','rows':[]}
contact=Image.new('RGB',(7*380,6*170),(13,17,23))
draw=ImageDraw.Draw(contact)
for mi,mode in enumerate(('ultra','control')):
 for i,tick in enumerate(ticks):
  ims={}
  for vi,variant in enumerate(('original','f','g2')):
   sample=S[mode,variant]['samples'][i]
   assert sample['tick']==tick
   data=(root/sample['file']).read_bytes()
   assert hashlib.sha256(data).hexdigest()==sample['sha256']
   im=Image.open(root/sample['file']).convert('RGB')
   assert im.size==(1013,698)
   ims[variant]=im
   panel=im.crop((15,185,370,345))
   x=i*380+8;y=(mi*3+vi)*170+22
   contact.paste(panel,(x,y))
   draw.text((x,y-17),f'{mode} {variant} {tick}',fill=(230,230,230))
  metric={}
  for variant in ('f','g2'):
   metric[variant]={'wholeDifferencePercent':difference(ims['original'],ims[variant],(0,0,1013,698)),
      'leftCivicDifferencePercent':difference(ims['original'],ims[variant],(30,175,375,410)),
      'centralRoadDifferencePercent':difference(ims['original'],ims[variant],(375,290,825,625))}
  metric['FtoG2LeftDifferencePercent']=difference(ims['f'],ims['g2'],(30,175,375,410))
  report['rows'].append({'mode':mode,'tick':tick,'seconds':tick/240,
    'sourceSpeedMps':S[mode,'original']['samples'][i]['state']['speed'],'metrics':metric})
(root/'R2F5H_PIXEL_TIME_WINDOW_RESEARCH_ONLY.json').write_text(json.dumps(report,indent=2)+'\n')
contact.save(root/'R2F5H_REAL_CAMERA_TEMPORAL_CONTACT_SHEET.png')
print('R2F5H_NATIVE_TEMPORAL_PIXELS',json.dumps({'frames':42,'measurements':len(report['rows']),
'ART':'HOLD','semantic':'NOT_TESTED'}))

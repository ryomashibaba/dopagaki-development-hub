"""R2F5-J: actual original 240Hz WebGL2 image footprint, not ART recognition.
Old ROI can clip changing objects. Preserve source camera and original ball.
"""
import json, hashlib, copy
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw

root=Path('r19-evidence/r19a6p4r2f5j')
source=json.loads((root/'R2F5J_REAL_DENSE_78_FRAMES.json').read_text())
ticks=list(range(1801,2162,30))
assert source['ticks']==ticks and source['sourceHz']==240
assert source['sourceBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
assert source['actualWebGL2'] and source['errors']==[] and len(source['sessions'])==6
assert source['art']=='NOT_APPROVED' and source['addedColliders']==0
assert source['sourceRoads']==7 and source['originalB51']==28
sessions={(s['mode'],s['variant']):s for s in source['sessions']}
assert set(sessions)=={(m,v) for m in ('ultra','control') for v in ('original','g2','i')}
def image_of(sample):
    filename=Path(sample['file'])
    assert filename.name==sample['file'] and filename.suffix=='.png'
    raw=(root/filename).read_bytes()
    assert len(raw)==sample['bytes']
    assert hashlib.sha256(raw).hexdigest()==sample['sha256'], 'native PNG evidence corruption'
    im=Image.open(root/filename).convert('RGB')
    assert im.size==(1013,698)
    return im
def native_difference(a,b,rect):
    """Boolean native pixels with max(|RGB diff|)>36, half-open crop."""
    pix=ImageChops.difference(a.crop(rect),b.crop(rect)).getdata()
    return sum(max(p)>36 for p in pix)
def proportion(count,rect):
    return round(count*100/((rect[2]-rect[0])*(rect[3]-rect[1])),5)
def difference_bbox(a,b):
    d=ImageChops.difference(a,b)
    # Per-channel threshold -> nonzero pixel on any color channel.
    return list(d.point(lambda x:255 if x>36 else 0).getbbox() or []) or None
def validate_physics(ref,trial):
    assert ref['tick']==trial['tick']
    assert ref['state']['road']==trial['state']['road']
    assert max(abs(a-b) for a,b in zip(ref['state']['xyz'],trial['state']['xyz']))<.00015
    assert abs(ref['state']['speed']-trial['state']['speed'])<.00015
for mode in ('ultra','control'):
    for variant in ('original','g2','i'):
        s=sessions[mode,variant]
        assert len(s['samples'])==13
        i=s['initial']
        assert i['webgl2'] and i['colliders']==0
        assert i['B48']==7 and i['B51']==28
        assert i['width']==(14 if mode=='ultra' else 28)
        assert i['triangles']=={'original':10566,'g2':44568,'i':47472}[variant]
        for k,entry in enumerate(s['samples']):
            assert entry['tick']==ticks[k]
            assert entry['state']['camera']=='ball-lock-unfiltered-heading'
            assert entry['state']['status']=='running'
            validate_physics(sessions[mode,'original']['samples'][k],entry)
            image_of(entry)
# Deliberately corrupted metadata must be rejected.
fake=copy.deepcopy(sessions['ultra','i']['samples'][0])
fake['sha256']='0'*64
try:
    image_of(fake)
    raise RuntimeError('Anti-tamper test failed to detect fake SHA')
except AssertionError:
    pass
old=(30,175,375,410)
expanded=(0,155,375,410)
road=(375,290,825,625)
rows=[]
selected=[1861,1921,1981,2041,2101,2131]
sheet=Image.new('RGB',(len(selected)*405,6*235),(13,18,25))
draw=ImageDraw.Draw(sheet)
for mi,mode in enumerate(('ultra','control')):
    for k,tick in enumerate(ticks):
        images={}
        for vi,variant in enumerate(('original','g2','i')):
            sample=sessions[mode,variant]['samples'][k]
            im=image_of(sample)
            images[variant]=im
            if tick in selected:
                col=selected.index(tick)
                x=col*405+9
                y=(mi*3+vi)*235+22
                sheet.paste(im.crop((0,180,395,395)),(x,y))
                draw.text((x,y-16),f'{mode} / {variant} / {tick} ({tick/240:.3f}s)',
                          fill=(235,237,242))
        orig,g2,i=images['original'],images['g2'],images['i']
        n_old=native_difference(g2,i,old)
        n_extended=native_difference(g2,i,expanded)
        changed=difference_bbox(g2,i)
        rows.append({
            'mode':mode,'tick':tick,'seconds':tick/240,
            'g2ToIOldROIChangePercent':proportion(n_old,old),
            'g2ToIExpandedROIChangePercent':proportion(n_extended,expanded),
            'g2ToIRoadROIChangePercent':proportion(native_difference(g2,i,road),road),
            'g2ToIWholeFrameChangePercent':proportion(native_difference(g2,i,(0,0,1013,698)),(0,0,1013,698)),
            'g2ToIFullFrameChangeBBox':changed,
            'g2ToIChangesTouchFullFrameLeftEdge':changed is not None and changed[0]==0,
            'oldROIExcludedExpandedChangePercent':round(100*(n_extended-n_old)/n_extended,5) if n_extended else None,
            'g2AndIPixelIdentical':changed is None,
            'originalVsIExpandedROIChangePercent':proportion(native_difference(orig,i,expanded),expanded),
            'originalVsG2ExpandedROIChangePercent':proportion(native_difference(orig,g2,expanded),expanded)
        })
sheet.save(root/'R2F5J_TRUE_CAMERA_SELECTED_STORYBOARD.png')
report={'schema':'dopagaki.r2f5j-native-dense-spatial-camera-budget/1',
  'source':'78 true original Chromium WebGL2 screenshots','imageSize':[1013,698],
  'ticks':ticks,'sourceHz':240,'threshold':'max(|RGB difference|)>36',
  'oldROI':old,'expandedROI':expanded,'roadROI':road,
  'semanticFunctionClassification':'NOT_TESTED','ART':'REJECT_PREVIOUS_I',
  'humanGameplay':'NOT_TESTED','B48B51CCDAndPixelOcclusion':'NOT_VERIFIED',
  'PNGIntegrityVerified':78,'antiTamperTest':'PASS','rows':rows,
  'observationOnly':{}}
for mode in ('ultra','control'):
    cases=[r for r in rows if r['mode']==mode]
    last=max((r['tick'] for r in cases if not r['g2AndIPixelIdentical']),default=None)
    first=next((r['tick'] for r in cases if last is not None and r['tick']>last
                and r['g2AndIPixelIdentical']),None)
    assert not cases[0]['g2AndIPixelIdentical'] and cases[-1]['g2AndIPixelIdentical']
    report['observationOnly'][mode]={
       'lastObservedChangedTick':last,
       'firstObservedIdenticalTickAfterChange':first,
       'preciseDisappearanceTime':'UNKNOWN_BETWEEN_SAMPLES',
       'semanticReadingTimeSeconds':'NOT_MEASURED',
       'continuousVisibilityDurationSeconds':'NOT_ESTABLISHED'}
(root/'R2F5J_TRUE_NATIVE_SCREEN_BUDGET_REPORT.json').write_text(
 json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print('R2F5J_DENSE_SCREEN_BUDGET_VERIFIED',json.dumps({
 'sourceFrames':78,'measurements':len(rows),'bounds':report['observationOnly'],
 'humanSemanticART':'NOT_APPROVED'},ensure_ascii=False))

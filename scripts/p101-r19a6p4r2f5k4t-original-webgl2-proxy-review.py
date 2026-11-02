"""K4T: real original A5 WebGL2 screenshots + approximation-only site envelope.
No new 3D geometry, game change, fake screenshot, or ART claim. Original SHA and
camera must match the K + K4R separate native capture evidence before drawing.
Each 1013x698 panel remains an authentic original image with clearly labelled
non-rendered projected bounding-box annotation drawn in a separate offline layer.
"""
import json, hashlib, math, os, sys
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont

SOURCE='af076d67492a677d2235e4730aef8cdf4808e106'
def arg(name):
    a=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else sys.argv[1:]
    return a[a.index(name)+1]
src=Path(arg('--k4r-folder'))
road_cam=Path(arg('--k-camera'))
k4s_file=Path(arg('--k4s-report'))
out=Path(arg('--output'))
out.mkdir(parents=True,exist_ok=True)
def read(path):return json.loads(path.read_text(encoding='utf8'))
def sha(raw):return hashlib.sha256(raw).hexdigest()
k=read(road_cam); k4r=read(src/'K4R_REAL_ORIGINAL_WEBGL2_16_IMAGES.json'); ks=read(k4s_file)
assert k['sourceBlob']==k4r['sourceBlob']==ks['originalSourceBlob']==SOURCE
assert k['Hz']==k4r['Hz']==ks['sourceHz']==240
assert ks['realCameraCountPerWidth']==21 and ks['originalRealRoadsCoveredPerWidth']==7
assert k['roadCount']==k4r['sourceB48']==7 and k['B51']==k4r['sourceB51']==28
assert k['errors']==k4r['errors']==[]
assert ks['bvhOriginalOnly'] and ks['addedColliders']==0 and ks['newBlenderModels']==0
assert ks['ART']=='HOLD' and ks['officialArtAccepted']==0 and ks['slope2DNARecognizedMetres']==0
assert len(ks['cases'])==8
sites=['ROAD0_K4R_BASELINE','ROAD0_RIGHT_LATER']
cases=[next(c for c in ks['cases'] if c['id']==site) for site in sites]
assert [(x['road'],x['u'],x['side'],x['offset']) for x in cases]==[
    (0,.75,'right',70),(0,.85,'right',70)]
ticks=[265,721,1057,1249]
def font(size):
    for path in ('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
        '/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf'):
        if Path(path).exists(): return ImageFont.truetype(path,size)
    return ImageFont.load_default()
f1=font(18);f2=font(14)
def make_panel(original, row, site, label):
    from io import BytesIO
    image=Image.open(BytesIO(original)).convert('RGB')
    assert image.size==(1013,698)
    # Overlays are annotations, never pretend to be the building raster.
    overlay=Image.new('RGBA',image.size,(0,0,0,0))
    d=ImageDraw.Draw(overlay)
    box=row['surrogateProjectedBBox']
    assert box is not None and len(box)==5
    left,top,right,bottom,area=box
    x0=max(0,round(left));y0=max(0,round(top))
    x1=min(1012,round(right));y1=min(697,round(bottom))
    if x1>x0 and y1>y0:
        d.rectangle((x0,y0,x1,y1),outline=(255,216,100,245),width=4)
        d.line((x0,y0,x1,y1),fill=(255,216,100,85),width=1)
        d.line((x1,y0,x0,y1),fill=(255,216,100,85),width=1)
    canvas=Image.alpha_composite(image.convert('RGBA'),overlay)
    d=ImageDraw.Draw(canvas)
    d.rectangle((0,0,1012,82),fill=(10,12,20,235))
    d.text((14,6),f'{label}  |  Road0 @ native tick {row["tick"]}',font=f1,fill='white')
    d.text((14,35),f'A5-clear shell {row["shellSourceA5UnblockedSamples"]}/{row["shellInFrameSamples"]} in-frame; '
      f'court {row["courtSourceA5UnblockedSamples"]}/{row["courtInFrameSamples"]} in-frame',font=f2,fill=(235,235,225))
    d.text((14,57),'GOLD RECTANGLE = K2 APPROXIMATE PROXY BBOX, NOT AN ACTUAL BUILDING',font=f2,fill=(255,216,100))
    d.rectangle((0,673,1012,697),fill=(10,12,20,225))
    d.text((12,676),'ACTUAL ORIGINAL A5 WEBGL2 IMAGE | original camera, physics and original geometry unchanged',font=f2,fill=(240,240,245))
    return canvas.convert('RGB')
sessions={m:{'k':next(s for s in k['sessions'] if s['mode']==m),
             'k4r':next(s for s in k4r['sessions'] if s['mode']==m and s['variant']=='original')}
          for m in ('ultra','control')}
results=[]
for mode in ('ultra','control'):
    panels=[]
    for tick in ticks:
        from_k=next(x for x in sessions[mode]['k']['observed'] if x['tick']==tick)
        from_k4r=next(x for x in sessions[mode]['k4r']['samples'] if x['tick']==tick)
        for field in ('cameraEye','cameraFront','xyz'):
            assert math.dist(from_k['state'][field],from_k4r['state'][field])<.002,(mode,tick,field)
        assert abs(from_k['state']['speed']-from_k4r['state']['speed'])<.001
        original_path=src/from_k4r['png']
        raw=original_path.read_bytes()
        assert len(raw)==from_k4r['bytes'] and sha(raw)==from_k4r['sha256']
        pair=[]
        for c,label in zip(cases,('FORMER u=0.75 RIGHT +70m','RESEARCH u=0.85 RIGHT +70m')):
            match=next(r for r in c['results'] if r['mode']==mode and r['tick']==tick)
            assert match['originalSourceRoad']==from_k['state']['road']
            assert match['sourceFrameSha256']==from_k['sha256']
            assert match['shellInFrameSamples']>=match['shellSourceA5UnblockedSamples']
            assert match['courtInFrameSamples']>=match['courtSourceA5UnblockedSamples']
            pair.append(make_panel(raw,match,c,label))
            results.append(dict(mode=mode,tick=tick,site=c['id'],
                originalSourceFrameSha=from_k['sha256'],
                originalA5WebGL2PNG=from_k4r['png'],
                originalA5PNGSha256=sha(raw),
                surrogateRectangle=match['surrogateProjectedBBox'],
                shellVisibleUnblocked=match['shellSourceA5UnblockedSamples'],
                courtVisibleUnblocked=match['courtSourceA5UnblockedSamples'],
                actualCandidateRaster=False,proxyOnly=True))
        outpng=out/f'K4T_{mode}_{tick}_SAME_ORIGINAL_WEBGL2_TWOSITE_PROXY_COMPARISON.png'
        compare=Image.new('RGB',(2026,698))
        compare.paste(pair[0],(0,0));compare.paste(pair[1],(1013,0))
        compare.save(outpng,optimize=True)
        panels.append(compare)
    contact=Image.new('RGB',(2026,698*len(panels)))
    for i,p in enumerate(panels):contact.paste(p,(0,i*698))
    contact.save(out/f'K4T_{mode}_4TICK_TRUE_ORIGINAL_WEBGL2_PROXY_SITE_SHEET.jpg',quality=87,subsampling=0)
assert len(results)==16
for mode in ('ultra','control'):
    for tick in ticks:
        old=next(x for x in results if x['mode']==mode and x['tick']==tick and x['site']==sites[0])
        trial=next(x for x in results if x['mode']==mode and x['tick']==tick and x['site']==sites[1])
        assert trial['courtVisibleUnblocked']==9
        assert trial['shellVisibleUnblocked']>=60
        if tick==1249:
            assert old['shellVisibleUnblocked']<=28 and old['courtVisibleUnblocked']<=2
report=dict(schema='dopagaki.k4t-source-original-a5-image-annotated-proxy-only/1',
 sourceBlob=SOURCE,sourceHz=240,sourceB48=7,sourceB51=28,
 originalCamera='ball-lock-unfiltered-heading',
 originalKCameraSHA256=sha(road_cam.read_bytes()),
 k4rOriginalA5ReportSHA256=sha((src/'K4R_REAL_ORIGINAL_WEBGL2_16_IMAGES.json').read_bytes()),
 originalK4SStudySHA256=sha(k4s_file.read_bytes()),screenshotsUsed=8,
 panelComparisonsProduced=8,contactSheets=2,results=results,
 annotationWarning='BBOX IS SURROGATE K2 PROJECTION, NOT CANDIDATE RENDER AND NOT PIXEL PRECISE',
 visualSiteCandidate='ROAD0_RIGHT_LATER_PROXY_ONLY',
 originalCityVisibility='ONLY_ORIGINAL_A5_MESHES__NOT_B48_B51_TERRAIN',
 originalPhysicsModified=False,newModels=0,newColliders=0,
 humanTest='NOT_RUN',safetySAT='NOT_RUN',ccd='NOT_RUN',
 art='HOLD',officialArtAcceptance=0,slope2DNARecognizedM=0,
 release='HOLD',merge='HOLD')
(out/'K4T_REAL_SOURCE_WEBGL2_PROXY_REVIEW.json').write_text(
 json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('K4T_EIGHT_GENUINE_A5_FRAMES_PROXY_COMPARISON_LIMITED_PASS',json.dumps({
 'imagesVerified':8,'comparisonsProduced':8,'sheetsProduced':2,
 'sourceOriginalNoChange':True,'ART':'HOLD','human':'HOLD'}))

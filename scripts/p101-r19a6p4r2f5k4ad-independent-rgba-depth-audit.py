"""K4AD independent native in-render depth and original source PNG auditor.

Synchronous depth samples can prove GPU readback *capability* only.
They cannot prove true per-object ID, 3D safety, human ART recognition,
public-void connections, a finished race, or game release fitness.
"""
import argparse,hashlib,json,math
from pathlib import Path
import numpy as np
from PIL import Image
SRC='af076d67492a677d2235e4730aef8cdf4808e106'
TICKS=(10680,10800,10920,11040,11160,11280,11400)
MODES=('ultra','control')
MASKS=('without-epic','without-mega','without-frames',
       'without-B48-and-fixtures-visuals','without-B51-bodies','without-road-optics')
P74_CSS=(200,418,810,590)
def sha(data):return hashlib.sha256(data).hexdigest()
def img(file,expected_sha,expected_bytes):
    raw=file.read_bytes()
    assert sha(raw)==expected_sha and len(raw)==expected_bytes,(str(file),'sha/bytes drift')
    a=np.asarray(Image.open(file).convert('RGB'),dtype=np.uint8)
    assert a.shape==(698,1013,3),(str(file),a.shape)
    return a
def source_png_equals_outside_css(a,b,chapter=None):
    # Original P74 near-miss HUD is known to animate at the fixed CSS rect.
    # The source HTML separately defines #chapterHud: class=chapter,
    # position:absolute; left:50%; top:20px. Its text raster can shift by
    # exactly 1 RGB level at a few glyph anti-aliased edge pixels.
    # Do NOT broaden either area to cover the underlying 3D world.
    kept=np.ones((698,1013),dtype=bool)
    x0,y0,x1,y1=P74_CSS
    kept[y0:y1,x0:x1]=False
    top=np.zeros((698,1013),dtype=bool)
    if chapter is not None:
        assert chapter['id']=='chapterHud'
        assert chapter['className']=='chapter'
        assert chapter['position']=='absolute'
        assert chapter['pointerEvents']=='none'
        assert 'PRISM SKY CREST' in chapter['text']
        rect=chapter['rect']
        assert len(rect)==4
        left,upper,right,lower=(float(x) for x in rect)
        # Independently pinned bounds from original, unedited
        # web/drive3d.html chapter CSS and 1013x698 genuine source view.
        assert 300<=left<=420 and 600<=right<=720
        assert 18<=upper<=23 and 55<=lower<=90
        assert 240<=right-left<=400 and 35<=lower-upper<=70
        import math
        l=max(0,math.floor(left));u=max(0,math.floor(upper))
        r=min(1013,math.ceil(right));d=min(698,math.ceil(lower))
        top[u:d,l:r]=True
    diff=np.any(a!=b,axis=2)
    top_change=int(np.count_nonzero(diff&top))
    # A source glyph anti-alias correction is only acceptable for up to
    # exactly 3 original-text pixels changing by 1/channel. Any larger
    # change, even within the text HUD, is a strict FAIL.
    if chapter is not None:
        assert top_change<=3,('CHAPTER_HUD_NON_GLYPH_DRIFT',top_change)
        if top_change:
            max_delta=int(np.max(np.abs(a.astype(np.int16)-b.astype(np.int16))[top]))
            assert max_delta<=1,('CHAPTER_HUD_MORE_THAN_1_RGB_LEVEL',max_delta)
        kept[top]=False
    outside=int(np.count_nonzero(diff&kept))
    assert outside==0,('SOURCE_3D_OR_NONHUD_PIXEL_DRIFT',outside)
    return dict(exactFullRGB=bool(not diff.any()),
       sourcePixelsOutsideIndependentlyPinnedHUDCompared=int(kept.sum()),
       originalChapterHudGlyphAntialiasPixels=top_change,
       chapterHudMaxAllowedRGBDelta=1,
       native3DOrNonHUDPixelsChanged=outside,
       originalAnimatedP74HudPixelsChanged=int(np.count_nonzero(diff&~kept&~top)))
def check_depth(depth):
    assert type(depth.get('available')) is bool
    if not depth['available']:
        assert depth.get('reason'),('unavailable depth must record failure',depth)
        return dict(status='DEPTH_READBACK_UNAVAILABLE_HOLD',
                    reason=depth['reason'],samples=0)
    assert isinstance(depth.get('width'),int) and isinstance(depth.get('height'),int)
    assert depth['width']>=100 and depth['height']>=100
    assert depth['stride']==8
    samples=depth['samples']
    count=math.ceil(depth['width']/8)*math.ceil(depth['height']/8)
    assert isinstance(samples,list) and len(samples)==count
    assert all(type(x) is int and 0<=x<=4294967295 for x in samples)
    assert len(set(samples))>1,'all depth samples identical is not trustworthy'
    assert depth['nonlinearDepth'] is True
    assert depth['method']=='ORIGINAL_GPU_MESH_RGBA8_DEPTH24_REPLAY'
    assert depth['originalVertexShader'] is True
    assert depth['physicalSafetyVerified'] is False
    assert depth['perObjectIDs'] is False
    return dict(status='NONLINEAR_DEPTH_SAMPLES_CANDIDATE',samples=len(samples))
def check_provenance(record,tick,mask):
    assert record['tick']==tick and record['mask']==mask
    assert record['provenance']=='SAME_NATIVE_FRAME_REPLAY_ORIGINAL_GPU_MESHES_TO_RGBA8_FBO'
    assert isinstance(record['seq'],int) and record['seq']>0
    assert record['sourceRoad']=='p93-PRISM_CREST-01'
def diff_depth(a,b):
    if not a['available'] or not b['available']:
        return {'status':'DEPTH_UNAVAILABLE_HOLD'}
    assert a['width']==b['width'] and a['height']==b['height']
    assert a['stride']==b['stride']
    xs=a['samples'];ys=b['samples']
    assert len(xs)==len(ys)
    changed=sum(x!=y for x,y in zip(xs,ys))
    farther=sum(y>x for x,y in zip(xs,ys))
    nearer=sum(y<x for x,y in zip(xs,ys))
    return dict(status='SAMPLED_NATIVE_DEPTH_AB_DIFFERENCE_ONLY',
                samples=len(xs),changed=changed,fartherOnMasked=farther,
                nearerOnMasked=nearer,changedFraction=changed/len(xs))
def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--k4z-dir',required=True)
    parser.add_argument('--k4ad-dir',required=True)
    args=parser.parse_args()
    ground=Path(args.k4z_dir);current=Path(args.k4ad_dir)
    ref=json.loads((ground/'K4Z_ORIGINAL_SOURCE_DENSE_7ROAD_CAMERA.json').read_text())
    experiment=json.loads((current/'K4AD_GENUINE_NATIVE_IN_RENDER_DEPTH_REPORT.json').read_text())
    assert experiment['originalSourceBlob']==ref['sourceBlob']==SRC
    assert experiment['Hz']==ref['Hz']==240
    assert experiment['B48']==ref['sourceB48']==7
    assert experiment['B51']==ref['sourceB51']==28
    assert ref['errors']==experiment['errors']==[]
    assert len(ref['sessions'])==len(experiment['sessions'])==2
    assert experiment['capture']=='SAME_NATIVE_FRAME_REPLAY_ORIGINAL_GPU_MESHES_TO_RGBA8_FBO'
    assert experiment['sourceContextExpectedPreserveDrawingBuffer'] is False
    assert experiment['newModels']==experiment['newColliders']==0
    assert experiment['physicsChanged'] is experiment['cameraChanged'] is False
    assert experiment['originalSourceGameChanged'] is False
    assert experiment['originalA5Rendered'] is False
    assert experiment['ART']=='NOT_TESTED_HOLD'
    assert experiment['objectIds']=='NOT_MEASURED'
    assert experiment['officialARTAccepted']==experiment['slope2DNAMetres']==0
    assert experiment['RELEASE']==experiment['MERGE']=='HOLD'
    orig_count=0
    for s in ref['sessions']:
        assert len(s['frames'])==41
        for f in s['frames']:
            raw=(ground/f['file']).read_bytes()
            assert len(raw)==f['bytes'] and sha(raw)==f['sha256']
            orig_count+=1
    assert orig_count==82
    results=[]
    full_identical=0
    native_reproductions=0
    successful_depth_uses=0
    mask_depth_uses=0
    for mode in MODES:
        baseline=next(s for s in ref['sessions'] if s['mode']==mode)
        data=next(s for s in experiment['sessions'] if s['mode']==mode)
        assert data['trueOriginalWebGLContext']['webgl2'] is True
        assert data['trueOriginalWebGLContext']['preserveDrawingBuffer'] is False
        assert len(data['frames'])==7 and len(data['masks'])==6
        assert tuple(f['tick'] for f in data['frames'])==TICKS
        assert tuple(m['mask'] for m in data['masks'])==MASKS
        assert data['errors']==[]
        checked=[]
        seqs=[]
        for f in data['frames']:
            tick=f['tick']
            reference=next(x for x in baseline['frames'] if x['tick']==tick)
            assert f['source']['tick']==tick and f['source']['paused']==tick
            assert f['source']['road']==reference['state']['road']=='p93-PRISM_CREST-01'
            assert f['source']['sourceB51']==28
            assert f['source']['effectiveMask']=='none'
            assert f['source']['audit']['sourceBlob']==SRC
            assert f['source']['audit']['originalSceneA5R19A3OverlayRendered'] is False
            check_provenance(f['captureProof'],tick,'none')
            seqs.append(f['captureProof']['seq'])
            exact=img(ground/reference['file'],reference['sha256'],reference['bytes'])
            native=img(current/f['originalPNG']['file'],
                       f['originalPNG']['sha256'],f['originalPNG']['bytes'])
            pixels=source_png_equals_outside_css(exact,native,f['chapterHUD'])
            assert f['k4zTrueOriginal']['sha256']==reference['sha256']
            assert f['k4zTrueOriginal']['bytes']==reference['bytes']
            same_sha=f['originalPNG']['sha256']==reference['sha256'] and (
                f['originalPNG']['bytes']==reference['bytes'])
            assert f['fullPNGExact'] is same_sha
            full_identical+=int(same_sha)
            native_reproductions+=1
            d=check_depth(f['synchronousRenderDepth'])
            successful_depth_uses+=int(d['status']=='NONLINEAR_DEPTH_SAMPLES_CANDIDATE')
            checked.append(dict(tick=tick,seconds=tick/240,
                                png=pixels,depth=d,originalFullPNGshaSame=same_sha))
        center=next(x for x in data['frames'] if x['tick']==11040)
        source_depth=center['synchronousRenderDepth']
        compared=[]
        for m in data['masks']:
            check_provenance(m['proof'],11040,m['mask'])
            seqs.append(m['proof']['seq'])
            assert m['sourceSameBallCameraAnd240HzTick'] is True
            kind=check_depth(m['synchronousDepth'])
            mask_depth_uses+=int(kind['status']=='NONLINEAR_DEPTH_SAMPLES_CANDIDATE')
            ab=diff_depth(source_depth,m['synchronousDepth'])
            assert isinstance(m['sourceDrawCensus'],dict) and m['sourceDrawCensus']
            # Independently verify that the RGBA depth replay contains exactly
            # the draw calls actually rendered by the original WebGL2 source.
            expected_suppressed={
                'without-epic':0,'without-mega':1,'without-frames':1,
                'without-B48-and-fixtures-visuals':1,
                'without-B51-bodies':28,'without-road-optics':4
            }[m['mask']]
            suppressed=sum(x.get('suppressedDrawCalls',0)
                           for x in m['sourceDrawCensus'].values())
            assert suppressed==expected_suppressed,(
                'ORIGINAL_MESH_MASK_CENSUS_MISMATCH',mode,m['mask'],suppressed)
            assert source_depth['originalDraws']==72
            assert m['synchronousDepth']['originalDraws']==72-suppressed,(
                'RGBA_REPLAY_DRAW_COUNT_MISMATCH',mode,m['mask'])
            if ab['status']!='DEPTH_UNAVAILABLE_HOLD':
                # Removing geometry may reveal farther geometry but cannot
                # add a nearer depth surface at a previously visible pixel.
                assert ab['nearerOnMasked']==0,('REMOVAL_CREATED_NEARER_DEPTH',mode,m['mask'])
                assert ab['fartherOnMasked']==ab['changed']
                if expected_suppressed:
                    assert ab['changed']>0,('MASKED_SOURCE_MESH_NOT_REFLECTED_IN_DEPTH',mode,m['mask'])
                else:
                    assert ab['changed']==0,('EPIC_WAS_NOT_DRAWN_BUT_DEPTH_CHANGED',mode)
            compared.append(dict(mask=m['mask'],depth=kind,difference=ab,
                genuineSourceDrawsSuppressed=suppressed,
                genuineRGBAReplayDraws=m['synchronousDepth']['originalDraws'],
                removalNeverCreatedNearerDepth=ab.get('nearerOnMasked',0)==0))
        assert data['restored']['proof']=='SAME_NATIVE_FRAME_REPLAY_ORIGINAL_GPU_MESHES_TO_RGBA8_FBO'
        restored=check_depth(data['restored']['depth'])
        restore_diff=diff_depth(source_depth,data['restored']['depth'])
        # If both reads are available but same pause depth changes after masks,
        # the experiment is not deterministic and must remain HOLD.
        if restore_diff['status']!='DEPTH_UNAVAILABLE_HOLD':
            assert restore_diff['changed']==0,('source native depth not restored',mode)
        original=img(current/center['originalPNG']['file'],
                     center['originalPNG']['sha256'],center['originalPNG']['bytes'])
        recovered=img(current/data['restored']['screenshot']['file'],
                      data['restored']['screenshot']['sha256'],
                      data['restored']['screenshot']['bytes'])
        restore_image=source_png_equals_outside_css(original,recovered,center['chapterHUD'])
        assert len(seqs)==13 and len(set(seqs))==13
        results.append(dict(mode=mode,originalFrames=checked,
                            sameNativeTickDrawMasks=compared,
                            restoredNativeImage=restore_image,
                            restoredDepth=restored,
                            nativeDepthDeterminism=restore_diff))
    # Negative control: force a real source-region 3D pixel change.
    a=np.zeros((698,1013,3),dtype=np.uint8)
    b=a.copy();b[300,100,1]=241
    try:source_png_equals_outside_css(a,b)
    except AssertionError:pass
    else:raise AssertionError('counterfeit 3D screen alteration NOT rejected')
    # Negative controls also guard the narrowly proven native chapter text.
    sourcehud={'id':'chapterHud','className':'chapter','position':'absolute',
      'pointerEvents':'none','text':'VI / PRISM SKY CREST +95m',
      'rect':[360,20,654,73]}
    a=np.zeros((698,1013,3),dtype=np.uint8)
    b=a.copy()
    b[33,545,2]=1
    assert source_png_equals_outside_css(a,b,sourcehud)[
      'originalChapterHudGlyphAntialiasPixels']==1
    b[33,545,2]=2
    try:source_png_equals_outside_css(a,b,sourcehud)
    except AssertionError:pass
    else:raise AssertionError('chapter text >1 level falsely accepted')
    b=a.copy()
    for x in range(545,549):b[33,x,2]=1
    try:source_png_equals_outside_css(a,b,sourcehud)
    except AssertionError:pass
    else:raise AssertionError('more than 3 chapter glyph pixels falsely accepted')
    b=a.copy();b[99,545,2]=1
    try:source_png_equals_outside_css(a,b,sourcehud)
    except AssertionError:pass
    else:raise AssertionError('3D image pixel forgery falsely accepted')
    assert check_depth({'available':False,'reason':'synthetic no depth'})['status']=='DEPTH_READBACK_UNAVAILABLE_HOLD'
    assert diff_depth({'available':False},{'available':False})['status']=='DEPTH_UNAVAILABLE_HOLD'
    independently_verified=(native_reproductions==14 and
                            successful_depth_uses==14 and mask_depth_uses==12 and
                            all(x['restoredDepth']['status']=='NONLINEAR_DEPTH_SAMPLES_CANDIDATE'
                                for x in results))
    outcome='SYNC_DEPTH_SAMPLE_TECH_CANDIDATE_ONLY' if independently_verified else (
        'SOURCE_PIXEL_PASS__DEPTH_UNAVAILABLE_OR_INCOMPLETE_HOLD')
    summary={
        'schema':'dopagaki.K4AD.independent-in-render-depth-true-source-audit/1',
        'originalK4ZAll82PNGshaVerified':orig_count,
        'originalRoad5NativePNGOutsideCSSExact':native_reproductions,
        'fullNativePNGshaSame':full_identical,
        'synchronousInRenderDepthSourceFramesAvailable':successful_depth_uses,
        'synchronousInRenderDepthMasksAvailable':mask_depth_uses,
        'nativeGPUReadbackResult':outcome,
        'confirmedPerObjectID':False,'confirmedPhysicalSafety':False,
        'confirmedPublicVoidART':False,'continuousHumanRecognition':'NOT_TESTED',
        'newModels':0,'newColliders':0,'officialARTAccepted':0,
        'slope2DNARecognizedMetres':0,'ART':'NOT_TESTED_HOLD',
        'RELEASE':'HOLD','MERGE':'HOLD','modes':results
    }
    (current/'K4AD_INDEPENDENT_GENUINE_SOURCE_GPU_AUDIT.json').write_text(
        json.dumps(summary,ensure_ascii=False,indent=2)+'\n')
    print('K4AD_TRUE_NATIVE_SOURCE_82_SHA_AND_14_OUTSIDE_CSS_PASS',native_reproductions)
    print('K4AD_DEPTH_TECH_PROBE_RESULT',outcome)
    print('K4AD_ART_NOT_TESTED_SLOPE2_DNA_0M_RELEASE_HOLD')
if __name__=='__main__':main()

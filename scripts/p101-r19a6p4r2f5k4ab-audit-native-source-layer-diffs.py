"""K4AB: independently verify true original K4Z WebGL2 pixels and source draw masks.

Original source WebGL2 must match true K4Z exactly OUTSIDE the original
0.24-second CSS NEAR MISS HUD overlay for all 14 native Road5 states. Subtractive PNGs are PRIVATE RENDER MODIFICATIONS at the same
paused physics tick. Difference masks are downstream pixel contributions,
NOT precise per-object depth, free space, collisions or ART PASS.
"""
import argparse,hashlib,json,math,csv
from pathlib import Path
import numpy as np
from PIL import Image,ImageDraw,ImageFont

SRC='af076d67492a677d2235e4730aef8cdf4808e106'
TICKS=(10680,10800,10920,11040,11160,11280,11400)
MODES=('ultra','control')
MASKS=('without-epic','without-mega','without-frames',
 'without-B48-and-fixtures-visuals','without-B51-bodies','without-road-optics')
W,H=1013,698
ROIS={'LEFT':(.08,.33,.13,.70),'CENTER':(.33,.67,.13,.70),'RIGHT':(.67,.92,.13,.70)}

# Observed in true native control/tick11280 diff: solely original P74 nearMissBurst.
# Source CSS .nearMissBurst{animation:p74pop .24s ease-out}.
# ROI covers measured x229..784,y428..573 with conservative margins.
P74_CSS_HUD_ROI=(200,418,810,590)
def geometry_pixels_mask():
 keep=np.ones((H,W),dtype=bool)
 x0,y0,x1,y1=P74_CSS_HUD_ROI
 assert 0<x0<x1<W and 0<y0<y1<H
 keep[y0:y1,x0:x1]=False
 return keep
PIXELS_OUTSIDE_P74=geometry_pixels_mask()
def strict_source_outside_hud(a,b):
 aa=np.asarray(a,dtype=np.uint8);bb=np.asarray(b,dtype=np.uint8)
 assert aa.shape==bb.shape==(H,W,3)
 diff=np.any(aa!=bb,axis=2)
 outside=int((diff & PIXELS_OUTSIDE_P74).sum())
 inside=int((diff & ~PIXELS_OUTSIDE_P74).sum())
 assert outside==0,('Original source pixels OUTSIDE the P74 HUD ROI drifted',outside)
 return {'fullScreenPNGPixelsIdentical':bool(not diff.any()),
  'differentPixelsInsideP74CSSNearMissHUD':inside,
  'differentPixelsOutsideP74CSSNearMissHUD':outside,
  'sourceWebGLAndNonAnimatedHudExact':True,
  'knownP74NearMissCSSAnimationFractionalSeconds':0.24}

def sha(data):return hashlib.sha256(data).hexdigest()
def file_png(base,ref):
 p=base/ref['file'];binary=p.read_bytes()
 assert sha(binary)==ref['sha256'] and len(binary)==ref['bytes'],(p,'PNG SHA or byte drift')
 img=Image.open(p).convert('RGB')
 assert img.size==(W,H),(p,img.size)
 return img
def font(size,bold=False):
 names=('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',) if bold else (
 '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',)
 for name in names:
  if Path(name).exists():return ImageFont.truetype(name,size)
 return ImageFont.load_default()
F12=font(12);F16=font(16);F18=font(18);F23=font(23,True)
def compare_images(a,b):
 aa=np.asarray(a,dtype=np.int16);bb=np.asarray(b,dtype=np.int16)
 assert aa.shape==bb.shape==(H,W,3)
 # Remove DOM HUD animation from ALL differences and denominators, not just from
 # the acceptance test. Pixel changes elsewhere remain full source-render truth.
 mask=(np.max(np.abs(aa-bb),axis=2)>40)
 mask &= PIXELS_OUTSIDE_P74
 eligiblePixels=int(PIXELS_OUTSIDE_P74.sum())
 stats={'screenPixelCount':int(mask.size),
   'eligibleNonAnimatedHudPixelCount':eligiblePixels,
   'knownAnimatedHudExclusionPixelROI':list(P74_CSS_HUD_ROI),
   'changedOver40Px':int(mask.sum()),
   'changedFraction':round(float(mask.sum()/eligiblePixels),6),
   'meanAbsChannelDifference':round(float(np.abs(aa-bb)[PIXELS_OUTSIDE_P74].mean()),6),
   'notSemanticSegmentationOrDepthBuffer':True,'byROI':{}}
 for name,(xa,xb,ya,yb) in ROIS.items():
  x0=int(W*xa);x1=int(W*xb);y0=int(H*ya);y1=int(H*yb)
  m=mask[y0:y1,x0:x1]
  valid=PIXELS_OUTSIDE_P74[y0:y1,x0:x1]
  assert valid.sum()>0
  stats['byROI'][name]={'rawROIpx':int(m.size),'eligiblePx':int(valid.sum()),
    'changedOver40Px':int(m.sum()),
    'fraction':round(float(m.sum()/valid.sum()),6)}
 return stats
def summary_sheet(out,mode,rows,census):
 # Two images per row are authentic screenshots of the SAME original paused
 # source state: unmodified baseline and private renderer-only mask variant.
 # No candidate model / person / fabricated unobserved frame.
 h=120+len(rows)*478
 canvas=Image.new('RGB',(1170,h),(246,249,252))
 d=ImageDraw.Draw(canvas)
 d.rectangle((0,0,1170,115),fill=(17,31,46))
 d.text((20,8),'K4AB | '+mode.upper()+' | GPU ORIGINAL DRAW GROUPS',font=F23,fill='white')
 d.text((20,45),'SAME SOURCE PAUSE AT TICK11040 / 46.0s: original vs research-only subtraction',
        font=F16,fill=(213,233,247))
 d.text((20,76),'Original source 3D exact OUTSIDE animated CSS HUD. Not object depth or site clearance.',
        font=F12,fill=(228,235,242))
 for i,row in enumerate(rows):
  y=119+i*478
  d.rounded_rectangle((9,y,1160,y+469),radius=12,fill='white',outline=(195,210,220),width=2)
  d.text((25,y+9),row['mask'],font=F23,fill=(28,43,57))
  d.text((26,y+39),'Changed RGB>40: '+f"{row['difference']['changedFraction']*100:.3f}%"+' | Original geometry unchanged',
        font=F16,fill=(65,83,98))
  original=row['baselineImage'].resize((551,380),Image.Resampling.LANCZOS)
  masked=row['maskedImage'].resize((551,380),Image.Resampling.LANCZOS)
  canvas.paste(original,(20,y+66));canvas.paste(masked,(593,y+66))
  d.rectangle((20,y+66,570,y+100),fill=(9,20,30))
  d.text((32,y+72),'UNMODIFIED TRUE ORIGINAL WebGL2',font=F16,fill='white')
  d.rectangle((593,y+66,1144,y+100),fill=(9,20,30))
  d.text((605,y+72),'PRIVATE MASKED WebGL2 - NOT ORIGINAL',font=F16,fill=(255,229,175))
  labels='/'.join(x['layer'] for x in row['suppressedOriginalSourceLayers'])
  d.text((25,y+453),labels[:120],font=F12,fill=(79,87,100))
 name='K4AB_'+mode+'_TRUE_11040_ORIGINAL_VS_PRIVATE_SOURCE_DRAW_GROUPS.png'
 canvas.save(out/name,optimize=True)
 return name

def main():
 p=argparse.ArgumentParser()
 for arg in ('k4z-dir','k4ab-dir','output'):p.add_argument('--'+arg,required=True)
 a=p.parse_args()
 k4zdir=Path(a.k4z_dir);k4abdir=Path(a.k4ab_dir)
 out=Path(a.output);out.mkdir(parents=True,exist_ok=True)
 original=json.loads((k4zdir/'K4Z_ORIGINAL_SOURCE_DENSE_7ROAD_CAMERA.json').read_text())
 audit=json.loads((k4abdir/'K4AB_TRUE_ORIGINAL_RENDERED_SOURCE_DRAW_PROVENANCE.json').read_text())
 assert original['sourceBlob']==audit['sourceBlob']==SRC
 assert original['errors']==audit['errors']==[]
 assert original['Hz']==audit['sourceHz']==240
 assert original['sourceB48']==audit['sourceB48']==7
 assert original['sourceB51']==audit['sourceB51']==28
 assert original['oneContinuousPhysicalRunPerMode']
 assert audit['originalA5SceneRendered'] is False
 assert audit['originalCameraAndPhysicsUnchanged'] and not audit['sourceNativeGameModified']
 assert audit['sourceOriginalK4ZPNGCountCompared']==14
 assert 0<=audit['sourceOriginalK4ZPNGCountMatched']<=14
 assert audit['cssP74NearMissHUDHasPoint24SecondPopAnimation'] is True
 assert audit['nativeSourcePixelsOutsideKnownAnimatedHUDMustMatchExactly'] is True
 assert audit['cssHUDPixelExclusionROI']==dict(zip(('x0','y0','x1','y1'),P74_CSS_HUD_ROI))
 assert len(audit['baselineSourceFrames'])==0 # source frames held in sessions only
 assert len(audit['sessions'])==2
 assert audit['candidateArchitectureCreated']==audit['newColliders']==0
 assert audit['officialARTAccepted']==audit['slope2DNARecognizedMetres']==0
 assert audit['independentART']=='NOT_TESTED_HOLD'
 assert audit['priorK4RAndK4UART']=='REJECT'
 assert tuple(audit['nativeCameraRoad5Ticks'])==TICKS
 assert tuple(audit['diagnosticMasks'])==MASKS
 source_count=0;result={
  'schema':'dopagaki.k4ab-source-original-webgl2-actual-draw-contribution-audit/1',
  'sourceBlob':SRC,'sourceHz':240,'sourceB48':7,'sourceB51':28,
  'genuineOriginalK4ZPNGshaVerified':82,
  'sameSourceK4ZFrameOutsideP74HUDPixelIdentical':14,
  'fullSourcePNGshaMatchedCount':audit['sourceOriginalK4ZPNGCountMatched'],
  'originalP74NearMissHUDExcludedROI':list(P74_CSS_HUD_ROI),
  'masksActuallySubtractiveAtIdenticalPausedCameraAndBall':12,
  'allOriginalRoad5ScenePixelsOutsideCSSHUDSameAfterInstrumentation':True,
  'privateMaskedScreenshotsNotOriginalSource':True,
  'maskDifferenceOnlyMeasuresDownstreamFramebufferContribution':True,
  'sourceA5OverlayRendered':False,
  'sourceActualGroupLabelsAreDrawBufferRegistrationsNotFullOcclusionDepth':True,
  'noRoadOrB51PhysicsChanges':True,'newModels':0,'addedColliders':0,
  'candidateGLB':'NOT_CREATED','officialARTAccepted':0,
  'slope2DNARecognizedMetres':0,'art':'NOT_TESTED_HOLD','historicalK4RAndK4UART':'REJECT',
  'human':'NOT_TESTED','SAT':'NOT_RUN','CCD':'NOT_RUN','walkability':'NOT_RUN',
  'FPS':'HOLD','RELEASE':'HOLD','MERGE':'HOLD','unknowns':[
   'actual GPU depth and per-object pixel labels were NOT captured',
   'static screenshots do not prove continuous human-readable time',
   'masks remove draw groups ONLY; original B48/B51 physical colliders remain unchanged',
   'screen changed fraction cannot prove road-adjacent site constructibility',
   'real architectural entrance/middle/back and usable public void NOT created',
   'A5 civic overlay absent from original K4Z source renderer'
  ],'byMode':[],'maskEvidence':[],'reviewSheets':[],
  'originalBaselinePixelAudits':[],'restoredMaskPixelAudits':[],'errors':[]
 }
 for sess in original['sessions']:
  assert len(sess['frames'])==41
  for fr in sess['frames']:
   file_png(k4zdir,fr);source_count+=1
 assert source_count==82
 for mode in MODES:
  group=next(s for s in audit['sessions'] if s['mode']==mode)
  origin=next(s for s in original['sessions'] if s['mode']==mode)
  assert len(group['shots'])==7 and len(group['maskShots'])==len(MASKS)
  assert group['baselineAllSevenK4ZCompared'] is True
  assert group['baselineAllSevenK4ZShaMatches']==all(
   shot['imageExactByteReproductionOfK4Z'] for shot in group['shots'])
  for shot in group['shots']:
   ref=next(x for x in origin['frames'] if x['tick']==shot['tick'])
   assert shot['sourceRoad']=='p93-PRISM_CREST-01'
   assert shot['matchingK4ZTruePNGsha']==ref['sha256']
   assert shot['imageExactByteReproductionOfK4Z']==(
    shot['originalSourceNativeImage']['sha256']==ref['sha256'] and
    shot['originalSourceNativeImage']['bytes']==ref['bytes'])
   aimg=file_png(k4abdir,shot['originalSourceNativeImage'])
   bimg=file_png(k4zdir,ref)
   sameSourcePixels=strict_source_outside_hud(aimg,bimg)
   result['originalBaselinePixelAudits'].append({
    'mode':mode,'tick':shot['tick'],'sourceFullPNGSHAEqual':
     shot['imageExactByteReproductionOfK4Z'],**sameSourcePixels})
   stats=shot['originalState']['audit']
   assert stats['sourceB48']==7 and stats['sourceB51']==28
   assert stats['mask']=='none' and not stats['privateVisualLayerSuppressionOnly']
   assert stats['originalSceneA5R19A3OverlayRendered'] is False
   assert stats['sourceGeometryAndPhysicsUnchanged']
   counts=stats['originalSceneLayers']
   assert counts['B48_AND_FIXTURES_RENDER_SKIN']['renderedDrawCalls']>0
   assert counts['B51_BODY']['renderedDrawCalls']>=28
   # No speculative renderer group is asserted to exist: missing groups are data.
   # EPIC can be uninstantiated in this original stage despite a source draw command.
   assert counts['A13_MACHINE_FRAMES_AND_W9_HERO']['renderedDrawCalls']>0
  baseline=next(x for x in group['shots'] if x['tick']==11040)
  origin_img=file_png(k4abdir,baseline['originalSourceNativeImage'])
  restored_img=file_png(k4abdir,group['postMaskRestoredPNG'])
  restoredPixelGate=strict_source_outside_hud(origin_img,restored_img)
  result['restoredMaskPixelAudits'].append({
   'mode':mode,'tick':11040,
   'originalFullPNGSHAEqualAfterRestoringMask':group['restoredFullScreenshotSHAEqual'],
   **restoredPixelGate})
  sheet_rows=[];zone_reports=[]
  for mask in MASKS:
   masked=next(x for x in group['maskShots'] if x['mask']==mask)
   assert masked['tick']==11040
   assert masked['sourceBaselineSha']==baseline['originalSourceNativeImage']['sha256']
   assert masked['sourceUnchangedRelativeToBaseline']
   assert masked['viewIsPrivateSubtractiveNotOriginal']
   assert masked['sourceCameraEye']==baseline['originalState']['cameraEye']
   assert masked['sourceCameraFront']==baseline['originalState']['cameraFront']
   assert masked['sourceBallXYZ']==baseline['originalState']['xyz']
   assert masked['sourceRoad']==baseline['sourceRoad']
   assert math.isclose(masked['sourceSpeedMps'],baseline['originalState']['speed'],abs_tol=1e-6)
   if masked['sourceGroupStatus']=='NOT_DRAWN_IN_THIS_SOURCE_FRAME':
    assert len(masked['suppressedOriginalSourceLayers'])==0
   else:
    assert masked['sourceGroupStatus']=='ACTUAL_DRAW_CALL_SUPPRESSED'
    assert len(masked['suppressedOriginalSourceLayers'])>0
   img=file_png(k4abdir,masked['image'])
   compare=compare_images(origin_img,img)
   if masked['sourceGroupStatus']=='NOT_DRAWN_IN_THIS_SOURCE_FRAME':
    assert compare['changedOver40Px']==0
   stat={'mode':mode,'tick':11040,'mask':mask,
     'trueSourceImageSha':baseline['originalSourceNativeImage']['sha256'],
     'maskedResearchImageSha':masked['image']['sha256'],
     'pixelDifference':compare,
     'suppressedOriginalSourceLayers':masked['suppressedOriginalSourceLayers'],
     'sourceGroupStatus':masked['sourceGroupStatus'],
     'maskRemovedActualNativeDrawCallsNotPhysics':True,
     'baselineNativeCameraAndBallExactlySame':True,
     'pixelDifferenceNotObjectVisibilityOrFreeSpaceCertification':True}
   result['maskEvidence'].append(stat)
   zone_reports.append({'mode':mode,'mask':mask,
     'changedFraction':compare['changedFraction'],
     'removedDrawGroups':[x['layer'] for x in masked['suppressedOriginalSourceLayers']],
    'sourceGroupStatus':masked['sourceGroupStatus']})
   sheet_rows.append({**masked,'baselineImage':origin_img,'maskedImage':img,'difference':compare})
  image_name=summary_sheet(out,mode,sheet_rows,baseline['originalState']['audit']['originalSceneLayers'])
  result['reviewSheets'].append(image_name)
  result['byMode'].append({'mode':mode,
   'sourceOriginalK4ZOutsideAnimatedHUDPixelsMatched':7,
   'fullOriginalSourcePNGshaMatchedCount':sum(
     x['imageExactByteReproductionOfK4Z'] for x in group['shots']),
   'actualSourceLayerDrawCallCensusAt11040':baseline['originalState']['audit']['originalSceneLayers'],
   'samePoseSixSubtractionMaskTests':zone_reports,
   'restoredSourceSHA':group['postMaskRestoredPNG']['sha256'],
   'art':'NOT_TESTED_HOLD'})
 assert len(result['maskEvidence'])==12 and len(result['reviewSheets'])==2
 assert len(result['originalBaselinePixelAudits'])==14
 assert all(x['differentPixelsOutsideP74CSSNearMissHUD']==0 for x in result['originalBaselinePixelAudits'])
 assert len(result['restoredMaskPixelAudits'])==2
 assert all(x['differentPixelsOutsideP74CSSNearMissHUD']==0 for x in result['restoredMaskPixelAudits'])
 assert all(s['baselineNativeCameraAndBallExactlySame'] for s in result['maskEvidence'])
 assert result['art']=='NOT_TESTED_HOLD'
 with (out/'K4AB_ACTUALLY_RENDERED_ORIGINAL_SOURCE_GROUPS_AND_PIXEL_DIFFS.json').open('w') as fd:
  json.dump(result,fd,indent=2,ensure_ascii=False);fd.write('\n')
 with (out/'K4AB_RESEARCH_ONLY_LAYER_DIFFS.csv').open('w',newline='') as fd:
  writer=csv.writer(fd)
  writer.writerow(['mode','tick','research_only_suppressed_original_group','source_scene_pixel_diff_fraction',
     'original_source_sha','diagnostic_mask_sha'])
  for record in result['maskEvidence']:
   writer.writerow([record['mode'],11040,record['mask'],
    record['pixelDifference']['changedFraction'],
    record['trueSourceImageSha'],record['maskedResearchImageSha']])
 print('K4AB_SOURCE_FRAME_14_OUTSIDE_CSS_HUD_BITWISE_REPRO_AND_12_MASK_PIXEL_DIFF_TECH_LIMITED_PASS',
  json.dumps({'K4ZOriginalAllFramesSHA':82,'originalSourceOutsideAnimatedHUDBitExact':14,
   'fullSourcePNGshaMatchedCount':audit['sourceOriginalK4ZPNGCountMatched'],
   'privateSourceMasks':12,'sheets':result['reviewSheets'],
   'byMode':[{ 'mode':x['mode'],
    'diffs':[{q['mask']:q['changedFraction']} for q in x['samePoseSixSubtractionMaskTests']]}
    for x in result['byMode']],
   'art':'NOT_TESTED_HOLD','candidateModels':0}))
if __name__=='__main__':main()

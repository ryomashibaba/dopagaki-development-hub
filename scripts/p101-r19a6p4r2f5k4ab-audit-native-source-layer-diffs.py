"""K4AB: independently verify true original K4Z WebGL2 pixels and source draw masks.

Original baseline WebGL2 must exactly match true K4Z PNG SHA for 14 native
Road5 states. Subtractive PNGs are PRIVATE RENDER MODIFICATIONS at the same
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
 mask=(np.max(np.abs(aa-bb),axis=2)>40)
 stats={'screenPixelCount':int(mask.size),'changedOver40Px':int(mask.sum()),
   'changedFraction':round(float(mask.mean()),6),
   'meanAbsChannelDifference':round(float(np.abs(aa-bb).mean()),6),
   'notSemanticSegmentationOrDepthBuffer':True,'byROI':{}}
 for name,(xa,xb,ya,yb) in ROIS.items():
  x0=int(W*xa);x1=int(W*xb);y0=int(H*ya);y1=int(H*yb)
  m=mask[y0:y1,x0:x1]
  stats['byROI'][name]={'count':int(m.size),'changedOver40Px':int(m.sum()),
    'fraction':round(float(m.mean()),6)}
 return stats
def summary_sheet(out,mode,rows,census):
 # Two images per row are authentic screenshots of the SAME original paused
 # source state: unmodified baseline and private renderer-only mask variant.
 # No candidate model / person / fabricated unobserved frame.
 h=120+len(rows)*436
 canvas=Image.new('RGB',(1170,h),(246,249,252))
 d=ImageDraw.Draw(canvas)
 d.rectangle((0,0,1170,115),fill=(17,31,46))
 d.text((20,8),'K4AB | '+mode.upper()+' | GPU ORIGINAL DRAW GROUPS',font=F23,fill='white')
 d.text((20,45),'SAME SOURCE PAUSE AT TICK11040 / 46.0s: original vs research-only subtraction',
        font=F16,fill=(213,233,247))
 d.text((20,76),'ORIGINAL K4Z image SHA exactly reproduced. Not a 3D candidate or depth-buffer test.',
        font=F12,fill=(228,235,242))
 for i,row in enumerate(rows):
  y=119+i*436
  d.rounded_rectangle((9,y,1160,y+428),radius=12,fill='white',outline=(195,210,220),width=2)
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
  d.text((25,y+416),labels[:120],font=F12,fill=(79,87,100))
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
 assert original['sourceHz'] if 'sourceHz' in original else original['Hz']==240
 assert original['Hz']==audit['sourceHz']==240
 assert original['sourceB48']==audit['sourceB48']==7
 assert original['sourceB51']==audit['sourceB51']==28
 assert original['oneContinuousPhysicalRunPerMode']
 assert audit['originalA5SceneRendered'] is False
 assert audit['originalCameraAndPhysicsUnchanged'] and not audit['sourceNativeGameModified']
 assert audit['sourceOriginalK4ZPNGCountMatched']==14
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
  'sameSourceK4ZFramePixelIdentical':14,
  'masksActuallySubtractiveAtIdenticalPausedCameraAndBall':12,
  'allOriginalRoad5ScreenshotsSameAfterInstrumentation':True,
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
  ],'byMode':[],'maskEvidence':[],'reviewSheets':[],'errors':[]
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
  assert group['baselineAllSevenK4ZShaMatches']
  assert group['postMaskRestoredPNG']['sha256']==next(
    shot['originalSourceNativeImage']['sha256'] for shot in group['shots'] if shot['tick']==11040)
  for shot in group['shots']:
   ref=next(x for x in origin['frames'] if x['tick']==shot['tick'])
   assert shot['sourceRoad']=='p93-PRISM_CREST-01'
   assert shot['matchingK4ZTruePNGsha']==ref['sha256']
   assert shot['originalSourceNativeImage']['sha256']==ref['sha256']
   assert shot['originalSourceNativeImage']['bytes']==ref['bytes']
   aimg=file_png(k4abdir,shot['originalSourceNativeImage'])
   bimg=file_png(k4zdir,ref)
   assert np.array_equal(np.asarray(aimg),np.asarray(bimg))
   stats=shot['originalState']['audit']
   assert stats['sourceB48']==7 and stats['sourceB51']==28
   assert stats['mask']=='none' and not stats['privateVisualLayerSuppressionOnly']
   assert stats['originalSceneA5R19A3OverlayRendered'] is False
   assert stats['sourceGeometryAndPhysicsUnchanged']
   counts=stats['originalSceneLayers']
   assert counts['B48_AND_FIXTURES_RENDER_SKIN']['renderedDrawCalls']>0
   assert counts['B51_BODY']['renderedDrawCalls']>=28
   assert counts['EPIC_SCENERY']['renderedDrawCalls']>0
   assert counts['MEGASTRUCTURE_SCENERY']['renderedDrawCalls']>0
   assert counts['A13_MACHINE_FRAMES_AND_W9_HERO']['renderedDrawCalls']>0
  baseline=next(x for x in group['shots'] if x['tick']==11040)
  origin_img=file_png(k4abdir,baseline['originalSourceNativeImage'])
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
   assert len(masked['suppressedOriginalSourceLayers'])>0
   img=file_png(k4abdir,masked['image'])
   compare=compare_images(origin_img,img)
   stat={'mode':mode,'tick':11040,'mask':mask,
     'trueSourceImageSha':baseline['originalSourceNativeImage']['sha256'],
     'maskedResearchImageSha':masked['image']['sha256'],
     'pixelDifference':compare,
     'suppressedOriginalSourceLayers':masked['suppressedOriginalSourceLayers'],
     'maskRemovedActualNativeDrawCallsNotPhysics':True,
     'baselineNativeCameraAndBallExactlySame':True,
     'pixelDifferenceNotObjectVisibilityOrFreeSpaceCertification':True}
   result['maskEvidence'].append(stat)
   zone_reports.append({'mode':mode,'mask':mask,
     'changedFraction':compare['changedFraction'],
     'removedDrawGroups':[x['layer'] for x in masked['suppressedOriginalSourceLayers']]})
   sheet_rows.append({**masked,'baselineImage':origin_img,'maskedImage':img,'difference':compare})
  image_name=summary_sheet(out,mode,sheet_rows,baseline['originalState']['audit']['originalSceneLayers'])
  result['reviewSheets'].append(image_name)
  result['byMode'].append({'mode':mode,'sourceOriginalK4ZPNGMatched':7,
   'actualSourceLayerDrawCallCensusAt11040':baseline['originalState']['audit']['originalSceneLayers'],
   'samePoseSixSubtractionMaskTests':zone_reports,
   'restoredSourceSHA':group['postMaskRestoredPNG']['sha256'],
   'art':'NOT_TESTED_HOLD'})
 assert len(result['maskEvidence'])==12 and len(result['reviewSheets'])==2
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
 print('K4AB_SOURCE_FRAME_14_SHA_BITWISE_REPRO_AND_PAUSED_12_MASK_PIXEL_DIFF_TECH_LIMITED_PASS',
  json.dumps({'K4ZOriginalAllFramesSHA':82,'originalUnmodifiedWebGL2BitExact':14,
   'privateSourceMasks':12,'sheets':result['reviewSheets'],
   'byMode':[{ 'mode':x['mode'],
    'diffs':[{q['mask']:q['changedFraction']} for q in x['samePoseSixSubtractionMaskTests']]}
    for x in result['byMode']],
   'art':'NOT_TESTED_HOLD','candidateModels':0}))
if __name__=='__main__':main()

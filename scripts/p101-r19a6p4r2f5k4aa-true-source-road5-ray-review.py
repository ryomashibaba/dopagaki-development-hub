"""K4AA: independently audit source WebGL2 PNGs and A5-only BVH ray reports.

Produce genuine screenshot review sheets with explicitly colored AFTER-CAPTURE
COUNTERFACTUAL A5 ray annotations, numeric screenshot change and an ART gate
checklist. IMPORTANT: K4Z's source r19a1 stage DOES NOT RENDER the A5 overlay.
Ray results do not describe geometry visible in source screenshots.
No scene construction, no suggested site, no human readability acceptance.
"""
import argparse, hashlib, json, math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import numpy as np

SRC='af076d67492a677d2235e4730aef8cdf4808e106'
W,H=1013,698
TICKS=(10680,10800,10920,11040,11160,11280,11400)
ZONES={'SCREEN_LEFT':(.065,.295),'SCREEN_MIDDLE':(.365,.635),
       'SCREEN_RIGHT':(.705,.935)}
YRANGE=(.18,.53)
MODE=('ultra','control')
def sha(b):return hashlib.sha256(b).hexdigest()
def font(size,bold=False):
 names=(('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',) if bold else
        ('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',))
 for p in names:
  if Path(p).is_file():return ImageFont.truetype(p,size)
 return ImageFont.load_default()
F12=font(12);F14=font(14);F18=font(18);F22=font(22,True);F28=font(28,True)
INK=(21,34,49);GREY=(89,105,122);TEAL=(16,224,233);ORANGE=(255,157,37)
def c_image(kroot,frame):
 data=(kroot/frame['file']).read_bytes()
 assert len(data)==frame['bytes'] and sha(data)==frame['sha256']
 image=Image.open(kroot/frame['file']).convert('RGB')
 assert image.size==(W,H)
 return image
def assert_rays_against_source(report,source):
 assert report['sourceBlob']==source['sourceBlob']==SRC
 assert report['Hz']==source['Hz']==240
 assert report['sourceB48']==source['sourceB48']==7 and report['sourceB51']==source['sourceB51']==28
 assert report['originalA5MeshCountPerWidth']==5
 assert report['originalA5TrianglesPerWidth']==10566
 assert report['trueRoad5TickCountPerWidth']==7 and report['sourceCameraStates']==14
 assert report['raysPerTrueCamera']==108
 assert report['sampledTimeNotContinuousVisibility'] and report['noHitByA5IsNotOpenWalkableOrConstructible']
 assert report['K4ZSourceSceneRenderedA5'] is False
 assert report['counterfactualA5GeometryUnderRealSourceCamera'] is True
 assert report['actualK4ZScreenGeometryExplainedByThisBVH'] is False
 assert report['addedColliders']==report['newBuildingModels']==report['officialARTAccepted']==0
 assert report['independentART']=='NOT_TESTED_HOLD' and report['historicK4RAndK4U']=='REJECT'
 assert report['rayObjects']=='ONLY_ORIGINAL_A5_FIVE_STATIC_CITY_MESHES__NO_B48_B51_OR_OTHER'
 assert len(report['modeFrames'])==14
 for mode in MODE:
  frames=[r for r in report['modeFrames'] if r['mode']==mode]
  assert tuple(x['tick'] for x in frames)==TICKS
  for fr in frames:
   assert fr['road']=='p93-PRISM_CREST-01'
   assert len(fr['rayGrid'])==108 and set(fr['zoneCounts'])==set(ZONES)
   for zone in ZONES:
    rows=[x for x in fr['rayGrid'] if x['zone']==zone]
    assert len(rows)==36
    near=sum(x['originalA5HitWithin1500m'] for x in rows)
    far=sum(x['originalA5HitWithin3000m'] for x in rows)
    assert near<=far and near==fr['zoneCounts'][zone]['intersectOriginalA5Within1500m']
    assert far==fr['zoneCounts'][zone]['intersectOriginalA5Within3000m']
    for item in rows:
     if not item['originalA5HitWithin3000m']:
      assert item['nearestOriginalA5HitDistanceM'] is None
     else:assert 0<=item['nearestOriginalA5HitDistanceM']<=3000
def changed_pixels(a,b,zone):
 x0=int(ZONES[zone][0]*W);x1=int(ZONES[zone][1]*W)
 y0=int(YRANGE[0]*H);y1=int(YRANGE[1]*H)
 aa=np.asarray(a,dtype=np.int16)[y0:y1,x0:x1]
 bb=np.asarray(b,dtype=np.int16)[y0:y1,x0:x1]
 assert aa.shape==bb.shape and aa.shape[0]>100
 diff=np.max(np.abs(aa-bb),axis=2)>40
 return {'pixelSampleCount':int(diff.size),'screenRGBThreshold40ChangedPixels':int(diff.sum()),
   'fractionScreenPixelsChanged':round(float(diff.mean()),5),
   'notOpticalFlowOrContinuousVisibility':True}
def sheet(mode,entries,out):
 width,height=1532,7*437+108
 canvas=Image.new('RGB',(width,height),'white')
 dr=ImageDraw.Draw(canvas)
 dr.rectangle((0,0,width-1,105),fill=INK)
 dr.text((20,12),f'K4AA  |  {mode.upper()}  |  TRUE ROAD5 ORIGINAL CAMERA',font=F28,fill='white')
 dr.text((20,53),'COUNTERFACTUAL A5 rays (not rendered in source). Overlay AFTER capture.',font=F18,fill=(219,236,246))
 for i,(entry,original,overlay) in enumerate(entries):
  row=108+i*437
  dr.rectangle((0,row,width-1,row+435),
    fill=(246,249,252) if i%2==0 else (235,241,247))
  dr.text((13,row+13),f'{entry["tick"]}  |  {entry["seconds"]:.1f}s   {entry["speedMps"]:.1f}m/s',
          font=F18,fill=INK)
  dr.text((14,row+43),'TRUE ORIGINAL PNG',font=F12,fill=GREY)
  dr.text((526,row+43),'ORIGINAL PNG + RAY ANNOTATION',font=F12,fill=GREY)
  canvas.paste(original.resize((504,347),Image.Resampling.LANCZOS),(12,row+69))
  canvas.paste(overlay.resize((504,347),Image.Resampling.LANCZOS),(525,row+69))
  rx=1051
  dr.text((rx,row+15),'SOURCE-ONLY SPACE AUDIT',font=F18,fill=INK)
  dr.text((rx,row+50),'A5 ray hits within 1,500m:',font=F14,fill=INK)
  for j,z in enumerate(ZONES):
   v=entry['zoneCounts'][z]
   dr.text((rx,row+79+j*31),f'{z.split("_")[-1]}: {v["intersectOriginalA5Within1500m"]}/36',
    font=F18,fill=INK)
  step=entry['cameraStepFromPreviousObservedState']
  dr.text((rx,row+189),('First sample on this road' if step is None
   else f'Camera moved {step["straightLineCameraEyeDisplacementM"]:.1f}m / 0.5s'),font=F14,fill=INK)
  if step is not None:
   dr.text((rx,row+211),f'Heading difference {step["cameraFrontAngleDifferenceDegrees"]:.1f} deg',
            font=F14,fill=INK)
  dr.text((rx,row+248),'ORANGE = hypothetical A5 intersection',font=F12,fill=(174,90,17))
  dr.text((rx,row+270),'CYAN = no hypothetical A5 hit',font=F12,fill=(0,108,120))
  dr.text((rx,row+298),'Not a clear corridor or walkable floor.',font=F12,fill=INK)
  dr.text((rx,row+322),'NO NEW PUBLIC ARCHITECTURE',font=F14,fill=INK)
  dr.text((rx,row+349),'ART NOT TESTED  /  HOLD',font=F18,fill=(170,62,51))
 name=f'K4AA_{mode}_ROAD5_7_NATIVE_WEBGL2_FRAMES_WITH_A5_ONLY_RAYS.png'
 canvas.save(out/name,optimize=True)
 return name
def main():
 parser=argparse.ArgumentParser()
 for opt in ('k4z-dir','rays','out'):parser.add_argument('--'+opt,required=True)
 args=parser.parse_args()
 kroot=Path(args.k4z_dir);output=Path(args.out);output.mkdir(parents=True,exist_ok=True)
 input_json=kroot/'K4Z_ORIGINAL_SOURCE_DENSE_7ROAD_CAMERA.json'
 raw=input_json.read_bytes();source=json.loads(raw)
 ray_path=Path(args.rays);ray=json.loads(ray_path.read_text(encoding='utf8'))
 assert ray['sourceK4ZJSONsha256']==sha(raw)
 assert source['errors']==[] and source['sourceBlob']==SRC
 assert source['oneContinuousPhysicalRunPerMode'] and source['captureIsSparsePausesNotContinuousVideo']
 assert source['originalCamera']=='ball-lock-unfiltered-heading'
 assert not source['originalCameraChanged'] and not source['originalPhysicsChanged']
 assert source['buildingModelsCreated']==source['addedColliders']==0
 assert source['officialARTAccepted']==source['slope2DNARecognizedMetres']==0
 assert len(source['sessions'])==2
 assert_rays_against_source(ray,source)
 all_png=0
 for sess in source['sessions']:
  assert len(sess['frames'])==41
  for frame in sess['frames']:
   c_image(kroot,frame);all_png+=1
 assert all_png==82
 audit={'schema':'dopagaki.k4aa-true-source-road5-original-city-occlusion-review/1',
  'sourceBlob':SRC,'sourceHz':240,'sourceB48':7,'sourceB51':28,
  'trueOriginalK4ZPNGshaVerified':82,'road5TrueCameraStates':14,
  'originalA5RaysAudited':1512,'geometryIsOnlyFiveOriginalA5Meshes':True,
  'A5OverlayNotEnabledInK4ZSourceCameraScene':True,
  'rayStatisticsAreCounterfactualNotActualSourceScreenshotOcclusion':True,
  'originalCityGLBSha256':ray['sourceA5GLBsha256'],
  'sourceK4ZJSONsha256':sha(raw),'sourceK4AARayJSONsha256':sha(ray_path.read_bytes()),
  'originalCamera':'ball-lock-unfiltered-heading','onePhysicsRunPerWidth':True,
  'sparseSnapshotsNotContinuousVideo':True,
  'originalA5RayHitDoesNotCoverRoadsB51OtherObjects':True,
  'imageBrightnessIsNotSpaceClearance':True,
  'zeroA5RayHitDoesNotDescribeVisibleRoadFrames':True,
  'rayGridIsApproximateNotTrueGPUDepth':True,'sitePreferenceOrRanking':'PROHIBITED',
  'architectureProposal':'NOT_BUILT','humanArtComparison':'NOT_TESTED',
  'entryMiddleBackRealArchitectureVisible':'NOT_TESTED',
  'continuousHumanComprehensionSeconds':'UNKNOWN',
  'newModels':0,'newColliders':0,'officialARTAccepted':0,
  'slope2DNARecognizedMetres':0,'priorK4RAndK4UART':'REJECT',
  'art':'NOT_TESTED_HOLD','SAT':'NOT_RUN','CCD':'NOT_RUN','HUMAN':'NOT_TESTED',
  'FPS':'HOLD','RELEASE':'HOLD','MERGE':'HOLD',
  'reviewSheets':[],'byModeRoad5':[],'frameComparisons':[],'errors':[]}
 for mode in MODE:
  sess=next(s for s in source['sessions'] if s['mode']==mode)
  prev=None;sheet_rows=[];observations=[]
  for tick in TICKS:
   f=next(x for x in sess['frames'] if x['tick']==tick)
   r=next(x for x in ray['modeFrames'] if x['mode']==mode and x['tick']==tick)
   assert f['sha256']==r['sourceTruePNGsha256'] and f['file']==r['sourceTrueWebGL2File']
   assert f['state']['road']==r['road']=='p93-PRISM_CREST-01'
   assert f['state']['cameraEye']==r['cameraEye']
   assert f['state']['cameraFront']==r['cameraFront']
   assert abs(f['state']['speed']-r['speedMps'])<.00002
   pic=c_image(kroot,f)
   overlay=pic.copy();d=ImageDraw.Draw(overlay)
   for item in r['rayGrid']:
    x,y=item['screenPx']
    color=(255,155,28) if item['originalA5HitWithin1500m'] else (10,235,242)
    d.ellipse((x-3,y-3,x+3,y+3),fill=color,outline=(0,0,0),width=1)
   changed={}
   if prev is not None:
    for zone in ZONES:
     changed[zone]=changed_pixels(prev,pic,zone)
   entry={'mode':mode,'tick':tick,'seconds':round(tick/240,5),
    'trueOriginalPNGsha256':f['sha256'],'trueSourceSpeedMps':f['state']['speed'],
    'cameraStep':r['cameraStepFromPreviousObservedState'],
    'A5OnlyRayCounts':r['zoneCounts'],
    'ROIrawSourcePixelChangeFromPrevious0p5s':changed,
    'noBuiltSiteOrArchitecture':True,'viewableNegativeSpaceHumanVerified':False}
   audit['frameComparisons'].append(entry)
   observations.append(entry)
   sheet_rows.append((r,pic,overlay))
   prev=pic
  name=sheet(mode,sheet_rows,output)
  audit['reviewSheets'].append(name)
  steps=[e['cameraStep'] for e in observations if e['cameraStep'] is not None]
  assert len(steps)==6
  audit['byModeRoad5'].append({'mode':mode,'tickSamples':list(TICKS),
    'trueSourceFrameCount':7,
    'measuredCameraStraightLineEyeDisplacementBetweenConsecutive0p5sM':[
       round(s['straightLineCameraEyeDisplacementM'],4) for s in steps],
    'measuredCameraHeadingDifferencesBetween0p5sDegrees':[
       round(s['cameraFrontAngleDifferenceDegrees'],4) for s in steps],
    'note':'These are displacement/heading differences of real sparse cameras; not an inferred continuous visual-object track'})
 assert len(audit['frameComparisons'])==14 and len(audit['reviewSheets'])==2
 # No candidate or human label can silently turn the original city ray stats into an ART grade.
 assert audit['art']=='NOT_TESTED_HOLD' and audit['officialARTAccepted']==0
 (output/'K4AA_GENUINE_ROAD5_SOURCE_CAMERA_AND_ORIGINAL_A5_RAY_REVIEW.json').write_text(
    json.dumps(audit,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
 # Compact reference for review tooling; no inferred timeline between snapshots.
 print('K4AA_TRUE_ROAD5_A5_SOURCE_RAY_1512_AND_ORIGINAL_PNG_82_TECH_ONLY_PASS',
  json.dumps({'allSourcePNGsSHA':82,'trueRoad5States':14,'rays':1512,
    'sheetFiles':audit['reviewSheets'],
    'byMode':[{k:v for k,v in entry.items() if k!='tickSamples'} for entry in audit['byModeRoad5']],
    'ART':'NOT_TESTED_HOLD','newModels':0}))
if __name__=='__main__':main()

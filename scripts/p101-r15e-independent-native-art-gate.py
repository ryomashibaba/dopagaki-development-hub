"""R15E independent native source camera/pixel and geometry veto.

Rendered Blender images are not native browser WebGL. Render RGB differ is
NOT real geometric pixel share. Human ART cannot be auto-certified.
"""
import json,sys,os,copy,statistics
from PIL import Image,ImageChops,ImageDraw

SHA='af076d67492a677d2235e4730aef8cdf4808e106'
TIMES=('t1100','t1200','t1300','t1400','t1500','t1600','t1700')
ROADS=('true-pinch','pinch-switch')
def validate(a):
 assert a['schema']=='dopagaki.r15e-real-source-twelve-metre-civic-spine-first-blender/1'
 assert a['road'] in ROADS and a['originalGameSourceBlob']==SHA
 assert a['originalCX18B48_7B51_28FiveCamerasUnchanged']
 assert a['R15D12mSameWorldSourceSweptBackboneUsed']
 assert a['R15DOriginalRoutePairs']==['E_M1','M1_M2','M2_L']
 assert a['genuinePrivateBlenderMeshes']==14
 assert a['joinedCivicRouteResearchMetres']>400
 assert a['originalPhysicalTriangleIntersectionPairs']==[]
 assert a['allNewMeshVerticesWithinRealTwoRoadConservative12mSweptProof']
 assert a['originalR1SourceFrameCount']==13
 assert len(a['allOriginal13CameraResearchFirstHit'])==13
 assert len(a['sourceOriginalCameraSevenTrueBlenderImages'])==7
 for v in a['allOriginal13CameraResearchFirstHit'].values():
  counts=v['sourceFrameOriginalCameraFirstHitsOutOf228']
  assert sum(counts.values())==228
  assert counts.get('R15E',0)/228 >= v['sourceResearchCityFirstHitFraction']-0.00001
  assert 0<=v['sourceResearchCityFirstHitFraction']<=1
 assert not any(a[k] for k in ('sourceB51ContinuousTimePhysicsAlreadyCertified',
  'actualSourceGameWebGLRendered','humanGameCivicFloorWalkableCertified',
  'realSourceLandscapeLoadBearingAndIngressCertified',
  'genuineMonumentalFutureCityArtApproved','originalSourceGameChanged'))
 assert a['newGameColliders']==a['officialArt']==a['officialSlope2Meters']==0
 assert all(a[k]=='HOLD' for k in ('ART','GAMEPLAY','HUMAN','PERFORMANCE','INTEGRATION','RELEASE','MERGE'))
 return True
def same_image_difference(a,b):
 x=Image.open(a).convert('RGB')
 y=Image.open(b).convert('RGB')
 assert x.size==y.size and x.width>=800 and x.height>=500
 d=ImageChops.difference(x,y)
 return round(sum(max(v)>=45 for v in d.getdata())/(x.width*x.height),5)
def audit(a,baseline,generated,out):
 validate(a)
 os.makedirs(out,exist_ok=True)
 images={}
 contacts=[]
 road=a['road']
 for time in TIMES:
  r1=os.path.join(baseline,'R1_'+road+'_'+time+'_TRUE_BLENDER_SOURCE_NOT_WEBGL.png')
  re=os.path.join(generated,'R15E_'+road+'_'+time+'_REAL_BLENDER_SOURCE_NOT_WEBGL.png')
  assert os.path.isfile(r1) and os.path.isfile(re)
  images[time]=same_image_difference(r1,re)
  before=Image.open(r1).convert('RGB');after=Image.open(re).convert('RGB')
  before.thumbnail((465,300));after.thumbnail((465,300))
  contacts.append((time,before,after))
 canvas=Image.new('RGB',(1010,7*318),(24,28,33))
 draw=ImageDraw.Draw(canvas)
 for i,(key,before,after) in enumerate(contacts):
  top=i*318
  draw.text((5,top+3),'Original R1 / '+road+' / '+key,fill=(255,255,255))
  draw.text((507,top+3),'R15E SOURCE Blender / '+key,fill=(255,255,255))
  canvas.paste(before,(5,top+23))
  canvas.paste(after,(507,top+23))
 jpg='R15E_'+road+'_ORIGINAL_R1_VS_TRUE_3D_ALL_SEVEN.jpg'
 canvas.save(os.path.join(out,jpg),quality=88)
 hits={k:a['allOriginal13CameraResearchFirstHit'][k]['sourceResearchCityFirstHitFraction'] for k in TIMES}
 # No claiming ART pass even if image changes or technical geometry clears.
 low=statistics.mean(hits.values())<.08
 late=sum(hits[x]<.03 for x in ('t1500','t1600','t1700'))>=2
 decision='ART_REJECT_LOW_ORIGINAL_CAMERA_IMPACT' if low or late else 'ART_HOLD_HUMAN_REVIEW_REQUIRED'
 v={'schema':'dopagaki.r15e-independent-original-source-seven-camera-art-evaluation/1',
    'road':road,'sourceCXBlob':SHA,
    'actualBlender3DGeometryBuilt':14,'actualOriginalCXAndB48Intersections':0,
    'sameSourceOriginalCameraR1SevenFrameCityFirstHit':hits,
    'sevenFrameMeanVisibleNewGeometryFirstHit':round(statistics.mean(hits.values()),5),
    'originalSceneNativeSourceRGBAnyChannel45Diff':images,
    'pixelDifferenceNeverInterpretedAsNewBuildingArea':True,
    'lateSourceFrameAppearanceBelow3PctInAtLeast2Of3':late,
    'sevenOriginalR1AndNew3DImagePairs':jpg,
    'independentArtResearchVerdict':decision,
    'realVisualArtHumanApproval':False,
    'trueGameNativeWebGLRendered':False,
    'sourcePhysicsAndTrueGameplayModified':False,
    'realWalkableFloorSupportCertified':False,
    'officialArt':0,'officialSlope2Meters':0,'newGameColliders':0,
    'ART':'REJECT' if decision.startswith('ART_REJECT') else 'HOLD',
    'GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
    'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
 with open(os.path.join(out,'R15E_'+road+'_INDEPENDENT_ART_SOURCE_GATE.json'),'w') as f:
  json.dump(v,f,ensure_ascii=False,indent=2)
 return v
if __name__=='__main__':
 def opt(k):
  assert k in sys.argv,k
  return sys.argv[sys.argv.index(k)+1]
 root=opt('--trial')
 source=json.load(open(opt('--audit'),encoding='utf8'))
 result=audit(source,opt('--original'),root,opt('--out'))
 for name,change in [
  ('art-forgery',lambda x:x.__setitem__('officialArt',1)),
  ('physics-forgery',lambda x:x.__setitem__('originalPhysicalTriangleIntersectionPairs',[['fake','CX',1]])),
  ('webgl-forgery',lambda x:x.__setitem__('actualSourceGameWebGLRendered',True))]:
  fake=copy.deepcopy(source);change(fake)
  try:validate(fake)
  except (AssertionError,KeyError,TypeError,ValueError):pass
  else:raise AssertionError('R15E false claim escaped gate: '+name)
 print('R15E_INDEPENDENT_SAME_R1_CAMERA_ART_GATE',source['road'],
  'meanNewFirstHit',result['sevenFrameMeanVisibleNewGeometryFirstHit'],
  'independentART',result['independentArtResearchVerdict'],
  'real original camera Blender, NOT native browser WebGL')

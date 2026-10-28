"""R14E independent native Blender real-image comparison and art veto.

R14D physically safe ONE slice at t14 is not a beautiful urban
environment spanning t11..t17. Pixels and camera BVH are evidence, not
automatic human aesthetic approval. Never approve source gameplay here.
"""
import json,os,sys,statistics,math
from PIL import Image,ImageChops
SOURCE='af076d67492a677d2235e4730aef8cdf4808e106'
TIMES=('t1100','t1200','t1300','t1400','t1500','t1600','t1700')
def rgbdiff(a,b,threshold=45):
 x=Image.open(a).convert('RGB');y=Image.open(b).convert('RGB')
 assert x.size==y.size,x.size
 delta=ImageChops.difference(x,y)
 return round(sum(max(pixel)>=threshold for pixel in delta.getdata())/(x.width*x.height),5)
def evaluate(r14,r1dir,r14dir,r11):
 assert r14['schema']=='dopagaki.g4e7dz-r6d-r14d-real-one-inhabited-court-source-images/1'
 assert r11['schema']=='dopagaki.g4e7dz-r6d-r11r1-folded-estuary-true-source/1'
 assert r14['road']==r11['road'] and r14['sourceCXBlob']==r11['sourceCXBlob']==SOURCE
 assert r14['genuineOriginalCX18B48_7B51_28Cameras5Unchanged']
 assert len(r14['sourceGameCXExactTriangleIntersections'])==0
 assert len(r14['sourceGameB48ExactTriangleIntersections'])==0
 assert len(r14['sourceGameB51_28All721ConservativeAABBWarnings'])==0
 assert sum(len(v) for v in r14['sourceGameB51_13OriginalFrameExactTriangleHits'].values())==0
 assert r14['actualNewBlenderArchitectureMeshes']>=55
 assert len(r14['original13TimeNativeCameraCityFirstHit'])==13
 assert len(r14['originalSame7TimeNativeBlenderRenders'])==7
 assert not r14['humanCityQualityAlreadyApproved']
 assert not r14['actualIngamePlayerWalkwayBuilt']
 assert not r14['originalCityStructuralFoundationCertified']
 visible={x:float(r14['original13TimeNativeCameraCityFirstHit'][x]['fraction']) for x in TIMES}
 former={x:float(r11['original7CamerasActualBVHFirstHit'][x]['newCityFirstHitFraction']) for x in TIMES}
 loss=[x for x in TIMES if visible[x]<.02]
 # SOURCE-visible inner court is not an actual accessible room.
 courtyard={x:sum(p['unoccludedActualCityCourtyard'] for p in r14['original13TimeNativeCameraRealCourtyard3Heights'][x]) for x in TIMES}
 vs={}
 for t in TIMES:
  p=os.path.join(r1dir,'R1_'+r14['road']+'_'+t+'_TRUE_BLENDER_SOURCE_NOT_WEBGL.png')
  q=os.path.join(r14dir,'R14D_'+r14['road']+'_'+t+'_GENUINE_NATIVE_BLENDER_NOT_GAME.png')
  assert os.path.isfile(p) and os.path.isfile(q)
  vs[t]=rgbdiff(p,q)
 assert len(loss)>=4
 assert visible['t1500']==visible['t1600']==visible['t1700']==0
 # Formally report observed city disappearing; no 'one frame is pretty'
 # exception, nor false correctness based on 70 Blender meshes.
 return {'schema':'dopagaki.g4e7dz-r6d-r14e-original-image-physical-source-art-reject/1',
  'road':r14['road'],'sourceCXBlob':SOURCE,
  'nativeSourceOriginalImmutable':True,
  'trueOriginalCamera7FrameCityFirstHitFractions':visible,
  'R11R1SameOriginalCamera7FrameCityFirstHitFractions':former,
  'R14DTrueSevenFrameMeanFirstHitFraction':round(statistics.mean(visible.values()),5),
  'R11R1TrueSevenFrameMeanFirstHitFraction':round(statistics.mean(former.values()),5),
  'framesWithUnder2PctTrueCityFirstHits':loss,
  'trueNativeOriginalSourceRGBAnyChannelThreshold45Diff':vs,
  'trueOriginalCameraActualCourtThreeHeightClearCounts':courtyard,
  'sourceCXB48B51AnyOriginalPhysicsCollision':False,
  'R14DTrue3DCityArchitectureBuiltButNotInGame':True,
  'actualPlayerWalkFromGameRoadToPrivateCitySectionProven':False,
  'originalGameSourceModified':False,
  'formalIndependentVisualDecision':'ART_REJECT_REAL_SOURCE_IMAGE_DISAPPEARS_AND_SMALL_FACADE',
  'humanViewingTheOriginalRendersRequiredToCertifyArt':True,
  'noAutomaticARTPASSFromHighSingleTimeHitFraction':True,
  'newGameColliders':0,'officialArt':0,'officialSlope2Metres':0,
  'ART':'REJECT','GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
  'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
if __name__=='__main__':
 a=sys.argv[1:]
 def opt(k):assert k in a,k;return a[a.index(k)+1]
 r14=json.load(open(opt('--r14')));r11=json.load(open(opt('--r11')))
 x=evaluate(r14,opt('--r1dir'),opt('--r14dir'),r11)
 os.makedirs(os.path.dirname(opt('--out')),exist_ok=True)
 with open(opt('--out'),'w',encoding='utf8') as f:json.dump(x,f,indent=2,ensure_ascii=False)
 print('R14E_GENUINE_NATIVE_IMAGE_ART_REJECT',x['road'],
  'R14 mean',x['R14DTrueSevenFrameMeanFirstHitFraction'],
  'R11 mean',x['R11R1TrueSevenFrameMeanFirstHitFraction'],
  'early-middle-late visibility',x['trueOriginalCamera7FrameCityFirstHitFractions'],
  'source-image pixel diffs',x['trueNativeOriginalSourceRGBAnyChannelThreshold45Diff'],
  'ART REJECT / GAMEPLAY HOLD')

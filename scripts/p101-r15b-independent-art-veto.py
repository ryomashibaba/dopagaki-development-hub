"""R15B independent original-source image/physics ART REJECT gate.

Never confuse fixed 240Hz Blender camera imagery, research mesh size, and
true source physics/actual WebGL/player enjoyment. The thresholded image
difference is not the image area of the new city; light/shading also differ.
"""
import json,sys,os,statistics,copy
from PIL import Image,ImageChops,ImageDraw

SOURCE='af076d67492a677d2235e4730aef8cdf4808e106'
TIMES=('t1100','t1200','t1300','t1400','t1500','t1600','t1700')
def delta_fraction(a,b):
 p=Image.open(a).convert('RGB');q=Image.open(b).convert('RGB')
 assert p.size==q.size and p.width>=800 and p.height>=500,(p.size,q.size)
 delta=ImageChops.difference(p,q)
 # any channel difference >=45 /255; proxy only, not source-object pixels
 return round(sum(max(v)>=45 for v in delta.getdata())/(p.width*p.height),5)
def compare(data,baseline_dir,trial_dir,out_dir):
 assert data['schema']=='dopagaki.r15b-one-actual-paired-world-macro-city-source-art/1'
 assert data['sourceCXBlob']==SOURCE and data['originalCX18B48_7B51_28Cameras5Unchanged']
 assert data['sourceGameChanged'] is False and data['newGameColliders']==0
 assert data['officialArt']==data['officialSlope2Meters']==0
 assert data['humanAestheticApproval'] is False
 assert data['originalGameTrueWebGLRendered'] is False
 assert data['trueWorldMacroCityObjectCount']>=25
 assert data['bothOriginalRoadSharedWorldGeometry'] is True
 assert all(data[k]=='HOLD' for k in ('GAMEPLAY','HUMAN','PERFORMANCE','INTEGRATION','RELEASE','MERGE'))
 assert len(data['original13CameraFirstHit'])==13
 assert len(data['original13MoverPosesTriangleIntersections'])==13
 assert len(data['originalSevenTrueBlenderRenders'])==7
 assert data['originalTrajectoryPathSpanMetres']>350
 os.makedirs(out_dir,exist_ok=True)
 road=data['road'];assert road in ('true-pinch','pinch-switch')
 hits={k:data['original13CameraFirstHit'][k]['newCityFirstHitFraction'] for k in TIMES}
 assert all(0<=v<=1 for v in hits.values())
 image_diffs={}
 rows=[]
 for key in TIMES:
  before=os.path.join(baseline_dir,'R1_'+road+'_'+key+'_TRUE_BLENDER_SOURCE_NOT_WEBGL.png')
  after=os.path.join(trial_dir,'R15B_'+road+'_'+key+'_REAL_SOURCE_BLENDER_NOT_WEBGL.png')
  assert os.path.isfile(before) and os.path.isfile(after)
  image_diffs[key]=delta_fraction(before,after)
  a=Image.open(before).convert('RGB')
  b=Image.open(after).convert('RGB')
  a.thumbnail((470,300));b.thumbnail((470,300))
  rows.append((key,a,b))
 # Contact-sheet is a primary visual review object, not just a number.
 canvas=Image.new('RGB',(1000,7*315),(28,31,36))
 brush=ImageDraw.Draw(canvas)
 for i,(key,left,right) in enumerate(rows):
  y=i*315
  brush.text((7,y+4),key+' R1 ORIGINAL SOURCE BLENDER',fill=(250,250,250))
  brush.text((507,y+4),key+' R15B NEW SOURCE BLENDER',fill=(250,250,250))
  canvas.paste(left,(5,y+22));canvas.paste(right,(505,y+22))
 contact='R15B_'+road+'_R1_VS_R15B_7_REAL_CAMERA_CONTACT.jpg'
 canvas.save(os.path.join(out_dir,contact),quality=90)
 # Conservative envelope overlap is a warning, NOT a continuous-time crash.
 cx=data['actualSourceCXTriangleIntersections']
 road_hits=data['actualSourceB48TriangleIntersections']
 motion=data['all28B51_721TickSampledEnvelopeWarnings']
 exact=sum(len(x) for x in data['original13MoverPosesTriangleIntersections'].values())
 late=[t for t in ('t1500','t1600','t1700') if hits[t]<.02]
 art_veto=bool(cx or road_hits or exact or len(late)>=2)
 assert art_veto,'This gate audits the observed rejected R15B candidate; no auto art PASS'
 result={
  'schema':'dopagaki.r15b-independent-original-source-image-physics-veto/1',
  'road':road,'sourceCXBlob':SOURCE,'realWorldCityPathSpanMetres':data['originalTrajectoryPathSpanMetres'],
  'actualEditableBlenderMeshes':data['trueWorldMacroCityObjectCount'],
  'CXActualTriangleIntersectionPairs':len(cx),
  'B48ActualTriangleIntersectionPairs':len(road_hits),
  'B51Conservative721TickEnvelopeWarnings':len(motion),
  'B51Source13PoseActualTriangleIntersectionPairs':exact,
  'newCitySourceCameraFirstHitFractions':hits,
  'sourceSevenFrameMeanCityFirstHit':round(statistics.mean(hits.values()),5),
  'lateBelow2PctCityFirstHit':late,
  'pairedOriginalCameraImageAnyChannelDiff45':image_diffs,
  'imageDifferenceIsNotArchitecturalPixelShare':True,
  'originalSourceAndNewImagePairContactSheet':contact,
  'visualConclusion':'GEOMETRIC_SOURCE_CONFLICT_AND_MOSTLY_UNCHANGED_ROAD_CAMERA_APPEARANCE_WITH_LATE_CITY_DISAPPEARANCE',
  'R15BIndependentART':'REJECT',
  'R15BOriginalSourceGeometrySafe':not (cx or road_hits or exact or motion),
  'trueBrowserWebGLGameStillNotChanged':True,
  'humanAestheticApproval':False,'actualGamePlayerRouteCertified':False,
  'newGameColliders':0,'officialArt':0,'officialSlope2Meters':0,
  'GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
  'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
 with open(os.path.join(out_dir,'R15B_'+road+'_INDEPENDENT_REAL_IMAGE_ART_REJECT.json'),
           'w',encoding='utf8') as f:
  json.dump(result,f,indent=2,ensure_ascii=False)
 return result
if __name__=='__main__':
 def opt(k):
  assert k in sys.argv,k
  return sys.argv[sys.argv.index(k)+1]
 a=json.load(open(opt('--audit'),encoding='utf8'))
 r=compare(a,opt('--original'),opt('--trial'),opt('--out'))
 print('R15B_INDEPENDENT_ART_REJECT',r['road'],'CX',r['CXActualTriangleIntersectionPairs'],
  'B48',r['B48ActualTriangleIntersectionPairs'],
  'B51_721_AABB_WARNINGS',r['B51Conservative721TickEnvelopeWarnings'],
  'R15B_MEAN_VISIBLE',r['sourceSevenFrameMeanCityFirstHit'],
  '7_ORIGINAL_SOURCE_CAMERA_RGB_DIFF',r['pairedOriginalCameraImageAnyChannelDiff45'])

"""R15G/R15H strict independent original-source and original camera image gate.

Stage G proves three different source XYZ and actual road proximity (NOT
structural support). Stage H checks true geometries, physical void, original
native first-hit and side-by-side original same-camera Blender stills.
"""
import json,sys,os,math,statistics,copy
from PIL import Image,ImageChops,ImageDraw
SOURCE='af076d67492a677d2235e4730aef8cdf4808e106'
PHASES=('EARLY','MIDDLE','LATE')
TIMES=('t1100','t1200','t1300','t1400','t1500','t1600','t1700')
ROADS=('true-pinch','pinch-switch')
def validate_sites(g):
 assert g['schema']=='dopagaki.r15g-distinct-three-camera-and-world-site-source-foundation-study/1'
 assert g['originalSourceCXBlob']==SOURCE
 assert g['R15FOriginalResearchSiteHypotheses']==336
 assert g['R15FOriginalCandidatesSourceClearAndMultiFrameVisible']==237
 assert g['sourceOriginalWorldsPhysicallyUnmodified'] and g['singleSharedWorldXYZForBothRoads']
 a=g['threeGenuinelyDistinctOriginalWorldSiteSelections']
 assert len(a)==3 and [x['phase'] for x in a]==list(PHASES)
 assert len({x['id'] for x in a})==3
 assert len({tuple(x['boxBottomCenterWorldXYZ']) for x in a})==3
 for i,x in enumerate(a):
  assert x['boxDimensionsMetres']==[76,64,84]
  assert x['relativeBottomHeightMetres']==18
  assert x['selectedOnlyOnceAcrossTemporalEras']
  assert not any(x[z] for z in ('actualOriginalSupportingRoadOrFoundationCertified','actualHumanIngressCertified','actualArtApproved'))
  assert len(x['sameOriginal13FrameMinBothWorldInteriorProbeCount'])==13
  for y in a[i+1:]:
   assert math.dist(x['boxBottomCenterWorldXYZ'],y['boxBottomCenterWorldXYZ'])>150
   assert x['boxBottomCenterWorldXYZ'][2]<y['boxBottomCenterWorldXYZ'][2]-100
 assert set(g['actualOriginalB48SourceProximityByRoadAndEra'])==set(ROADS)
 for road in ROADS:
  d=g['actualOriginalB48SourceProximityByRoadAndEra'][road]
  assert set(d)==set(PHASES)
  for phase in PHASES:
   r=d[phase]
   assert len(r['actualOriginalB48BelowNineProbeDistances'])==9
   assert r['originalB48DownwardSupportWitnessCount']==sum(x['originalB48VerticalSourceHitDistance'] is not None for x in r['actualOriginalB48BelowNineProbeDistances'])
   assert not r['realFoundationBuilt'] and not r['structureSupportedCertified']
   assert not r['pedestrianIngressFromOriginalB48Certified']
 assert not any(g[k] for k in ('actualBuildingSupportCertified','realPublicAccessCertified','realThreeBuildingArchitectureBuilt','originalWebGLActualGameRendered'))
 assert g['officialArt']==g['officialSlope2Meters']==g['newGameColliders']==0
 assert all(g[k]=='HOLD' for k in ('ART','GAMEPLAY','HUMAN','PERFORMANCE','INTEGRATION','RELEASE','MERGE'))
 return a
def validate_art(a,g):
 sites=validate_sites(g)
 assert a['schema']=='dopagaki.r15h-three-real-76m-original-camera-visible-sculpted-city-art/1'
 assert a['road'] in ROADS and a['originalSourceCXBlob']==SOURCE
 assert a['originalSourceWorldCX18B48_7B51_28Cameras5Unchanged']
 assert a['R15GThreeDistinctOriginalWorldCandidateCentersUsed']==[x['id'] for x in sites]
 assert a['actualEditablePrivateBlenderMeshCount']==18
 assert len(a['genuineMonumentalSculptureRealArchitectureStudy'])==3
 assert a['sourceCxB48RealTriangleIntersections']==[]
 assert a['allActualMeshVerticesConfinedToR15FPhysicalSafeVolumes']
 assert set(a['real3DSculptedMainVoidRayProbeByPhase'])==set(PHASES)
 assert all(v['mainVoidActuallyOpenToThisSourceRay'] and not v['newArchitectureHitsWithinOpenMainVoid'] for v in a['real3DSculptedMainVoidRayProbeByPhase'].values())
 assert len(a['originalSource13RealCameraFirstHit'])==13
 for v in a['originalSource13RealCameraFirstHit'].values():
  assert v['totalOriginalCameraRays']==228
  assert 0<=v['R15HOriginalSourceCameraFirstHitCount']<=228
  assert abs(v['R15HOriginalSourceCameraFirstHitFraction']-v['R15HOriginalSourceCameraFirstHitCount']/228)<.00002
 assert len(a['sevenOriginalCameraRenderedBlenderStillImages'])==7
 assert not any(a[k] for k in ('gameWebGLActuallyRendered','originalSourceGameEdited','realSourceLandmarkStructuralSupportsBuilt','originalGamePublicWalkwayConnected','originalGameplayJumpRecoveryValidated','trueHumanVisualArtApproval'))
 assert a['newGameColliders']==a['officialArt']==a['officialSlope2Meters']==0
 assert all(a[k]=='HOLD' for k in ('ART','GAMEPLAY','HUMAN','PERFORMANCE','INTEGRATION','RELEASE','MERGE'))
 return True
def image_diff(x,y):
 a=Image.open(x).convert('RGB')
 b=Image.open(y).convert('RGB')
 assert a.size==b.size and a.width>=800 and a.height>=500
 d=ImageChops.difference(a,b)
 return round(sum(max(p)>45 for p in d.getdata())/(a.width*a.height),5),a,b
def make_report(g,art,original,trial,out):
 validate_art(art,g)
 os.makedirs(out,exist_ok=True)
 road=art['road']
 contact=Image.new('RGB',(1040,len(TIMES)*326),(21,24,30))
 drawer=ImageDraw.Draw(contact)
 delta={}
 for i,t in enumerate(TIMES):
  x=os.path.join(original,'R1_'+road+'_'+t+'_TRUE_BLENDER_SOURCE_NOT_WEBGL.png')
  y=os.path.join(trial,'R15H_'+road+'_'+t+'_TRUE_ORIGINAL_CAMERA_BLENDER_NOT_WEBGL.png')
  assert os.path.exists(x) and os.path.exists(y)
  amount,a,b=image_diff(x,y)
  delta[t]=amount
  a.thumbnail((500,300));b.thumbnail((500,300))
  row=i*326
  drawer.text((8,row+3),'ORIGINAL R1: '+road+' '+t,fill=(230,234,238))
  drawer.text((525,row+3),'R15H sculpted source Blender: '+t,fill=(230,234,238))
  contact.paste(a,(8,row+24));contact.paste(b,(525,row+24))
 comparison='R15H_'+road+'_R1_VS_REAL_3D_ALL_7.jpg'
 contact.save(os.path.join(out,comparison),quality=90)
 fractions=[art['originalSource13RealCameraFirstHit'][t]['R15HOriginalSourceCameraFirstHitFraction'] for t in TIMES]
 mean=statistics.mean(fractions)
 # 8% average is only *minimum impact*, NEVER automatic ART approval.
 verdict='ART_REJECT_LOW_REAL_ORIGINAL_CAMERA_IMPACT' if mean<.08 else 'ART_HOLD_HUMAN_VISUAL_REVIEW'
 report={'schema':'dopagaki.r15h-independent-real-source-camera-3d-art-veto/1',
  'road':road,'originalSourceCXBlob':SOURCE,
  'originalActualNativeR1Camera7Comparison':comparison,
  'sevenImageLargeRGBDiffPixelsNotEqualActualBuildingPixelOccupancy':delta,
  'sevenSourceCameraVisibleNewGeometryFractions':dict(zip(TIMES,fractions)),
  'meanSourceCameraNewGeometryFirstHit':round(mean,5),
  'physicalOriginalCXB48Intersections':0,
  'real3DObjects':18,'realOpenVoidRayChecks':3,
  'independentTechnicalGeometryLogicalGate':'PASS',
  'independentArtVisualImpactDecision':verdict,
  'humanArtActuallyApproved':False,
  'sourceWebGLActuallyRendered':False,
  'structureSupportedAndRealHumanWalkwayCertified':False,
  'newGameColliders':0,'officialArt':0,'officialSlope2Meters':0,
  'ART':'REJECT' if verdict.startswith('ART_REJECT') else 'HOLD',
  'GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
  'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
 with open(os.path.join(out,'R15H_'+road+'_INDEPENDENT_SAME_R1_CAMERA_ART_GATE.json'),'w') as f:
  json.dump(report,f,ensure_ascii=False,indent=2)
 return report
if __name__=='__main__':
 def arg(k):
  assert k in sys.argv,k
  return sys.argv[sys.argv.index(k)+1]
 g=json.load(open(arg('--r15g'),encoding='utf8'))
 a=json.load(open(arg('--r15h'),encoding='utf8'))
 result=make_report(g,a,arg('--original'),arg('--trial'),arg('--out'))
 for name,fn in (
  ('ART_FAKED',lambda o:o.__setitem__('officialArt',1)),
  ('INTERSECTION_FAKED',lambda o:o.__setitem__('sourceCxB48RealTriangleIntersections',[['fake','CX',1]])),
  ('WEBGL_FAKED',lambda o:o.__setitem__('gameWebGLActuallyRendered',True)),
  ('VOID_FAKED',lambda o:o['real3DSculptedMainVoidRayProbeByPhase']['EARLY'].__setitem__('mainVoidActuallyOpenToThisSourceRay',False))):
  forged=copy.deepcopy(a);fn(forged)
  try:validate_art(forged,g)
  except (AssertionError,KeyError,ValueError,TypeError):pass
  else:raise AssertionError('R15H forged '+name+' passed QA')
 print('R15H_INDEPENDENT_TRUE_ORIGINAL_CAMERA_AND_VOID_ART_GATE',result['road'],
  'visibleOriginalSourceFirstHits',result['meanSourceCameraNewGeometryFirstHit'],
  'artResearch',result['independentArtVisualImpactDecision'],
  'NO HUMAN GAME OR ART CERTIFICATION',flush=True)

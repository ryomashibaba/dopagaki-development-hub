"""Independent R15F original camera-first spatial probe provenance audit.

No claim that 6 interior probe rays or source-safe axis box actually makes a
beautiful habitable monumental future city. No original browser WebGL ran.
"""
import json,sys,os,copy,math
SHA='af076d67492a677d2235e4730aef8cdf4808e106'
def validate(d):
 assert d['schema']=='dopagaki.r15f-source-two-road-camera-first-physical-landmark-site-hypotheses/1'
 assert d['originalSourceCXBlob']==SHA
 assert d['originalCX18B48_7B51_28Cameras5Unchanged']
 assert d['trueOriginal13SourceCameraFramesBothRoads']
 assert d['sourceOriginalAll28B51x721TickConservativeEnvelopeChecked']
 assert d['candidateOriginalWorldSitesTested']==336
 assert not d['originalGameCameraImagePixelFootprintActuallyMeasured']
 assert d['nativeScreenInteriorProbeVisibilityIsNotBuildingPixelArea']
 assert d['notAllOriginalSourceWorldSitesExplored']
 assert not any(d[k] for k in ('buildingFoundationAndIngressCertified',
  'monumentalFutureCityOrArtActualBuilt',
  'sourceHumanGameOriginalObstacleWarningTwoSecondsCertified',
  'trueWebGLBrowserGameEverRendered'))
 assert d['newGameColliders']==d['officialArt']==d['officialSlope2Meters']==0
 assert all(d[k]=='HOLD' for k in ('ART','GAMEPLAY','HUMAN','PERFORMANCE','INTEGRATION','RELEASE','MERGE'))
 assert set(d['candidatesPerRoadOriginalSourceStats'])=={'true-pinch','pinch-switch'}
 assert d['originalCandidateSiteCountRaw']==len(d['allSourceSafeAndSourceCameraVisibleCandidates'])
 assert len(d['allSourceSafeAndSourceCameraVisibleCandidates'])<=336
 assert set(d['topActualSharedCameraAndSourceVisibleSpatialSitesByEra'])=={'EARLY','MIDDLE','LATE'}
 keys={}
 for x in d['allSourceSafeAndSourceCameraVisibleCandidates']:
  assert x['id'] not in keys;keys[x['id']]=x
  assert len(x['boxBottomCenterWorldXYZ'])==3
  assert x['boxDimensionsMetres'] in ([42,42,58],[76,64,84],(42,42,58),(76,64,84))
  assert x['sourceOriginalWorldCXB48AndAllB51AABBClearBoth']
  assert x['originalSourceHazardCenterRayRetainedAt13Frames']
  assert x['notActualBrowserGameArtwork'] and not x['realMonumentalStructureBuilt']
  assert not x['realBuildingSupportCertified']
  assert len(x['sameOriginal13FrameMinBothWorldInteriorProbeCount'])==13
  assert all(isinstance(v,int) and 0<=v<=6 for v in x['sameOriginal13FrameMinBothWorldInteriorProbeCount'])
  assert x['bothRoadsSameFrameAtLeastTwoSourceClearInteriorPoints']==sum(
   q>=2 for q in x['sameOriginal13FrameMinBothWorldInteriorProbeCount'])
  assert x['bestSameOriginalFrameSixInteriorProbesVisible']==max(x['sameOriginal13FrameMinBothWorldInteriorProbeCount'])
  assert x['bothRoadsSameFrameAtLeastTwoSourceClearInteriorPoints']>=2
 for phase,sites in d['topActualSharedCameraAndSourceVisibleSpatialSitesByEra'].items():
  assert len(sites)<=5
  times={'EARLY':(0,2,4),'MIDDLE':(4,6,8),'LATE':(8,10,12)}[phase]
  # frame index 0=11.0 sec, 2=12.0,4=13.0,6=14.0...
  # NOTE: exact native R1 frames likely 0.5s; 13.0 is index4.
  for x in sites:
   assert x['id'] in keys
   assert x==keys[x['id']]
   assert sum(x['sameOriginal13FrameMinBothWorldInteriorProbeCount'][i]>=2 for i in times)>=2
  for i,a in enumerate(sites):
   for b in sites[i+1:]:
    assert math.dist(a['boxBottomCenterWorldXYZ'],b['boxBottomCenterWorldXYZ'])>=65-.01
 return {'schema':'dopagaki.r15f-independent-source-camera-world-space-provenance/1',
  'sourceOriginalBlob':SHA,'testedHypotheses':336,
  'sourceAndBothOriginalCameraRealCandidates':d['originalCandidateSiteCountRaw'],
  'selectedDistinctEraSites':{k:len(v) for k,v in d['topActualSharedCameraAndSourceVisibleSpatialSitesByEra'].items()},
  'noRealArchitectureBuilt':True,'noRealWebGLOrHumanARTApproval':True,
  'falsifiedGameOrArtClaimsRejected':True,
  'noOfficialArt':0,'noOfficialSlope2Meters':0,
  'ART':'HOLD','GAMEPLAY':'HOLD','HUMAN':'HOLD'}
if __name__=='__main__':
 def option(k):
  assert k in sys.argv,k
  return sys.argv[sys.argv.index(k)+1]
 d=json.load(open(option('--in'),encoding='utf8'))
 z=validate(d)
 for name,fn in [('art',lambda q:q.__setitem__('officialArt',1)),
  ('webgl',lambda q:q.__setitem__('trueWebGLBrowserGameEverRendered',True)),
  ('camera',lambda q:q.__setitem__('originalGameCameraImagePixelFootprintActuallyMeasured',True)),
  ('origin',lambda q:q.__setitem__('originalSourceCXBlob','faked'))]:
  fake=copy.deepcopy(d);fn(fake)
  try:validate(fake)
  except (AssertionError,KeyError,TypeError,ValueError):pass
  else:raise AssertionError('Falsified R15F '+name+' not rejected')
 p=option('--out');os.makedirs(os.path.dirname(p),exist_ok=True)
 with open(p,'w',encoding='utf8') as f:json.dump(z,f,indent=2,ensure_ascii=False)
 print('R15F_INDEPENDENT_REAL_SOURCE_CAMERA_FIRST_DOMAIN_GATE',z,'fake art + webgl + origin REJECTED')

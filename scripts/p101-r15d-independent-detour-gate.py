"""Fail-closed independent R15D original-world route-contract validator.

Rechecks A* path coordinates, source two-road per-edge proofs, clearance
dimensions, route geometry and no false ART/ingress/floor certification.
Does not pretend to re-run Blender mesh physics; source job does that.
"""
import json,sys,os,math,copy

SHA='af076d67492a677d2235e4730aef8cdf4808e106'
SPEC=(('E_M1','E03:R14B_REFERENCE','M01:R14B_REFERENCE'),
      ('M1_M2','M01:R14B_REFERENCE','M02:R14B_REFERENCE'),
      ('M2_L','M02:R14B_REFERENCE','L03:R14B_REFERENCE'),
      ('E_M2_ALT','E03:R14B_REFERENCE','M02:R14B_REFERENCE'))
def validate(d,source):
 assert d['schema']=='dopagaki.r15d-two-original-world-nonstraight-conservative-swept-a-star/1'
 assert d['sourceCXBlob']==source['sourceGameBlob']==SHA
 assert d['twoRoadsSameExactWorldCoordinates']
 assert d['sourceWorldOriginalCX18B48_7B51_28Cameras5Unchanged']
 assert d['originalB51All28Each721TickConservativeAABBChecked']
 assert d['R15CEligibleProvenSourceWorldSites']==source['bothVariantsEligibleCount']==16
 assert d['R15COriginalSourceWorldAuditedVolumeConditions']==source['R15CNewGeometryScaleTests']==66
 assert d['researchRequestedSizesMetres']==[8,12]
 assert [tuple(x) for x in d['researchSelectedBackboneOriginalSourceAnchors']]==list(SPEC)
 assert len(d['researchWorldNonStraightDetours4CandidatePairs'])==8
 assert not d['genuineGameArchitectureOrArtBuilt']
 assert not d['actualHumanWalkwayContinuousFloorCertified']
 assert not d['structuralSupportOrIngressCertified']
 assert not d['originalSource13CameraTrueWebGLVisibilityCertified']
 assert d['sweptAABBConservativeOverApproximationNotActualFineRouteMesh']
 assert d['sourceWorldGridBoundedNotGlobalImpossibilityProof']
 assert d['newGameColliders']==d['officialArt']==d['officialSlope2Meters']==0
 assert all(d[k]=='HOLD' for k in ('ART','GAMEPLAY','HUMAN','PERFORMANCE','INTEGRATION','RELEASE','MERGE'))
 eligible={x['id']:x for x in source['bothVariantsCameraAndSourceSafeTwoSecondEquivalentHazardNoObstructionEligible']}
 found=0; seen=set(); untested=0
 for entry in d['researchWorldNonStraightDetours4CandidatePairs']:
  key=(entry['pair'],entry['volumeWidthMetres'])
  assert key not in seen;seen.add(key)
  assert entry['pair'] in {x[0] for x in SPEC}
  expected=next(x for x in SPEC if x[0]==entry['pair'])
  assert entry['fromCandidate']==expected[1] and entry['toCandidate']==expected[2]
  assert entry['volumeWidthMetres'] in (8,12)
  assert entry['lateralOffsetLimitMetres']==84 and entry['verticalOffsetLimitMetres']==48
  a,b=eligible[entry['fromCandidate']],eligible[entry['toCandidate']]
  start=[a['worldXYZ'][i]+(a['volumeDimensionsMetres'][2]*.46 if i==1 else 0) for i in range(3)]
  end=[b['worldXYZ'][i]+(b['volumeDimensionsMetres'][2]*.46 if i==1 else 0) for i in range(3)]
  length=math.dist(start,end)
  assert abs(length-entry['sourceOriginalStraightDistanceMetres'])<.002
  n=entry['searchedOriginalWorldGridN']
  assert n==max(4,int(math.ceil(length/12)))
  assert entry['searchNodesTotalBounded']==(n+1)*15*9
  assert 0<=entry['nodesSafeInBothOriginalWorlds']<=entry['nodesActuallySourceInspected']<=entry['searchNodesTotalBounded']
  assert entry['startNodeSourceClearBoth'] and entry['endNodeSourceClearBoth']
  assert not entry['realHumanPublicWalkwayBuilt'] and not entry['actualStructuralSupportCertified']
  assert not entry['original13NativeCameraAllRouteSegmentsVisibleCertified']
  assert not entry['continuousTimeB51ContactCertified'] and not entry['trueBrowserWebGLGameTested']
  yes=entry['conservativeSWEPT_OriginalWorldSafeRouteExists']
  p=entry['routeWorldXYZ'];g=entry['routeGridNodes'];proof=entry['trueConservativeSweptProofEachEdge']
  if not yes:
   assert p==g==proof==[] and entry['sourceRouteLengthMetres'] is None
   untested+=1
   continue
  found+=1
  assert len(p)==len(g)>=2 and len(proof)==len(p)-1
  assert g[0]==[0,0,0] and g[-1]==[n,0,0]
  straight=[end[i]-start[i] for i in range(3)]
  mag=math.hypot(straight[0],straight[2])
  assert mag>10
  right=[-straight[2]/mag,0.,straight[0]/mag]
  expected_xyz=[]
  for t,j,k in g:
   assert all(isinstance(z,int) for z in (t,j,k))
   assert 0<=t<=n and -7<=j<=7 and -4<=k<=4
   xyz=[start[i]+(end[i]-start[i])*t/n+right[i]*12*j+(12*k if i==1 else 0) for i in range(3)]
   expected_xyz.append(xyz)
  for x,y in zip(p,expected_xyz):
   assert math.dist(x,y)<.003
  distance=0
  for i,z in enumerate(proof):
   d0=[g[i+1][j]-g[i][j] for j in range(3)]
   assert d0[0] in (0,1) and all(abs(d0[j])<=1 for j in (1,2))
   assert any(d0)
   assert z['fromGrid']==g[i] and z['toGrid']==g[i+1]
   assert z['researchAxisAlignedTubeWidthMetres']==entry['volumeWidthMetres']
   assert set(z['sourceTwoRoadsRealSweptAABB'])=={'true-pinch','pinch-switch'}
   for v in z['sourceTwoRoadsRealSweptAABB'].values():
    assert v['safe'] is True and v['type']=='CLEAR' and v['hits']==0
   distance+=math.dist(p[i],p[i+1])
  assert abs(distance-entry['sourceRouteLengthMetres'])<.003
  assert distance>=length-.003
 assert seen=={(x[0],w) for x in SPEC for w in (8,12)}
 assert d['allTwoRoadConservativeSourceSweptRoutesFound']==found
 return {
  'schema':'dopagaki.r15d-independent-nonstraight-swept-research-validator/1',
  'sourceCXBlob':SHA,'testedPairWidthCombinations':len(seen),
  'conservativeActualTwoRoadPaths':found,
  'boundedSourceSearchUnsuccessfulCombinations':untested,
  'originalSourceWorldGeometryVerifiedInBlenderByGeneratorNotThisValidator':True,
  'independentPathShapeAndTwoRoadProofLogicalContract':'PASS',
  'fakeArtPromotionRejected':True,'fabricatedPathRejected':True,
  'officialArt':0,'officialSlope2Meters':0,'newGameColliders':0,
  'ART':'HOLD','GAMEPLAY':'HOLD','HUMAN':'HOLD',
  'noProductionIntegration':True}
if __name__=='__main__':
 assert '--r15d' in sys.argv and '--r15c' in sys.argv and '--out' in sys.argv
 d=json.load(open(sys.argv[sys.argv.index('--r15d')+1],encoding='utf8'))
 source=json.load(open(sys.argv[sys.argv.index('--r15c')+1],encoding='utf8'))
 z=validate(d,source)
 tests=[
  ('false-art',lambda q:q.__setitem__('officialArt',1)),
  ('false-game',lambda q:q.__setitem__('genuineGameArchitectureOrArtBuilt',True)),
  ('false-proof',lambda q:q['researchWorldNonStraightDetours4CandidatePairs'][0].__setitem__('conservativeSWEPT_OriginalWorldSafeRouteExists',True)),
  ('false-source',lambda q:q.__setitem__('sourceCXBlob','bogus'))]
 for name,fn in tests:
  fake=copy.deepcopy(d);fn(fake)
  try:validate(fake,source)
  except (AssertionError,KeyError,TypeError,ValueError):pass
  else:raise AssertionError('Failed to reject tampering '+name)
 path=sys.argv[sys.argv.index('--out')+1]
 os.makedirs(os.path.dirname(path),exist_ok=True)
 with open(path,'w',encoding='utf8') as fd:json.dump(z,fd,indent=2,ensure_ascii=False)
 print('R15D_INDEPENDENT_SOURCE_ROUTE_GATE_PASS',z['testedPairWidthCombinations'],
  'true sweeps',z['conservativeActualTwoRoadPaths'],
  'bounded failures',z['boundedSourceSearchUnsuccessfulCombinations'],
  'fake ART/PATH/SOURCE REJECTED; not a game or human ART certification')

"""Independent fail-closed R15C audit of raw two-source Blender evidence.

No new 3D, no game changes, no accepting art because sample counts > 0.
Recomputes eligibility and sampled-link verdicts; negative tampering tests.
"""
import copy,json,sys,os,collections
SHA='af076d67492a677d2235e4730aef8cdf4808e106'
ROADS=('true-pinch','pinch-switch')
def validate(d):
 assert d['schema']=='dopagaki.r15c-both-original-native-source-safety-camera-macro-domain/1'
 assert d['sourceGameBlob']==SHA and d['sourceGameUnchanged'] is True
 assert (d['originalCX'],d['originalB48'],d['originalB51'],d['originalCameras'],d['physicsHz'])==(18,7,28,5,240)
 assert d['originalGap52'] and d['bothVariantsSameWorldXYZAndExactDimension']
 assert d['R15CProgressiveMacroVolumeOnlyNotActualArchitecture'] is True
 assert not d['genuineIntegratedCityArchitectureBuilt']
 assert not d['actualCityStructuralSupportCertified']
 assert not d['trueHumanIngressCertified']
 assert not d['trueSourceGameWebGLRendered']
 assert not d['actualGameObstacleWarningTwoSecondsCertified']
 assert not d['continuousTimeB51SafetyCertified']
 assert d['originalGameColliderChangeCount']==d['officialArt']==d['officialSlope2Meters']==0
 assert all(d[k]=='HOLD' for k in ('ART','GAMEPLAY','HUMAN','PERFORMANCE','INTEGRATION','RELEASE','MERGE'))
 assert d['sevenDiscreteStationsDoNotProveContinuous3DCorridor']
 results=d['R15COriginalSourceRoadResults']
 assert set(results)==set(ROADS)
 aa=results[ROADS[0]]['scannedSourceSafeDomains']
 bb=results[ROADS[1]]['scannedSourceSafeDomains']
 assert set(aa)==set(bb)
 assert len(aa)==d['R15CNewGeometryScaleTests']
 assert d['R14BOriginalSharedCandidateRowsIncludingRepeatedLocations']>=d['R14BProvenSharedSmallSitesReused']
 assert d['R14BProvenSharedUniqueSmallSitesReused']==d['R14BProvenSharedSmallSitesReused']
 assert len(aa)==d['R15CNewGeometryScaleTests']
 assert d['R15CRawUncollapsedScaleRows']==4*d['R14BProvenSharedSmallSitesReused']
 assert d['R15CIdenticalWorldAndSizeScaleRowsSuppressed']==d['R15CRawUncollapsedScaleRows']-len(aa)
 assert 0<=d['R15CIdenticalWorldAndSizeScaleRowsSuppressed']<len(aa)
 assert len(aa)>=36
 anchors=set(k.split(':')[0] for k in aa)
 assert len(anchors)==d['R14BProvenSharedSmallSitesReused']
 eligible=[]
 rejects=collections.Counter()
 for key in aa:
  a,b=aa[key],bb[key]
  for obj in (a,b):
   spec=obj['source']
   realclear=not(spec['sourceCXB48CollisionEvidence'] or
                  spec['all28B51_721TickBufferedEnvelopeWarnings'])
   assert spec['sourceStaticAndMoverConservativeClear']==realclear
   if not realclear:
    assert not obj['originalNative13FrameInteriorVisiblePointCounts']
    assert not obj['originalNative13FrameHazardCenterSightlineRisks']
   else:
    assert len(obj['originalNative13FrameInteriorVisiblePointCounts'])==13
    assert len(obj['originalNative13FrameHazardCenterSightlineRisks'])==13
    assert all(0<=v<=27 for v in obj['originalNative13FrameInteriorVisiblePointCounts'].values())
    assert obj['originalCameraTwoSecondEquivalentSourceHazardRayBlockedCount']==sum(
      len(x) for x in obj['originalNative13FrameHazardCenterSightlineRisks'].values())
  if not(a['source']['sourceStaticAndMoverConservativeClear'] and
         b['source']['sourceStaticAndMoverConservativeClear']):
   rejects['sourceUnsafeEitherRoad']+=1
   continue
  if (a['originalCameraTwoSecondEquivalentSourceHazardRayBlockedCount'] or
      b['originalCameraTwoSecondEquivalentSourceHazardRayBlockedCount']):
   rejects['sourceHazardLineRiskEitherRoad']+=1
   continue
  keys=sorted(a['originalNative13FrameInteriorVisiblePointCounts'].keys())
  assert keys==sorted(b['originalNative13FrameInteriorVisiblePointCounts'])
  sequence=[a['originalNative13FrameInteriorVisiblePointCounts'][t]>=3 and
            b['originalNative13FrameInteriorVisiblePointCounts'][t]>=3 for t in keys]
  run=0;best=0
  for yes in sequence:
   run=run+1 if yes else 0;best=max(best,run)
  if best<5:
   rejects['noTwoSecondsContinuousBothCameraInteriors']+=1
   continue
  eligible.append((key,best,tuple(t for t,yes in zip(keys,sequence) if yes)))
 claimed=d['bothVariantsCameraAndSourceSafeTwoSecondEquivalentHazardNoObstructionEligible']
 assert len(claimed)==d['bothVariantsEligibleCount']==len(eligible)
 assert {x['id'] for x in claimed}=={x[0] for x in eligible}
 # Historical time-index rows can point to the exact same 3D location;
 # fail closed if such duplicates are misrepresented as independent domains.
 assert len({(tuple(x['worldXYZ']),tuple(x['volumeDimensionsMetres'])) for x in claimed})==len(claimed)
 look={x[0]:x for x in eligible}
 for x in claimed:
  assert x['pairedOriginalCameraConsecutiveFrames']==look[x['id']][1]
  assert tuple(x['pairedOriginalCameraVisibleFrames'])==look[x['id']][2]
  assert x['originalCXB48TriangleEvidenceClearBoth'] and x['all28OriginalB51Conservative721TickAABBDoesNotOverlapBoth']
  assert x['originalSourceVisibleHazardCenterRayNotOccludedAt13SamplesBoth']
  assert not(x['realWorldStructuralSupportCertified'] or
             x['actualPedestrianIngressCertified'] or
             x['trueWebGLGameVisualQualityCertified'] or
             x['humanArtApproved'])
 assert dict(rejects)==d['sourceBothVariantsCandidateSummaryRejects']
 for road in ROADS:
  r=results[road]
  assert r['sourceGameBlob']==SHA
  assert r['sourceWorldOriginalCX18B48_7B51_28Cameras5Unchanged']
  assert r['originalR1NativeHalfSecondFrames']==13 and r['originalPhysicsHz']==240
  assert len(r['scannedSourceSafeDomains'])==len(aa)
 rr=results[ROADS[0]]['sampledLinks']
 ss=results[ROADS[1]]['sampledLinks']
 assert set(rr)==set(ss)
 assert len(rr)==d['linkCandidatePairsTested']
 joint=[]
 for key in rr:
  for v in (rr[key],ss[key]):
   assert len(v['sampleProbeDetails'])==7
   assert not v['realFloorSupportOrWalkableConnectivityCertified']
   flags=[not(p['sourceCXB48CollisionEvidence'] or
               p['all28B51_721TickBufferedEnvelopeWarnings'])
          for p in v['sampleProbeDetails']]
   assert v['sevenCrossSectionSamplesWithoutOriginalGeometryOrB51Envelope']==sum(flags)
   assert v['allSevenSourceSamplesClear']==all(flags)
  if rr[key]['allSevenSourceSamplesClear'] and ss[key]['allSevenSourceSamplesClear']:
   joint.append(key)
 assert {x['id'] for x in d['bothVariants7DiscreteStationClearCandidateLinks']}==set(joint)
 return {'schema':'dopagaki.r15c-independent-original-native-preart-negative-gate/1',
  'candidateScales':len(aa),'sharedOriginalAnchorSites':len(anchors),
  'derivedBothRoadSafetyCameraHazardConservativeEligible':len(eligible),
  'derivedLink7SamplesSafeButNotContinuous':len(joint),
  'rejected':dict(rejects),
  'sourceEvidenceLogicalIntegrity':'PASS',
  'ART':'HOLD','GAMEPLAY':'HOLD','HUMAN':'HOLD',
  'newGameColliders':0,'officialArt':0,'officialSlope2Meters':0,
  'cannotPromoteGeometryToPublicGame':True}
if __name__=='__main__':
 assert '--in' in sys.argv and '--out' in sys.argv
 d=json.load(open(sys.argv[sys.argv.index('--in')+1],encoding='utf8'))
 result=validate(d)
 for key,val in [('officialArt',1),('genuineIntegratedCityArchitectureBuilt',True),
                 ('trueSourceGameWebGLRendered',True),
                 ('actualGameObstacleWarningTwoSecondsCertified',True)]:
  fake=copy.deepcopy(d);fake[key]=val
  try:validate(fake)
  except (AssertionError,KeyError,ValueError):pass
  else:raise AssertionError('R15C rejected claim was falsely accepted: '+key)
 fake=copy.deepcopy(d)
 fake['bothVariantsCameraAndSourceSafeTwoSecondEquivalentHazardNoObstructionEligible'].append(
  {'id':'FABRICATED_E99','pairedOriginalCameraConsecutiveFrames':13})
 fake['bothVariantsEligibleCount']+=1
 try:validate(fake)
 except (AssertionError,KeyError,ValueError):pass
 else:raise AssertionError('R15C fabricated eligible site falsely accepted')
 fake=copy.deepcopy(d)
 first=next(iter(fake['R15COriginalSourceRoadResults']['true-pinch']['scannedSourceSafeDomains']))
 fake['R15COriginalSourceRoadResults']['true-pinch']['scannedSourceSafeDomains'][first]['source']['sourceStaticAndMoverConservativeClear']=not fake['R15COriginalSourceRoadResults']['true-pinch']['scannedSourceSafeDomains'][first]['source']['sourceStaticAndMoverConservativeClear']
 try:validate(fake)
 except (AssertionError,KeyError,ValueError):pass
 else:raise AssertionError('R15C fabricated physical clearance falsely accepted')
 out=sys.argv[sys.argv.index('--out')+1]
 os.makedirs(os.path.dirname(out),exist_ok=True)
 with open(out,'w',encoding='utf8') as f:json.dump(result,f,indent=2,ensure_ascii=False)
 print('R15C_INDEPENDENT_REAL_NATIVE_SOURCE_PROVENANCE_NEGATIVE_GATE',
  'source integrity PASS; faux art / forged site / forged clearance REJECTED',
  'screened',result['candidateScales'],'eligible',result['derivedBothRoadSafetyCameraHazardConservativeEligible'],
  'safe sampled links',result['derivedLink7SamplesSafeButNotContinuous'],'NO ART ADOPTION')

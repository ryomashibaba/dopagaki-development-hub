"""R14C — independent common-city-site evidence gate, no false city approval.
Uses EXACT same-world R14B native source-tested candidate, not nearest R14A
per-road entries; measures real separation/vertical travel for a city concept.
"""
import argparse,math,os,json,copy
SHA='af076d67492a677d2235e4730aef8cdf4808e106'
def verify(b,a_true,a_switch):
 assert b['schema']=='dopagaki.g4e7dz-r6d-r14b-two-real-roads-identical-world-source-city-site/1'
 assert b['sourceCXBlob']==SHA
 assert b['originalTrueAndSwitchCX18B48_7B51_28Cameras5Unchanged']
 assert b['actualOriginalGame13FrameAllMovingAndCameraData']
 assert a_true['schema']==a_switch['schema']=='dopagaki.g4e7dz-r6d-r14a-original-same-time-play-camera-source-volume/1'
 assert a_true['sourceCXBlob']==a_switch['sourceCXBlob']==SHA
 assert a_true['road']=='true-pinch' and a_switch['road']=='pinch-switch'
 assert not b['commonCityPhysicalAndCameraSiteAlreadyBuilt']
 assert not b['commonSiteSourceLoadBearingAndPlayerIngressCertified']
 original=b['bothOriginalRoadSameCoordinatesConfirmedPerPhase']
 assert set(original)=={'EARLY','MIDDLE','LATE'}
 # Cross-verify each identical-world candidate against BOTH source road
 # audit entries so a forged "bestSharedSite" summary cannot pass.
 srcTrue=b['bothRoadAllCandidateAudit']['true-pinch']
 srcSwitch=b['bothRoadAllCandidateAudit']['pinch-switch']
 verified={}
 for phase,data in original.items():
  matches=[]
  for candidate in data['topAllVerifiedRealSharedSites']:
   coordinate=candidate['sharedOriginal3DWorldXYZ']
   ident=candidate['trueOriginalFrame']
   dims=candidate['commonPhysicalBoxMetres']
   assert candidate['bothActualRoadVariantsSourceVolumeClear']
   assert candidate['notAnActualBuiltPublicCity']
   assert min(candidate['bothSameFrameCameraIntoInteriorCount'])>=2
   assert len(coordinate)==3 and dims in ([32,36,36],[20,24,26])
   for full in (srcTrue,srcSwitch):
    audit=[q for q in full if q['phase']==phase
       and math.dist(q['realCommonXYZ'],coordinate)<.002
       and q['sourceResearchPhysicalSize']==dims
       and abs(q['sameTimeSeconds']-ident)<.01]
    assert audit,('MISSING_ORIGINAL_SOURCE_BVH_EVIDENCE',phase,coordinate)
    assert any(q['originalWorldCommon3DVolumeClear']
        and q['originalSameFrameVisibleInsideThreeLevels']>=2
        and not q['srcGameOriginalB51_721AabbOverlapIds']
        and not q['sourceGameCXB48ExactTriangleOverlaps'] for q in audit)
   matches.append(candidate)
  assert data['actuallySafeCommonNativeWorldSites']>=len(matches)
  if data['actuallySafeCommonNativeWorldSites']<=10:
   assert len(matches)==data['actuallySafeCommonNativeWorldSites']
  verified[phase]=matches
 chosen={phase:(v[0] if v else None) for phase,v in verified.items()}
 # One option per time phase is not yet one CITY. No inferred material
 # structure, no safe continuous people walkway between these points.
 gap=[]
 for phase1,phase2 in (('EARLY','MIDDLE'),('MIDDLE','LATE')):
  u,v=verified[phase1],verified[phase2]
  pair=None
  for aa in u:
   for bb in v:
    distance=math.dist(aa['sharedOriginal3DWorldXYZ'],bb['sharedOriginal3DWorldXYZ'])
    if pair is None or distance<pair[0]:
     pair=(distance,aa,bb)
  if pair:
   dis,x,y=pair
   rise=abs(x['sharedOriginal3DWorldXYZ'][1]-y['sharedOriginal3DWorldXYZ'][1])
   flat=math.hypot(x['sharedOriginal3DWorldXYZ'][0]-y['sharedOriginal3DWorldXYZ'][0],
                    x['sharedOriginal3DWorldXYZ'][2]-y['sharedOriginal3DWorldXYZ'][2])
   gap.append({'earlierPhase':phase1,'laterPhase':phase2,
     'closestGenuinelyVerifiedCommonSiteWorld3DDistance':round(dis,4),
     'research3DHeightDifference':round(rise,4),
     'researchPlanarDistance':round(flat,4),
     'research9PctGradeMinimumHorizontalRun':round(rise/.09,4),
     'bothOriginalRoadsContinuousCXB48B51FullLinkTested':False,
     'realSupportAndWalkabilityApproved':False,
     'firstSite':x['sharedOriginal3DWorldXYZ'],'secondSite':y['sharedOriginal3DWorldXYZ']})
  else:
   gap.append({'earlierPhase':phase1,'laterPhase':phase2,
    'closestGenuinelyVerifiedCommonSiteWorld3DDistance':None,
    'bothOriginalRoadsContinuousCXB48B51FullLinkTested':False,
    'realSupportAndWalkabilityApproved':False})
 phases=sum(bool(x) for x in chosen.values())
 # Actual art remains a future challenge even for a common safe site.
 decision='SOURCE_BOTH_ROADS_SAME_TIME_COMMON_CITY_SITES_PROVEN_BUT_NO_LINKS_OR_ART' if phases else 'STOP_NO_GENUINELY_SHARED_ORIGINAL_SITE_PROVEN'
 return {'schema':'dopagaki.g4e7dz-r6d-r14c-independent-same-city-source-preart/1',
  'sourceCXBlob':SHA,
  'bothOriginalSourceVariantIdenticalWorldCXB48B51Protected':True,
  'sourceCameraOriginal13FrameAndPlayerAligned':True,
  'phasesWithGenuinelySharedPhysicalAndSameCameraSites':phases,
  'phaseCommonSourceCandidateCounts':{k:len(v) for k,v in verified.items()},
  'phaseBestTrueCommonSite':chosen,
  'originalThreeEraSiteProximityAudits':gap,
  'twoRoadVariantsHaveActualContiguousCityFootpath':False,
  'currentOriginalHumanEntranceAndStructuralLoadingCertified':False,
  'originalGameWebGLArtEverRenderedThisPhase':False,
  'actualNewPrivateCityArtBlenderMeshes':0,
  'nextStep':'ONE_SELECTED_SHARED_SITE_SINGLE_BEAUTIFUL_ACTUAL_INTERIOR_SECTION_AND_NINE_TO_SEVENTEEN_SECOND_NATIVE_RENDER_ONLY_IF_REAL_SCALE_CAN_READ',
  'decision':decision,'originalGameChanged':False,
  'newGameColliders':0,'officialArt':0,'officialSlope2Metres':0,
  'ART':'HOLD','GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
  'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
def main():
 p=argparse.ArgumentParser()
 for name in ('r14b','r14a-true','r14a-switch','out'):p.add_argument('--'+name,required=True)
 opts=p.parse_args()
 d=verify(json.load(open(opts.r14b)),json.load(open(opts.r14a_true)),json.load(open(opts.r14a_switch)))
 os.makedirs(os.path.dirname(opts.out),exist_ok=True)
 with open(opts.out,'w',encoding='utf8') as f:json.dump(d,f,indent=2,ensure_ascii=False)
 print('R14C_TRUE_SOURCE_CROSS_ROAD_RESEARCH',d['phaseCommonSourceCandidateCounts'],
  'near',d['originalThreeEraSiteProximityAudits'],'decision',d['decision'],'ART HOLD')
if __name__=='__main__':main()

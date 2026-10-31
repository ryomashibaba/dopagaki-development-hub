"""R6D-R7C: independent fail-fast evidence gate, not a gameplay or ART approval.
Consumes REAL R7 and R7B audits, rejects unconnected or invisible architecture.
Design for future reuse: art can NEVER be automatically promoted by this gate.
"""
import argparse,collections,json,os
def check(r7,r7b,pixel):
 assert r7['schema']=='dopagaki.g4e7dz-r6d-r7-true-volume-court-city/1'
 assert r7b['schema']=='dopagaki.g4e7dz-r6d-r7b-independent-falsification/1'
 assert pixel['schema']=='dopagaki.g4e7dz-r6d-r7b-independent-source-image-parity/1'
 road=r7['road']
 assert r7b['road']==road
 assert r7['sourceCXBlob']==r7b['sourceCXBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
 entry=next(x for x in pixel['results'] if x['road']==road)
 assert (r7['sourceCX'],r7['sourceB48'],r7['sourceB51'],r7['sourceCameras'])==(18,7,28,5)
 assert r7['newGameColliders']==r7['officialArt']==r7['officialSlope2Meters']==0
 assert r7b['newGameColliders']==r7b['officialArt']==r7b['officialSlope2Meters']==0
 assert r7['sourceProtected'] and r7b['sourceProtected'] and not r7['sourceGameChanged']
 groups=collections.defaultdict(list)
 for r in r7b['rampEndpointContactEvidence']:
  assert ' level ' in r['ramp'] and ' flight ' in r['ramp']
  key=r['ramp'].split(' flight ')[0]
  groups[key].append(r)
 assert len(groups)==8 and all(len(xs)==4 for xs in groups.values())
 # 1m tolerance deliberately exceeds the 0.3m proximity from beam midplanes.
 # It still exposes ACTUAL missing entry 7m and exit 10m in all eight routes.
 def near(end,tol=1):
  return end['closestGalleryDistanceMetres']<=tol
 chains={}
 for key,sections in groups.items():
  worst=max(end['closestGalleryDistanceMetres'] for part in sections for end in part['endpoints'])
  closestFailures=sum(not near(end) for part in sections for end in part['endpoints'])
  chains[key]={'fourFlights':len(sections),'allEndpointsWithin1m':closestFailures==0,
   'endpointCountOver1m':closestFailures,'worstEndpointGapMetres':worst}
 realVoid=all(d['realOpenSky85m'] for d in r7['realSourceMeshSkyVoidRayChecks'])
 originalRoadClear=len(r7['newR7ExactB48TriangleIntersections'])==0
 frameB51clear=all(not x for x in r7['newR7Actual13SourcePoseB51TriangleIntersections'].values())
 sampledB51clear=len(r7['newR7All28B51_721TickConservativeAabbWarnings'])==0
 visible17=r7b['genuineVisibleVoidTargetsByFrame']['t1700']
 early=tuple(r7['sevenRealSourceCameraCoarseFirstHit'][t]['R7_fraction'] for t in ('t1100','t1200','t1300'))
 # The 10% measure is a research diagnostic, not a requirement for all art.
 firstHitVisualDiagnostic={'early11to13':early,
   'earlySourceCamerasWithAtLeast10PercentNewCity':sum(x>=.1 for x in early),
   'late17NewCityFraction':r7['sevenRealSourceCameraCoarseFirstHit']['t1700']['R7_fraction'],
   'native17UnoccludedVoidTargets':visible17,
   'sourceR1VsR7PixelDifferenceOver45RGB':entry['actualBlenderPerPixelChange45of255Fractions']}
 matchedSampleWitness=bool(originalRoadClear and frameB51clear and sampledB51clear)
 hasPhysicalCXAccessCertificate=False # Not produced by R7/R7B, cannot infer from triangles.
 allHumanRoutesReachGallery=all(x['allEndpointsWithin1m'] for x in chains.values())
 reasons=[]
 if not originalRoadClear:reasons.append('ORIGINAL_B48_TRIANGLE_CONFLICT')
 if not frameB51clear or not sampledB51clear:reasons.append('ORIGINAL_B51_SAMPLE_OVERLAP_WARNING')
 if not realVoid:reasons.append('COURTYARD_CORE_IS_NOT_OPEN_3D')
 if not allHumanRoutesReachGallery:reasons.append('INCOMPLETE_PEDESTRIAN_RAMP_CHAINS')
 if visible17==0:reasons.append('TRUE_CAMERA_17S_INTERIOR_VOID_UNSEEN')
 if not hasPhysicalCXAccessCertificate:reasons.append('NO_PROVEN_EXISTING_CX_PUBLIC_ACCESS')
 if not reasons:reasons.append('ART_REVIEW_AND_HUMAN_GAMEPLAY_STILL_REQUIRED')
 return {'schema':'dopagaki.g4e7dz-r6d-r7c-independent-evidence-gate/1',
  'road':road,'rootSourcePreserved':True,'R7SourcePhysicalRoadTriangleClear':originalRoadClear,
  'B51_13TrueSamplesTriangleClear':frameB51clear,
  'B51_All28_721TickSampleAabbClearNotContinuousCertified':sampledB51clear,
  'realR7SixSkyVoidsOpen':realVoid,'actualRoadAndB51SampleWitnessOnly':matchedSampleWitness,
  'actual32RampSegments':32,'completeFourFlightWalkingChains':sum(x['allEndpointsWithin1m'] for x in chains.values()),
  'plannedFourFlightWalkingChains':len(chains),'chainEndpointGapAudit':chains,
  'sourceCXHumanAccessCertificate':False,
  'independentSourceCameraInteriorVisibleAt17':visible17>0,
  'native17UnobstructedVoidTargets':visible17,
  'sourceFrameResearchVisibility':firstHitVisualDiagnostic,
  'R7_OriginalCXCollisionPairs':len(r7['newR7ExactCXTriangleIntersections']),
  'originalMovingContinuousTimeCertified':False,
  'R7OfficialCityArtAdopted':False,'R7RoadPlayableCertified':False,
  'prototypeBuildGate':'STOP' if reasons and reasons!=['ART_REVIEW_AND_HUMAN_GAMEPLAY_STILL_REQUIRED'] else 'REQUIRES_HUMAN_ART_REVIEW',
  'doNotDetailThisCandidate':True,
  'sourceReasons':reasons,
  'nextWork':'STOP_LOCAL_POLISH_REBUILD_THE_HUMAN_SPACE_GRAPH_AND_PLAYER_VIEW_BEFORE_MODELING',
  'ART':'REJECT_CANDIDATE_NOT_AUTOMATED_CERTIFICATION',
  'GAMEPLAY':'HOLD','HUMAN':'HOLD','INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD',
  'newGameColliders':0,'officialArt':0,'officialSlope2Meters':0}
def main():
 p=argparse.ArgumentParser()
 for arg in ('r7','r7b','pixels','out'):p.add_argument('--'+arg,required=True)
 args=p.parse_args()
 r7=json.load(open(args.r7));r7b=json.load(open(args.r7b));pixel=json.load(open(args.pixels))
 result=check(r7,r7b,pixel)
 os.makedirs(os.path.dirname(args.out),exist_ok=True)
 with open(args.out,'w') as out:json.dump(result,out,indent=2,ensure_ascii=False)
 print('R7C_INDEPENDENT_STOP_GATE',result['road'],'STOP?',result['prototypeBuildGate'],
  'four-flight-paths',result['completeFourFlightWalkingChains'],'of',result['plannedFourFlightWalkingChains'],
  '17s visible real void points',result['native17UnobstructedVoidTargets'],'reasons',result['sourceReasons'])
if __name__=='__main__':main()

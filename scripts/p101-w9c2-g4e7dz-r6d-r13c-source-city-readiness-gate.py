"""R13C independent source-backed go/no-go before manufacturing new urban art.

A 32m-wide volume sampled 37 times is NOT 32m-wide continuous certified
bridge / player path. Real original source floor, structural supports, human
gameplay access and source-camera art must be verified separately.
"""
import argparse,json,os,math,statistics
SHA='af076d67492a677d2235e4730aef8cdf4808e106'
def decide(a,b,native,older):
 assert a['schema']=='dopagaki.g4e7dz-r6d-r13a-genuine-3d-source-connected-corridor/1'
 assert b['schema']=='dopagaki.g4e7dz-r6d-r13b-true-original-expanded-3d-width-and-support/1'
 assert native['schema']=='dopagaki.g4e7dz-r6d-r1-original-early-native/1'
 assert older['schema']=='dopagaki.g4e7dz-r6d-r12c-source-image-independent-art/1'
 assert a['road']==b['road']==native['road']==older['road']
 assert all(d['sourceCXBlob']==SHA for d in (a,b,native,older))
 assert a['sourceCX18B48_7B51_28Cameras5Unchanged']
 assert b['sourceCX18B48_7B51_28Cameras5Unchanged']
 assert a['bounded8mEmptyCubeRouteExists']
 assert a['original3DSweptProbeQuarterMidThreeQuarter']
 assert not b['realPublicBridgeOrHumanWalkwayExists'] and not b['structuralSupportsBuiltAndCertified']
 assert b['R13AOriginalSource8mRouteWasGenuinelyClear']
 assert b['originalSource3DProbesAlongPath']>=30
 assert b['all28B51_721SampledAabbUsed']
 assert not a['sourceObjectOrGamePhysicsEdited'] and not b['originalGameSourceChanged']
 assert a['newBlenderCityMeshes']==b['newGameColliders']==0
 assert b['officialArt']==older['officialArt']==0
 assert len(native['frames'])==13 and len(a['routeOriginalSource13CameraVisibleCellCounts'])==13
 route=a['bounded8mClearCubeRouteSourcePathNodes']
 assert len(route)==10
 grades=a['routeSegmentMaximumVerticalRisePerHorizontalDistance']
 assert .15<grades<.25
 widths=b['real3DSafeWidthComparisons']
 assert [x['horizontalSourceVolumeWidthMetres'] for x in widths]==[8,12,16,24,32]
 assert all(x['3DVolumesSampledIncludingQuarterStep']==b['originalSource3DProbesAlongPath'] for x in widths)
 assert all(0<=x['originalWorldClearVolumes']<=x['3DVolumesSampledIncludingQuarterStep'] for x in widths)
 assert len(b['genuineOriginalSourceFloorDownwardProbes'])==len(route)
 assert b['existingFloorWithin12mSamples']==sum(int(p['realOriginalSourceFloorWithin12m']) for p in b['genuineOriginalSourceFloorDownwardProbes'])
 all32=widths[-1]['wholeSourcePolylineWideVolumeClear']
 # Non-exhaustive discrete probes: even 37/37 cannot certify a swept solid.
 # Verify original 13 real 240Hz trajectory proximity, not just distant
 # camera view. No mutation of native original source route.
 near=[]
 for frame in native['frames']:
  p=frame['playerPosition']
  planar=min(math.hypot(p[0]-node[0],p[2]-node[2]) for node in route)
  vertical=min(abs(p[1]-node[1]) for node in route)
  near.append({'frameId':frame['id'],'sourceTimeSeconds':frame['seconds'],
   'minimumPlanarDistancePlayerToResearchVoidMetres':round(planar,3),
   'minimumVerticalSeparationPlayerToResearchVoidMetres':round(vertical,3),
   'actualResearchVoidNodeCountFirstHitVisibleInOriginalSourceCamera':a['routeOriginalSource13CameraVisibleCellCounts'][frame['id']]})
 closest=min(near,key=lambda x:x['minimumPlanarDistancePlayerToResearchVoidMetres'])
 visibilityByPhase={
  'early11_13':sum(x['actualResearchVoidNodeCountFirstHitVisibleInOriginalSourceCamera'] for x in near if x['sourceTimeSeconds']<=13),
  'middle13_5_15_5':sum(x['actualResearchVoidNodeCountFirstHitVisibleInOriginalSourceCamera'] for x in near if 13<x['sourceTimeSeconds']<16),
  'late16_17':sum(x['actualResearchVoidNodeCountFirstHitVisibleInOriginalSourceCamera'] for x in near if x['sourceTimeSeconds']>=16)}
 # Internal research accessibility design target, not a citation of any
 # official public pedestrian-ramp regulation.
 researchTargetGrade=.09
 minExtraHorizontal=a['bounded8mClearCubeRouteMetres']*(grades/researchTargetGrade-1)
 # 3D segment length is not horizontal run. Instead use endpoint WORLD y
 # separation / 9% to compute minimum horizontal total, with no return
 # to code-exempt 'physical walkability' from this simple bound.
 rise=abs(route[-1][1]-route[0][1])
 endpointHorizontal=math.hypot(route[-1][0]-route[0][0],route[-1][2]-route[0][2])
 minResearchHorizontal=rise/researchTargetGrade
 direction='SOURCE_32M_WIDE_37_SAMPLED_PROBES_CLEAR_NEEDS_NEW_LOAD_PATH_AND_NATIVE_ART_REFRAME' if all32 else 'SOURCE_8M_GEOMETRY_ONLY_WIDENING_COLLIDES'
 return {'schema':'dopagaki.g4e7dz-r6d-r13c-real-source-art-and-floor-governance/1',
  'road':a['road'],'sourceCXBlob':SHA,
  'originalSourceCX18B48_7B51_28Cameras5Unchanged':True,
  'originalSourceCorridorMetres':a['bounded8mClearCubeRouteMetres'],
  'originalActual3DNodes':len(route),
  'nonExhaustiveSourceVolumesTested':b['originalSource3DProbesAlongPath'],
  'source32mWide20mHighOriginalPhysicalFreeProbes':widths[-1]['originalWorldClearVolumes'],
  'source32mWide20mHighAll37DiscreteProbesFree':all32,
  'completeContinuousTimeSweptVolumeCertified':False,
  'existingOriginalSourceFloorWithin12mSampleCount':b['existingFloorWithin12mSamples'],
  'allOriginalSourceFloorSamples':len(route),
  'actualOriginalPlayerTrajectoryDistanceEvidence':near,
  'closestPlayerPositionToVoidInNative13Frames':closest,
  'actualOriginalCameraVisibleNodeSumByPhase':visibilityByPhase,
  'oldR12BActualCameraLowCoverage7FrameMean':older['R12BMeanAllSeven'],
  'researchGradeActualOriginalPath':grades,
  'researchInternalTargetMaxGrade':researchTargetGrade,
  'endpointWorldAltitudeDifferenceMetres':round(rise,3),
  'endpointOriginalPlanarDistanceMetres':round(endpointHorizontal,3),
  'minimumHorizontalRouteFor9PctResearchGradeMetres':round(minResearchHorizontal,3),
  'requiredExtraHorizontalOverShortestAt9PctMetres':round(max(0,minResearchHorizontal-endpointHorizontal),3),
  'structuralOrGameFloorActualBuilt':False,
  'originalIngressPathActualBuilt':False,
  'originalB51ContinuousTimeSafetyCertified':False,
  'thisIsNotRealImageOfACompletedCity':True,
  'decision':direction,
  'nextQualityGate':'REAL_SOURCE_32M_CITY_COURT_ARCHITECTURE_AND_SUPPORT_DESIGN_WITH_ORIGINAL_CAMERA_PROJECTION_BEFORE_PROTOTYPE',
  'sourceGameChanged':False,'newCityMeshes':0,'newGameColliders':0,
  'officialArt':0,'officialSlope2Metres':0,
  'ART':'HOLD','GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
  'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
def main():
 p=argparse.ArgumentParser()
 for k in ('r13a','r13b','native','r12c','out'):p.add_argument('--'+k,required=True)
 q=p.parse_args()
 z=decide(*(json.load(open(getattr(q,k))) for k in ('r13a','r13b','native','r12c')))
 os.makedirs(os.path.dirname(q.out),exist_ok=True)
 with open(q.out,'w',encoding='utf8') as f:json.dump(z,f,ensure_ascii=False,indent=2)
 print('R13C_INDEPENDENT_SOURCE_STUDY',z['road'],
  '32m wide probes clear',z['source32mWide20mHighOriginalPhysicalFreeProbes'],'/',
   z['nonExhaustiveSourceVolumesTested'],
  'existing floor',z['existingOriginalSourceFloorWithin12mSampleCount'],
  'grade research extra horizontal',z['requiredExtraHorizontalOverShortestAt9PctMetres'],
  'closest real game player source frame',z['closestPlayerPositionToVoidInNative13Frames'],
  'decision',z['decision'])
if __name__=='__main__':main()

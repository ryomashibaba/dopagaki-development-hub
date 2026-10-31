"""R10C bounded research decision from genuine R10A/B data.

This gate does not claim all CX space is empty/full or no independent bridge
is ever feasible. It stops *these* investigated hypotheses, without
creating geometry or promoting art, gameplay, human or production status.
"""
import json,os,argparse
SOURCE='af076d67492a677d2235e4730aef8cdf4808e106'
def decide(a,b,r8e,r9d):
 assert a['schema']=='dopagaki.g4e7dz-r6d-r10a-real-source-contained-cx-void-survey/1'
 assert b['schema']=='dopagaki.g4e7dz-r6d-r10b-real-source-bridge-footing-grid/1'
 assert r8e['schema']=='dopagaki.g4e7dz-r6d-r8e-source-cx-early-6m-corridor/1'
 assert r9d['schema']=='dopagaki.g4e7dz-r6d-r9d-proven-source-volume-stop/1'
 assert len({a['road'],b['road'],r8e['road'],r9d['road']})==1
 assert all(z['sourceCXBlob']==SOURCE for z in (a,b,r8e,r9d))
 assert a['gridPositionsExamined']==486
 assert a['originalMeshesCompletelyUnchanged'] and b['originalSourceIdentityUnchanged']
 assert r8e['originalSourceCX18B48_7B51_28Unchanged'] and r9d['protectedOriginalSource']
 assert (a['sourceCX'],a['sourceB48'],a['sourceB51'],a['originalCameras'])==(18,7,28,5)
 assert (b['originalCX'],b['originalB48'],b['originalB51'],b['originalCameras'])==(18,7,28,5)
 assert len(b['realFootingStationSamples'])==b['bridgeDeckSupportStations']
 assert b['stationsWithGeometricSourceCxFootingB48B51SampleClear']<=b['bridgeDeckSupportStations']
 assert not a['entryFromExteriorPhysicallyProven'] and not a['exitWalkwayContinuityPhysicallyProven']
 assert not b['originalSourceFootingCapacityAndTrueLoadPathCertified']
 assert a['actualNewBlenderCityMeshes']==b['newBlenderMeshes']==0
 # R10A: each truly visible candidate must have existing floor, opposite
 # walls, no B48/CX mesh intersections and native frame visibility >=2.
 validRooms=[z for z in a['topTenOriginalSpatialVoids']
  if z['CxWallsOppositePairs']>=1 and z['originalFloorBelow']['type']=='CX'
  and z['b48CxRealMeshIntersectingNewVolume']==0
  and not z['B51All28x721SampleAabbWarnings']
  and len(z['actualSourceNativeCameraVisibleUnoccluded'])>=2]
 roomWithinScannedRegion=bool(validRooms and
    a['realNativeCameraVisibleEnclosedExistingCxVoidCandidates']>0)
 # R10B: all stations would still only be *proposals*; their foot-bearing
 # capacity, connections and swept mover dynamics are unproved.
 supportedProposal=all(x['bestGeometricalPotentialFooting'] is not None
     and not x['bestGeometricalPotentialFooting']['originalRoadB48PierIntersection']
     and not x['bestGeometricalPotentialFooting']['all28MovingB51_721TickPierEnvelopes']
     for x in b['realFootingStationSamples'])
 # Neither qualifies as a ready-to-build inhabited city.
 reasons=[]
 if not roomWithinScannedRegion:
  reasons.append('NO_VISIBLE_6X6X10_CX_WALLED_FLOOR_VOID_IN_486_SAMPLED_POSITIONS')
 if not supportedProposal:
  reasons.append('NO_CONTIGUOUS_CX_EXISTING_FOOTING_OPPORTUNITIES_FOR_THE_R8E_BRIDGE')
 if not b['terminalPublicDestinationSourceCxFootingPotential']:
  reasons.append('BRIDGE_PUBLIC_TERMINAL_HAS_NO_PROPOSED_EXISTING_CX_FOOTING')
 if r9d['decision']!='STOP_CURRENT_DIRECT_CX_FLOOR_CITY_MODEL_NO_GEOMETRIC_POCKET':
  reasons.append('PREVIOUS_VOLUMETRIC_FLOOR_REJECTION_EVIDENCE_CHANGED')
 reasons+=['EXISTING_CX_HUMAN_ENTRANCE_NOT_PROVED',
  'ACTUAL_CITY_STRUCTURE_AND_RELEVANT_GAME_ART_NOT_BUILT']
 verdict='STOP_BOTH_SPECIFIC_R10_HYPOTHESES_NO_REJECTED_ART_RECYCLE' if reasons else 'RESEARCH_STILL_NEEDS_HUMAN_VALIDATION'
 return {'schema':'dopagaki.g4e7dz-r6d-r10c-independent-provenance-design-veto/1',
 'road':a['road'],'originalCXBlob':SOURCE,
 'R10ASurveyScope':'two actual R9/R8 original CX anchor neighborhoods, 9x9 horizontal sample positions each and 3 elevations, 6x6x10m void',
 'R10AOriginalSourceSamples':a['gridPositionsExamined'],
 'R10AOriginalEnclosedEmptyCxVolumeCount':a['originalCxVoidEmptyRealMeshAndContainingOpposingWalls'],
 'R10AOriginalNativeCameraVisibleEmptyCxVolumeCount':a['realNativeCameraVisibleEnclosedExistingCxVoidCandidates'],
 'R10BOriginalCXFoundationStations':b['bridgeDeckSupportStations'],
 'R10BOriginalCxGeometricPotentialStations':b['stationsWithGeometricSourceCxFootingB48B51SampleClear'],
 'R10BOriginalEndpointCXFoundationOpportunity':b['terminalPublicDestinationSourceCxFootingPotential'],
 'R10BAllBridgeStationsSourceCxPotential':supportedProposal,
 'R8EGeometricShortBridgeCenterlineMetres':r8e['distancePlanMetres'],
 'R9DOriginalCxDirectPushInArtGate':r9d['decision'],
 'boundedSurveyCannotExcludeUnsampledOriginalCxVoids':True,
 'newStructuralFoundationEngineered':False,
 'originalHumanIngressAndContinuousWalkGraphProven':False,
 'visualArtCandidateAuthorized':False,
 'continuouslyMovingB51DynamicsVerified':False,
 'decision':verdict,'reasons':reasons,
 'nextDesignDirection':'REASSESS ORIGINAL GAME PLAYABILITY AND HUMAN-SCALE ARCHITECTURAL SECTION BEFORE ANY MORE CITY PROPS',
 'newGameOrResearchMeshes':0,'newGameColliders':0,
 'officialArt':0,'officialSlope2Meters':0,
 'ART':'HOLD','GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
 'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
def main():
 parser=argparse.ArgumentParser()
 for k in ('r10a','r10b','r8e','r9d','out'):
  parser.add_argument('--'+k,required=True)
 q=parser.parse_args()
 x=decide(*(json.load(open(getattr(q,k))) for k in ('r10a','r10b','r8e','r9d')))
 os.makedirs(os.path.dirname(q.out),exist_ok=True)
 with open(q.out,'w') as f:json.dump(x,f,ensure_ascii=False,indent=2)
 print('R10C_BOUND_SOURCE_DECISION',x['road'],x['decision'],
  'enclosed',x['R10AOriginalEnclosedEmptyCxVolumeCount'],
  'possible-piers',x['R10BOriginalCxGeometricPotentialStations'],
  'of',x['R10BOriginalCXFoundationStations'])
if __name__=='__main__':main()

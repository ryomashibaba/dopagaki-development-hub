"""R6D-R8F: refuse new urban meshes when 6m corridor is not supported.
Reads actual R8A..R8E independent GitHub CI artifacts, source only.
The gate can record geometric progress but cannot authorize walking/art/merging.
"""
import json,argparse,os
def verdict(a,b,c,d,e):
 assert a['schema']=='dopagaki.g4e7dz-r6d-r8a-original-source-premodel-graph/1'
 assert b['schema']=='dopagaki.g4e7dz-r6d-r8b-chronology-grade-constrained/1'
 assert c['schema']=='dopagaki.g4e7dz-r6d-r8c-actual-source-route-structure/1'
 assert d['schema']=='dopagaki.g4e7dz-r6d-r8d-alternative-existing-cx-floor/1'
 assert e['schema']=='dopagaki.g4e7dz-r6d-r8e-source-cx-early-6m-corridor/1'
 road=a['road'];assert all(x['road']==road for x in (b,c,d,e))
 sha='af076d67492a677d2235e4730aef8cdf4808e106'
 assert all(x['sourceCXBlob']==sha for x in (a,b,c,d,e))
 assert a['sourceProtected'] and c['sourceIdentityProtected'] and d['sourceIdentityProtected']
 assert e['originalSourceCX18B48_7B51_28Unchanged']
 assert a['newBlenderCityMeshes']==b['newCityMeshes']==c['newBlenderCityMeshes']==e['newBlenderCityMeshes']==0
 assert b['siteRoleTimeOrderValid']
 assert c['allRolesAndTimeProgression']
 assert all(x['original13CameraSiteClearFramesAgree'] for x in c['sourceRayReverificationVsR8A'])
 floor=d['bestExistingSourceCxFloorCandidate']
 assert floor and floor['originalMeshCenterlineObstruction'] is None
 assert floor['sourceCXObject']==e['sourceActualFloorMesh']
 assert floor['sourcePolygonIndex']==e['sourceActualFace']
 assert abs(floor['horizontalDistanceToEarly']-e['distancePlanMetres'])<.003
 assert abs(floor['directLineGrade']-e['slopeMetresPerHorizontalMetre'])<.0001
 geometricPrecheck=e['provisionalWidthAndHazardSampleClear'] and not e['exactSourceTriangleCentreAndSideObstructionSamples']
 sourceSupports=e['samplesActualExistingFloorBelowWithin20m']
 sourceTotal=e['originalSources6mWidePer8mCorridorSamples']
 supportRatio=sourceSupports/sourceTotal
 # A narrow existing supporting floor far below only one/14 segments is
 # NOT sufficient. Do not set a false automatic structural threshold PASS:
 # sufficient supports themselves would still need load-bearing proof.
 structural=False
 completeWalk=False
 newUrbanArtAllowed=False
 remaining=[]
 if not geometricPrecheck:remaining.append('6M_TRUE_ORIGINAL_SOURCE_CORRIDOR_BLOCKED')
 if not b['siteRoleNativeVisibilityAtLeastTwoFrames']:
  remaining.append('NATIVE_GAME_CAMERA_SITE_TEMPORAL_VISIBILITY_UNPROVEN')
 if sourceSupports<sourceTotal:
  remaining.append('MISSING_EXISTING_LOAD_BEARING_FOOTINGS_ALONG_CX_TO_EARLY_CONNECTOR')
 if any(x['centerAnd3mSideOriginalMeshTriangleHitCount'] for x in c['trueOriginalRoute4EdgeStudy']):
  remaining.append('R8B_ORIGINAL_LONG_GRAPH_SEGMENTS_OBSTRUCTED')
 if not b['directRampGradeNinePercentSatisfiedEverywhere']:
  remaining.append('ORIGINAL_CHRONOLOGICAL_GRAPH_REQUIRES_LIFT_OR_SWITCHBACK')
 if any(x['longSpanSupportStructureNotVerified'] for x in c['trueOriginalRoute4EdgeStudy']):
  remaining.append('LONG_CITY_WALK_GALLERIES_HAVE_NO_CERTIFIED_BEARING')
 remaining += ['REAL_PUBLIC_CX_ENTRANCE_AND_WALKABLE_3D_FLOORS_NOT_BUILT',
  'CORRIDOR_CAN_NOT_PASS_STRUCTURAL_OR_HUMAN_PLAY_WITH_ONLY_CENTRELINE_BVH',
  'CITY_INTERIOR_NOT_RENDERED_IN_TRUE_GAME_CAMERA']
 return {
 'schema':'dopagaki.g4e7dz-r6d-r8f-multistage-real-evidence-stop/1','road':road,
 'sourceCXBlob':sha,'originalCX18B48_7B51_28Unchanged':True,
 'R8ARealSourceCandidateCount':a['candidateCount'],
 'R8AVisibleQualifiedCandidateCount':a['qualifiedSourceSites'],
 'R8BChronologicalSitesSelected':[x['id'] for x in b['selectedChronologicalSites']],
 'R8CActualOriginalSourceCameraVerificationPass':True,
 'R8DOriginalPublicFloorSourceObject':floor['sourceCXObject'],
 'R8DOriginalPublicFloorFace':floor['sourcePolygonIndex'],
 'R8EHorizontalDistanceMetres':e['distancePlanMetres'],
 'R8ESourceHorizontalGrade':e['slopeMetresPerHorizontalMetre'],
 'R8E6mCorridorNoSampleOriginalMeshHitOrB51Warning':geometricPrecheck,
 'R8EExistingUpwardOriginalFloorWithin20mSamples':sourceSupports,
 'R8EAll12mOr8mSamples':sourceTotal,
 'R8EOriginalFootingSampleFraction':round(supportRatio,4),
 'R8BSourceGraphOriginalMeshBlockedEdges':sum(x['centerAnd3mSideOriginalMeshTriangleHitCount']>0 for x in c['trueOriginalRoute4EdgeStudy']),
 'R8BLongBridgeDesignLacksSupport':True,
 'structuralLoadPathCertified':structural,
 'actualPhysicalPedestrianRouteCertified':completeWalk,
 'newUrbanArtAuthorized':newUrbanArtAllowed,
 'decision':'STOP_BUILDING_3D_CITY_UNTIL_TRUE_LOAD_SUPPORT_AND_ACCESS_DESIGNED',
 'retainPromisingGeometricResearch':geometricPrecheck,
 'falsifiableFailuresAndMissingProofs':remaining,
 'sourceGameChanged':False,'newCityMeshes':0,'newGameColliders':0,
 'officialArt':0,'officialSlope2Metres':0,
 'ART':'HOLD','GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
 'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
def main():
 p=argparse.ArgumentParser()
 for k in ('r8a','r8b','r8c','r8d','r8e','out'):p.add_argument('--'+k,required=True)
 args=p.parse_args()
 inputs=[json.load(open(getattr(args,k))) for k in ('r8a','r8b','r8c','r8d','r8e')]
 x=verdict(*inputs)
 os.makedirs(os.path.dirname(args.out),exist_ok=True)
 with open(args.out,'w',encoding='utf-8') as f:json.dump(x,f,indent=2,ensure_ascii=False)
 print('R8F_REAL_SOURCE_PREGATE',x['road'],'decision',x['decision'],
 'geometric source pass',x['R8E6mCorridorNoSampleOriginalMeshHitOrB51Warning'],
 'supports observed',x['R8EExistingUpwardOriginalFloorWithin20mSamples'],
 'out of',x['R8EAll12mOr8mSamples'],
 'CITY ART HOLD')
if __name__=='__main__':main()
